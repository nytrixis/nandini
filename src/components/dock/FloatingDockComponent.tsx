'use client'

import { FloatingDock } from '@/components/ui/floating-dock'
import { useModalStore } from '@/store/useModalStore'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconFileText,
  IconMap,
  IconX,
  IconHistory,
} from '@tabler/icons-react'

const permanentDockItems = [
  {
    title: 'github',
    icon: <IconBrandGithub className="h-full w-full text-slate-300" />,
    href: 'https://github.com/nytrixis',
    isPermanent: true
  },
  {
    title: 'resume',
    icon: <IconFileText className="h-full w-full text-slate-300" />,
    onClick: () => {},
    isPermanent: true
  },
  {
    title: 'contact',
    icon: <IconMail className="h-full w-full text-slate-300" />,
    onClick: () => {},
    isPermanent: true
  },
  {
    title: 'linkedin',
    icon: <IconBrandLinkedin className="h-full w-full text-slate-300" />,
    href: 'https://linkedin.com/in/nytrixis',
    isPermanent: true
  },
  {
    title: 'skillmap galaxy',
    icon: <IconMap className="h-full w-full text-slate-300" />,
    onClick: () => {},
    isPermanent: true
  }
]

export default function FloatingDockComponent() {
  const { openModal, minimizedTabs, restoreTab, removeMinimizedTab } = useModalStore()

  // Add onClick handlers for permanent modal items
  const permanentItemsWithHandlers = permanentDockItems.map(item => ({
    ...item,
    onClick: item.onClick ? () => {
      if (item.title === 'resume') openModal('resume')
      else if (item.title === 'contact') openModal('email')
      else if (item.title === 'skillmap galaxy') openModal('skillmap')
    } : undefined
  }))

  // Create minimized tab items
  const minimizedTabItems = minimizedTabs.map(tab => ({
    title: tab.title,
    icon: (
      <div className="relative h-full w-full flex items-center justify-center">
        <IconHistory className="h-full w-full text-amber-400" />
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </div>
    ),
    onClick: () => restoreTab(tab.id),
    onSecondaryClick: () => removeMinimizedTab(tab.id),
    isPermanent: false,
    isMinimized: true
  }))

  // Combine permanent and minimized items
  const allItems = [...permanentItemsWithHandlers, ...minimizedTabItems]

  return (
    <FloatingDock
      items={allItems}
      desktopClassName="glass dock-glow"
      mobileClassName="glass"
      direction="vertical"
    />
  )
}
