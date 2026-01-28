<template>
  <view class="app-container">
    <!-- 顶部导航栏 (仅在协作和任务Tab显示) -->
    <view class="top-navbar" v-if="activeTab === 'collaboration' || activeTab === 'tasks'">
      <image 
        class="navbar-logo"
        src="https://workyean.oss-cn-beijing.aliyuncs.com/static/workyeah.jpg"
        mode="aspectFit"
      />
    </view>

    <!-- 主内容区域 -->
    <view class="main-content">
      <!-- 协作 Tab 内容 -->
      <view v-if="activeTab === 'collaboration'" class="tab-content collaboration-content">
        <scroll-view class="collaboration-scroll" scroll-y>
          <!-- 我的项目区域 -->
          <view class="section-container">
            <view class="section-header">
              <text class="section-title">我的项目</text>
              <text class="section-count">{{ projects.length }}</text>
            </view>
            
            <view class="project-list">
          <view 
            v-for="project in projects" 
            :key="project.id"
            class="project-card"
            @click="openProject(project)"
          >
            <!-- 左侧图标 -->
                <view class="project-icon">
              <text class="project-icon-text">{{ getProjectInitial(project.name) }}</text>
            </view>
            
            <!-- 中间内容 -->
            <view class="project-info">
              <text class="project-name">{{ project.name }}</text>
                  <text class="project-meta">{{ project.lastModified }}</text>
            </view>
            
            <!-- 右侧未读提示 -->
            <view v-if="project.unread" class="unread-badge">
              <text class="unread-text">{{ project.unread > 99 ? '99+' : project.unread }}</text>
            </view>
          </view>
        </view>
      </view>

          <!-- 日历入口 -->
          <view class="section-container">
            <view class="section-header">
              <text class="section-title">日历</text>
        </view>
            
            <view class="calendar-entry-card" @click="goToCalendar">
              <view class="entry-icon-wrapper entry-icon-nobg">
                <image class="entry-icon-img" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/calender.jpg" mode="aspectFit"></image>
              </view>
              <view class="entry-info">
                <text class="entry-title">查看日历</text>
                <text class="entry-desc">管理日程和截止日期</text>
              </view>
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="entry-arrow-img" mode="aspectFit"></image>
            </view>
          </view>
          <view class="scroll-bottom-spacer"></view>
        </scroll-view>
      </view>

      <!-- 任务 Tab 内容 -->
      <view v-if="activeTab === 'tasks'" class="tab-content tasks-content">
        <scroll-view class="tasks-scroll" scroll-y>
          <!-- 我的任务区域 -->
          <view class="section-container">
            <view class="section-header">
              <text class="section-title">我的任务</text>
              <text class="section-count">{{ tasks.length }}</text>
            </view>
            
            <view class="task-list">
              <view 
                v-for="task in tasks" 
                :key="task.id"
                class="task-card"
                @click="openTask(task)"
              >
                <!-- 左侧图标 -->
                <view class="task-icon">
                  <text class="task-icon-text">{{ getTaskInitial(task.title) }}</text>
                </view>
                
                <!-- 中间内容 -->
                <view class="task-info">
                  <text class="task-title">{{ task.title }}</text>
                  <text class="task-meta">{{ task.project }} · {{ task.dueDate }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="scroll-bottom-spacer"></view>
        </scroll-view>
      </view>

      <!-- 社区 Tab 内容 -->
      <view v-if="activeTab === 'community'" class="tab-content community-tab">
        <scroll-view class="community-scroll" scroll-y>
        <!-- 顶部标题 -->
        <view class="community-header">
          <image class="community-icon" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/com.jpg" mode="aspectFit"></image>
          <view class="header-text-group">
          <text class="community-title">社区</text>
          <text class="community-subtitle">发现精彩内容，连接志同道合的伙伴</text>
          </view>
        </view>
        
        <!-- 三个大分类卡片 -->
        <view class="category-cards">
          <!-- 浏览模板 -->
          <view class="category-card" @click="goToTemplates">
            <view class="card-icon-wrapper card-icon-square card-icon-nobg">
              <image class="card-icon-img" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/module.jpg" mode="aspectFit"></image>
            </view>
            <view class="card-content">
              <text class="card-title">浏览模板</text>
              <text class="card-desc">发现优质工作流模板</text>
              <view class="card-stats">
                <text class="stats-text">1000+ 模板</text>
              </view>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="card-arrow-img" mode="aspectFit"></image>
          </view>
          
          <!-- 项目展示 -->
          <view class="category-card" @click="goToShowcase">
            <view class="card-icon-wrapper projects-icon">
              <image class="card-icon-img" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/presentation.jpg" mode="aspectFit" />
            </view>
            <view class="card-content">
              <text class="card-title">项目展示</text>
              <text class="card-desc">分享你的精彩项目</text>
              <view class="card-stats">
                <text class="stats-text">500+ 项目</text>
              </view>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="card-arrow-img" mode="aspectFit"></image>
          </view>
          
          <!-- 招募中心 -->
          <view class="category-card" @click="goToRecruitment">
            <view class="card-icon-wrapper recruitment-icon">
              <image class="card-icon-img" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/recruitment.jpg" mode="aspectFit" />
            </view>
            <view class="card-content">
              <text class="card-title">招募中心</text>
              <text class="card-desc">寻找合作伙伴</text>
              <view class="card-stats">
                <text class="stats-text">200+ 招募</text>
              </view>
            </view>
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/arrow-right.png" class="card-arrow-img" mode="aspectFit"></image>
          </view>
        </view>
        
        <!-- 推荐内容区域 -->
        <view class="recommended-section">
          <text class="section-title">热门推荐</text>
          <view class="recommended-list">
            <view class="recommended-item" v-for="(item, index) in recommendedItems" :key="index">
              <image v-if="item.avatar" :src="item.avatar" class="item-avatar" mode="aspectFill"></image>
              <view v-else class="item-avatar-badge" :style="{ background: item.badgeColor }">
                <text class="item-avatar-text">{{ item.badge }}</text>
              </view>
              <view class="item-info">
                <text class="item-title">{{ item.title }}</text>
                <text class="item-meta">{{ item.author }} · {{ item.time }}</text>
              </view>
              <view class="item-stats">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/like.png" class="stat-icon-img" mode="aspectFit"></image>
                <text class="stat-text">{{ item.likes }}</text>
              </view>
            </view>
          </view>
        </view>
        <!-- 底部占位，防止内容被tabbar遮挡 -->
        <view class="scroll-bottom-spacer"></view>
        </scroll-view>
      </view>
    </view>

    <!-- 自定义底部 TabBar - 5个元素布局 -->
    <view class="custom-tabbar">
      <!-- 左侧两个 Tab -->
      <view class="tab-side tab-left">
        <view 
          class="tab-item"
          :class="{ 'tab-active': activeTab === 'collaboration' }"
          @click="switchTab('collaboration')"
        >
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/remote.png" class="tab-icon-img" mode="aspectFit"></image>
          <text class="tab-label">协作</text>
        </view>

        <view 
          class="tab-item"
          :class="{ 'tab-active': activeTab === 'tasks' }"
          @click="switchTab('tasks')"
        >
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/task.png" class="tab-icon-img" mode="aspectFit"></image>
          <text class="tab-label">任务</text>
        </view>
      </view>

      <!-- 中间头像按钮 -->
      <view class="tab-center" @click="toggleChatWindow">
        <view class="center-avatar">
          <image 
            src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg" 
            class="avatar-image"
            mode="aspectFit"
          ></image>
          <!-- 通知角标 -->
          <view class="avatar-badge">
            <view class="badge-pulse"></view>
            <view class="badge-dot"></view>
          </view>
        </view>
      </view>

      <!-- 右侧两个 Tab -->
      <view class="tab-side tab-right">
        <view 
          class="tab-item"
          :class="{ 'tab-active': activeTab === 'community' }"
          @click="switchTab('community')"
        >
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/community.png" class="tab-icon-img" mode="aspectFit"></image>
          <text class="tab-label">社区</text>
        </view>

        <view 
          class="tab-item"
          :class="{ 'tab-active': activeTab === 'profile' }"
          @click="switchTab('profile')"
        >
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/profile-alt.png" class="tab-icon-img" mode="aspectFit"></image>
          <text class="tab-label">我的</text>
        </view>
      </view>
    </view>

    <!-- AI对话窗口 -->
    <view v-if="showChatWindow" class="chat-window-overlay" @click="closeChatWindow">
      <view class="chat-window" @click.stop>
        <!-- 窗口头部 -->
        <view class="chat-header">
          <view class="header-info">
            <view class="header-row">
              <view v-if="showAgentMap" class="back-btn" @click="toggleAgentMap">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
              </view>
              <view class="status-indicator"></view>
              <text class="header-title">{{ showAgentMap ? '智能体架构' : '小耶Copilot' }}</text>
            </view>
            <text class="header-subtitle">{{ showAgentMap ? '中枢智能体与成员智能体的连接架构' : '基于上下文的智能辅助' }}</text>
          </view>
          <view class="header-right">
            <view v-if="!showAgentMap" class="settings-btn" @click="toggleAgentMap">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/settings.png" class="settings-icon-img" mode="aspectFit"></image>
            </view>
            <view class="close-btn" @click="closeChatWindow">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
            </view>
          </view>
        </view>

        <!-- 智能体架构图 -->
        <scroll-view v-if="showAgentMap" class="agent-map-container animate__animated animate__fadeInUp" scroll-y>
          <view class="agent-map-content">
            <view class="agent-architecture">
              <!-- 中枢智能体 -->
              <view class="central-agent anim-scale-in">
                <view class="central-avatar">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg" mode="aspectFill" class="avatar-img"></image>
                </view>
                <text class="central-name">中枢智能体</text>
                <text class="central-role">WorkYeah AI</text>
              </view>

              <!-- 连接线：倒置三叉戟 -->
              <view class="trident-connector">
                <view class="trident-stem anim-grow-down"></view>
                <view class="trident-node anim-scale-in-delay"></view>
                <view class="trident-bar anim-grow-width"></view>
                <view class="trident-branches">
                  <view class="trident-branch anim-grow-down-delay" v-for="n in 3" :key="n"></view>
                </view>
              </view>

              <!-- 子智能体行 -->
              <view class="sub-agents-row">
                <view class="sub-agent-item anim-fade-up" :style="{ animationDelay: (0.8 + index * 0.15) + 's' }" v-for="(agent, index) in agentNodes" :key="index">
                  <view class="sub-avatar">
                    <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg" mode="aspectFill" class="sub-avatar-img"></image>
                  </view>
                  <text class="sub-label">子智能体</text>
                  <view class="dashed-line"></view>
                  <!-- 成员智能体 -->
                  <view class="member-agent" @click="toggleAgentDetail(agent.id)">
                    <view class="member-avatar">
                      <image :src="agent.avatar" mode="aspectFill" class="member-avatar-img"></image>
                    </view>
                    <text class="member-name">{{ agent.name }}</text>
                    <text v-if="agent.role" class="member-role">({{ agent.role }})</text>
                  </view>
                  <!-- 详情弹窗 -->
                  <view v-if="selectedAgentId === agent.id" class="agent-detail-card">
                    <view class="detail-header">
                      <text class="detail-persona">{{ agent.persona }}</text>
                      <view class="detail-tag">
                        <text class="tag-text">{{ agent.expertise[0] }}</text>
                      </view>
                    </view>
                    <view class="detail-item">
                      <text class="detail-label">沟通风格：</text>
                      <text class="detail-value">{{ agent.tone }}</text>
                    </view>
                    <view class="detail-item">
                      <text class="detail-label">工作模式：</text>
                      <text class="detail-value">{{ agent.workPattern }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 聊天消息区域 -->
        <scroll-view v-else class="chat-messages animate__animated animate__fadeInUp" scroll-y :scroll-top="scrollTop" scroll-with-animation>
          <!-- AI欢迎消息 -->
          <view class="message-item message-left">
            <image 
              class="message-avatar"
              src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg"
              mode="aspectFill"
            />
            <view class="message-content">
              <view class="message-bubble ai-bubble">
                <text class="message-text">检测到队长上传了《近代史大作业.pdf》。我已为你提取了其中的评分标准，是否需要查看？</text>
              </view>
              
              <!-- 快捷操作按钮 -->
              <view class="quick-actions">
                <view class="quick-btn" @click="handleQuickAction('查看评分标准')">
                  <text class="quick-btn-text">查看评分标准</text>
                </view>
                <view class="quick-btn" @click="handleQuickAction('生成任务清单')">
                  <text class="quick-btn-text">生成任务清单</text>
                </view>
                <view class="quick-btn quick-btn-highlight" @click="handleQuickAction('个性化任务引导')">
                  <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="quick-icon-img" mode="aspectFit"></image>
                  <text class="quick-btn-text">个性化任务引导</text>
                </view>
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
            <image 
              v-if="message.sender === 'ai'" 
              class="message-avatar"
              src="https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg"
              mode="aspectFill"
            />
            
            <view class="message-content">
              <!-- 个性化任务引导卡片 -->
              <view v-if="message.type === 'personalized-guide'" class="personalized-guide-card">
                <view class="guide-header">
                  <image class="guide-user-avatar" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg" mode="aspectFill"></image>
                  <view class="guide-header-text">
                    <text class="guide-title">专为你定制的任务引导</text>
                    <text class="guide-subtitle">基于 古德奈特 的 专家型 风格适配</text>
                  </view>
                  <image class="guide-star-icon" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/AIqd.png" mode="aspectFit"></image>
                </view>
                
                <view class="guide-style-box">
                  <text class="guide-style-title">你的工作风格特征</text>
                  <view class="guide-style-grid">
                    <view class="guide-style-item">
                      <text class="guide-style-dot">•</text>
                      <text class="guide-style-text"><text class="guide-bold">沟通风格：</text>专业、高效、目标导向</text>
                    </view>
                    <view class="guide-style-item">
                      <text class="guide-style-dot">•</text>
                      <text class="guide-style-text"><text class="guide-bold">工作特点：</text>注重规划和执行，善于分配任务</text>
                    </view>
                  </view>
                </view>
                
                <view class="guide-section-title">
                  <view class="guide-section-bar"></view>
                  <text class="guide-section-text">为你量身定制的任务执行方案</text>
                </view>
                
                <view class="guide-steps">
                  <view class="guide-step-item">
                    <view class="guide-step-number">1</view>
                    <view class="guide-step-content">
                      <view class="guide-step-header">
                        <text class="guide-step-title">制定清晰的项目框架</text>
                        <text class="guide-step-tag">符合你的规划导向</text>
                      </view>
                      <text class="guide-step-desc">作为队长，建议先搭建整体框架：明确各部分的逻辑关系、时间节点和质量标准。</text>
                      <view class="guide-step-tip">
                        <image class="guide-tip-icon" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/AIqd.png" mode="aspectFit"></image>
                        <text class="guide-tip-text"><text class="guide-bold">专业建议：</text>花30分钟制作思维导图或甘特图</text>
                      </view>
                    </view>
                  </view>
                  
                  <view class="guide-step-item">
                    <view class="guide-step-number">2</view>
                    <view class="guide-step-content">
                      <view class="guide-step-header">
                        <text class="guide-step-title">高效收集与整合资料</text>
                        <text class="guide-step-tag">提升执行效率</text>
                      </view>
                      <text class="guide-step-desc">采用"快速扫描+精读重点"的方式，先用20分钟浏览参考资料，标记核心内容。</text>
                      <view class="guide-step-tip">
                        <image class="guide-tip-icon" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/AIqd.png" mode="aspectFit"></image>
                        <text class="guide-tip-text"><text class="guide-bold">效率技巧：</text>使用Notion建立资料库，方便快速调用</text>
                      </view>
                    </view>
                  </view>
                  
                  <view class="guide-step-item">
                    <view class="guide-step-number">3</view>
                    <view class="guide-step-content">
                      <view class="guide-step-header">
                        <text class="guide-step-title">分阶段输出与团队协调</text>
                        <text class="guide-step-tag">发挥协调优势</text>
                      </view>
                      <text class="guide-step-desc">建议采用"初稿-互审-定稿"三阶段模式，让团队成员互相review。</text>
                      <view class="guide-step-tip">
                        <image class="guide-tip-icon" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/AIqd.png" mode="aspectFit"></image>
                        <text class="guide-tip-text"><text class="guide-bold">协作建议：</text>设置明天下午3点为初稿截止时间</text>
                      </view>
                    </view>
                  </view>
                </view>
                
                <view class="guide-result-box">
                  <text class="guide-result-title">按此方案执行的预期成果</text>
                  <view class="guide-result-grid">
                    <view class="guide-result-item">
                      <text class="guide-result-value">8小时</text>
                      <text class="guide-result-label">预计总耗时</text>
                    </view>
                    <view class="guide-result-item">
                      <text class="guide-result-value">优秀</text>
                      <text class="guide-result-label">预期质量</text>
                    </view>
                    <view class="guide-result-item">
                      <text class="guide-result-value">100%</text>
                      <text class="guide-result-label">团队协同度</text>
                    </view>
                  </view>
                </view>
                
                <view class="guide-actions">
                  <view class="guide-action-btn guide-action-primary">
                    <text class="guide-action-text-white">立即开始执行</text>
                  </view>
                  <view class="guide-action-btn guide-action-secondary">
                    <text class="guide-action-text">调整方案</text>
                  </view>
                </view>
              </view>
              
              <!-- 普通消息气泡 -->
              <view v-else
                class="message-bubble"
                :class="message.sender === 'user' ? 'user-bubble' : 'ai-bubble'"
              >
                <text class="message-text">{{ message.content }}</text>
              </view>
            </view>

            <image 
              v-if="message.sender === 'user'" 
              class="message-avatar"
              src="https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg"
              mode="aspectFill"
            />
          </view>

          <!-- AI正在输入 -->
          <view v-if="isAITyping" class="message-item message-left">
            <image 
              class="message-avatar"
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
        </scroll-view>

        <!-- 底部输入区域 -->
        <view v-if="!showAgentMap" class="chat-input-area">
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
    </view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      activeTab: 'collaboration',
      showChatWindow: false,
      showAgentMap: false,
      selectedAgentId: null,
      inputValue: '',
      messages: [],
      isAITyping: false,
      scrollTop: 0,
      agentNodes: [
        {
          id: 'gdnt',
          name: '古德奈特',
          role: '队长',
          avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg',
          color: '#059669',
          persona: '专家型',
          tone: '专业、高效、目标导向',
          expertise: ['项目管理', '需求分析', '团队协调'],
          workPattern: '注重规划和执行，善于分配任务和把控进度'
        },
        {
          id: 'xd',
          name: '萧祷',
          avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg',
          color: '#2563eb',
          persona: '新手型',
          tone: '谨慎、求教、细致',
          expertise: ['文档编写', '资料整理', '细节完善'],
          workPattern: '善于学习和请教，工作细致但需要指导'
        },
        {
          id: 'ymqx',
          name: '一墨乾行',
          avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg',
          color: '#9333ea',
          persona: '视觉型',
          tone: '创意、直观、注重美感',
          expertise: ['视觉设计', '图表制作', '界面优化'],
          workPattern: '擅长将信息可视化，注重用户体验'
        }
      ],
      projects: [
        {
          id: 'p1',
          name: '智慧养老APP',
          type: 'IT开发',
          lastModified: '12/26 14:30',
          unread: 3
        },
        {
          id: 'p2',
          name: '辛亥革命论文',
          type: '人文报告',
          lastModified: '12/25 10:15',
          unread: 0
        },
        {
          id: 'p3',
          name: '营销分析报告',
          type: '商业分析',
          lastModified: '12/24 16:20',
          unread: 5
        }
      ],
      recommendedItems: [
        {
          badge: '模板',
          badgeColor: '#4895ff',
          title: 'AI驱动的软件开发流程',
          author: '@WorkYeah官方',
          avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/AIqd.png',
          time: '2小时前',
          likes: 128
        },
        {
          badge: '项目',
          badgeColor: '#336df4',
          title: '智能客服系统完整解决方案',
          author: '@天津大学',
          avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/tju.png',
          time: '5小时前',
          likes: 96
        },
        {
          badge: '招募',
          badgeColor: '#4895ff',
          title: '寻找全栈工程师合作开发',
          author: '@创业者',
          avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gcs.png',
          time: '1天前',
          likes: 64
        }
      ],
      tasks: [
        {
          id: 't1',
          title: '需求分析文档',
          project: '智慧养老APP',
          dueDate: '12/28',
          messageCount: 2
        },
        {
          id: 't2',
          title: '数据库设计',
          project: '智慧养老APP',
          dueDate: '12/30',
          messageCount: 0
        },
        {
          id: 't3',
          title: '资料收集',
          project: '辛亥革命论文',
          dueDate: '01/05',
          messageCount: 1
        },
        {
          id: 't4',
          title: '市场调研报告',
          project: '营销分析报告',
          dueDate: '01/08',
          messageCount: 3
        }
      ]
    }
  },
  onLoad: function() {
    // 检查登录状态
    var isLoggedIn = uni.getStorageSync('isLoggedIn')
    if (!isLoggedIn) {
      uni.redirectTo({
        url: '/pages/login/login'
      })
    }
    
    // 监听来自工作台的tab切换事件
    uni.$on('switchTab', (tab) => {
        this.activeTab = tab
    })
  },
  
  onShow: function() {
    // 检查是否需要切换到特定 tab
    var switchToTab = uni.getStorageSync('switchToTab')
    if (switchToTab) {
      this.activeTab = switchToTab
      uni.removeStorageSync('switchToTab')
    }
  },
  
  onUnload: function() {
    // 移除事件监听
    uni.$off('switchTab')
  },
		methods: {
    switchTab: function(tab) {
      // 我的Tab跳转到独立页面
      if (tab === 'profile') {
        uni.switchTab({
          url: '/pages/profile/profile'
        })
        return
      }
      
      // 其他Tab直接切换
      this.activeTab = tab
    },
    
    getProjectColor: function(type) {
      // 统一使用品牌蓝色，与web端一致
      return '#336df4'
    },
    
    getProjectInitial: function(name) {
      // 返回项目名称的前2个字符，与web端一致
      return name.slice(0, 2)
    },
    
    getTaskInitial: function(title) {
      // 返回任务标题的前2个字符
      return title.slice(0, 2)
    },
    
    openProject: function(project) {
      uni.navigateTo({
        url: '/pagesA/project-workspace/project-workspace?id=' + project.id + '&name=' + encodeURIComponent(project.name)
      })
    },
    
    openTask: function(task) {
      uni.navigateTo({
        url: '/pagesB/task-detail/task-detail?id=' + task.id + '&title=' + encodeURIComponent(task.title)
      })
    },
    
    goToCalendar: function() {
      uni.navigateTo({
        url: '/pagesC/calendar/calendar'
      })
    },
    
    handleCenterClick: function() {
      uni.navigateTo({
        url: '/pagesC/ai-chat/ai-chat'
      })
    },
    
    // 社区相关导航
    goToTemplates: function() {
      uni.navigateTo({
        url: '/pagesC/marketplace/marketplace'
      })
    },
    
    goToShowcase: function() {
      uni.navigateTo({
        url: '/pagesA/projects-showcase/projects-showcase'
      })
    },
    
    goToRecruitment: function() {
      uni.navigateTo({
        url: '/pagesC/recruitment/recruitment'
      })
    },
    
    // AI对话窗口相关方法
    toggleChatWindow: function() {
      this.showChatWindow = !this.showChatWindow
      if (this.showChatWindow) {
        this.showAgentMap = false
      }
    },
    
    closeChatWindow: function() {
      this.showChatWindow = false
      this.showAgentMap = false
    },
    
    toggleAgentMap: function() {
      this.showAgentMap = !this.showAgentMap
      this.selectedAgentId = null
    },
    
    toggleAgentDetail: function(agentId) {
      if (this.selectedAgentId === agentId) {
        this.selectedAgentId = null
      } else {
        this.selectedAgentId = agentId
      }
    },
    
    sendMessage: function() {
      var self = this
      if (!this.inputValue.trim()) {
        return
      }
      
      // 添加用户消息
      this.messages.push({
        sender: 'user',
        content: this.inputValue
      })
      
      var userInput = this.inputValue
      this.inputValue = ''
      this.scrollToBottom()
      
      // 模拟AI回复
      this.isAITyping = true
      setTimeout(function() {
        self.isAITyping = false
        var response = self.getAIResponse(userInput)
        if (typeof response === 'object' && response.type) {
          self.messages.push({
            sender: 'ai',
            type: response.type,
            content: response.content || ''
          })
        } else {
          self.messages.push({
            sender: 'ai',
            content: response
          })
        }
        self.scrollToBottom()
      }, 2000)
    },
    
    getAIResponse: function(userInput) {
      if (userInput === '个性化任务引导' || userInput.indexOf('个性化') !== -1) {
        return { type: 'personalized-guide', content: '' }
      }
      
      var responses = {
        '查看评分标准': '【近代史大作业评分标准】\n\n[基础分] 60分\n• 内容完整性 20分\n• 论点清晰度 20分\n• 论据充分性 20分\n\n[加分项] 40分\n• 文献引用规范 10分\n• 创新观点 15分\n• 排版格式 10分\n• 图表运用 5分\n\n[扣分项]\n• 抄袭：直接0分\n• 晚交：每天-5分\n• 格式不规范：-5~10分',
        '生成任务清单': '【近代史大作业任务清单】\n\n已为你生成以下任务：\n\n[1] 资料收集阶段（3天）\n   • 查阅核心文献\n   • 整理史料来源\n\n[2] 大纲撰写阶段（2天）\n   • 确定论文结构\n   • 梳理论点逻辑\n\n[3] 初稿撰写阶段（5天）\n   • 完成各章节内容\n   • 添加文献引用\n\n[4] 修改完善阶段（2天）\n   • 检查论述逻辑\n   • 优化语言表达\n\n任务已同步到项目工作台',
        '评分': '评分标准包括：1. 项目完成度 2. 代码质量 3. 文档完整性 4. 创新性 5. 实用性。每项满分20分，总分100分。',
        '任务': '已为你生成任务清单：\n1. 完成用户登录模块\n2. 实现健康数据监测功能\n3. 开发老人社区功能\n4. 进行UI优化\n\n任务已同步到项目工作台。',
        '引导': '基于你的项目类型，建议按以下步骤进行：\n1. 明确项目目标和范围\n2. 分解核心功能模块\n3. 制定开发时间线\n4. 设置阶段性检查点\n\n我会全程协助你完成每个步骤。',
        'default': '我理解你的问题。基于当前项目上下文，我建议你可以先查看项目工作台的任务分解，或者让我帮你分析具体的问题。'
      }
      
      if (responses[userInput]) {
        return responses[userInput]
      }
      
      for (var key in responses) {
        if (key !== 'default' && userInput.indexOf(key) !== -1) {
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
          
          // 模拟AI分析图片
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
page {
  --status-bar-height: 20px;
}

.app-container {
  width: 100%;
  height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.top-navbar {
  width: 100%;
  padding-top: calc(var(--status-bar-height) + 8px);
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  z-index: 1000;
}

.navbar-logo {
  height: 50px;
  width: 240px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.tab-content {
  width: 100%;
  height: 100%;
}

.collaboration-tab {
  display: flex;
  flex-direction: column;
}

/* 协作内容区域 */
.collaboration-content {
  height: 100%;
  background-color: #f8fafc;
}

.collaboration-scroll {
  height: 100%;
  width: 100%;
}

/* 任务内容区域 */
.tasks-content {
  height: 100%;
  background-color: #f8fafc;
}

.tasks-scroll {
  height: 100%;
  width: 100%;
}

/* 区块容器 */
.section-container {
  padding: 16px;
  margin-bottom: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.section-count {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  background-color: #e2e8f0;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 项目列表样式 */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 日历入口卡片 */
.calendar-entry-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.calendar-entry-card:active {
  background-color: #e0e6f7;
  transform: scale(0.98);
}

.entry-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #e0e6f7;
  display: flex;
  align-items: center;
	justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.entry-icon-wrapper.entry-icon-nobg {
  background-color: transparent;
}

.entry-icon-img {
  width: 48px;
  height: 48px;
}

.entry-icon {
  width: 24px;
  height: 24px;
  color: #4895ff;
}

.entry-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.entry-title {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.entry-desc {
  font-size: 14px;
  color: #64748b;
}

.entry-arrow {
  width: 18px;
  height: 18px;
  color: #94a3b8;
  flex-shrink: 0;
}

.entry-arrow-img {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 任务列表样式 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.task-card:active {
  background-color: #e0e6f7;
  transform: scale(0.98);
}

.task-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #336df4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.task-icon-text {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.task-title {
  font-size: 17px;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-meta {
  font-size: 13px;
  color: #64748b;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.placeholder-text {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.placeholder-desc {
  font-size: 14px;
  color: #64748b;
}

/* Profile Tab 样式 */
/* 项目列表 */
.projects-list {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
}

.project-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.project-card:active {
  background-color: #e0e6f7;
  transform: scale(0.98);
}

.project-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #336df4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.project-icon-text {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.project-name {
  font-size: 17px;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-meta {
  font-size: 13px;
  color: #64748b;
}

.unread-badge {
  width: 20px;
  height: 20px;
  background-color: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.unread-text {
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
}

/* 自定义底部 TabBar */
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  z-index: 999;
}

/* 左侧和右侧 Tab 容器 - 调整为3个tab布局 */
.tab-side {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.tab-left {
  padding-right: 16px;
}

.tab-right {
  padding-left: 16px;
  display: flex;
  gap: 8px;
}

/* Tab 项 */
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  min-width: 60px;
}

.tab-icon {
  width: 24px;
  height: 24px;
  color: #94a3b8;
  transition: all 0.3s;
}

.tab-icon-img {
  width: 24px;
  height: 24px;
}

.tab-active .tab-icon {
  color: #4895ff;
}

.tab-label {
  font-size: 12px;
  color: #94a3b8;
  transition: all 0.3s;
}

.tab-active .tab-label {
  color: #4895ff;
  font-weight: 500;
}

/* Tab激活状态背景色 */
.tab-active {
  background-color: #e0e6f7;
  border-radius: 8px;
}

/* 中间头像按钮 */
.tab-center {
  position: relative;
  width: 72px;
  height: 72px;
  margin: 0 12px;
}

.center-avatar {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid #ffffff;
}

.center-avatar:active {
  transform: translateX(-50%) scale(0.95);
  transition: transform 0.2s;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 社区Tab样式 */
.community-tab {
  padding: 0;
  height: 100%;
}

.community-scroll {
  height: 100%;
  width: 100%;
}

.scroll-bottom-spacer {
  height: 100px;
}

.community-header {
  padding-top: calc(var(--status-bar-height) + 8px);
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  border-bottom: 1px solid #e2e8f0;
}

.header-text-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.community-icon {
  position: absolute;
  right: 16px;
  width: 96px;
  height: 96px;
  flex-shrink: 0;
}

.community-title {
  font-size: 20px;
  font-weight: 700;
  color: #f56843;
  text-align: center;
}

.community-subtitle {
  font-size: 12px;
  color: #f56843;
  opacity: 0.8;
  text-align: center;
}

/* 分类卡片区域 */
.category-cards {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.category-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-square {
  border-radius: 8px;
  overflow: hidden;
}

.card-icon-nobg {
  background-color: transparent;
}

.card-icon-img {
  width: 100%;
  height: 100%;
}

.templates-icon {
  background-color: #4895ff;
}

.projects-icon {
}

.recruitment-icon {
}

.card-icon {
  width: 28px;
  height: 28px;
  color: #ffffff;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.card-desc {
  font-size: 13px;
  color: #64748b;
}

.card-stats {
  margin-top: 4px;
}

.stats-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.card-arrow {
  width: 20px;
  height: 20px;
  color: #cbd5e1;
  flex-shrink: 0;
}

.card-arrow-img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* 推荐内容区域 */
.recommended-section {
  padding: 0 16px 16px;
}

.recommended-section .section-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  display: block;
  margin-bottom: 12px;
  padding-left: 0;
  border-left: none;
  background: none;
}

.recommended-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recommended-item {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.recommended-item:active {
  background-color: #f8fafc;
}

.item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  flex-shrink: 0;
}

.item-avatar-badge {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-avatar-text {
  font-size: 11px;
  color: #ffffff;
  font-weight: 600;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  font-size: 12px;
  color: #94a3b8;
}

.item-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #f43f5e;
}

.stat-icon-img {
  width: 16px;
  height: 16px;
}

.stat-text {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.badge-pulse {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #ef4444;
  animation: pulse 2s infinite;
  opacity: 0.75;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.75;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.badge-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #dc2626;
}

/* AI对话窗口遮罩层 */
.chat-window-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: stretch;
}

/* AI对话窗口 */
.chat-window {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 窗口头部 */
.chat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  padding-top: calc(var(--status-bar-height) + 16px);
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
  flex-shrink: 0;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-left: 20px;
}

.back-btn,
.settings-btn,
.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f1f5f9;
}

.back-btn:active,
.settings-btn:active {
  background-color: #f1f5f9;
}

.close-btn:active {
  background-color: #e2e8f0;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.back-icon-img {
  width: 20px;
  height: 20px;
}

.settings-icon {
  width: 22px;
  height: 22px;
  color: #64748b;
}

.settings-icon-img {
  width: 22px;
  height: 22px;
}

.close-icon {
  width: 22px;
  height: 22px;
  color: #475569;
}

.close-icon-img {
  width: 22px;
  height: 22px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #4895ff;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 智能体架构图容器 */
.agent-map-container {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
  overflow-y: auto;
}

.agent-map-content {
  padding: 20px 16px;
}

.agent-architecture {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.central-agent {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}

.central-avatar {
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background: linear-gradient(135deg, #4895ff 0%, #336df4 100%);
  box-shadow: 0 8px 24px rgba(72, 149, 255, 0.4);
  overflow: hidden;
  border: 3px solid #ffffff;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.central-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 10px;
}

.central-role {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

/* 倒置三叉戟连接线 */
.trident-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.trident-stem {
  width: 2px;
  height: 50px;
  background-color: #4895ff;
}

.trident-node {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4895ff;
  margin: -1px 0;
  z-index: 2;
}

.trident-bar {
  width: calc(100% - 40px);
  max-width: 280px;
  height: 2px;
  background-color: #4895ff;
  margin-top: -5px;
}

.trident-branches {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 40px);
  max-width: 280px;
  margin-top: -1px;
  padding: 0 22px;
  box-sizing: border-box;
}

.trident-branch {
  width: 2px;
  height: 30px;
  background-color: #4895ff;
}

.sub-agents-row {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 40px);
  max-width: 280px;
  box-sizing: border-box;
}

.sub-agent-item {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.sub-avatar {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(135deg, #60a5fa 0%, #4895ff 100%);
  box-shadow: 0 4px 12px rgba(72, 149, 255, 0.3);
  overflow: hidden;
  border: 2px solid #ffffff;
}

.sub-avatar-img {
  width: 100%;
  height: 100%;
}

.sub-label {
  font-size: 11px;
  color: #64748b;
  margin-top: 6px;
}

.dashed-line {
  width: 2px;
  height: 50px;
  background-image: repeating-linear-gradient(
    180deg,
    #60a5fa 0px,
    #60a5fa 5px,
    transparent 5px,
    transparent 10px
  );
  margin: 8px 0;
}

.member-agent {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.member-avatar {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  overflow: hidden;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.member-avatar-img {
  width: 100%;
  height: 100%;
}

.member-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin-top: 8px;
}

.member-role {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.agent-detail-card {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-top: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 2px solid #e0e7ff;
  z-index: 10;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 8px;
}

.detail-persona {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.detail-tag {
  background-color: #e0e7ff;
  padding: 3px 8px;
  border-radius: 10px;
}

.tag-text {
  font-size: 10px;
  color: #4895ff;
  font-weight: 500;
}

.detail-item {
  margin-bottom: 6px;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
}

.detail-value {
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  background-color: #f8fafc;
  padding: 16px;
  overflow-y: auto;
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
  font-size: 14px;
  line-height: 1.6;
  color: #0f172a;
  white-space: pre-wrap;
  word-break: break-word;
}

.user-bubble .message-text {
  color: #ffffff;
}

/* 个性化任务引导卡片 */
.personalized-guide-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 320px;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 12px;
}

.guide-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 2px solid #4895ff;
}

.guide-header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.guide-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.guide-subtitle {
  font-size: 11px;
  color: #64748b;
}

.guide-star-icon {
  width: 24px;
  height: 24px;
}

.guide-style-box {
  background-color: #e4edfc;
  border: 1px solid #4895ff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
}

.guide-style-title {
  font-size: 11px;
  font-weight: 600;
  color: #4895ff;
  display: block;
  margin-bottom: 8px;
}

.guide-style-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.guide-style-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.guide-style-dot {
  color: #4895ff;
  font-size: 12px;
  line-height: 1.4;
}

.guide-style-text {
  font-size: 11px;
  color: #475569;
  line-height: 1.4;
}

.guide-bold {
  font-weight: 600;
}

.guide-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.guide-section-bar {
  width: 3px;
  height: 14px;
  background-color: #4895ff;
  border-radius: 2px;
}

.guide-section-text {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.guide-step-item {
  display: flex;
  gap: 10px;
  background-color: #ffffff;
  border: 1px solid #4895ff;
  border-radius: 8px;
  padding: 10px;
}

.guide-step-number {
  width: 22px;
  height: 22px;
  background-color: #4895ff;
  color: #ffffff;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.guide-step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.guide-step-header {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.guide-step-title {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

.guide-step-tag {
  font-size: 10px;
  color: #4895ff;
}

.guide-step-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
}

.guide-step-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background-color: #e4edfc;
  padding: 8px;
  border-radius: 6px;
}

.guide-tip-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.guide-tip-text {
  font-size: 10px;
  color: #475569;
  line-height: 1.4;
}

.guide-result-box {
  background-color: #e4edfc;
  border: 1px solid #4895ff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
}

.guide-result-title {
  font-size: 11px;
  font-weight: 600;
  color: #4895ff;
  display: block;
  margin-bottom: 8px;
}

.guide-result-grid {
  display: flex;
  gap: 8px;
}

.guide-result-item {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  background-color: #ffffff;
  border: 1px solid #4895ff;
  border-radius: 6px;
}

.guide-result-value {
  font-size: 14px;
  font-weight: 700;
  color: #4895ff;
  display: block;
}

.guide-result-label {
  font-size: 10px;
  color: #64748b;
}

.guide-actions {
  display: flex;
  gap: 8px;
}

.guide-action-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-action-primary {
  background-color: #4895ff;
}

.guide-action-secondary {
  background-color: #e4edfc;
}

.guide-action-text-white {
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
}

.guide-action-text {
  font-size: 12px;
  font-weight: 500;
  color: #4895ff;
}

/* 正在输入动画 */
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

/* 快捷操作按钮 */
.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-btn {
  padding: 8px 16px;
  background-color: #e4edfc;
  border-radius: 20px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.quick-btn:active {
  background-color: #cbd9f5;
}

.quick-btn-highlight {
  background-color: #e0e6f7;
  border: 1px solid #4895ff;
}

.quick-btn-highlight:active {
  opacity: 0.8;
}

.quick-icon {
  width: 12px;
  height: 12px;
  color: #4895ff;
  flex-shrink: 0;
}

.quick-icon-img {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.quick-btn-text {
  font-size: 13px;
  color: #4895ff;
  font-weight: 500;
}

/* 底部输入区域 */
.chat-input-area {
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 12px;
  flex-shrink: 0;
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
  flex-shrink: 0;
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
  flex-shrink: 0;
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

/* Animate.css fadeInUp 动画 */
.animate__animated {
  animation-duration: 0.4s;
  animation-fill-mode: both;
}

.animate__fadeInUp {
  animation-name: fadeInUp;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* 智能体架构图动画 */
.anim-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.anim-grow-down {
  animation: growDown 0.4s ease-out 0.3s forwards;
  transform-origin: top;
  transform: scaleY(0);
}

@keyframes growDown {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.anim-scale-in-delay {
  animation: scaleInSmall 0.2s ease-out 0.5s forwards;
  opacity: 0;
  transform: scale(0);
}

@keyframes scaleInSmall {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.anim-grow-width {
  animation: growWidth 0.4s ease-out 0.5s forwards;
  transform-origin: center;
  transform: scaleX(0);
}

@keyframes growWidth {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.anim-grow-down-delay {
  animation: growDown 0.3s ease-out forwards;
  transform-origin: top;
  transform: scaleY(0);
  animation-delay: 0.7s;
}

.anim-fade-up {
  animation: fadeUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
