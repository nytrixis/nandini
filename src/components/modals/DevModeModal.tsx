'use client'

import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'
import TerminalContent from '../terminal/TerminalContent'

export default function DevModeModal() {
  const { closeModal, minimizeTab } = useModalStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }))
    setIsDragging(false)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeModal('dev-mode')
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    minimizeTab('dev-mode', 'dev mode')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{
          x: position.x,
          y: position.y,
        }}
        className={`fixed top-1/2 left-1/2 terminal-glow -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] glass rounded-2xl overflow-hidden z-50 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Window Controls */}
        <div 
          className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/30"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors z-[60] relative cursor-pointer"
                title="Close"
              />
              <button
                onClick={handleMinimize}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors z-[60] relative cursor-pointer"
                title="Minimize"
              />
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors z-[60] relative cursor-pointer"
                title="Maximize"
              />
            </div>
          </div>
          <div className="orbitron text-slate-300 text-sm">dev.mode</div>
          <div className="w-16"></div>
        </div>

        {/* Terminal Content */}
        <div 
          className="h-full pb-16"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <TerminalContent showWelcome={false} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
