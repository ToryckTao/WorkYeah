const USE_BACKEND = false

let api = null

async function loadApi() {
  if (!api && USE_BACKEND) {
    api = await import('./api.js')
  }
  return api
}

const staticData = {
  users: [
    { id: 'user-gdnt', nickname: '古德奈特', avatar: '/static/gdnt.jpg', persona: '专家型' },
    { id: 'user-xd', nickname: '萧祷', avatar: '/static/xd.jpg', persona: '新手型' },
    { id: 'user-ymqx', nickname: '一墨乾行', avatar: '/static/ymqx.jpg', persona: '视觉型' }
  ],

  projects: [
    { id: 'p1', name: '智慧养老APP', type: 'IT开发', lastModified: '12/26 14:30', unread: 3 },
    { id: 'p2', name: '辛亥革命论文', type: '人文报告', lastModified: '12/25 10:15', unread: 0 },
    { id: 'p3', name: '营销分析报告', type: '商业分析', lastModified: '12/24 16:20', unread: 5 }
  ],

  tasks: [
    { id: 't1', title: '需求分析文档', project: '智慧养老APP', dueDate: '12/28', messageCount: 2 },
    { id: 't2', title: '数据库设计', project: '智慧养老APP', dueDate: '12/30', messageCount: 0 },
    { id: 't3', title: '资料收集', project: '辛亥革命论文', dueDate: '01/05', messageCount: 1 },
    { id: 't4', title: '市场调研报告', project: '营销分析报告', dueDate: '01/08', messageCount: 3 }
  ],

  communityItems: [
    { badge: '模板', badgeColor: '#4895ff', title: 'AI驱动的软件开发流程', author: '@WorkYeah官方', avatar: '/static/AIqd.png', time: '2小时前', likes: 128 },
    { badge: '项目', badgeColor: '#336df4', title: '智能客服系统完整解决方案', author: '@天津大学', avatar: '/static/tju.png', time: '5小时前', likes: 96 },
    { badge: '招募', badgeColor: '#4895ff', title: '寻找全栈工程师合作开发', author: '@创业者', avatar: '/static/gcs.png', time: '1天前', likes: 64 }
  ],

  favorites: [
    { id: 1, name: '智能家居控制系统', description: '基于IoT技术的全屋智能家居解决方案', cover: '/static/chair.png', members: 12, stars: 328, collectTime: '3天前' },
    { id: 2, name: '在线教育平台', description: '面向K12教育的在线学习平台', cover: '/static/presentation.png', members: 8, stars: 256, collectTime: '1周前' },
    { id: 3, name: '企业数据分析平台', description: '基于大数据的企业智能分析系统', cover: '/static/module.png', members: 15, stars: 412, collectTime: '2周前' }
  ],

  agentNodes: [
    { id: 'gdnt', name: '古德奈特', role: '队长', avatar: '/static/gdnt.jpg', color: '#059669', persona: '专家型' },
    { id: 'xd', name: '萧祷', avatar: '/static/xd.jpg', color: '#2563eb', persona: '新手型' },
    { id: 'ymqx', name: '一墨乾行', avatar: '/static/ymqx.jpg', color: '#9333ea', persona: '视觉型' }
  ]
}

export default {
  isBackendEnabled: function() {
    return USE_BACKEND
  },

  getProjects: async function() {
    if (USE_BACKEND) {
      var apiModule = await loadApi()
      return await apiModule.getMyProjects()
    }
    return staticData.projects
  },

  getTasks: async function() {
    if (USE_BACKEND) {
      var apiModule = await loadApi()
      return await apiModule.getTasks()
    }
    return staticData.tasks
  },

  getCommunityItems: async function() {
    if (USE_BACKEND) {
      var apiModule = await loadApi()
      return await apiModule.getCommunityItems()
    }
    return staticData.communityItems
  },

  getFavorites: async function() {
    if (USE_BACKEND) {
      var apiModule = await loadApi()
      return await apiModule.getMyFavorites()
    }
    return staticData.favorites
  },

  getAgentNodes: async function() {
    if (USE_BACKEND) {
      var apiModule = await loadApi()
      return await apiModule.getAiAgents()
    }
    return staticData.agentNodes
  },

  getUsers: function() {
    return staticData.users
  },

  getUserByName: function(name) {
    return staticData.users.find(function(u) { return u.nickname === name })
  }
}

