'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Desktop from '@/components/desktop/Desktop'
import FloatingDockComponent from '@/components/dock/FloatingDockComponent'
import Terminal from '@/components/terminal/Terminal'
import OverviewPanel from '@/components/terminal/OverviewPanel'
import WalletDropdown from '@/components/wallet/WalletDropdown'
import StatusBar from '@/components/ui/StatusBar'
import SearchBar from '@/components/ui/SearchBar'
import Toast from '@/components/ui/Toast'
import ModalManager from '@/components/modals/ModalManager'
import { useModalStore } from '@/store/useModalStore'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { toast } = useModalStore()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigate = async (url: string) => {
    try {
      console.log('handleNavigate called with:', url) 
      const encodedUrl = encodeURIComponent(url)
      const browseUrl = `/browse?url=${encodedUrl}`
      console.log('Navigating to:', browseUrl) 
      
      router.push(browseUrl)
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-400 orbitron text-xl">
          initializing nytrixis.dos...
        </div>
      </div>
    )
  }

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/background.gif')`,
          filter: 'brightness(0.5) contrast(1.2)'
        }}
      />
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }}
        />
      </div>
      {/* Components */}
      <div className="absolute top-10 right-6 z-[200]">
        <WalletDropdown />
      </div>

      <div className="absolute top-10 left-0 right-0 z-[30]">
        <Desktop />
      </div>

      {/* Floating Dock - positioned on left side */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[300]">
        <FloatingDockComponent />
      </div>

      <div className="z-[600]">
        <StatusBar />
      </div>
      
      <div className="z-[100]">
        <Terminal />
      </div>
      
      <div className="z-[150]">
        <OverviewPanel />
      </div>
      
      <div className="z-[150]">
        <ModalManager />
      </div>

      {/* Search Bar */}
      <div className="z-[300]">
        <SearchBar onNavigate={handleNavigate} />
      </div>


      <AnimatePresence>
        {toast && (
          <div className="absolute top-20 right-6 z-[250]">
            <Toast message={toast.message} type={toast.type} />
          </div>
        )}
      </AnimatePresence>

      {/* Boot Animation */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute inset-0 bg-slate-950 flex items-center justify-center z-[500] pointer-events-none"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="orbitron text-2xl text-violet-400 mb-4"
          >
            nytrixis.dos
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '200px' }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="h-1 bg-gradient-to-r from-violet-500 to-amber-500 mx-auto"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-slate-400 text-sm mt-4"
          >
            web3 operating system initialized
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
