import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Basit token-based auth
const TERMINAL_TOKEN = process.env.TERMINAL_TOKEN || 'change-me'

export async function POST(request: NextRequest) {
  try {
    // Token kontrol et
    const token = request.headers.get('x-terminal-token')
    if (token !== TERMINAL_TOKEN) {
      return NextResponse.json(
        { error: 'Yetkilendirilmemiş' },
        { status: 401 }
      )
    }

    const { command } = await request.json()

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Komut gerekli' },
        { status: 400 }
      )
    }

    // Güvenli komutlar whitelist'i
    const allowedCommands = [
      'npm run',
      'docker',
      'git',
      'ls',
      'pwd',
      'echo',
      'cat',
      'tail',
      'ps',
      'node',
    ]

    const isAllowed = allowedCommands.some(cmd => command.toLowerCase().startsWith(cmd))
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Bu komut izin verilen komutlar içinde değil' },
        { status: 403 }
      )
    }

    // Komut çalıştır
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000,
      cwd: process.env.APP_DIR || '/app',
    })

    return NextResponse.json({
      success: true,
      command,
      output: stdout,
      error: stderr || null,
      timestamp: new Date(),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Komut çalıştırma hatası',
    }, { status: 500 })
  }
}
