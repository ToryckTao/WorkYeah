import { createClient } from '@supabase/supabase-js'
import env from '../config/env.js'

const supabaseUrl = env.SUPABASE_URL
const supabaseAnonKey = env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: {
      getItem: (key) => {
        try {
          return uni.getStorageSync(key)
        } catch (e) {
          return null
        }
      },
      setItem: (key, value) => {
        try {
          uni.setStorageSync(key, value)
        } catch (e) {}
      },
      removeItem: (key) => {
        try {
          uni.removeStorageSync(key)
        } catch (e) {}
      }
    }
  }
})

export const auth = {
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    uni.setStorageSync('isLoggedIn', true)
    uni.setStorageSync('user', data.user)
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    uni.removeStorageSync('isLoggedIn')
    uni.removeStorageSync('user')
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

export const db = {
  async getProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_members!inner(user_id, role)')
      .eq('project_members.user_id', userId)
      .order('updated_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getProjectById(projectId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_members(role, workload, users(id, nickname, avatar, persona))')
      .eq('id', projectId)
      .single()
    if (error) throw error
    return data
  },

  async getTasks(projectId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subtasks(*)')
      .eq('project_id', projectId)
      .order('sort_order')
    if (error) throw error
    return data
  },

  async getMessages(projectId, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:users(id, nickname, avatar)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .limit(limit)
    if (error) throw error
    return data
  },

  async getFavorites(userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, project:projects(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getCommunityItems(type = null, limit = 20) {
    let query = supabase
      .from('community_items')
      .select('*, author:users(id, nickname, avatar)')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (type) query = query.eq('item_type', type)
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getSubscriptionPlans() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('sort_order')
    if (error) throw error
    return data
  },

  async getAiAgents() {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at')
    if (error) throw error
    return data
  }
}

export const realtime = {
  subscribeToMessages(projectId, callback) {
    return supabase
      .channel(`messages:${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`
      }, callback)
      .subscribe()
  },

  unsubscribe(channel) {
    supabase.removeChannel(channel)
  }
}

export default { supabase, auth, db, realtime }

