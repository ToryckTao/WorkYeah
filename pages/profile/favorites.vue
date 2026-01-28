<template>
  <view class="favorites-container">
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">我的收藏</text>
      <view class="navbar-right"></view>
    </view>

    <scroll-view class="content-area" scroll-y>
      <view class="favorites-list">
        <view 
          v-for="item in favorites" 
          :key="item.id"
          class="favorite-card"
          @click="openProject(item)"
        >
          <image class="project-cover" :src="item.cover" mode="aspectFill"></image>
          <view class="project-info">
            <text class="project-name">{{ item.name }}</text>
            <text class="project-description">{{ item.description }}</text>
            <view class="project-meta">
              <view class="meta-item">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/profile.png" class="meta-icon-img" mode="aspectFit"></image>
                <text class="meta-text">{{ item.members }}人</text>
              </view>
              <view class="meta-item">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="meta-icon-img" mode="aspectFit"></image>
                <text class="meta-text">{{ item.stars }}</text>
              </view>
              <text class="collect-time">{{ item.collectTime }}收藏</text>
            </view>
          </view>
          <view class="action-btn" @click.stop="removeFavorite(item)">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="action-icon-img" mode="aspectFit"></image>
          </view>
        </view>
      </view>

      <view v-if="favorites.length === 0" class="empty-state">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="empty-icon-img" mode="aspectFit"></image>
        <text class="empty-title">暂无收藏</text>
        <text class="empty-desc">去社区发现感兴趣的项目吧</text>
      </view>

      <view class="bottom-spacer"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      favorites: [
        {
          id: 1,
          name: '智能家居控制系统',
          description: '基于IoT技术的全屋智能家居解决方案，支持语音控制和场景联动',
          cover: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/chair.jpg',
          members: 12,
          stars: 328,
          collectTime: '3天前'
        },
        {
          id: 2,
          name: '在线教育平台',
          description: '支持直播、录播、互动问答的一站式在线教育解决方案',
          cover: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/presentation.jpg',
          members: 8,
          stars: 256,
          collectTime: '1周前'
        },
        {
          id: 3,
          name: '电商数据分析系统',
          description: '多维度电商数据分析，支持实时监控和智能预警',
          cover: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/module.jpg',
          members: 6,
          stars: 189,
          collectTime: '2周前'
        }
      ]
    }
  },
  
  methods: {
    goBack: function() {
      uni.navigateBack()
    },
    
    openProject: function(item) {
      uni.navigateTo({
        url: '/pagesA/project-showcase-detail/project-showcase-detail?id=' + item.id + '&name=' + encodeURIComponent(item.name)
      })
    },
    
    removeFavorite: function(item) {
      var that = this
      uni.showModal({
        title: '取消收藏',
        content: '确定要取消收藏「' + item.name + '」吗？',
        success: function(res) {
          if (res.confirm) {
            that.favorites = that.favorites.filter(function(f) {
              return f.id !== item.id
            })
            uni.showToast({
              title: '已取消收藏',
              icon: 'success'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.favorites-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  height: 56px;
  border-bottom: 1px solid #e2e8f0;
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

.content-area {
  height: calc(100vh - 56px);
}

.favorites-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-card {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: stretch;
}

.favorite-card:active {
  background-color: #f8fafc;
}

.project-cover {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  object-fit: cover;
}

.project-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  width: 14px;
  height: 14px;
  color: #94a3b8;
}

.meta-icon-img {
  width: 14px;
  height: 14px;
}

.meta-text {
  font-size: 12px;
  color: #94a3b8;
}

.collect-time {
  font-size: 12px;
  color: #94a3b8;
  margin-left: auto;
}

.action-btn {
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-left: 1px solid #f1f5f9;
}

.action-btn:active {
  background-color: #fef2f2;
}

.action-icon {
  width: 20px;
  height: 20px;
}

.action-icon-img {
  width: 20px;
  height: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-icon-img {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #94a3b8;
}

.bottom-spacer {
  height: 40px;
}
</style>

