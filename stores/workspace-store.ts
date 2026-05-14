import { create } from 'zustand'

interface User {
  id: string
  name: string
  avatar?: string
  credits: number
  creditsResetDate: Date
}

interface ImageHistory {
  id: string
  src: string
  prompt: string
  createdAt: Date
}

export interface ImageDetail {
  id: string
  src: string
  prompt: string
  width: number
  height: number
  likes: number
  isLiked: boolean
  author?: {
    name: string
    avatar?: string
  }
  model?: string
  parameters?: {
    steps?: number
    guidance?: number
    seed?: number
    size?: string
  }
  createdAt?: Date
  history?: ImageHistory[]
}

interface Generation {
  id: string
  prompt: string
  images: string[]
  status: 'pending' | 'generating' | 'completed' | 'failed'
  createdAt: Date
}

interface WorkspaceState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  
  // Generation state
  currentGeneration: Generation | null
  generations: Generation[]
  isGenerating: boolean
  setIsGenerating: (isGenerating: boolean) => void
  addGeneration: (generation: Generation) => void
  updateGeneration: (id: string, updates: Partial<Generation>) => void
  
  // UI state
  currentPage: string
  setCurrentPage: (page: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedTab: string
  setSelectedTab: (tab: string) => void
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Image Detail
  imageDetails: Record<string, ImageDetail>
  setImageDetail: (id: string, detail: ImageDetail) => void
  setImageDetails: (details: Record<string, ImageDetail>) => void
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  // User state
  user: {
    id: 'demo-user',
    name: '创意达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creative',
    credits: 0,
    creditsResetDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  setUser: (user) => set({ user }),
  
  // Generation state
  currentGeneration: null,
  generations: [],
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  addGeneration: (generation) =>
    set((state) => ({
      generations: [generation, ...state.generations],
      currentGeneration: generation,
    })),
  updateGeneration: (id, updates) =>
    set((state) => ({
      generations: state.generations.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
      currentGeneration:
        state.currentGeneration?.id === id
          ? { ...state.currentGeneration, ...updates }
          : state.currentGeneration,
    })),
  
  // UI state
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),
  selectedCategory: 'general',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  selectedTab: 'explore',
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  
  // Image Detail
  imageDetails: {},
  setImageDetail: (id, detail) =>
    set((state) => ({
      imageDetails: { ...state.imageDetails, [id]: detail },
    })),
  setImageDetails: (details) => set({ imageDetails: details }),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
