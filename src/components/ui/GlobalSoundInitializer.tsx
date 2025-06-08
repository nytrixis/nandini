'use client'

import { useEffect } from 'react'
import { initializeGlobalClickHandler } from '@/lib/globalClickHandler'

export default function GlobalSoundInitializer() {
  useEffect(() => {
    // Initialize global click handler after component mounts
    const cleanup = initializeGlobalClickHandler()
    
    return cleanup
  }, [])

  return null // This component doesn't render anything
}
