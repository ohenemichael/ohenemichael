import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import { uploadFile, uploadAvatar, uploadDoctorDocument } from '@/lib/cloudinary';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(400).json({
          success: false,
          message: 'Error parsing file upload',
        });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const uploadType = Array.isArray(fields.type) ? fields.type[0] : fields.type;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided',
        });
      }

      try {
        let result;

        // Upload based on type
        switch (uploadType) {
          case 'avatar':
            result = await uploadAvatar(file.filepath, req.user!.userId);
            break;

          case 'doctor-document':
            result = await uploadDoctorDocument(file.filepath, req.user!.userId);
            break;

          case 'medical-record':
            const recordId = Array.isArray(fields.recordId) ? fields.recordId[0] : fields.recordId;
            result = await uploadFile(file.filepath, `medical-records/${recordId}`);
            break;

          default:
            result = await uploadFile(file.filepath, 'general');
        }

        // Clean up temporary file
        fs.unlinkSync(file.filepath);

        return res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          data: result,
        });
      } catch (error: any) {
        console.error('Upload error:', error);

        // Clean up temporary file if it exists
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }

        return res.status(500).json({
          success: false,
          message: error.message || 'Failed to upload file',
        });
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

export default withAuth(handler);
