import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import api from './api';

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
 * Pick an image from gallery
 */
export async function pickImage(): Promise<string | null> {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to upload images!');
    return null;
  }

  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
}

/**
 * Take a photo with camera
 */
export async function takePhoto(): Promise<string | null> {
  // Request permission
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    alert('Sorry, we need camera permissions to take photos!');
    return null;
  }

  // Take photo
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
}

/**
 * Upload file directly to Cloudinary (client-side upload)
 */
export async function uploadToCloudinary(
  fileUri: string,
  folder: string = 'general'
): Promise<UploadResult> {
  try {
    // Get upload signature from backend
    const signatureResponse = await api.getUploadSignature(folder);
    const { signature, timestamp, api_key, cloud_name, folder: uploadFolder } = signatureResponse.data;

    // Prepare form data
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
      uri: fileUri,
      name: filename,
      type,
    } as any);

    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', api_key);
    formData.append('folder', uploadFolder);

    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      public_id: response.data.public_id,
      secure_url: response.data.secure_url,
      url: response.data.url,
      format: response.data.format,
      resource_type: response.data.resource_type,
      width: response.data.width,
      height: response.data.height,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload avatar
 */
export async function uploadAvatar(fileUri: string): Promise<UploadResult> {
  return uploadToCloudinary(fileUri, 'avatars');
}

/**
 * Upload doctor document
 */
export async function uploadDoctorDocument(fileUri: string): Promise<UploadResult> {
  return uploadToCloudinary(fileUri, 'doctors/documents');
}

/**
 * Upload medical record
 */
export async function uploadMedicalRecord(
  fileUri: string,
  recordId: string
): Promise<UploadResult> {
  return uploadToCloudinary(fileUri, `medical-records/${recordId}`);
}

/**
 * Pick and upload image
 */
export async function pickAndUploadImage(
  folder: string = 'general'
): Promise<UploadResult | null> {
  const imageUri = await pickImage();

  if (!imageUri) {
    return null;
  }

  return uploadToCloudinary(imageUri, folder);
}

/**
 * Take photo and upload
 */
export async function takePhotoAndUpload(
  folder: string = 'general'
): Promise<UploadResult | null> {
  const photoUri = await takePhoto();

  if (!photoUri) {
    return null;
  }

  return uploadToCloudinary(photoUri, folder);
}
