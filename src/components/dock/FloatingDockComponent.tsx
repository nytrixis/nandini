'use client'

import { FloatingDock } from '@/components/ui/floating-dock'
import { useModalStore } from '@/store/useModalStore'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconFileText,
  IconHistory,
} from '@tabler/icons-react'

const permanentDockItems = [
  {
    title: 'github',
    icon: <IconBrandGithub className="h-full w-full text-slate-300" />,
    action: 'modal',
    isPermanent: true
  },
  {
    title: 'resume',
    icon: <IconFileText className="h-full w-full text-slate-300" />,
    action: 'modal',
    isPermanent: true
  },
  {
    title: 'email',
    icon: <IconMail className="h-full w-full text-slate-300" />,
    action: 'modal',
    isPermanent: true
  },
  {
    title: 'linkedin',
    icon: <IconBrandLinkedin className="h-full w-full text-slate-300" />,
    href: 'https://linkedin.com/in/nytrixis',
    isPermanent: true
  },
]

export default function FloatingDockComponent() {
  const { openModal, minimizedTabs, restoreTab, removeMinimizedTab } = useModalStore()

  // Add onClick handlers for permanent modal items
  const permanentItemsWithHandlers = permanentDockItems.map(item => ({
    ...item,
    onClick: item.action === 'modal' ? () => {
      if (item.title === 'github') openModal('github')
      else if (item.title === 'resume') openModal('resume')
      else if (item.title === 'email') openModal('email')
    } : item.href ? () => window.open(item.href, '_blank') : undefined
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
