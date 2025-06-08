'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function StatusBar() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const istTime = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
      setCurrentTime(istTime)
    }

    // Update immediately
    updateTime()
    
    // Update every second
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="fixed bottom-0 right-0 p-[10px] z-[600]"
    >
      <div className="glass rounded-lg px-3 py-2 flex items-center gap-3">
        {/* Time with Online Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm orbitron">
              {currentTime} IST
            </span>
          </div>
        </div>
        
        {/* Language Indicator */}
        <div className="text-slate-400 text-xs orbitron border-l border-slate-600 pl-3">
          ENG
        </div>
      </div>
    </motion.div>
  )
}
