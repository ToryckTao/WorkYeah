<template>
  <view class="task-detail-container">
    <!-- 顶部导航栏 -->
    <view class="top-navbar">
      <view class="nav-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
        <text class="nav-title">任务详情</text>
      </view>
      <view class="nav-right">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/settings.png" class="more-icon-img" mode="aspectFit"></image>
      </view>
    </view>

    <scroll-view class="content-scroll" scroll-y>
      <!-- 任务头部 -->
      <view class="task-header">
        <view class="badge-row">
          <view class="project-badge">
            <text class="badge-text">{{ taskData.project }}</text>
          </view>
          <view class="date-badge">
            <text class="badge-text">{{ taskData.dueDate }}</text>
          </view>
        </view>
        <text class="task-title">{{ taskData.title }}</text>
        <text class="task-description">{{ taskData.description }}</text>
      </view>

      <!-- 任务信息卡片 -->
      <view class="info-cards">
        <view class="info-card">
          <view class="assignee-avatar">
            <image class="avatar-img" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg" mode="aspectFill"></image>
          </view>
          <view class="info-content">
            <text class="info-label">负责人</text>
            <text class="info-value">{{ taskData.assignee }}</text>
          </view>
        </view>
        
        <view class="info-card">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/calendar-icon.png" class="info-icon-img" mode="aspectFit"></image>
          <view class="info-content">
            <text class="info-label">截止日期</text>
            <text class="info-value">{{ taskData.fullDueDate }}</text>
          </view>
        </view>
      </view>

      <!-- 任务进度 -->
      <view class="progress-card">
        <view class="card-header">
          <text class="card-title">任务进度</text>
        </view>
        <view class="progress-content">
          <view class="progress-bar-wrapper">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: progress + '%' }"></view>
            </view>
            <text class="progress-text">{{ progress }}%</text>
          </view>
          <text class="progress-desc">已完成 {{ completedSubtasks }}/{{ totalSubtasks }} 个子任务</text>
        </view>
      </view>

      <!-- 子任务列表 -->
      <view class="subtasks-card">
        <view class="card-header">
          <text class="card-title">子任务</text>
        </view>
        <view class="subtasks-list">
          <view 
            v-for="subtask in taskData.subtasks" 
            :key="subtask.id"
            class="subtask-item"
            @click="toggleSubtask(subtask.id)"
          >
            <view class="subtask-checkbox" :class="{ 'checked': subtask.completed }">
              <image v-if="subtask.completed" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="check-icon-img" mode="aspectFit"></image>
            </view>
            <text class="subtask-title" :class="{ 'completed': subtask.completed }">{{ subtask.title }}</text>
          </view>
        </view>
      </view>

      <!-- 附件 -->
      <view class="attachments-card" v-if="taskData.attachments && taskData.attachments.length > 0">
        <view class="card-header">
          <text class="card-title">附件</text>
        </view>
        <view class="attachments-list">
          <view 
            v-for="(attachment, index) in taskData.attachments" 
            :key="index"
            class="attachment-item"
          >
            <image v-if="attachment.endsWith('.txt')" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/txt.png" class="attachment-icon-img" mode="aspectFit"></image>
            <image v-else-if="attachment.endsWith('.pdf')" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/pdf.png" class="attachment-icon-img" mode="aspectFit"></image>
            <image v-else-if="attachment.endsWith('.xlsx') || attachment.endsWith('.xls')" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/format-xlsx.png" class="attachment-icon-img" mode="aspectFit"></image>
            <image v-else-if="attachment.endsWith('.pptx') || attachment.endsWith('.ppt')" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/pptx.png" class="attachment-icon-img" mode="aspectFit"></image>
            <image v-else-if="attachment.endsWith('.sketch')" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/sketch.png" class="attachment-icon-img" mode="aspectFit"></image>
            <image v-else src="https://workyean.oss-cn-beijing.aliyuncs.com/static/doc.png" class="attachment-icon-img" mode="aspectFit"></image>
            <text class="attachment-name">{{ attachment }}</text>
          </view>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="comments-card">
        <view class="card-header">
          <text class="card-title">评论</text>
          <text class="comment-count">{{ taskData.comments.length }}</text>
        </view>
        <view class="comments-list">
          <view 
            v-for="(comment, index) in taskData.comments" 
            :key="index"
            class="comment-item"
          >
            <image class="comment-avatar" :src="comment.avatar || 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg'" mode="aspectFill"></image>
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-user">{{ comment.user }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
            </view>
          </view>
        </view>

        <!-- 评论输入框 -->
        <view class="comment-input-wrapper">
          <input 
            class="comment-input"
            type="text"
            v-model="commentInput"
            placeholder="添加评论..."
            @confirm="addComment"
          />
          <view class="send-btn" @click="addComment">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/send.png" class="send-icon-img" mode="aspectFit"></image>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <view class="action-btn secondary-btn" @click="editTask">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/edit.png" class="btn-icon-img" mode="aspectFit"></image>
        <text class="btn-text">编辑</text>
      </view>
      <view class="action-btn primary-btn" @click="markComplete">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="btn-icon-img" mode="aspectFit"></image>
        <text class="btn-text">标记完成</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      taskId: '',
      commentInput: '',
      taskData: {
        title: '',
        project: '',
        dueDate: '',
        fullDueDate: '',
        description: '',
        assignee: '古德奈特',
        subtasks: [],
        attachments: [],
        comments: []
      }
    }
  },
  computed: {
    completedSubtasks: function() {
      return this.taskData.subtasks.filter(s => s.completed).length
    },
    totalSubtasks: function() {
      return this.taskData.subtasks.length
    },
    progress: function() {
      if (this.totalSubtasks === 0) return 0
      return Math.round((this.completedSubtasks / this.totalSubtasks) * 100)
    }
  },
  onLoad: function(options) {
    this.taskId = options.id || 't1'
    this.loadTaskData()
  },
  methods: {
    loadTaskData: function() {
      // 模拟从web端复用的任务数据
      const taskDetails = {
        t1: {
          title: '需求分析文档',
          project: '智慧养老APP',
          dueDate: '12/28',
          fullDueDate: '2024年1月25日 18:00',
          description: '根据产品需求文档，完成智慧养老App的高保真原型设计，包括首页、健康监测、用药提醒、紧急呼叫等核心功能模块的界面设计。',
          assignee: '古德奈特',
          subtasks: [
            { id: 's1', title: '完成首页布局设计', completed: true },
            { id: 's2', title: '设计健康监测模块', completed: true },
            { id: 's3', title: '设计用药提醒功能', completed: false },
            { id: 's4', title: '设计紧急呼叫界面', completed: false },
            { id: 's5', title: '整合并导出原型文件', completed: false }
          ],
          attachments: ['需求文档v2.docx', '竞品分析.pdf', 'UI规范.sketch'],
          comments: [
            { user: '萧祷', content: '首页的布局建议参考竞品分析中的方案B', time: '2小时前', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
            { user: 'Fine', content: '紧急呼叫按钮需要更醒目一些', time: '1小时前', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/Fine.jpg' }
          ]
        },
        t2: {
          title: '数据库设计',
          project: '智慧养老APP',
          dueDate: '12/30',
          fullDueDate: '2024年1月26日 12:00',
          description: '撰写智慧养老App的产品需求文档，详细描述各功能模块的业务逻辑、用户交互流程和技术要求。',
          assignee: '古德奈特',
          subtasks: [
            { id: 's1', title: '整理用户调研结果', completed: true },
            { id: 's2', title: '编写功能需求列表', completed: false },
            { id: 's3', title: '绘制用户流程图', completed: false }
          ],
          attachments: ['需求模板.docx'],
          comments: []
        },
        t3: {
          title: '资料收集',
          project: '辛亥革命论文',
          dueDate: '01/05',
          fullDueDate: '2024年1月27日 09:00',
          description: '收集并整理洋务运动相关的历史文献资料，为近代史汇报准备素材。',
          assignee: '古德奈特',
          subtasks: [
            { id: 's1', title: '查阅图书馆资料', completed: true },
            { id: 's2', title: '整理网络文献', completed: false },
            { id: 's3', title: '编写文献综述', completed: false }
          ],
          attachments: ['参考书目.txt'],
          comments: [
            { user: '刘老师', content: '注意引用格式要规范', time: '昨天', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' }
          ]
        },
        t4: {
          title: '市场调研报告',
          project: '营销分析报告',
          dueDate: '01/08',
          fullDueDate: '2024年1月28日 18:00',
          description: '根据Q3市场数据，制作营销方案的SWOT分析图表，分析优势、劣势、机会和威胁。',
          assignee: '古德奈特',
          subtasks: [
            { id: 's1', title: '收集市场数据', completed: true },
            { id: 's2', title: '分析竞争对手', completed: true },
            { id: 's3', title: '制作SWOT图表', completed: false }
          ],
          attachments: ['Q3数据报表.xlsx', '市场调研.pptx'],
          comments: []
        }
      }

      this.taskData = taskDetails[this.taskId] || taskDetails.t1
    },
    
    goBack: function() {
      uni.navigateBack()
    },
    
    toggleSubtask: function(subtaskId) {
      const subtask = this.taskData.subtasks.find(s => s.id === subtaskId)
      if (subtask) {
        subtask.completed = !subtask.completed
      }
    },
    
    addComment: function() {
      if (!this.commentInput.trim()) {
        return
      }
      
      this.taskData.comments.push({
        user: '古德奈特',
        content: this.commentInput,
        time: '刚刚',
        avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg'
      })
      
      this.commentInput = ''
      
      uni.showToast({
        title: '评论已添加',
        icon: 'success'
      })
    },
    
    editTask: function() {
      uni.showToast({
        title: '编辑功能开发中',
        icon: 'none'
      })
    },
    
    markComplete: function() {
      uni.showModal({
        title: '确认完成',
        content: '确定要将此任务标记为已完成吗？',
        success: function(res) {
          if (res.confirm) {
            uni.showToast({
              title: '任务已完成',
              icon: 'success'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.task-detail-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
}

/* 顶部导航栏 */
.top-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-icon {
  width: 24px;
  height: 24px;
  color: #0f172a;
}

.back-icon-img {
  width: 24px;
  height: 24px;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.nav-right {
  padding: 4px;
}

.more-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.more-icon-img {
  width: 20px;
  height: 20px;
}

/* 内容滚动区 */
.content-scroll {
  flex: 1;
  padding-bottom: 80px;
}

/* 任务头部 */
.task-header {
  padding: 20px 16px;
  background-color: #ffffff;
  margin-bottom: 12px;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.project-badge {
  padding: 4px 12px;
  background-color: #336df4;
  border-radius: 12px;
}

.date-badge {
  padding: 4px 12px;
  background-color: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
}

.project-badge .badge-text {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
}

.date-badge .badge-text {
  font-size: 13px;
  font-weight: 500;
  color: #ea580c;
}

.task-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  display: block;
  margin-bottom: 8px;
}

.task-description {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  display: block;
}

/* 信息卡片 */
.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 12px;
}

.info-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.assignee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 2px solid #10b981;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
  flex-shrink: 0;
}

.info-icon-img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #64748b;
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}

/* 进度卡片 */
.progress-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin: 0 16px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.comment-count {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  background-color: #e2e8f0;
  padding: 2px 8px;
  border-radius: 10px;
}

.progress-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4895ff;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 15px;
  font-weight: 600;
  color: #4895ff;
}

.progress-desc {
  font-size: 13px;
  color: #64748b;
}

/* 子任务列表 */
.subtasks-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin: 0 16px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.subtask-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.subtask-checkbox.checked {
  background-color: #4895ff;
  border-color: #4895ff;
}

.check-icon {
  width: 14px;
  height: 14px;
  color: #ffffff;
}

.check-icon-img {
  width: 14px;
  height: 14px;
}

.subtask-title {
  flex: 1;
  font-size: 15px;
  color: #0f172a;
}

.subtask-title.completed {
  color: #94a3b8;
  text-decoration: line-through;
}

/* 附件列表 */
.attachments-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin: 0 16px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 6px;
}

.attachment-icon {
  width: 20px;
  height: 20px;
  color: #4895ff;
  flex-shrink: 0;
}

.attachment-icon-img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.attachment-name {
  flex: 1;
  font-size: 14px;
  color: #0f172a;
}

/* 评论区 */
.comments-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin: 0 16px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-user {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}

.comment-time {
  font-size: 12px;
  color: #94a3b8;
}

.comment-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
}

.comment-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f8fafc;
  border-radius: 20px;
}

.comment-input {
  flex: 1;
  font-size: 14px;
  color: #0f172a;
  background-color: transparent;
}

.send-btn {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #4895ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.send-btn:active {
  background-color: #336df4;
}

.send-icon {
  width: 16px;
  height: 16px;
  color: #ffffff;
}

.send-icon-img {
  width: 16px;
  height: 16px;
}

/* 底部操作按钮 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.2s;
}

.secondary-btn {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.secondary-btn:active {
  background-color: #e2e8f0;
}

.primary-btn {
  background-color: #4895ff;
}

.primary-btn:active {
  background-color: #336df4;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-icon-img {
  width: 18px;
  height: 18px;
}

.secondary-btn .btn-icon {
  color: #0f172a;
}

.primary-btn .btn-icon {
  color: #ffffff;
}

.btn-text {
  font-size: 15px;
  font-weight: 500;
}

.secondary-btn .btn-text {
  color: #0f172a;
}

.primary-btn .btn-text {
  color: #ffffff;
}
</style>

