import { db, auth, realtime } from './supabase.js'

let currentUserId = null

export async function initApi() {
  const user = await auth.getUser()
  if (user) currentUserId = user.id
  return user
}

export async function login(email, password) {
  const data = await auth.signIn(email, password)
  currentUserId = data.user.id
  return data
}

export async function logout() {
  await auth.signOut()
  currentUserId = null
}

export async function getMyProjects() {
  if (!currentUserId) throw new Error('未登录')
  return await db.getProjects(currentUserId)
}

export async function getProject(projectId) {
  return await db.getProjectById(projectId)
}

export async function getTasks(projectId) {
  return await db.getTasks(projectId)
}

export async function getMessages(projectId) {
  return await db.getMessages(projectId)
}

export async function getMyFavorites() {
  if (!currentUserId) throw new Error('未登录')
  return await db.getFavorites(currentUserId)
}

export async function getCommunityItems(type = null) {
  return await db.getCommunityItems(type)
}

export async function getSubscriptionPlans() {
  return await db.getSubscriptionPlans()
}

export async function getAiAgents() {
  return await db.getAiAgents()
}

export function subscribeToMessages(projectId, callback) {
  return realtime.subscribeToMessages(projectId, (payload) => {
    callback(payload.new)
  })
}

export function unsubscribe(channel) {
  realtime.unsubscribe(channel)
}

export default {
  initApi, login, logout,
  getMyProjects, getProject, getTasks, getMessages,
  getMyFavorites, getCommunityItems, getSubscriptionPlans, getAiAgents,
  subscribeToMessages, unsubscribe
}

