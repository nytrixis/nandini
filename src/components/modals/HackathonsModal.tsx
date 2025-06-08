'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'

interface HackathonEntry {
  id: string
  event: string
  role: string
  project: string
  tech: string[]
  date: string
  github?: string
  live?: string
  verified: boolean
  prize?: string
}

const hackathonLogs: HackathonEntry[] = [
  {
    id: '1',
    event: 'Aarohan 2025',
    role: 'winner',
    project: 'Nyvex Platform',
    tech: ['zkML', 'DeFi', 'Cross-chain'],
    date: 'Jan 2025',
    github: 'https://github.com/nytrixis/nyvex',
    live: 'https://nyvex-warp.vercel.app',
    verified: true,
    prize: '1st Place'
  },
  {
    id: '2',
    event: 'FrostHacks 1',
    role: 'Finalist',
    project: 'CredVault',
    tech: ['zk-SNARKs', 'AI', 'dNFTs'],
    date: 'Feb 2025',
    github: 'https://github.com/nytrixis/credvault',
    verified: true,
    prize: 'Top 8 Finalist'
  },
  {
    id: '3',
    event: 'Jadavpur E-Summit Hack<N>Pitch',
    role: 'Finalist',
    project: 'Decentralized Hospital Managemet',
    tech: ['Blockchain', 'AI'],
    date: 'Oct 2024',
    github: 'https://github.com/nytrixis/frankenstrike-esummit-2024',
    live: '',
    verified: true,
    prize: 'Top 8 Finalist'
  },
  {
    id: '4',
    event: 'BizThon',
    role: 'Finalist',
    project: 'Startup Strategy Deck',
    tech: ['Strategy', 'AI', 'Business Model'],
    date: 'Oct 2024',
    github: 'https://github.com/nytrixis/bizthon',
    live: '',
    verified: true,
    prize: 'Top 5 Finalist'
  },
 {
    id: '5',
    event: 'StatusCode1',
    role: '2nd Place',
    project: 'WildX Expedition',
    tech: ['AI', 'Gamification', 'Conservation'],
    date: 'Sep 2024',
    github: 'https://github.com/nytrixis/wildx',
    verified: true,
    prize: '2nd Place - Wildlife Track'
  },
  {
    id: '6',
    event: 'Deco.cx htmx edition',
    role: 'winner',
    project: 'Poozle',
    tech: ['AI', 'Ecommerce'],
    date: 'Jul 2024',
    github: 'https://github.com/nytrixis/poozle1',
    verified: true,
    prize: 'overall winner & deno bounty'
  },
  {
    id: '7',
    event: 'Hack4Bengal 3.0',
    role: 'winner',
    project: 'Dhanvantari Protocol',
    tech: ['Depin', 'IPFS', 'Avalanche'],
    date: 'Nov 2024',
    github: 'https://github.com/nytrixis/dhanvantari',
    verified: true,
    prize: 'Best Build on Avalanche'
  },
  {
    id: '8',
    event: 'DevSculpt innovathon',
    role: 'winner',
    project: 'Ruche',
    tech: ['AI', 'Ecommerce'],
    date: 'Sep 2023',
    github: 'https://github.com/nytrixis/ruche',
    verified: true,
    prize: 'overall winner'
  },
  
]


export default function HackathonModal() {
  const { closeModal, minimizeTab } = useModalStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'prize'>('date')

  const sortedLogs = [...hackathonLogs].sort((a, b) => {
  if (sortBy === 'date') {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }
  // Sort by prize level
  const prizeOrder = ['winner', 'best', '1st', '2nd', '3rd', 'finalist', 'semifinalist', 'participant']
  const aIndex = prizeOrder.findIndex(p => a.role.toLowerCase().includes(p))
  const bIndex = prizeOrder.findIndex(p => b.role.toLowerCase().includes(p))
  return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
})

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Handle scroll to focus items (same as GenesisLogModal)
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

  const getTechColor = (tech: string) => {
    const colors: { [key: string]: string } = {
      'zk-snarks': 'text-pink-400 bg-pink-400/10',
      'zkml': 'text-pink-400 bg-pink-400/10',
      'zk-proofs': 'text-pink-400 bg-pink-400/10',
      'ai': 'text-indigo-400 bg-indigo-400/10',
      'defi': 'text-green-400 bg-green-400/10',
      'depin': 'text-slate-400 bg-slate-400/10',
      'ipfs': 'text-orange-400 bg-orange-400/10',
      'avalanche': 'text-red-400 bg-red-400/10',
      'ethereum': 'text-blue-400 bg-blue-400/10',
      'polygon': 'text-purple-400 bg-purple-400/10',
      'solana': 'text-cyan-400 bg-cyan-400/10',
      'chainlink': 'text-blue-500 bg-blue-500/10',
      'cross-chain': 'text-violet-400 bg-violet-400/10',
      'dnfts': 'text-amber-400 bg-amber-400/10',
      'gamification': 'text-yellow-400 bg-yellow-400/10',
      'conservation': 'text-emerald-400 bg-emerald-400/10',
      'identity': 'text-teal-400 bg-teal-400/10',
      'oracles': 'text-sky-400 bg-sky-400/10',
      'nfts': 'text-fuchsia-400 bg-fuchsia-400/10',
      'marketplace': 'text-rose-400 bg-rose-400/10',
      'payments': 'text-lime-400 bg-lime-400/10',
      'mobile': 'text-gray-400 bg-gray-400/10',
      'governance': 'text-indigo-500 bg-indigo-500/10',
      'dao': 'text-purple-500 bg-purple-500/10',
      'voting': 'text-blue-600 bg-blue-600/10'
    }
    return colors[tech.toLowerCase()] || 'text-slate-400 bg-slate-400/10'
  }

  const getRoleColor = (role: string) => {
    if (role.includes('winner') || role.includes('1st') || role.includes('best')) return 'text-amber-400 bg-amber-400/10'
    if (role.includes('2nd') || role.includes('3rd')) return 'text-orange-400 bg-orange-400/10'
    if (role.includes('finalist')) return 'text-violet-400 bg-violet-400/10'
    if (role.includes('semifinalist')) return 'text-blue-400 bg-blue-400/10'
    return 'text-slate-400 bg-slate-400/10'
  }

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeModal('hackathons')
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    minimizeTab('hackathons', 'hackathon logs')
  }

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 terminal-glow -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] glass rounded-2xl overflow-hidden z-50"
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-violet-400 text-lg mb-4 orbitron"
              >
                [fetching hack logs...]
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                ⚡
              </motion.div>
              <div className="text-slate-400 text-sm mt-4">
                scanning events{showCursor ? '|' : ' '}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
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
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleClose}
                onPointerDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="p-1.5 hover:bg-slate-700/30 rounded-full transition-colors z-[70] relative cursor-pointer"
                title="Close"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors" />
              </button>
              <button
                onClick={handleMinimize}
                onPointerDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="p-1.5 hover:bg-slate-700/30 rounded-full transition-colors z-[70] relative cursor-pointer"
                title="Minimize"
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors" />
              </button>
              <button
                onPointerDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="p-1.5 hover:bg-slate-700/30 rounded-full transition-colors z-[70] relative cursor-pointer"
                title="Maximize"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors" />
              </button>
            </div>
          </div>
          <div className="orbitron text-slate-300 text-sm">hackathon.logs</div>
          <button
            onClick={() => setSortBy(sortBy === 'date' ? 'prize' : 'date')}
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="glass rounded px-3 py-1 text-xs text-slate-300 hover:bg-slate-700/30 transition-colors orbitron cursor-pointer"
          >
            sort: {sortBy}
          </button>
        </div>


        {/* Content */}
        <div className="h-full pb-16">
          <div 
            ref={scrollContainerRef}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 px-6 py-4"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              {sortedLogs.map((log, index) => (
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
                      <span className="text-slate-400 text-sm orbitron">{log.date}</span>
                      <span className={`px-2 py-1 rounded-full text-xs orbitron ${getRoleColor(log.role)}`}>
                        {log.role}
                      </span>
                      {log.verified && (
                        <span className="text-green-400 text-xs" title="verified event">
                          🛡️
                        </span>
                      )}
                    </div>
                    <span className="text-lg" title="hackathon event">
                      🏆
                    </span>
                  </div>

                  <h3 className="text-slate-200 orbitron font-semibold mb-2">{log.event}</h3>
                  
                  <div className="mb-3">
                    <p className="text-slate-400 text-sm leading-relaxed mb-2">
                      <span className="text-slate-300 italic">{log.project}</span> - built with modern tech stack
                      {log.prize && (
                        <span className="block text-amber-400 text-xs mt-1">
                          🏅 {log.prize}
                        </span>
                      )}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {log.tech.map((tech) => (
                        <span
                          key={tech}
                          className={`text-xs px-2 py-1 rounded-full orbitron ${getTechColor(tech)}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4 text-sm">
                      {log.github ? (
                        <a
                          href={log.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline hover:bg-blue-400/10 px-2 py-1 rounded transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📂 github
                        </a>
                      ) : (
                        <span className="text-slate-600 text-xs">
                          📂 -- link unavailable --
                        </span>
                      )}
                      
                      {log.live ? (
                        <a
                          href={log.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 underline hover:bg-green-400/10 px-2 py-1 rounded transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🌐 live demo
                        </a>
                      ) : (
                        <span className="text-slate-600 text-xs">
                          🌐 -- link unavailable --
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Terminal Status Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30"
            >
              <div className="flex items-center justify-between text-xs orbitron">
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">
                    logs: <span className="text-violet-400">{hackathonLogs.length}</span> hackathons
                  </span>
                  <span className="text-slate-400">
                    verified: <span className="text-green-400">{hackathonLogs.filter(log => log.verified).length}</span>
                  </span>
                  <span className="text-slate-400">
                    last updated: <span className="text-amber-400">{new Date().toISOString().split('T')[0].replace(/-/g, '.')}</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-2 flex items-center gap-1">
                <span className="text-green-400 text-xs">nytrixis@dos:~/hackathons$</span>
                <span className={`text-green-400 text-xs ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                  |
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
