import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
}

/**
 * Upload a file to Cloudinary
 * @param file - File path or base64 string
 * @param folder - Cloudinary folder (e.g., 'doctors', 'avatars', 'documents')
 * @param options - Additional upload options
 */
export async function uploadFile(
  file: string,
  folder: string = 'medbook',
  options: any = {}
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `medbook/${folder}`,
      resource_type: 'auto',
      ...options,
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      resource_type: result.resource_type,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload an image with transformation
 * @param file - File path or base64 string
 * @param folder - Cloudinary folder
 * @param width - Desired width
 * @param height - Desired height
 */
export async function uploadImage(
  file: string,
  folder: string = 'images',
  width?: number,
  height?: number
): Promise<UploadResult> {
  const transformation: any = {
    quality: 'auto',
    fetch_format: 'auto',
  };

  if (width) transformation.width = width;
  if (height) transformation.height = height;
  if (width && height) transformation.crop = 'fill';

  return uploadFile(file, folder, { transformation });
}

/**
 * Upload doctor verification documents
 * @param file - File path or base64 string
 * @param doctorId - Doctor's unique ID
 */
export async function uploadDoctorDocument(
  file: string,
  doctorId: string
): Promise<UploadResult> {
  return uploadFile(file, `doctors/${doctorId}/documents`, {
    resource_type: 'auto',
  });
}

/**
 * Upload user avatar
 * @param file - File path or base64 string
 * @param userId - User's unique ID
 */
export async function uploadAvatar(
  file: string,
  userId: string
): Promise<UploadResult> {
  return uploadImage(file, `avatars/${userId}`, 400, 400);
}

/**
 * Upload medical record attachment
 * @param file - File path or base64 string
 * @param recordId - Medical record ID
 */
export async function uploadMedicalRecord(
  file: string,
  recordId: string
): Promise<UploadResult> {
  return uploadFile(file, `medical-records/${recordId}`, {
    resource_type: 'auto',
  });
}

/**
 * Delete a file from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteFile(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicId - Cloudinary public ID
 * @param width - Desired width
 * @param height - Desired height
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  const transformation: any = {
    quality: 'auto',
    fetch_format: 'auto',
  };

  if (width) transformation.width = width;
  if (height) transformation.height = height;
  if (width && height) transformation.crop = 'fill';

  return cloudinary.url(publicId, transformation);
}

/**
 * Generate a signed upload URL for direct client uploads
 * @param folder - Cloudinary folder
 */
export function generateUploadSignature(folder: string = 'medbook'): {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder: string;
} {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder_path = `medbook/${folder}`;

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: folder_path,
    },
    process.env.CLOUDINARY_API_SECRET || ''
  );

  return {
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY || '',
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    folder: folder_path,
  };
}

export default cloudinary;
