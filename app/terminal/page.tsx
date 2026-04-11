'use client'

import { useState } from 'react'

interface TerminalOutput {
  command: string
  output: string
  timestamp: string
  error?: string
}

export default function Terminal() {
  const [command, setCommand] = useState('')
  const [outputs, setOutputs] = useState<TerminalOutput[]>([])
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [tokenSet, setTokenSet] = useState(false)

  const executeCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    setLoading(true)

    try {
      const res = await fetch('/api/terminal/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-terminal-token': token,
        },
        body: JSON.stringify({ command }),
      })

      const data = await res.json()

      if (data.success) {
        setOutputs([
          {
            command,
            output: data.output,
            timestamp: new Date().toLocaleTimeString('tr-TR'),
            error: data.error,
          },
          ...outputs,
        ])
        setCommand('')
      } else {
        alert('❌ Hata: ' + data.error)
      }
    } catch (error) {
      alert('❌ Komut çalıştırma başarısız')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenSet) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-4 flex items-center justify-center">
        <div className="w-full max-w-md card bg-gray-800 border-gray-700">
          <h1 className="text-2xl font-bold mb-4 text-accent">🔐 Terminal Erişim</h1>
          <form onSubmit={(e) => {
            e.preventDefault()
            if (token) setTokenSet(true)
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Terminal Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Token girin"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={!token}
            >
              ✓ Giriş Yap
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Token: TERMINAL_TOKEN ortam değişkeni
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-accent mb-2">💻 Terminal</h1>
          <p className="text-gray-400">iPhone / iPad'den komut çalıştır</p>
          <button
            onClick={() => setTokenSet(false)}
            className="mt-4 text-sm text-gray-400 hover:text-accent transition"
          >
            🔓 Çıkış Yap
          </button>
        </div>

        {/* Command Input */}
        <div className="card bg-gray-800 border-gray-700 mb-6">
          <form onSubmit={executeCommand} className="flex gap-2">
            <div className="flex-1">
              <span className="text-accent">$ </span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Komut girin: npm run build, docker-compose up, git status..."
                className="flex-1 bg-transparent text-white focus:outline-none font-mono"
                disabled={loading}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !command.trim()}
              className="px-4 py-2 bg-accent text-gray-900 rounded font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? '⏳' : '▶'}
            </button>
          </form>
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          {outputs.map((out, idx) => (
            <div key={idx} className="card bg-gray-800 border-gray-700 font-mono text-sm">
              <div className="mb-3 pb-3 border-b border-gray-700">
                <p className="text-accent">$ {out.command}</p>
                <p className="text-gray-500 text-xs mt-1">{out.timestamp}</p>
              </div>
              <pre className="bg-black p-3 rounded overflow-x-auto text-gray-300">
                {out.output || '(No output)'}
              </pre>
              {out.error && (
                <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded text-red-300 text-xs">
                  <p className="font-semibold mb-1">❌ Error:</p>
                  <p>{out.error}</p>
                </div>
              )}
            </div>
          ))}
          {outputs.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              Komut çalıştırıp sonuçları burada göreceksiniz
            </div>
          )}
        </div>

        {/* Helpful Commands */}
        <div className="mt-8 card bg-gray-800 border-gray-700">
          <h2 className="text-lg font-bold text-accent mb-4">📚 Yaygın Komutlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {[
              'npm run dev',
              'npm run build',
              'docker-compose up',
              'docker-compose down',
              'git status',
              'git pull',
              'ps aux',
              'npm run start',
              'npx prisma migrate dev',
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => setCommand(cmd)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-left text-gray-300 hover:text-white transition text-xs font-mono"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
