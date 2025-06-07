'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTerminalStore } from '@/store/useTerminalStore'
import { processCommand } from '@/lib/commands'

interface TerminalContentProps {
  showWelcome?: boolean
}

export default function TerminalContent({ showWelcome = true }: TerminalContentProps) {
  const [input, setInput] = useState('')
  const { history, addToHistory } = useTerminalStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

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
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Terminal Content */}
      <div
        ref={historyRef}
        className="flex-1 p-4 overflow-y-auto text-sm leading-relaxed cursor-text scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600"
        onClick={handleFocus}
      >
        {/* Welcome Message */}
        {showWelcome && (
          <>
            <div className="text-violet-400 mb-2">
              welcome to nytrixis.dos v1.0.0
            </div>
            <div className="text-slate-400 mb-4 text-xs">
              type 'help' for available commands
            </div>
          </>
        )}

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
    </div>
  )
}
