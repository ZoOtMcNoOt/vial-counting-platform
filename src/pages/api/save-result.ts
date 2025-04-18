import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../lib/supabaseClient'; // Ensure this is correctly configured
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

/**
 * Converts a Base64 Data URL to a Buffer.
 * Strips the Data URL prefix before conversion.
 */
const base64DataUrlToBuffer = (dataUrl: string): Buffer => {
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid Data URL format.');
  }
  return Buffer.from(matches[2], 'base64');
};

/**
 * Uploads a Buffer to Supabase Storage and returns the signed URL.
 */
const uploadToSupabase = async (
  bucket: string,
  buffer: Buffer,
  filename: string,
  mimeType: string,
  expiresIn: number = 60 * 60 // 1 hour
): Promise<string | null> => {
  const { data, error } = await supabaseServer.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: false, // Prevent overwriting existing files
    });

  if (error || !data) {
    console.error(`Supabase upload error for ${bucket}/${filename}:`, error);
    return null;
  }

  const { data: signedData, error: signedError } = await supabaseServer.storage
    .from(bucket)
    .createSignedUrl(data.path, expiresIn);

  if (signedError || !signedData?.signedUrl) {
    console.error(`Signed URL error for ${bucket}/${filename}:`, signedError);
    return null;
  }

  return signedData.signedUrl;
};

/**
 * Main API Handler for Saving Results
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Received ${req.method} request at /api/save-result`);
  
  if (req.method !== 'POST') {
    console.warn(`Method ${req.method} not allowed`);
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      original_image_base64,
      processed_image_base64,
      countedVials,
      percentage,
      lot_id,
      order_number,
      tray_number,
    } = req.body as {
      original_image_base64: string;
      processed_image_base64: string;
      countedVials: number;
      percentage: number;
      lot_id: string;
      order_number: string;
      tray_number: string;
    };

    if (
      !original_image_base64 ||
      !processed_image_base64 ||
      !lot_id ||
      !order_number ||
      !tray_number
    ) {
      console.warn('Missing required fields:', {
        original_image_base64,
        processed_image_base64,
        lot_id,
        order_number,
        tray_number,
      });
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 10 * 1024 * 1024) { // 10MB in bytes
      return res.status(413).json({
        error: 'File too large. Maximum size is 10MB.'
      });
    }

    let originalBuffer: Buffer;
    let processedBuffer: Buffer;
    try {
      originalBuffer = base64DataUrlToBuffer(original_image_base64);
      processedBuffer = base64DataUrlToBuffer(processed_image_base64);
    } catch (conversionError) {
      console.error('Base64 conversion error:', conversionError);
      return res.status(400).json({ error: 'Invalid image data format.' });
    }

    const mimeType = 'image/jpeg';

    const originalFilename = `original-${uuidv4()}.jpg`;
    const processedFilename = `processed-${uuidv4()}.jpg`;

    const originalImageUrl = await uploadToSupabase(
      'before-images', 
      originalBuffer,
      originalFilename,
      mimeType
    );

    const processedImageUrl = await uploadToSupabase(
      'after-images', // Ensure this bucket exists in Supabase
      processedBuffer,
      processedFilename,
      mimeType
    );

    if (!originalImageUrl || !processedImageUrl) {
      return res.status(500).json({ error: 'Failed to upload images to storage.' });
    }

    // Insert the approved result into the database
    const { data, error: insertError } = await supabaseServer.from('results').insert([
      {
        original_image_url: originalImageUrl,
        processed_image_url: processedImageUrl,
        counted_vials: countedVials,
        percentage: percentage,
        lot_id: lot_id,
        order_number: order_number,
        tray_number: tray_number,
        approved: true,
      },
    ]).select();

    if (insertError) {
      console.error('Error inserting into Supabase:', insertError);
      return res.status(500).json({ error: 'Error saving results to the database.', details: insertError.message });
    }

    if (!data || data.length === 0) {
      console.error('Failed to retrieve inserted data.');
      return res.status(500).json({ error: 'Failed to retrieve inserted data.' });
    }

    const insertedResult = data[0];
    console.log('Result inserted successfully:', insertedResult);
    res.status(200).json(insertedResult);
  } catch (error: any) {
    console.error('Save Result error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}