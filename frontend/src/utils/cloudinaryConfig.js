/**
 * Cloudinary Configuration and Upload Utility
 * 
 * TODO: Set your Cloudinary credentials
 * 1. Get your Cloudinary account at https://cloudinary.com
 * 2. Set the VITE_CLOUDINARY_CLOUD_NAME environment variable
 * 3. Create an unsigned upload preset in your Cloudinary dashboard
 * 4. Set the VITE_CLOUDINARY_UPLOAD_PRESET environment variable
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME) {
  console.warn('⚠️ VITE_CLOUDINARY_CLOUD_NAME is not configured');
}

if (!UPLOAD_PRESET) {
  console.warn('⚠️ VITE_CLOUDINARY_UPLOAD_PRESET is not configured');
}

/**
 * Upload an image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Callback function for upload progress
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export async function uploadToCloudinary(file, onProgress = null) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary credentials are not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET environment variables.');
  }

  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'portfolio'); // Optional: organize uploads in a folder

  try {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    return new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload error - network issue'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Validate that a URL is a valid Cloudinary URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if it's a valid Cloudinary URL
 */
export function isValidCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com');
}
