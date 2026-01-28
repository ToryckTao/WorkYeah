<template>
  <view class="schedule-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">日程</text>
      <view class="navbar-right"></view>
    </view>

    <!-- 分段控制器 -->
    <view class="segmented-control">
      <view 
        class="segment-item" 
        :class="{ 'active': viewMode === 'list' }"
        @click="switchView('list')"
      >
        <text class="segment-text" :class="{ 'active-text': viewMode === 'list' }">列表视图</text>
      </view>
      <view 
        class="segment-item" 
        :class="{ 'active': viewMode === 'calendar' }"
        @click="switchView('calendar')"
      >
        <text class="segment-text" :class="{ 'active-text': viewMode === 'calendar' }">日历视图</text>
      </view>
    </view>

    <!-- 列表视图 -->
    <scroll-view v-if="viewMode === 'list'" class="content-area" scroll-y>
      <view class="task-list">
        <!-- 今天 -->
        <view v-if="todayTasks.length > 0" class="task-group">
          <text class="group-title">今天</text>
          <view 
            v-for="task in todayTasks" 
            :key="task.id"
            class="task-item"
            @click="handleTaskClick(task)"
          >
            <view class="checkbox">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/circle.png" class="checkbox-icon-img" mode="aspectFit"></image>
            </view>
            <view class="task-content">
              <text class="task-title">{{ task.title }}</text>
              <text class="task-project">{{ task.project }}</text>
            </view>
            <view class="task-time">
              <text class="time-text">{{ task.dueDate }}</text>
              <view v-if="task.messageCount > 0" class="message-badge">
                <text class="badge-text">{{ task.messageCount }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 明天 -->
        <view v-if="tomorrowTasks.length > 0" class="task-group">
          <text class="group-title">明天</text>
          <view 
            v-for="task in tomorrowTasks" 
            :key="task.id"
            class="task-item"
            @click="handleTaskClick(task)"
          >
            <view class="checkbox">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/circle.png" class="checkbox-icon-img" mode="aspectFit"></image>
            </view>
            <view class="task-content">
              <text class="task-title">{{ task.title }}</text>
              <text class="task-project">{{ task.project }}</text>
            </view>
            <view class="task-time">
              <text class="time-text">{{ task.dueDate }}</text>
              <view v-if="task.messageCount > 0" class="message-badge">
                <text class="badge-text">{{ task.messageCount }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 后天 -->
        <view v-if="laterTasks.length > 0" class="task-group">
          <text class="group-title">后天</text>
          <view 
            v-for="task in laterTasks" 
            :key="task.id"
            class="task-item"
            @click="handleTaskClick(task)"
          >
            <view class="checkbox">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/circle.png" class="checkbox-icon-img" mode="aspectFit"></image>
            </view>
            <view class="task-content">
              <text class="task-title">{{ task.title }}</text>
              <text class="task-project">{{ task.project }}</text>
            </view>
            <view class="task-time">
              <text class="time-text">{{ task.dueDate }}</text>
              <view v-if="task.messageCount > 0" class="message-badge">
                <text class="badge-text">{{ task.messageCount }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 本周 -->
        <view v-if="weekTasks.length > 0" class="task-group">
          <text class="group-title">本周</text>
          <view 
            v-for="task in weekTasks" 
            :key="task.id"
            class="task-item"
            @click="handleTaskClick(task)"
          >
            <view class="checkbox">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/circle.png" class="checkbox-icon-img" mode="aspectFit"></image>
            </view>
            <view class="task-content">
              <text class="task-title">{{ task.title }}</text>
              <text class="task-project">{{ task.project }}</text>
            </view>
            <view class="task-time">
              <text class="time-text">{{ task.dueDate }}</text>
              <view v-if="task.messageCount > 0" class="message-badge">
                <text class="badge-text">{{ task.messageCount }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 日历视图 -->
    <scroll-view v-else class="content-area" scroll-y>
      <view class="calendar-view">
        <!-- 月份导航 -->
        <view class="month-header">
          <view class="nav-btn" @click="goPrevMonth">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-left.png" class="nav-icon-img" mode="aspectFit"></image>
          </view>
          <text class="month-title">{{ currentYear }}年 {{ monthNames[currentMonth] }}</text>
          <view class="nav-btn" @click="goNextMonth">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="nav-icon-img" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 星期标题 -->
        <view class="week-header">
          <text class="week-day" v-for="day in weekDays" :key="day">{{ day }}</text>
        </view>

        <!-- 日历网格 -->
        <view class="calendar-grid">
          <view 
            v-for="(day, index) in calendarDays" 
            :key="index"
            class="day-cell"
            :class="{ 
              'empty': !day,
              'selected': isSelectedDay(day),
              'today': isTodayDay(day),
              'has-events': hasEventsOnDay(day)
            }"
            @click="selectDay(day)"
          >
            <text v-if="day" class="day-number">{{ day }}</text>
            <view v-if="day && hasEventsOnDay(day) && !isSelectedDay(day)" class="event-dot"></view>
          </view>
        </view>

        <!-- 当天日程 -->
        <view class="daily-schedule">
          <view class="schedule-header">
            <text class="schedule-title">{{ selectedMonth }}月{{ selectedDay }}日 日程</text>
            <text class="schedule-count">{{ daySchedule.length > 0 ? daySchedule.length + ' 个日程' : '暂无日程' }}</text>
          </view>

          <!-- 日程列表 -->
          <view v-if="daySchedule.length > 0" class="schedule-list">
            <view 
              v-for="(event, index) in daySchedule" 
              :key="index"
              class="schedule-item"
              :style="{ borderLeftColor: event.color }"
            >
              <text class="event-time">{{ event.time }}</text>
              <text class="event-title">{{ event.title }}</text>
            </view>
          </view>
          <view v-else class="empty-schedule">
            <text class="empty-text">📅</text>
            <text class="empty-desc">这天暂无日程安排</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      viewMode: 'list', // 'list' or 'calendar'
      
      // 任务数据
      tasks: [
        { id: 't1', title: '完成App原型设计', project: '智慧养老App', dueDate: '今天', messageCount: 2 },
        { id: 't2', title: '撰写需求文档', project: '智慧养老App', dueDate: '明天', messageCount: 0 },
        { id: 't3', title: '整理历史文献', project: '近代史汇报', dueDate: '后天', messageCount: 1 },
        { id: 't4', title: '制作SWOT分析图', project: '营销方案', dueDate: '本周', messageCount: 0 }
      ],
      
      // 日历数据
      scheduleData: {
        '2026-01-22': [
          { time: '09:00', title: '团队晨会', color: '#4895ff' },
          { time: '10:30', title: '产品需求评审', color: '#10b981' },
          { time: '14:00', title: '智慧养老App设计讨论', color: '#f59e0b' },
          { time: '16:00', title: '代码审查', color: '#8b5cf6' }
        ],
        '2026-01-23': [
          { time: '10:00', title: '客户会议', color: '#4895ff' },
          { time: '15:00', title: '市场分析报告', color: '#10b981' }
        ],
        '2026-01-24': [
          { time: '09:30', title: '洋务运动论文讨论', color: '#f59e0b' },
          { time: '14:00', title: '季度总结会', color: '#8b5cf6' },
          { time: '17:00', title: '团队建设活动', color: '#4895ff' }
        ]
      },
      
      // 日历状态
      currentYear: 2026,
      currentMonth: 0, // 0-11 (January = 0)
      selectedYear: 2026,
      selectedMonth: 1, // 显示用 1-12
      selectedDay: 22,
      
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      weekDays: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  
  computed: {
    // 按截止日期分组任务
    todayTasks: function() {
      return this.tasks.filter(function(task) {
        return task.dueDate === '今天'
      })
    },
    
    tomorrowTasks: function() {
      return this.tasks.filter(function(task) {
        return task.dueDate === '明天'
      })
    },
    
    laterTasks: function() {
      return this.tasks.filter(function(task) {
        return task.dueDate === '后天'
      })
    },
    
    weekTasks: function() {
      return this.tasks.filter(function(task) {
        return task.dueDate === '本周'
      })
    },
    
    // 生成日历天数
    calendarDays: function() {
      var daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      var firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay()
      
      var days = []
      // 填充空白
      for (var i = 0; i < firstDayOfMonth; i++) {
        days.push(null)
      }
      // 填充日期
      for (var day = 1; day <= daysInMonth; day++) {
        days.push(day)
      }
      
      return days
    },
    
    // 当天日程
    daySchedule: function() {
      var dateKey = this.selectedYear + '-' + 
                    String(this.selectedMonth).padStart(2, '0') + '-' + 
                    String(this.selectedDay).padStart(2, '0')
      return this.scheduleData[dateKey] || []
    }
  },
  
  methods: {
    goBack: function() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    
    switchView: function(mode) {
      this.viewMode = mode
    },
    
    handleTaskClick: function(task) {
      uni.showToast({
        title: task.title,
        icon: 'none',
        duration: 2000
      })
    },
    
    // 日历导航
    goPrevMonth: function() {
      if (this.currentMonth === 0) {
        this.currentYear--
        this.currentMonth = 11
      } else {
        this.currentMonth--
      }
    },
    
    goNextMonth: function() {
      if (this.currentMonth === 11) {
        this.currentYear++
        this.currentMonth = 0
      } else {
        this.currentMonth++
      }
    },
    
    selectDay: function(day) {
      if (!day) return
      
      this.selectedYear = this.currentYear
      this.selectedMonth = this.currentMonth + 1
      this.selectedDay = day
    },
    
    isSelectedDay: function(day) {
      if (!day) return false
      return day === this.selectedDay && 
             this.currentMonth === this.selectedMonth - 1 && 
             this.currentYear === this.selectedYear
    },
    
    isTodayDay: function(day) {
      if (!day) return false
      return day === 22 && this.currentMonth === 0 && this.currentYear === 2026
    },
    
    hasEventsOnDay: function(day) {
      if (!day) return false
      var dateKey = this.currentYear + '-' + 
                    String(this.currentMonth + 1).padStart(2, '0') + '-' + 
                    String(day).padStart(2, '0')
      return this.scheduleData[dateKey] && this.scheduleData[dateKey].length > 0
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  height: 56px;
}

.navbar-left {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.navbar-left:active {
  background-color: #f1f5f9;
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

.navbar-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
}

.navbar-right {
  width: 40px;
  height: 40px;
}

/* 分段控制器 */
.segmented-control {
  display: flex;
  margin: 16px;
  padding: 4px;
  background-color: #f1f5f9;
  border-radius: 12px;
}

.segment-item {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  transition: background-color 0.2s;
}

.segment-item.active {
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.segment-text {
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
}

.segment-text.active-text {
  color: #336df4;
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
}

/* ========== 列表视图样式 ========== */
.task-list {
  padding: 0 16px 80px 16px;
}

.task-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
  display: block;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.task-item:active {
  background-color: #f8fafc;
}

.checkbox {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.checkbox-icon {
  width: 24px;
  height: 24px;
  color: #cbd5e1;
}

.checkbox-icon-img {
  width: 24px;
  height: 24px;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.task-title {
  font-size: 16px;
  font-weight: 500;
  color: #0f172a;
}

.task-project {
  font-size: 14px;
  color: #64748b;
}

.task-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.time-text {
  font-size: 14px;
  color: #64748b;
}

.message-badge {
  background-color: #ef4444;
  border-radius: 10px;
  padding: 2px 6px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-text {
  font-size: 12px;
  color: #ffffff;
  font-weight: 500;
}

/* ========== 日历视图样式 ========== */
.calendar-view {
  padding: 16px;
  padding-bottom: 80px;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #ffffff;
  border-radius: 12px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #f1f5f9;
}

.nav-btn:active {
  background-color: #e2e8f0;
}

.nav-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.nav-icon-img {
  width: 20px;
  height: 20px;
}

.month-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.week-day {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  padding: 8px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 8px;
  margin-bottom: 24px;
}

.day-cell {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.day-cell.empty {
  visibility: hidden;
}

.day-cell:not(.empty):active {
  background-color: #f1f5f9;
}

.day-cell.selected {
  background-color: #336df4;
}

.day-cell.today .day-number {
  font-weight: 700;
  color: #336df4;
}

.day-cell.selected .day-number {
  color: #ffffff;
  font-weight: 600;
}

.day-number {
  font-size: 16px;
  color: #0f172a;
}

.event-dot {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #336df4;
}

/* 日程详情 */
.daily-schedule {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
}

.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.schedule-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.schedule-count {
  font-size: 14px;
  color: #64748b;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #336df4;
}

.event-time {
  font-size: 14px;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.event-title {
  font-size: 16px;
  font-weight: 500;
  color: #0f172a;
  display: block;
}

.empty-schedule {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
}

.empty-text {
  font-size: 48px;
}

.empty-desc {
  font-size: 15px;
  color: #94a3b8;
}
</style>

