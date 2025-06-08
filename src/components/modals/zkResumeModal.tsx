'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'

interface Achievement {
  id: string
  title: string
  description: string
  zkProof: string
  verified: boolean
  icon: string
}

interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  zkTech: string
  link?: string
}

interface HackathonWin {
  id: string
  event: string
  prize: string
  project: string
  date: string
  verified: boolean
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'zk-verified innovator',
    description: 'built zk-powered credential & healthcare systems with real-world impact',
    zkProof: '0xcred...vault',
    verified: true,
    icon: '🧠'
  },
  {
    id: '2',
    title: 'multi-track hackathon winner',
    description: 'won across DeFi, healthcare, zk, and wildlife tracks in national hackathons',
    zkProof: '0xnyv3...xzk',
    verified: true,
    icon: '🏆'
  },
  {
    id: '3',
    title: 'decentralized builder',
    description: 'contributed to 5+ dApps including IPFS + EVM + ZK integrations',
    zkProof: '0xdhan...ipfs',
    verified: true,
    icon: '🌐'
  }
]


const techStack = [
  { name: 'solidity', icon: '⟠', color: 'text-blue-400' },
  { name: 'react', icon: '⚛️', color: 'text-cyan-400' },
  { name: 'next.js', icon: '➡️', color: 'text-gray-300' },
  { name: 'express', icon: '🚂', color: 'text-gray-400' },
  { name: 'node.js', icon: '🟢', color: 'text-green-400' },
  { name: 'python', icon: '🐍', color: 'text-yellow-400' },
  { name: 'php', icon: '🐘', color: 'text-indigo-400' },
  { name: 'wordpress', icon: '📝', color: 'text-blue-500' },
  { name: 'mongodb', icon: '🍃', color: 'text-green-600' },
  { name: 'docker', icon: '🐳', color: 'text-sky-400' },
  { name: 'git', icon: '🌿', color: 'text-red-500' },
  { name: 'github', icon: '🐙', color: 'text-white' },
  { name: 'ethereum', icon: '♦️', color: 'text-purple-400' },
  { name: 'polygon', icon: '🔷', color: 'text-violet-400' },
  { name: 'ipfs', icon: '🌐', color: 'text-orange-400' },
  { name: 'zk-snarks', icon: '🔐', color: 'text-pink-400' }
]

const featuredProjects: Project[] = [
  {
    id: '3',
    name: 'CredVault',
    description: 'ZK + AI verified credentialing with dynamic NFTs and reputation scoring',
    tags: ['zkps', 'ai', 'dnfts'],
    zkTech: 'zk-SNARKs'
  },
  {
    id: '2',
    name: 'Dhanvantari Protocol',
    description: 'Decentralized patient data storage & access using Avalanche + IPFS',
    tags: ['healthtech', 'privacy', 'ipfs'],
    zkTech: 'data privacy layer'
  },
  {
    id: '1',
    name: 'Nyvex Platform',
    description: 'Smart SIPs for startup funding with zk-proofed investor identity',
    tags: ['defi', 'investment', 'zkml'],
    zkTech: 'zkML + identity'
  }
]


const hackathonWins: HackathonWin[] = [
  {
    id: '1',
    event: 'Aarohan 2025',
    prize: '1st Place - DeFi Track',
    project: 'Nyvex Platform',
    date: '2025.01',
    verified: true
  },
  {
    id: '4',
    event: 'Hack4Bengal 3.0',
    prize: 'Best Build on Avalanche',
    project: 'Dhanvantari Protocol',
    date: '2024.06',
    verified: true
  },
  {
    id: '2',
    event: 'StatusCode 1',
    prize: '2nd @ Wildlife Track',
    project: 'WildX',
    date: '2024.08',
    verified: true
  },
  {
    id: '3',
    event: 'Deco.cx - HTMX edition',
    prize: 'overall winner & deno bounty',
    project: 'Poozle @deco.cx',
    date: '2024.07',
    verified: true
  },
  {
    id: '5',
    event: 'DevSculpt Innovathon',
    prize: 'Overall Winner',
    project: 'Ruche Platform',
    date: '2023.09',
    verified: true
  },
  {
    id: '6',
    event: 'Myntra WeforShe, TechGig Code Gladiators -24, Frosthacks 1',
    prize: 'Finalist',
    project: 'N/A',
    date: '2024-25',
    verified: true
  }
]


export default function ZkResumeModal() {
  const { closeModal, minimizeTab } = useModalStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  // Generate floating particles for background animation
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

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
    closeModal('zkresume')
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    minimizeTab('zkresume', 'zkresume')
  }

  const handleMintResume = () => {
    setIsWalletModalOpen(true)
  }

  const handleDownloadPDF = () => {
    console.log('downloading pdf resume...')
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
        className={`fixed top-1/2 left-1/2 terminal-glow -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] glass rounded-2xl overflow-hidden z-50 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
              initial={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                opacity: 0
              }}
              animate={{
                y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 4,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

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
          <div className="orbitron text-slate-300 text-sm">zkresume.eth</div>
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div className="h-full pb-20">
          <div
            className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 px-6 py-4 pb-20"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
                  <span className="text-white text-sm orbitron">n</span>
                </div>
                <div>
                  <h1 className="orbitron text-slate-200 font-semibold mb-1">
                    nytrixis.eth
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    web3 builder | ai explorer | hackathon finalist
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">verified</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-700/30 mb-4">
              {['overview', 'achievements', 'projects', 'hackathons'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    activeSection === section
                      ? 'text-violet-400 border-b-2 border-violet-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              {activeSection === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="orbitron text-slate-200 font-semibold mb-2">tech stack</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {techStack.map((tech, index) => (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="glass rounded-lg p-3 text-center hover:bg-slate-700/30 transition-colors"
                        >
                          <div className={`text-lg mb-1 ${tech.color}`}>{tech.icon}</div>
                          <div className="text-xs text-slate-300">{tech.name}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'achievements' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-lg p-4 border border-slate-700/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{achievement.icon}</span>
                          <div>
                            <h4 className="orbitron font-semibold text-slate-200 mb-2">{achievement.title}</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">{achievement.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-violet-400">zkproof:</span>
                              <code className="text-sm text-slate-300 bg-slate-800/50 px-2 py-1 rounded">
                                {achievement.zkProof}
                              </code>
                            </div>
                          </div>
                        </div>
                        {achievement.verified && (
                          <div className="flex items-center gap-1 text-green-400">
                            <span className="text-sm">✓</span>
                            <span className="text-sm">verified</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeSection === 'projects' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {featuredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                                            className="glass rounded-lg p-4 border border-slate-700/30 hover:border-violet-500/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="orbitron font-semibold text-slate-200 mb-2">{project.name}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed mb-2">{project.description}</p>
                        </div>
                        <div className="text-sm text-violet-400 bg-violet-400/10 px-2 py-1 rounded">
                          {project.zkTech}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-sm px-2 py-1 bg-slate-800/50 text-slate-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeSection === 'hackathons' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-purple-600"></div>
                    
                    {hackathonWins.map((win, index) => (
                      <motion.div
                        key={win.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="relative flex items-start gap-4 pb-6"
                      >
                        {/* Timeline dot */}
                        <div className="relative z-10 w-3 h-3 bg-violet-500 rounded-full mt-2 flex-shrink-0">
                          <div className="absolute inset-0 bg-violet-400 rounded-full animate-ping opacity-75"></div>
                        </div>
                        
                        <div className="glass rounded-lg p-4 flex-1 border border-slate-700/30">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="orbitron font-semibold text-slate-200 mb-2">{win.event}</h4>
                              <p className="text-sm text-amber-400 font-semibold">{win.prize}</p>
                            </div>
                            <div className="text-sm text-slate-400">{win.date}</div>
                          </div>
                          <p className="text-sm text-slate-400 mb-2 leading-relaxed">project: {win.project}</p>
                          {win.verified && (
                            <div className="flex items-center gap-1 text-green-400">
                              <span className="text-sm">🏆</span>
                              <span className="text-sm">verified win</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Area - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleMintResume}
                className="group relative px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg orbitron font-semibold text-white hover:from-violet-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  🪙 mint resume
                </span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-3 glass rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center gap-2 text-sm"
              >
                📄 download pdf
              </button>
            </div>

            {/* Status Bar - moved up with proper spacing */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">proofs: valid</span>
                </div>
                <div className="text-slate-400">identity: nytrixis.eth</div>
                <div className="text-violet-400">chain: polygon</div>
              </div>
              
              {/* Tooltip badge - positioned in bottom right corner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-lg px-3 py-2 text-xs text-slate-300"
              >
                zero-knowledge verified skill token
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wallet Modal Overlay */}
        <AnimatePresence>
          {isWalletModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"
              onClick={() => setIsWalletModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-xl p-6 w-80"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="orbitron text-slate-200 font-semibold mb-4">connect wallet</h3>
                <div className="space-y-3">
                  <button className="w-full glass rounded-lg p-3 text-left hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">🦊</div>
                      <span className="text-white text-sm">metamask</span>
                    </div>
                  </button>
                  <button className="w-full glass rounded-lg p-3 text-left hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">🔷</div>
                      <span className="text-white text-sm">walletconnect</span>
                    </div>
                  </button>
                  <button className="w-full glass rounded-lg p-3 text-left hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">⚡</div>
                      <span className="text-white text-sm">phantom</span>
                    </div>
                  </button>
                </div>
                <button
                  onClick={() => setIsWalletModalOpen(false)}
                  className="w-full mt-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
