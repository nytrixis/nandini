'use client'

import { soundManager } from './soundManager'

export function initializeGlobalClickHandler() {
  if (typeof window === 'undefined') return

  // Initialize sound manager
  soundManager.init()

  // Global click event listener
  const handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    
    // Check if the clicked element or its parent is clickable
    const isClickable = target.matches(`
      button, 
      a, 
      [role="button"], 
      input[type="button"], 
      input[type="submit"], 
      input[type="reset"],
      .cursor-pointer,
      [onclick],
      summary
    `) || target.closest(`
      button, 
      a, 
      [role="button"], 
      input[type="button"], 
      input[type="submit"], 
      input[type="reset"],
      .cursor-pointer,
      [onclick],
      summary
    `)

    if (isClickable) {
      soundManager.playClick()
    }
  }

  // Add event listener to document
  document.addEventListener('click', handleGlobalClick, { passive: true })

  // Cleanup function
  return () => {
    document.removeEventListener('click', handleGlobalClick)
  }
}

// Global sound toggle function
export function toggleGlobalSound() {
  return soundManager.toggleSound()
}

export function isGlobalSoundEnabled() {
  return soundManager.isSoundEnabled()
}
