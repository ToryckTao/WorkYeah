<template>
  <view class="repositories-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">我的仓库</text>
      <view class="navbar-right" @click="createRepository">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/plus.png" class="add-icon-img" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 仓库列表 -->
    <scroll-view class="content-area" scroll-y>
      <view class="repositories-list">
        <view 
          v-for="repo in repositories" 
          :key="repo.name"
          class="repo-card"
          @click="openRepository(repo)"
        >
          <view class="repo-header">
            <text class="repo-name">{{ repo.name }}</text>
            <view class="public-badge">
              <text class="badge-text">Public</text>
            </view>
          </view>
          
          <text class="repo-description">{{ repo.description }}</text>
          
          <view class="repo-meta">
            <view class="meta-item">
              <view class="language-dot" :style="{ backgroundColor: repo.languageColor }"></view>
              <text class="meta-text">{{ repo.language }}</text>
            </view>
            <view class="meta-item">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="meta-icon-img" mode="aspectFit"></image>
              <text class="meta-text">{{ repo.stars }}</text>
            </view>
            <view class="meta-item">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/like.png" class="meta-icon-img" mode="aspectFit"></image>
              <text class="meta-text">{{ repo.forks }}</text>
            </view>
            <text class="updated-text">{{ repo.updatedAt }}</text>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      repositories: [
        {
          name: '智慧养老App',
          description: '基于AI的智慧养老服务平台，提供健康监测、用药提醒、紧急呼叫等功能',
          language: 'TypeScript',
          languageColor: '#3178c6',
          stars: 128,
          forks: 34,
          updatedAt: '2天前更新'
        },
        {
          name: '近代史汇报',
          description: '洋务运动历史研究项目，包含文献整理、时间线分析和多媒体展示',
          language: 'Markdown',
          languageColor: '#083fa1',
          stars: 56,
          forks: 12,
          updatedAt: '1周前更新'
        },
        {
          name: '营销分析系统',
          description: 'Q3市场营销方案及SWOT分析，数据可视化仪表板',
          language: 'Python',
          languageColor: '#3572A5',
          stars: 89,
          forks: 23,
          updatedAt: '3天前更新'
        },
        {
          name: 'WorkYeah-SDK',
          description: 'WorkYeah平台开发工具包，提供API封装和组件库',
          language: 'TypeScript',
          languageColor: '#3178c6',
          stars: 234,
          forks: 67,
          updatedAt: '5小时前更新'
        },
        {
          name: 'AI-Assistant-Framework',
          description: '通用AI助手框架，支持多模型切换和插件扩展',
          language: 'Python',
          languageColor: '#3572A5',
          stars: 312,
          forks: 89,
          updatedAt: '1天前更新'
        }
      ]
    }
  },
  
  methods: {
    goBack: function() {
      uni.navigateBack()
    },
    
    createRepository: function() {
      uni.showToast({
        title: '新建仓库',
        icon: 'none'
      })
    },
    
    openRepository: function(repo) {
      uni.showToast({
        title: repo.name,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.repositories-container {
  min-height: 100vh;
  background-color: #ffffff;
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

.navbar-left, .navbar-right {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.navbar-left:active, .navbar-right:active {
  background-color: #f1f5f9;
}

.back-icon, .add-icon {
  width: 24px;
  height: 24px;
  color: #0f172a;
}

.add-icon-img {
  width: 24px;
  height: 24px;
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

/* 内容区域 */
.content-area {
  flex: 1;
  height: calc(100vh - 56px);
}

.repositories-list {
  padding: 16px;
}

/* 仓库卡片 */
.repo-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}

.repo-card:active {
  border-color: #4895ff;
}

.repo-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.repo-name {
  font-size: 18px;
  font-weight: 600;
  color: #4895ff;
  flex: 1;
}

.public-badge {
  padding: 2px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.badge-text {
  font-size: 12px;
  color: #6b7280;
}

.repo-description {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 12px;
  display: block;
}

.repo-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.language-dot {
  width: 12px;
  height: 12px;
  border-radius: 6px;
}

.meta-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.meta-icon-img {
  width: 16px;
  height: 16px;
}

.meta-text {
  font-size: 14px;
  color: #6b7280;
}

.updated-text {
  font-size: 14px;
  color: #9ca3af;
  margin-left: auto;
}

.bottom-spacer {
  height: 20px;
}
</style>

