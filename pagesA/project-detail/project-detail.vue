<template>
  <view class="project-detail-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">{{ groupName || projectName }}</text>
      <view class="navbar-right" @click="showSettingsMenu = true">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/settings.png" class="settings-icon-img" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 聊天区域 -->
    <scroll-view 
      scroll-y 
      class="chat-area"
      :scroll-into-view="scrollIntoView"
    >
      <view class="messages-container">
        <!-- 遍历消息列表 -->
        <block v-for="(message, index) in messages" :key="message.id">
          <!-- 系统消息 -->
          <view v-if="message.type === 'system'" class="system-message" :id="'msg-' + message.id">
            <text class="system-text">{{ message.content }}</text>
          </view>

          <!-- 当前用户消息 (古德奈特 - 右侧) -->
          <view v-else-if="message.type === 'self'" class="message-item message-right" :id="'msg-' + message.id">
            <view class="message-content message-content-right">
              <view class="message-header-right">
                <text class="message-time">{{ message.time }}</text>
              </view>
              <view class="message-bubble message-bubble-self">
                <text class="message-text">{{ message.content }}</text>
              </view>
            </view>
            <view class="message-avatar">
              <image :src="message.avatar" class="avatar-image" mode="aspectFill"></image>
            </view>
          </view>

          <!-- AI 助手消息 (左侧) -->
          <view v-else-if="message.type === 'ai'" class="message-item message-left" :id="'msg-' + message.id">
            <view class="message-avatar avatar-ai">
              <image :src="message.avatar" class="avatar-image" mode="aspectFit"></image>
            </view>
            <view class="message-content">
              <view class="message-header-left">
                <text class="message-name">{{ message.sender }}</text>
                <view class="ai-badge">
                  <text class="badge-text">AI助手</text>
                </view>
                <text class="message-time">{{ message.time }}</text>
              </view>
              <view class="message-bubble message-bubble-ai">
                <text class="message-text">{{ message.content }}</text>
              </view>
            </view>
          </view>

          <!-- 其他用户消息 (左侧) -->
          <view v-else class="message-item message-left" :id="'msg-' + message.id">
            <view class="message-avatar">
              <image :src="message.avatar" class="avatar-image" mode="aspectFill"></image>
            </view>
            <view class="message-content">
              <view class="message-header-left">
                <text class="message-name">{{ message.sender }}</text>
                <text class="message-time">{{ message.time }}</text>
              </view>
              <view class="message-bubble message-bubble-other">
                <text class="message-text">{{ message.content }}</text>
              </view>
              
              <!-- 文件附件 -->
              <view v-if="message.files && message.files.length > 0" class="message-files">
                <view v-for="(file, fileIndex) in message.files" :key="fileIndex" class="file-attachment">
                  <image v-if="file.icon === 'file'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/doc.png" class="file-icon-img" mode="aspectFit"></image>
                  <image v-else-if="file.icon === 'video'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/mp4.png" class="file-icon-img" mode="aspectFit"></image>
                  <image v-else-if="file.icon === 'image'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/sketch.png" class="file-icon-img" mode="aspectFit"></image>
                  <image v-else-if="file.icon === 'archive'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/file-zip.png" class="file-icon-img" mode="aspectFit"></image>
                  <image v-else-if="file.icon === 'palette'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/sketch.png" class="file-icon-img" mode="aspectFit"></image>
                  <view class="file-details">
                    <text class="file-name">{{ file.name }}</text>
                    <text class="file-size">{{ file.size }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <view class="input-toolbar">
        <view class="toolbar-btn" @click="handleVoice">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/microphone.png" class="toolbar-icon-img" mode="aspectFit"></image>
        </view>
        <input 
          class="message-input" 
          v-model="messageText"
          placeholder="输入消息..."
          confirm-type="send"
          @confirm="sendMessage"
        />
        <view class="toolbar-btn" @click="handleAttachment">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/plus.png" class="toolbar-icon-img" mode="aspectFit"></image>
        </view>
        <view class="send-btn" @click="sendMessage">
          <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/send.png" class="send-icon-img" mode="aspectFit"></image>
        </view>
      </view>
    </view>

    <!-- 设置菜单弹窗 -->
    <view v-if="showSettingsMenu" class="modal-overlay" @click="showSettingsMenu = false">
      <view class="settings-menu" @click.stop>
        <view class="settings-header">
          <view class="settings-info">
            <input v-if="isEditingName" 
              v-model="groupName" 
              class="group-name-input"
              @blur="isEditingName = false"
              @confirm="isEditingName = false"
            />
            <text v-else class="group-name">{{ groupName || projectName }}</text>
            <view class="edit-name-btn" @click="isEditingName = true">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/edit.png" class="edit-icon-img" mode="aspectFit"></image>
            </view>
          </view>
          <text class="group-id">#88291</text>
        </view>

        <view class="members-section">
          <text class="section-label">团队成员</text>
          <view class="members-list">
            <view v-for="(member, index) in projectMembers" :key="index" class="member-row">
              <image :src="member.avatar" class="member-avatar" mode="aspectFill"></image>
              <view class="member-info-wrapper">
                <view class="member-name-row">
                  <view class="member-name-left">
                    <text class="member-name">{{ member.name }}</text>
                    <text v-if="member.role" class="member-role-badge">({{ member.role }})</text>
                  </view>
                  <view class="persona-badge">
                    <text class="persona-text">{{ member.persona }}</text>
                  </view>
                </view>
                <view class="workload-row">
                  <view class="workload-bar-container">
                    <view class="workload-bar-fill" :class="{'workload-high': member.workload > 70, 'workload-medium': member.workload > 40 && member.workload <= 70, 'workload-low': member.workload <= 40}" :style="{width: member.workload + '%'}"></view>
                  </view>
                  <text class="workload-text">{{ getWorkloadLabel(member.workload) }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="settings-actions">
          <view v-if="isLeader" class="action-btn" @click="handleInvite">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/invite.png" class="action-icon-img" mode="aspectFit"></image>
            <text class="action-text">邀请新成员</text>
          </view>
          <view v-if="isLeader" class="action-btn" @click="handleShare">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/share.png" class="action-icon-img" mode="aspectFit"></image>
            <text class="action-text">项目分享</text>
          </view>
          <view class="action-btn" @click="handleTranslation">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/settings.png" class="action-icon-img" mode="aspectFit"></image>
            <text class="action-text">设置 AI 翻译偏好</text>
          </view>
          <view class="action-btn action-btn-danger">
            <text class="action-text action-text-danger">退出项目组</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 邀请新成员弹窗 -->
    <view v-if="showInviteModal" class="modal-overlay" @click="showInviteModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">邀请新成员</text>
          <view class="modal-close" @click="showInviteModal = false">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
          </view>
        </view>
        <text class="modal-desc">选择邀请方式，扩展您的项目团队</text>

        <view class="invite-type-selector">
          <view class="type-btn" 
            :class="{'type-btn-active': inviteType === 'community'}"
            @click="inviteType = 'community'">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/community-alt.png" class="type-icon-img" mode="aspectFit"></image>
            <text class="type-label">社区招募</text>
            <text class="type-desc">发布到社区招募中心</text>
          </view>
          <view class="type-btn"
            :class="{'type-btn-active': inviteType === 'friend'}"
            @click="inviteType = 'friend'">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/invite.png" class="type-icon-img" mode="aspectFit"></image>
            <text class="type-label">好友邀请</text>
            <text class="type-desc">通过邮件或链接邀请</text>
          </view>
        </view>

        <view v-if="inviteType === 'community'" class="invite-form">
          <view class="form-group">
            <text class="form-label">招募需求</text>
            <input class="form-input" placeholder="例如：前端开发工程师"/>
          </view>
          <view class="form-group">
            <text class="form-label">项目描述</text>
            <textarea class="form-textarea" placeholder="简要描述项目需求和工作内容..." rows="3"></textarea>
          </view>
          <button class="submit-btn">发布到招募中心</button>
        </view>

        <view v-if="inviteType === 'friend'" class="invite-form">
          <view class="form-group">
            <text class="form-label">邀请链接</text>
            <view class="link-input-group">
              <input class="form-input form-input-readonly" value="workyeah.com/join/8x7k2m" readonly/>
              <view class="copy-btn" @click="handleCopyLink">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/copy.png" class="copy-icon-img" mode="aspectFit"></image>
                <text class="copy-text">复制</text>
              </view>
            </view>
            <text class="form-hint">链接有效期：7天</text>
          </view>
          <view class="form-group">
            <text class="form-label">通过邮件邀请</text>
            <view class="link-input-group">
              <input class="form-input" placeholder="输入邮箱地址"/>
              <view class="submit-btn submit-btn-small">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/email.png" class="mail-icon-img" mode="aspectFit"></image>
                <text class="btn-text">发送</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 项目分享弹窗 -->
    <view v-if="showShareModal" class="modal-overlay" @click="showShareModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">项目分享</text>
          <view class="modal-close" @click="showShareModal = false">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
          </view>
        </view>
        <text class="modal-desc">分享您的项目给其他用户查看</text>

        <view class="share-methods">
          <view class="share-method" @click="handleCopyShareLink">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/copy.png" class="share-method-icon-img" mode="aspectFit"></image>
            <text class="share-method-text">复制链接</text>
          </view>
          <view class="share-method" @click="handleShowQRCode">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/qrcode.png" class="share-method-icon-img" mode="aspectFit"></image>
            <text class="share-method-text">二维码</text>
          </view>
          <view class="share-method" @click="handleShareEmail">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/email.png" class="share-method-icon-img" mode="aspectFit"></image>
            <text class="share-method-text">邮件分享</text>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">分享链接</text>
          <view class="link-input-group">
            <input class="form-input form-input-readonly" value="https://workyeah.com/projects/p1-智慧养老" readonly/>
            <view class="copy-btn" @click="handleCopyShareLink">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/copy.png" class="copy-icon-img" mode="aspectFit"></image>
              <text class="copy-text">复制</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">访问权限</text>
          <picker mode="selector" :range="permissionOptions" @change="onPermissionChange">
            <view class="picker-input">
              <text>{{ permissionOptions[selectedPermission] }}</text>
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="picker-arrow-img" mode="aspectFit"></image>
            </view>
          </picker>
        </view>

        <view class="community-share-card">
          <view class="community-icon-wrapper">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/share.png" class="community-icon-img" mode="aspectFit"></image>
          </view>
          <view class="community-content">
            <text class="community-title">分享到项目展示</text>
            <text class="community-desc">将项目发布到社区项目展示，让更多人了解您的工作</text>
            <button class="community-btn">发布到社区</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 上传文件弹窗 -->
    <view v-if="showAttachmentModal" class="modal-overlay" @click="showAttachmentModal = false">
      <view class="attachment-modal" @click.stop>
        <view class="attachment-header">
          <text class="attachment-title">添加附件</text>
          <view class="modal-close" @click="showAttachmentModal = false">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="close-icon-img" mode="aspectFit"></image>
          </view>
        </view>
        <view class="attachment-options">
          <view class="attachment-option" @click="chooseImage">
            <view class="option-icon option-icon-image">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/image.png" class="option-icon-img" mode="aspectFit"></image>
            </view>
            <text class="option-label">图片</text>
            <text class="option-desc">从相册选择图片</text>
          </view>
          <view class="attachment-option" @click="chooseFile">
            <view class="option-icon option-icon-file">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/file.png" class="option-icon-img" mode="aspectFit"></image>
            </view>
            <text class="option-label">文件</text>
            <text class="option-desc">选择文档或其他文件</text>
          </view>
          <view class="attachment-option" @click="takePhoto">
            <view class="option-icon option-icon-camera">
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/camera.png" class="option-icon-img" mode="aspectFit"></image>
            </view>
            <text class="option-label">拍照</text>
            <text class="option-desc">使用相机拍摄照片</text>
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
      projectName: '',
      groupName: '',
      messageText: '',
      scrollIntoView: '',
      showSettingsMenu: false,
      showInviteModal: false,
      showShareModal: false,
      isEditingName: false,
      inviteType: 'community',
      selectedPermission: 0,
      permissionOptions: ['仅查看 - 访问者只能查看项目信息', '可评论 - 访问者可以查看和评论', '需要审批 - 访问者需要申请加入'],
      messages: [],
      nextMessageId: 100,
      showAttachmentModal: false
    }
  },
  computed: {
    isLeader: function() {
      // 判断当前用户是否是队长（智慧养老项目的古德奈特）
      return this.projectName === '智慧养老APP'
    },
    
    projectMembers: function() {
      if (this.projectName === '智慧养老APP') {
        return [
          { name: '古德奈特', role: '队长', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg', persona: '专家型', workload: 30 },
          { name: '萧祷', role: '', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', persona: '新手型', workload: 35 },
          { name: '一墨乾行', role: '', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg', persona: '视觉型', workload: 85 }
        ]
      } else if (this.projectName === '辛亥革命论文') {
        return [
          { name: '萧祷', role: '队长', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', persona: '新手型', workload: 65 },
          { name: '古德奈特', role: '', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg', persona: '专家型', workload: 30 },
          { name: '一墨乾行', role: '', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg', persona: '协作型', workload: 55 }
        ]
      } else if (this.projectName === '营销分析报告') {
        return [
          { name: '一墨乾行', role: '队长', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg', persona: '视觉型', workload: 50 },
          { name: '古德奈特', role: '', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg', persona: '专家型', workload: 40 },
          { name: '萧祷', role: '', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', persona: '数据型', workload: 75 }
        ]
      }
      return []
    },
    
    projectInfo: function() {
      // 返回项目工作台信息
      if (this.projectName === '辛亥革命论文') {
        return {
          name: '辛亥革命论文',
          members: [
            { name: '古德奈特', role: '队长', persona: '专家型', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg', workload: 30 },
            { name: '萧祷', role: '成员', persona: '新手型', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', workload: 60 },
            { name: '一墨乾行', role: '成员', persona: '执行型', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg', workload: 50 }
          ],
          files: [
            { name: '课程指南.pdf', size: '1.2 MB', type: 'pdf' },
            { name: '辛亥革命图片集.zip', size: '8.5 MB', type: 'archive' }
          ]
        };
      } else if (this.projectName === '营销分析报告') {
        return {
          name: '营销分析报告',
          members: [
            { name: '萧祷', role: '负责人', persona: '专家型', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', workload: 70 }
          ],
          files: [
            { name: '产品演示视频.mp4', size: '15.8 MB', type: 'video' },
            { name: '市场分析报告.md', size: '128 KB', type: 'markdown' },
            { name: '原始调研数据.zip', size: '4.2 MB', type: 'archive' }
          ]
        };
      } else if (this.projectName === '智慧养老APP') {
        return {
          name: '智慧养老APP',
          members: [
            { name: '古德奈特', role: '队长', persona: '专家型', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg', workload: 40 },
            { name: '萧祷', role: '成员', persona: '新手型', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', workload: 55 },
            { name: '一墨乾行', role: '成员', persona: '执行型', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg', workload: 65 }
          ],
          files: [
            { name: '用户界面模型.sketch', size: '3.8 MB', type: 'sketch' }
          ]
        };
      }
      
      return {
        name: this.projectName,
        members: [],
        files: []
      };
    }
  },
  onLoad: function(options) {
    if (options.id) {
      this.projectId = options.id
    }
    if (options.name) {
      this.projectName = decodeURIComponent(options.name)
      this.groupName = this.projectName + ' 项目组'
    }
    this.loadMessages()
  },
  methods: {
    loadMessages: function() {
      if (this.projectName === '辛亥革命论文') {
        this.messages = [
          { id: 1, sender: '系统', content: '小耶 已创建群组 · 11月5日 14:00', time: '', type: 'system' },
          { id: 2, sender: '萧祷', content: '我整理了一些课程资料，上传到任务文件区了。', time: '下午2:15', type: 'user', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', files: [
            { name: '课程指南.pdf', size: '1.2 MB', icon: 'file' }
          ]},
          { id: 3, sender: '小耶', content: '已解析完成！这是一篇关于辛亥革命的历史论文，要求包括：背景分析、主要事件、历史影响三个部分。我已经为你们生成了初步的工作分解结构，可以在任务树中查看。', time: '下午2:16', type: 'ai', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg' },
          { id: 4, sender: '古德奈特', content: '太好了！那我负责背景部分，萧祷你负责主要事件？', time: '下午2:18', type: 'self', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
          { id: 5, sender: '萧祷', content: '好的，没问题！我开始整理主要事件的时间线。', time: '下午2:20', type: 'user', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg' },
          { id: 6, sender: '系统', content: '11月8日 上午10:00', time: '', type: 'system' },
          { id: 7, sender: '一墨乾行', content: '我找到一些历史资料的图片，已经上传到资产库了，可以用在报告里。', time: '上午10:05', type: 'user', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg', files: [
            { name: '辛亥革命图片集.zip', size: '8.5 MB', icon: 'image' }
          ]},
          { id: 8, sender: '小耶', content: '很好！这些历史图片质量不错，我已经为它们添加了标注和说明，可以直接在报告预览中看到效果。', time: '上午10:06', type: 'ai', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg' }
        ]
      } else if (this.projectName === '营销分析报告') {
        this.messages = [
          { id: 1, sender: '系统', content: '小耶 已创建群组 · 10月15日 10:00', time: '', type: 'system' },
          { id: 2, sender: '萧祷', content: '我整理了一些补充资料，包括产品演示视频、用户画像分析和原始调研数据。这次的KOL投放ROI比预期高30%，私域流量的转化漏斗也优化了。根据A/B测试结果，新版落地页的跳出率明显下降，复购率提升显著。', time: '下午3:45', type: 'user', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', files: [
            { name: '产品演示视频.mp4', size: '15.8 MB', icon: 'video' },
            { name: '市场分析报告.md', size: '128 KB', icon: 'file' },
            { name: '原始调研数据.zip', size: '4.2 MB', icon: 'archive' }
          ]},
          { id: 3, sender: '小耶', content: '已收到萧祷的补充资料！产品演示视频展示了完整的用户体验流程，市场分析报告包含了详细的用户画像和竞品分析，原始调研数据中有2000+份问卷结果。这些资料已同步到资产面板，可以用来支撑我们的营销策略优化。', time: '下午3:48', type: 'ai', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg' }
        ]
      } else if (this.projectName === '智慧养老APP') {
        this.messages = [
          { id: 1, sender: '系统', content: '小耶 已创建群组 · 10月10日 09:00', time: '', type: 'system' },
          { id: 2, sender: '萧祷', content: '我已经更新了用户界面的UX流程模型。新的设计包含了更好的无障碍选项，特别适合老年用户。', time: '上午10:24', type: 'user', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/xd.jpg', files: [
            { name: '用户界面模型.sketch', size: '3.8 MB', icon: 'palette' }
          ]},
          { id: 3, sender: '小耶', content: '已检测到萧祷上传的新文件。正在自动归档模型到资产面板。设计更新符合任务3.2中的无障碍要求。', time: '上午10:25', type: 'ai', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/littleyeah.jpg' },
          { id: 4, sender: '古德奈特', content: '太好了！一墨乾行，你能帮忙实现用户数据存储的功能吗？我们需要保存用户的药物清单和紧急联系人。', time: '上午11:15', type: 'self', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg' },
          { id: 5, sender: '一墨乾行', content: '好的，我会尽快实现这个功能。', time: '上午11:20', type: 'user', avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/ymqx.jpg' }
        ]
      } else {
        this.messages = []
      }
      this.nextMessageId = this.messages.length + 1
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    
    getCurrentTime: function() {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes().toString().padStart(2, '0')
      if (hours < 12) {
        return '上午' + hours + ':' + minutes
      } else if (hours === 12) {
        return '下午12:' + minutes
      } else {
        return '下午' + (hours - 12) + ':' + minutes
      }
    },
    
    scrollToBottom: function() {
      if (this.messages.length > 0) {
        this.scrollIntoView = 'msg-' + this.messages[this.messages.length - 1].id
      }
    },
    
    goBack: function() {
      var self = this
      var pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack({
          delta: 1,
          fail: function() {
            uni.redirectTo({
              url: '/pagesA/project-workspace/project-workspace?id=' + self.projectId + '&name=' + encodeURIComponent(self.projectName)
            })
          }
        })
      } else {
        uni.redirectTo({
          url: '/pagesA/project-workspace/project-workspace?id=' + self.projectId + '&name=' + encodeURIComponent(self.projectName)
        })
      }
    },
    
    handleInvite: function() {
      this.showSettingsMenu = false
      this.showInviteModal = true
    },
    
    handleShare: function() {
      this.showSettingsMenu = false
      this.showShareModal = true
    },
    
    handleTranslation: function() {
      uni.showToast({
        title: 'AI翻译设置',
        icon: 'none'
      })
    },
    
    handleCopyLink: function() {
      uni.setClipboardData({
        data: 'https://workyeah.com/invite/p1-abc123',
        success: function() {
          uni.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
    },
    
    handleCopyShareLink: function() {
      uni.setClipboardData({
        data: 'https://workyeah.com/projects/p1-智慧养老',
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
        title: '二维码功能',
        icon: 'none'
      })
    },
    
    handleShareEmail: function() {
      uni.showToast({
        title: '邮件分享',
        icon: 'none'
      })
    },
    
    onPermissionChange: function(e) {
      this.selectedPermission = e.detail.value
    },
    
    getWorkloadClass: function(workload) {
      if (workload > 70) return 'workload-high'
      if (workload > 40) return 'workload-medium'
      return 'workload-low'
    },
    
    getWorkloadLabel: function(workload) {
      if (workload > 70) return '高'
      if (workload > 40) return '中'
      return '低'
    },
    
    handleVoice: function() {
      uni.showToast({
        title: '语音功能',
        icon: 'none'
      })
    },
    
    handleAttachment: function() {
      this.showAttachmentModal = true
    },
    
    chooseImage: function() {
      var self = this
      this.showAttachmentModal = false
      uni.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: function(res) {
          uni.showToast({
            title: '已选择 ' + res.tempFilePaths.length + ' 张图片',
            icon: 'success'
          })
        }
      })
    },
    
    chooseFile: function() {
      this.showAttachmentModal = false
      uni.showToast({
        title: '选择文件功能',
        icon: 'none'
      })
    },
    
    takePhoto: function() {
      var self = this
      this.showAttachmentModal = false
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: function(res) {
          uni.showToast({
            title: '拍照成功',
            icon: 'success'
          })
        }
      })
    },
    
    sendMessage: function() {
      if (this.messageText.trim()) {
        const newMessage = {
          id: this.nextMessageId++,
          sender: '古德奈特',
          content: this.messageText.trim(),
          time: this.getCurrentTime(),
          type: 'self',
          avatar: 'https://workyean.oss-cn-beijing.aliyuncs.com/static/gdnt.jpg'
        }
        this.messages.push(newMessage)
        this.messageText = ''
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    
    getFileIcon: function(type) {
      return type;
    }
  }
}
</script>

<style lang="scss" scoped>
.project-detail-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

/* 自定义导航栏 */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  height: 48px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
  z-index: 100;
}

.navbar-left,
.navbar-right {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon,
.settings-icon {
  width: 24px;
  height: 24px;
}

.settings-icon-img {
  width: 24px;
  height: 24px;
}

.back-icon-img {
  width: 24px;
  height: 24px;
  color: #0f172a;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

/* 聊天区域 */
.chat-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  box-sizing: border-box;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

/* 系统消息 */
.system-message {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.system-text {
  font-size: 12px;
  color: #94a3b8;
  background-color: #f1f5f9;
  padding: 4px 12px;
  border-radius: 12px;
}

/* 消息项 */
.message-item {
  display: flex;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.message-left {
  flex-direction: row;
  justify-content: flex-start;
}

.message-right {
  flex-direction: row;
  justify-content: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  background-color: #3b82f6;
}

.avatar-ai {
  background-color: #8b5cf6;
}

.avatar-text {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 70%;
  flex-shrink: 1;
  min-width: 0;
}

.message-content-right {
  align-items: flex-end;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.message-header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 4px;
}

.message-name {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}

.message-time {
  font-size: 12px;
  color: #94a3b8;
}

.ai-badge {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge-text {
  font-size: 11px;
  color: #64748b;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 8px;
  max-width: 100%;
  word-break: break-word;
}

.message-bubble-self {
  background-color: #d1e3ff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-bubble-ai {
  background-color: #d1e3ff;
  border: 1px solid #bfdbfe;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-bubble-other {
  background-color: #d1e3ff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-text {
  font-size: 15px;
  line-height: 1.5;
  color: #0f172a;
  word-wrap: break-word;
}

/* 文件附件样式 */
.message-files {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-attachment {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.file-attachment:active {
  background-color: #e2e8f0;
}

.message-files .file-icon {
  width: 40px;
  height: 40px;
}

.message-files .file-icon-img {
  width: 40px;
  height: 40px;
}

.message-files .file-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.message-files .file-name {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-files .file-size {
  font-size: 14px;
  color: #64748b;
}

/* 输入区域 */
.input-area {
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.input-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #f1f5f9;
}

.toolbar-btn:active {
  background-color: #e2e8f0;
}

.toolbar-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.toolbar-icon-img {
  width: 20px;
  height: 20px;
}

.message-input {
  flex: 1;
  height: 44px;
  padding: 0 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  font-size: 15px;
}

.send-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background-color: #336df4;
}

.send-btn:active {
  background-color: #2563eb;
}

.send-icon {
  width: 18px;
  height: 18px;
  color: #ffffff;
}

.send-icon-img {
  width: 18px;
  height: 18px;
}

/* 右侧抽屉 */
.work-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  pointer-events: none;
}

.drawer-open {
  pointer-events: auto;
}

.drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.3s;
}

.drawer-open .drawer-mask {
  background-color: rgba(0, 0, 0, 0.5);
}

.drawer-content {
  position: absolute;
  top: 0;
  right: -75%;
  bottom: 0;
  width: 75%;
  background-color: #ffffff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s;
  display: flex;
  flex-direction: column;
}

.drawer-open .drawer-content {
  right: 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.drawer-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.drawer-body {
  flex: 1;
  padding: 16px;
}

/* 工作区块 */
.work-section {
  margin-bottom: 24px;
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

/* 工作流 */
.workflow-scroll {
  white-space: nowrap;
}

.workflow-container {
  display: inline-flex;
  gap: 12px;
  padding: 4px 0;
}

.workflow-node {
  display: inline-block;
  width: 140px;
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  vertical-align: top;
}

.node-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 4px;
  color: #ffffff;
  margin-bottom: 8px;
}

.node-badge-member {
  background-color: #3b82f6;
}

.node-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
  word-wrap: break-word;
  white-space: normal;
}

.node-assignee,
.node-deadline {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.node-status {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 4px;
  margin-top: 4px;
}

.status-completed {
  background-color: #dcfce7;
  color: #166534;
}

.status-progress {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-pending {
  background-color: #f1f5f9;
  color: #64748b;
}

.status-text {
  font-size: 11px;
}

/* 成员列表 */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 1.5px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.member-avatar .avatar-image {
  width: 100%;
  height: 100%;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.member-name {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}

.member-role {
  font-size: 12px;
  color: #64748b;
}

.workload-bar {
  width: 80px;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}

.workload-fill {
  height: 100%;
  border-radius: 3px;
}

.workload-low {
  background-color: #10b981;
}

.workload-medium {
  background-color: #f59e0b;
}

.workload-high {
  background-color: #ef4444;
}

/* 文件列表 */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.file-item:active {
  background-color: #f1f5f9;
}

.file-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.file-icon-doc {
  color: #2563eb;
}

.file-icon-pdf {
  color: #dc2626;
}

.file-icon-excel {
  color: #16a34a;
}

.file-icon-design {
  color: #f59e0b;
}

.file-icon-video {
  color: #8b5cf6;
}

.file-icon-markdown {
  color: #0891b2;
}

.file-icon-archive {
  color: #64748b;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}

.file-size {
  font-size: 12px;
  color: #64748b;
}

/* 模态框遮罩 */
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
  z-index: 999;
  padding: 20px;
}

/* 设置菜单 */
.settings-menu {
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.settings-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.group-name {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.group-name-input {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 1px solid #cbd5e1;
  padding: 4px 0;
}

.edit-name-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.edit-icon-img {
  width: 16px;
  height: 16px;
}

.group-id {
  font-size: 14px;
  color: #64748b;
}

.members-section {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.section-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 12px;
  display: block;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  flex-shrink: 0;
  border: 1.5px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.member-info-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.member-name-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.member-name {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}

.member-role-badge {
  font-size: 13px;
  color: #64748b;
}

.persona-badge {
  padding: 2px 8px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  flex-shrink: 0;
}

.persona-text {
  font-size: 12px;
  color: #64748b;
}

.workload-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.workload-bar-container {
  flex: 1;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.workload-bar-fill {
  height: 100%;
  border-radius: 3px;
}

.workload-low {
  background-color: #10b981;
}

.workload-medium {
  background-color: #f59e0b;
}

.workload-high {
  background-color: #ef4444;
}

.workload-text {
  font-size: 12px;
  color: #64748b;
  flex-shrink: 0;
  min-width: 20px;
  text-align: right;
}

.settings-actions {
  border-top: 1px solid #e2e8f0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: transparent;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.action-btn:active {
  background-color: #f8fafc;
}

.action-btn-danger {
  color: #dc2626;
}

.action-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.action-icon-img {
  width: 20px;
  height: 20px;
}

.action-text {
  font-size: 15px;
  color: #0f172a;
}

.action-text-danger {
  color: #dc2626;
}

/* 通用模态框 */
.modal-content {
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  background-color: #ffffff;
  border-radius: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  background-color: #ffffff;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.modal-desc {
  padding: 12px 20px;
  font-size: 14px;
  color: #64748b;
  flex-shrink: 0;
  background-color: #f0f4fb;
}

/* 邀请类型选择器 */
.invite-type-selector {
  display: flex;
  gap: 12px;
  padding: 0 20px 16px;
  flex-shrink: 0;
  background-color: #f0f4fb;
}

.type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  background-color: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s;
}

.type-btn-active {
  background-color: #dbe4f5;
  border-color: #8fa3d9;
}

.type-icon {
  width: 28px;
  height: 28px;
  color: #94a3b8;
}

.type-icon-img {
  width: 28px;
  height: 28px;
}

.type-btn-active .type-icon {
  color: #5b7abf;
}

.type-label {
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
}

.type-btn-active .type-label {
  color: #5b7abf;
}

.type-desc {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
}

/* 表单 */
.invite-form {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 20px;
  background-color: #f0f4fb;
  min-height: 0;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 12px;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  box-sizing: border-box;
}

.form-input-readonly {
  background-color: #f8fafc;
  color: #64748b;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  min-height: 80px;
  resize: none;
  box-sizing: border-box;
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.link-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.link-input-group .form-input {
  flex: 1;
  min-width: 0;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  flex-shrink: 0;
}

.copy-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.copy-icon-img {
  width: 16px;
  height: 16px;
}

.copy-text {
  font-size: 14px;
  color: #64748b;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #5b7abf;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  text-align: center;
}

.submit-btn:active {
  opacity: 0.8;
}

.submit-btn-small {
  width: auto;
  padding: 8px 12px;
  background-color: #5b7abf;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 8px;
}

.mail-icon {
  width: 16px;
  height: 16px;
  color: #ffffff;
}

.mail-icon-img {
  width: 16px;
  height: 16px;
}

.btn-text {
  font-size: 14px;
  color: #ffffff;
}

/* 分享方式 */
.share-methods {
  display: flex;
  gap: 12px;
  padding: 0 16px 16px;
  width: 100%;
  box-sizing: border-box;
}

.share-method {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.share-method:active {
  background-color: #f8fafc;
}

.share-method-icon {
  width: 32px;
  height: 32px;
}

.share-method-icon-img {
  width: 32px;
  height: 32px;
}

.share-icon-link {
  color: #3b82f6;
}

.share-icon-qr {
  color: #10b981;
}

.share-icon-mail {
  color: #8b5cf6;
}

.share-method-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.picker-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
}

.picker-arrow {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.picker-arrow-img {
  width: 16px;
  height: 16px;
}

/* 社区分享卡片 */
.community-share-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  margin: 16px 16px 0 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  width: calc(100% - 32px);
  box-sizing: border-box;
}

.community-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4895ff;
  border-radius: 20px;
  flex-shrink: 0;
}

.community-icon {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.community-icon-img {
  width: 20px;
  height: 20px;
}

.community-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.community-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e3a8a;
}

.community-desc {
  font-size: 12px;
  color: #1e40af;
  line-height: 1.4;
}

.community-btn {
  width: 100%;
  padding: 10px 16px;
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  margin-top: 10px;
}

/* 上传附件弹窗 */
.attachment-modal {
  width: 90%;
  max-width: 340px;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

.attachment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.attachment-title {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.attachment-options {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background-color: #f8fafc;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.attachment-option:active {
  background-color: #e2e8f0;
}

.option-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-icon svg {
  width: 28px;
  height: 28px;
  color: #4895ff;
}

.option-icon-img {
  width: 28px;
  height: 28px;
}

.option-label {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}

.option-desc {
  font-size: 12px;
  color: #64748b;
  margin-left: auto;
}
</style>

