<template>
  <view class="showcase-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">项目展示</text>
      <view class="navbar-right"></view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/search.png" class="search-icon-img" mode="aspectFit"></image>
        <input 
          class="search-input" 
          type="text" 
          placeholder="搜索精彩项目..." 
          v-model="searchQuery"
          confirm-type="search"
        />
      </view>
    </view>

    <!-- 分类筛选器 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view 
          v-for="category in categories" 
          :key="category"
          class="category-chip"
          :class="{ 'active': selectedCategory === category }"
          @click="selectCategory(category)"
        >
          <view class="category-dot" :class="{ 'active-dot': selectedCategory === category }"></view>
          <text class="chip-text">{{ category }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 项目列表 -->
    <scroll-view class="content-area" scroll-y>
      <view class="projects-list">
        <view 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          @click="viewProject(project)"
        >
          <!-- 项目信息 -->
          <view class="project-info">
            <view class="project-header">
              <text class="project-title">{{ project.title }}</text>
              <view class="status-badge" :class="{'status-completed': project.status === '已完成', 'status-progress': project.status === '进行中', 'status-planning': project.status === '规划中'}">
                <text class="badge-text">{{ project.status }}</text>
              </view>
            </view>
            <text class="project-desc">{{ project.description }}</text>
            
            <!-- 项目标签 -->
            <view class="project-tags">
              <view v-for="(tag, index) in project.tags" :key="index" class="tag">
                <text class="tag-text">{{ tag }}</text>
              </view>
            </view>
            
            <!-- 项目统计 -->
            <view class="project-stats">
              <view class="stat-item">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/views.png" class="stat-icon-img" mode="aspectFit"></image>
                <text class="stat-text">{{ project.views }}</text>
              </view>
              <view class="stat-item">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/like.png" class="stat-icon-img" mode="aspectFit"></image>
                <text class="stat-text">{{ project.likes }}</text>
              </view>
              <view class="stat-divider"></view>
              <image v-if="project.authorAvatar" :src="project.authorAvatar" class="author-avatar" mode="aspectFill"></image>
              <text class="author-text">@{{ project.author }}</text>
            </view>
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
      searchQuery: '',
      selectedCategory: '全部',
      categories: ['全部', 'AI应用', '协作工具', '数据分析', '内容管理', '项目管理', '物联网'],
      projects: [
        {
          id: 'p1',
          title: '智能客服助手',
          description: '基于AI的智能客服系统，支持多轮对话和情感分析',
          tags: ['AI', '客服', 'NLP'],
          category: 'AI应用',
          status: '已完成',
          views: 1520,
          likes: 328,
          author: '信管团队',
          authorAvatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/tju.png',
          coverGradient: 'linear-gradient(135deg, #4895ff 0%, #336df4 100%)'
        },
        {
          id: 'p2',
          title: '团队协作平台',
          description: '一站式团队协作解决方案，提升工作效率',
          tags: ['协作', '效率', '管理'],
          category: '协作工具',
          status: '进行中',
          views: 2103,
          likes: 456,
          author: '产品团队',
          coverGradient: 'linear-gradient(135deg, #336df4 0%, #4895ff 100%)'
        },
        {
          id: 'p3',
          title: '数据可视化工具',
          description: '强大的数据分析和可视化平台，让数据说话',
          tags: ['数据', '可视化', '分析'],
          category: '数据分析',
          status: '已完成',
          views: 1876,
          likes: 392,
          author: '数据团队',
          coverGradient: 'linear-gradient(135deg, #4895ff 0%, #336df4 100%)'
        },
        {
          id: 'p4',
          title: '内容管理系统',
          description: '灵活的内容管理解决方案，支持多种内容类型',
          tags: ['CMS', '内容', '管理'],
          category: '内容管理',
          status: '已完成',
          views: 1345,
          likes: 267,
          author: '开发者',
          coverGradient: 'linear-gradient(135deg, #336df4 0%, #4895ff 100%)'
        },
        {
          id: 'p5',
          title: '项目管理工具',
          description: '敏捷项目管理平台，助力团队高效协作',
          tags: ['项目', '敏捷', '协作'],
          category: '项目管理',
          status: '进行中',
          views: 2456,
          likes: 543,
          author: '管理团队',
          coverGradient: 'linear-gradient(135deg, #4895ff 0%, #336df4 100%)'
        },
        {
          id: 'p6',
          title: 'IoT智能设备平台',
          description: '物联网设备管理和数据分析平台',
          tags: ['IoT', '智能', '设备'],
          category: '物联网',
          status: '已完成',
          views: 987,
          likes: 178,
          author: '物联团队',
          coverGradient: 'linear-gradient(135deg, #336df4 0%, #4895ff 100%)'
        }
      ]
    }
  },
  
  computed: {
    filteredProjects: function() {
      var filtered = this.projects
      
      // 按分类筛选
      if (this.selectedCategory !== '全部') {
        filtered = filtered.filter(p => p.category === this.selectedCategory)
      }
      
      // 按搜索词筛选
      if (this.searchQuery) {
        var query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      return filtered
    }
  },
  
  methods: {
    goBack: function() {
      // 设置返回后要切换到的 tab
      uni.setStorageSync('switchToTab', 'community')
      // 跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    
    selectCategory: function(category) {
      this.selectedCategory = category
    },
    
    viewProject: function(project) {
      // 跳转到项目详情页
      var params = [
        'id=' + project.id,
        'title=' + encodeURIComponent(project.title),
        'description=' + encodeURIComponent(project.description),
        'author=' + encodeURIComponent(project.author),
        'authorAvatar=' + encodeURIComponent(project.authorAvatar || project.author.slice(0, 1)),
        'tags=' + encodeURIComponent(JSON.stringify(project.tags)),
        'status=' + encodeURIComponent(project.status),
        'views=' + project.views,
        'stars=' + project.likes,
        'forks=' + Math.floor(project.likes / 3)
      ]
      
      uni.navigateTo({
        url: '/pagesA/project-showcase-detail/project-showcase-detail?' + params.join('&')
      })
    },
    
    getStatusClass: function(status) {
      switch(status) {
        case '已完成': return 'status-completed'
        case '进行中': return 'status-progress'
        case '规划中': return 'status-planning'
        default: return 'status-default'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.showcase-container {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.navbar-left {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.navbar-left:active {
  background-color: #f1f5f9;
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
}

.navbar-right {
  width: 64rpx;
  flex-shrink: 0;
}

/* 搜索栏 */
.search-bar {
  padding: 16rpx 24rpx;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  color: #94a3b8;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.search-icon-img {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 26rpx;
  color: #0f172a;
  background: transparent;
  border: none;
}

/* 分类筛选 */
.category-scroll {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.category-list {
  display: flex;
  padding: 16rpx 24rpx;
  gap: 12rpx;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  background-color: #f8fafc;
  border-radius: 28rpx;
  flex-shrink: 0;
  transition: all 0.2s;
}

.category-chip.active {
  background-color: #e4edfc;
}

.category-chip:active {
  transform: scale(0.95);
}

.category-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 5rpx;
  background-color: #cbd5e1;
  transition: all 0.2s;
  flex-shrink: 0;
}

.category-dot.active-dot {
  background-color: #4895ff;
}

.chip-text {
  font-size: 24rpx;
  color: #64748b;
  font-weight: 500;
}

.category-chip.active .chip-text {
  color: #1356f0;
  font-weight: 600;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.project-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  box-sizing: border-box;
}

.project-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.project-info {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  box-sizing: border-box;
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.status-badge {
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  border: 2rpx solid;
  background-color: #ffffff;
  flex-shrink: 0;
}

.status-completed {
  border-color: #10b981;
}

.status-completed .badge-text {
  color: #10b981;
}

.status-progress {
  border-color: #3b82f6;
}

.status-progress .badge-text {
  color: #3b82f6;
}

.status-planning {
  border-color: #f59e0b;
}

.status-planning .badge-text {
  color: #f59e0b;
}

.status-default {
  border-color: #6b7280;
}

.status-default .badge-text {
  color: #6b7280;
}

.badge-text {
  font-size: 22rpx;
  font-weight: 600;
}

.project-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #0f172a;
}

.project-desc {
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.5;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 6rpx;
}

.tag {
  padding: 6rpx 14rpx;
  background-color: #f1f5f9;
  border-radius: 8rpx;
}

.tag-text {
  font-size: 22rpx;
  color: #475569;
  font-weight: 500;
}

.project-stats {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 12rpx;
  padding-top: 16rpx;
  border-top: 1px solid #f1f5f9;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.stat-icon {
  width: 28rpx;
  height: 28rpx;
  color: #94a3b8;
  flex-shrink: 0;
}

.stat-icon-img {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.stat-text {
  font-size: 24rpx;
  color: #64748b;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 24rpx;
  background-color: #e2e8f0;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  margin-right: 6px;
}

.author-text {
  font-size: 24rpx;
  color: #64748b;
  font-weight: 500;
}
</style>

