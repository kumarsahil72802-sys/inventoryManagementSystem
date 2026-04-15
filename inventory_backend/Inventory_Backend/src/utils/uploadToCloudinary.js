import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const FOLDER = 'staff-documents';

/**
 * Upload a buffer (image or PDF) to Cloudinary and return the secure URL.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} fieldName - Field name (e.g. highestQualificationCertificate) for public_id
 * @param {string} mimeType - e.g. 'image/jpeg', 'application/pdf'
 * @returns {Promise<string>} secure_url
 */
export function uploadDocument(buffer, fieldName, mimeType = '') {
  const resourceType = mimeType.startsWith('image/') ? 'image' : 'raw';

  return new Promise((resolve, reject) => {
    const readStream = Readable.from(buffer);
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: resourceType,
        public_id: `${fieldName}_${Date.now()}`,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    readStream.pipe(uploadStream);
  });
}
