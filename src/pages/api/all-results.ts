import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const cursor = Number(req.query.cursor) || 0;
  const limit = Number(req.query.limit) || 9;

  try {
    // Get database results first
    const { data, error, count } = await supabaseServer
      .from('results')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(cursor, cursor + limit - 1);

    if (error) throw error;
    if (!data?.length) {
      return res.status(200).json({ results: [], count: 0 });
    }

    // Generate signed URLs
    const resultsWithUrls = await Promise.all(
      data.map(async (result) => {
        try {
          // Extract just the filename from the stored URL
          const getFilename = (url: string) => {
            const parts = url.split('/');
            return parts[parts.length - 1].split('?')[0]; // Get last part and remove query params
          };

          const originalFilename = getFilename(result.original_image_url);
          const processedFilename = getFilename(result.processed_image_url);

          // Create new signed URLs
          const [originalUrlResponse, processedUrlResponse] = await Promise.all([
            supabaseServer.storage
              .from('before-images')
              .createSignedUrl(originalFilename, 3600),
            supabaseServer.storage
              .from('after-images')
              .createSignedUrl(processedFilename, 3600)
          ]);

          return {
            ...result,
            original_image_url: originalUrlResponse.data?.signedUrl || result.original_image_url,
            processed_image_url: processedUrlResponse.data?.signedUrl || result.processed_image_url
          };
        } catch (err) {
          console.error('Error processing result:', result.id, err);
          return result;
        }
      })
    );

    return res.status(200).json({
      results: resultsWithUrls,
      count,
      nextCursor: cursor + limit < (count || 0) ? cursor + limit : null
    });

  } catch (err) {
    console.error('Error in API handler:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
