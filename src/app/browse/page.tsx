'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import WebBrowser from '@/components/ui/WebBrowser'

function BrowseContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const urlParam = searchParams.get('url')
    console.log('Browse page - URL param:', urlParam) // Debug log
    
    if (urlParam) {
      try {
        const decodedUrl = decodeURIComponent(urlParam)
        console.log('Decoded URL:', decodedUrl) // Debug log
        setUrl(decodedUrl)
      } catch (error) {
        console.error('Invalid URL parameter:', error)
        router.push('/')
      }
    } else {
      console.log('No URL parameter found, redirecting to home')
      router.push('/')
    }
  }, [searchParams, router])

  const handleClose = () => {
    console.log('Closing browser, returning to home') // Debug log
    setUrl(null)
    router.push('/')
  }

  if (!url) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-400 orbitron text-xl">
          loading browser...
        </div>
      </div>
    )
  }

  return <WebBrowser url={url} onClose={handleClose} />
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-400 orbitron text-xl">
          initializing browser...
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  )
}
