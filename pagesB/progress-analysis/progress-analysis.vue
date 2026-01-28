<template>
  <view class="analysis-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">产出饱和度分析</text>
      <view class="navbar-right"></view>
    </view>

    <scroll-view class="analysis-content" scroll-y>
      <!-- 团队成员进度卡片 -->
      <view class="members-progress">
        <!-- 古德奈特 - 队长 -->
        <view class="progress-card">
          <view class="card-header">
            <view class="member-info-section">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg" class="member-avatar avatar-emerald" mode="aspectFill"></image>
              <view class="member-details">
                <view class="member-title-row">
                  <text class="member-name">古德奈特</text>
                  <view class="role-badge role-leader">
                    <text class="role-text">队长</text>
                  </view>
                  <view class="persona-badge">
                    <text class="persona-text">专家型</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="stress-indicator">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/high.png" class="stress-icon stress-icon-low" mode="aspectFill"></image>
              <text class="stress-text stress-low">压力较小</text>
            </view>
          </view>

          <view class="progress-section">
            <view class="progress-header">
              <text class="progress-label">总体进度</text>
              <text class="progress-value">75%</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" style="width: 75%;"></view>
            </view>

            <view class="stats-grid">
              <view class="stat-card stat-completed">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">已完成</text>
                </view>
                <text class="stat-number">12</text>
              </view>
              <view class="stat-card stat-progress">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/clock.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">进行中</text>
                </view>
                <text class="stat-number">4</text>
              </view>
              <view class="stat-card stat-pending">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/circle.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">待处理</text>
                </view>
                <text class="stat-number">3</text>
              </view>
            </view>

            <view class="meta-info">
              <text class="meta-text">工作负荷: 30%</text>
              <text class="meta-text">预计完成: 3天后</text>
            </view>
          </view>
        </view>

        <!-- 萧祷 -->
        <view class="progress-card">
          <view class="card-header">
            <view class="member-info-section">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg" class="member-avatar avatar-blue" mode="aspectFill"></image>
              <view class="member-details">
                <view class="member-title-row">
                  <text class="member-name">萧祷</text>
                  <view class="persona-badge">
                    <text class="persona-text">新手型</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="stress-indicator">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/mid.png" class="stress-icon stress-icon-medium" mode="aspectFill"></image>
              <text class="stress-text stress-medium">压力适中</text>
            </view>
          </view>

          <view class="progress-section">
            <view class="progress-header">
              <text class="progress-label">总体进度</text>
              <text class="progress-value">45%</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" style="width: 45%;"></view>
            </view>

            <view class="stats-grid">
              <view class="stat-card stat-completed">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">已完成</text>
                </view>
                <text class="stat-number">6</text>
              </view>
              <view class="stat-card stat-progress">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/clock.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">进行中</text>
                </view>
                <text class="stat-number">5</text>
              </view>
              <view class="stat-card stat-pending">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/circle.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">待处理</text>
                </view>
                <text class="stat-number">7</text>
              </view>
            </view>

            <view class="meta-info">
              <text class="meta-text">工作负荷: 35%</text>
              <text class="meta-text">预计完成: 5天后</text>
            </view>
          </view>
        </view>

        <!-- 一墨乾行 - 需要关注 -->
        <view class="progress-card card-alert">
          <view class="card-header">
            <view class="member-info-section">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg" class="member-avatar avatar-purple" mode="aspectFill"></image>
              <view class="member-details">
                <view class="member-title-row">
                  <text class="member-name">一墨乾行</text>
                  <view class="persona-badge">
                    <text class="persona-text">视觉型</text>
                  </view>
                  <view class="alert-badge">
                    <text class="alert-text">需要关注</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="stress-indicator">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/low.png" class="stress-icon stress-icon-high" mode="aspectFill"></image>
              <text class="stress-text stress-high">压力较大</text>
            </view>
          </view>

          <view class="progress-section">
            <view class="progress-header">
              <text class="progress-label">总体进度</text>
              <text class="progress-value">65%</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" style="width: 65%;"></view>
            </view>

            <view class="stats-grid">
              <view class="stat-card stat-completed">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">已完成</text>
                </view>
                <text class="stat-number">15</text>
              </view>
              <view class="stat-card stat-progress">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/clock.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">进行中</text>
                </view>
                <text class="stat-number">12</text>
              </view>
              <view class="stat-card stat-pending">
                <view class="stat-header">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/circle.png" class="stat-icon-img" mode="aspectFit"></image>
                  <text class="stat-label">待处理</text>
                </view>
                <text class="stat-number">10</text>
              </view>
            </view>

            <view class="meta-info">
              <text class="meta-text">工作负荷: 85%</text>
              <text class="meta-text meta-alert">建议减轻任务</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 团队状态总结 -->
      <view class="summary-card">
        <text class="summary-title">团队状态总结</text>
        <view class="summary-stats">
          <view class="summary-item">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/high.png" class="summary-icon summary-icon-good" mode="aspectFill"></image>
            <text class="summary-number">1人</text>
            <text class="summary-label">状态良好</text>
          </view>
          <view class="summary-item">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/mid.png" class="summary-icon summary-icon-medium" mode="aspectFill"></image>
            <text class="summary-number">1人</text>
            <text class="summary-label">压力适中</text>
          </view>
          <view class="summary-item">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/low.png" class="summary-icon summary-icon-alert" mode="aspectFill"></image>
            <text class="summary-number">1人</text>
            <text class="summary-label">需要关注</text>
          </view>
        </view>
        <view class="summary-suggestion">
          <text class="suggestion-text"><text class="suggestion-label">建议：</text>一墨乾行当前工作负荷较重，建议队长适当调整任务分配或提供额外支持。</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      projectId: '',
      projectName: ''
    }
  },
  onLoad: function(options) {
    if (options.id) {
      this.projectId = options.id
    }
    if (options.name) {
      this.projectName = decodeURIComponent(options.name)
    }
  },
  methods: {
    goBack: function() {
      var self = this
      var pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack({
          delta: 1,
          fail: function() {
            uni.redirectTo({
              url: '/pagesA/project-workspace/project-workspace?id=' + self.projectId + '&name=' + encodeURIComponent(self.projectName)
            })
          }
        })
      } else {
        uni.redirectTo({
          url: '/pagesA/project-workspace/project-workspace?id=' + self.projectId + '&name=' + encodeURIComponent(self.projectName)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.analysis-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 自定义导航栏 */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  background-color: #ffffff;
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
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #0f172a;
}

.analysis-content {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
}

/* 成员进度卡片 */
.members-progress {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 32rpx;
}

.progress-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.card-alert {
  border: 2px solid #fecaca;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24rpx;
  gap: 16rpx;
}

.member-info-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  min-width: 0;
}

.member-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  flex-shrink: 0;
  border: 3rpx solid #ffffff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.avatar-emerald {
}

.avatar-blue {
}

.avatar-purple {
}

.member-details {
  flex: 1;
  min-width: 0;
}

.member-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-wrap: wrap;
}

.member-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #0f172a;
}

.role-badge {
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
  background-color: #dcfce7;
}

.role-leader {
  background-color: #059669;
}

.role-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 500;
}

.persona-badge {
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.persona-text {
  font-size: 20rpx;
  color: #64748b;
}

.alert-badge {
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
  background-color: #ef4444;
}

.alert-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 500;
}

.stress-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.stress-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.stress-icon-low {
  border: none;
}

.stress-icon-medium {
  border: none;
}

.stress-icon-high {
  border: none;
}

.stress-text {
  font-size: 22rpx;
  font-weight: 500;
  white-space: nowrap;
}

.stress-low {
  color: #059669;
}

.stress-medium {
  color: #d97706;
}

.stress-high {
  color: #dc2626;
}

/* 进度部分 */
.progress-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-label {
  font-size: 24rpx;
  color: #64748b;
}

.progress-value {
  font-size: 26rpx;
  font-weight: 600;
  color: #0f172a;
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  background-color: #f1f5f9;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #e0e6f7;
  border-radius: 6rpx;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.stat-card {
  padding: 16rpx;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  box-sizing: border-box;
}

.stat-completed {
  background-color: #f0fdf4;
}

.stat-progress {
  background-color: #eff6ff;
}

.stat-pending {
  background-color: #f8fafc;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.stat-icon {
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
}

.stat-icon-img {
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
}

.stat-completed .stat-icon {
  color: #059669;
}

.stat-progress .stat-icon {
  color: #2563eb;
}

.stat-pending .stat-icon {
  color: #64748b;
}

.stat-label {
  font-size: 20rpx;
  font-weight: 500;
}

.stat-completed .stat-label {
  color: #166534;
}

.stat-progress .stat-label {
  color: #1e40af;
}

.stat-pending .stat-label {
  color: #475569;
}

.stat-number {
  font-size: 32rpx;
  font-weight: 700;
}

.stat-completed .stat-number {
  color: #059669;
}

.stat-progress .stat-number {
  color: #2563eb;
}

.stat-pending .stat-number {
  color: #64748b;
}

/* 元信息 */
.meta-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12rpx;
  border-top: 1px solid #f1f5f9;
}

.meta-text {
  font-size: 20rpx;
  color: #64748b;
}

.meta-alert {
  color: #dc2626;
  font-weight: 500;
}

/* 团队总结卡片 */
.summary-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16rpx;
  padding: 28rpx;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.summary-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #0f172a;
  display: block;
  margin-bottom: 24rpx;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.summary-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.summary-icon-good {
  border: none;
}

.summary-icon-medium {
  border: none;
}

.summary-icon-alert {
  border: none;
}

.summary-number {
  font-size: 32rpx;
  font-weight: 700;
  color: #0f172a;
}

.summary-label {
  font-size: 22rpx;
  color: #64748b;
}

.summary-suggestion {
  padding: 20rpx;
  background-color: #eff6ff;
  border-radius: 12rpx;
}

.suggestion-text {
  font-size: 24rpx;
  color: #475569;
  line-height: 1.5;
}

.suggestion-label {
  font-weight: 600;
  color: #0f172a;
}
</style>

