import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// promise-based parser
const parseForm = async (req: NextApiRequest) => {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10mb
    filter: ({ mimetype }) => {
      // make sure the filter function always returns a boolean
      return mimetype ? mimetype.startsWith('image/') : false;
    },
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

// template processing function
const processImage = async (filePath: string, expectedCount: number) => {
  // simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // template response: ±10% of expected count (need to craete model and downsampling)
  const countedVials = Math.floor(expectedCount * (0.9 + Math.random() * 0.2));
  const percentage = ((countedVials / expectedCount) * 100).toFixed(2);



  const originalFilename = path.basename(filePath);
  const processedFilename = `processed-${originalFilename}`;
  const processedFilePath = path.join(uploadDir, processedFilename);


  fs.copyFileSync(filePath, processedFilePath); // replace with actual image processing logic

  // return the image URL
  const imageUrl = `/uploads/${path.basename(processedFilename)}`;

  return {
    imageUrl,
    countedVials,
    percentage,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);

    // handle expectedCount
    const expectedCountField = fields.expectedCount;
    let expectedCount: number;

    if (Array.isArray(expectedCountField)) {
      expectedCount = parseInt(expectedCountField[0], 10);
    } else if (typeof expectedCountField === 'string') {
      expectedCount = parseInt(expectedCountField, 10);
    } else {
      return res.status(400).json({ error: 'Invalid expected count' });
    }

    // handle image
    const imageFile = files.image;
    let image: File;

    if (Array.isArray(imageFile)) {
      image = imageFile[0];
    } else if (imageFile) {
      image = imageFile;
    } else {
      return res.status(400).json({ error: 'Missing image' });
    }

    // validate the expectedCount
    if (!image || isNaN(expectedCount) || expectedCount <= 0) {
      return res.status(400).json({ error: 'Invalid image or expected count' });
    }

    // process the image (mock)
    const result = await processImage(image.filepath, expectedCount);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
