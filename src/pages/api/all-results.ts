// src/pages/api/all-results.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../lib/supabaseClient';
import type { Result } from '../../types';

/**
 * Generates a signed URL for a given bucket and file path.
 * @param bucket - The name of the storage bucket.
 * @param filePath - The relative path to the file within the bucket.
 * @param expiresIn - URL validity duration in seconds (default is 1 hour).
 * @returns A signed URL string or null if generation fails.
 */
const generateSignedUrl = async (
  bucket: string,
  filePath: string,
  expiresIn: number = 60 * 60 // 1 hour
): Promise<string | null> => {
  const { data, error } = await supabaseServer.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error || !data?.signedUrl) {
    console.error(`Error generating signed URL for ${bucket}/${filePath}:`, error);
    return null;
  }

  return data.signedUrl;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received ${req.method} request at /api/all-results`);

  if (req.method !== 'GET') {
    console.warn(`Method ${req.method} not allowed for /api/all-results`);
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Fetching all results from Supabase Database');
    const { data, error } = await supabaseServer
      .from('results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all results:', error);
      return res.status(500).json({ error: 'Error fetching results.' });
    }

    if (!data || data.length === 0) {
      console.warn('No data found in results.');
      return res.status(200).json([]); // Return empty array instead of error
    }

    // Generate signed URLs for each result
    const resultsWithSignedUrls = await Promise.all(
      data.map(async (result: Result) => {
        const { original_image_url, processed_image_url } = result;

        // Determine the correct bucket based on the image type
        // Assuming 'original_image_url' starts with 'original-' and stored in 'before-images'
        // and 'processed_image_url' starts with 'processed-' and stored in 'after-images'
        const isOriginal = original_image_url.startsWith('original-');
        const isProcessed = processed_image_url.startsWith('processed-');

        const originalBucket = 'before-images';
        const processedBucket = 'after-images';

        // Generate signed URLs
        const signedOriginalUrl = isOriginal
          ? await generateSignedUrl(originalBucket, original_image_url)
          : null;
        const signedProcessedUrl = isProcessed
          ? await generateSignedUrl(processedBucket, processed_image_url)
          : null;

        return {
          ...result,
          original_image_url: signedOriginalUrl || original_image_url, // Replace with signed URL
          processed_image_url: signedProcessedUrl || processed_image_url,
        };
      })
    );

    console.log(`Fetched ${resultsWithSignedUrls.length} results with signed URLs`);

    res.status(200).json(resultsWithSignedUrls);
  } catch (error: any) {
    console.error('Unexpected error in all-results handler:', error.message || error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
}
