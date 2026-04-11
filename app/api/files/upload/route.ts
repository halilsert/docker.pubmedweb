import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const translationId = formData.get('translationId') as string

    if (!file || !translationId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const filename = `translations/${translationId}/${file.name}`

    const blob = await put(filename, buffer, { access: 'public' })

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
