'use client'

import { useState } from 'react'
import { Search as SearchIcon, Loader } from 'lucide-react'

interface Article {
  id: string
  title: string
  authors: string
  abstract: string
  journal: string
  pubDate: string
}

interface SearchProps {
  onArticleSelect: (article: Article) => void
}

export default function Search({ onArticleSelect }: SearchProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Article[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.articles || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Makale başlığı, anahtar kelime veya PMID ara..."
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {loading ? <Loader className="animate-spin" size={24} /> : <SearchIcon size={24} />}
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="grid gap-4">
        {results.map((article) => (
          <div
            key={article.id}
            className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition cursor-pointer"
            onClick={() => onArticleSelect(article)}
          >
            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{article.authors}</p>
            <p className="text-gray-500 text-sm">{article.abstract?.substring(0, 200)}...</p>
            <div className="mt-4 text-blue-500 font-medium">Çeviri fiyatını hesapla →</div>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-gray-500">Sonuç bulunamadı</p>
        </div>
      )}
    </div>
  )
}
