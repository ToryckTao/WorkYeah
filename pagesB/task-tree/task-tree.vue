<template>
  <view class="task-tree-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">任务树</text>
      <view class="navbar-right"></view>
    </view>

    <scroll-view class="task-tree-content" scroll-y>
      <!-- 页面标题 -->
      <view class="page-header">
        <text class="page-title">项目工作分解结构</text>
        <view class="modify-btn" @click="openModifyModal">
          <text class="modify-btn-text">修改计划</text>
        </view>
      </view>

      <!-- 任务列表 -->
      <view class="tasks-list">
        <!-- 任务1 -->
        <view class="task-card task-card-active" v-for="(task, index) in tasks" :key="task.id">
          <view class="task-header" @click="toggleTask(task.id)">
            <view class="task-header-left">
              <image v-if="expandedTasks.includes(task.id)" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="chevron-icon-img chevron-expanded" mode="aspectFit"></image>
              <image v-else src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="chevron-icon-img" mode="aspectFit"></image>
              <image v-if="task.status === 'in-progress'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/clock.png" class="status-icon-img status-icon-active" mode="aspectFit"></image>
              <image v-else-if="task.status === 'completed'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="status-icon-img status-icon-completed" mode="aspectFit"></image>
              <image v-else src="https://workyean.oss-cn-beijing.aliyuncs.com/static/clock.png" class="status-icon-img status-icon-pending" mode="aspectFit"></image>
              <text class="task-title">{{ task.name }}</text>
            </view>
            <view :class="['task-badge', 'task-badge-' + task.status]">
              <text class="task-badge-text">{{ getStatusText(task.status) }}</text>
            </view>
          </view>

          <!-- 子任务 -->
          <view v-if="expandedTasks.includes(task.id)" class="subtasks-container">
            <view class="subtask-item" v-for="subtask in task.subtasks" :key="subtask.id">
              <image v-if="subtask.status === 'in-progress'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/clock.png" class="subtask-icon-img subtask-icon-active" mode="aspectFit"></image>
              <image v-else-if="subtask.status === 'completed'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="subtask-icon-img subtask-icon-completed" mode="aspectFit"></image>
              <image v-else src="https://workyean.oss-cn-beijing.aliyuncs.com/static/clock.png" class="subtask-icon-img subtask-icon-pending" mode="aspectFit"></image>
              <text :class="['subtask-name', subtask.status === 'pending' ? 'subtask-name-pending' : '']">{{ subtask.name }}</text>
              <image :src="subtask.avatar" class="subtask-avatar" mode="aspectFill"></image>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 修改计划弹窗 -->
    <view v-if="showModifyModal" class="modify-modal-overlay" @click="closeModifyModal">
      <view class="modify-modal" @click.stop>
        <!-- 弹窗头部 -->
        <view class="modal-header">
          <text class="modal-title">修改计划</text>
          <view class="modal-close" @click="closeModifyModal">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
          </view>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <!-- 提示信息 -->
          <view class="edit-tips">
            <text>点击任务名称可编辑，点击状态可切换，点击头像可更换负责人</text>
          </view>

          <!-- 任务编辑列表 -->
          <view class="edit-task-list">
            <view class="edit-task-item" v-for="(task, taskIndex) in editTasks" :key="task.id">
              <view class="edit-task-header">
                <view class="task-order-btns">
                  <view class="order-btn" :class="{ 'order-btn-disabled': taskIndex === 0 }" @click="moveTaskUp(taskIndex)">
                    <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-left.png" class="order-icon-img order-up" mode="aspectFit"></image>
                  </view>
                  <view class="order-btn" :class="{ 'order-btn-disabled': taskIndex === editTasks.length - 1 }" @click="moveTaskDown(taskIndex)">
                    <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="order-icon-img" mode="aspectFit"></image>
                  </view>
                </view>
                <input class="edit-task-name" v-model="task.name" placeholder="任务名称" />
                <view :class="['status-tag', 'status-tag-' + task.status]" @click="showTaskStatusPicker(taskIndex)">
                  <text>{{ getStatusText(task.status) }}</text>
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="status-tag-arrow" mode="aspectFit"></image>
                </view>
                <view class="edit-task-delete" @click="showDeleteTaskConfirm(taskIndex)">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/delete.png" class="delete-icon-img" mode="aspectFit"></image>
                </view>
              </view>

              <!-- 子任务编辑 -->
              <view class="edit-subtasks">
                <view class="edit-subtask-item" v-for="(subtask, subIndex) in task.subtasks" :key="subtask.id">
                  <view class="subtask-line"></view>
                  <input class="edit-subtask-name" v-model="subtask.name" placeholder="子任务名称" />
                  <view :class="['subtask-status-tag', 'subtask-status-' + subtask.status]" @click="showSubtaskStatusPicker(taskIndex, subIndex)">
                    <text>{{ getStatusText(subtask.status) }}</text>
                  </view>
                  <view class="assignee-wrapper" @click="showAssigneePicker(taskIndex, subIndex)">
                    <image :src="subtask.avatar" class="edit-subtask-avatar" mode="aspectFill"></image>
                    <text class="assignee-name">{{ getAssigneeName(subtask.avatar) }}</text>
                  </view>
                  <view class="edit-subtask-delete" @click="showDeleteSubtaskConfirm(taskIndex, subIndex)">
                    <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="subtask-delete-icon-img" mode="aspectFit"></image>
                  </view>
                </view>
                <view class="add-subtask-btn" @click="handleAddSubtask(taskIndex)">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/plus.png" class="add-btn-icon" mode="aspectFit"></image>
                  <text>添加子任务</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 添加一级任务按钮 -->
          <view class="add-task-btn" @click="addTask">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/plus.png" class="add-btn-icon" mode="aspectFit"></image>
            <text>添加一级任务</text>
          </view>

          <!-- 底部占位 -->
          <view class="scroll-bottom-spacer"></view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="modal-footer">
          <view class="footer-btn cancel-btn" @click="closeModifyModal">
            <text>取消</text>
          </view>
          <view class="footer-btn save-btn" @click="saveModify">
            <text>保存计划</text>
          </view>
        </view>

        <!-- 删除确认对话框 -->
        <view v-if="showDeleteConfirm" class="delete-confirm-overlay" @click="cancelDelete">
          <view class="delete-confirm-box" @click.stop>
            <text class="delete-confirm-title">{{ deleteConfirmTitle }}</text>
            <text class="delete-confirm-content">{{ deleteConfirmContent }}</text>
            <view class="delete-confirm-btns">
              <view class="confirm-btn confirm-cancel" @click="cancelDelete">
                <text>取消</text>
              </view>
              <view class="confirm-btn confirm-delete" @click="confirmDelete">
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 选择器弹窗 -->
        <view v-if="showPicker" class="picker-overlay" @click="closePicker">
          <view class="picker-box" @click.stop>
            <view class="picker-header">
              <text class="picker-title">{{ pickerTitle }}</text>
              <view class="picker-close" @click="closePicker">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="picker-close-icon-img" mode="aspectFit"></image>
              </view>
            </view>
            <view class="picker-options">
              <view 
                class="picker-option" 
                v-for="(item, index) in pickerOptions" 
                :key="index"
                :class="{ 'picker-option-active': index === pickerCurrentIndex }"
                @click="selectPickerOption(index)"
              >
                <image v-if="pickerType === 'assignee'" :src="assignees[index].avatar" class="picker-avatar" mode="aspectFill"></image>
                <view v-if="pickerType === 'status'" :class="['picker-status-dot', 'picker-status-' + statusOptions[index]]"></view>
                <text class="picker-option-text">{{ item }}</text>
                <image v-if="index === pickerCurrentIndex" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="picker-check-img" mode="aspectFit"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      projectId: '',
      projectName: '',
      expandedTasks: ['task-1'],
      tasks: [],
      showModifyModal: false,
      editTasks: [],
      statusOptions: ['pending', 'in-progress', 'completed'],
      statusLabels: ['待办', '进行中', '已完成'],
      assignees: [
        { name: '古德奈特', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
        { name: '萧祷', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
        { name: '一墨乾行', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
      ],
      assigneeNames: ['古德奈特', '萧祷', '一墨乾行'],
      showDeleteConfirm: false,
      deleteConfirmTitle: '',
      deleteConfirmContent: '',
      deleteType: '',
      deleteTaskIndex: -1,
      deleteSubIndex: -1,
      showPicker: false,
      pickerTitle: '',
      pickerOptions: [],
      pickerType: '',
      pickerTaskIndex: -1,
      pickerSubIndex: -1,
      pickerCurrentIndex: 0
    }
  },
  onLoad: function(options) {
    this.projectId = options.id || ''
    this.projectName = decodeURIComponent(options.name || '')
    this.loadTasks()
  },
  methods: {
    loadTasks: function() {
      if (this.projectName === '智慧养老APP') {
        this.tasks = [
          {
            id: 'task-1',
            name: '1. 需求分析',
            status: 'in-progress',
            subtasks: [
              { id: 'sub-1-1', name: '1.1 用户访谈', status: 'in-progress', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-1-2', name: '1.2 功能优先级', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-1-3', name: '1.3 竞品分析', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          },
          {
            id: 'task-2',
            name: '2. 界面设计',
            status: 'pending',
            subtasks: [
              { id: 'sub-2-1', name: '2.1 低保真原型', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-2-2', name: '2.2 高保真设计', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-2-3', name: '2.3 交互设计', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          },
          {
            id: 'task-3',
            name: '3. 核心功能开发',
            status: 'pending',
            subtasks: [
              { id: 'sub-3-1', name: '3.1 健康监测模块', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-3-2', name: '3.2 用药提醒功能', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-3-3', name: '3.3 紧急呼叫系统', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          },
          {
            id: 'task-4',
            name: '4. 测试与优化',
            status: 'pending',
            subtasks: [
              { id: 'sub-4-1', name: '4.1 单元测试', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-4-2', name: '4.2 集成测试', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-4-3', name: '4.3 性能优化', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          },
          {
            id: 'task-5',
            name: '5. 项目部署',
            status: 'pending',
            subtasks: [
              { id: 'sub-5-1', name: '5.1 服务器部署', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-5-2', name: '5.2 域名配置', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-5-3', name: '5.3 监控配置', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          }
        ]
      } else if (this.projectName === '辛亥革命论文') {
        this.tasks = [
          {
            id: 'task-1',
            name: '1. 史料搜集与整理',
            status: 'in-progress',
            subtasks: [
              { id: 'sub-1-1', name: '1.1 一级文献筛选', status: 'in-progress', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-1-2', name: '1.2 二手资料阅读', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-1-3', name: '1.3 史料考证与验证', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          },
          {
            id: 'task-2',
            name: '2. 时代背景分析',
            status: 'pending',
            subtasks: [
              { id: 'sub-2-1', name: '2.1 政治经济形势梳理', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-2-2', name: '2.2 社会矛盾分析', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-2-3', name: '2.3 思想文化背景', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          },
          {
            id: 'task-3',
            name: '3. 重大事件梳理',
            status: 'completed',
            subtasks: [
              { id: 'sub-3-1', name: '3.1 武昌起义经过', status: 'completed', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-3-2', name: '3.2 各省响应情况', status: 'completed', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-3-3', name: '3.3 清廷退位过程', status: 'completed', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          },
          {
            id: 'task-4',
            name: '4. 历史影响评估',
            status: 'pending',
            subtasks: [
              { id: 'sub-4-1', name: '4.1 政治体制变革', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-4-2', name: '4.2 社会结构影响', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-4-3', name: '4.3 对后世启示', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          },
          {
            id: 'task-5',
            name: '5. 论文撰写与格式',
            status: 'pending',
            subtasks: [
              { id: 'sub-5-1', name: '5.1 摘要与关键词', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-5-2', name: '5.2 引用格式统一', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
              { id: 'sub-5-3', name: '5.3 语言润色', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
            ]
          }
        ]
      } else {
        this.tasks = [
          {
            id: 'task-1',
            name: '1. 项目启动',
            status: 'in-progress',
            subtasks: [
              { id: 'sub-1-1', name: '1.1 需求确认', status: 'in-progress', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-1-2', name: '1.2 团队组建', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' }
            ]
          },
          {
            id: 'task-2',
            name: '2. 方案设计',
            status: 'pending',
            subtasks: [
              { id: 'sub-2-1', name: '2.1 技术选型', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
              { id: 'sub-2-2', name: '2.2 架构设计', status: 'pending', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' }
            ]
          }
        ]
      }
    },
    
    toggleTask: function(taskId) {
      const index = this.expandedTasks.indexOf(taskId)
      if (index > -1) {
        this.expandedTasks.splice(index, 1)
      } else {
        this.expandedTasks.push(taskId)
      }
      this.$forceUpdate()
    },
    
    getStatusText: function(status) {
      const statusMap = {
        'in-progress': '进行中',
        'completed': '已完成',
        'pending': '待办'
      }
      return statusMap[status] || '未知'
    },
    
    openModifyModal: function() {
      this.editTasks = JSON.parse(JSON.stringify(this.tasks))
      this.showModifyModal = true
    },
    
    closeModifyModal: function() {
      this.showModifyModal = false
    },
    
    showTaskStatusPicker: function(taskIndex) {
      var currentStatus = this.editTasks[taskIndex].status
      var currentIndex = this.statusOptions.indexOf(currentStatus)
      
      this.pickerType = 'taskStatus'
      this.pickerTitle = '选择任务状态'
      this.pickerOptions = this.statusLabels
      this.pickerTaskIndex = taskIndex
      this.pickerSubIndex = -1
      this.pickerCurrentIndex = currentIndex >= 0 ? currentIndex : 0
      this.showPicker = true
    },
    
    showSubtaskStatusPicker: function(taskIndex, subIndex) {
      var currentStatus = this.editTasks[taskIndex].subtasks[subIndex].status
      var currentIndex = this.statusOptions.indexOf(currentStatus)
      
      this.pickerType = 'status'
      this.pickerTitle = '选择状态'
      this.pickerOptions = this.statusLabels
      this.pickerTaskIndex = taskIndex
      this.pickerSubIndex = subIndex
      this.pickerCurrentIndex = currentIndex >= 0 ? currentIndex : 0
      this.showPicker = true
    },
    
    showAssigneePicker: function(taskIndex, subIndex) {
      var currentAvatar = this.editTasks[taskIndex].subtasks[subIndex].avatar
      var currentIndex = this.getAssigneeIndex(currentAvatar)
      
      this.pickerType = 'assignee'
      this.pickerTitle = '选择负责人'
      this.pickerOptions = this.assigneeNames
      this.pickerTaskIndex = taskIndex
      this.pickerSubIndex = subIndex
      this.pickerCurrentIndex = currentIndex
      this.showPicker = true
    },
    
    closePicker: function() {
      this.showPicker = false
    },
    
    selectPickerOption: function(index) {
      if (this.pickerType === 'taskStatus') {
        this.editTasks[this.pickerTaskIndex].status = this.statusOptions[index]
      } else if (this.pickerType === 'status') {
        this.editTasks[this.pickerTaskIndex].subtasks[this.pickerSubIndex].status = this.statusOptions[index]
        this.updateTaskStatus(this.pickerTaskIndex)
      } else if (this.pickerType === 'assignee') {
        this.editTasks[this.pickerTaskIndex].subtasks[this.pickerSubIndex].avatar = this.assignees[index].avatar
      }
      
      this.showPicker = false
      this.$forceUpdate()
    },
    
    updateTaskStatus: function(taskIndex) {
      var task = this.editTasks[taskIndex]
      if (!task.subtasks || task.subtasks.length === 0) return
      
      var allCompleted = true
      var anyInProgress = false
      var anyCompleted = false
      
      for (var i = 0; i < task.subtasks.length; i++) {
        if (task.subtasks[i].status !== 'completed') {
          allCompleted = false
        }
        if (task.subtasks[i].status === 'in-progress') {
          anyInProgress = true
        }
        if (task.subtasks[i].status === 'completed') {
          anyCompleted = true
        }
      }
      
      if (allCompleted) {
        task.status = 'completed'
      } else if (anyInProgress || anyCompleted) {
        task.status = 'in-progress'
      } else {
        task.status = 'pending'
      }
    },
    
    getAssigneeIndex: function(avatar) {
      for (var i = 0; i < this.assignees.length; i++) {
        if (this.assignees[i].avatar === avatar) {
          return i
        }
      }
      return 0
    },
    
    getAssigneeName: function(avatar) {
      for (var i = 0; i < this.assignees.length; i++) {
        if (this.assignees[i].avatar === avatar) {
          return this.assignees[i].name
        }
      }
      return '未分配'
    },
    
    addTask: function() {
      var newTaskNum = this.editTasks.length + 1
      var newTask = {
        id: 'task-' + Date.now(),
        name: newTaskNum + '. 新任务',
        status: 'pending',
        subtasks: []
      }
      this.editTasks.push(newTask)
      this.$forceUpdate()
      uni.showToast({
        title: '已添加新任务',
        icon: 'none',
        duration: 1500
      })
    },
    
    moveTaskUp: function(taskIndex) {
      if (taskIndex <= 0) return
      var temp = this.editTasks[taskIndex]
      this.$set(this.editTasks, taskIndex, this.editTasks[taskIndex - 1])
      this.$set(this.editTasks, taskIndex - 1, temp)
      this.renumberTasks()
      this.$forceUpdate()
    },
    
    moveTaskDown: function(taskIndex) {
      if (taskIndex >= this.editTasks.length - 1) return
      var temp = this.editTasks[taskIndex]
      this.$set(this.editTasks, taskIndex, this.editTasks[taskIndex + 1])
      this.$set(this.editTasks, taskIndex + 1, temp)
      this.renumberTasks()
      this.$forceUpdate()
    },
    
    showDeleteTaskConfirm: function(taskIndex) {
      var task = this.editTasks[taskIndex]
      var hasSubtasks = task.subtasks && task.subtasks.length > 0
      
      this.deleteType = 'task'
      this.deleteTaskIndex = taskIndex
      this.deleteSubIndex = -1
      this.deleteConfirmTitle = '删除任务'
      this.deleteConfirmContent = hasSubtasks ? '此任务包含' + task.subtasks.length + '个子任务，确定删除？' : '确定删除此任务？'
      this.showDeleteConfirm = true
    },
    
    showDeleteSubtaskConfirm: function(taskIndex, subIndex) {
      this.deleteType = 'subtask'
      this.deleteTaskIndex = taskIndex
      this.deleteSubIndex = subIndex
      this.deleteConfirmTitle = '删除子任务'
      this.deleteConfirmContent = '确定删除此子任务？'
      this.showDeleteConfirm = true
    },
    
    cancelDelete: function() {
      this.showDeleteConfirm = false
      this.deleteType = ''
      this.deleteTaskIndex = -1
      this.deleteSubIndex = -1
    },
    
    confirmDelete: function() {
      if (this.deleteType === 'task' && this.deleteTaskIndex >= 0) {
        this.editTasks.splice(this.deleteTaskIndex, 1)
        this.renumberTasks()
      } else if (this.deleteType === 'subtask' && this.deleteTaskIndex >= 0 && this.deleteSubIndex >= 0) {
        this.editTasks[this.deleteTaskIndex].subtasks.splice(this.deleteSubIndex, 1)
        this.updateTaskStatus(this.deleteTaskIndex)
      }
      
      this.showDeleteConfirm = false
      this.deleteType = ''
      this.deleteTaskIndex = -1
      this.deleteSubIndex = -1
      this.$forceUpdate()
      
      uni.showToast({
        title: '已删除',
        icon: 'none'
      })
    },
    
    renumberTasks: function() {
      for (var i = 0; i < this.editTasks.length; i++) {
        var task = this.editTasks[i]
        var oldNum = task.name.match(/^(\d+)\.\s*/)
        if (oldNum) {
          task.name = task.name.replace(/^(\d+)\.\s*/, (i + 1) + '. ')
        }
      }
    },
    
    handleAddSubtask: function(taskIndex) {
      var task = this.editTasks[taskIndex]
      var subNum = task.subtasks.length + 1
      var taskNumMatch = task.name.match(/^(\d+)/)
      var taskNum = taskNumMatch ? taskNumMatch[0] : (taskIndex + 1)
      var newSubtask = {
        id: 'sub-' + Date.now(),
        name: taskNum + '.' + subNum + ' 新子任务',
        status: 'pending',
        avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg'
      }
      task.subtasks.push(newSubtask)
      this.$forceUpdate()
    },
    
    saveModify: function() {
      var hasEmpty = false
      for (var i = 0; i < this.editTasks.length; i++) {
        if (!this.editTasks[i].name.trim()) {
          hasEmpty = true
          break
        }
      }
      if (hasEmpty) {
        uni.showToast({
          title: '请填写任务名称',
          icon: 'none'
        })
        return
      }
      
      this.tasks = JSON.parse(JSON.stringify(this.editTasks))
      this.showModifyModal = false
      uni.showToast({
        title: '计划已保存',
        icon: 'success'
      })
    },
    
    goBack: function() {
      var pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  }
}
</script>

<style scoped>
.task-tree-container {
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* 自定义导航栏 */
.custom-navbar {
  background-color: #ffffff;
  padding: 20rpx 24rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
}

.navbar-left,
.navbar-right {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
  color: #0f172a;
}

.back-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.navbar-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0f172a;
  flex: 1;
  text-align: center;
}

/* 内容区域 */
.task-tree-content {
  flex: 1;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 页面标题 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

.modify-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: transparent;
}

.modify-btn-text {
  font-size: 14px;
  color: #0f172a;
}

/* 任务列表 */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.task-card-active {
  background-color: #e4edfc;
  border: 2px solid #e2e8f0;
}

.task-header {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  overflow: hidden;
}

.task-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.chevron-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
  flex-shrink: 0;
}

.chevron-icon-img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.chevron-icon-img.chevron-expanded {
  transform: rotate(0deg);
}

.chevron-icon-img:not(.chevron-expanded) {
  transform: rotate(-90deg);
}

.status-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.status-icon-img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.status-icon-active {
  color: #64748b;
}

.status-icon-completed {
  color: #10b981;
}

.status-icon-pending {
  color: #cbd5e1;
}

.task-title {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-badge {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid;
  flex-shrink: 0;
}

.task-badge-in-progress {
  background-color: transparent;
  border-color: #cbd5e1;
}

.task-badge-completed {
  background-color: transparent;
  border-color: #cbd5e1;
}

.task-badge-pending {
  background-color: transparent;
  border-color: #cbd5e1;
}

.task-badge-text {
  font-size: 12px;
  color: #0f172a;
}

/* 子任务 */
.subtasks-container {
  border-top: 1px solid #e2e8f0;
  background-color: #ffffff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 12px 12px 12px 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  overflow: hidden;
}

.subtask-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.subtask-icon-img {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.subtask-icon-active {
  color: #64748b;
}

.subtask-icon-completed {
  color: #10b981;
}

.subtask-icon-pending {
  color: #cbd5e1;
}

.subtask-name {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtask-name-pending {
  color: #64748b;
}

.subtask-avatar {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  flex-shrink: 0;
}

/* 修改计划弹窗样式 */
.modify-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modify-modal {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  background-color: #ffffff;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f1f5f9;
}

.modal-close svg {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.close-icon-img {
  width: 20px;
  height: 20px;
}

.modal-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
}

.edit-tips {
  padding: 12px 16px;
  background-color: #eff6ff;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #bfdbfe;
  width: 100%;
  box-sizing: border-box;
}

.edit-tips text {
  font-size: 12px;
  color: #3b82f6;
  line-height: 1.5;
}

.edit-task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.edit-task-item {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.edit-task-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.task-order-btns {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.order-btn {
  width: 24px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  border-radius: 4px;
}

.order-btn:active {
  background-color: #e2e8f0;
}

.order-btn svg {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.order-icon-img {
  width: 14px;
  height: 14px;
}

.order-up {
  transform: rotate(90deg);
}

.order-btn-disabled {
  opacity: 0.3;
}

.order-btn-disabled:active {
  background-color: #f1f5f9;
}

.edit-task-name {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.edit-task-status {
  flex-shrink: 0;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  flex-shrink: 0;
}

.status-tag:active {
  opacity: 0.7;
}

.status-tag svg {
  width: 12px;
  height: 12px;
  color: #64748b;
}

.status-tag-arrow {
  width: 12px;
  height: 12px;
}

.status-tag-pending {
  color: #64748b;
}

.status-tag-in-progress {
  color: #3b82f6;
  background-color: #eff6ff;
  border-color: #bfdbfe;
}

.status-tag-completed {
  color: #10b981;
  background-color: #ecfdf5;
  border-color: #a7f3d0;
}

.edit-task-delete {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.edit-task-delete svg {
  width: 18px;
  height: 18px;
  color: #ef4444;
}

.delete-icon-img {
  width: 18px;
  height: 18px;
}

.edit-subtasks {
  margin-top: 12px;
  padding-left: 36px;
  width: 100%;
  box-sizing: border-box;
}

.edit-subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
}

.subtask-line {
  width: 12px;
  height: 2px;
  background-color: #cbd5e1;
  flex-shrink: 0;
}

.edit-subtask-name {
  flex: 1;
  min-width: 120px;
  height: 36px;
  padding: 0 10px;
  font-size: 14px;
  color: #334155;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.subtask-status-picker {
  flex-shrink: 0;
}

.subtask-status-tag {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  flex-shrink: 0;
}

.subtask-status-tag:active {
  opacity: 0.7;
}

.subtask-status-pending {
  color: #64748b;
  background-color: #f8fafc;
}

.subtask-status-in-progress {
  color: #3b82f6;
  background-color: #eff6ff;
  border-color: #bfdbfe;
}

.subtask-status-completed {
  color: #10b981;
  background-color: #ecfdf5;
  border-color: #a7f3d0;
}

.assignee-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 4px;
  background-color: #f8fafc;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.assignee-wrapper:active {
  opacity: 0.7;
  background-color: #e2e8f0;
}

.edit-subtask-avatar {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 1px solid #ffffff;
}

.assignee-name {
  font-size: 12px;
  color: #475569;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-subtask-delete {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 6px;
}

.edit-subtask-delete:active {
  background-color: #fee2e2;
}

.edit-subtask-delete svg {
  width: 16px;
  height: 16px;
  color: #ef4444;
}

.subtask-delete-icon-img {
  width: 16px;
  height: 16px;
}

.add-subtask-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  margin-top: 4px;
}

.add-subtask-btn svg {
  width: 16px;
  height: 16px;
  color: #3b82f6;
}

.add-btn-icon {
  width: 16px;
  height: 16px;
}

.add-subtask-btn text {
  font-size: 13px;
  color: #3b82f6;
}

.add-task-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  margin-top: 16px;
  background-color: #eff6ff;
  border: 2px dashed #93c5fd;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}

.add-task-btn:active {
  background-color: #dbeafe;
}

.add-task-btn svg {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.add-task-btn .add-btn-icon {
  width: 20px;
  height: 20px;
}

.add-task-btn text {
  font-size: 14px;
  color: #3b82f6;
  font-weight: 500;
}

.scroll-bottom-spacer {
  height: 20px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid #e2e8f0;
  background-color: #ffffff;
  flex-shrink: 0;
}

.footer-btn {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.footer-btn text {
  font-size: 15px;
  font-weight: 500;
}

.cancel-btn {
  background-color: #f1f5f9;
}

.cancel-btn text {
  color: #64748b;
}

.save-btn {
  background-color: #3b82f6;
}

.save-btn text {
  color: #ffffff;
}

/* 删除确认对话框 */
.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.delete-confirm-box {
  width: 280px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.delete-confirm-title {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.delete-confirm-content {
  font-size: 14px;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 24px;
}

.delete-confirm-btns {
  display: flex;
  gap: 12px;
  width: 100%;
}

.confirm-btn {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.confirm-btn text {
  font-size: 15px;
  font-weight: 500;
}

.confirm-cancel {
  background-color: #f1f5f9;
}

.confirm-cancel text {
  color: #64748b;
}

.confirm-delete {
  background-color: #ef4444;
}

.confirm-delete text {
  color: #ffffff;
}

/* 选择器弹窗 */
.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 2000;
}

.picker-box {
  width: 100%;
  background-color: #ffffff;
  border-radius: 20px 20px 0 0;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.picker-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.picker-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-close svg {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.picker-close-icon-img {
  width: 20px;
  height: 20px;
}

.picker-options {
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  overflow-y: auto;
}

.picker-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
}

.picker-option:active {
  background-color: #f8fafc;
}

.picker-option-active {
  background-color: #eff6ff;
}

.picker-avatar {
  width: 36px;
  height: 36px;
  border-radius: 18px;
}

.picker-status-dot {
  width: 12px;
  height: 12px;
  border-radius: 6px;
}

.picker-status-pending {
  background-color: #cbd5e1;
}

.picker-status-in-progress {
  background-color: #3b82f6;
}

.picker-status-completed {
  background-color: #10b981;
}

.picker-option-text {
  flex: 1;
  font-size: 15px;
  color: #0f172a;
}

.picker-check {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.picker-check-img {
  width: 20px;
  height: 20px;
}
</style>

