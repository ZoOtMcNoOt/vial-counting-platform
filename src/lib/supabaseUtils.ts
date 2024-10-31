import { supabaseServer } from './supabaseClient';

/**
 * Generates a signed URL for a given bucket and file path.
 * @param bucket - The name of the storage bucket.
 * @param filePath - The path to the file within the bucket.
 * @param expiresIn - URL validity duration in seconds (default is 1 hour).
 * @returns A signed URL string or null if generation fails.
 */
export const generateSignedUrl = async (
  bucket: string,
  filePath: string,
  expiresIn: number = 60 * 60
): Promise<string | null> => {
  const { data, error } = await supabaseServer.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error || !data?.signedUrl) {
    console.error('Error generating signed URL:', error);
    return null;
  }

  return data.signedUrl;
};
