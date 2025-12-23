import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export async function uploadToCloudinary(file, options = {}) {
  const defaultOptions = {
    folder: 'karumaincu',
    resource_type: 'auto',
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  }

  const uploadOptions = { ...defaultOptions, ...options }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    // If file is a buffer, pipe it to the upload stream
    if (Buffer.isBuffer(file)) {
      const stream = require('stream')
      const bufferStream = new stream.PassThrough()
      bufferStream.end(file)
      bufferStream.pipe(uploadStream)
    } else {
      // If it's a base64 string or URL
      cloudinary.uploader.upload(file, uploadOptions)
        .then(resolve)
        .catch(reject)
    }
  })
}

/**
 * Upload image from base64 string
 * @param {string} base64String - Base64 encoded image
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export async function uploadBase64ToCloudinary(base64String, options = {}) {
  const defaultOptions = {
    folder: 'karumaincu',
    resource_type: 'image',
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  }

  const uploadOptions = { ...defaultOptions, ...options }
  
  return cloudinary.uploader.upload(base64String, uploadOptions)
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
export async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId)
}

/**
 * Get optimized image URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
export function getOptimizedUrl(publicId, options = {}) {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
  }

  return cloudinary.url(publicId, {
    ...defaultTransformations,
    ...options
  })
}

/**
 * Get thumbnail URL
 * @param {string} publicId - Cloudinary public ID
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {string} - Thumbnail URL
 */
export function getThumbnailUrl(publicId, width = 300, height = 300) {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    fetch_format: 'auto'
  })
}

export default cloudinary
