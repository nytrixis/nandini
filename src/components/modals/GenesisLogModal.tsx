'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'

interface LogEntry {
  id: string
  timestamp: string
  title: string
  description: string
  type: 'milestone' | 'achievement' | 'project' | 'learning' | 'research'
  status: 'completed' | 'in-progress' | 'planned'
}

const genesisLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: 'v0.0.1',
    title: 'portfolio genesis',
    description: 'initialized the nytrixis.dos operating system interface with web3 integration capabilities.',
    type: 'milestone',
    status: 'completed',
  },
  {
    id: '2',
    timestamp: 'v0.1.0',
    title: 'ruche release',
    description: 'launched fashion-forward product browser with cart and trending grid. fully solo build.',
    type: 'project',
    status: 'completed',
  },
  {
    id: '3',
    timestamp: 'v0.2.0',
    title: 'dhanvantari protocol',
    description: 'decentralized healthcare infra using avalanche + ipfs. best build at hack4bengal 3.0.',
    type: 'achievement',
    status: 'completed',
  },
  {
    id: '4',
    timestamp: 'v0.3.0',
    title: 'wildx expedition',
    description: 'wildlife conservation dashboard with ai gamification. 2nd place in statuscode1 (wildlife track).',
    type: 'achievement',
    status: 'completed',
  },
  {
    id: '5',
    timestamp: 'v0.4.0',
    title: 'credvault mint',
    description: 'launched zk + ai verified credential system with dynamic dNFTs. finalist at Frosthacks 1',
    type: 'project',
    status: 'completed',
  },
  {
    id: '6',
    timestamp: 'v0.5.0',
    title: 'nyvex pitchdeck locked',
    description: 'blockchain-based startup investment platform. smart pools, proof-of-investment nfts, cross-chain. winner at aarohan 2025.',
    type: 'achievement',
    status: 'completed',
  },
  {
    id: '7',
    timestamp: 'v0.6.0',
    title: 'kiva goes live',
    description: 'e-commerce platform for small businesses with ai peeks and influencer boost campaigns.',
    type: 'project',
    status: 'completed',
  },
  {
    id: '8',
    timestamp: 'v0.7.0',
    title: 'builder recognitions',
    description: 'techgig code gladiators finalist, myntra weforshe semi-finalist, rnmc top 20, 3x mun outstanding delegate.',
    type: 'achievement',
    status: 'completed',
  },
  {
    id: '9',
    timestamp: 'v0.8.0',
    title: 'disaster research published',
    description: 'paper on intelligent disaster management accepted at isaac 2025. ieee and scopus indexed.',
    type: 'research',
    status: 'completed',
  },
  {
    id: '10',
    timestamp: 'v0.8.1',
    title: 'vedvaani blueprint',
    description: 'ai-powered hindu scripture q&a. wisdom journal, daily insights, multilingual microlearning.',
    type: 'project',
    status: 'in-progress',
  },
  {
    id: '11',
    timestamp: 'v0.8.2',
    title: 'sugarcane disease classifier',
    description: 'built deep learning model for sugarcane leaf disease detection. keras + cnn + custom dataset.',
    type: 'project',
    status: 'completed',
  },
  {
    id: '12',
    timestamp: 'v0.9.0',
    title: 'mentor mode activated',
    description: 'joined girlscript summer of code as mentor. guided 20+ contributors across stacks.',
    type: 'milestone',
    status: 'completed',
  },
  {
    id: '13',
    timestamp: 'v0.9.1',
    title: 'p2p university ideation',
    description: 'decentralized learning + ai hackathon mentor platform. sbt reputation, ai pathing, ecosystem-first.',
    type: 'project',
    status: 'planned',
  },
  {
    id: '14',
    timestamp: 'v1.0.0',
    title: 'stable release',
    description: 'nytrixis.dos v1 rolled out. immersive portfolio os powered by code, spirit, and grit.',
    type: 'milestone',
    status: 'completed',
  },
  {
    id: '15',
    timestamp: 'v1.0.1',
    title: 'hustle kid mode',
    description: '4x hackathon wins. community builder. next startup in stealth. we ship. always.',
    type: 'milestone',
    status: 'completed',
  },
];


export default function GenesisLogModal() {
  const { closeModal, minimizeTab } = useModalStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Handle scroll to focus items
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.top + containerRect.height / 2

      let closestIndex = 0
      let closestDistance = Infinity

      itemRefs.current.forEach((item, index) => {
        if (!item) return
        const itemRect = item.getBoundingClientRect()
        const itemCenter = itemRect.top + itemRect.height / 2
        const distance = Math.abs(itemCenter - containerCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setFocusedIndex(closestIndex)
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }))
    setIsDragging(false)
  }

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'milestone': return 'text-violet-400 bg-violet-400/10'
      case 'achievement': return 'text-amber-400 bg-amber-400/10'
      case 'project': return 'text-blue-400 bg-blue-400/10'
      case 'learning': return 'text-green-400 bg-green-400/10'
      default: return 'text-slate-400 bg-slate-400/10'
    }
  }

  const getStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
      case 'completed': return '✓'
      case 'in-progress': return '⟳'
      case 'planned': return '○'
      default: return '○'
    }
  }

  // Handle button clicks with proper event handling
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeModal('genesis-log')
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    minimizeTab('genesis-log', 'Genesis Log')
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
        className={`fixed top-1/4 left-1/2 terminal-glow -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] glass rounded-2xl overflow-hidden z-50 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Window Controls */}
        <div 
          className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/30"
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag on header
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
          <div className="orbitron text-slate-300 text-sm">genesis.log</div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="h-full pb-16">
          <div 
            ref={scrollContainerRef}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 px-6 py-4"
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag on content
          >
            <div className="space-y-4">
              {genesisLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  ref={(el: HTMLDivElement | null) => {
                    itemRefs.current[index] = el
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: focusedIndex === index ? 1.02 : 1,
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    scale: { duration: 0.2 }
                  }}
                  className={`relative p-4 rounded-xl border transition-all duration-300 ${
                    focusedIndex === index
                      ? 'border-violet-500/50 bg-violet-500/5 shadow-lg shadow-violet-500/10'
                      : 'border-slate-700/30 bg-slate-800/20'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-2 top-6 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${
                      focusedIndex === index ? 'bg-violet-400' : 'bg-slate-500'
                    }`} />
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm orbitron">{log.timestamp}</span>
                      <span className={`px-2 py-1 rounded-full text-xs orbitron ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </div>
                    <span className="text-lg" title={log.status}>
                      {getStatusIcon(log.status)}
                    </span>
                  </div>

                  <h3 className="text-slate-200 orbitron font-semibold mb-2">{log.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{log.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
