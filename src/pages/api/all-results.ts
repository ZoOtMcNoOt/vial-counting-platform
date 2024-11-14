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
    const { data, error, count } = await supabaseServer
      .from('results')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(cursor, cursor + limit - 1);

    if (error) throw error;

    // Generate signed URLs in parallel
    const resultsWithUrls = await Promise.all(
      data.map(async (result) => {
        const [originalUrlResponse, processedUrlResponse] = await Promise.all([
          supabaseServer.storage
            .from('before-images')
            .createSignedUrl(result.original_image_url, 3600),
          supabaseServer.storage
            .from('after-images')
            .createSignedUrl(result.processed_image_url, 3600),
        ]);

        return {
          ...result,
          original_image_url: originalUrlResponse.data?.signedUrl || result.original_image_url,
          processed_image_url: processedUrlResponse.data?.signedUrl || result.processed_image_url,
        };
      })
    );

    const nextCursor = count && cursor + limit < count ? cursor + limit : null;

    res.status(200).json({
      results: resultsWithUrls,
      nextCursor,
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Error fetching results' });
  }
}
