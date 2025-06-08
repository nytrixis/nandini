import { create } from 'zustand'

interface MinimizedTab {
  id: string
  title: string
  timestamp: number
}

interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
}

interface ModalStore {
  activeModal: string | null
  minimizedTabs: MinimizedTab[]
  toast: Toast | null
  selectedProject: string | null
  setSelectedProject: (projectId: string | null) => void
  openModal: (modalId: string) => void
  openProjectModal: (projectId?: string) => void 
  closeModal: (modalId: string) => void
  minimizeTab: (modalId: string, title: string) => void
  restoreTab: (tabId: string) => void
  removeMinimizedTab: (tabId: string) => void
  showToast: (message: string, type: Toast['type']) => void
  hideToast: () => void
}

export const useModalStore = create<ModalStore>((set, get) => ({
  activeModal: null,
  minimizedTabs: [],
  toast: null,
  selectedProject: null,
  setSelectedProject: (projectId: string | null) => {
    set({ selectedProject: projectId })
  },

  openModal: (modalId: string) => {
    set({ activeModal: modalId })
    // Remove from minimized tabs if it was minimized
    const { minimizedTabs } = get()
    set({ 
      minimizedTabs: minimizedTabs.filter(tab => tab.id !== modalId)
    })
  },

  openProjectModal: (projectId?: string) => {
  const { activeModal } = get()
  if (activeModal === 'projects') {
    set({ selectedProject: projectId || null })
  } else {
    set({ 
      activeModal: 'projects',
      selectedProject: projectId || null 
    })
    const { minimizedTabs } = get()
    set({
      minimizedTabs: minimizedTabs.filter(tab => tab.id === 'projects')
    })
  }
},


  closeModal: (modalId: string) => {
    const { activeModal } = get()
    if (activeModal === modalId) {
      set({ 
        activeModal: null,
        selectedProject: null
      })
    }
  },

  minimizeTab: (modalId: string, title: string) => {
    const { minimizedTabs } = get()
    const existingTab = minimizedTabs.find(tab => tab.id === modalId)
    
    if (!existingTab) {
      set({
        activeModal: null,
        minimizedTabs: [
          ...minimizedTabs,
          {
            id: modalId,
            title,
            timestamp: Date.now()
          }
        ]
      })
    }
  },

  restoreTab: (tabId: string) => {
    set({ activeModal: tabId })
    const { minimizedTabs } = get()
    set({
      minimizedTabs: minimizedTabs.filter(tab => tab.id !== tabId)
    })
  },

  removeMinimizedTab: (tabId: string) => {
    const { minimizedTabs } = get()
    set({
      minimizedTabs: minimizedTabs.filter(tab => tab.id !== tabId)
    })
  },

  showToast: (message: string, type: Toast['type']) => {
    set({ toast: { message, type } })
    setTimeout(() => {
      set({ toast: null })
    }, 3000)
  },

  hideToast: () => {
    set({ toast: null })
  }
}))
