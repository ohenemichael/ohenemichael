import { NextApiResponse } from 'next';
import { generateUploadSignature } from '@/lib/cloudinary';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { folder } = req.query;

    const signature = generateUploadSignature(folder as string || 'general');

    return res.status(200).json({
      success: true,
      data: signature,
    });
  } catch (error: any) {
    console.error('Signature generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate upload signature',
    });
  }
}

export default withAuth(handler);
