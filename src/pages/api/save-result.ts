// src/pages/api/save-result.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

/**
 * Converts Base64 string to Buffer.
 */
const base64ToBuffer = (base64: string): Buffer => {
  return Buffer.from(base64, 'base64');
};

/**
 * Uploads a Buffer to Supabase and returns the signed URL.
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
    });

  if (error || !data) {
    console.error(`Supabase upload error for ${bucket}/${filename}:`, error);
    return null;
  }

  // Generate signed URL
  const { data: signedData, error: signedError } = await supabaseServer.storage
    .from(bucket)
    .createSignedUrl(data.path, expiresIn);

  if (signedError || !signedData?.signedUrl) {
    console.error(`Signed URL error for ${bucket}/${filename}:`, signedError);
    return null;
  }

  return signedData.signedUrl;
};

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

    // Convert Base64 to Buffer
    const originalBuffer = base64ToBuffer(original_image_base64);
    const processedBuffer = base64ToBuffer(processed_image_base64);

    // Determine MIME type (assuming JPEG; adjust if necessary)
    const mimeType = 'image/jpeg';

    // Generate unique filenames
    const originalFilename = `original-${uuidv4()}.jpg`;
    const processedFilename = `processed-${uuidv4()}.jpg`;

    // Upload images to Supabase
    const originalImageUrl = await uploadToSupabase(
      'before-images',
      originalBuffer,
      originalFilename,
      mimeType
    );

    const processedImageUrl = await uploadToSupabase(
      'after-images',
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
        approved: true, // Assuming you have an 'approved' column
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
    console.error('Error in API handler:', error.message || error);
    res.status(500).json({ error: 'An error occurred while saving the result.', details: error.message || 'Unknown error' });
  }
}