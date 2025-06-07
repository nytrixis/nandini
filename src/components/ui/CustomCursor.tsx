'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = target.matches('button, a, [role="button"], input, textarea, select, [onclick], .cursor-pointer') ||
                          !!target.closest('button, a, [role="button"], input, textarea, select, [onclick], .cursor-pointer')
      setIsHovering(isClickable)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    // Add mouse leave handler to reset hover state
    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    document.addEventListener('mousemove', updateCursorPosition, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseLeave, { passive: true })
    document.addEventListener('mousedown', handleMouseDown, { passive: true })
    document.addEventListener('mouseup', handleMouseUp, { passive: true })

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div
      id="custom-cursor"
      className={`${isHovering ? 'cursor-hover' : ''} ${isClicking ? 'cursor-click' : ''}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="cursor-line"></div>
      <div className="cursor-line"></div>
      <div className="cursor-dot"></div>
    </div>
  )
}
