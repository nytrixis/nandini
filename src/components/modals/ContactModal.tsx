'use client'

import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandInstagram,
  IconMail,
  IconMapPin,
  IconExternalLink,
  IconCopy,
  IconCheck
} from '@tabler/icons-react'

interface ContactItem {
  id: string
  label: string
  value: string
  href?: string
  icon: React.ReactNode
  copyable?: boolean
  description?: string
}

const contactData: ContactItem[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'ajayapandey2404@gmail.com',
    href: 'mailto:ajayapandey2404@gmail.com',
    icon: <IconMail className="w-5 h-5" />,
    copyable: true,
    description: 'Primary contact'
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/nytrixis',
    href: 'https://github.com/nytrixis',
    icon: <IconBrandGithub className="w-5 h-5" />,
    description: 'Code repositories'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/nytrixis',
    href: 'https://linkedin.com/in/nytrixis',
    icon: <IconBrandLinkedin className="w-5 h-5" />,
    description: 'Professional network'
  },
  {
    id: 'twitter',
    label: 'Twitter',
    value: '@nytrixis',
    href: 'https://twitter.com/nytrixis',
    icon: <IconBrandTwitter className="w-5 h-5" />,
    description: 'Latest updates'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@nytrixis',
    href: 'https://instagram.com/nytrixis',
    icon: <IconBrandInstagram className="w-5 h-5" />,
    description: 'Visual stories'
  },
  {
    id: 'location',
    label: 'Location',
    value: 'Durgapur, west bengal, India',
    icon: <IconMapPin className="w-5 h-5" />,
    description: 'Based in'
  }
]

export default function ContactModal() {
  const { closeModal, minimizeTab } = useModalStore()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
    closeModal('email')
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    minimizeTab('email', 'Contact')
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleContactClick = (item: ContactItem) => {
    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    }
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
        className={`fixed top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-h-[600px] glass rounded-2xl overflow-hidden z-50 border border-slate-700/30 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b border-slate-700/20"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors cursor-pointer"
                title="Close"
              />
              <button
                onClick={handleMinimize}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-yellow-500/80 rounded-full hover:bg-yellow-500 transition-colors cursor-pointer"
                title="Minimize"
              />
              <button
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-green-500/80 rounded-full hover:bg-green-500 transition-colors cursor-pointer"
                title="Maximize"
              />
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-lg orbitron text-slate-200">Contact</h2>
            <p className="text-xs text-slate-400">Let&apos;s connect</p>
          </div>
          
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div 
          className="p-6 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            {/* Header Message */}
            <div className="text-center mb-8">
              <h3 className="text-xl text-slate-200 mb-2">Get in touch</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Feel free to reach out for collaborations, opportunities, or just to say hello.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid gap-3">
              {contactData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="group relative"
                >
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/20 hover:border-slate-600/30 transition-all duration-300 hover:bg-slate-800/20">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-slate-300 transition-colors">
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-slate-200">{item.label}</h4>
                        {item.description && (
                          <span className="text-xs text-slate-500">• {item.description}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 truncate">{item.value}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {item.copyable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(item.value, item.id)
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-slate-700/50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Copy"
                        >
                          {copiedId === item.id ? (
                            <IconCheck className="w-4 h-4 text-green-400" />
                          ) : (
                            <IconCopy className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                          )}
                        </button>
                      )}
                      
                      {item.href && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContactClick(item)
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-slate-700/50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Open"
                        >
                          <IconExternalLink className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Message */}
            <div className="mt-8 p-4 rounded-xl bg-slate-800/20 border border-slate-700/20">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">
                  Open to opportunities and collaborations
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Available for work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
