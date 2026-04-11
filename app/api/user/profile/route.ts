import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    const [userId] = Buffer.from(token, 'base64').toString().split(':')

    // Mock user data
    const user = {
      id: userId,
      name: 'Kullanıcı',
      email: Buffer.from(userId, 'base64').toString().split(':')[0],
      createdAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
