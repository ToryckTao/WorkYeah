<template>
  <view class="login-container">
    <!-- Logo 区域 - 右上角 -->
    <view class="logo-corner animate-fadeInUp">
      <view class="logo-circle-small">
        <image 
          src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg" 
          class="logo-image-small"
          mode="aspectFit"
        ></image>
      </view>
      <text class="brand-name-small">WorkYeah</text>
    </view>

    <!-- 主内容区域 - 占据整个页面 -->
    <view class="main-content animate-fadeInUp-delayed">
      <view class="content-wrapper">
        <!-- 欢迎标题 -->
        <view class="welcome-section">
          <text class="welcome-title">欢迎回来</text>
          <text class="welcome-subtitle">请选择登录方式继续使用</text>
        </view>

        <!-- Tab 切换器 -->
        <view class="tab-list">
          <view 
            class="tab-item"
            :class="{ 'tab-active': activeTab === 'qrcode' }"
            @click="activeTab = 'qrcode'"
          >
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/qrcode.png" class="tab-icon-img tab-icon-qrcode" mode="aspectFit"></image>
            <text class="tab-text" :class="{ 'tab-text-active': activeTab === 'qrcode' }">扫码登录</text>
          </view>
          <view 
            class="tab-item"
            :class="{ 'tab-active': activeTab === 'phone' }"
            @click="activeTab = 'phone'"
          >
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/phone.png" class="tab-icon-img" mode="aspectFit"></image>
            <text class="tab-text" :class="{ 'tab-text-active': activeTab === 'phone' }">手机号登录</text>
          </view>
          <view 
            class="tab-item"
            :class="{ 'tab-active': activeTab === 'email' }"
            @click="activeTab = 'email'"
          >
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/email.png" class="tab-icon-img" mode="aspectFit"></image>
            <text class="tab-text" :class="{ 'tab-text-active': activeTab === 'email' }">邮箱登录</text>
          </view>
        </view>

        <!-- 滚动表单区域 -->
        <scroll-view scroll-y class="form-scroll">
          <!-- 扫码登录 -->
          <view v-if="activeTab === 'qrcode'" class="form-content">
            <view class="qrcode-section">
              <image 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://workyeah.app/login" 
                class="qrcode-image"
                mode="aspectFit"
              ></image>
              <text class="qrcode-tip">使用 WorkYeah App 或微信扫描二维码登录</text>
            </view>

            <view class="auth-btn-wrapper">
              <view class="login-btn" @click="handleLogin">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/login-icon.png" class="btn-icon-img" mode="aspectFit"></image>
                <text class="login-btn-text">登录</text>
              </view>
              <view class="register-btn" @click="handleRegister">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/register-icon.png" class="btn-icon-img" mode="aspectFit"></image>
                <text class="register-btn-text">注册</text>
              </view>
            </view>
          </view>

          <!-- 手机号登录 -->
          <view v-if="activeTab === 'phone'" class="form-content">
            <view class="form-group">
              <text class="form-label">手机号</text>
              <input 
                type="number"
                placeholder="请输入手机号"
                v-model="phone"
                class="form-input"
                maxlength="11"
              />
            </view>
            
            <view class="form-group">
              <text class="form-label">验证码</text>
              <view class="code-input-wrapper">
                <input
                  type="number"
                  placeholder="请输入验证码"
                  v-model="verifyCode"
                  class="form-input code-input"
                  maxlength="6"
                />
                <view 
                  class="code-btn"
                  :class="{ 'code-btn-disabled': countdown > 0 || phone.length < 11 }"
                  @click="handleSendCode"
                >
                  <text class="code-btn-text">{{ countdown > 0 ? countdown + 's' : '获取验证码' }}</text>
                </view>
              </view>
            </view>

            <view class="auth-btn-wrapper">
              <view class="login-btn" @click="handleLogin">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/login-icon.png" class="btn-icon-img" mode="aspectFit"></image>
                <text class="login-btn-text">登录</text>
              </view>
              <view class="register-btn" @click="handleRegister">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/register-icon.png" class="btn-icon-img" mode="aspectFit"></image>
                <text class="register-btn-text">注册</text>
              </view>
            </view>
          </view>

          <!-- 邮箱登录 -->
          <view v-if="activeTab === 'email'" class="form-content">
            <view class="form-group">
              <text class="form-label">邮箱</text>
              <input 
                type="text"
                placeholder="请输入邮箱地址"
                v-model="email"
                class="form-input"
              />
            </view>
            
            <view class="form-group">
              <text class="form-label">密码</text>
              <view class="password-input-wrapper">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  v-model="password"
                  class="form-input password-input"
                />
                <view class="eye-icon" @click="showPassword = !showPassword">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/eye-password.png" class="eye-svg-img" mode="aspectFit"></image>
                </view>
              </view>
            </view>

            <view class="remember-row">
              <view class="remember-checkbox" @click="agreedTerms = !agreedTerms">
                <view class="checkbox" :class="{ 'checkbox-checked': agreedTerms }">
                  <text v-if="agreedTerms" class="checkbox-icon">✓</text>
                </view>
                <text class="remember-text">记住我</text>
              </view>
              <text class="forgot-password">忘记密码？</text>
            </view>

            <view class="auth-btn-wrapper">
              <view class="login-btn" @click="handleLogin">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/login-icon.png" class="btn-icon-img" mode="aspectFit"></image>
                <text class="login-btn-text">登录</text>
              </view>
              <view class="register-btn" @click="handleRegister">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/register-icon.png" class="btn-icon-img" mode="aspectFit"></image>
                <text class="register-btn-text">注册</text>
              </view>
            </view>
          </view>

          <!-- 分隔线 -->
          <view class="divider-section">
            <view class="divider-line"></view>
            <text class="divider-text">或使用以下方式登录</text>
            <view class="divider-line"></view>
          </view>

          <!-- 社交登录 -->
          <view class="social-login">
            <view class="social-icon">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/wechat.png" class="social-img" mode="aspectFit"></image>
            </view>
            <view class="social-icon">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/QQ.png" class="social-img" mode="aspectFit"></image>
            </view>
            <view class="social-icon">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/Facebook.png" class="social-img" mode="aspectFit"></image>
            </view>
            <view class="social-icon">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/apple.png" class="social-img" mode="aspectFit"></image>
            </view>
          </view>

          <!-- 服务条款 -->
          <view class="terms-section">
            <text class="terms-text">登录即表示您同意我们的</text>
            <text class="terms-link">服务条款</text>
            <text class="terms-text">和</text>
            <text class="terms-link">隐私政策</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      activeTab: 'qrcode',
      showPassword: false,
      phone: '',
      verifyCode: '',
      email: '',
      password: '',
      agreedTerms: false,
      countdown: 0,
      timer: null
    }
  },
  methods: {
    handleSendCode: function() {
      var self = this
      if (self.phone.length >= 11 && self.countdown === 0) {
        self.countdown = 60
        self.timer = setInterval(function() {
          self.countdown = self.countdown - 1
          if (self.countdown <= 0) {
            clearInterval(self.timer)
            self.timer = null
          }
        }, 1000)
        
        uni.showToast({
          title: '验证码已发送',
          icon: 'success',
          duration: 2000
        })
      }
    },
    
    handleLogin: function() {
      var self = this
      
      if (self.activeTab === 'phone') {
        if (!self.phone || self.phone.length < 11) {
          uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (!self.verifyCode) {
          uni.showToast({
            title: '请输入验证码',
            icon: 'none',
            duration: 2000
          })
          return
        }
      } else if (self.activeTab === 'email') {
        if (!self.email) {
          uni.showToast({
            title: '请输入邮箱',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (!self.password) {
          uni.showToast({
            title: '请输入密码',
            icon: 'none',
            duration: 2000
          })
          return
        }
      }
      
      uni.showLoading({
        title: '登录中...'
      })
      
      setTimeout(function() {
        uni.hideLoading()
        
        uni.setStorageSync('isLoggedIn', 'true')
        uni.setStorageSync('userName', '古德奈特')
        
        uni.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        })
        
        setTimeout(function() {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      }, 1000)
    },
    
    handleRegister: function() {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    }
  },
  beforeDestroy: function() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
}

/* Logo 区域 - 右上角 */
.logo-corner {
  position: absolute;
  top: 100px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
}

.logo-circle-small {
  width: 58px;
  height: 58px;
  border-radius: 29px;
  overflow: hidden;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.logo-image-small {
  width: 100%;
  height: 100%;
}

.brand-name-small {
  font-size: 24px;
  font-weight: bold;
  color: #000000;
}

/* 主内容区域 - 占据整个页面 */
.main-content {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.content-wrapper {
  padding: 100px 32px 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-section {
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 32px;
  font-weight: bold;
  color: #0f172a;
  display: block;
  margin-bottom: 12px;
}

.welcome-subtitle {
  font-size: 16px;
  color: #64748b;
  line-height: 1.5;
}

.tab-list {
  display: flex;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.tab-item {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  transition: all 0.3s;
}

.tab-active {
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.tab-icon-img {
  width: 16px;
  height: 16px;
}

.tab-icon-qrcode {
  width: 20px;
  height: 20px;
}

.tab-active .tab-icon {
  color: #0f172a;
}

.tab-text {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.tab-text-active {
  color: #0f172a;
  font-weight: 500;
}

.form-scroll {
  flex: 1;
  overflow-y: auto;
}

.form-content {
  padding-bottom: 16px;
}

.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  margin-bottom: 16px;
}

.qrcode-tip {
  font-size: 14px;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background-color: #ffffff;
  box-sizing: border-box;
}

.code-input-wrapper {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

.code-btn {
  min-width: 100px;
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.code-btn-disabled {
  background-color: #f1f5f9;
}

.code-btn-text {
  font-size: 14px;
  color: #0f172a;
}

.code-btn-disabled .code-btn-text {
  color: #94a3b8;
}

.password-input-wrapper {
  position: relative;
}

.password-input {
  padding-right: 48px;
}

.eye-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.eye-svg {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.eye-svg-img {
  width: 20px;
  height: 20px;
}

.remember-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-checked {
  background-color: #336df4;
  border-color: #336df4;
}

.checkbox-icon {
  font-size: 12px;
  color: #ffffff;
}

.remember-text {
  font-size: 14px;
  color: #64748b;
}

.forgot-password {
  font-size: 14px;
  font-weight: 500;
  color: #336df4;
}

.auth-btn-wrapper {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.login-btn {
  flex: 1;
  height: 48px;
  background-color: #336df4;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:active {
  opacity: 0.8;
}

.login-btn-text {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
}

.register-btn {
  flex: 1;
  height: 48px;
  background-color: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-btn:active {
  opacity: 0.8;
}

.register-btn-text {
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-icon-img {
  width: 18px;
  height: 18px;
}

.divider-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
}

.divider-text {
  font-size: 14px;
  color: #64748b;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.social-icon {
  width: 48px;
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.social-icon:active {
  background-color: #f1f5f9;
}

.social-svg {
  width: 24px;
  height: 24px;
}

.social-img {
  width: 28px;
  height: 28px;
}

.terms-section {
  text-align: center;
  padding-bottom: 16px;
}

.terms-text {
  font-size: 12px;
  color: #94a3b8;
}

.terms-link {
  font-size: 12px;
  color: #94a3b8;
  text-decoration: underline;
  margin: 0 4px;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.animate-fadeInUp-delayed {
  animation: fadeInUp 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
  opacity: 0;
}
</style>

