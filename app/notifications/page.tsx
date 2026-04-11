'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [filter])

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?filter=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT' })
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary">
            🔔 Bildirimler {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
          </h1>
          <Link href="/dashboard" className="btn btn-secondary">← Geri</Link>
        </div>

        <div className="flex gap-4 mb-8">
          {['all', 'unread', 'payment', 'translation'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f ? 'bg-primary text-white' : 'bg-white border border-gray-200'
              }`}
            >
              {f === 'all' ? '📋 Tümü' :
               f === 'unread' ? '🔴 Okunmamış' :
               f === 'payment' ? '💳 Ödemeler' : '📄 Çeviriler'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12"><p className="text-text-light">Yükleniyor...</p></div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12"><p className="text-text-light">Bildirim yok</p></div>
        ) : (
          <div className="space-y-4">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`card p-6 cursor-pointer transition ${
                  !n.read ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-primary">{n.title}</h3>
                      {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                    </div>
                    <p className="text-text-light">{n.message}</p>
                    <p className="text-xs text-text-light mt-2">
                      {new Date(n.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <span className="text-2xl ml-4">
                    {n.type === 'payment_success' ? '✅' :
                     n.type === 'translation_complete' ? '📄' :
                     n.type === 'translation_failed' ? '❌' : '📧'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
