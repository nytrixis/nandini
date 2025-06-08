'use client'

import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useTerminalStore } from '@/store/useTerminalStore'
import { useModalStore } from '@/store/useModalStore' // Add this import
import { processCommand } from '@/lib/commands'

export default function Terminal() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [input, setInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const { history, addToHistory } = useTerminalStore()
  const { activeModal, closeModal } = useModalStore() // Add this
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  // Check if terminal should be shown via dev-mode modal
  const isDevModeActive = activeModal === 'dev-mode'

  // Calculate default position
  const getDefaultPosition = () => {
    return { x: -550, y: -200 }
  }

  useEffect(() => {
    const defaultPos = getDefaultPosition()
    setPosition(defaultPos)
    
    setTimeout(() => {
      setIsInitialized(true)
    }, 2000)
  }, [])

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [history])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const command = input.trim()
    addToHistory({ type: 'input', content: `nytrixis@dos:~$ ${command}` })
    
    const result = processCommand(command)
    if (result === 'CLEAR_TERMINAL') {
      useTerminalStore.getState().clearHistory()
    } else {
      addToHistory({ type: 'output', content: result })
    }
    
    setInput('')
  }

  const handleFocus = () => {
    if (inputRef.current && !isDragging) {
      inputRef.current.focus()
    }
  }

const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
  setPosition(prev => ({
    x: prev.x + info.offset.x,
    y: prev.y + info.offset.y
  }))
  setIsDragging(false)
}

  const handleClose = () => {
    if (isDevModeActive) {
      closeModal('dev-mode') // Close the dev-mode modal instead
    } else {
      setIsVisible(false)
    }
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  // Don't show terminal if not initialized and not triggered by dev-mode
  if (!isInitialized && !isDevModeActive) {
    const defaultPos = getDefaultPosition()
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="fixed glass terminal-glow rounded-lg overflow-hidden w-96 h-80 z-40"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${defaultPos.x}px), calc(-50% + ${defaultPos.y}px))`
        }}
      >
        <div className="bg-slate-900/80 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="orbitron text-xs text-slate-400">
            initializing...
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-violet-400 text-sm">loading terminal...</div>
        </div>
      </motion.div>
    )
  }

  // Hide terminal if not visible and not triggered by dev-mode
  if (!isVisible && !isDevModeActive) return null

  // Show terminal if it's initialized OR triggered by dev-mode
  if (isInitialized || isDevModeActive) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            width: isMinimized ? '200px' : '400px',
            height: isMinimized ? '40px' : '320px'
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          drag
          dragMomentum={false}
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{
            x: position.x,
            y: position.y,
          }}
          className="fixed glass terminal-glow rounded-lg overflow-hidden z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Window Controls */}
          <div className="bg-slate-900/80 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"
                title="Close"
              />
              <button
                onClick={handleMinimize}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"
                title="Minimize"
              />
              <button
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"
                title="Maximize"
              />
            </div>
            <div className="orbitron text-xs text-slate-400 pointer-events-none">
              {isDevModeActive ? 'dev.mode' : (isMinimized ? 'terminal' : 'nytrixis@dos')}
            </div>
            <div className="w-16"></div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Terminal Content */}
              <div
                ref={historyRef}
                className="flex-1 p-4 overflow-y-auto text-sm leading-relaxed cursor-text scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600"
                onClick={handleFocus}
              >
                {/* Welcome Message */}
                <div className="text-violet-400 mb-2">
                  welcome to nytrixis.dos v1.0.0
                </div>
                <div className="text-slate-400 mb-4 text-xs">
                  type &pos;help&pos; for available commands
                </div>

                {/* Command History */}
                {history.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`mb-1 ${
                      entry.type === 'input'
                        ? 'text-green-400'
                        : entry.type === 'error'
                        ? 'text-red-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {entry.content}
                  </motion.div>
                ))}
              </div>

              {/* Input Line */}
              <form onSubmit={handleSubmit} className="px-4 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-sm">nytrixis@dos:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm outline-none"
                    placeholder="enter command..."
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }

  return null
}
