import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../lib/supabaseClient'; // Ensure this is correctly configured
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

// API Configuration: Increase the body size limit to handle large payloads if necessary
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust as needed
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
  // Upload the file to Supabase Storage
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

  // Generate a signed URL for accessing the uploaded file
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
  try {
    if (req.method !== 'POST') {
      console.warn(`Method ${req.method} not allowed`);
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Validate Content-Length to prevent oversized uploads
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 10 * 1024 * 1024) { // 10MB in bytes
      return res.status(413).json({
        error: 'File too large. Maximum size is 10MB.'
      });
    }

    // Destructure and validate required fields
    const { original_image_base64, processed_image_base64, countedVials, percentage } = req.body as {
      original_image_base64: string;
      processed_image_base64: string;
      countedVials: number;
      percentage: number;
    };

    if (!original_image_base64 || !processed_image_base64) {
      console.warn('Missing image data');
      return res.status(400).json({ error: 'Missing image data' });
    }

    // Convert Base64 Data URLs to Buffers
    let originalBuffer: Buffer;
    let processedBuffer: Buffer;
    try {
      originalBuffer = base64DataUrlToBuffer(original_image_base64);
      processedBuffer = base64DataUrlToBuffer(processed_image_base64);
    } catch (conversionError) {
      console.error('Base64 conversion error:', conversionError);
      return res.status(400).json({ error: 'Invalid image data format.' });
    }

    // Determine MIME type (assuming JPEG; adjust if necessary)
    const mimeType = 'image/jpeg';

    // Generate unique filenames using UUID to prevent collisions
    const originalFilename = `original-${uuidv4()}.jpg`;
    const processedFilename = `processed-${uuidv4()}.jpg`;

    // Upload images to Supabase Storage
    const originalImageUrl = await uploadToSupabase(
      'before-images', // Ensure this bucket exists in Supabase
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
        approved: true, // Ensure your 'results' table has an 'approved' column
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
    console.error('Unexpected error in /api/save-result:', error.message || error);
    res.status(500).json({ error: 'An unexpected error occurred.', details: error.message || 'Unknown error' });
  }
}