import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '../../lib/supabaseClient';
import type { Result } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received ${req.method} request at /api/results`);

  if (req.method === 'GET') {
    const { user_id } = req.query;

    if (!user_id || typeof user_id !== 'string') {
      console.warn('Missing or invalid user_id');
      return res.status(400).json({ error: 'Missing or invalid user_id' });
    }

    try {
      console.log(`Fetching results for user_id: ${user_id}`);
      const { data, error } = await supabaseServer
        .from('results')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching results:', error);
        return res.status(500).json({ error: 'Error fetching results.' });
      }

      if (!data || data.length === 0) {
        console.error('No data found for the specified user.');
        return res.status(500).json({ error: 'No data found.' });
      }

      // Type assertion
      const results = data as Result[];
      console.log(`Fetched ${results.length} results for user_id: ${user_id}`);

      res.status(200).json(results);
    } catch (error: any) {
      console.error('Unexpected error in results handler:', error.message || error);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  } else {
    console.warn(`Method ${req.method} not allowed for /api/results`);
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
