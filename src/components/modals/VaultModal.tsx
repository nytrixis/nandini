'use client'

import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'

interface VaultEntry {
  id: string
  name: string
  category: 'research' | 'certificate' | 'credential' | 'achievement' | 'publication'
  type: 'pdf' | 'link' | 'nft' | 'document'
  description: string
  date: string
  issuer?: string
  verificationHash?: string
  ipfsHash?: string
  url?: string
  tags: string[]
  verified: boolean
  // Detailed view fields
  details?: string
  skills?: string[]
  validUntil?: string
  blockchainProof?: string
}

const vaultEntries: VaultEntry[] = [
  {
    id: '1',
    name: 'Intelligent Disaster Management Research Paper',
    category: 'publication',
    type: 'pdf',
    description: 'IEEE and Scopus indexed research paper on AI-powered disaster response systems accepted at ISAAC 2025.',
    date: '2025-04',
    issuer: 'IEEE Conference',
    verificationHash: 'https://drive.google.com/file/d/10hyozKmkqLMQq2hGRtcPRF21cuhnSyIR/view?usp=sharing',
    tags: ['AI', 'Disaster Management', 'Research', 'IEEE', 'Scopus'],
    verified: true,
    details: 'Comprehensive research on leveraging artificial intelligence for intelligent disaster management systems. The paper presents novel approaches to predictive modeling, resource allocation, and emergency response coordination.',
    skills: ['Research Methodology', 'Blockchain', 'AI/ML', 'Data Analysis', 'Academic Writing']
  },
  {
    id: '2',
    name: 'TechGig Code Gladiators Finalist Certificate',
    category: 'achievement',
    type: 'document',
    description: 'Finalist recognition in India\'s biggest coding competition with 300K+ participants.',
    date: '2024-06',
    issuer: 'TechGig',
    verificationHash: 'https://drive.google.com/your-techgig-proof-link',
    tags: ['Competitive Programming', 'Algorithm', 'Problem Solving'],
    verified: true,
    details: 'Achieved finalist status among 300,000+ participants in India\'s premier coding competition. Demonstrated exceptional problem-solving skills and algorithmic thinking.',
    skills: ['Data Structures', 'Algorithms', 'Competitive Programming', 'Time Management']
  },
  {
    id: '3',
    name: 'Myntra WeForShe Semi-Finalist',
    category: 'achievement',
    type: 'document',
    description: 'Semi-finalist in Myntra\'s flagship hackathon focused on women empowerment through technology.',
    date: '2024-08',
    issuer: 'Myntra',
    verificationHash: 'https://drive.google.com/file/d/1qF4BYrBrWX87MuPyLhIFYoNHukfPTQYE/view?usp=sharing',
    tags: ['Hackathon', 'Women Empowerment', 'E-commerce', 'AI/ML', 'Innovation'],
    verified: true,
    details: 'Developed innovative solutions for women empowerment in the e-commerce space. Focused on creating inclusive technology platforms.',
    skills: ['Full-Stack Development', 'UI/UX Design', 'Social Impact', 'AI/ML', 'Innovation']
  },
  {
    id: '4',
    name: 'MUN Outstanding Delegate (3x)',
    category: 'achievement',
    type: 'document',
    description: 'Three-time Outstanding Delegate award winner in various Model United Nations conferences.',
    date: '2023-2024',
    issuer: 'Various MUN Conferences',
    verificationHash: 'https://drive.google.com/file/d/1-slKjvYo-5raKvHpRhpJ7WJo8MsCZwh4/view?usp=sharing',
    tags: ['Diplomacy', 'International Relations', 'Public Speaking', 'Negotiation'],
    verified: true,
    details: 'Consistently recognized for exceptional diplomatic skills, policy knowledge, and debate performance across multiple international conferences.',
    skills: ['Diplomacy', 'International Relations', 'Negotiation', 'Research']
  },
  {
    id: '5',
    name: 'GirlScript Summer of Code Mentor Certificate',
    category: 'credential',
    type: 'document',
    description: 'Official mentor recognition for guiding 20+ contributors across multiple tech stacks in open source development.',
    date: '2024-09',
    issuer: 'GirlScript Foundation',
    verificationHash: 'https://drive.google.com/file/d/1VzpVWL9p9ECG1lwqUpA6PQD_t9mQc7qC/view?usp=sharing',
    tags: ['Mentorship', 'Open Source', 'Community', 'Leadership'],
    verified: true,
    details: 'Mentored 20+ contributors in open source development, providing guidance on various technologies and best practices.',
    skills: ['Mentorship', 'Open Source', 'Community Building', 'Technical Leadership']
  },
  {
    id: '6',
    name: 'Hack4Bengal Core Team (Web)',
    category: 'credential',
    type: 'document',
    description: 'Served as a core team member for Hack4Bengal 4.0, Eastern India’s largest hackathon, contributing to website development and tech support.',
    date: '2025-03',
    issuer: 'Hack4Bengal Team',
    verificationHash: 'https://hack4bengal.tech/team',
    tags: ['Hackathon Organization', 'Web Development', 'Leadership', 'Event Tech'],
    verified: true,
    details: 'Led web development efforts for Hack4Bengal 4.0, coordinating platform architecture, deployment, and community tech engagement.',
    skills: ['Team Collaboration', 'Next.js', 'UI/UX', 'Deployment', 'Event Tech']
  }
]


export default function VaultModal() {
  const { closeModal, minimizeTab } = useModalStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<VaultEntry | null>(null)
  const [filterBy, setFilterBy] = useState<'all' | 'research' | 'certificate' | 'credential' | 'achievement' | 'publication'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'category'>('date')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEntries = vaultEntries.filter(entry => {
    const matchesFilter = filterBy === 'all' || entry.category === filterBy
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const sortedEntries = [...filteredEntries].sort((a, b) => {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'research': return 'text-violet-400 bg-violet-400/10'
      case 'certificate': return 'text-blue-400 bg-blue-400/10'
      case 'credential': return 'text-green-400 bg-green-400/10'
      case 'achievement': return 'text-amber-400 bg-amber-400/10'
      case 'publication': return 'text-cyan-400 bg-cyan-400/10'
      default: return 'text-slate-400 bg-slate-400/10'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'link': return '🔗'
      case 'nft': return '🎨'
      case 'document': return '📋'
      default: return '📁'
    }
  }

  const handleCardClick = (entry: VaultEntry, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEntry(entry)
  }

  const handleBackToList = () => {
    setSelectedEntry(null)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeModal('vault')
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    minimizeTab('vault', 'vault')
  }

  const handleVerify = (entry: VaultEntry) => {
    if (entry.verificationHash) {
      window.open(`${entry.verificationHash}`, '_blank')
    }
  }

  // Detailed view component
  const DetailedView = ({ entry }: { entry: VaultEntry }) => (
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
          ← back to vault
        </button>

        {/* Entry header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{getTypeIcon(entry.type)}</span>
            <h2 className="text-2xl orbitron text-slate-100 font-semibold">{entry.name}</h2>
            {entry.verified && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-400/10 border border-green-400/20 rounded text-xs text-green-400">
                <span>✓</span>
                <span>verified</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-2 py-1 rounded text-xs orbitron ${getCategoryColor(entry.category)}`}>
              {entry.category}
            </span>
            <span className="text-slate-400 text-sm">{entry.date}</span>
            {entry.issuer && (
              <span className="text-slate-400 text-sm">by {entry.issuer}</span>
            )}
          </div>
          <p className="text-slate-300 leading-relaxed">{entry.description}</p>
        </div>

        {/* Details */}
        {entry.details && (
          <div className="mb-8">
            <h3 className="text-slate-200 orbitron text-lg mb-3">Details</h3>
            <p className="text-slate-400 leading-relaxed">{entry.details}</p>
          </div>
        )}

        {/* Skills */}
        {entry.skills && (
          <div className="mb-8">
            <h3 className="text-slate-200 orbitron text-lg mb-4">Skills Demonstrated</h3>
            <div className="space-y-2">
              {entry.skills.map((skill, index) => (
                <div key={index} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-400 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-slate-200 orbitron text-lg mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-800/50 border border-slate-700/30 rounded text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Verification Details */}
        <div className="mb-8">
          <h3 className="text-slate-200 orbitron text-lg mb-4">Verification</h3>
          <div className="space-y-3">
            {entry.verificationHash && (
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700/30">
                <span className="text-slate-400 text-sm">Hash</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-xs font-mono">
                    {entry.verificationHash.slice(0, 10)}...{entry.verificationHash.slice(-8)}
                  </span>
                  <button
                    onClick={() => handleVerify(entry)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="text-violet-400 hover:text-violet-300 text-xs cursor-pointer"
                  >
                    verify →
                  </button>
                </div>
              </div>
            )}
            {entry.ipfsHash && (
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700/30">
                <span className="text-slate-400 text-sm">IPFS</span>
                <span className="text-slate-300 text-xs font-mono">
                  {entry.ipfsHash.slice(0, 10)}...{entry.ipfsHash.slice(-8)}
                </span>
              </div>
            )}
            {entry.blockchainProof && (
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700/30">
                <span className="text-slate-400 text-sm">Blockchain</span>
                <span className="text-slate-300 text-sm">{entry.blockchainProof}</span>
              </div>
            )}
            {entry.validUntil && (
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded border border-slate-700/30">
                <span className="text-slate-400 text-sm">Valid Until</span>
                <span className="text-slate-300 text-sm">{entry.validUntil}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <h3 className="text-slate-200 orbitron text-lg mb-4">Actions</h3>
          <div className="space-y-3">
            {entry.verificationHash && (
              <button
                onClick={() => handleVerify(entry)}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-700/30 transition-colors group w-full cursor-pointer"
              >
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                  <span className="text-slate-300">🔍</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-slate-200 text-sm font-medium">Verify on Blockchain</div>
                  <div className="text-slate-500 text-xs">View transaction on Etherscan</div>
                </div>
                <div className="text-slate-500 group-hover:text-slate-400 transition-colors">→</div>
              </button>
            )}
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:bg-slate-700/30 transition-colors group cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                  <span className="text-slate-300">🔗</span>
                </div>
                <div className="flex-1">
                  <div className="text-slate-200 text-sm font-medium">View Original</div>
                  <div className="text-slate-500 text-xs">Open external link</div>
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
          <div className="orbitron text-slate-300 text-sm">
            {selectedEntry ? selectedEntry.name.toLowerCase() : 'vault.dir'}
          </div>
          {!selectedEntry && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                className="glass rounded px-2 py-1 text-xs text-slate-300 bg-transparent border-none outline-none w-20 cursor-text"
              />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'all' | 'research' | 'certificate' | 'credential' | 'achievement' | 'publication')}
                onPointerDown={(e) => e.stopPropagation()}
                className="glass rounded px-2 py-1 text-xs text-slate-300 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">all</option>
                <option value="research" className="bg-slate-800">research</option>
                <option value="certificate" className="bg-slate-800">certificates</option>
                <option value="credential" className="bg-slate-800">credentials</option>
                <option value="achievement" className="bg-slate-800">achievements</option>
                <option value="publication" className="bg-slate-800">publications</option>
              </select>
              <button
                onClick={() => setSortBy(sortBy === 'date' ? 'name' : sortBy === 'name' ? 'category' : 'date')}
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
          )}
        </div>


        {/* Content */}
        {selectedEntry ? (
          <DetailedView entry={selectedEntry} />
        ) : (
          <div className="h-full pb-16">
            <div
              className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 px-6 py-4"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 gap-4">
                {sortedEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-5 rounded-xl border border-slate-700/30 bg-slate-800/20 hover:bg-slate-700/20 transition-all duration-300 cursor-pointer group"
                    onClick={(e) => handleCardClick(entry, e)}
                  >
                    {/* Verification indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {entry.verified && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                      <span className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">
                        view details →
                      </span>
                    </div>

                    {/* Entry info */}
                    <div className="pr-20">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl">{getTypeIcon(entry.type)}</span>
                        <h3 className="text-slate-200 orbitron font-semibold text-lg">{entry.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs orbitron ${getCategoryColor(entry.category)}`}>
                          {entry.category}
                        </span>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{entry.description}</p>

                      {/* Tags preview */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {entry.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-700/30 rounded text-xs text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {entry.tags.length > 4 && (
                          <span className="px-2 py-1 text-xs text-slate-500">
                            +{entry.tags.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500">{entry.date}</span>
                        {entry.issuer && (
                          <span className="text-slate-500">by {entry.issuer}</span>
                        )}
                        {entry.verified && (
                          <span className="text-green-400">✓ verified</span>
                        )}
                        {entry.validUntil && (
                          <span className="text-slate-500">valid until {entry.validUntil}</span>
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
                      total: <span className="text-violet-400">{vaultEntries.length}</span> entries
                    </span>
                    <span className="text-slate-400">
                      verified: <span className="text-green-400">{vaultEntries.filter(e => e.verified).length}</span>
                    </span>
                    <span className="text-slate-400">
                      certificates: <span className="text-blue-400">{vaultEntries.filter(e => e.category === 'certificate').length}</span>
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