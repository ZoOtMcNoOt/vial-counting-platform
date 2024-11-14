import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import os from 'os';
import type { Result } from '../../types';
import heicConvert from 'heic-convert';

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    // Increase size limit to 10MB
    maxDuration: 10,
  },
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/gif',
  'image/tiff',
  'image/heic',
  'image/heif'
];

const parseForm = async (req: NextApiRequest) => {
  const uploadDir = os.tmpdir();
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      const form = formidable({
        multiples: false,
        uploadDir: uploadDir,
        keepExtensions: true,
        // Increase file size limit to 10MB
        maxFileSize: 10 * 1024 * 1024, // 10MB
        filter: ({ mimetype }) => ALLOWED_MIME_TYPES.includes(mimetype || ''),
      });

      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    }
  );
};

// Add conversion function
const convertToOptimalFormat = async (buffer: Buffer, mimeType: string): Promise<Buffer> => {
  if (mimeType === 'image/heic' || mimeType === 'image/heif') {
    // Convert Buffer to ArrayBuffer for heic-convert
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
    
    const convertedBuffer = await heicConvert({
      buffer: arrayBuffer,
      format: 'JPEG',
      quality: 0.8
    });

    return Buffer.from(convertedBuffer);
  }

  return await sharp(buffer)
    .jpeg({
      quality: 80,
      mozjpeg: true
    })
    .toBuffer();
};

/**
 * Processes the uploaded image (e.g., converts to grayscale) and returns Base64.
 * @param filePath - The local file path of the image.
 * @param expectedCount - The expected number of vials.
 * @param mimeType - The MIME type of the image.
 * @returns An object containing counted vials, percentage, and processed image Base64.
 */
const processImage = async (
  filePath: string,
  expectedCount: number,
  mimeType: string
): Promise<{
  counted_vials: number;
  percentage: string;
  processedImageBase64: string;
  originalImageBase64: string;
}> => {
  console.log('Processing image...');

  // Read the file into a buffer
  const imageBuffer = await fs.readFile(filePath);

  // Convert to optimal format first
  const convertedBuffer = await convertToOptimalFormat(imageBuffer, mimeType);
  const originalImageBase64 = convertedBuffer.toString('base64');

  // Process the converted image
  const processedImageBuffer = await sharp(convertedBuffer)
    .grayscale()
    .jpeg({
      quality: 80,
      mozjpeg: true
    })
    .toBuffer();

  const processedImageBase64 = processedImageBuffer.toString('base64');

  // Simulate processing delay
  await new Promise((res) => setTimeout(res, 2000));

  const counted_vials = Math.floor(expectedCount * (0.9 + Math.random() * 0.2));
  const percentage = ((counted_vials / expectedCount) * 100).toFixed(2);

  return {
    counted_vials,
    percentage,
    processedImageBase64,
    originalImageBase64
  };
};

const retry = async (fn: () => Promise<void>, retries = 3, delayMs = 500) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await fn();
      return;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

const deleteFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
    console.log(`Deleted temporary file: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

interface ProcessedResult {
  processed_image_url: string;
  counted_vials: number;
  percentage: number;
  // Add other relevant fields
}

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
    try {
      await fs.access(image.filepath);
    } catch {
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

    // Process the image
    const { counted_vials, percentage, processedImageBase64, originalImageBase64 } = await processImage(
      image.filepath,
      expectedCount,
      mimeType
    );

    // Delete the temporary file
    await deleteFile(image.filepath);
    console.log('Temporary files cleaned up.');

    // Return the processed results to the frontend for approval
    res.status(200).json({
      original_image_base64: originalImageBase64,
      processed_image_base64: processedImageBase64,
      counted_vials,
      percentage: parseFloat(percentage),
    });

  } catch (error: any) {
    console.error('Error in API handler:', error.message || error);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'An error occurred while processing the image.', details: error.message || 'Unknown error' });
  }
}
