<template>
  <view class="recruitment-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">招募中心</text>
      <view class="navbar-right" @click="showPublishModal">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/plus.png" class="add-icon-img" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/search.png" class="search-icon-img" mode="aspectFit"></image>
        <input 
          class="search-input" 
          type="text" 
          placeholder="搜索招募信息..." 
          v-model="searchQuery"
          confirm-type="search"
        />
      </view>
    </view>

    <!-- 类型筛选器 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view 
          v-for="type in types" 
          :key="type"
          class="category-chip"
          :class="{ 'active': selectedType === type }"
          @click="selectType(type)"
        >
          <view class="category-dot" :class="{ 'active-dot': selectedType === type }"></view>
          <text class="chip-text">{{ type }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 招募列表 -->
    <scroll-view class="content-area" scroll-y>
      <view class="recruitments-list">
        <view 
          v-for="item in filteredRecruitments" 
          :key="item.id"
          class="recruitment-card"
          @click="viewRecruitment(item)"
        >
          <!-- 标题区域 -->
          <view class="card-header">
            <view class="header-top">
              <text class="recruitment-title">{{ item.title }}</text>
              <view class="type-badge" :style="{ background: getTypeBadgeColor(item.type) }">
                <text class="badge-text">{{ item.type }}</text>
              </view>
            </view>
            <text class="project-name">{{ item.projectName }}</text>
          </view>
          
          <!-- 描述 -->
          <text class="recruitment-desc">{{ item.description }}</text>
          
          <!-- 标签 -->
          <view class="recruitment-tags">
            <view v-for="(tag, index) in item.tags" :key="index" class="tag">
              <text class="tag-text">{{ tag }}</text>
            </view>
          </view>
          
          <!-- 底部信息 -->
          <view class="card-footer">
            <view class="author-info">
              <view class="author-avatar" v-if="item.author !== '天津大学'">
                <text class="avatar-text">{{ item.authorAvatar }}</text>
              </view>
              <image v-else src="https://workyean.oss-cn-beijing.aliyuncs.com/static/tju.png" class="author-avatar-img" mode="aspectFill"></image>
              <text class="author-name">{{ item.author }}</text>
            </view>
            <view class="applicants-info">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/community-alt.png" class="applicants-icon-img" mode="aspectFit"></image>
              <text class="applicants-text">{{ item.applicants }} 人申请</text>
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
      selectedType: '全部',
      types: ['全部', '全职', '兼职', '远程', '实习'],
      recruitments: [
        {
          id: 'r1',
          title: '前端工程师',
          projectName: '智能协作平台',
          description: '负责Web前端开发，React/Vue技术栈，3年以上经验',
          location: '北京',
          salary: '20-35K',
          type: '全职',
          postedDate: '2天前',
          tags: ['React', 'Vue', 'TypeScript'],
          author: '天津大学',
          authorAvatar: '津',
          applicants: 23
        },
        {
          id: 'r2',
          title: 'AI算法工程师',
          projectName: '智能推荐系统',
          description: '负责推荐算法研发，熟悉机器学习和深度学习',
          location: '上海',
          salary: '30-50K',
          type: '全职',
          postedDate: '1天前',
          tags: ['AI', 'Python', '机器学习'],
          author: 'AI团队',
          authorAvatar: 'AI',
          applicants: 45
        },
        {
          id: 'r3',
          title: 'UI设计师',
          projectName: '移动应用设计',
          description: '负责移动端UI设计，有成熟作品，精通Figma',
          location: '深圳',
          salary: '15-25K',
          type: '兼职',
          postedDate: '3天前',
          tags: ['UI', 'Figma', '移动端'],
          author: '设计团队',
          authorAvatar: '设',
          applicants: 18
        },
        {
          id: 'r4',
          title: '全栈开发工程师',
          projectName: '企业SaaS平台',
          description: '全栈开发，Node.js + React，可远程办公',
          location: '远程',
          salary: '25-40K',
          type: '远程',
          postedDate: '5天前',
          tags: ['Node.js', 'React', '全栈'],
          author: '创业团队',
          authorAvatar: '创',
          applicants: 34
        },
        {
          id: 'r5',
          title: '产品经理实习生',
          projectName: '用户增长项目',
          description: '协助产品设计和需求分析，在校生优先',
          location: '杭州',
          salary: '150/天',
          type: '实习',
          postedDate: '1周前',
          tags: ['产品', '用户增长', '实习'],
          author: '产品团队',
          authorAvatar: '产',
          applicants: 56
        },
        {
          id: 'r6',
          title: '后端开发工程师',
          projectName: '微服务架构改造',
          description: 'Java/Go后端开发，熟悉微服务架构',
          location: '广州',
          salary: '22-38K',
          type: '全职',
          postedDate: '4天前',
          tags: ['Java', 'Go', '微服务'],
          author: '技术部',
          authorAvatar: '后',
          applicants: 29
        }
      ]
    }
  },
  
  computed: {
    filteredRecruitments: function() {
      var filtered = this.recruitments
      
      // 按类型筛选
      if (this.selectedType !== '全部') {
        filtered = filtered.filter(r => r.type === this.selectedType)
      }
      
      // 按搜索词筛选
      if (this.searchQuery) {
        var query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(r => 
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.projectName.toLowerCase().includes(query) ||
          r.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      return filtered
    }
  },
  
  methods: {
    goBack: function() {
      uni.navigateBack()
    },
    
    selectType: function(type) {
      this.selectedType = type
    },
    
    viewRecruitment: function(item) {
      uni.showModal({
        title: item.title,
        content: '项目: ' + item.projectName + '\n\n' + item.description + '\n\n地点: ' + item.location + '\n薪资: ' + item.salary,
        confirmText: '申请',
        cancelText: '取消',
        success: function(res) {
          if (res.confirm) {
            uni.showToast({
              title: '申请已提交',
              icon: 'success'
            })
          }
        }
      })
    },
    
    showPublishModal: function() {
      uni.showToast({
        title: '发布招募功能开发中',
        icon: 'none'
      })
    },
    
    getTypeBadgeColor: function(type) {
      switch(type) {
        case '全职': return '#4895ff'
        case '兼职': return '#336df4'
        case '远程': return '#4895ff'
        case '实习': return '#336df4'
        default: return '#4895ff'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.recruitment-container {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
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
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

/* 搜索栏 */
.search-bar {
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 10px 16px;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #94a3b8;
  margin-right: 8px;
}

.search-icon-img {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  font-size: 15px;
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
  padding: 12px 16px;
  gap: 8px;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f8fafc;
  border-radius: 20px;
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
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #cbd5e1;
  transition: all 0.2s;
}

.category-dot.active-dot {
  background-color: #4895ff;
}

.chip-text {
  font-size: 14px;
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
  padding: 12px;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
}

.recruitments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.recruitment-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

.recruitment-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.recruitment-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-badge {
  padding: 6px 12px;
  border-radius: 8px;
  flex-shrink: 0;
}

.badge-text {
  font-size: 12px;
  color: #ffffff;
  font-weight: 600;
}

.project-name {
  font-size: 14px;
  color: #4895ff;
  font-weight: 500;
}

.recruitment-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
}

.recruitment-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.detail-text {
  font-size: 13px;
  color: #64748b;
}

.recruitment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 10px;
  background-color: #f1f5f9;
  border-radius: 6px;
}

.tag-text {
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4895ff 0%, #336df4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 16px;
}

.avatar-text {
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
}

.author-name {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.applicants-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.applicants-icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.applicants-icon-img {
  width: 16px;
  height: 16px;
}

.applicants-text {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}
</style>

