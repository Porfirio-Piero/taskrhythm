import { create } from 'zustand'
import { Task, TaskDefinition, Team, Profile } from '@/lib/supabase'

interface AppState {
  // User
  user: Profile | null
  setUser: (user: Profile | null) => void
  
  // Team
  currentTeam: Team | null
  teams: Team[]
  setTeams: (teams: Team[]) => void
  setCurrentTeam: (team: Team | null) => void
  
  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  
  // Task Definitions
  taskDefinitions: TaskDefinition[]
  setTaskDefinitions: (definitions: TaskDefinition[]) => void
  
  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Filters
  taskFilter: 'all' | 'overdue' | 'today' | 'week' | 'completed'
  setTaskFilter: (filter: 'all' | 'overdue' | 'today' | 'week' | 'completed') => void
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  
  // Team
  currentTeam: null,
  teams: [],
  setTeams: (teams) => set({ teams }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
  
  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),
  
  // Task Definitions
  taskDefinitions: [],
  setTaskDefinitions: (definitions) => set({ taskDefinitions: definitions }),
  
  // UI State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Filters
  taskFilter: 'all',
  setTaskFilter: (filter) => set({ taskFilter: filter })
}))