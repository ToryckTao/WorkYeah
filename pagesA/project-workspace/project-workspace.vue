<template>
  <view class="workspace-container">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">项目工作台</text>
      <view class="navbar-right"></view>
    </view>

    <scroll-view class="workspace-content" scroll-y>
      <!-- 快捷入口卡片 -->
      <view class="section-title-wrapper">
        <text class="section-title-main">快捷入口</text>
      </view>
      
      <view class="quick-actions-grid">
          <!-- 工作群聊 -->
          <view class="action-card" @click="goToChat">
            <view class="action-icon-wrapper">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/group-chat.png" class="action-icon-img" mode="aspectFit"></image>
            </view>
            <text class="action-title">工作群聊</text>
          </view>

          <!-- 任务树 -->
          <view class="action-card" @click="goToTasks">
            <view class="action-icon-wrapper">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/task-list.png" class="action-icon-img" mode="aspectFit"></image>
            </view>
            <text class="action-title">任务树</text>
          </view>

          <!-- 资产 -->
          <view class="action-card" @click="goToAssets">
            <view class="action-icon-wrapper">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/assets-icon.png" class="action-icon-img" mode="aspectFit"></image>
            </view>
            <text class="action-title">资产</text>
          </view>

          <!-- 产出饱和度 -->
          <view class="action-card" @click="handleViewProgress">
            <view class="action-icon-wrapper">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/analysis.png" class="action-icon-img" mode="aspectFit"></image>
            </view>
            <text class="action-title">产出饱和度</text>
          </view>
        </view>

      <!-- 项目概览 -->
      <view class="section-title-wrapper">
        <text class="section-title-main">项目概览</text>
      </view>

      <view class="overview-card">
        <view class="overview-row">
          <view class="overview-item">
            <text class="overview-label">团队成员</text>
            <text class="overview-value">{{ projectInfo.memberCount }}人</text>
          </view>
          <view class="overview-divider"></view>
          <view class="overview-item">
            <text class="overview-label">任务总数</text>
            <text class="overview-value">{{ projectInfo.taskCount }}</text>
          </view>
          <view class="overview-divider"></view>
          <view class="overview-item">
            <text class="overview-label">完成进度</text>
            <text class="overview-value">{{ projectInfo.progress }}%</text>
          </view>
        </view>
      </view>

      <!-- 最近活动 -->
      <view class="section-title-wrapper">
        <text class="section-title-main">最近活动</text>
      </view>

      <view class="activity-list">
        <view class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
          <view class="activity-avatar">
            <image :src="activity.avatar" class="avatar-img" mode="aspectFill"></image>
          </view>
          <view class="activity-content">
            <text class="activity-text">{{ activity.text }}</text>
            <text class="activity-time">{{ activity.time }}</text>
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
      projectId: '',
      projectName: ''
    }
  },
  computed: {
    projectInfo: function() {
      // 根据不同项目返回不同的信息
      if (this.projectName === '辛亥革命论文') {
        return {
          memberCount: 3,
          taskCount: 15,
          progress: 45
        }
      } else if (this.projectName === '智慧养老APP') {
        return {
          memberCount: 3,
          taskCount: 18,
          progress: 60
        }
      } else if (this.projectName === '营销分析报告') {
        return {
          memberCount: 3,
          taskCount: 12,
          progress: 55
        }
      }
      
      return {
        memberCount: 0,
        taskCount: 0,
        progress: 0
      }
    },
    
    recentActivities: function() {
      if (this.projectName === '智慧养老APP') {
        return [
          {
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg',
            text: '萧祷 上传了文件 用户界面模型.sketch',
            time: '2小时前'
          },
          {
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg',
            text: '古德奈特 完成了任务 用户访谈',
            time: '5小时前'
          },
          {
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg',
            text: '一墨乾行 更新了任务状态',
            time: '1天前'
          }
        ]
      } else if (this.projectName === '辛亥革命论文') {
        return [
          {
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg',
            text: '萧祷 上传了文件 课程指南.pdf',
            time: '3小时前'
          },
          {
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg',
            text: '一墨乾行 上传了文件 辛亥革命图片集.zip',
            time: '1天前'
          }
        ]
      } else if (this.projectName === '营销分析报告') {
        return [
          {
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg',
            text: '萧祷 上传了多个文件',
            time: '4小时前'
          },
          {
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg',
            text: '古德奈特 更新了财务数据',
            time: '1天前'
          }
        ]
      }
      
      return []
    }
  },
  onLoad: function(options) {
    if (options.id) {
      this.projectId = options.id
    }
    if (options.name) {
      this.projectName = decodeURIComponent(options.name)
    }
    
    // 模拟判断当前用户是否是队长（实际应该从用户信息中获取）
    // 假设古德奈特是智慧养老APP的队长
    this.isLeader = this.projectName === '智慧养老APP'
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
    
    goToChat: function() {
      uni.navigateTo({
        url: '/pagesA/project-detail/project-detail?id=' + this.projectId + '&name=' + encodeURIComponent(this.projectName)
      })
    },
    
    goToTasks: function() {
      // 跳转到任务树页面
      uni.navigateTo({
        url: '/pagesB/task-tree/task-tree?id=' + this.projectId + '&name=' + encodeURIComponent(this.projectName)
      })
    },
    
    goToAssets: function() {
      // 跳转到资产页面
      uni.navigateTo({
        url: '/pagesC/assets/assets?id=' + this.projectId + '&name=' + encodeURIComponent(this.projectName)
      })
    },
    
    handleViewProgress: function() {
      uni.navigateTo({
        url: '/pagesB/progress-analysis/progress-analysis?id=' + this.projectId + '&name=' + encodeURIComponent(this.projectName)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.workspace-container {
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

.workspace-content {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
}

/* 区块标题 */
.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.section-title-main {
  font-size: 30rpx;
  font-weight: 600;
  color: #0f172a;
}

/* 快捷入口卡片 */
.quick-actions-grid {
  display: flex;
  gap: 16rpx;
  margin-bottom: 40rpx;
}

.action-card {
  flex: 1;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 8rpx;
  border: 2px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.action-card:active {
  border-color: #4895ff;
  background-color: #fafbff;
  transform: scale(0.98);
}

.action-icon-wrapper {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background-color: #e4edfc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
}

.action-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.action-title {
  font-size: 22rpx;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
  white-space: normal;
  word-break: break-all;
  line-height: 1.3;
}

/* 项目概览 */
.overview-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.overview-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.overview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.overview-label {
  font-size: 24rpx;
  color: #64748b;
}

.overview-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #4895ff;
}

.overview-divider {
  width: 1px;
  height: 60rpx;
  background-color: #e2e8f0;
}

/* 最近活动 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.activity-item {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.activity-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  min-width: 0;
}

.activity-text {
  font-size: 26rpx;
  color: #0f172a;
  line-height: 1.4;
}

.activity-time {
  font-size: 22rpx;
  color: #94a3b8;
}
</style>
