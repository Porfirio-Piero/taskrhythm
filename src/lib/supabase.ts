import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Team {
  id: string
  name: string
  slug: string
  timezone: string
  working_days: string[]
  working_hours_start: string
  working_hours_end: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface TeamMembership {
  id: string
  team_id: string
  user_id: string
  role: 'admin' | 'member'
  joined_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  notification_preferences: {
    email: boolean
    email_timing: string
    slack: boolean
  }
  created_at: string
  updated_at: string
}

export interface TaskDefinition {
  id: string
  team_id: string
  created_by: string
  name: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  recurrence_type: 'daily' | 'weekly' | 'monthly' | 'custom'
  recurrence_config: {
    days?: string[]
    time: string
    day_of_month?: number
  }
  rotation_enabled: boolean
  rotation_team_members: string[]
  rotation_type: 'round_robin' | 'random' | 'weighted'
  default_assignee: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  definition_id: string | null
  team_id: string
  assignee_id: string | null
  name: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date: string
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  completed_at: string | null
  completed_by: string | null
  completion_notes: string | null
  skipped_reason: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  team_id: string
  type: 'task_assigned' | 'task_due_soon' | 'task_overdue' | 'task_completed'
  title: string
  message: string | null
  action_url: string | null
  is_read: boolean
  created_at: string
}