'use server';
import { v2 as cloudinary } from 'cloudinary';

// Kita tidak perlu lagi menulis cloudinary.config(...) panjang-panjang,
// karena Cloudinary SDK otomatis membaca process.env.CLOUDINARY_URL !
// Cukup pastikan koneksi aman (HTTPS):
cloudinary.config({
  secure: true
});

export async function uploadImage(formData) {
  try {
    const file = formData.get('file');
    if (!file || file.size === 0) {
      throw new Error('Tidak ada file yang dipilih.');
    }

    // Ubah File object menjadi Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Ubah Buffer menjadi format Base64 URI
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    // Upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileUri, {
        folder: 'fluxwedding',
        transformation: [{ fetch_format: 'auto', quality: 'auto' }] 
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return { 
      success: true, 
      url: result.secure_url, 
      public_id: result.public_id 
    };

  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}