import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')

  if (!query) {
    return NextResponse.json({ articles: [] })
  }

  try {
    // PubMed API'den makale ara
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=10&rettype=json`
    const searchRes = await axios.get(searchUrl)
    
    const ids = searchRes.data?.esearchresult?.idlist || []

    if (ids.length === 0) {
      return NextResponse.json({ articles: [] })
    }

    // Her makale için detay al
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&rettype=json`
    const fetchRes = await axios.get(fetchUrl)

    const articles = fetchRes.data?.result?.slice(1).map((article: any) => ({
      id: article.uid,
      title: article.title || 'Başlık yok',
      authors: article.authors?.map((a: any) => a.name).join(', ') || 'Yazar yok',
      abstract: article.abstract || 'Özet yok',
      journal: article.source || '',
      pubDate: article.pubdate || '',
    })) || []

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('PubMed API error:', error)
    return NextResponse.json({ articles: [], error: 'Arama başarısız' })
  }
}
