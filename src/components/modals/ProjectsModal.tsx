'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'

interface ProjectEntry {
  id: string
  name: string
  category: string
  status: 'live' | 'development' | 'archived'
  tech: string[]
  description: string
  github?: string
  live?: string
  date: string
  // Detailed view fields
  overview?: string
  features?: string[]
  challenges?: string[]
  screenshots?: string[]
  metrics?: {
    users?: string
    performance?: string
    uptime?: string
  }
}

const projectLogs: ProjectEntry[] = [
  {
    id: '1',
    name: 'Nyvex Platform',
    category: 'DeFi',
    status: 'live',
    tech: ['Next.js', 'Solidity', 'zkML', 'TypeScript'],
    description: 'Decentralized startup investment platform with AI-powered due diligence',
    github: 'https://github.com/nytrixis/nyvex',
    live: 'https://nyvex-warp.vercel.app',
    date: '2025-01',
    overview: 'Nyvex revolutionizes startup funding through blockchain technology, featuring smart investment pools, proof-of-investment NFTs, and cross-chain compatibility.',
    features: [
      'Smart investment pools with automated distribution',
      'Proof-of-investment NFTs for portfolio tracking',
      'AI-powered startup due diligence',
      'Cross-chain compatibility',
      'Decentralized governance system'
    ],
    challenges: [
      'Implementing zkML for privacy-preserving analytics',
      'Cross-chain bridge security considerations',
      'Gas optimization for complex smart contracts'
    ],
    screenshots: ['/images/nyvex-dashboard.png', '/images/nyvex-pools.png'],
    metrics: {
      users: '500+ early adopters',
      performance: '99.9% uptime',
      uptime: 'Live since Jan 2025'
    }
  },
  {
    id: '2',
    name: 'CredVault',
    category: 'Identity',
    status: 'development',
    tech: ['React', 'zk-SNARKs', 'IPFS', 'Node.js'],
    description: 'Zero-knowledge credential verification system with dynamic NFTs',
    github: 'https://github.com/nytrixis/credvault',
    date: '2024-12',
    overview: 'CredVault enables secure, privacy-preserving credential verification using zero-knowledge proofs.',
    features: [
      'Zero-knowledge credential verification',
      'Dynamic NFTs that update with achievements',
      'Decentralized storage via IPFS',
      'Multi-institution support'
    ],
    challenges: [
      'zk-SNARK circuit optimization',
      'Dynamic NFT metadata updates',
      'Institution onboarding process'
    ]
  },
  {
    id: '3',
    name: 'Dhanvantari Protocol',
    category: 'Healthcare',
    status: 'live',
    tech: ['Avalanche', 'IPFS', 'React', 'Express'],
    description: 'Decentralized healthcare infrastructure for transparent patient data management',
    github: 'https://github.com/nytrixis/dhanvantari',
    date: '2024-11',
    overview: 'A comprehensive healthcare management system built on blockchain for data security and transparency.',
    features: [
      'Secure patient data storage',
      'Doctor-patient interaction portal',
      'Medical history tracking',
      'Insurance claim automation'
    ]
  },
  {
    id: '4',
    name: 'WildX Expedition',
    category: 'Conservation',
    status: 'archived',
    tech: ['Python', 'TensorFlow', 'React', 'MongoDB'],
    description: 'Wildlife conservation dashboard with AI gamification',
    github: 'https://github.com/nytrixis/wildx',
    date: '2024-09',
    overview: 'Gamified platform for wildlife conservation awareness and action tracking.',
    features: [
      'AI-powered species identification',
      'Conservation action tracking',
      'Gamified user engagement',
      'Real-time conservation metrics'
    ]
  },
  {
    id: '5',
    name: 'Ruche',
    category: 'E-commerce',
    status: 'live',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
    description: 'Fashion-forward product browser with AI recommendations',
    github: 'https://github.com/nytrixis/ruche',
    date: '2023-09',
    overview: 'Modern e-commerce platform focused on fashion with intelligent product discovery.',
    features: [
      'AI-powered product recommendations',
      'Advanced filtering and search',
      'Wishlist and cart management',
      'Trending products analytics'
    ]
  },
  {
    id: '6',
    name: 'VedVaani',
    category: 'Education',
    status: 'development',
    tech: ['React Native', 'OpenAI', 'Firebase', 'Node.js'],
    description: 'AI-powered Hindu scripture Q&A with multilingual support',
    date: '2024-10',
    overview: 'Digital platform for exploring Hindu scriptures with AI-assisted learning.',
    features: [
      'Scripture-based Q&A system',
      'Daily wisdom insights',
      'Multilingual microlearning',
      'Personal wisdom journal'
    ]
  }
]

// Add this useEffect in your ProjectsModal component



export default function ProjectsModal() {
  const { closeModal, minimizeTab } = useModalStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null)
  const [filterBy, setFilterBy] = useState<'all' | 'live' | 'development' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'category'>('date')

  useEffect(() => {
  const { selectedProject: selectedProjectId } = useModalStore.getState()
  if (selectedProjectId) {
    const project = projectLogs.find(p => p.id === selectedProjectId)
    if (project) {
      setSelectedProject(project)
      // Clear the selected project from store after using it
      useModalStore.getState().setSelectedProject('')
    }
  }
}, [])

  const filteredProjects = projectLogs.filter(project => 
    filterBy === 'all' || project.status === filterBy
  )

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }
    return a.category.localeCompare(b.category)
  })

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }))
    setIsDragging(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'development': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'archived': return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'defi': 'text-violet-400 bg-violet-400/10',
      'identity': 'text-cyan-400 bg-cyan-400/10',
      'healthcare': 'text-emerald-400 bg-emerald-400/10',
      'conservation': 'text-amber-400 bg-amber-400/10',
      'e-commerce': 'text-pink-400 bg-pink-400/10',
      'education': 'text-indigo-400 bg-indigo-400/10'
    }
    return colors[category.toLowerCase()] || 'text-slate-400 bg-slate-400/10'
  }

  const handleCardClick = (project: ProjectEntry, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedProject(project)
  }

  const handleBackToList = () => {
    setSelectedProject(null)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeModal('projects')
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    minimizeTab('projects', 'projects')
  }

  // Detailed view component
  const DetailedView = ({ project }: { project: ProjectEntry }) => (
    <div className="h-full pb-16">
      <div 
        className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 px-6 py-4"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleBackToList}
          onPointerDown={(e) => e.stopPropagation()}
          className="mb-6 flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors text-sm"
        >
          ← back to projects
        </button>

        {/* Project header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl orbitron text-slate-100 font-semibold">{project.name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs orbitron border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-2 py-1 rounded text-xs orbitron ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
            <span className="text-slate-400 text-sm">{project.date}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{project.description}</p>
        </div>

        {/* Overview */}
        {project.overview && (
          <div className="mb-8">
            <h3 className="text-slate-200 orbitron text-lg mb-3">Overview</h3>
            <p className="text-slate-400 leading-relaxed">{project.overview}</p>
          </div>
        )}

        {/* Screenshots */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="mb-8">
            <h3 className="text-slate-200 orbitron text-lg mb-4">Screenshots</h3>
            <div className="grid grid-cols-1 gap-4">
              {project.screenshots.map((screenshot, index) => (
                <div key={index} className="relative bg-slate-800/30 rounded-lg overflow-hidden border border-slate-700/30">
                  <img
                    src={screenshot}
                    alt={`${project.name} screenshot ${index + 1}`}
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.parentElement!.innerHTML = `
                        <div class="flex items-center justify-center h-32 text-slate-500 text-sm">
                          Screenshot not available
                        </div>
                      `
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {project.features && (
          <div className="mb-8">
            <h3 className="text-slate-200 orbitron text-lg mb-4">Key Features</h3>
            <div className="space-y-2">
              {project.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-400 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Challenges */}
        {project.challenges && (
          <div className="mb-8">
            <h3 className="text-slate-200 orbitron text-lg mb-4">Technical Challenges</h3>
            <div className="space-y-2">
              {project.challenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-400 text-sm">{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-8">
          <h3 className="text-slate-200 orbitron text-lg mb-4">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-slate-800/50 border border-slate-700/30 rounded text-xs text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        {project.metrics && (
          <div className="mb-8">
            <h3 className="text-slate-200 orbitron text-lg mb-4">Project Metrics</h3>
            <div className="grid grid-cols-1 gap-3">
              {project.metrics.users && (
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700/30">
                  <span className="text-slate-400 text-sm">Users</span>
                  <span className="text-slate-300 text-sm">{project.metrics.users}</span>
                </div>
              )}
              {project.metrics.performance && (
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700/30">
                  <span className="text-slate-400 text-sm">Performance</span>
                  <span className="text-slate-300 text-sm">{project.metrics.performance}</span>
                </div>
              )}
              {project.metrics.uptime && (
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700/30">
                                    <span className="text-slate-400 text-sm">Status</span>
                  <span className="text-slate-300 text-sm">{project.metrics.uptime}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="mb-8">
          <h3 className="text-slate-200 orbitron text-lg mb-4">Links</h3>
          <div className="space-y-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-700/30 transition-colors group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                  <span className="text-slate-300">{'</>'}</span>
                </div>
                <div className="flex-1">
                  <div className="text-slate-200 text-sm font-medium">Source Code</div>
                  <div className="text-slate-500 text-xs">View on GitHub</div>
                </div>
                <div className="text-slate-500 group-hover:text-slate-400 transition-colors">→</div>
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-700/30 transition-colors group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                  <span className="text-slate-300">◉</span>
                </div>
                <div className="flex-1">
                  <div className="text-slate-200 text-sm font-medium">Live Application</div>
                  <div className="text-slate-500 text-xs">Try the demo</div>
                </div>
                <div className="text-slate-500 group-hover:text-slate-400 transition-colors">→</div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )

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
        className={`fixed top-1/4 left-1/2 terminal-glow -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] glass rounded-2xl overflow-hidden z-50 ${
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
          <div className="orbitron text-slate-300 text-sm">
            {selectedProject ? selectedProject.name.toLowerCase() : 'projects.dir'}
          </div>
          {!selectedProject && (
            <div className="flex items-center gap-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                onPointerDown={(e) => e.stopPropagation()}
                className="glass rounded px-2 py-1 text-xs text-slate-300 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">all</option>
                <option value="live" className="bg-slate-800">live</option>
                <option value="development" className="bg-slate-800">dev</option>
                <option value="archived" className="bg-slate-800">archived</option>
              </select>
              <button
                onClick={() => setSortBy(sortBy === 'date' ? 'name' : sortBy === 'name' ? 'category' : 'date')}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="glass rounded px-3 py-1 text-xs text-slate-300 hover:bg-slate-700/30 transition-colors orbitron cursor-pointer"
              >
                sort: {sortBy}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {selectedProject ? (
          <DetailedView project={selectedProject} />
        ) : (
          <div className="h-full pb-16">
            <div
              className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 px-6 py-4"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 gap-4">
                {sortedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-5 rounded-xl border border-slate-700/30 bg-slate-800/20 hover:bg-slate-700/20 transition-all duration-300 cursor-pointer group"
                    onClick={(e) => handleCardClick(project, e)}
                  >
                    {/* Status indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        project.status === 'live' ? 'bg-green-400' :
                        project.status === 'development' ? 'bg-blue-400' : 'bg-slate-400'
                      }`}></div>
                      <span className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">
                        view details →
                      </span>
                    </div>

                    {/* Project info */}
                    <div className="pr-20">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-slate-200 orbitron font-semibold text-lg">{project.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs orbitron ${getCategoryColor(project.category)}`}>
                          {project.category}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                      
                      {/* Tech stack preview */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tech.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-slate-700/30 rounded text-xs text-slate-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="px-2 py-1 text-xs text-slate-500">
                            +{project.tech.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Links preview */}
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500">{project.date}</span>
                        {project.github && (
                          <span className="text-slate-500">source available</span>
                        )}
                        {project.live && (
                          <span className="text-slate-500">live demo</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30"
              >
                <div className="flex items-center justify-between text-xs orbitron">
                  <div className="flex items-center gap-6">
                    <span className="text-slate-400">
                      total: <span className="text-violet-400">{projectLogs.length}</span> projects
                    </span>
                    <span className="text-slate-400">
                      live: <span className="text-green-400">{projectLogs.filter(p => p.status === 'live').length}</span>
                    </span>
                    <span className="text-slate-400">
                      in development: <span className="text-blue-400">{projectLogs.filter(p => p.status === 'development').length}</span>
                    </span>
                  </div>
                  <span className="text-slate-400">
                    last updated: <span className="text-amber-400">{new Date().toISOString().split('T')[0].replace(/-/g, '.')}</span>
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

