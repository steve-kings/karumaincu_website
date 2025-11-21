import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { verifyAuth } from '@/lib/auth'
import sharp from 'sharp'

export async function POST(request) {
  try {
    // Verify authentication (admins and members can upload)
    const user = await verifyAuth(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const type = formData.get('type') || 'general' // blog, leader, event, general

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB before compression)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Read file data
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.jpg`

    // Determine subfolder based on type
    const subfolder = ['blogs', 'leaders', 'events'].includes(type) ? type : 'general'
    
    // Ensure uploads directory and subfolder exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', subfolder)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Compress and optimize image using sharp
    const compressedBuffer = await sharp(buffer)
      .resize(1200, 1200, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85, 
        progressive: true 
      })
      .toBuffer()

    // Check compressed size (should be under 5MB)
    const compressedSize = compressedBuffer.length
    const compressedSizeMB = (compressedSize / (1024 * 1024)).toFixed(2)
    
    console.log(`Image compressed: ${(file.size / (1024 * 1024)).toFixed(2)}MB → ${compressedSizeMB}MB`)

    // Write compressed file
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, compressedBuffer)

    // Return public URL
    const url = `/uploads/${subfolder}/${filename}`

    return NextResponse.json({
      success: true,
      url: url,
      filename: filename,
      originalSize: file.size,
      compressedSize: compressedSize,
      compressionRatio: `${((1 - compressedSize / file.size) * 100).toFixed(1)}%`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed', message: error.message },
      { status: 500 }
    )
  }
}
