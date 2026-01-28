<template>
  <view class="calendar-container">
    <!-- 顶部导航栏 -->
    <view class="top-navbar">
      <view class="nav-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
        <text class="nav-title">日历</text>
      </view>
      <view class="nav-right">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/clock.png" class="today-icon-img" mode="aspectFit" @click="goToToday"></image>
      </view>
    </view>

    <scroll-view class="calendar-content" scroll-y>
      <!-- 月份选择器 -->
      <view class="month-selector">
        <view class="month-nav" @click="prevMonth">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-left.png" class="nav-icon-img" mode="aspectFit"></image>
        </view>
        <text class="month-title">{{ currentYear }}年{{ currentMonth }}月</text>
        <view class="month-nav" @click="nextMonth">
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
          v-for="(date, index) in calendarDates" 
          :key="index"
          class="calendar-cell"
          :class="{ 
            'other-month': date.isOtherMonth,
            'today': date.isToday,
            'selected': date.isSelected,
            'has-event': date.hasEvent
          }"
          @click="selectDate(date)"
        >
          <text class="date-number">{{ date.day }}</text>
          <view v-if="date.hasEvent" class="event-dot"></view>
        </view>
      </view>

      <!-- 当日事件列表 -->
      <view class="events-section" v-if="selectedDateEvents.length > 0">
        <view class="section-header">
          <text class="section-title">{{ selectedDateText }}的日程</text>
          <text class="event-count">{{ selectedDateEvents.length }}项</text>
        </view>
        <view class="events-list">
          <view 
            v-for="event in selectedDateEvents" 
            :key="event.id"
            class="event-item"
            @click="viewEventDetail(event)"
          >
            <view class="event-time-indicator" :style="{ backgroundColor: event.color }"></view>
            <view class="event-content">
              <text class="event-title">{{ event.title }}</text>
              <text class="event-time">{{ event.time }}</text>
              <text class="event-project">{{ event.project }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 无事件占位 -->
      <view class="no-events" v-else>
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/calendar-icon.png" class="placeholder-icon-img" mode="aspectFit"></image>
        <text class="placeholder-text">选择日期查看日程</text>
      </view>
    </scroll-view>

    <!-- 悬浮添加按钮 -->
    <view class="fab-button" @click="addEvent">
      <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/plus.png" class="fab-icon-img" mode="aspectFit"></image>
    </view>

    <!-- 添加日程弹窗 -->
    <view v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">添加日程</text>
          <view class="modal-close" @click="showAddModal = false">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
          </view>
        </view>
        
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">日程标题</text>
            <input class="form-input" v-model="newEvent.title" placeholder="输入日程标题"/>
          </view>
          
          <view class="form-group">
            <text class="form-label">日期</text>
            <picker mode="date" :value="newEvent.date" @change="onDateChange">
              <view class="picker-input">
                <text>{{ newEvent.date || '选择日期' }}</text>
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="picker-arrow-img" mode="aspectFit"></image>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">时间</text>
            <picker mode="time" :value="newEvent.time" @change="onTimeChange">
              <view class="picker-input">
                <text>{{ newEvent.time || '选择时间' }}</text>
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="picker-arrow-img" mode="aspectFit"></image>
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">关联项目</text>
            <picker mode="selector" :range="projectOptions" @change="onProjectChange">
              <view class="picker-input">
                <text>{{ newEvent.project || '选择项目' }}</text>
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="picker-arrow-img" mode="aspectFit"></image>
              </view>
            </picker>
          </view>
        </view>
        
        <view class="modal-footer">
          <view class="btn-cancel" @click="showAddModal = false">
            <text class="btn-text">取消</text>
          </view>
          <view class="btn-confirm" @click="saveEvent">
            <text class="btn-text-white">保存</text>
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
      currentYear: 2026,
      currentMonth: 1,
      selectedDate: null,
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      calendarDates: [],
      showAddModal: false,
      projectOptions: ['智慧养老APP', '辛亥革命论文', '营销分析报告'],
      projectColors: {
        '智慧养老APP': '#4895ff',
        '辛亥革命论文': '#10b981',
        '营销分析报告': '#f59e0b'
      },
      newEvent: {
        title: '',
        date: '',
        time: '',
        project: ''
      },
      nextEventId: 100,
      events: [
        {
          id: 'e1',
          date: '2026-01-20',
          time: '10:00',
          title: '团队周会',
          project: '智慧养老APP',
          color: '#4895ff'
        },
        {
          id: 'e2',
          date: '2026-01-21',
          time: '14:00',
          title: '需求评审会议',
          project: '智慧养老APP',
          color: '#4895ff'
        },
        {
          id: 'e3',
          date: '2026-01-22',
          time: '09:00',
          title: '历史资料整理',
          project: '辛亥革命论文',
          color: '#10b981'
        },
        {
          id: 'e4',
          date: '2026-01-22',
          time: '15:00',
          title: '参考文献收集',
          project: '辛亥革命论文',
          color: '#10b981'
        },
        {
          id: 'e5',
          date: '2026-01-23',
          time: '11:00',
          title: '竞品分析报告',
          project: '营销分析报告',
          color: '#f59e0b'
        },
        {
          id: 'e6',
          date: '2026-01-24',
          time: '16:00',
          title: 'UI设计稿评审',
          project: '智慧养老APP',
          color: '#4895ff'
        },
        {
          id: 'e7',
          date: '2026-01-26',
          time: '10:00',
          title: '项目进度汇报',
          project: '智慧养老APP',
          color: '#4895ff'
        },
        {
          id: 'e8',
          date: '2026-01-26',
          time: '14:30',
          title: '论文初稿提交',
          project: '辛亥革命论文',
          color: '#10b981'
        },
        {
          id: 'e9',
          date: '2026-01-27',
          time: '09:30',
          title: 'SWOT分析完成',
          project: '营销分析报告',
          color: '#f59e0b'
        },
        {
          id: 'e10',
          date: '2026-01-28',
          time: '18:00',
          title: '接口联调测试',
          project: '智慧养老APP',
          color: '#4895ff'
        },
        {
          id: 'e11',
          date: '2026-01-29',
          time: '10:00',
          title: '数据可视化设计',
          project: '营销分析报告',
          color: '#f59e0b'
        },
        {
          id: 'e12',
          date: '2026-01-30',
          time: '15:00',
          title: '论文修改反馈',
          project: '辛亥革命论文',
          color: '#10b981'
        }
      ]
    }
  },
  computed: {
    selectedDateText: function() {
      if (!this.selectedDate) return ''
      return this.selectedDate.month + '月' + this.selectedDate.day + '日'
    },
    selectedDateEvents: function() {
      if (!this.selectedDate || this.selectedDate.isOtherMonth) return []
      const dateStr = this.currentYear + '-' + 
                      String(this.currentMonth).padStart(2, '0') + '-' + 
                      String(this.selectedDate.day).padStart(2, '0')
      return this.events.filter(e => e.date === dateStr)
    }
  },
  onLoad: function() {
    const now = new Date()
    this.currentYear = now.getFullYear()
    this.currentMonth = now.getMonth() + 1
    this.generateCalendar()
    this.selectToday()
  },
  methods: {
    goBack: function() {
      var pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack({
          delta: 1,
          fail: function() {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }
        })
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    },
    
    goToToday: function() {
      const now = new Date()
      this.currentYear = now.getFullYear()
      this.currentMonth = now.getMonth() + 1
      this.generateCalendar()
      this.selectToday()
    },
    
    selectToday: function() {
      const todayCell = this.calendarDates.find(d => d.isToday && !d.isOtherMonth)
      if (todayCell) {
        this.selectDate(todayCell)
      }
    },
    
    prevMonth: function() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12
        this.currentYear--
      } else {
        this.currentMonth--
      }
      this.generateCalendar()
    },
    
    nextMonth: function() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1
        this.currentYear++
      } else {
        this.currentMonth++
      }
      this.generateCalendar()
    },
    
    generateCalendar: function() {
      const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth, 0)
      const firstDayOfWeek = firstDay.getDay()
      const daysInMonth = lastDay.getDate()
      
      const today = new Date()
      const isCurrentMonth = today.getFullYear() === this.currentYear && 
                            today.getMonth() + 1 === this.currentMonth
      const todayDate = today.getDate()
      
      const dates = []
      
      // 上个月的日期
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth - 1, 0).getDate()
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        dates.push({
          day: prevMonthLastDay - i,
          month: this.currentMonth - 1 || 12,
          isOtherMonth: true,
          isToday: false,
          isSelected: false,
          hasEvent: false
        })
      }
      
      // 本月的日期
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = this.currentYear + '-' + 
                       String(this.currentMonth).padStart(2, '0') + '-' + 
                       String(i).padStart(2, '0')
        const hasEvent = this.events.some(e => e.date === dateStr)
        
        dates.push({
          day: i,
          month: this.currentMonth,
          isOtherMonth: false,
          isToday: isCurrentMonth && i === todayDate,
          isSelected: false,
          hasEvent: hasEvent
        })
      }
      
      // 下个月的日期
      const remainingCells = 42 - dates.length
      for (let i = 1; i <= remainingCells; i++) {
        dates.push({
          day: i,
          month: this.currentMonth + 1 > 12 ? 1 : this.currentMonth + 1,
          isOtherMonth: true,
          isToday: false,
          isSelected: false,
          hasEvent: false
        })
      }
      
      this.calendarDates = dates
    },
    
    selectDate: function(date) {
      this.calendarDates.forEach(d => {
        d.isSelected = false
      })
      date.isSelected = true
      this.selectedDate = date
      this.calendarDates = [...this.calendarDates]
    },
    
    viewEventDetail: function(event) {
      uni.showToast({
        title: '查看事件: ' + event.title,
        icon: 'none'
      })
    },
    
    addEvent: function() {
      const today = new Date()
      let defaultDate = ''
      if (this.selectedDate && !this.selectedDate.isOtherMonth) {
        defaultDate = this.currentYear + '-' + 
                     String(this.currentMonth).padStart(2, '0') + '-' + 
                     String(this.selectedDate.day).padStart(2, '0')
      } else {
        defaultDate = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0')
      }
      this.newEvent = {
        title: '',
        date: defaultDate,
        time: '09:00',
        project: this.projectOptions[0]
      }
      this.showAddModal = true
    },
    
    onDateChange: function(e) {
      this.newEvent.date = e.detail.value
    },
    
    onTimeChange: function(e) {
      this.newEvent.time = e.detail.value
    },
    
    onProjectChange: function(e) {
      this.newEvent.project = this.projectOptions[e.detail.value]
    },
    
    saveEvent: function() {
      if (!this.newEvent.title.trim()) {
        uni.showToast({
          title: '请输入日程标题',
          icon: 'none'
        })
        return
      }
      
      const event = {
        id: 'e' + this.nextEventId++,
        date: this.newEvent.date,
        time: this.newEvent.time,
        title: this.newEvent.title.trim(),
        project: this.newEvent.project,
        color: this.projectColors[this.newEvent.project] || '#4895ff'
      }
      
      this.events.push(event)
      this.showAddModal = false
      this.generateCalendar()
      
      uni.showToast({
        title: '日程已添加',
        icon: 'success'
      })
    }
  }
}
</script>

<style>
.calendar-container {
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

.today-icon {
  width: 20px;
  height: 20px;
  color: #4895ff;
}

.today-icon-img {
  width: 20px;
  height: 20px;
}

.nav-icon-img {
  width: 20px;
  height: 20px;
}

.placeholder-icon-img {
  width: 60px;
  height: 60px;
}

.fab-icon-img {
  width: 24px;
  height: 24px;
}

.close-icon-img {
  width: 20px;
  height: 20px;
}

.picker-arrow-img {
  width: 16px;
  height: 16px;
}

/* 内容区域 */
.calendar-content {
  flex: 1;
  padding-bottom: 80px;
}

/* 月份选择器 */
.month-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
}

.month-nav {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-nav:active {
  background-color: #e2e8f0;
}

.nav-icon {
  width: 16px;
  height: 16px;
  color: #0f172a;
}

.month-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

/* 星期标题 */
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 8px 12px;
  background-color: #ffffff;
}

.week-day {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-align: center;
}

/* 日历网格 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: 4px 12px 12px;
  background-color: #ffffff;
  margin-bottom: 12px;
}

.calendar-cell {
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  position: relative;
  transition: all 0.2s;
}

.calendar-cell:active {
  transform: scale(0.95);
}

.calendar-cell.other-month .date-number {
  color: #cbd5e1;
}

.calendar-cell.today {
  background-color: #e0e6f7;
}

.calendar-cell.today .date-number {
  color: #4895ff;
  font-weight: 600;
}

.calendar-cell.selected {
  background-color: #4895ff;
}

.calendar-cell.selected .date-number {
  color: #ffffff;
  font-weight: 600;
}

.date-number {
  font-size: 13px;
  color: #0f172a;
}

.event-dot {
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #4895ff;
  position: absolute;
  bottom: 4px;
}

.calendar-cell.selected .event-dot {
  background-color: #ffffff;
}

/* 事件列表 */
.events-section {
  background-color: #ffffff;
  padding: 16px;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.event-count {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  background-color: #e2e8f0;
  padding: 2px 8px;
  border-radius: 10px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.event-item:active {
  background-color: #e2e8f0;
}

.event-time-indicator {
  width: 4px;
  border-radius: 2px;
  flex-shrink: 0;
}

.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-title {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}

.event-time {
  font-size: 13px;
  color: #64748b;
}

.event-project {
  font-size: 12px;
  color: #94a3b8;
}

/* 无事件占位 */
.no-events {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #ffffff;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  color: #cbd5e1;
  margin-bottom: 12px;
}

.placeholder-text {
  font-size: 14px;
  color: #94a3b8;
}

/* 悬浮添加按钮 */
.fab-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #4895ff;
  box-shadow: 0 8px 24px rgba(72, 149, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.fab-button:active {
  transform: scale(0.95);
  background-color: #336df4;
}

.fab-icon {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 340px;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  box-sizing: border-box;
}

.picker-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  box-sizing: border-box;
}

.picker-arrow {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  border-radius: 8px;
}

.btn-cancel:active {
  background-color: #e2e8f0;
}

.btn-text {
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
}

.btn-confirm {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4895ff;
  border-radius: 8px;
}

.btn-confirm:active {
  background-color: #336df4;
}

.btn-text-white {
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
}
</style>

