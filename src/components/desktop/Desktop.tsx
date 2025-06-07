'use client'

import { motion } from 'framer-motion'
import DesktopIcon from './DesktopIcon'
import { useModalStore } from '@/store/useModalStore'

const folders = [
  {
    id: 'projects',
    name: 'projects',
    icon: '/images/projects.png',
    description: 'web3, ai, ml projects'
  },
  {
    id: 'hackathons',
    name: 'hackathons',
    icon: '/images/hackathons.png',
    description: 'competition timeline'
  },
  {
    id: 'zkresume',
    name: 'zkresume',
    icon: '/images/zkresume.png',
    description: 'verifiable credentials'
  },
  {
    id: 'genesis-log',
    name: 'genesis',
    icon: '/images/genesis-log.png',
    description: 'development timeline'
  },
  {
    id: 'vault',
    name: 'vault',
    icon: '/images/vault.png',
    description: 'research & credentials'
  },
  {
    id: 'dev-mode',
    name: 'dev mode',
    icon: '/images/dev-mode.png',
    description: 'system diagnostics'
  }
]

export default function Desktop() {
  const { openModal } = useModalStore()

  return (
    <div className="pl-32 pr-12 -pt-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="grid grid-cols-4 md:grid-cols-7 gap-8 max-w-6xl mx-auto"
      >
        {folders.map((folder, index) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
          >
            <DesktopIcon
              {...folder}
              onClick={() => openModal(folder.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
