'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle2, Clock, AlertCircle, ChevronRight, 
  Plus, Bell, User, Settings, LogOut, Calendar,
  TrendingUp, Users, Target, Filter
} from 'lucide-react'
import { useAppStore } from '@/store'
import { Task } from '@/lib/supabase'
import { mockTasks } from '@/lib/mock-data'
import { format, isToday, isPast, addDays, isWithinInterval, parseISO } from 'date-fns'

export default function Dashboard() {
  const { tasks, setTasks, taskFilter, setTaskFilter, isLoading, setIsLoading } = useAppStore()
  const [showNewTask, setShowNewTask] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load mock data on mount
  useEffect(() => {
    setMounted(true)
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks)
      setIsLoading(false)
    }, 500)
  }, [setTasks, setIsLoading])

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const dueDate = parseISO(task.due_date)
    const now = new Date()
    
    switch (taskFilter) {
      case 'overdue':
        return task.status !== 'completed' && isPast(dueDate) && !isToday(dueDate)
      case 'today':
        return isToday(dueDate)
      case 'week':
        return isWithinInterval(dueDate, { start: now, end: addDays(now, 7) })
      case 'completed':
        return task.status === 'completed'
      default:
        return true
    }
  })

  // Group tasks by status
  const overdueTasks = filteredTasks.filter(t => {
    const dueDate = parseISO(t.due_date)
    return t.status !== 'completed' && isPast(dueDate) && !isToday(dueDate)
  })
  
  const todayTasks = filteredTasks.filter(t => {
    const dueDate = parseISO(t.due_date)
    return t.status !== 'completed' && isToday(dueDate)
  })
  
  const upcomingTasks = filteredTasks.filter(t => {
    const dueDate = parseISO(t.due_date)
    return t.status !== 'completed' && !isPast(dueDate) && !isToday(dueDate)
  })
  
  const completedTasks = filteredTasks.filter(t => t.status === 'completed')

  // Calculate completion rate
  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
    : 0

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">TaskRhythm</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Recurring tasks, automated</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-zinc-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <User className="w-5 h-5 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Demo User</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{tasks.length}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Tasks</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{overdueTasks.length}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Overdue</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{completionRate}%</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Completion Rate</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">5</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Team Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {(['all', 'overdue', 'today', 'week', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTaskFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  taskFilter === filter
                    ? 'bg-violet-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400">Loading tasks...</p>
          </div>
        )}

        {/* Task Lists */}
        {!isLoading && (
          <div className="space-y-6">
            {/* Overdue */}
            {overdueTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h2 className="font-semibold text-zinc-900 dark:text-white">Overdue ({overdueTasks.length})</h2>
                </div>
                <div className="space-y-2">
                  {overdueTasks.map((task) => (
                    <TaskCard key={task.id} task={task} variant="overdue" />
                  ))}
                </div>
              </div>
            )}

            {/* Today */}
            {todayTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <h2 className="font-semibold text-zinc-900 dark:text-white">Today ({todayTasks.length})</h2>
                </div>
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <TaskCard key={task.id} task={task} variant="today" />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcomingTasks.length > 0 && taskFilter !== 'today' && taskFilter !== 'overdue' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <h2 className="font-semibold text-zinc-900 dark:text-white">Upcoming ({upcomingTasks.length})</h2>
                </div>
                <div className="space-y-2">
                  {upcomingTasks.map((task) => (
                    <TaskCard key={task.id} task={task} variant="upcoming" />
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedTasks.length > 0 && taskFilter === 'completed' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h2 className="font-semibold text-zinc-900 dark:text-white">Completed ({completedTasks.length})</h2>
                </div>
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} variant="completed" />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 dark:text-zinc-400">No tasks found</p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
                  {taskFilter === 'all' 
                    ? 'Create your first recurring task to get started'
                    : `No ${taskFilter} tasks`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// Task Card Component
function TaskCard({ task, variant }: { task: Task; variant: 'overdue' | 'today' | 'upcoming' | 'completed' }) {
  const { updateTask } = useAppStore()
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    updateTask(task.id, { 
      status: 'completed', 
      completed_at: new Date().toISOString() 
    })
    setIsCompleting(false)
  }

  const variantStyles = {
    overdue: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10',
    today: 'border-orange-200 dark:border-orange-800 bg-white dark:bg-zinc-900',
    upcoming: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
    completed: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
  }

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-300',
    critical: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300'
  }

  return (
    <div className={`rounded-xl border ${variantStyles[variant]} p-4 hover:shadow-sm transition-shadow`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={`font-medium ${variant === 'completed' ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-white'}`}>
              {task.name}
            </h3>
            <span className={`px-2 py-0.5 text-xs rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Due: {format(parseISO(task.due_date), 'MMM d, h:mm a')}
            </span>
            {task.status === 'completed' && task.completed_at && (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="w-3 h-3" />
                Completed: {format(parseISO(task.completed_at), 'MMM d, h:mm a')}
              </span>
            )}
          </div>
        </div>
        {variant !== 'completed' && (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isCompleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Completing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Complete</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}