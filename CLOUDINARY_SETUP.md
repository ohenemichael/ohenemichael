# Cloudinary Setup Guide for MedBook

This guide explains how to set up Cloudinary for file and image storage in MedBook.

## Why Cloudinary?

Cloudinary is a powerful cloud-based media management platform that provides:
- ✅ Easy image and file uploads
- ✅ Automatic image optimization
- ✅ Image transformations (resize, crop, quality)
- ✅ Fast CDN delivery
- ✅ Free tier (25GB storage, 25GB bandwidth)
- ✅ No complex configuration like Firebase
- ✅ Built specifically for media management

## 📦 Setup Steps

### 1. Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Once logged in, go to **Dashboard**

### 2. Get Your Credentials

On the Dashboard, you'll see:
- **Cloud Name**: e.g., `dxxxxxx`
- **API Key**: e.g., `123456789012345`
- **API Secret**: Click "Show" to reveal

### 3. Configure Backend

Update your `.env` file in `medbook-backend`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Install Dependencies

The required packages are already in `package.json`:
```bash
cd medbook-backend
npm install
```

This installs:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload handling
- `expo-server-sdk` - Push notifications (replaces Firebase)

### 5. Test Upload

Start your backend:
```bash
npm run dev
```

Test the upload endpoint with Postman or curl:
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "type=avatar"
```

## 📱 Mobile App Configuration

No configuration needed! The mobile app automatically uses the backend upload endpoints.

### Using Upload Functions

```typescript
import { pickAndUploadImage, uploadAvatar } from '@/services/upload';

// Pick and upload image
const result = await pickAndUploadImage('avatars');
console.log(result.secure_url); // https://res.cloudinary.com/...

// Upload avatar specifically
const avatar = await uploadAvatar(imageUri);
```

## 📂 Upload Types

### 1. Avatar Upload
```typescript
// Mobile
import { uploadAvatar } from '@/services/upload';
const result = await uploadAvatar(imageUri);

// Backend API
POST /api/upload
Content-Type: multipart/form-data
file: [image file]
type: "avatar"
```

### 2. Doctor Document Upload
```typescript
// Mobile
import { uploadDoctorDocument } from '@/services/upload';
const result = await uploadDoctorDocument(fileUri);

// Backend API
POST /api/upload
file: [document file]
type: "doctor-document"
```

### 3. Medical Record Upload
```typescript
// Mobile
import { uploadMedicalRecord } from '@/services/upload';
const result = await uploadMedicalRecord(fileUri, recordId);

// Backend API
POST /api/upload
file: [file]
type: "medical-record"
recordId: "record-uuid"
```

## 🔧 Advanced Features

### Image Transformations

Cloudinary automatically optimizes images. You can also get transformed URLs:

```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary';

// Get 200x200 thumbnail
const thumbUrl = getOptimizedImageUrl(publicId, 200, 200);

// Cloudinary handles: format conversion, compression, resizing
```

### Direct Client Upload

For larger files, use direct client upload:

```typescript
// Mobile
import { uploadToCloudinary } from '@/services/upload';

const result = await uploadToCloudinary(fileUri, 'documents');
```

This uploads directly to Cloudinary from the mobile app, bypassing your server.

### Delete Files

```typescript
import { deleteFile } from '@/lib/cloudinary';

await deleteFile(publicId); // Delete from Cloudinary
```

## 📊 Cloudinary Folders Structure

Files are organized in folders:

```
medbook/
├── avatars/
│   └── [userId]/
│       └── image.jpg
├── doctors/
│   └── [doctorId]/
│       └── documents/
│           └── license.pdf
├── medical-records/
│   └── [recordId]/
│       └── xray.jpg
└── general/
    └── misc files
```

## 🔐 Security

### Upload Signature
All uploads require authentication:
1. Mobile app requests signature from backend
2. Backend generates signed request
3. Mobile app uploads with signature
4. Cloudinary verifies signature

This prevents unauthorized uploads!

### Access Control
- All uploads go through authenticated endpoints
- Only authorized users can upload
- Public URLs are CDN-optimized

## 📊 Monitoring

### Cloudinary Dashboard

View your usage at https://cloudinary.com/console:
- Storage used
- Bandwidth used
- Transformations count
- Media library

### Free Tier Limits
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000/month

**Plenty for development and small-scale production!**

## 🚨 Troubleshooting

### Error: "Must supply api_key"
**Solution**: Check your `.env` file has correct Cloudinary credentials

### Error: "Invalid signature"
**Solution**: Ensure CLOUDINARY_API_SECRET is correct in `.env`

### Upload fails on mobile
**Solution**:
1. Check backend is running
2. Verify API_URL in mobile `.env`
3. Ensure user is authenticated

### Image not displaying
**Solution**: Use `secure_url` from upload response (HTTPS URL)

## 📱 Push Notifications

We're now using **Expo Push Notifications** instead of Firebase:

### Backend Setup (Already Done)
```typescript
import { sendPushNotification } from '@/lib/notifications';

await sendPushNotification(
  userToken,
  'Appointment Reminder',
  'You have an appointment tomorrow'
);
```

### Mobile Setup
In your mobile app, get the Expo push token:

```typescript
import * as Notifications from 'expo-notifications';

const token = await Notifications.getExpoPushTokenAsync();
// Send this token to your backend
```

### Test Notifications
Use the Expo push notification tool:
https://expo.dev/notifications

## 🎯 Migration from Firebase

If you had Firebase before:

1. ✅ File storage → Cloudinary (done)
2. ✅ Push notifications → Expo (done)
3. ✅ Authentication → Still using JWT (no change needed)

**No Firebase dependencies required!**

## 💡 Tips

1. **Optimize images**: Cloudinary does this automatically
2. **Use transformations**: Get thumbnails on-the-fly
3. **Monitor usage**: Check dashboard regularly
4. **Upgrade if needed**: Paid plans start at $89/month

## 🔗 Useful Links

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)

## ✅ Setup Checklist

- [ ] Created Cloudinary account
- [ ] Got Cloud Name, API Key, API Secret
- [ ] Updated `.env` file
- [ ] Ran `npm install` in backend
- [ ] Started backend server
- [ ] Tested upload endpoint
- [ ] Verified images appear in Cloudinary dashboard

---

**🎉 You're all set! Cloudinary is much simpler than Firebase and works great for MedBook!**

For questions or issues, check the Cloudinary documentation or create an issue in the repository.
