<template>
  <view class="detail-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">项目详情</text>
      <view class="navbar-right"></view>
    </view>

    <scroll-view class="detail-content" scroll-y>
      <!-- 项目标题区域 -->
      <view class="project-header">
        <view class="header-top">
          <text class="project-title">{{ project.title }}</text>
          <view class="status-badge" :class="{'status-completed': project.status === '已完成', 'status-progress': project.status === '进行中', 'status-planning': project.status === '规划中'}">
            <text class="badge-text">{{ project.status }}</text>
          </view>
        </view>
        
        <!-- 作者信息 -->
        <view class="author-info">
          <image v-if="isAvatarImage" :src="project.authorAvatar" class="author-avatar-img" mode="aspectFill"></image>
          <view v-else class="author-avatar">
            <text class="avatar-text">{{ project.authorAvatar }}</text>
          </view>
          <text class="author-name">{{ project.author }}</text>
          <text class="publish-time">· 发布于 3天前</text>
        </view>
      </view>

      <!-- 项目描述 -->
      <view class="description-section">
        <text class="section-title">项目介绍</text>
        <text class="description-text">{{ projectIntro }}</text>
        
        <!-- 项目亮点 -->
        <view class="highlights-wrapper">
          <text class="sub-title">✨ 项目亮点</text>
          <view class="highlight-item" v-for="(highlight, index) in highlights" :key="index">
            <view class="highlight-dot"></view>
            <text class="highlight-text">{{ highlight }}</text>
          </view>
        </view>
        
        <!-- 技术栈 -->
        <view class="tech-stack-wrapper">
          <text class="sub-title">🛠 技术栈</text>
          <view class="tech-tags">
            <view class="tech-tag" v-for="(tech, index) in techStack" :key="index">
              <text class="tech-text">{{ tech }}</text>
            </view>
          </view>
        </view>
        
        <!-- 团队信息 -->
        <view class="team-wrapper">
          <text class="sub-title">👥 团队成员</text>
          <view class="team-members">
            <view class="team-member" v-for="(member, index) in teamMembers" :key="index">
              <image v-if="member.avatar" :src="member.avatar" class="member-avatar-img" mode="aspectFill"></image>
              <view v-else class="member-avatar" :style="{ backgroundColor: member.color }">
                <text class="member-initial">{{ member.name.slice(0,1) }}</text>
              </view>
              <view class="member-info">
                <text class="member-name">{{ member.name }}</text>
                <text class="member-role">{{ member.role }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 项目标签 -->
      <view class="tags-section">
        <view class="tag" v-for="(tag, index) in project.tags" :key="index">
          <text class="tag-text">{{ tag }}</text>
        </view>
      </view>

      <!-- 统计数据 -->
      <view class="stats-section">
        <view class="stat-item">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/views.png" class="stat-icon-img" mode="aspectFit"></image>
          <text class="stat-value">{{ project.views }}</text>
          <text class="stat-label">浏览</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/like.png" class="stat-icon-img" mode="aspectFit"></image>
          <text class="stat-value">{{ project.stars }}</text>
          <text class="stat-label">点赞</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/fork.png" class="stat-icon-img" mode="aspectFit"></image>
          <text class="stat-value">{{ project.forks }}</text>
          <text class="stat-label">Fork</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn" @click="handleShare">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/share.png" class="btn-icon-img" mode="aspectFit"></image>
          <text class="btn-text">分享</text>
        </view>
        <view class="action-btn" @click="scrollToComments">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/comment.png" class="btn-icon-img" mode="aspectFit"></image>
          <text class="btn-text">评论</text>
        </view>
        <view class="action-btn action-btn-warning" @click="handleReport">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/report.png" class="btn-icon-img" mode="aspectFit"></image>
          <text class="btn-text">举报</text>
        </view>
        <view 
          class="action-btn" 
          :class="{ 'action-btn-active': isFavorite }"
          @click="toggleFavorite"
        >
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="btn-icon-img" mode="aspectFit"></image>
          <text class="btn-text">{{ isFavorite ? '已收藏' : '收藏' }}</text>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="comments-section" id="comments">
        <view class="comments-header">
          <text class="comments-title">评论 ({{ comments.length }})</text>
        </view>

        <!-- 评论输入框 -->
        <view class="comment-input-wrapper">
          <textarea 
            class="comment-input"
            placeholder="写下你的评论..."
            v-model="newComment"
            :maxlength="500"
          ></textarea>
          <view class="comment-submit-row">
            <text class="char-count">{{ newComment.length }}/500</text>
            <view class="submit-btn" @click="submitComment">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/send.png" class="submit-icon-img" mode="aspectFit"></image>
            </view>
          </view>
        </view>

        <!-- 评论列表 -->
        <view class="comments-list">
          <view class="comment-item" v-for="comment in comments" :key="comment.id">
            <view class="comment-avatar">
              <text class="avatar-text">{{ comment.avatar }}</text>
            </view>
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-author">{{ comment.author }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <view class="comment-action" @click="likeComment(comment)">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/like.png" class="action-icon-img" mode="aspectFit"></image>
                  <text class="action-text" :class="{ 'action-text-active': comment.liked }">{{ comment.likes }}</text>
                </view>
                <view class="comment-action">
                  <text class="action-text">回复</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 分享弹窗 -->
    <view v-if="showShareModal" class="modal-mask" @click="showShareModal = false">
      <view class="modal-content share-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">项目分享</text>
          <view class="modal-close" @click="showShareModal = false">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
          </view>
        </view>
        <text class="modal-desc">分享您喜欢的项目给其他用户</text>

        <!-- 分享方式 -->
        <view class="share-methods">
          <view class="share-method" @click="handleCopyLink">
            <view class="share-method-icon-wrapper share-icon-link">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/copy.png" class="share-method-icon-img" mode="aspectFit"></image>
            </view>
            <text class="share-method-text">复制链接</text>
          </view>
          <view class="share-method" @click="handleShowQRCode">
            <view class="share-method-icon-wrapper share-icon-qr">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/qrcode.png" class="share-method-icon-img" mode="aspectFit"></image>
            </view>
            <text class="share-method-text">二维码</text>
          </view>
          <view class="share-method" @click="handleShareEmail">
            <view class="share-method-icon-wrapper share-icon-mail">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/email.png" class="share-method-icon-img" mode="aspectFit"></image>
            </view>
            <text class="share-method-text">邮件分享</text>
          </view>
        </view>

        <!-- 分享链接 -->
        <view class="share-link-section">
          <text class="share-label">分享链接</text>
          <view class="share-link-row">
            <input class="share-link-input" :value="shareLink" readonly/>
            <view class="copy-link-btn" @click="handleCopyLink">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/copy.png" class="copy-icon-img" mode="aspectFit"></image>
              <text class="copy-text">复制</text>
            </view>
          </view>
        </view>

        <!-- 分享到社区 -->
        <view class="community-share-card">
          <view class="community-icon-wrapper">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/share.png" class="community-icon-img" mode="aspectFit"></image>
          </view>
          <view class="community-content">
            <text class="community-title">推荐给好友</text>
            <text class="community-desc">将这个精彩项目分享给你的朋友，一起学习交流</text>
            <view class="community-btn" @click="handleShareToFriends">
              <text class="community-btn-text">立即分享</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 举报弹窗 -->
    <view v-if="showReportModal" class="modal-mask" @click="showReportModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">举报项目</text>
          <view class="modal-close" @click="showReportModal = false">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
          </view>
        </view>
        <view class="modal-body">
          <view 
            class="report-option" 
            v-for="option in reportOptions" 
            :key="option"
            :class="{ 'report-option-active': selectedReport === option }"
            @click="selectedReport = option"
          >
            <view class="radio-circle" :class="{ 'radio-active': selectedReport === option }">
              <view v-if="selectedReport === option" class="radio-dot"></view>
            </view>
            <text class="option-text">{{ option }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <view class="cancel-btn" @click="showReportModal = false">
            <text class="cancel-btn-text">取消</text>
          </view>
          <view class="confirm-btn" @click="submitReport">
            <text class="confirm-btn-text">提交举报</text>
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
      projectId: '',
      project: {
        id: '',
        title: '',
        description: '',
        detailedDescription: '',
        author: '',
        authorAvatar: '',
        tags: [],
        status: '',
        views: 0,
        stars: 0,
        forks: 0
      },
      isFavorite: false,
      newComment: '',
      comments: [
        { id: 1, author: '李明', avatar: '李', time: '2小时前', content: '这个项目太棒了！我们公司正在寻找类似的解决方案，已经Fork了准备深入研究。', likes: 8, liked: false },
        { id: 2, author: '王芳', avatar: '王', time: '5小时前', content: '技术栈很现代，代码质量也很高。请问有部署文档吗？', likes: 5, liked: false },
        { id: 3, author: '张强', avatar: '张', time: '1天前', content: '界面设计很棒，用户体验很好。希望能加入更多的自定义配置选项。', likes: 12, liked: false },
        { id: 4, author: '刘洋', avatar: '刘', time: '2天前', content: '已经在生产环境使用了，运行很稳定，感谢作者的贡献！', likes: 15, liked: false }
      ],
      showReportModal: false,
      showShareModal: false,
      selectedReport: '',
      reportOptions: ['内容抄袭', '虚假信息', '侵犯版权', '违规内容', '其他原因'],
      // 项目介绍丰富内容
      highlights: [
        '采用最新技术栈，性能优异',
        '完善的文档和代码注释',
        '支持快速部署和二次开发',
        '活跃的社区支持和更新'
      ],
      techStack: ['Vue 3', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
      teamMembers: [
        { name: '萧祷', role: '项目负责人', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
        { name: '一墨乾行', role: '前端开发', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' },
        { name: 'Fine', role: '后端开发', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/Fine.jpg' }
      ]
    }
  },
  
  computed: {
    projectIntro: function() {
      var desc = this.project.detailedDescription || this.project.description
      if (!desc) return '暂无项目介绍'
      // 丰富项目介绍内容
      return desc + '\n\n本项目旨在提供一个高效、易用的解决方案，帮助用户快速实现业务目标。项目采用模块化设计，代码结构清晰，易于维护和扩展。我们持续关注用户反馈，不断优化产品体验。'
    },
    shareLink: function() {
      return 'https://workyeah.com/projects/' + this.projectId
    },
    isAvatarImage: function() {
      // 判断 authorAvatar 是否是图片路径
      var avatar = this.project.authorAvatar || ''
      return avatar.startsWith('/') || avatar.startsWith('http')
    }
  },
  
  onLoad: function(options) {
    if (options.id) {
      this.projectId = options.id
      this.loadProject(options)
    }
  },
  
  methods: {
    loadProject: function(options) {
      // 从参数中获取项目信息
      this.project = {
        id: options.id || '',
        title: decodeURIComponent(options.title || ''),
        description: decodeURIComponent(options.description || ''),
        detailedDescription: decodeURIComponent(options.detailedDescription || options.description || ''),
        author: decodeURIComponent(options.author || ''),
        authorAvatar: decodeURIComponent(options.authorAvatar || ''),
        tags: options.tags ? JSON.parse(decodeURIComponent(options.tags)) : [],
        status: decodeURIComponent(options.status || ''),
        views: parseInt(options.views) || 0,
        stars: parseInt(options.stars) || 0,
        forks: parseInt(options.forks) || 0
      }
    },
    
    goBack: function() {
      // 获取页面栈
      var pages = getCurrentPages()
      if (pages.length > 1) {
        // 有上一页，直接返回
        uni.navigateBack({
          delta: 1
        })
      } else {
        // 没有上一页，跳转到项目展示页
        uni.redirectTo({
          url: '/pagesA/projects-showcase/projects-showcase'
        })
      }
    },
    
    getStatusClass: function(status) {
      switch(status) {
        case '已完成': return 'status-completed'
        case '进行中': return 'status-progress'
        case '规划中': return 'status-planning'
        default: return 'status-default'
      }
    },
    
    handleShare: function() {
      this.showShareModal = true
    },
    
    handleCopyLink: function() {
      var self = this
      uni.setClipboardData({
        data: self.shareLink,
        success: function() {
          uni.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
    },
    
    handleShowQRCode: function() {
      uni.showToast({
        title: '二维码已生成',
        icon: 'success'
      })
    },
    
    handleShareEmail: function() {
      uni.showToast({
        title: '已打开邮件客户端',
        icon: 'none'
      })
    },
    
    handleShareToFriends: function() {
      var self = this
      uni.showActionSheet({
        itemList: ['分享到微信', '分享到QQ', '分享到微博'],
        success: function(res) {
          var platforms = ['微信', 'QQ', '微博']
          uni.showToast({
            title: '已分享到' + platforms[res.tapIndex],
            icon: 'success'
          })
          self.showShareModal = false
        }
      })
    },
    
    scrollToComments: function() {
      // 滚动到评论区
      uni.pageScrollTo({
        selector: '#comments',
        duration: 300
      })
    },
    
    handleReport: function() {
      this.showReportModal = true
      this.selectedReport = ''
    },
    
    submitReport: function() {
      if (!this.selectedReport) {
        uni.showToast({
          title: '请选择举报原因',
          icon: 'none'
        })
        return
      }
      
      this.showReportModal = false
      uni.showToast({
        title: '举报已提交',
        icon: 'success'
      })
    },
    
    toggleFavorite: function() {
      this.isFavorite = !this.isFavorite
      uni.showToast({
        title: this.isFavorite ? '已收藏' : '已取消收藏',
        icon: 'success'
      })
    },
    
    submitComment: function() {
      if (!this.newComment.trim()) {
        uni.showToast({
          title: '请输入评论内容',
          icon: 'none'
        })
        return
      }
      
      // 添加新评论到列表顶部
      this.comments.unshift({
        id: Date.now(),
        author: '我',
        avatar: '我',
        time: '刚刚',
        content: this.newComment,
        likes: 0,
        liked: false
      })
      
      this.newComment = ''
      uni.showToast({
        title: '评论成功',
        icon: 'success'
      })
    },
    
    likeComment: function(comment) {
      comment.liked = !comment.liked
      comment.likes += comment.liked ? 1 : -1
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 导航栏 */
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

.navbar-left, .navbar-right {
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
  font-size: 32rpx;
  font-weight: 600;
  color: #0f172a;
}

/* 内容区域 */
.detail-content {
  flex: 1;
  box-sizing: border-box;
}

/* 项目标题区域 */
.project-header {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.project-title {
  flex: 1;
  font-size: 36rpx;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  border: 2rpx solid;
  background-color: #ffffff;
  flex-shrink: 0;
}

.status-completed { border-color: #10b981; }
.status-completed .badge-text { color: #10b981; }
.status-progress { border-color: #3b82f6; }
.status-progress .badge-text { color: #3b82f6; }
.status-planning { border-color: #f59e0b; }
.status-planning .badge-text { color: #f59e0b; }

.badge-text {
  font-size: 22rpx;
  font-weight: 600;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.author-avatar-img {
  width: 48rpx;
  height: 48rpx;
  border-radius: 24rpx;
}

.author-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 24rpx;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #64748b;
}

.author-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #0f172a;
}

.publish-time {
  font-size: 24rpx;
  color: #94a3b8;
}

/* 项目描述 */
.description-section {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #0f172a;
  display: block;
  margin-bottom: 16rpx;
}

.description-text {
  font-size: 26rpx;
  color: #475569;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 项目亮点 */
.highlights-wrapper {
  margin-top: 32rpx;
  padding-top: 24rpx;
  border-top: 1px solid #f1f5f9;
}

.sub-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #0f172a;
  display: block;
  margin-bottom: 16rpx;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.highlight-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background-color: #4895ff;
  margin-top: 10rpx;
  flex-shrink: 0;
}

.highlight-text {
  font-size: 24rpx;
  color: #475569;
  line-height: 1.5;
}

/* 技术栈 */
.tech-stack-wrapper {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1px solid #f1f5f9;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tech-tag {
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, #e0e6f7 0%, #e4edfc 100%);
  border-radius: 16rpx;
  border: 1px solid #c7d2fe;
}

.tech-text {
  font-size: 22rpx;
  font-weight: 500;
  color: #4895ff;
}

/* 团队信息 */
.team-wrapper {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1px solid #f1f5f9;
}

.team-members {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background-color: #f8fafc;
  border-radius: 12rpx;
}

.member-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-avatar-img {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  flex-shrink: 0;
}

.member-initial {
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #0f172a;
  display: block;
  margin-bottom: 4rpx;
}

.member-role {
  font-size: 22rpx;
  color: #64748b;
}

/* 标签 */
.tags-section {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  box-sizing: border-box;
}

.tag {
  padding: 8rpx 20rpx;
  background-color: #f1f5f9;
  border-radius: 20rpx;
  border: 1px solid #e2e8f0;
}

.tag-text {
  font-size: 24rpx;
  color: #475569;
  font-weight: 500;
}

/* 统计数据 */
.stats-section {
  background-color: #ffffff;
  padding: 32rpx 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-icon {
  width: 40rpx;
  height: 40rpx;
  color: #64748b;
}

.stat-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 22rpx;
  color: #94a3b8;
}

.stat-divider {
  width: 1px;
  height: 60rpx;
  background-color: #e2e8f0;
}

/* 操作按钮 */
.action-buttons {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  gap: 16rpx;
  box-sizing: border-box;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 20rpx 12rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e2e8f0;
  background-color: #ffffff;
}

.action-btn:active {
  background-color: #f8fafc;
}

.action-btn-warning {
  border-color: #fed7aa;
}

.action-btn-warning .btn-icon,
.action-btn-warning .btn-text {
  color: #ea580c;
}

.action-btn-active {
  border-color: #fecaca;
  background-color: #fef2f2;
}

.action-btn-active .btn-icon,
.action-btn-active .btn-text {
  color: #dc2626;
}

.btn-icon {
  width: 36rpx;
  height: 36rpx;
  color: #64748b;
}

.btn-icon-img {
  width: 36rpx;
  height: 36rpx;
}

.btn-text {
  font-size: 22rpx;
  font-weight: 500;
  color: #64748b;
}

/* 评论区 */
.comments-section {
  background-color: #ffffff;
  padding: 24rpx;
  box-sizing: border-box;
}

.comments-header {
  margin-bottom: 24rpx;
}

.comments-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #0f172a;
}

/* 评论输入 */
.comment-input-wrapper {
  margin-bottom: 24rpx;
}

.comment-input {
  width: 100%;
  height: 160rpx;
  padding: 20rpx;
  border: 2rpx solid #e2e8f0;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: #0f172a;
  background-color: #f8fafc;
  box-sizing: border-box;
}

.comment-submit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}

.char-count {
  font-size: 22rpx;
  color: #94a3b8;
}

.submit-btn {
  padding: 16rpx 32rpx;
  background-color: #4895ff;
  border-radius: 12rpx;
}

.submit-btn:active {
  opacity: 0.9;
}

.submit-btn-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #ffffff;
}

.submit-icon-img {
  width: 32rpx;
  height: 32rpx;
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.comment-item {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #f8fafc;
  border-radius: 16rpx;
}

.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.comment-author {
  font-size: 26rpx;
  font-weight: 600;
  color: #0f172a;
}

.comment-time {
  font-size: 22rpx;
  color: #94a3b8;
}

.comment-text {
  font-size: 26rpx;
  color: #475569;
  line-height: 1.5;
  display: block;
  margin-bottom: 12rpx;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.action-icon {
  width: 28rpx;
  height: 28rpx;
  color: #94a3b8;
}

.action-icon-img {
  width: 28rpx;
  height: 28rpx;
}

.action-text {
  font-size: 22rpx;
  color: #94a3b8;
}

.action-text-active {
  color: #dc2626;
}

/* 举报弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 600rpx;
  max-width: 90%;
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #0f172a;
}

.modal-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  width: 32rpx;
  height: 32rpx;
  color: #64748b;
}

.close-icon-img {
  width: 32rpx;
  height: 32rpx;
}

.modal-body {
  padding: 24rpx;
}

.report-option {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.report-option:active,
.report-option-active {
  background-color: #f8fafc;
}

.radio-circle {
  width: 36rpx;
  height: 36rpx;
  border-radius: 18rpx;
  border: 3rpx solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radio-active {
  border-color: #4895ff;
}

.radio-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 9rpx;
  background-color: #4895ff;
}

.option-text {
  font-size: 26rpx;
  color: #0f172a;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #64748b;
}

.confirm-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  background-color: #ea580c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #ffffff;
}

/* 分享弹窗 */
.share-modal {
  max-height: 80vh;
  overflow-y: auto;
}

.modal-desc {
  font-size: 24rpx;
  color: #64748b;
  display: block;
  padding: 0 24rpx 24rpx;
}

.share-methods {
  display: flex;
  gap: 16rpx;
  padding: 0 24rpx 24rpx;
}

.share-method {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 12rpx;
  border: 2rpx solid #e2e8f0;
  border-radius: 16rpx;
  background-color: #ffffff;
}

.share-method:active {
  background-color: #f8fafc;
}

.share-method-icon-wrapper {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon-link {
  background-color: #eff6ff;
}

.share-icon-link .share-method-icon {
  color: #3b82f6;
}

.share-icon-qr {
  background-color: #f0fdf4;
}

.share-icon-qr .share-method-icon {
  color: #10b981;
}

.share-icon-mail {
  background-color: #faf5ff;
}

.share-icon-mail .share-method-icon {
  color: #8b5cf6;
}

.share-method-icon {
  width: 32rpx;
  height: 32rpx;
}

.share-method-icon-img {
  width: 32rpx;
  height: 32rpx;
}

.share-method-text {
  font-size: 22rpx;
  font-weight: 500;
  color: #475569;
}

/* 分享链接 */
.share-link-section {
  padding: 0 24rpx 24rpx;
}

.share-label {
  font-size: 24rpx;
  font-weight: 500;
  color: #475569;
  display: block;
  margin-bottom: 12rpx;
}

.share-link-row {
  display: flex;
  gap: 12rpx;
}

.share-link-input {
  flex: 1;
  padding: 16rpx 20rpx;
  border: 2rpx solid #e2e8f0;
  border-radius: 12rpx;
  font-size: 24rpx;
  color: #64748b;
  background-color: #f8fafc;
  box-sizing: border-box;
}

.copy-link-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 20rpx;
  border: 2rpx solid #e2e8f0;
  border-radius: 12rpx;
  background-color: #ffffff;
  flex-shrink: 0;
}

.copy-link-btn:active {
  background-color: #f8fafc;
}

.copy-icon {
  width: 28rpx;
  height: 28rpx;
  color: #64748b;
}

.copy-icon-img {
  width: 28rpx;
  height: 28rpx;
}

.copy-text {
  font-size: 24rpx;
  font-weight: 500;
  color: #475569;
}

/* 分享到社区 */
.community-share-card {
  margin: 0 24rpx 24rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
  border: 2rpx solid #bfdbfe;
  border-radius: 16rpx;
  display: flex;
  gap: 16rpx;
}

.community-icon-wrapper {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background-color: #4895ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.community-icon {
  width: 32rpx;
  height: 32rpx;
  color: #ffffff;
}

.community-icon-img {
  width: 32rpx;
  height: 32rpx;
}

.community-content {
  flex: 1;
}

.community-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #1e3a5f;
  display: block;
  margin-bottom: 8rpx;
}

.community-desc {
  font-size: 22rpx;
  color: #3b82f6;
  display: block;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.community-btn {
  width: 100%;
  padding: 16rpx;
  background-color: #4895ff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.community-btn:active {
  opacity: 0.9;
}

.community-btn-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #ffffff;
}
</style>

