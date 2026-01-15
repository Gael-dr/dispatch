import { create } from 'zustand'

/**
 * Type pour les données d'une modal
 */
export interface ModalData {
  actionId: string
  cardId?: string
  [key: string]: unknown
}

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
  // Modal state
  modalOpen: boolean
  modalData: ModalData | null

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setViewMode: (mode: 'grid' | 'list') => void
  setFilters: (filters: Partial<UIState['filters']>) => void
  clearFilters: () => void
  // Modal actions
  openModal: (data: ModalData) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>(set => ({
  // Initial state
  sidebarOpen: false,
  theme: 'dark', // Dark mode par défaut
  viewMode: 'list',
  filters: {},
  modalOpen: false,
  modalData: null,

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

  // Modal actions
  openModal: (data: ModalData) => {
    // On définit d'abord les données, puis on ouvre la modal pour éviter les animations bizarres
    set({ modalData: data })
    // Petit délai pour que les données soient prêtes avant l'animation
    requestAnimationFrame(() => {
      set({ modalOpen: true })
    })
  },

  closeModal: () => {
    set({ modalOpen: false })
    // On garde les données un peu pour les animations, puis on les nettoie
    setTimeout(() => {
      set({ modalData: null })
    }, 200)
  },
}))
