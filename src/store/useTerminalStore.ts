import { create } from 'zustand'

interface HistoryEntry {
  type: 'input' | 'output' | 'error'
  content: string
}

interface TerminalStore {
  history: HistoryEntry[]
  addToHistory: (entry: HistoryEntry) => void
  clearHistory: () => void
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  history: [],
  
  addToHistory: (entry: HistoryEntry) => {
    set((state) => ({
      history: [...state.history, entry]
    }))
  },
  
  clearHistory: () => {
    set({ history: [] })
  }
}))
