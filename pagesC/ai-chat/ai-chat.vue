<template>
  <view class="ai-chat-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">小耶助手</text>
      <view class="navbar-right"></view>
    </view>

    <!-- 聊天消息区域 -->
    <scroll-view class="chat-area" scroll-y :scroll-top="scrollTop" scroll-with-animation>
      <view class="messages-container">
        <!-- AI欢迎消息 -->
        <view class="message-item message-left">
          <image 
            class="message-avatar ai-avatar"
            src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg"
            mode="aspectFill"
          />
          <view class="message-content">
            <view class="message-bubble ai-bubble">
              <text class="message-text">你好！我是小耶助手，可以帮你智能分析项目、生成任务、检查风险。有什么我可以帮助你的吗？</text>
            </view>
          </view>
        </view>

        <!-- 动态消息列表 -->
        <view 
          v-for="(message, index) in messages" 
          :key="index"
          class="message-item"
          :class="message.sender === 'user' ? 'message-right' : 'message-left'"
        >
          <!-- AI消息 -->
          <image 
            v-if="message.sender === 'ai'" 
            class="message-avatar ai-avatar"
            src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg"
            mode="aspectFill"
          />
          
          <view class="message-content">
            <view 
              class="message-bubble"
              :class="message.sender === 'user' ? 'user-bubble' : 'ai-bubble'"
            >
              <text class="message-text">{{ message.content }}</text>
            </view>
            
            <!-- AI快捷按钮 -->
            <view v-if="message.quickButtons" class="quick-buttons">
              <view 
                v-for="(btn, btnIndex) in message.quickButtons" 
                :key="btnIndex"
                class="quick-btn"
                @click="handleQuickAction(btn)"
              >
                <text class="quick-btn-text">{{ btn }}</text>
              </view>
            </view>
          </view>

          <!-- 用户消息头像 -->
          <image 
            v-if="message.sender === 'user'" 
            class="message-avatar user-avatar"
            src="https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg"
            mode="aspectFill"
          />
        </view>

        <!-- AI正在输入 -->
        <view v-if="isAITyping" class="message-item message-left">
          <image 
            class="message-avatar ai-avatar"
            src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg"
            mode="aspectFill"
          />
          <view class="message-content">
            <view class="message-bubble ai-bubble typing-bubble">
              <view class="typing-dots">
                <view class="dot"></view>
                <view class="dot"></view>
                <view class="dot"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-area">
      <view class="input-toolbar">
        <view class="tool-btn" @click="handleAttachment">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/plus.png" class="tool-icon-img" mode="aspectFit"></image>
        </view>
        
        <input 
          class="input-box"
          type="text"
          v-model="inputValue"
          placeholder="输入消息..."
          :adjust-position="true"
          @confirm="sendMessage"
        />
        
        <view class="tool-btn" @click="handleVoice">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/microphone.png" class="tool-icon-img" mode="aspectFit"></image>
        </view>
        
        <view class="send-btn" :class="{ 'send-active': inputValue.length > 0 }" @click="sendMessage">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/send.png" class="send-icon-img" mode="aspectFit"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      inputValue: '',
      messages: [],
      isAITyping: false,
      scrollTop: 0,
      conversationId: ''
    }
  },
  
  onLoad: function() {
    this.conversationId = 'conv_' + Date.now()
  },
  
  methods: {
    goBack: function() {
      uni.navigateBack()
    },
    
    sendMessage: function() {
      var self = this
      if (!this.inputValue.trim()) {
        return
      }
      
      this.messages.push({
        sender: 'user',
        content: this.inputValue
      })
      
      var userInput = this.inputValue
      this.inputValue = ''
      this.scrollToBottom()
      
      this.isAITyping = true
      
      uniCloud.callFunction({
        name: 'ai-chat',
        data: {
          action: 'chat',
          message: userInput,
          conversationId: self.conversationId
        }
      }).then(function(res) {
        self.isAITyping = false
        if (res.result && res.result.code === 0) {
          self.messages.push({
            sender: 'ai',
            content: res.result.data.message
          })
        } else {
          self.messages.push({
            sender: 'ai',
            content: self.getLocalResponse(userInput)
          })
        }
        self.scrollToBottom()
      }).catch(function(err) {
        console.error('AI Chat Error:', err)
        self.isAITyping = false
        self.messages.push({
          sender: 'ai',
          content: self.getLocalResponse(userInput)
        })
        self.scrollToBottom()
      })
    },
    
    getLocalResponse: function(userInput) {
      var responses = {
        '风险': '根据项目分析，当前主要风险点包括：1. 后端API未完成，影响前端联调 2. UI设计稿未最终确认 3. 测试时间较紧张。建议优先完成API开发。',
        '任务': '已为你生成任务清单：\n1. 完成用户登录模块\n2. 实现健康数据监测功能\n3. 开发老人社区功能\n4. 进行UI优化\n\n任务已同步到项目工作台。',
        '进度': '项目"智慧养老APP"当前进度：65%\n✅ 已完成：需求分析、原型设计\n🔄 进行中：功能开发\n⏳ 待开始：测试、上线部署',
        'default': '我理解你的问题。基于当前项目上下文，我建议你可以先查看项目工作台的任务分解，或者让我帮你分析具体的问题。'
      }
      for (var key in responses) {
        if (userInput.indexOf(key) !== -1) {
          return responses[key]
        }
      }
      return responses['default']
    },
    
    handleQuickAction: function(action) {
      this.inputValue = action
      this.sendMessage()
    },
    
    handleAttachment: function() {
      var self = this
      uni.chooseImage({
        count: 1,
        success: function(res) {
          self.messages.push({
            sender: 'user',
            content: '[图片]'
          })
          self.scrollToBottom()
          
          self.isAITyping = true
          setTimeout(function() {
            self.isAITyping = false
            self.messages.push({
              sender: 'ai',
              content: '已收到图片。我正在分析图片内容，请稍等...'
            })
            self.scrollToBottom()
          }, 1500)
        }
      })
    },
    
    handleVoice: function() {
      uni.showToast({
        title: '语音功能开发中',
        icon: 'none'
      })
    },
    
    scrollToBottom: function() {
      var self = this
      setTimeout(function() {
        self.scrollTop = 999999
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-chat-container {
  width: 100vw;
  height: 100vh;
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
  height: 56px;
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

.navbar-left:active {
  background-color: rgba(0, 0, 0, 0.05);
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

/* 聊天区域 */
.chat-area {
  flex: 1;
  background-color: #f8fafc;
}

.messages-container {
  padding: 16px;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  gap: 12px;
}

.message-left {
  justify-content: flex-start;
}

.message-right {
  justify-content: flex-end;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  flex-shrink: 0;
}

.ai-avatar {
  background-color: transparent;
  overflow: hidden;
}

.user-avatar {
  border: 2px solid #e2e8f0;
}

.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-right .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ai-bubble {
  background-color: #ffffff;
  border-top-left-radius: 4px;
}

.user-bubble {
  background-color: #4895ff;
  border-top-right-radius: 4px;
}

.message-text {
  font-size: 15px;
  line-height: 1.5;
  color: #0f172a;
}

.user-bubble .message-text {
  color: #ffffff;
}

/* AI正在输入 */
.typing-bubble {
  padding: 16px 20px;
}

.typing-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #cbd5e1;
  animation: typing 1.4s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 快捷按钮 */
.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-btn {
  padding: 8px 16px;
  background-color: #e4edfc;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.quick-btn:active {
  background-color: #cbd9f5;
}

.quick-btn-text {
  font-size: 13px;
  color: #336df4;
  font-weight: 500;
}

/* 底部输入区域 */
.input-area {
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 8px 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
}

.input-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.tool-btn:active {
  background-color: #f1f5f9;
}

.tool-icon {
  width: 22px;
  height: 22px;
  color: #64748b;
}

.tool-icon-img {
  width: 22px;
  height: 22px;
}

.input-box {
  flex: 1;
  height: 36px;
  background-color: #f1f5f9;
  border-radius: 18px;
  padding: 0 16px;
  font-size: 15px;
  color: #0f172a;
}

.send-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background-color: #e2e8f0;
  transition: all 0.2s;
}

.send-active {
  background-color: #4895ff;
}

.send-active:active {
  background-color: #336df4;
  transform: scale(0.95);
}

.send-icon {
  width: 20px;
  height: 20px;
  color: #94a3b8;
}

.send-icon-img {
  width: 20px;
  height: 20px;
}

.send-active .send-icon {
  color: #ffffff;
}
</style>

