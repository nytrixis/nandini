'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

interface DesktopIconProps {
  id: string
  name: string
  icon: string
  description: string
  onClick: () => void
}

export default function DesktopIcon({ name, icon, description, onClick }: DesktopIconProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      className="relative group cursor-pointer flex flex-col items-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Image or Fallback - No container */}
      <div className="mb-2 flex items-center justify-center">
        {!imageError ? (
          <Image
            src={icon}
            alt={name}
            width={64}
            height={64}
            className="w-16 h-16 object-contain hover:brightness-110 transition-all duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          // Fallback if image fails to load
          <div className="w-16 h-16 flex items-center justify-center text-4xl hover:scale-110 transition-transform duration-300">
            📁
          </div>
        )}
      </div>
      
      {/* Name */}
      <div className="orbitron text-sm text-slate-300 text-center leading-tight max-w-20">
        {name}
      </div>

      {/* Tooltip - Below the icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9
        }}
        transition={{ duration: 0.2 }}
        className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="glass rounded-lg px-3 py-2 text-xs text-slate-300 whitespace-nowrap">
          {description}
        </div>
      </motion.div>
    </motion.div>
  )
}
