import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp'; 

// disable Next.js's default body parser to use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// define separate upload directories for 'before' and 'after' images
const uploadDirBefore = path.join(process.cwd(), 'public', 'uploads', 'before');
const uploadDirAfter = path.join(process.cwd(), 'public', 'uploads', 'after');

// ensure that both directories exist
[uploadDirBefore, uploadDirAfter].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// function to generate a timestamped filename
const generateTimestampedFilename = (originalName: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  return `${baseName}-${timestamp}${ext}`;
};

// promise-based parser using formidable
const parseForm = async (req: NextApiRequest) => {
  const form = formidable({
    // set upload directory to 'before' folder
    uploadDir: uploadDirBefore,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filter: ({ mimetype }) => {
      // accept only image files
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

// image processing function to convert to grayscale
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
    // simulate processing time (e.g., image analysis)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // generate counted vials ±10% of expected count
    const countedVials = Math.floor(expectedCount * (0.9 + Math.random() * 0.2));
    const percentage = ((countedVials / expectedCount) * 100).toFixed(2);

    // rename the original file to include date and time
    const originalFilename = path.basename(filePath);
    const timestampedFilename = generateTimestampedFilename(originalFilename);
    const newFilePath = path.join(uploadDirBefore, timestampedFilename);
    fs.renameSync(filePath, newFilePath);

    // define processed image filename and path
    const processedFilename = `processed-${timestampedFilename}`;
    const processedFilePath = path.join(uploadDirAfter, processedFilename);

    // convert the image to grayscale using sharp
    await sharp(newFilePath)
      .grayscale() // Convert to grayscale
      .toFile(processedFilePath);

    // construct the image URLs relative to the 'public' directory
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

    // extract and validate 'expectedCount'
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

    // extract and validate the uploaded image
    const imageFile = files.image;
    let image: File;

    if (Array.isArray(imageFile)) {
      image = imageFile[0];
    } else if (imageFile) {
      image = imageFile;
    } else {
      return res.status(400).json({ error: 'Missing image file' });
    }

    // ensure the image file exists
    if (!fs.existsSync(image.filepath)) {
      return res.status(400).json({ error: 'Uploaded image does not exist' });
    }

    // process the image (convert to grayscale)
    const result = await processImage(image.filepath, expectedCount);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'An error occurred while processing the image.' });
  }
}
