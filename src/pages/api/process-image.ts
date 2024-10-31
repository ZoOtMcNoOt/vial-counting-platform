// src/pages/api/process-image.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { supabaseServer } from '../../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import type { Result } from '../../types';

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

/**
 * Uploads a file to a specified Supabase bucket.
 * @param bucket - The name of the storage bucket.
 * @param filePath - The local file path.
 * @param filename - The desired filename in Supabase.
 * @returns The storage path of the uploaded file.
 */
const uploadToSupabase = async (
  bucket: string,
  filePath: string,
  filename: string
): Promise<string> => {
  console.log(`Uploading file to bucket "${bucket}" with filename "${filename}"`);
  const fileContent = fs.readFileSync(filePath);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';

  const { error: uploadError } = await supabaseServer.storage
    .from(bucket)
    .upload(filename, fileContent, {
      contentType: mimeType,
      upsert: true, // Overwrite if exists
    });

  if (uploadError) {
    console.error(`Error uploading to Supabase Storage:`, uploadError);
    throw uploadError;
  }

  // Return the storage path (e.g., 'original-uuid.jpg')
  return filename; // **Only the filename, not prefixed with bucket name**
};

/**
 * Generates a signed URL for a given bucket and file path.
 * @param bucket - The name of the storage bucket.
 * @param filePath - The path to the file within the bucket (relative path).
 * @param expiresIn - URL validity duration in seconds (default is 1 hour).
 * @returns A signed URL string or null if generation fails.
 */
const generateSignedUrl = async (
  bucket: string,
  filePath: string,
  expiresIn: number = 60 * 60
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

/**
 * Parses incoming form data using formidable.
 * @param req - The incoming Next.js API request.
 * @returns A promise resolving to the parsed fields and files.
 */
const parseForm = async (req: NextApiRequest) => {
  console.log('Parsing incoming form data');
  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), 'tmp'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filter: ({ mimetype }) => {
      return mimetype ? mimetype.startsWith('image/') : false;
    },
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing the form:', err);
          reject(err);
        } else {
          console.log('Form data parsed successfully');
          resolve({ fields, files });
        }
      });
    }
  );
};

/**
 * Processes the uploaded image (e.g., converts to grayscale).
 * @param filePath - The local file path of the image.
 * @param expectedCount - The expected number of vials.
 * @returns An object containing counted vials, percentage, and processed file path.
 */
const processImage = async (
  filePath: string,
  expectedCount: number
): Promise<{
  countedVials: number;
  percentage: string;
  processedFilePath: string;
}> => {
  console.log('Starting image processing');
  try {
    // Simulate processing time
    console.log('Simulating processing time');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate counted vials ±10% of expected count
    console.log('Generating counted vials');
    const countedVials = Math.floor(expectedCount * (0.9 + Math.random() * 0.2));
    const percentage = ((countedVials / expectedCount) * 100).toFixed(2);

    // Define processed image filename and path
    const processedFilename = `processed-${uuidv4()}.jpg`;
    const processedFilePath = path.join(process.cwd(), 'tmp', processedFilename);
    console.log(`Processed file will be saved as "${processedFilePath}"`);

    // Convert the image to grayscale using sharp
    console.log('Converting image to grayscale');
    await sharp(filePath).grayscale().toFile(processedFilePath);
    console.log('Image converted to grayscale successfully');

    return {
      countedVials,
      percentage,
      processedFilePath,
    };
  } catch (error) {
    console.error('Error processing the image:', error);
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Received ${req.method} request at /api/process-image`);

  if (req.method !== 'POST') {
    console.warn(`Method ${req.method} not allowed`);
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);

    // Extract and validate 'expectedCount'
    const expectedCountField = fields.expectedCount;
    let expectedCount: number;

    if (Array.isArray(expectedCountField)) {
      expectedCount = parseInt(expectedCountField[0], 10);
    } else if (typeof expectedCountField === 'string') {
      expectedCount = parseInt(expectedCountField, 10);
    } else {
      console.warn('Invalid expected count format');
      return res.status(400).json({ error: 'Invalid expected count' });
    }

    console.log(`Expected count: ${expectedCount}`);

    if (isNaN(expectedCount) || expectedCount <= 0) {
      console.warn('Expected count must be a positive number');
      return res.status(400).json({ error: 'Expected count must be a positive number' });
    }

    // Extract and validate the uploaded image
    const imageFile = files.image;
    let image: formidable.File;

    if (Array.isArray(imageFile)) {
      image = imageFile[0];
    } else if (imageFile) {
      image = imageFile;
    } else {
      console.warn('Missing image file');
      return res.status(400).json({ error: 'Missing image file' });
    }

    console.log(`Uploaded image file: ${image.originalFilename}`);

    // Ensure the image file exists
    if (!fs.existsSync(image.filepath)) {
      console.error('Uploaded image does not exist');
      return res.status(400).json({ error: 'Uploaded image does not exist' });
    }

    // Restrict to JPEG and PNG formats
    const mimeType = mime.lookup(image.filepath) || '';

    console.log(`MIME type of uploaded file: ${mimeType}`);

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      console.warn('Unsupported image format');
      return res.status(400).json({ error: 'Only JPEG and PNG images are allowed.' });
    }

    // Upload original image to Supabase Storage
    const originalFilename = `original-${uuidv4()}.jpg`;
    console.log('Uploading original image to Supabase');
    const originalImageFilename = await uploadToSupabase(
      'before-images',
      image.filepath,
      originalFilename
    );
    console.log(`Original image uploaded as ${originalImageFilename}`);

    // Process the image (convert to grayscale)
    console.log('Processing the image');
    const { countedVials, percentage, processedFilePath } = await processImage(
      image.filepath,
      expectedCount
    );

    // Upload processed image to Supabase Storage
    const processedFilename = `processed-${uuidv4()}.jpg`;
    console.log('Uploading processed image to Supabase');
    const processedImageFilename = await uploadToSupabase(
      'after-images',
      processedFilePath,
      processedFilename
    );
    console.log(`Processed image uploaded as ${processedImageFilename}`);

    // Save the result to Supabase Database
    console.log('Inserting result into Supabase Database');
    const { data, error: insertError } = await supabaseServer.from('results').insert([
      {
        original_image_url: originalImageFilename, // Storing only the filename
        processed_image_url: processedImageFilename, // Storing only the filename
        counted_vials: countedVials,
        percentage: parseFloat(percentage),
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

    // Type assertion to help TypeScript understand the type
    const insertedResult = data[0] as Result;
    console.log('Result inserted successfully:', insertedResult);

    // Generate signed URLs
    // **Important:** Pass only the filename (relative path within the bucket) to generateSignedUrl
    const signedOriginalUrl = await generateSignedUrl('before-images', insertedResult.original_image_url);
    const signedProcessedUrl = await generateSignedUrl('after-images', insertedResult.processed_image_url);

    // Clean up temporary files asynchronously
    fs.unlink(image.filepath, (err) => {
      if (err) console.error('Error deleting original file:', err);
      else console.log('Original temporary file deleted');
    });

    fs.unlink(processedFilePath, (err) => {
      if (err) console.error('Error deleting processed file:', err);
      else console.log('Processed temporary file deleted');
    });

    // Return the result with signed URLs
    res.status(200).json({
      ...insertedResult,
      original_image_url: signedOriginalUrl || insertedResult.original_image_url,
      processed_image_url: signedProcessedUrl || insertedResult.processed_image_url,
    });
  } catch (error: any) {
    console.error('Error in API handler:', error.message || error);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'An error occurred while processing the image.', details: error.message || 'Unknown error' });
  }
}
