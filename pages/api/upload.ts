import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// Create a directory to store uploaded files
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      filename: (name, ext, part, form) => Date.now() + path.extname(part.originalFilename || '')
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Error uploading file' });
        return;
      }

      // Check if files.image exists and has at least one file
      const file = files.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : undefined;

      if (file && file.filepath) {
        // Compute relative path
        const relativePath = path.relative(process.cwd(), file.filepath);
        const publicPath = `/${path.relative('public', relativePath)}`;

        res.status(200).json({ filePath: publicPath });
      } else {
        res.status(400).json({ message: 'No file uploaded' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
