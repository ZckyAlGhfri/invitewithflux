import 'server-only';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ secure: true });

export async function uploadCloudinaryImage(buffer, mime) {
  const fileUri = `data:${mime};base64,${buffer.toString('base64')}`;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileUri, {
      folder: 'fluxwedding',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ fetch_format: 'auto', quality: 'auto' }],
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export async function deleteCloudinaryImage(publicId) {
  if (typeof publicId !== 'string' || !/^fluxwedding\/[A-Za-z0-9_-]+$/u.test(publicId)) {
    return { success: false, error: 'Public ID Cloudinary tidak valid.' };
  }
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
