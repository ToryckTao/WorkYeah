<template>
  <view class="subscription-container">
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/back.png" class="back-icon-img" mode="aspectFit"></image>
      </view>
      <text class="navbar-title">订阅计划</text>
      <view class="navbar-right"></view>
    </view>

    <scroll-view class="content-area" scroll-y>
      <view class="hero-section">
        <view class="hero-glow"></view>
        <text class="hero-title">解锁无限可能</text>
        <text class="hero-subtitle">选择适合您的计划，让 AI 为您的协作赋能</text>
        
        <view class="billing-toggle">
          <text class="toggle-label" :class="{ active: !isYearly }">月付</text>
          <view class="toggle-switch" @click="toggleBilling">
            <view class="toggle-track" :class="{ yearly: isYearly }">
              <view class="toggle-thumb"></view>
            </view>
          </view>
          <view class="toggle-yearly-wrapper">
            <text class="toggle-label" :class="{ active: isYearly }">年付</text>
            <view class="save-badge">省20%</view>
          </view>
        </view>
      </view>

      <view class="plans-container">
        <view 
          v-for="(plan, index) in plans" 
          :key="index"
          class="plan-card"
          :class="{ 
            'highlight': plan.highlight,
            'current': plan.name === currentPlan 
          }"
        >
          <view v-if="plan.highlight" class="popular-tag">
            <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/star.png" class="tag-icon-img" mode="aspectFit"></image>
            <text class="tag-text">最受欢迎</text>
          </view>

          <view v-if="plan.name === currentPlan" class="current-tag">
            <text class="current-tag-text">当前</text>
          </view>

          <view class="plan-icon-wrapper" :style="{ background: plan.iconBg }">
            <image v-if="plan.icon === 'zap'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/lightning.png" class="plan-icon-img" mode="aspectFit"></image>
            <image v-else-if="plan.icon === 'rocket'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/rocket.png" class="plan-icon-img" mode="aspectFit"></image>
            <image v-else-if="plan.icon === 'crown'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/points.png" class="plan-icon-img" mode="aspectFit"></image>
            <image v-else-if="plan.icon === 'diamond'" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/diamond.png" class="plan-icon-img" mode="aspectFit"></image>
          </view>

          <text class="plan-name">{{ plan.name }}</text>
          <text class="plan-desc">{{ plan.subtitle }}</text>

          <view class="price-section">
            <text class="price-currency">{{ plan.price === 'Free' ? '' : '¥' }}</text>
            <text class="price-value">{{ isYearly ? plan.yearlyPrice : plan.price }}</text>
            <text class="price-period" v-if="plan.price !== 'Free'">{{ isYearly ? '/年/人' : '/月/人' }}</text>
          </view>

          <view v-if="isYearly && plan.price !== 'Free'" class="original-price">
            <text class="original-text">原价 ¥{{ plan.monthlyTotal }}/年</text>
          </view>

          <view class="divider"></view>

          <view class="features-section">
            <text class="features-title" v-if="plan.includesText">{{ plan.includesText }}</text>
            <view class="feature-row" v-for="(feature, fIndex) in plan.features" :key="fIndex">
              <view class="feature-check" :class="{ premium: plan.highlight }">
                <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="feature-check-img" mode="aspectFit"></image>
              </view>
              <text class="feature-text">{{ feature }}</text>
            </view>
          </view>

          <view 
            class="action-btn"
            :class="{ 
              'btn-primary': plan.highlight,
              'btn-current': plan.name === currentPlan,
              'btn-free': plan.price === 'Free'
            }"
            @click="subscribe(plan)"
          >
            <text class="btn-text">{{ getButtonText(plan) }}</text>
          </view>
        </view>
      </view>

      <view class="features-compare">
        <text class="compare-title">功能对比</text>
        <view class="compare-table">
          <view class="table-header">
            <text class="header-cell feature-name">功能</text>
            <text class="header-cell" v-for="plan in plans" :key="plan.name">{{ plan.name }}</text>
          </view>
          <view class="table-row" v-for="(row, idx) in compareFeatures" :key="idx">
            <text class="row-cell feature-name">{{ row.name }}</text>
            <view class="row-cell" v-for="plan in plans" :key="plan.name">
              <image v-if="row[plan.name] === true" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/check.png" class="cell-check-img" mode="aspectFit"></image>
              <image v-else-if="row[plan.name] === false" src="https://workyean.oss-cn-beijing.aliyuncs.com/static/close.png" class="cell-cross-img" mode="aspectFit"></image>
              <text v-else class="cell-value">{{ row[plan.name] }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="faq-section">
        <text class="faq-title">常见问题</text>
        <view class="faq-list">
          <view class="faq-item" v-for="(faq, idx) in faqs" :key="idx" @click="toggleFaq(idx)">
            <view class="faq-header">
              <text class="faq-question">{{ faq.question }}</text>
              <image src="https://workyean.oss-cn-beijing.aliyuncs.com/static/dropdown.png" class="faq-arrow-img" :class="{ expanded: faq.expanded }" mode="aspectFit"></image>
            </view>
            <view class="faq-answer" v-if="faq.expanded">
              <text class="faq-answer-text">{{ faq.answer }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-spacer"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      isYearly: false,
      currentPlan: 'Pro',
      plans: [
        {
          name: 'Hobby',
          subtitle: '个人尝鲜与轻量探索',
          icon: 'zap',
          iconBg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          price: 'Free',
          yearlyPrice: 'Free',
          monthlyTotal: 0,
          features: [
            '小Yeah 基础 AI 助手',
            '子集项目上限 5个',
            '附件上限 30个/项目',
            '单附件最大 80MB',
            '团队成员上限 3人'
          ],
          highlight: false
        },
        {
          name: 'Pro',
          subtitle: '核心生产力，适合团队',
          icon: 'rocket',
          iconBg: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
          price: '22',
          yearlyPrice: '211',
          monthlyTotal: 264,
          includesText: '包含 Hobby 所有功能：',
          features: [
            'Agent 工作流开发者模式',
            '解锁最新 AI 模型',
            '子集项目数量 无限制',
            '附件上限 300个/项目',
            '团队成员上限 8人'
          ],
          highlight: false
        },
        {
          name: 'Pro+',
          subtitle: '极致速度，专业用户首选',
          icon: 'crown',
          iconBg: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
          price: '98',
          yearlyPrice: '940',
          monthlyTotal: 1176,
          includesText: '包含 Pro 所有功能：',
          features: [
            '优先生成队列（无需排队）',
            '解锁高级团队模板库',
            'Beta 功能抢先体验',
            '更长上下文记忆窗口',
            '专属客服通道'
          ],
          highlight: true
        },
        {
          name: 'Premium',
          subtitle: '企业级解决方案',
          icon: 'diamond',
          iconBg: 'linear-gradient(135deg, #f3e8ff 0%, #c084fc 100%)',
          price: '486',
          yearlyPrice: '4666',
          monthlyTotal: 5832,
          includesText: '包含 Pro+ 所有功能：',
          features: [
            '全球顶尖 SOTA 模型',
            '附件数量无限制',
            '单附件最大 2GB',
            '团队成员上限 20人',
            '私有部署支持'
          ],
          highlight: false
        }
      ],
      compareFeatures: [
        { name: 'AI 助手', 'Hobby': '基础版', 'Pro': '完整版', 'Pro+': '增强版', 'Premium': '顶配版' },
        { name: '子集项目', 'Hobby': '5个', 'Pro': '无限', 'Pro+': '无限', 'Premium': '无限' },
        { name: '附件数量/项目', 'Hobby': '30个', 'Pro': '300个', 'Pro+': '500个', 'Premium': '无限' },
        { name: '团队成员', 'Hobby': '3人', 'Pro': '8人', 'Pro+': '15人', 'Premium': '20人' },
        { name: '优先队列', 'Hobby': false, 'Pro': false, 'Pro+': true, 'Premium': true },
        { name: '开发者模式', 'Hobby': false, 'Pro': true, 'Pro+': true, 'Premium': true },
        { name: 'Beta 抢先体验', 'Hobby': false, 'Pro': false, 'Pro+': true, 'Premium': true },
        { name: '私有部署', 'Hobby': false, 'Pro': false, 'Pro+': false, 'Premium': true }
      ],
      faqs: [
        {
          question: '可以随时取消订阅吗？',
          answer: '可以，您可以随时取消订阅。取消后，您的计划将在当前计费周期结束时失效，期间您仍可使用所有功能。',
          expanded: false
        },
        {
          question: '支持哪些支付方式？',
          answer: '我们支持微信支付、支付宝、银行卡及 Apple Pay。企业用户还可选择对公转账。',
          expanded: false
        },
        {
          question: '团队成员如何共享订阅？',
          answer: '团队订阅按人数计费，每位成员都将获得完整的计划权益。管理员可在设置中添加或移除成员。',
          expanded: false
        },
        {
          question: '升级或降级计划会如何计费？',
          answer: '升级立即生效，按比例计算差价。降级将在下一计费周期开始时生效，不会产生额外费用。',
          expanded: false
        }
      ]
    }
  },
  
  methods: {
    goBack: function() {
      uni.navigateBack()
    },
    
    toggleBilling: function() {
      this.isYearly = !this.isYearly
    },
    
    toggleFaq: function(index) {
      this.faqs[index].expanded = !this.faqs[index].expanded
    },
    
    getButtonText: function(plan) {
      if (plan.name === this.currentPlan) {
        return '当前计划'
      } else if (plan.price === 'Free') {
        return '免费使用'
      } else {
        return '立即订阅'
      }
    },
    
    subscribe: function(plan) {
      var self = this
      if (plan.name === this.currentPlan) {
        uni.showToast({
          title: '这是您的当前计划',
          icon: 'none'
        })
      } else if (plan.price === 'Free') {
        uni.showModal({
          title: '切换到免费计划',
          content: '降级后部分功能将受限，确定要切换吗？',
          confirmText: '确定',
          success: function(res) {
            if (res.confirm) {
              self.currentPlan = 'Hobby'
              uni.showToast({
                title: '已切换到免费计划',
                icon: 'success'
              })
            }
          }
        })
      } else {
        var price = self.isYearly ? plan.yearlyPrice : plan.price
        var period = self.isYearly ? '年' : '月'
        uni.showModal({
          title: '订阅 ' + plan.name,
          content: '确定以 ¥' + price + '/' + period + '/人 订阅吗？',
          confirmText: '确定订阅',
          success: function(res) {
            if (res.confirm) {
              self.currentPlan = plan.name
              uni.showToast({
                title: '订阅成功',
                icon: 'success'
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.subscription-container {
  min-height: 100vh;
  background: $workyeah-background;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: $workyeah-background;
  border-bottom: 1px solid $workyeah-border;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: $workyeah-z-sticky;
}

.navbar-left, .navbar-right {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $workyeah-radius-sm;
}

.navbar-left:active {
  background-color: $workyeah-accent;
}

.back-icon {
  width: 24px;
  height: 24px;
  color: $workyeah-foreground;
}

.back-icon-img {
  width: 24px;
  height: 24px;
}

.navbar-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: $workyeah-foreground;
  text-align: center;
}

.content-area {
  flex: 1;
  height: calc(100vh - 56px);
  background: $workyeah-slate-50;
}

.hero-section {
  position: relative;
  padding: 32px 20px 24px;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(180deg, $workyeah-background-secondary 0%, $workyeah-slate-50 100%);
}

.hero-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba($workyeah-primary, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.hero-title {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: $workyeah-foreground;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  display: block;
  font-size: 15px;
  color: $workyeah-muted-foreground;
  margin-bottom: 24px;
}

.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.toggle-label {
  font-size: 14px;
  color: $workyeah-slate-400;
  font-weight: 500;
  transition: color $workyeah-transition-base;
}

.toggle-label.active {
  color: $workyeah-foreground;
}

.toggle-switch {
  padding: 4px;
}

.toggle-track {
  width: 48px;
  height: 26px;
  background: $workyeah-slate-300;
  border-radius: 13px;
  position: relative;
  transition: background $workyeah-transition-slow;
}

.toggle-track.yearly {
  background: linear-gradient(135deg, $workyeah-primary 0%, $workyeah-primary-light 100%);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: $workyeah-background;
  border-radius: 10px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: $workyeah-shadow-md;
}

.toggle-track.yearly .toggle-thumb {
  transform: translateX(22px);
}

.toggle-yearly-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.save-badge {
  font-size: 11px;
  font-weight: 600;
  color: $workyeah-primary;
  background: $workyeah-info-light;
  padding: 2px 8px;
  border-radius: 10px;
}

.plans-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
}

.plan-card {
  position: relative;
  background: $workyeah-card;
  border: 1px solid $workyeah-border;
  border-radius: $workyeah-radius-xl;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all $workyeah-transition-slow;
  box-shadow: $workyeah-shadow-sm;
}

.plan-card.highlight {
  background: linear-gradient(180deg, $workyeah-info-light 0%, $workyeah-card 100%);
  border-color: $workyeah-primary;
  box-shadow: $workyeah-shadow-lg, 0 0 20px rgba($workyeah-primary, 0.15);
}

.plan-card.current {
  border-color: $workyeah-primary;
}

.popular-tag {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: linear-gradient(135deg, $workyeah-primary 0%, $workyeah-primary-light 100%);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba($workyeah-primary, 0.3);
}

.tag-icon {
  width: 12px;
  height: 12px;
  color: $workyeah-warning;
}

.tag-icon-img {
  width: 12px;
  height: 12px;
}

.tag-text {
  font-size: 11px;
  font-weight: 600;
  color: $workyeah-primary-foreground;
}

.current-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 2px 6px;
  background: $workyeah-info-light;
  border-radius: 4px;
}

.current-tag-text {
  font-size: 10px;
  font-weight: 600;
  color: $workyeah-primary;
}

.plan-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.plan-icon {
  width: 26px;
  height: 26px;
  color: $workyeah-slate-700;
}

.plan-icon-img {
  width: 26px;
  height: 26px;
}

.plan-name {
  font-size: 20px;
  font-weight: 700;
  color: $workyeah-foreground;
  margin-bottom: 4px;
}

.plan-desc {
  font-size: 11px;
  color: $workyeah-primary;
  text-align: center;
  margin-bottom: 16px;
  line-height: 1.4;
}

.price-section {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.price-currency {
  font-size: 18px;
  font-weight: 600;
  color: $workyeah-foreground;
}

.price-value {
  font-size: 36px;
  font-weight: 800;
  color: $workyeah-foreground;
  line-height: 1;
}

.price-period {
  font-size: 12px;
  color: $workyeah-muted-foreground;
  margin-left: 2px;
}

.original-price {
  margin-bottom: 12px;
}

.original-text {
  font-size: 12px;
  color: $workyeah-slate-400;
  text-decoration: line-through;
}

.divider {
  width: 100%;
  height: 1px;
  background: $workyeah-border;
  margin: 16px 0;
}

.features-section {
  width: 100%;
  flex: 1;
}

.features-title {
  display: block;
  font-size: 11px;
  color: $workyeah-muted-foreground;
  margin-bottom: 10px;
}

.feature-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.feature-check {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
  color: $workyeah-primary;
}

.feature-check.premium {
  color: $workyeah-primary-light;
}

.feature-check svg {
  width: 100%;
  height: 100%;
}

.feature-check-img {
  width: 100%;
  height: 100%;
}

.feature-text {
  font-size: 12px;
  color: $workyeah-secondary-foreground;
  line-height: 1.4;
}

.action-btn {
  width: 100%;
  padding: 12px;
  background: $workyeah-slate-100;
  border-radius: $workyeah-radius-sm;
  text-align: center;
  margin-top: 16px;
  transition: all $workyeah-transition-base;
}

.action-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.action-btn.btn-primary {
  background: linear-gradient(135deg, $workyeah-primary 0%, $workyeah-primary-light 100%);
  box-shadow: 0 4px 12px rgba($workyeah-primary, 0.25);
}

.action-btn.btn-current {
  background: $workyeah-slate-200;
  border: 1px solid $workyeah-border;
}

.action-btn.btn-free {
  background: $workyeah-slate-50;
  border: 1px solid $workyeah-border;
}

.btn-text {
  font-size: 14px;
  font-weight: 600;
  color: $workyeah-secondary-foreground;
}

.btn-primary .btn-text {
  color: $workyeah-primary-foreground;
}

.btn-current .btn-text {
  color: $workyeah-muted-foreground;
}

.features-compare {
  margin: 32px 16px 0;
  background: $workyeah-card;
  border: 1px solid $workyeah-border;
  border-radius: $workyeah-radius-xl;
  padding: 20px 16px;
  overflow: hidden;
  box-shadow: $workyeah-shadow-sm;
}

.compare-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: $workyeah-foreground;
  margin-bottom: 16px;
  text-align: center;
}

.compare-table {
  overflow-x: auto;
}

.table-header {
  display: flex;
  padding-bottom: 12px;
  border-bottom: 1px solid $workyeah-border;
  margin-bottom: 8px;
}

.header-cell {
  flex: 1;
  font-size: 11px;
  font-weight: 600;
  color: $workyeah-muted-foreground;
  text-align: center;
}

.header-cell.feature-name {
  flex: 1.2;
  text-align: left;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid $workyeah-slate-100;
}

.row-cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-cell.feature-name {
  flex: 1.2;
  justify-content: flex-start;
  font-size: 12px;
  color: $workyeah-secondary-foreground;
}

.cell-check {
  width: 18px;
  height: 18px;
}

.cell-check-img {
  width: 18px;
  height: 18px;
}

.cell-cross {
  width: 16px;
  height: 16px;
}

.cell-cross-img {
  width: 16px;
  height: 16px;
}

.cell-value {
  font-size: 11px;
  color: $workyeah-muted-foreground;
  text-align: center;
}

.faq-section {
  margin: 32px 16px 0;
}

.faq-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: $workyeah-foreground;
  margin-bottom: 16px;
  text-align: center;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  background: $workyeah-card;
  border: 1px solid $workyeah-border;
  border-radius: $workyeah-radius;
  overflow: hidden;
  box-shadow: $workyeah-shadow-sm;
}

.faq-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.faq-question {
  font-size: 14px;
  font-weight: 500;
  color: $workyeah-foreground;
  flex: 1;
}

.faq-arrow {
  width: 20px;
  height: 20px;
  color: $workyeah-muted-foreground;
  transition: transform $workyeah-transition-slow;
}

.faq-arrow-img {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.faq-arrow-img.expanded {
  transform: rotate(180deg);
}

.faq-arrow.expanded {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 16px 14px;
}

.faq-answer-text {
  font-size: 13px;
  color: $workyeah-muted-foreground;
  line-height: 1.6;
}

.bottom-spacer {
  height: 40px;
}
</style>
