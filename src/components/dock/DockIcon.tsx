'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

interface DockIconProps {
  id: string
  icon: string
  label: string
  onClick: () => void
}

export default function DockIcon({ icon, label, onClick }: DockIconProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.button
        className="w-20 h-20 rounded-xl glass hover:bg-slate-700/50 flex items-center justify-center transition-all duration-300 p-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
      >
        {!imageError ? (
          <Image
            src={icon}
            alt={label}
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          // Fallback if image fails to load
          <div className="w-16 h-16 bg-slate-600 rounded flex items-center justify-center text-2xl text-white">
            📁
          </div>
        )}
      </motion.button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: -10, scale: 0.9 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          x: isHovered ? 0 : -10,
          scale: isHovered ? 1 : 0.9
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div className="glass rounded-lg px-4 py-3 orbitron text-base text-slate-300 whitespace-nowrap">
          {label}
        </div>
      </motion.div>
    </motion.div>
  )
}
