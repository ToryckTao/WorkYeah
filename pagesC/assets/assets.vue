<template>
  <view class="assets-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">资产</text>
      <view class="navbar-right">
        <view class="navbar-btn" @click="handleConvert">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/convert.png" :class="['convert-icon-img', isConverted ? 'convert-icon-active' : '']" mode="aspectFit"></image>
        </view>
        <view class="navbar-btn" @click="showUploadModal = true">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/cloud-upload.png" class="upload-icon-img" mode="aspectFit"></image>
        </view>
      </view>
    </view>

    <scroll-view class="assets-content" scroll-y>
      <!-- 视图切换 -->
      <view class="view-toggle">
        <view :class="['toggle-btn', viewMode === 'member' ? 'toggle-btn-active' : '']" @click="switchViewMode('member')">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/members.png" class="toggle-icon-img" mode="aspectFit"></image>
          <text class="toggle-text">按成员</text>
        </view>
        <view :class="['toggle-btn', viewMode === 'task' ? 'toggle-btn-active' : '']" @click="switchViewMode('task')">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/task-list.png" class="toggle-icon-img" mode="aspectFit"></image>
          <text class="toggle-text">按任务</text>
        </view>
      </view>

      <!-- 文件夹列表 -->
      <view class="folders-list">
        <view class="folder-item" v-for="folder in folders" :key="folder.id" @click="toggleFolder(folder.id)">
          <view class="folder-header">
            <view class="folder-header-left">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/folder.png" class="folder-icon-img" mode="aspectFit"></image>
              <view v-if="folder.avatar" class="folder-avatar-wrapper">
                <image :src="folder.avatar" class="folder-avatar" mode="aspectFill"></image>
              </view>
              <text class="folder-name">{{ folder.name }}</text>
            </view>
            <view class="folder-header-right">
              <text class="folder-count">{{ folder.count }}个文件</text>
              <image v-if="expandedFolders.includes(folder.id)" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="chevron-icon-img" mode="aspectFit"></image>
              <image v-else src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="chevron-icon-img" mode="aspectFit"></image>
            </view>
          </view>

          <!-- 文件列表 -->
          <view v-if="expandedFolders.includes(folder.id)" class="files-list">
            <view class="file-item" v-for="file in folder.files" :key="file.id">
              <image v-if="file.type === 'pdf'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/pdf.png" class="file-icon-img" mode="aspectFit"></image>
              <image v-else-if="file.type === 'sketch' || file.type === 'design'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/sketch.png" class="file-icon-img" mode="aspectFit"></image>
              <image v-else-if="file.type === 'excel'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/format-xlsx.png" class="file-icon-img" mode="aspectFit"></image>
              <image v-else-if="file.type === 'ppt'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/pptx.png" class="file-icon-img" mode="aspectFit"></image>
              <image v-else-if="file.type === 'code'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/file-markdown.png" class="file-icon-img" mode="aspectFit"></image>
              <image v-else-if="file.type === 'video'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/mp4.png" class="file-icon-img" mode="aspectFit"></image>
              <image v-else src="https://workyean.oss-cn-beijing.aliyuncs.com/static/doc.png" class="file-icon-img" mode="aspectFit"></image>
              <view class="file-info">
                <text class="file-name">{{ convertFileName(file.name) }}</text>
                <text class="file-type">{{ file.typeText }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 上传文件弹窗 -->
    <view v-if="showUploadModal" class="upload-modal-mask" @click="showUploadModal = false">
      <view class="upload-modal" @click.stop>
        <view class="upload-modal-header">
          <text class="upload-modal-title">上传文件</text>
          <view class="upload-close-btn" @click="showUploadModal = false">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
          </view>
        </view>
        <view class="upload-modal-body">
          <view class="upload-area" @click="chooseFile">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/cloud-upload.png" class="upload-area-icon-img" mode="aspectFit"></image>
            <text class="upload-area-text">点击选择文件</text>
            <text class="upload-area-hint">支持 PDF、Word、Excel、图片等格式</text>
          </view>
          <view class="upload-btn" @click="handleUpload">
            <text class="upload-btn-text">上传</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 转换中遮罩 -->
    <view v-if="isConverting" class="converting-mask">
      <view class="converting-content">
        <view class="spinner">
          <view class="spinner-dot"></view>
        </view>
        <text class="converting-text">转换中...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      projectId: '',
      projectName: '',
      viewMode: 'member', // member 或 task
      expandedFolders: [], // 支持多个文件夹同时展开
      showUploadModal: false,
      isConverted: false, // 是否已转换
      isConverting: false, // 是否正在转换
      folders: []
    }
  },
  onLoad: function(options) {
    this.projectId = options.id || ''
    this.projectName = decodeURIComponent(options.name || '')
    this.loadFolders()
  },
  methods: {
    loadFolders: function() {
      if (this.viewMode === 'member') {
        this.folders = [
          {
            id: 'member-1',
            name: '古德奈特',
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg',
            count: 2,
            files: [
              { id: 'file-1', name: '需求文档.pdf', type: 'pdf', typeText: 'PDF 文档' },
              { id: 'file-2', name: 'UI设计稿.sketch', type: 'sketch', typeText: '设计文件' }
            ]
          },
          {
            id: 'member-2',
            name: '萧祷',
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg',
            count: 3,
            files: [
              { id: 'file-3', name: '数据分析.xlsx', type: 'excel', typeText: 'Excel 表格' },
              { id: 'file-4', name: '产品原型.sketch', type: 'design', typeText: '设计文件' },
              { id: 'file-5', name: '技术方案.pdf', type: 'pdf', typeText: 'PDF 文档' }
            ]
          },
          {
            id: 'member-3',
            name: '一墨乾行',
            avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg',
            count: 5,
            files: [
              { id: 'file-6', name: '后端代码.zip', type: 'code', typeText: '压缩文件' },
              { id: 'file-7', name: 'API文档.pdf', type: 'pdf', typeText: 'PDF 文档' },
              { id: 'file-8', name: '测试报告.docx', type: 'word', typeText: 'Word 文档' },
              { id: 'file-9', name: '演示视频.mp4', type: 'video', typeText: '视频文件' },
              { id: 'file-10', name: '项目总结.pptx', type: 'ppt', typeText: 'PPT 文件' }
            ]
          }
        ]
      } else {
        this.folders = [
          {
            id: 'task-1',
            name: '1. 界面设计',
            avatar: null,
            count: 4,
            files: [
              { id: 'file-1', name: 'UI设计稿.sketch', type: 'sketch', typeText: '设计文件' },
              { id: 'file-2', name: '产品原型.sketch', type: 'design', typeText: '设计文件' },
              { id: 'file-3', name: '设计规范.pdf', type: 'pdf', typeText: 'PDF 文档' },
              { id: 'file-4', name: '交互说明.docx', type: 'word', typeText: 'Word 文档' }
            ]
          },
          {
            id: 'task-2',
            name: '2. 后端开发',
            avatar: null,
            count: 2,
            files: [
              { id: 'file-5', name: '后端代码.zip', type: 'code', typeText: '压缩文件' },
              { id: 'file-6', name: 'API文档.pdf', type: 'pdf', typeText: 'PDF 文档' }
            ]
          },
          {
            id: 'task-3',
            name: '3. 功能测试',
            avatar: null,
            count: 2,
            files: [
              { id: 'file-7', name: '测试报告.docx', type: 'word', typeText: 'Word 文档' },
              { id: 'file-8', name: '演示视频.mp4', type: 'video', typeText: '视频文件' }
            ]
          }
        ]
      }
    },
    
    switchViewMode: function(mode) {
      this.viewMode = mode
      this.expandedFolders = []
      this.loadFolders()
    },
    
    toggleFolder: function(folderId) {
      const index = this.expandedFolders.indexOf(folderId)
      if (index > -1) {
        // 已展开，则收起
        this.expandedFolders.splice(index, 1)
      } else {
        // 未展开，则添加到展开列表
        this.expandedFolders.push(folderId)
      }
    },
    
    chooseFile: function() {
      uni.chooseFile({
        count: 1,
        success: (res) => {
          console.log('选择文件成功', res)
        }
      })
    },
    
    handleUpload: function() {
      uni.showToast({
        title: '上传成功',
        icon: 'success'
      })
      this.showUploadModal = false
    },
    
    goBack: function() {
      uni.navigateBack()
    },
    handleConvert: function() {
      // 显示转换中动画
      this.isConverting = true
      
      // 模拟转换过程（2秒）
      setTimeout(() => {
        // 切换转换状态
        this.isConverted = !this.isConverted
        
        // 重新加载文件夹以应用文件名转换
        this.loadFolders()
        
        // 隐藏转换中动画
        this.isConverting = false
        
        // 显示提示
        uni.showToast({
          title: this.isConverted ? '已转换为 DOCX 格式' : '已恢复原格式',
          icon: 'success',
          duration: 2000
        })
      }, 2000)
    },
    convertFileName: function(fileName) {
      if (!this.isConverted) return fileName
      
      // 将 .md 和 .pdf 文件转换为 .docx
      if (fileName.endsWith('.md') || fileName.endsWith('.pdf')) {
        return fileName.replace(/\.(md|pdf)$/, '.docx')
      }
      return fileName
    }
  }
}
</script>

<style scoped>
.assets-container {
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 自定义导航栏 */
.custom-navbar {
  background-color: #ffffff;
  padding: 20rpx 24rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
}

.navbar-left {
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
  flex: 1;
  text-align: center;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.navbar-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.convert-icon {
  width: 44rpx;
  height: 44rpx;
  color: #64748b;
  transition: all 0.3s;
}

.convert-icon-img {
  width: 44rpx;
  height: 44rpx;
  transition: all 0.3s;
}

.convert-icon-active {
  color: #10b981;
}

.upload-icon {
  width: 44rpx;
  height: 44rpx;
  color: #4895ff;
}

.upload-icon-img {
  width: 44rpx;
  height: 44rpx;
}

/* 内容区域 */
.assets-content {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

/* 视图切换 */
.view-toggle {
  display: flex;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.toggle-btn {
  flex: 1;
  padding: 16rpx 12rpx;
  border-radius: 12rpx;
  border: 2px solid #e2e8f0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  box-sizing: border-box;
}

.toggle-btn-active {
  border-color: #4895ff;
  background-color: #eff6ff;
}

.toggle-icon {
  width: 32rpx;
  height: 32rpx;
  color: #64748b;
  flex-shrink: 0;
}

.toggle-icon-img {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.toggle-btn-active .toggle-icon {
  color: #4895ff;
}

.toggle-text {
  font-size: 26rpx;
  color: #64748b;
  font-weight: 500;
}

.toggle-btn-active .toggle-text {
  color: #4895ff;
}

/* 文件夹列表 */
.folders-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.folder-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-sizing: border-box;
}

.folder-header {
  padding: 20rpx;
  min-height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.folder-header-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  min-width: 0;
  min-height: 48rpx;
}

.folder-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.folder-icon-img {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.folder-avatar-wrapper {
  width: 48rpx;
  height: 48rpx;
  flex-shrink: 0;
}

.folder-avatar {
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
}

.folder-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-header-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.folder-count {
  font-size: 24rpx;
  color: #64748b;
  white-space: nowrap;
}

.chevron-icon {
  width: 32rpx;
  height: 32rpx;
  color: #64748b;
  flex-shrink: 0;
}

.chevron-icon-img {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

/* 文件列表 */
.files-list {
  border-top: 1px solid #e2e8f0;
  padding: 16rpx 20rpx;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  box-sizing: border-box;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.file-icon {
  width: 48rpx;
  height: 48rpx;
  flex-shrink: 0;
}

.file-icon-img {
  width: 48rpx;
  height: 48rpx;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.file-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-type {
  font-size: 22rpx;
  color: #64748b;
}

/* 上传弹窗 */
.upload-modal-mask {
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

.upload-modal {
  width: 600rpx;
  max-width: 90%;
  background-color: #ffffff;
  border-radius: 32rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.upload-modal-header {
  padding: 32rpx;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.upload-modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0f172a;
}

.upload-close-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.close-icon {
  width: 36rpx;
  height: 36rpx;
  color: #64748b;
}

.close-icon-img {
  width: 36rpx;
  height: 36rpx;
}

.upload-modal-body {
  padding: 32rpx;
  box-sizing: border-box;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 20rpx;
  padding: 60rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 32rpx;
  box-sizing: border-box;
}

.upload-area-icon {
  width: 80rpx;
  height: 80rpx;
}

.upload-area-icon-img {
  width: 80rpx;
  height: 80rpx;
}

.upload-area-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #0f172a;
}

.upload-area-hint {
  font-size: 24rpx;
  color: #64748b;
}

.upload-btn {
  width: 100%;
  padding: 20rpx;
  border-radius: 12rpx;
  background-color: #4895ff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.upload-btn-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
}

/* 转换中遮罩 */
.converting-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.converting-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 32rpx;
  padding: 64rpx 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40rpx;
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.5s ease-out;
}

.spinner {
  width: 100rpx;
  height: 100rpx;
  position: relative;
}

.spinner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 6rpx solid #e2e8f0;
  border-radius: 50%;
}

.spinner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 6rpx solid transparent;
  border-top-color: #4895ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 中心脉冲点 */
.spinner-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24rpx;
  height: 24rpx;
  background: linear-gradient(135deg, #4895ff 0%, #60a5fa 100%);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(60rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.7;
  }
}

.converting-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: 2rpx;
}
</style>

