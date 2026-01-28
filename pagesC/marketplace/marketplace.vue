<template>
  <view class="marketplace-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">工作流集市</text>
      <view class="navbar-right"></view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/search.png" class="search-icon-img" mode="aspectFit"></image>
        <input 
          class="search-input" 
          type="text" 
          placeholder="输入关键词搜索..." 
          v-model="searchQuery"
          confirm-type="search"
        />
      </view>
    </view>

    <!-- 分类筛选器 (横向滚动) -->
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

    <!-- 工作流模板网格 -->
    <scroll-view class="content-area" scroll-y @scrolltolower="onReachBottom">
      <view class="templates-grid">
        <view 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-card"
          @click="handleCardClick(template)"
        >
          <!-- 工作流预览图 -->
          <view class="card-preview">
            <view class="preview-placeholder">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/file.png" class="workflow-icon-img" mode="aspectFit"></image>
              <text class="preview-text">{{ template.category }}</text>
            </view>
          </view>

          <!-- 卡片内容 -->
          <view class="card-body">
            <text class="card-title">{{ template.title }}</text>
            <text class="card-description">{{ template.description }}</text>

            <!-- 标签 -->
            <view class="tags-row">
              <view v-for="tag in template.tags" :key="tag" class="tag-badge">
                <text class="tag-text">{{ tag }}</text>
              </view>
              <view class="price-badge" :class="{ 'free': template.price === '免费' }">
                <text class="price-text">{{ template.price }}</text>
              </view>
            </view>

            <!-- 底部信息 -->
            <view class="card-footer">
              <view class="author-info">
                <view class="author-avatar">
                  <text class="avatar-text">{{ template.authorAvatar }}</text>
                </view>
                <text class="author-name">{{ template.author }}</text>
              </view>
              <view class="action-btn" @click.stop="handleUseTemplate(template)">
                <text class="btn-text">使用</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredTemplates.length === 0" class="empty-state">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">没有找到匹配的工作流模板</text>
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
      searchQuery: '',
      selectedCategory: '全部',
      categories: ['全部', '学术研究', '软件开发', '市场营销'],
      
      // 工作流模板数据
      templates: [
        {
          id: 'p1',
          title: '智慧养老APP',
          description: '完整的软件开发工作流，包含需求分析、UI设计、前后端开发和测试交付。',
          author: '@WorkYeah官方',
          authorAvatar: 'WY',
          category: '软件开发',
          tags: ['编程', '自动化'],
          price: '免费'
        },
        {
          id: 'p2',
          title: '辛亥革命论文',
          description: '学术研究工作流，包含史料搜集、学术回顾、观点提炼和报告生成。',
          author: '@WorkYeah官方',
          authorAvatar: 'WY',
          category: '学术研究',
          tags: ['学术', '文档生成'],
          price: '免费'
        },
        {
          id: 'p3',
          title: '营销分析报告',
          description: '商业分析工作流，包含竞品分析、数据清洗、可视化和商业计划书撰写。',
          author: '@WorkYeah官方',
          authorAvatar: 'WY',
          category: '市场营销',
          tags: ['数据', '营销'],
          price: '免费'
        },
        {
          id: 't1',
          title: '产品需求文档模板',
          description: '标准化的PRD文档模板，包含市场分析、用户画像、功能规格和验收标准。',
          author: '@WorkYeah官方',
          authorAvatar: 'WY',
          category: '软件开发',
          tags: ['文档生成', '规划'],
          price: '免费'
        },
        {
          id: 't2',
          title: '数据分析报告',
          description: '专业的数据分析工作流，涵盖数据采集、清洗、可视化和洞察提取全流程。',
          author: '@WorkYeah官方',
          authorAvatar: 'WY',
          category: '市场营销',
          tags: ['数据分析', '营销'],
          price: '免费'
        },
        {
          id: 't3',
          title: '学术论文助手',
          description: '论文写作全流程辅助，包括文献综述、研究方法、数据分析和参考文献管理。',
          author: '@WorkYeah官方',
          authorAvatar: 'WY',
          category: '学术研究',
          tags: ['学术', '文档生成'],
          price: '免费'
        }
      ]
    }
  },
  
  computed: {
    filteredTemplates: function() {
      var self = this
      return this.templates.filter(function(template) {
        // 分类筛选
        var matchesCategory = self.selectedCategory === '全部' || template.category === self.selectedCategory
        
        // 搜索筛选
        var matchesSearch = self.searchQuery === '' ||
          template.title.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1 ||
          template.description.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1
        
        return matchesCategory && matchesSearch
      })
    }
  },
  
  methods: {
    goBack: function() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    
    selectCategory: function(category) {
      this.selectedCategory = category
    },
    
    handleCardClick: function(template) {
      uni.showModal({
        title: template.title,
        content: template.description,
        confirmText: '使用模板',
        cancelText: '取消',
        success: function(res) {
          if (res.confirm) {
            uni.showToast({
              title: '模板已应用',
              icon: 'success'
            })
          }
        }
      })
    },
    
    handleUseTemplate: function(template) {
      uni.showToast({
        title: '正在应用模板...',
        icon: 'loading',
        duration: 1000
      })
      
      setTimeout(function() {
        uni.showToast({
          title: '模板已应用',
          icon: 'success'
        })
      }, 1000)
    },
    
    onReachBottom: function() {
      // 预留下拉加载更多功能
      console.log('Reached bottom')
    }
  },
  
  onPullDownRefresh: function() {
    // 模拟刷新
    setTimeout(function() {
      uni.stopPullDownRefresh()
      uni.showToast({
        title: '刷新成功',
        icon: 'success'
      })
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
.marketplace-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

/* 搜索栏 */
.search-bar {
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
}

.search-icon-img {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  z-index: 1;
}

.search-input {
  flex: 1;
  height: 44px;
  padding-left: 40px;
  padding-right: 16px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  color: #111827;
}

.search-input:focus {
  outline: none;
  border-color: #4895ff;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* 分类筛选器 */
.category-scroll {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.category-list {
  display: flex;
  padding: 12px 16px;
  gap: 8px;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: transparent;
  transition: all 0.2s;
  flex-shrink: 0;
  gap: 8px;
}

.category-chip.active {
  background-color: #e4edfc;
}

.category-chip:active {
  opacity: 0.7;
}

.chip-text {
  font-size: 14px;
  font-weight: 400;
  color: #4b5563;
  white-space: nowrap;
}

.category-chip.active .chip-text {
  font-weight: 500;
  color: #1356f0;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #d1d5db;
  transition: background-color 0.2s;
}

.category-dot.active-dot {
  background-color: #4895ff;
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;
}

/* 工作流卡片 */
.template-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.template-card:active {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.card-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.workflow-icon {
  width: 40px;
  height: 40px;
  color: #9ca3af;
  opacity: 0.6;
}

.workflow-icon-img {
  width: 40px;
  height: 40px;
  opacity: 0.6;
}

.preview-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.card-body {
  padding: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  display: block;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

/* 标签行 */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag-badge {
  padding: 2px 8px;
  background-color: #e4edfc;
  border-radius: 12px;
}

.tag-text {
  font-size: 12px;
  color: #4b5563;
  font-weight: 400;
}

.price-badge {
  padding: 2px 8px;
  background-color: #fef3c7;
  border-radius: 12px;
}

.price-badge.free {
  background-color: #d1fae5;
}

.price-text {
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
}

.author-name {
  font-size: 13px;
  color: #4b5563;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-btn {
  padding: 6px 16px;
  background-color: #4895ff;
  border-radius: 6px;
  flex-shrink: 0;
}

.action-btn:active {
  opacity: 0.9;
}

.btn-text {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
}

.empty-text {
  font-size: 15px;
  color: #94a3b8;
}

.bottom-spacer {
  height: 80px;
}
</style>

