import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { uploadBase64ToCloudinary } from '@/lib/cloudinary'

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { image, folder = 'general', publicId } = body

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Validate folder names
    const allowedFolders = ['leaders', 'events', 'blogs', 'gallery', 'sermons', 'general']
    const uploadFolder = allowedFolders.includes(folder) ? folder : 'general'

    const options = {
      folder: `karumaincu/${uploadFolder}`,
    }

    if (publicId) {
      options.public_id = publicId
      options.overwrite = true
    }

    const result = await uploadBase64ToCloudinary(image, options)

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', message: error.message },
      { status: 500 }
    )
  }
}
