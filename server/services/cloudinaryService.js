/**
 * Cloudinary Service — File Storage
 * Gracefully degrades to metadata-only mode when credentials are absent.
 */
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

let cloudinaryConfigured = false;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  cloudinaryConfigured = true;
  console.log('✅ Cloudinary configured');
} else {
  console.log('ℹ️ Cloudinary not configured — file uploads will use metadata-only mode');
}

export const isCloudinaryConfigured = () => cloudinaryConfigured;

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer
 * @param {object} options - folder, resource_type, public_id, etc.
 * @returns {object} result with secure_url, public_id, etc.
 */
export const uploadFile = async (buffer, options = {}) => {
  if (!cloudinaryConfigured) {
    // Return a placeholder metadata object
    const fakeId = 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    return {
      secure_url: null,
      public_id: fakeId,
      resource_type: options.resource_type || 'raw',
      format: options.format || 'pdf',
      bytes: buffer.length,
      original_filename: options.original_filename || 'uploaded_file',
      _localMode: true,
      _warning: 'Cloudinary not configured. File was not persisted to cloud storage.'
    };
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'skillnexus',
      resource_type: options.resource_type || 'auto',
      ...options
    };

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary by public_id.
 */
export const deleteFile = async (publicId, resourceType = 'raw') => {
  if (!cloudinaryConfigured || !publicId || publicId.startsWith('local_')) {
    return { result: 'ok', _localMode: true };
  }
  return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export default { uploadFile, deleteFile, isCloudinaryConfigured };
