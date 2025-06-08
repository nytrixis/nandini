'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'
import { fetchGitHubProfile, fetchGitHubRepos, fetchGitHubReadme, fetchGitHubContributions } from '@/lib/github'
import Image from 'next/image'


interface GitHubUser {
  login: string
  name: string
  bio: string
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  location: string
  blog: string
  company: string
}

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
}

export default function GitHubProfileModal() {
  const { closeModal } = useModalStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [, setReadme] = useState<string | null>(null)
  const [contributions, setContributions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'repos' | 'contributions'>('overview')

  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        setLoading(true)
        const [userProfile, userRepos, userReadme, userContributions] = await Promise.all([
  fetchGitHubProfile('nytrixis'),
  fetchGitHubRepos('nytrixis'),
  fetchGitHubReadme('nytrixis'),
  fetchGitHubContributions('nytrixis') // or fetchGitHubContributions('nytrixis') if using token
])

setUser(userProfile)
setRepos(userRepos)
setReadme(userReadme)
setContributions(userContributions)
      } catch (error) {
        console.error('Failed to load GitHub data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGitHubData()
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
    closeModal('github')
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      CSS: '#563d7c',
      HTML: '#e34c26',
      Go: '#00ADD8',
      Rust: '#dea584',
      PHP: '#4F5D95'
    }
    return colors[language] || '#8b5cf6'
  }

  const ContributionGraph = () => {
    const weeks = []
    for (let i = 0; i < contributions.length; i += 7) {
      weeks.push(contributions.slice(i, i + 7))
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg orbitron text-slate-200">Contribution Activity</h3>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${
                    day.level === 0 ? 'bg-slate-800' :
                    day.level === 1 ? 'bg-violet-900/50' :
                    day.level === 2 ? 'bg-violet-700/70' :
                    day.level === 3 ? 'bg-violet-500/80' :
                    'bg-violet-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  title={`${day.count} contributions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${
                  level === 0 ? 'bg-slate-800' :
                  level === 1 ? 'bg-violet-900/50' :
                  level === 2 ? 'bg-violet-700/70' :
                  level === 3 ? 'bg-violet-500/80' :
                  'bg-violet-400'
                }`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className="text-center">
          <motion.div
            className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className="text-violet-400 orbitron">Loading GitHub profile...</div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
      >
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
          className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-6xl max-h-[90vh] glass rounded-2xl overflow-hidden terminal-glow ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/30"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              {user?.avatar_url && (
                <Image
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-violet-500/50"
                />
              )}
              <div>
                <h2 className="text-xl orbitron text-slate-200">{user?.name || user?.login}</h2>
                <p className="text-slate-400 text-sm">@{user?.login}</p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg glass hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <path d="m18 6-12 12"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-700/30 bg-slate-800/20">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'repos', label: 'Repositories' },
              { id: 'contributions', label: 'Contributions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`px-6 py-3 text-sm orbitron transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-violet-400 border-b-2 border-violet-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div
    className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin  p-5 scrollbar-track-slate-800 scrollbar-thumb-slate-600"
    onPointerDown={(e) => e.stopPropagation()}
  >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl orbitron text-violet-400">{user?.public_repos}</div>
                    <div className="text-slate-400 text-sm">Repositories</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl orbitron text-violet-400">{user?.followers}</div>
                    <div className="text-slate-400 text-sm">Followers</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl orbitron text-violet-400">{user?.following}</div>
                    <div className="text-slate-400 text-sm">Following</div>
                  </div>
                </div>

                {/* Bio & Info */}
                <div className="glass rounded-xl p-6 space-y-4">
                  {user?.bio && (
                    <div>
                      <h3 className="text-lg orbitron text-slate-200 mb-2">Bio</h3>
                      <p className="text-slate-300">{user.bio}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {user?.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">📍</span>
                        <span className="text-slate-300">{user.location}</span>
                      </div>
                    )}

                    
                    {user?.company && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">🏢</span>
                        <span className="text-slate-300">{user.company}</span>
                      </div>
                    )}
                    {user?.blog && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">🔗</span>
                        <a 
                          href={user.blog} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          {user.blog}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📅</span>
                      <span className="text-slate-300">
                        Joined {new Date(user?.created_at || '').toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

{/* README - Replace the existing README section with this */}
<div className="glass rounded-xl p-6">
  <h3 className="text-lg orbitron text-slate-200 mb-4">README.md</h3>
  <div className="readme-content space-y-6">
    {/* Header */}
    <div className="text-center space-y-4 pb-6 border-b border-violet-500/20">
      <h1 className="text-3xl orbitron text-violet-400 mb-2">
        Hi 👋, I&pos;m Nandini Pandey
      </h1>
      <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
        A web aficionado deeply immersed in the world of coding, driven by a passion for 
        problem-solving and dedicated to crafting clean, efficient code for the digital realm.
      </p>
    </div>

    {/* Current Status Grid */}
    <div className="grid md:grid-cols-2 gap-4">
      <div className="glass rounded-lg p-4 border border-violet-500/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🔭</span>
          <span className="text-violet-300 orbitron text-sm">Currently Working On</span>
        </div>
        <p className="text-slate-300">
          <span className="text-violet-400 font-semibold">Starflix</span> - Exploring celestial formations through ML
        </p>
      </div>
      
      <div className="glass rounded-lg p-4 border border-violet-500/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🌱</span>
          <span className="text-violet-300 orbitron text-sm">Currently Learning</span>
        </div>
        <p className="text-slate-300">AI/ML</p>
      </div>
    </div>

    {/* Info Cards */}
    <div className="space-y-4">
      <div className="glass rounded-lg p-4 border border-slate-700/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">👨‍💻</span>
          <span className="text-slate-300">All of my projects are available</span>
          <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors underline decoration-violet-500/50">
            here
          </a>
        </div>
      </div>

      <div className="glass rounded-lg p-4 border border-slate-700/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">💬</span>
          <span className="text-slate-300">Ask me about</span>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">
              Full Stack Web Development
            </span>
            <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">
              Data Structures & Algorithms
            </span>
          </div>
        </div>
      </div>

      <div className="glass rounded-lg p-4 border border-slate-700/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">📫</span>
          <span className="text-slate-300">Reach me at</span>
          <a 
            href="mailto:ajayapandey2404@gmail.com" 
            className="text-violet-400 hover:text-violet-300 transition-colors underline decoration-violet-500/50"
          >
            ajayapandey2404@gmail.com
          </a>
        </div>
      </div>

      <div className="glass rounded-lg p-4 border border-amber-500/20">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚡</span>
          <span className="text-amber-300 italic">who said you could either code OR paint?</span>
        </div>
      </div>
    </div>

    {/* Connect Section */}
    <div className="space-y-4">
      <h3 className="text-xl orbitron text-violet-300 flex items-center gap-2">
        <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
        Connect with me
      </h3>
      <div className="flex gap-3">
        {[
          { name: 'GitHub', icon: '🐙' },
          { name: 'LinkedIn', icon: '💼' },
          { name: 'Twitter', icon: '🐦' },
          { name: 'Portfolio', icon: '🌐' }
        ].map((social) => (
          <div key={social.name} className="glass rounded-lg p-3 hover:bg-violet-500/10 transition-colors cursor-pointer border border-slate-700/30">
            <div className="flex items-center gap-2">
              <span className="text-lg">{social.icon}</span>
              <span className="text-slate-300 text-sm">{social.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Languages and Tools */}
    <div className="space-y-4">
      <h3 className="text-xl orbitron text-violet-300 flex items-center gap-2">
        <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
        Languages and Tools
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {[
          { name: 'JavaScript', color: '#f1e05a' },
          { name: 'TypeScript', color: '#3178c6' },
          { name: 'Python', color: '#3572A5' },
          { name: 'React', color: '#61dafb' },
          { name: 'Node.js', color: '#339933' },
          { name: 'HTML', color: '#e34c26' },
          { name: 'CSS', color: '#563d7c' },
          { name: 'Git', color: '#f05032' },
          { name: 'MongoDB', color: '#47A248' },
          { name: 'PostgreSQL', color: '#336791' },
          { name: 'Docker', color: '#2496ED' },
          { name: 'AWS', color: '#FF9900' }
        ].map((tech) => (
          <div key={tech.name} className="glass rounded-lg p-3 text-center hover:scale-105 transition-transform border border-slate-700/30">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: tech.color }}
            ></div>
            <span className="text-slate-300 text-xs">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Popular Repositories Preview */}
    <div className="space-y-4">
      <h3 className="text-xl orbitron text-violet-300 flex items-center gap-2">
        <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
        Popular Repositories
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            name: 'Dhanvantari',
            desc: 'A decentralized healthcare platform for secure patient data management on Avalanche and IPFS.',
            lang: 'Jupyter Notebook',
            stars: 1,
            color: '#DA5B0B'
          },
          {
            name: 'VedVaani',
            desc: 'AI-powered Hindu scripture Q&A platform',
            lang: 'TypeScript',
            stars: 1,
            color: '#3178c6'
          },
          {
            name: 'SkyCast',
            desc: 'Real-Time Weather Magic with React & Tailwind',
            lang: 'JavaScript',
            stars: 0,
            color: '#f1e05a'
          },
          {
            name: 'Ruche',
            desc: 'Elevated women\'s fashion browsing bliss',
            lang: 'HTML',
            stars: 0,
            color: '#e34c26'
          }
        ].map((repo) => (
          <div key={repo.name} className="glass rounded-lg p-4 hover:bg-slate-700/30 transition-colors border border-slate-700/30">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-violet-400 orbitron font-semibold">{repo.name}</h4>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <span>⭐</span>
                <span>{repo.stars}</span>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-3">{repo.desc}</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: repo.color }}
              ></div>
              <span className="text-slate-400 text-xs">{repo.lang}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Contribution Stats */}
    <div className="glass rounded-lg p-4 border border-violet-500/20 text-center">
      <div className="text-2xl orbitron text-violet-400 mb-2">481</div>
      <div className="text-slate-400 text-sm">contributions in the last year</div>
    </div>
  </div>
</div>



                {/* Recent Repos Preview */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg orbitron text-slate-200 mb-4">Recent Repositories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repos.slice(0, 4).map((repo) => (
                      <motion.div
                        key={repo.id}
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-lg p-4 hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-violet-400 orbitron font-semibold">{repo.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <span>⭐</span>
                            <span>{repo.stargazers_count}</span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                          {repo.description || 'No description available'}
                        </p>
                        <div className="flex items-center justify-between">
                          {repo.language && (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getLanguageColor(repo.language) }}
                              />
                              <span className="text-slate-400 text-xs">{repo.language}</span>
                            </div>
                          )}
                          <span className="text-slate-500 text-xs">
                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'repos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl orbitron text-slate-200">All Repositories</h3>
                  <div className="text-slate-400 text-sm">{repos.length} repositories</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repos.map((repo) => (
                    <motion.div
                      key={repo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="glass rounded-xl p-5 hover:bg-slate-700/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-violet-400 orbitron font-semibold text-lg">{repo.name}</h4>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-violet-400 transition-colors"
                          title="View on GitHub"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15,3 21,3 21,9"/>
                            <line x1="10" x2="21" y1="14" y2="3"/>
                          </svg>
                        </a>
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                        {repo.description || 'No description available'}
                      </p>
                      
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                          {repo.topics.length > 3 && (
                            <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-full">
                              +{repo.topics.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {repo.language && (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getLanguageColor(repo.language) }}
                              />
                              <span className="text-slate-400 text-xs">{repo.language}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🍴</span>
                            <span>{repo.forks_count}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-700/30">
                        <span className="text-slate-500 text-xs">
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contributions' && (
              <div className="space-y-6">
                <ContributionGraph />
                
                {/* Contribution Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl orbitron text-violet-400">
                      {contributions.reduce((sum, day) => sum + day.count, 0)}
                    </div>
                    <div className="text-slate-400 text-sm">Total Contributions</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl orbitron text-violet-400">
                      {contributions.filter(day => day.count > 0).length}
                    </div>
                    <div className="text-slate-400 text-sm">Active Days</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl orbitron text-violet-400">
                      {Math.max(...contributions.map(day => day.count))}
                    </div>
                    <div className="text-slate-400 text-sm">Best Day</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl orbitron text-violet-400">
                      {Math.round(contributions.reduce((sum, day) => sum + day.count, 0) / 52)}
                    </div>
                    <div className="text-slate-400 text-sm">Weekly Average</div>
                  </div>
                </div>

                {/* Language Stats */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg orbitron text-slate-200 mb-4">Most Used Languages</h3>
                  <div className="space-y-3">
                    {Array.from(new Set(repos.map(repo => repo.language).filter(Boolean)))
                      .slice(0, 8)
                      .map((language) => {
                        const count = repos.filter(repo => repo.language === language).length
                        const percentage = (count / repos.length) * 100
                        
                        return (
                          <div key={language} className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: getLanguageColor(language!) }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-slate-300 text-sm">{language}</span>
                                <span className="text-slate-400 text-xs">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-2">
                                <motion.div
                                  className="h-2 rounded-full"
                                  style={{ backgroundColor: getLanguageColor(language!) }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
