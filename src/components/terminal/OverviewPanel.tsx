'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function OverviewPanel() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const getDefaultPosition = () => {
    return { x: -550, y: 150 }
  }

  useEffect(() => {
    setPosition(getDefaultPosition())
    setTimeout(() => setIsInitialized(true), 2200)
  }, [])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }))
    setIsDragging(false)
  }

  const toggleExpanded = () => {
    if (!isDragging) setIsExpanded(!isExpanded)
  }

  if (!isInitialized) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        height: isExpanded ? 'auto' : '72px' // Increased from 40px
      }}
      transition={{ duration: 0.3 }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{
        x: position.x,
        y: position.y,
      }}
      className="fixed glass terminal-glow rounded-lg overflow-hidden z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] cursor-pointer"
      onClick={toggleExpanded}
    >
      {/* Header */}
      <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="orbitron text-sm text-slate-300 flex items-center gap-2">
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-violet-400"
            >
              ▶
            </motion.span>
            overview
          </div>
          <div className="text-xs text-slate-500">
            {isExpanded ? 'click to collapse' : 'click to expand'}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 text-sm leading-relaxed"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <p className="text-slate-300">
                Nandini Pandey - Hustle Kid.<br />
                cs undergrad, 4x hackathon wins, full stack to web3 x ai. <br />
                dreaming in typescript and deploying with purpose.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
