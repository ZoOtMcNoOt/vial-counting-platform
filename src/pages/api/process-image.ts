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
import axios from 'axios';
import { supabaseServer } from '../../lib/supabaseClient';

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    maxDuration: 10,
  },
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
];

const parseForm = async (req: NextApiRequest) => {
  const uploadDir = os.tmpdir();
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      const form = formidable({
        multiples: false,
        uploadDir: uploadDir,
        keepExtensions: true,
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

  // For non-HEIC images, ensure JPEG format
  return await sharp(buffer)
    .jpeg({
      quality: 80,
      mozjpeg: true
    })
    .toBuffer();
};

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
      upsert: false,
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
 * Processes the uploaded image (e.g., converts to grayscale) and returns Base64.
 * @param filePath - The local file path of the image.
 * @param expectedCount - The expected number of vials.
 * @returns An object containing counted vials, percentage, and processed image Base64.
 */
const processImage = async (
  filePath: string,
  expectedCount: number
): Promise<{
  counted_vials: number;
  percentage: number;
  originalImageBase64: string;
  processedImageBase64: string;
}> => {
  console.log('Processing image...');

  // Read the file into a buffer
  const imageBuffer = await fs.readFile(filePath);

  // Convert to optimal format
  const optimizedBuffer = await convertToOptimalFormat(imageBuffer, mime.lookup(filePath) || '');

  // Convert to base64 for API
  const base64Image = optimizedBuffer.toString('base64');

  const response = await axios({
    method: "POST",
    url: "https://detect.roboflow.com/vial-counting-xthkt/10",
    params: {
      api_key: process.env.COMPUTER_VISION_API_KEY,
      format: 'image_and_json',
      stroke: 2,
      labels: false
    },
    data: base64Image,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.data) {
    throw new Error('No response data from Roboflow API');
  }

  const counted_vials = response.data.predictions?.length || 0;
  const percentage = parseFloat(((counted_vials / expectedCount) * 100).toFixed(2));

  // Add data URI prefix to base64 strings for proper image display
  const originalImageBase64 = `data:image/jpeg;base64,${base64Image}`;
  const processedImageBase64 = `data:image/jpeg;base64,${response.data.visualization || base64Image}`;

  return {
    counted_vials,
    percentage,
    originalImageBase64,
    processedImageBase64,
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

    if (isNaN(expectedCount) || expectedCount < 0) {
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

    try {
      await fs.access(image.filepath);
    } catch {
      console.error('Uploaded image does not exist');
      return res.status(400).json({ error: 'Uploaded image does not exist' });
    }

    const mimeType = mime.lookup(image.filepath) || '';

    console.log(`MIME type of uploaded file: ${mimeType}`);

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      console.warn('Unsupported image format');
      return res.status(400).json({ error: 'Only JPEG, PNG, HEIC, and HEIF images are allowed.' });
    }

    // Extract additional fields: lotId, orderNumber, trayNumber
    const lotIdField = fields.lotId;
    const orderNumberField = fields.orderNumber;
    const trayNumberField = fields.trayNumber;

    let lotId: string;
    let orderNumber: string;
    let trayNumber: string;

    if (Array.isArray(lotIdField)) {
      lotId = lotIdField[0];
    } else if (typeof lotIdField === 'string') {
      lotId = lotIdField;
    } else {
      lotId = '';
    }

    if (Array.isArray(orderNumberField)) {
      orderNumber = orderNumberField[0];
    } else if (typeof orderNumberField === 'string') {
      orderNumber = orderNumberField;
    } else {
      orderNumber = '';
    }

    if (Array.isArray(trayNumberField)) {
      trayNumber = trayNumberField[0];
    } else if (typeof trayNumberField === 'string') {
      trayNumber = trayNumberField;
    } else {
      trayNumber = '';
    }

    console.log(`Lot ID: ${lotId}, Order Number: ${orderNumber}, Tray Number: ${trayNumber}`);

    if (!lotId.trim()) {
      console.warn('Missing Lot ID');
      return res.status(400).json({ error: 'Missing Lot ID' });
    }

    if (!orderNumber.trim()) {
      console.warn('Missing Order Number');
      return res.status(400).json({ error: 'Missing Order Number' });
    }

    if (!trayNumber.trim()) {
      console.warn('Missing Tray Number');
      return res.status(400).json({ error: 'Missing Tray Number' });
    }

    const { counted_vials, percentage, originalImageBase64, processedImageBase64 } = await processImage(
      image.filepath,
      expectedCount
    );

    await deleteFile(image.filepath);
    console.log('Temporary files cleaned up.');

    res.status(200).json({
      original_image_base64: originalImageBase64,
      processed_image_base64: processedImageBase64,
      counted_vials,
      percentage,
      lot_id: lotId,
      order_number: orderNumber,
      tray_number: trayNumber,
    });

  } catch (error: any) {
    console.error('Error in API handler:', error.message || error);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'An error occurred while processing the image.', details: error.message || 'Unknown error' });
  }
}
