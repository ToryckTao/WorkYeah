<template>
  <view class="settings-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">系统设置</text>
      <view class="navbar-right"></view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-area" scroll-y>
      <!-- 账户设置 -->
      <view class="section">
        <text class="section-title">账户设置</text>
        <view class="settings-list">
          <view class="setting-item" @click="editProfile">
            <view class="item-left">
              <text class="item-text">编辑个人资料</text>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
          </view>

          <view class="setting-item" @click="changePassword">
            <view class="item-left">
              <text class="item-text">修改密码</text>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
          </view>

          <view class="setting-item" @click="manageDevices">
            <view class="item-left">
              <text class="item-text">设备管理</text>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
          </view>
        </view>
      </view>

      <!-- 通知设置 -->
      <view class="section">
        <text class="section-title">通知设置</text>
        <view class="settings-list">
          <view class="setting-item">
            <view class="item-left">
              <text class="item-text">推送通知</text>
            </view>
            <switch 
              :checked="pushNotification" 
              @change="onPushNotificationChange"
              color="#4895ff"
            />
          </view>

          <view class="setting-item">
            <view class="item-left">
              <text class="item-text">邮件通知</text>
            </view>
            <switch 
              :checked="emailNotification" 
              @change="onEmailNotificationChange"
              color="#4895ff"
            />
          </view>

          <view class="setting-item">
            <view class="item-left">
              <text class="item-text">项目更新提醒</text>
            </view>
            <switch 
              :checked="projectUpdate" 
              @change="onProjectUpdateChange"
              color="#4895ff"
            />
          </view>
        </view>
      </view>

      <!-- 隐私与安全 -->
      <view class="section">
        <text class="section-title">隐私与安全</text>
        <view class="settings-list">
          <view class="setting-item" @click="privacySettings">
            <view class="item-left">
              <text class="item-text">隐私设置</text>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
          </view>

          <view class="setting-item">
            <view class="item-left">
              <text class="item-text">在线状态</text>
            </view>
            <switch 
              :checked="onlineStatus" 
              @change="onOnlineStatusChange"
              color="#4895ff"
            />
          </view>

          <view class="setting-item" @click="blockedUsers">
            <view class="item-left">
              <text class="item-text">黑名单管理</text>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
          </view>
        </view>
      </view>

      <!-- 应用设置 -->
      <view class="section">
        <text class="section-title">应用设置</text>
        <view class="settings-list">
          <view class="setting-item" @click="languageSettings">
            <view class="item-left">
              <text class="item-text">语言</text>
            </view>
            <view class="item-right">
              <text class="value-text">简体中文</text>
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
            </view>
          </view>

          <view class="setting-item">
            <view class="item-left">
              <text class="item-text">深色模式</text>
            </view>
            <switch 
              :checked="darkMode" 
              @change="onDarkModeChange"
              color="#4895ff"
            />
          </view>

          <view class="setting-item" @click="clearCache">
            <view class="item-left">
              <text class="item-text">清除缓存</text>
            </view>
            <view class="item-right">
              <text class="value-text">128 MB</text>
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
            </view>
          </view>
        </view>
      </view>

      <!-- 关于 -->
      <view class="section">
        <text class="section-title">关于</text>
        <view class="settings-list">
          <view class="setting-item" @click="checkUpdate">
            <view class="item-left">
              <text class="item-text">检查更新</text>
            </view>
            <view class="item-right">
              <text class="value-text">v1.0.0</text>
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
            </view>
          </view>

          <view class="setting-item" @click="feedback">
            <view class="item-left">
              <text class="item-text">意见反馈</text>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
          </view>

          <view class="setting-item" @click="about">
            <view class="item-left">
              <text class="item-text">关于 WorkYeah</text>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="arrow-icon-img" mode="aspectFit"></image>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-section">
        <view class="logout-btn" @click="logout">
          <text class="logout-text">退出登录</text>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </scroll-view>

    <!-- 编辑个人资料弹窗 -->
    <view v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <view class="modal-container" @click.stop>
        <view class="modal-header">
          <view class="modal-title-row">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/edit.png" class="title-icon-img" mode="aspectFit"></image>
            <text class="modal-title">编辑个人资料</text>
          </view>
          <view class="modal-close" @click="showEditModal = false">
            <text class="close-text">✕</text>
          </view>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <view class="form-group">
            <text class="form-label">姓名</text>
            <input class="form-input" v-model="editForm.name" placeholder="输入您的姓名" />
          </view>

          <view class="form-group">
            <text class="form-label">用户名</text>
            <input class="form-input" v-model="editForm.username" placeholder="输入用户名（不含@符号）" />
          </view>

          <view class="form-group">
            <text class="form-label">AI 人设</text>
            <view class="picker-view" @click="showAIPersonaPicker = true">
              <text class="picker-text">{{ aiPersonaOptions[editForm.aiPersonaIndex].label }}</text>
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="picker-icon-img" mode="aspectFit"></image>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">个人简介</text>
            <textarea class="form-textarea" v-model="editForm.bio" placeholder="简单介绍一下自己..." maxlength="200"></textarea>
          </view>

          <view class="form-group">
            <text class="form-label">公司/学校</text>
            <input class="form-input" v-model="editForm.company" placeholder="输入公司或学校" />
          </view>

          <view class="form-group">
            <text class="form-label">地点</text>
            <input class="form-input" v-model="editForm.location" placeholder="例如：北京，中国" />
          </view>

          <view class="form-group">
            <text class="form-label">个人网站</text>
            <input class="form-input" v-model="editForm.website" placeholder="example.com" />
          </view>
        </scroll-view>

        <view class="modal-footer">
          <view class="btn btn-outline" @click="showEditModal = false">
            <text class="btn-text">取消</text>
          </view>
          <view class="btn btn-primary" @click="saveProfile">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="btn-icon-img" mode="aspectFit"></image>
            <text class="btn-text">保存</text>
          </view>
        </view>
      </view>
    </view>

    <!-- AI人设选择器 -->
    <view v-if="showAIPersonaPicker" class="picker-overlay" @click="showAIPersonaPicker = false">
      <view class="picker-popup" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择AI人设</text>
          <view class="picker-close" @click="showAIPersonaPicker = false">
            <text class="close-btn">✕</text>
          </view>
        </view>
        <view class="picker-options">
          <view v-for="(option, index) in aiPersonaOptions" :key="index" 
            class="picker-option" 
            :class="{ 'picker-option-active': index === editForm.aiPersonaIndex }"
            @click="selectAIPersona(index)">
            <text class="option-text">{{ option.label }}</text>
            <image v-if="index === editForm.aiPersonaIndex" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="check-icon-img" mode="aspectFit"></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 修改密码弹窗 -->
    <view v-if="showPasswordModal" class="modal-overlay" @click="showPasswordModal = false">
      <view class="modal-container" @click.stop>
        <view class="modal-header">
          <view class="modal-title-row">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/settings.png" class="title-icon-img" mode="aspectFit"></image>
            <text class="modal-title">修改密码</text>
          </view>
          <view class="modal-close" @click="showPasswordModal = false">
            <text class="close-text">✕</text>
          </view>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <view class="form-group">
            <text class="form-label">当前密码</text>
            <input class="form-input" v-model="passwordForm.currentPassword" type="password" placeholder="输入当前密码" />
          </view>

          <view class="form-group">
            <text class="form-label">新密码</text>
            <input class="form-input" v-model="passwordForm.newPassword" type="password" placeholder="输入新密码（至少6位）" />
          </view>

          <view class="form-group">
            <text class="form-label">确认新密码</text>
            <input class="form-input" v-model="passwordForm.confirmPassword" type="password" placeholder="再次输入新密码" />
          </view>
        </scroll-view>

        <view class="modal-footer">
          <view class="btn btn-outline" @click="showPasswordModal = false">
            <text class="btn-text">取消</text>
          </view>
          <view class="btn btn-primary" @click="savePassword">
            <text class="btn-text">保存</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 设备管理弹窗 -->
    <view v-if="showDevicesModal" class="modal-overlay" @click="showDevicesModal = false">
      <view class="modal-container" @click.stop>
        <view class="modal-header">
          <view class="modal-title-row">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/device.png" class="title-icon-img" mode="aspectFit"></image>
            <text class="modal-title">设备管理</text>
          </view>
          <view class="modal-close" @click="showDevicesModal = false">
            <text class="close-text">✕</text>
          </view>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <view v-for="(device, index) in devices" :key="index" class="device-item">
            <view class="device-info">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/device.png" class="device-icon-img" mode="aspectFit"></image>
              <view class="device-details">
                <text class="device-name">{{ device.name }}</text>
                <text class="device-time">最后活跃：{{ device.lastActive }}</text>
                <text class="device-location">{{ device.location }}</text>
              </view>
            </view>
            <view v-if="device.current" class="current-badge">
              <text class="current-text">当前设备</text>
            </view>
            <view v-else class="remove-btn" @click="removeDevice(index)">
              <text class="remove-text">移除</text>
            </view>
          </view>
        </scroll-view>

        <view class="modal-footer">
          <view class="btn btn-primary" style="flex: 1;" @click="showDevicesModal = false">
            <text class="btn-text">关闭</text>
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
      pushNotification: true,
      emailNotification: true,
      projectUpdate: true,
      onlineStatus: true,
      darkMode: false,
      
      // 编辑个人资料
      showEditModal: false,
      showAIPersonaPicker: false,
      aiPersonaOptions: [
        { label: '全栈架构师', value: 'fullstack' },
        { label: '前端工程师', value: 'frontend' },
        { label: '后端工程师', value: 'backend' },
        { label: '产品经理', value: 'pm' },
        { label: 'UI/UX 设计师', value: 'designer' },
        { label: '数据科学家', value: 'data' },
        { label: 'DevOps 工程师', value: 'devops' },
        { label: '项目经理', value: 'project' },
        { label: '技术总监', value: 'cto' },
        { label: '创业者', value: 'entrepreneur' }
      ],
      editForm: {
        name: '古德奈特',
        username: 'wangyihan_dev',
        aiPersonaIndex: 0,
        bio: '用AI构建智能系统 · 开源爱好者 · WorkYeah重度用户',
        company: '天津大学',
        location: '天津，中国',
        website: 'wangyihan.dev'
      },
      
      // 修改密码
      showPasswordModal: false,
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      
      // 设备管理
      showDevicesModal: false,
      devices: [
        {
          type: 'mobile',
          name: 'iPhone 15 Pro',
          lastActive: '刚刚',
          location: '北京，中国',
          current: true
        },
        {
          type: 'desktop',
          name: 'MacBook Pro',
          lastActive: '2小时前',
          location: '北京，中国',
          current: false
        },
        {
          type: 'mobile',
          name: 'iPad Air',
          lastActive: '1天前',
          location: '北京，中国',
          current: false
        }
      ]
    }
  },
  
  methods: {
    goBack: function() {
      uni.navigateBack()
    },
    
    editProfile: function() {
      this.showEditModal = true
    },
    
    changePassword: function() {
      this.showPasswordModal = true
    },
    
    manageDevices: function() {
      this.showDevicesModal = true
    },
    
    selectAIPersona: function(index) {
      this.editForm.aiPersonaIndex = index
      this.showAIPersonaPicker = false
    },
    
    saveProfile: function() {
      var that = this
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
      setTimeout(function() {
        that.showEditModal = false
      }, 500)
    },
    
    savePassword: function() {
      var that = this
      
      if (!that.passwordForm.currentPassword) {
        uni.showToast({ title: '请输入当前密码', icon: 'none' })
        return
      }
      
      if (!that.passwordForm.newPassword || that.passwordForm.newPassword.length < 6) {
        uni.showToast({ title: '新密码至少6位', icon: 'none' })
        return
      }
      
      if (that.passwordForm.newPassword !== that.passwordForm.confirmPassword) {
        uni.showToast({ title: '两次密码不一致', icon: 'none' })
        return
      }
      
      uni.showToast({
        title: '密码修改成功',
        icon: 'success'
      })
      
      setTimeout(function() {
        that.showPasswordModal = false
        that.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }, 500)
    },
    
    removeDevice: function(index) {
      var that = this
      uni.showModal({
        title: '移除设备',
        content: '确定要移除该设备吗？',
        success: function(res) {
          if (res.confirm) {
            that.devices.splice(index, 1)
            uni.showToast({
              title: '设备已移除',
              icon: 'success'
            })
          }
        }
      })
    },
    
    onPushNotificationChange: function(e) {
      this.pushNotification = e.detail.value
    },
    
    onEmailNotificationChange: function(e) {
      this.emailNotification = e.detail.value
    },
    
    onProjectUpdateChange: function(e) {
      this.projectUpdate = e.detail.value
    },
    
    privacySettings: function() {
      uni.showToast({ title: '隐私设置', icon: 'none' })
    },
    
    onOnlineStatusChange: function(e) {
      this.onlineStatus = e.detail.value
    },
    
    blockedUsers: function() {
      uni.showToast({ title: '黑名单管理', icon: 'none' })
    },
    
    languageSettings: function() {
      uni.showToast({ title: '语言设置', icon: 'none' })
    },
    
    onDarkModeChange: function(e) {
      this.darkMode = e.detail.value
      uni.showToast({
        title: e.detail.value ? '已开启深色模式' : '已关闭深色模式',
        icon: 'none'
      })
    },
    
    clearCache: function() {
      uni.showModal({
        title: '清除缓存',
        content: '确定要清除所有缓存吗？',
        success: function(res) {
          if (res.confirm) {
            uni.showToast({
              title: '缓存已清除',
              icon: 'success'
            })
          }
        }
      })
    },
    
    checkUpdate: function() {
      uni.showLoading({ title: '检查中...' })
      setTimeout(function() {
        uni.hideLoading()
        uni.showToast({
          title: '已是最新版本',
          icon: 'success'
        })
      }, 1000)
    },
    
    feedback: function() {
      uni.showToast({ title: '意见反馈', icon: 'none' })
    },
    
    about: function() {
      uni.showModal({
        title: 'WorkYeah',
        content: '版本：v1.0.0\n\n智能协作 让工作更高效',
        showCancel: false
      })
    },
    
    logout: function() {
      var self = this
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: function(res) {
          if (res.confirm) {
            uni.removeStorageSync('isLoggedIn')
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-container {
  min-height: 100vh;
  background-color: #f8fafc;
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

/* 内容区域 */
.content-area {
  flex: 1;
  height: calc(100vh - 56px);
}

.section {
  margin-top: 16px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  padding: 8px 16px;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.settings-list {
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:active {
  background-color: #f8fafc;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.item-icon {
  width: 22px;
  height: 22px;
  color: #4895ff;
  flex-shrink: 0;
}

.item-text {
  font-size: 16px;
  color: #0f172a;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.value-text {
  font-size: 14px;
  color: #64748b;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  color: #94a3b8;
  flex-shrink: 0;
}

.arrow-icon-img {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 退出登录 */
.logout-section {
  padding: 16px 0;
  margin-top: 24px;
}

.logout-btn {
  background-color: #ffffff;
  border-top: 1px solid #fecaca;
  border-bottom: 1px solid #fecaca;
  padding: 16px;
  text-align: center;
  transition: background-color 0.2s;
  width: 100%;
}

.logout-btn:active {
  background-color: #fee2e2;
}

.logout-text {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
}

.bottom-spacer {
  height: 20px;
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
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  background-color: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
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

.title-icon {
  width: 24px;
  height: 24px;
  color: #4895ff;
}

.title-icon-img {
  width: 24px;
  height: 24px;
}

.btn-icon-img {
  width: 16px;
  height: 16px;
}

.check-icon-img {
  width: 20px;
  height: 20px;
}

.device-icon-img {
  width: 32px;
  height: 32px;
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

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  display: block;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #4895ff;
}

.form-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  line-height: 1.5;
  box-sizing: border-box;
}

.form-textarea:focus {
  border-color: #4895ff;
}

.picker-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.picker-view:active {
  border-color: #4895ff;
  background-color: #f8fafc;
}

.picker-text {
  font-size: 15px;
  color: #0f172a;
  flex: 1;
}

.picker-icon {
  width: 20px;
  height: 20px;
  color: #94a3b8;
  flex-shrink: 0;
}

.picker-icon-img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
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
  color: #ffffff;
}

.btn-text {
  font-size: 15px;
  font-weight: 600;
}

.btn-outline .btn-text {
  color: #64748b;
}

.btn-primary .btn-text {
  color: #ffffff;
}

/* AI人设选择器 */
.picker-popup {
  width: 100%;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.picker-title {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.picker-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.picker-close:active {
  background-color: #f1f5f9;
}

.close-btn {
  font-size: 24px;
  color: #64748b;
  line-height: 1;
}

.picker-options {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.picker-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  transition: background-color 0.2s;
}

.picker-option:active {
  background-color: #f8fafc;
}

.picker-option-active {
  background-color: #f0f7ff;
}

.option-text {
  font-size: 16px;
  color: #0f172a;
  flex: 1;
}

.picker-option-active .option-text {
  color: #4895ff;
  font-weight: 500;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #4895ff;
  flex-shrink: 0;
  margin-left: 12px;
}

/* 设备列表 */
.device-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
  margin-bottom: 12px;
}

.device-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.device-icon {
  width: 32px;
  height: 32px;
  color: #4895ff;
  flex-shrink: 0;
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.device-time {
  font-size: 13px;
  color: #64748b;
}

.device-location {
  font-size: 13px;
  color: #94a3b8;
}

.current-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #4895ff 0%, #336df4 100%);
  border-radius: 6px;
}

.current-text {
  font-size: 12px;
  color: #ffffff;
  font-weight: 600;
}

.remove-btn {
  padding: 6px 12px;
  background-color: #fee2e2;
  border-radius: 6px;
}

.remove-btn:active {
  background-color: #fecaca;
}

.remove-text {
  font-size: 13px;
  color: #dc2626;
  font-weight: 600;
}
</style>

