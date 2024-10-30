// pages/api/process-image.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
<<<<<<< HEAD
import sharp from 'sharp'; // Import sharp for image processing

// Disable Next.js's default body parser to use formidable
=======
import sharp from 'sharp'; 

// disable Next.js's default body parser to use formidable
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
export const config = {
  api: {
    bodyParser: false,
  },
};

<<<<<<< HEAD
// Define separate upload directories for 'before' and 'after' images
const uploadDirBefore = path.join(process.cwd(), 'public', 'uploads', 'before');
const uploadDirAfter = path.join(process.cwd(), 'public', 'uploads', 'after');

// Ensure that both directories exist
=======
// define separate upload directories for 'before' and 'after' images
const uploadDirBefore = path.join(process.cwd(), 'public', 'uploads', 'before');
const uploadDirAfter = path.join(process.cwd(), 'public', 'uploads', 'after');

// ensure that both directories exist
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
[uploadDirBefore, uploadDirAfter].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

<<<<<<< HEAD
// Function to generate a timestamped filename
=======
// function to generate a timestamped filename
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
const generateTimestampedFilename = (originalName: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  return `${baseName}-${timestamp}${ext}`;
};

<<<<<<< HEAD
// Promise-based parser using formidable
const parseForm = async (req: NextApiRequest) => {
  const form = formidable({
    // Set upload directory to 'before' folder
=======
// promise-based parser using formidable
const parseForm = async (req: NextApiRequest) => {
  const form = formidable({
    // set upload directory to 'before' folder
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    uploadDir: uploadDirBefore,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filter: ({ mimetype }) => {
<<<<<<< HEAD
      // Accept only image files
=======
      // accept only image files
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
      return mimetype ? mimetype.startsWith('image/') : false;
    },
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing the form:', err);
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

<<<<<<< HEAD
// Image processing function to convert image to grayscale
=======
// image processing function to convert to grayscale
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
const processImage = async (
  filePath: string,
  expectedCount: number
): Promise<{
  originalImageUrl: string;
  imageUrl: string;
  countedVials: number;
  percentage: string;
}> => {
  try {
<<<<<<< HEAD
    // Simulate processing time (e.g., image analysis)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate counted vials ±10% of expected count
    const countedVials = Math.floor(expectedCount * (0.9 + Math.random() * 0.2));
    const percentage = ((countedVials / expectedCount) * 100).toFixed(2);

    // Rename the original file to include date and time
=======
    // simulate processing time (e.g., image analysis)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // generate counted vials ±10% of expected count
    const countedVials = Math.floor(expectedCount * (0.9 + Math.random() * 0.2));
    const percentage = ((countedVials / expectedCount) * 100).toFixed(2);

    // rename the original file to include date and time
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    const originalFilename = path.basename(filePath);
    const timestampedFilename = generateTimestampedFilename(originalFilename);
    const newFilePath = path.join(uploadDirBefore, timestampedFilename);
    fs.renameSync(filePath, newFilePath);

<<<<<<< HEAD
    // Define processed image filename and path
    const processedFilename = `processed-${timestampedFilename}`;
    const processedFilePath = path.join(uploadDirAfter, processedFilename);

    // Convert the image to grayscale using sharp
=======
    // define processed image filename and path
    const processedFilename = `processed-${timestampedFilename}`;
    const processedFilePath = path.join(uploadDirAfter, processedFilename);

    // convert the image to grayscale using sharp
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    await sharp(newFilePath)
      .grayscale() // Convert to grayscale
      .toFile(processedFilePath);

<<<<<<< HEAD
    // Construct the image URLs relative to the 'public' directory
=======
    // construct the image URLs relative to the 'public' directory
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    const imageUrl = `/uploads/after/${processedFilename}`;
    const originalImageUrl = `/uploads/before/${timestampedFilename}`;

    return {
      originalImageUrl,
      imageUrl,
      countedVials,
      percentage,
    };
  } catch (error) {
    console.error('Error processing the image:', error);
    throw error;
  }
};

// API Route Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);

<<<<<<< HEAD
    // Extract and validate 'expectedCount'
=======
    // extract and validate 'expectedCount'
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    const expectedCountField = fields.expectedCount;
    let expectedCount: number;

    if (Array.isArray(expectedCountField)) {
      expectedCount = parseInt(expectedCountField[0], 10);
    } else if (typeof expectedCountField === 'string') {
      expectedCount = parseInt(expectedCountField, 10);
    } else {
      return res.status(400).json({ error: 'Invalid expected count' });
    }

    if (isNaN(expectedCount) || expectedCount <= 0) {
      return res.status(400).json({ error: 'Expected count must be a positive number' });
    }

<<<<<<< HEAD
    // Extract and validate the uploaded image
=======
    // extract and validate the uploaded image
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    const imageFile = files.image;
    let image: File;

    if (Array.isArray(imageFile)) {
      image = imageFile[0];
    } else if (imageFile) {
      image = imageFile;
    } else {
      return res.status(400).json({ error: 'Missing image file' });
    }

<<<<<<< HEAD
    // Ensure the image file exists
=======
    // ensure the image file exists
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    if (!fs.existsSync(image.filepath)) {
      return res.status(400).json({ error: 'Uploaded image does not exist' });
    }

<<<<<<< HEAD
    // Process the image (convert to grayscale)
=======
    // process the image (convert to grayscale)
>>>>>>> 3079c15623a14fc75cd22cb7ecc600b04e708a04
    const result = await processImage(image.filepath, expectedCount);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'An error occurred while processing the image.' });
  }
}
