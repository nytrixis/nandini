'use client'

class SoundManager {
  private static instance: SoundManager
  private clickSound: HTMLAudioElement | null = null
  private isEnabled: boolean = true
  private isInitialized: boolean = false

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  init() {
    if (this.isInitialized || typeof window === 'undefined') return

    try {
      this.clickSound = new Audio('/click.wav')
      this.clickSound.volume = 0.3
      this.clickSound.preload = 'auto'
      this.isInitialized = true
    } catch (error) {
      console.warn('Failed to initialize click sound:', error)
    }
  }

  playClick() {
    if (!this.isEnabled || !this.clickSound || !this.isInitialized) return

    try {
      this.clickSound.currentTime = 0
      this.clickSound.play().catch(error => {
        console.warn('Click sound play failed:', error)
      })
    } catch (error) {
      console.warn('Click sound error:', error)
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled
    return this.isEnabled
  }

  isSoundEnabled() {
    return this.isEnabled
  }
}

export const soundManager = SoundManager.getInstance()
