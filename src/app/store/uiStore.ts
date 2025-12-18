import { create } from 'zustand'

export interface UIState {
  // State
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  viewMode: 'grid' | 'list'
  filters: {
    type?: string
    dateRange?: {
      start: Date | null
      end: Date | null
    }
  }

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setViewMode: (mode: 'grid' | 'list') => void
  setFilters: (filters: Partial<UIState['filters']>) => void
  clearFilters: () => void
}

export const useUIStore = create<UIState>(set => ({
  // Initial state
  sidebarOpen: false,
  theme: 'dark', // Dark mode par défaut
  viewMode: 'list',
  filters: {},

  // Actions
  toggleSidebar: () =>
    set(state => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: open => set({ sidebarOpen: open }),

  setTheme: theme => set({ theme }),

  setViewMode: mode => set({ viewMode: mode }),

  setFilters: newFilters =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () => set({ filters: {} }),
}))
