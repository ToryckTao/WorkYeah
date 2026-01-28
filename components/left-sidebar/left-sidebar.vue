<template>
  <view v-if="visible" class="sidebar-mask" @tap="handleMaskClick">
    <view class="sidebar-drawer" @tap.stop>
      <!-- Logo -->
      <view class="flex h-16 items-center gap-3 px-4">
        <view class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 shadow-sm">
          <!-- 圆形占位图案 - 用于放置图标 -->
        </view>
        <view>
          <text class="text-lg font-semibold text-slate-900">WorkYeah</text>
          <text class="text-xs text-slate-600 block">大作Yeah</text>
        </view>
      </view>

      <!-- Navigation -->
      <scroll-view class="flex-1 p-3" scroll-y>
        <!-- My Projects - Collapsible -->
        <view class="mb-4">
          <view 
            class="mb-2 flex items-center gap-2 px-2 text-base font-medium text-slate-700"
            @tap="toggleProjects"
          >
            <text class="icon">{{ isProjectsExpanded ? '▼' : '▶' }}</text>
            <text class="icon">🏠</text>
            <text>我的项目</text>
            <text class="ml-auto text-sm text-slate-500">{{ projects.length }}</text>
          </view>
          <view v-if="isProjectsExpanded" class="space-y-1">
            <view
              v-for="project in projects"
              :key="project.id"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
              :class="project.id === activeProjectId && !isMarketplace && !isCalendar ? 'bg-white shadow-sm' : 'hover:bg-white/50'"
              @tap="handleProjectClick(project.id)"
            >
              <view
                class="flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium shadow-sm text-white"
                style="background-color: #336df4"
              >
                <text>{{ project.name.slice(0, 2) }}</text>
              </view>
              <view class="flex-1 min-w-0">
                <text 
                  class="text-base font-medium truncate block"
                  :class="project.id === activeProjectId ? 'text-black' : 'text-gray-500'"
                >
                  {{ project.name }}
                </text>
                <text 
                  class="text-xs block"
                  :class="project.id === activeProjectId ? 'text-slate-600' : 'text-gray-400'"
                >
                  {{ project.lastModified }}
                </text>
              </view>
              <view 
                v-if="getMessageCount(project.id) > 0"
                class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 shadow-md"
              >
                <text class="text-xs font-medium text-white">{{ getMessageCount(project.id) }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- My Tasks - Collapsible -->
        <view class="mb-4">
          <view 
            class="mb-2 flex items-center gap-2 px-2 text-base font-medium text-slate-700"
            @tap="toggleTasks"
          >
            <text class="icon">{{ isTasksExpanded ? '▼' : '▶' }}</text>
            <text class="icon">✓</text>
            <text>我的任务</text>
            <text class="ml-auto text-sm text-slate-500">{{ userTasks.length }}</text>
          </view>
          <view v-if="isTasksExpanded" class="space-y-1">
            <view
              v-for="task in userTasks"
              :key="task.id"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
              :class="activeTaskId === task.id ? 'bg-white shadow-sm' : 'hover:bg-white/50'"
              @tap="handleTaskClick(task.id)"
            >
              <view
                class="flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium shadow-sm text-white"
                style="background-color: #336df4"
              >
                <text>{{ task.title.slice(0, 2) }}</text>
              </view>
              <view class="flex-1 min-w-0">
                <text 
                  class="text-base font-medium truncate block"
                  :class="activeTaskId === task.id ? 'text-black' : 'text-gray-500'"
                >
                  {{ task.title }}
                </text>
                <text 
                  class="text-xs block"
                  :class="activeTaskId === task.id ? 'text-slate-600' : 'text-gray-400'"
                >
                  {{ task.project }} · {{ task.dueDate }}
                </text>
              </view>
              <view 
                v-if="task.messageCount > 0"
                class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 shadow-md"
              >
                <text class="text-xs font-medium text-white">{{ task.messageCount }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Community & Workflows -->
        <view class="mb-4">
          <view class="mb-2 flex items-center gap-2 px-2 text-base font-medium text-slate-700">
            <text class="icon">🔄</text>
            <text>共享工作流</text>
          </view>
          <view class="space-y-1">
            <view v-if="savedWorkflows.length === 0">
              <view
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
                :class="isMarketplace ? 'bg-white shadow-sm text-black' : 'text-slate-700 hover:bg-white/50'"
                @tap="navigateToMarketplace"
              >
                <view
                  class="flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium shadow-sm text-white"
                  style="background-color: #336df4"
                >
                  <text>浏</text>
                </view>
                <view class="flex-1 min-w-0">
                  <text 
                    class="text-base font-medium truncate block"
                    :class="isMarketplace ? 'text-black' : 'text-gray-500'"
                  >
                    浏览模板
                  </text>
                </view>
              </view>
            </view>
            <view
              v-for="(workflow, idx) in savedWorkflows"
              :key="idx"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-base text-gray-500 transition-colors hover:bg-white/50"
            >
              <text class="icon">🔄</text>
              <text class="truncate">{{ workflow }}</text>
            </view>
          </view>
        </view>

        <!-- Calendar -->
        <view class="mb-4">
          <view class="mb-2 flex items-center gap-2 px-2 text-base font-medium text-slate-700">
            <text class="icon">📅</text>
            <text>日历</text>
          </view>
          <view class="space-y-1">
            <view
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
              :class="isCalendar ? 'bg-white shadow-sm text-black' : 'text-slate-700 hover:bg-white/50'"
              @tap="navigateToCalendar"
            >
              <view
                class="flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium shadow-sm text-white"
                style="background-color: #336df4"
              >
                <text>日</text>
              </view>
              <view class="flex-1 min-w-0">
                <text 
                  class="text-base font-medium truncate block"
                  :class="isCalendar ? 'text-black' : 'text-gray-500'"
                >
                  查看日历
                </text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- User Profile -->
      <view class="p-3">
        <view class="flex items-center gap-3 rounded-lg px-3 py-2">
          <image 
            class="h-10 w-10 rounded-full border-2"
            src="https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg"
            mode="aspectFill"
            @tap="navigateToProfile"
          />
          <view class="flex-1 min-w-0">
            <text class="text-base font-medium text-slate-700 truncate block">古德奈特</text>
            <text class="text-sm text-slate-500 block">队长</text>
          </view>
          <view class="relative">
            <text class="icon text-slate-400" @tap="toggleMenu">➕</text>
            <view v-if="showMenu" class="menu-popup">
              <view class="menu-item" @tap="handleCreateDoc">
                <text class="icon">📄</text>
                <text>创建文档</text>
              </view>
              <view class="menu-item" @tap="handleCreateGroup">
                <text class="icon">👥</text>
                <text>创建群组</text>
              </view>
              <view class="menu-item" @tap="handleAddContact">
                <text class="icon">➕👤</text>
                <text>添加联系人</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { USER_TASKS, PROJECT_MESSAGE_COUNTS } from '../../common/initial-projects'

export default {
  name: 'LeftSidebar',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    projects: {
      type: Array,
      required: true
    },
    activeProjectId: {
      type: String,
      required: true
    },
    savedWorkflows: {
      type: Array,
      default: () => []
    },
    activeTaskId: {
      type: [String, null],
      default: null
    },
    currentRoute: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      isProjectsExpanded: true,
      isTasksExpanded: true,
      showMenu: false,
      userTasks: USER_TASKS
    }
  },
  computed: {
    isMarketplace() {
      return this.currentRoute === '/marketplace'
    },
    isCalendar() {
      return this.currentRoute === '/calendar'
    }
  },
  methods: {
    handleMaskClick() {
      this.$emit('update:visible', false)
    },
    toggleProjects() {
      this.isProjectsExpanded = !this.isProjectsExpanded
    },
    toggleTasks() {
      this.isTasksExpanded = !this.isTasksExpanded
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    getMessageCount(projectId) {
      return PROJECT_MESSAGE_COUNTS[projectId] || 0
    },
    handleProjectClick(projectId) {
      this.$emit('update:activeProjectId', projectId)
      this.$emit('update:activeTaskId', null)
      if (this.isMarketplace || this.isCalendar) {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
      this.$emit('update:visible', false)
    },
    handleTaskClick(taskId) {
      this.$emit('update:activeTaskId', taskId)
      if (this.isMarketplace || this.isCalendar) {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
      this.$emit('update:visible', false)
    },
    navigateToMarketplace() {
      uni.navigateTo({
        url: '/pagesC/marketplace/marketplace'
      })
      this.$emit('update:visible', false)
    },
    navigateToCalendar() {
      uni.navigateTo({
        url: '/pagesC/calendar/calendar'
      })
      this.$emit('update:visible', false)
    },
    navigateToProfile() {
      uni.navigateTo({
        url: '/pages/profile/profile'
      })
      this.$emit('update:visible', false)
    },
    handleCreateDoc() {
      this.showMenu = false
      uni.showToast({
        title: '创建文档功能开发中',
        icon: 'none'
      })
    },
    handleCreateGroup() {
      this.showMenu = false
      uni.showToast({
        title: '创建群组功能开发中',
        icon: 'none'
      })
    },
    handleAddContact() {
      this.showMenu = false
      uni.showToast({
        title: '添加联系人功能开发中',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.sidebar-drawer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background-color: #e0e6f7;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.icon {
  font-size: 20px;
  line-height: 1.2;
}

.space-y-1 > view + view {
  margin-top: 4px;
}

.menu-popup {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  width: 160px;
  border-radius: 12px;
  background-color: white;
  padding: 8px 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  font-size: 14px;
  color: #334155;
}

.menu-item:active {
  background-color: #f1f5f9;
}

/* Tailwind-like utility classes */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.px-2 { padding-left: 8px; padding-right: 8px; }
.px-3 { padding-left: 12px; padding-right: 12px; }
.px-4 { padding-left: 16px; padding-right: 16px; }
.py-2 { padding-top: 8px; padding-bottom: 8px; }
.py-2\.5 { padding-top: 10px; padding-bottom: 10px; }
.p-3 { padding: 12px; }
.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 16px; }
.ml-auto { margin-left: auto; }
.h-5 { height: 20px; }
.w-5 { width: 20px; }
.h-8 { height: 32px; }
.w-8 { width: 32px; }
.h-10 { height: 40px; }
.w-10 { width: 40px; }
.h-16 { height: 64px; }
.rounded-full { border-radius: 9999px; }
.rounded-lg { border-radius: 12px; }
.rounded-md { border-radius: 8px; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-base { font-size: 16px; }
.text-lg { font-size: 18px; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.text-white { color: white; }
.text-black { color: black; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-slate-700 { color: #334155; }
.text-slate-900 { color: #0f172a; }
.text-gray-400 { color: #9ca3af; }
.text-gray-500 { color: #6b7280; }
.text-red-500 { color: #ef4444; }
.bg-white { background-color: white; }
.bg-red-500 { background-color: #ef4444; }
.bg-slate-300 { background-color: #cbd5e1; }
.border-2 { border-width: 2px; }
.truncate { 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap; 
}
.block { display: block; }
.min-w-0 { min-width: 0; }
.flex-1 { flex: 1; }
.relative { position: relative; }
.transition-colors { transition: color 0.2s, background-color 0.2s; }
</style>

