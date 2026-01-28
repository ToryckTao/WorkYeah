<template>
  <view class="ai-settings-container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">AI 能力设置</text>
      <view class="navbar-right"></view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-area" scroll-y>
      <!-- 小耶回答偏好设置 -->
      <view class="section-card">
        <text class="card-title">小耶回答偏好设置</text>
        
        <!-- 模型选择 -->
        <view class="setting-item">
          <text class="setting-label">模型选择</text>
          <view class="picker-view" @click="showModelPicker = true">
            <text class="picker-text">{{ modelOptions[modelIndex].label }}</text>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="picker-icon-img" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 文档格式偏好 -->
        <view class="setting-item">
          <text class="setting-label">文档格式偏好</text>
          <view class="picker-view" @click="showDocFormatPicker = true">
            <text class="picker-text">{{ docFormatOptions[docFormatIndex].label }}</text>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="picker-icon-img" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 系统指令 -->
        <view class="setting-item">
          <text class="setting-label">系统指令</text>
          <textarea 
            class="textarea" 
            placeholder="输入可选的语气和风格指令..." 
            v-model="systemInstructions"
            maxlength="500"
          ></textarea>
        </view>

        <!-- 随机性 Temperature -->
        <view class="setting-item">
          <view class="slider-header">
            <text class="setting-label">随机性 (Temperature)</text>
            <text class="slider-value">{{ temperature.toFixed(1) }}</text>
          </view>
          <slider 
            class="slider" 
            :value="temperature * 100" 
            @change="onTemperatureChange"
            min="0"
            max="100"
            activeColor="#4895ff"
            backgroundColor="#e5e7eb"
            block-size="20"
          />
          <view class="slider-labels">
            <text class="label-text">精确</text>
            <text class="label-text">随机</text>
          </view>
        </view>

        <!-- 工具调用 -->
        <view class="setting-item">
          <text class="setting-label">工具调用</text>
          <view class="tools-container">
            <!-- Google Search -->
            <view class="tool-item">
              <view class="tool-info">
                <text class="tool-name">联网搜索 (Google Search)</text>
                <text class="tool-desc">允许AI访问互联网获取最新信息</text>
              </view>
              <switch 
                :checked="googleSearch" 
                @change="onGoogleSearchChange"
                color="#4895ff"
              />
            </view>
            
            <!-- Code Execution -->
            <view class="tool-item">
              <view class="tool-info">
                <text class="tool-name">代码执行 (Code Execution)</text>
                <text class="tool-desc">允许AI执行代码并返回结果</text>
              </view>
              <switch 
                :checked="codeExecution" 
                @change="onCodeExecutionChange"
                color="#4895ff"
              />
            </view>
            
            <!-- Function Calling -->
            <view class="tool-item">
              <view class="tool-info">
                <text class="tool-name">函数调用 (Function Calling)</text>
                <text class="tool-desc">允许AI调用自定义函数</text>
              </view>
              <switch 
                :checked="functionCalling" 
                @change="onFunctionCallingChange"
                color="#4895ff"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </scroll-view>

    <!-- 模型选择弹窗 -->
    <view v-if="showModelPicker" class="picker-overlay" @click="showModelPicker = false">
      <view class="picker-popup" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择模型</text>
          <view class="picker-close" @click="showModelPicker = false">
            <text class="close-btn">✕</text>
          </view>
        </view>
        <view class="picker-options">
          <view v-for="(option, index) in modelOptions" :key="index" 
            class="picker-option" 
            :class="{ 'picker-option-active': index === modelIndex }"
            @click="selectModel(index)">
            <text class="option-text">{{ option.label }}</text>
            <image v-if="index === modelIndex" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="check-icon-img" mode="aspectFit"></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 文档格式选择弹窗 -->
    <view v-if="showDocFormatPicker" class="picker-overlay" @click="showDocFormatPicker = false">
      <view class="picker-popup" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择文档格式</text>
          <view class="picker-close" @click="showDocFormatPicker = false">
            <text class="close-btn">✕</text>
          </view>
        </view>
        <view class="picker-options">
          <view v-for="(option, index) in docFormatOptions" :key="index" 
            class="picker-option" 
            :class="{ 'picker-option-active': index === docFormatIndex }"
            @click="selectDocFormat(index)">
            <text class="option-text">{{ option.label }}</text>
            <image v-if="index === docFormatIndex" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="check-icon-img" mode="aspectFit"></image>
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
      // 模型选项
      modelOptions: [
        { label: 'XiaoYe-V1', value: 'xiaoye-v1' },
        { label: 'Gemini 3 Pro', value: 'gemini-3-pro' },
        { label: 'GPT-4', value: 'gpt-4' }
      ],
      modelIndex: 0,
      showModelPicker: false,
      
      // 文档格式选项
      docFormatOptions: [
        { label: 'DOCX (Word文档)', value: 'docx' },
        { label: 'PDF (便携式文档)', value: 'pdf' },
        { label: 'Markdown (MD)', value: 'md' },
        { label: 'TXT (纯文本)', value: 'txt' },
        { label: 'HTML (网页)', value: 'html' }
      ],
      docFormatIndex: 0,
      showDocFormatPicker: false,
      
      // 温度/随机性
      temperature: 0.7,
      
      // 系统指令
      systemInstructions: '',
      
      // 工具开关
      googleSearch: true,
      codeExecution: false,
      functionCalling: false
    }
  },
  
  methods: {
    goBack: function() {
      uni.navigateBack()
    },
    
    // 选择模型
    selectModel: function(index) {
      this.modelIndex = index
      this.showModelPicker = false
    },
    
    // 选择文档格式
    selectDocFormat: function(index) {
      this.docFormatIndex = index
      this.showDocFormatPicker = false
    },
    
    onTemperatureChange: function(e) {
      this.temperature = e.detail.value / 100
    },
    
    onGoogleSearchChange: function(e) {
      this.googleSearch = e.detail.value
    },
    
    onCodeExecutionChange: function(e) {
      this.codeExecution = e.detail.value
    },
    
    onFunctionCallingChange: function(e) {
      this.functionCalling = e.detail.value
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-settings-container {
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

.section-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  display: block;
  margin-bottom: 24px;
}

/* 设置项 */
.setting-item {
  margin-bottom: 24px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  display: block;
  margin-bottom: 8px;
}

/* 选择器 */
.picker-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  transition: all 0.2s;
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

/* 滑块 */
.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.slider-value {
  font-size: 16px;
  font-weight: 600;
  color: #4895ff;
}

.slider {
  width: 100%;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.label-text {
  font-size: 13px;
  color: #9ca3af;
}

/* 文本域 */
.textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  line-height: 1.5;
}

.textarea:focus {
  border-color: #4895ff;
}

/* 工具调用容器 */
.tools-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8fafc;
}

.tool-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.tool-item:not(:last-child) {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 12px;
  padding-bottom: 12px;
}

.tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 16px;
}

.tool-name {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}

.tool-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.bottom-spacer {
  height: 20px;
}

/* 自定义选择器弹窗 */
.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.picker-popup {
  width: 100%;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
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

.check-icon-img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-left: 12px;
}
</style>

