export type ProjectId = "p1" | "p2" | "p3"

export interface NodeData {
  id: string
  type: "member" | "ai" | "checkpoint"
  label: string
  assignee?: string
  status?: string
  deadline?: string
  x: number
  y: number
}

export interface Edge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface WorkflowData {
  nodes: NodeData[]
  edges: Edge[]
}

export interface Project {
  id: ProjectId
  name: string
  type: "IT开发" | "人文报告" | "商业分析"
  lastModified: string
  workflow: WorkflowData
}

// 任务相关类型定义
export type TaskId = "t1" | "t2" | "t3" | "t4" | null

export interface Task {
  id: string
  title: string
  project: string
  dueDate: string
  messageCount: number
}

// 场景类型
export type Scenario = "history" | "business" | "default"

// 项目到场景的映射
export const PROJECT_TO_SCENARIO: Record<ProjectId, Scenario> = {
  p1: "default",
  p2: "history",
  p3: "business",
}

