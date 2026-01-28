<template>
  <view class="profile-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">我的</text>
      <view class="navbar-right"></view>
    </view>
    
    <!-- 顶部头部卡片 -->
    <view class="header-card">
      <view class="header-gradient">
        <view class="header-content">
          <!-- 头像和基本信息 -->
          <view class="profile-main">
            <image class="avatar" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg" mode="aspectFill"></image>
            <view class="profile-info">
              <text class="profile-name">古德奈特</text>
              <text class="profile-handle">@wangyihan_dev</text>
              <view class="ai-badge">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="badge-icon-img" mode="aspectFit"></image>
                <text class="badge-text">AI 人设：全栈架构师</text>
              </view>
            </view>
          </view>

          <!-- 个人简介 -->
          <text class="bio-text">用AI构建智能系统 · 开源爱好者 · WorkYeah重度用户</text>

          <!-- 元信息 -->
          <view class="meta-info">
            <view class="meta-item">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/school.png" class="meta-icon-img" mode="aspectFit"></image>
              <text class="meta-text">天津大学</text>
            </view>
            <view class="meta-item">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/location.png" class="meta-icon-img" mode="aspectFit"></image>
              <text class="meta-text">天津，中国</text>
            </view>
          </view>

        </view>
      </view>
    </view>

    <!-- 数据概览区 -->
    <view class="stats-section">
      <text class="section-title">数据概览</text>
      <view class="stats-grid animate-fadeInUp">
        <view class="stat-card">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/project.png" class="card-icon-img" mode="aspectFit"></image>
          <text class="card-value">8</text>
          <text class="card-label">项目数</text>
        </view>
        <view class="stat-card">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/task-alt.png" class="card-icon-img" mode="aspectFit"></image>
          <text class="card-value">24</text>
          <text class="card-label">任务数</text>
        </view>
        <view class="stat-card">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/community-alt.png" class="card-icon-img" mode="aspectFit"></image>
          <text class="card-value">5</text>
          <text class="card-label">团队数</text>
        </view>
        <view class="stat-card">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/contribution.png" class="card-icon-img" mode="aspectFit"></image>
          <text class="card-value">156</text>
          <text class="card-label">贡献数</text>
        </view>
      </view>

      <!-- 活动统计 -->
      <view class="activity-card animate-fadeInUp">
        <view class="activity-header">
          <text class="activity-title">本周活动</text>
          <text class="activity-count">32 次贡献</text>
        </view>
        <view class="activity-bars">
          <view class="bar-item" v-for="(day, index) in weekActivity" :key="index">
            <view class="bar" :style="{ height: day.height }"></view>
            <text class="bar-label">{{ day.label }}</text>
          </view>
        </view>
      </view>

      <!-- 个人能力雷达图 -->
      <view class="radar-card animate-fadeInUp">
        <view class="radar-header">
          <text class="radar-title">个人能力雷达图</text>
          <view class="assess-button" @click="openAssessment">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/convert.png" class="refresh-icon-img" mode="aspectFit"></image>
            <text class="assess-text">重新评估</text>
          </view>
        </view>
        <view class="radar-container">
          <view class="radar-wrapper">
            <!-- Canvas雷达图 -->
            <canvas 
              canvas-id="radarCanvas" 
              id="radarCanvas"
              class="radar-canvas"
              :style="{ width: '320px', height: '320px' }"
            ></canvas>
            
            <!-- 标签和数值（使用绝对定位的view元素） -->
            <view v-for="(item, index) in radarData" :key="'label-' + index" 
              class="radar-label-wrapper"
              :style="{ 
                left: getCanvasLabelPoint(index).x + 'px', 
                top: getCanvasLabelPoint(index).y + 'px' 
              }">
              <view class="radar-label">{{ item.label }}</view>
              <view class="radar-value">{{ item.value }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单列表 -->
    <view class="menu-section">
      <text class="section-title">功能</text>
      <view class="menu-list">
        <view class="menu-item" @click="goToRepositories">
          <text class="menu-text">我的仓库</text>
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="menu-arrow-img" mode="aspectFit"></image>
        </view>

        <view class="menu-item" @click="goToFavorites">
          <text class="menu-text">我的收藏</text>
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="menu-arrow-img" mode="aspectFit"></image>
        </view>

        <view class="menu-item" @click="goToAISettings">
          <text class="menu-text">AI 能力设置</text>
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="menu-arrow-img" mode="aspectFit"></image>
        </view>

        <view class="menu-item" @click="goToSubscription">
          <text class="menu-text">订阅计划</text>
          <view class="premium-badge">
            <text class="badge-label">Pro</text>
          </view>
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="menu-arrow-img" mode="aspectFit"></image>
        </view>

        <view class="menu-divider"></view>

        <view class="menu-item" @click="goToSettings">
          <text class="menu-text">系统设置</text>
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="menu-arrow-img" mode="aspectFit"></image>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-spacer"></view>

    <!-- 能力评估问卷弹窗 -->
    <view v-if="showAssessmentModal" class="modal-overlay" @click="closeAssessment">
      <view class="modal-container" @click.stop>
        <view class="modal-header">
          <view class="modal-title-row">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="sparkle-icon-img" mode="aspectFit"></image>
            <text class="modal-title">AI 能力评估问卷</text>
          </view>
          <view class="modal-close" @click="closeAssessment">
            <text class="close-text">✕</text>
          </view>
        </view>

        <view class="modal-description">
          <text class="desc-text">请根据您的实际情况，对以下每个陈述进行1-5分的评分（1=完全不符合，5=完全符合）</text>
        </view>

        <!-- AI分析中 -->
        <view v-if="isAnalyzing" class="analyzing-container">
          <view class="analyzing-icon">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="sparkle-icon-img rotating" mode="aspectFit"></image>
          </view>
          <text class="analyzing-title">AI 正在分析您的能力模型...</text>
          <text class="analyzing-subtitle">基于您的回答进行智能评估</text>
          <view class="loading-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>

        <!-- 问卷内容 -->
        <scroll-view v-else class="modal-content" scroll-y>
          <view class="questions-list">
            <view v-for="(question, index) in assessmentQuestions" :key="question.id" class="question-item">
              <view class="question-header">
                <view class="category-badge">
                  <text class="category-text">{{ question.category }}</text>
                </view>
                <text class="question-text"><text class="question-num">{{ index + 1 }}.</text> {{ question.question }}</text>
              </view>
              
              <view class="score-container">
                <view class="score-labels-row">
                  <text class="score-label-left">完全不符合</text>
                  <text class="score-label-right">完全符合</text>
                </view>
                <view class="score-buttons">
                  <view v-for="score in [1, 2, 3, 4, 5]" :key="score" 
                    class="score-button" 
                    :class="{ 'score-active': assessmentAnswers[question.id] === score }"
                    @click="handleAnswerChange(question.id, score)">
                    <text class="score-text" :class="{ 'score-text-active': assessmentAnswers[question.id] === score }">{{ score }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="modal-footer">
            <view class="progress-info">
              <text class="progress-text">已完成 <text class="progress-count">{{ answeredCount }}</text> / {{ assessmentQuestions.length }} 题</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: progressPercentage + '%' }"></view>
            </view>
            
            <view class="button-row">
              <view class="btn btn-outline" @click="handleResetAssessment">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="btn-icon-img" mode="aspectFit"></image>
                <text class="btn-text">重置答案</text>
              </view>
              <view class="btn btn-primary" @click="handleSubmitAssessment">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="btn-icon-img" mode="aspectFit"></image>
                <text class="btn-text">提交并生成雷达图</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      // 本周活动数据
      weekActivity: [
        { label: '周一', height: '60%' },
        { label: '周二', height: '80%' },
        { label: '周三', height: '45%' },
        { label: '周四', height: '90%' },
        { label: '周五', height: '70%' },
        { label: '周六', height: '30%' },
        { label: '周日', height: '50%' }
      ],
      
      // 雷达图数据
      radarData: [
        { label: '代码能力', value: 85, max: 100 },
        { label: '文档能力', value: 88, max: 100 },
        { label: '逻辑思维', value: 92, max: 100 },
        { label: '风险感知', value: 78, max: 100 },
        { label: '上下文理解', value: 90, max: 100 }
      ],
      
      // 问卷相关状态
      showAssessmentModal: false,
      assessmentAnswers: {},
      isAnalyzing: false,
      
      // 问卷问题
      assessmentQuestions: [
        { id: 1, category: '代码能力', question: '我能够独立完成复杂的编程任务，并且代码质量高、可维护性强' },
        { id: 2, category: '代码能力', question: '我熟悉多种编程语言和框架，能够快速学习新技术' },
        { id: 3, category: '文档能力', question: '我擅长撰写清晰的技术文档和用户手册' },
        { id: 4, category: '文档能力', question: '我能够准确地理解和分析复杂的文档需求' },
        { id: 5, category: '逻辑思维', question: '我能够快速分析问题并找到最优解决方案' },
        { id: 6, category: '逻辑思维', question: '我善于抽象思考，能够设计出合理的系统架构' },
        { id: 7, category: '风险感知', question: '我能够提前识别项目中的潜在风险和隐患' },
        { id: 8, category: '风险感知', question: '我在决策时会充分考虑各种可能的负面影响' },
        { id: 9, category: '上下文理解', question: '我能够快速理解项目背景和业务需求' },
        { id: 10, category: '上下文理解', question: '我善于从多个角度理解问题，把握全局' }
      ]
    }
  },
  
  computed: {
    // 已回答问题数量
    answeredCount: function() {
      return Object.keys(this.assessmentAnswers).length
    },
    
    // 进度百分比
    progressPercentage: function() {
      return (this.answeredCount / this.assessmentQuestions.length) * 100
    }
  },
  
  methods: {
    goBack: function() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    
    goToRepositories: function() {
      uni.navigateTo({
        url: '/pages/profile/repositories'
      })
    },
    
    goToFavorites: function() {
      uni.navigateTo({
        url: '/pages/profile/favorites'
      })
    },
    
    goToAISettings: function() {
      uni.navigateTo({
        url: '/pages/profile/ai-settings'
      })
    },
    
    goToSubscription: function() {
      uni.navigateTo({
        url: '/pages/profile/subscription'
      })
    },
    
    goToSettings: function() {
      uni.navigateTo({
        url: '/pages/profile/settings'
      })
    },
    
    // 雷达图相关方法
    getPolygonPoints: function(scale) {
      var points = []
      var center = 160
      var maxRadius = 100
      var angleStep = (Math.PI * 2) / this.radarData.length
      
      for (var i = 0; i < this.radarData.length; i++) {
        var angle = angleStep * i - Math.PI / 2
        var x = center + Math.cos(angle) * maxRadius * scale
        var y = center + Math.sin(angle) * maxRadius * scale
        points.push(x + ',' + y)
      }
      
      return points.join(' ')
    },
    
    getAxisPoint: function(index) {
      var center = 160
      var maxRadius = 100
      var angleStep = (Math.PI * 2) / this.radarData.length
      var angle = angleStep * index - Math.PI / 2
      
      return {
        x: center + Math.cos(angle) * maxRadius,
        y: center + Math.sin(angle) * maxRadius
      }
    },
    
    getDataPoints: function() {
      var points = []
      var center = 160
      var maxRadius = 100
      var angleStep = (Math.PI * 2) / this.radarData.length
      
      for (var i = 0; i < this.radarData.length; i++) {
        var item = this.radarData[i]
        var angle = angleStep * i - Math.PI / 2
        var radius = (item.value / item.max) * maxRadius
        var x = center + Math.cos(angle) * radius
        var y = center + Math.sin(angle) * radius
        points.push(x + ',' + y)
      }
      
      return points.join(' ')
    },
    
    getDataPoint: function(index) {
      var item = this.radarData[index]
      var center = 160
      var maxRadius = 100
      var angleStep = (Math.PI * 2) / this.radarData.length
      var angle = angleStep * index - Math.PI / 2
      var radius = (item.value / item.max) * maxRadius
      
      return {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius
      }
    },
    
    getLabelPoint: function(index) {
      var center = 160
      var labelRadius = 135
      var angleStep = (Math.PI * 2) / this.radarData.length
      var angle = angleStep * index - Math.PI / 2
      
      return {
        x: center + Math.cos(angle) * labelRadius,
        y: center + Math.sin(angle) * labelRadius
      }
    },
    
    // 打开评估问卷
    openAssessment: function() {
      this.showAssessmentModal = true
    },
    
    // 关闭评估问卷
    closeAssessment: function() {
      this.showAssessmentModal = false
    },
    
    // 处理答案变化
    handleAnswerChange: function(questionId, score) {
      this.assessmentAnswers[questionId] = score
      this.$forceUpdate()
    },
    
    // 重置问卷
    handleResetAssessment: function() {
      this.assessmentAnswers = {}
      this.$forceUpdate()
    },
    
    // 提交问卷
    handleSubmitAssessment: function() {
      var that = this
      
      // 检查是否所有问题都已回答
      var allAnswered = true
      for (var i = 0; i < that.assessmentQuestions.length; i++) {
        if (!that.assessmentAnswers[that.assessmentQuestions[i].id]) {
          allAnswered = false
          break
        }
      }
      
      if (!allAnswered) {
        uni.showToast({
          title: '请完成所有问题的评分',
          icon: 'none',
          duration: 2000
        })
        return
      }
      
      // 显示AI分析动画
      that.isAnalyzing = true
      
      // 模拟AI分析延迟
      setTimeout(function() {
        that.calculateRadarData()
        that.isAnalyzing = false
        that.showAssessmentModal = false
        
        // 显示成功提示
        setTimeout(function() {
          uni.showToast({
            title: 'AI已根据您的回答重新评估您的能力模型！',
            icon: 'success',
            duration: 2000
          })
        }, 300)
      }, 2000)
    },
    
    // 根据问卷答案计算雷达图数据
    calculateRadarData: function() {
      var that = this
      var categories = ['代码能力', '文档能力', '逻辑思维', '风险感知', '上下文理解']
      var categoryScores = {}
      
      // 收集每个类别的所有评分
      for (var i = 0; i < that.assessmentQuestions.length; i++) {
        var q = that.assessmentQuestions[i]
        var score = that.assessmentAnswers[q.id]
        
        if (score) {
          if (!categoryScores[q.category]) {
            categoryScores[q.category] = []
          }
          categoryScores[q.category].push(score)
        }
      }
      
      // 计算每个类别的平均分
      var newRadarData = []
      for (var j = 0; j < categories.length; j++) {
        var category = categories[j]
        var scores = categoryScores[category] || []
        
        if (scores.length === 0) {
          newRadarData.push({ label: category, value: 0, max: 100 })
          continue
        }
        
        // 基础平均分（1-5分转换为0-100分）
        var sum = 0
        for (var k = 0; k < scores.length; k++) {
          sum += scores[k]
        }
        var avgScore = sum / scores.length
        var value = Math.round((avgScore / 5) * 100)
        
        // AI微调
        var max = Math.max.apply(null, scores)
        var min = Math.min.apply(null, scores)
        var variance = max - min
        
        if (variance > 2) {
          value = Math.max(0, value - Math.floor(Math.random() * 5 + 3))
        } else if (variance === 0 && avgScore >= 4) {
          value = Math.min(100, value + Math.floor(Math.random() * 5 + 2))
        }
        
        newRadarData.push({ label: category, value: value, max: 100 })
      }
      
      that.radarData = newRadarData
      
      // 重新绘制Canvas雷达图
      that.$nextTick(function() {
        that.drawRadarChart()
      })
    },
    
    // Canvas标签位置计算
    getCanvasLabelPoint: function(index) {
      var center = 160
      var labelRadius = 135
      var angleStep = (Math.PI * 2) / this.radarData.length
      var angle = angleStep * index - Math.PI / 2
      
      return {
        x: center + Math.cos(angle) * labelRadius,
        y: center + Math.sin(angle) * labelRadius
      }
    },
    
    // 绘制Canvas雷达图
    drawRadarChart: function() {
      var that = this
      var ctx = uni.createCanvasContext('radarCanvas', this)
      var center = 160
      var maxRadius = 100
      var dataLen = that.radarData.length
      var angleStep = (Math.PI * 2) / dataLen
      
      // 清空画布
      ctx.clearRect(0, 0, 320, 320)
      
      // 绘制背景网格（5层）
      var scales = [0.2, 0.4, 0.6, 0.8, 1]
      for (var s = 0; s < scales.length; s++) {
        var scale = scales[s]
        ctx.beginPath()
        for (var i = 0; i <= dataLen; i++) {
          var angle = angleStep * (i % dataLen) - Math.PI / 2
          var x = center + Math.cos(angle) * maxRadius * scale
          var y = center + Math.sin(angle) * maxRadius * scale
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.setStrokeStyle('#d1d5db')
        ctx.setLineWidth(1)
        ctx.stroke()
      }
      
      // 绘制坐标轴
      for (var j = 0; j < dataLen; j++) {
        var axisAngle = angleStep * j - Math.PI / 2
        var axisX = center + Math.cos(axisAngle) * maxRadius
        var axisY = center + Math.sin(axisAngle) * maxRadius
        
        ctx.beginPath()
        ctx.moveTo(center, center)
        ctx.lineTo(axisX, axisY)
        ctx.setStrokeStyle('#d1d5db')
        ctx.setLineWidth(1)
        ctx.stroke()
      }
      
      // 绘制数据区域（带渐变填充）
      ctx.beginPath()
      var dataPoints = []
      for (var k = 0; k < dataLen; k++) {
        var item = that.radarData[k]
        var dataAngle = angleStep * k - Math.PI / 2
        var radius = (item.value / item.max) * maxRadius
        var dataX = center + Math.cos(dataAngle) * radius
        var dataY = center + Math.sin(dataAngle) * radius
        dataPoints.push({ x: dataX, y: dataY })
        
        if (k === 0) {
          ctx.moveTo(dataX, dataY)
        } else {
          ctx.lineTo(dataX, dataY)
        }
      }
      ctx.closePath()
      
      // 填充颜色（半透明蓝色）
      ctx.setFillStyle('rgba(72, 149, 255, 0.2)')
      ctx.fill()
      
      // 描边
      ctx.setStrokeStyle('#4895ff')
      ctx.setLineWidth(2)
      ctx.stroke()
      
      // 绘制数据点
      for (var m = 0; m < dataPoints.length; m++) {
        var point = dataPoints[m]
        
        // 白色描边
        ctx.beginPath()
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2)
        ctx.setFillStyle('#4895ff')
        ctx.fill()
        ctx.setStrokeStyle('#ffffff')
        ctx.setLineWidth(2)
        ctx.stroke()
      }
      
      // 绘制到画布
      ctx.draw()
    }
  },
  
  mounted: function() {
    var that = this
    // 延迟绘制，确保Canvas已经渲染
    setTimeout(function() {
      that.drawRadarChart()
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background-color: #ffffff;
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #e0eaff 0%, #ede9fe 100%);
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
  background-color: rgba(255, 255, 255, 0.3);
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

/* 顶部头部卡片 */
.header-card {
  background: linear-gradient(135deg, #e0eaff 0%, #ede9fe 100%);
  padding-bottom: 24px;
}

.header-gradient {
  padding: 20px 16px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 2px solid #ffffff;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.profile-handle {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 8px;
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background-color: #dbeafe;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  width: fit-content;
}

.badge-icon {
  width: 14px;
  height: 14px;
  color: #3b82f6;
}

.badge-icon-img {
  width: 14px;
  height: 14px;
}

.badge-text {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
}

.bio-text {
  font-size: 15px;
  color: #475569;
  line-height: 1.5;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-icon {
  width: 18px;
  height: 18px;
  color: #64748b;
  flex-shrink: 0;
}

.meta-icon-img {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.meta-text {
  font-size: 14px;
  color: #475569;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 0;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  margin-top: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.stat-icon {
  width: 18px;
  height: 18px;
  color: #f59e0b;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background-color: #cbd5e1;
}

/* 数据概览区 */
.stats-section {
  padding: 6px 16px 20px;
  margin-top: -12px;
  background-color: #f8fafc;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  display: block;
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.stat-card {
  background-color: #ffffff;
  padding: 12px 8px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 20px;
  height: 20px;
  color: #4895ff;
}

.card-icon-img {
  width: 20px;
  height: 20px;
}

.card-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.card-label {
  font-size: 12px;
  color: #64748b;
}

/* 活动统计卡片 */
.activity-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.activity-count {
  font-size: 14px;
  color: #4895ff;
  font-weight: 500;
}

.activity-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  gap: 8px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #4895ff 0%, #336df4 100%);
  border-radius: 4px 4px 0 0;
  margin-top: auto;
}

.bar-label {
  font-size: 11px;
  color: #94a3b8;
}

/* 功能菜单 */
.menu-section {
  padding: 20px 16px;
  background-color: #f8fafc;
}

.menu-list {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  transition: background-color 0.2s;
}

.menu-item:active {
  background-color: #f8fafc;
}

.menu-text {
  font-size: 16px;
  color: #0f172a;
  font-weight: 500;
  flex: 1;
}

.premium-badge {
  padding: 4px 10px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 8px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-label {
  font-size: 11px;
  color: #ffffff;
  font-weight: 600;
  line-height: 1;
}

.menu-arrow {
  width: 18px;
  height: 18px;
  color: #94a3b8;
  flex-shrink: 0;
}

.menu-arrow-img {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.sparkle-icon-img {
  width: 20px;
  height: 20px;
}

.btn-icon-img {
  width: 16px;
  height: 16px;
}

.menu-divider {
  height: 1px;
  background-color: #e2e8f0;
  margin: 0 16px;
}

.bottom-spacer {
  height: 80px;
}

/* 雷达图卡片 */
.radar-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
}

.radar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.radar-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.assess-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid #4895ff;
  border-radius: 8px;
}

.assess-button:active {
  background-color: #f0f7ff;
}

.refresh-icon {
  width: 14px;
  height: 14px;
  color: #4895ff;
}

.refresh-icon-img {
  width: 14px;
  height: 14px;
}

.assess-text {
  font-size: 13px;
  color: #4895ff;
  font-weight: 500;
}

.radar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.radar-wrapper {
  position: relative;
  width: 320px;
  height: 320px;
}

.radar-svg {
  width: 320px;
  height: 320px;
}

.radar-canvas {
  width: 320px;
  height: 320px;
}

/* 雷达图标签 */
.radar-label-wrapper {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.radar-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  white-space: nowrap;
  text-align: center;
}

.radar-value {
  font-size: 12px;
  font-weight: 600;
  color: #4895ff;
  white-space: nowrap;
  text-align: center;
}

/* 弹窗遮罩 */
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

.modal-container {
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  background-color: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sparkle-icon {
  width: 24px;
  height: 24px;
  color: #4895ff;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.modal-close:active {
  background-color: #f1f5f9;
}

.close-text {
  font-size: 24px;
  color: #64748b;
  line-height: 1;
}

.modal-description {
  padding: 16px 24px;
  background-color: #f8fafc;
}

.desc-text {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

/* AI分析中 */
.analyzing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.analyzing-icon {
  margin-bottom: 24px;
}

.rotating {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.analyzing-title {
  font-size: 18px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 8px;
}

.analyzing-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4895ff;
  animation: pulse 1.5s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

/* 问卷内容 */
.modal-content {
  flex: 1;
  overflow-y: auto;
}

.questions-list {
  padding: 16px 24px;
}

.question-item {
  padding: 16px;
  margin-bottom: 12px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.question-item:active {
  border-color: #4895ff;
}

.question-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.category-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 12px;
  background-color: #e4edfc;
  border-radius: 6px;
}

.category-text {
  font-size: 11px;
  font-weight: 600;
  color: #4895ff;
}

.question-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
}

.question-num {
  font-weight: 700;
  color: #0f172a;
}

.score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.score-labels-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.score-label-left,
.score-label-right {
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
}

.score-label-right {
  text-align: right;
}

.score-buttons {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.score-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.score-button:active {
  transform: scale(0.95);
}

.score-active {
  background-color: #4895ff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(72, 149, 255, 0.3);
}

.score-text {
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
}

.score-text-active {
  color: #ffffff;
}

/* 弹窗底部 */
.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.progress-info {
  text-align: center;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.progress-count {
  font-size: 18px;
  font-weight: 700;
  color: #4895ff;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background-color: #4895ff;
  border-radius: 4px;
  transition: width 0.3s;
}

.button-row {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn:active {
  opacity: 0.8;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #cbd5e1;
}

.btn-primary {
  background-color: #4895ff;
  border: none;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-outline .btn-icon {
  color: #64748b;
}

.btn-primary .btn-icon {
  color: #ffffff;
}

.btn-text {
  font-size: 13px;
  font-weight: 600;
}

.btn-outline .btn-text {
  color: #64748b;
}

.btn-primary .btn-text {
  color: #ffffff;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}
</style>

