<template>
  <view class="mine-container">
    <view class="hero-card">
      <view class="hero-glow hero-glow-left"></view>
      <view class="hero-glow hero-glow-right"></view>

      <view class="hero-main" @tap="goToEditProfile">
        <image
          class="avatar"
          :src="userInfo?.avatar || '/static/default-avatar.png'"
          mode="aspectFill"
        />

        <view class="identity">
          <text class="nickname">{{ userInfo?.nickname || '未设置昵称' }}</text>
          <text class="phone">{{ userInfo?.phone || '未绑定手机号' }}</text>
          <view class="chips">
            <text class="chip">{{ memberLevel }}</text>
            <text class="chip">UID {{ userInfo?.userId || '--' }}</text>
          </view>
        </view>

        <view class="edit-chip">编辑资料</view>
      </view>

      <view class="completion-card">
        <view class="completion-top">
          <text class="completion-title">资料完善度</text>
          <text class="completion-rate">{{ profileCompletion }}%</text>
        </view>
        <view class="completion-track">
          <view class="completion-fill" :style="{ width: `${profileCompletion}%` }"></view>
        </view>
        <text class="completion-tip">{{ completionTip }}</text>
      </view>
    </view>

    <view class="quick-grid">
      <view
        class="quick-item"
        v-for="item in quickActions"
        :key="item.id"
        @tap="navigateTo(item.path)"
      >
        <view class="quick-icon-wrap">
          <image class="quick-icon" :src="item.icon" mode="aspectFit" />
          <text v-if="item.badge" class="quick-badge">{{ item.badge }}</text>
        </view>
        <text class="quick-title">{{ item.title }}</text>
        <text class="quick-subtitle">{{ item.subtitle }}</text>
      </view>
    </view>

    <view class="order-card">
      <view class="section-head" @tap="navigateTo('/pages/order/list')">
        <text class="section-title">我的订单</text>
        <text class="section-link">查看全部</text>
      </view>
      <view class="order-grid">
        <view
          class="order-item"
          v-for="item in orderActions"
          :key="item.key"
          @tap="navigateTo(item.path)"
        >
          <view class="order-icon-wrap">
            <image class="order-icon" :src="item.icon" mode="aspectFit" />
            <text v-if="item.count > 0" class="order-count">{{ item.count }}</text>
          </view>
          <text class="order-text">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <view class="menu-section" v-for="section in menuSections" :key="section.key">
      <view class="section-head">
        <text class="section-title">{{ section.title }}</text>
      </view>
      <view class="menu-list">
        <view
          class="menu-item"
          v-for="item in section.items"
          :key="item.id"
          @tap="navigateTo(item.path)"
        >
          <view class="menu-icon-wrap">
            <image class="menu-icon" :src="item.icon" mode="aspectFit" />
          </view>
          <view class="menu-main">
            <text class="menu-title">{{ item.title }}</text>
            <text class="menu-desc" v-if="item.desc">{{ item.desc }}</text>
          </view>
          <text v-if="item.badge" class="menu-badge">{{ item.badge }}</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>

    <view class="version-info">
      <text class="version-text">Aox Miniapp v1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import { getOrderStats } from '@/api/order'
import { getUnreadMessageCount } from '@/api/message'

interface QuickAction {
  id: number
  title: string
  subtitle: string
  icon: string
  path: string
  badge?: string
}

interface MenuItem {
  id: number
  title: string
  desc?: string
  icon: string
  path: string
  badge?: string
}

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const unreadCount = ref(0)
const orderStats = ref({
  all: 0,
  pay: 0,
  ship: 0,
  receive: 0,
  refund: 0,
})

const profileCompletion = computed(() => {
  const info = userInfo.value
  if (!info) return 20

  const checks = [
    Boolean(info.nickname),
    Boolean(info.avatar),
    Number(info.gender) > 0,
    Boolean(info.phone),
    Boolean(info.province || info.city),
  ]

  const completed = checks.filter(Boolean).length
  return Math.max(20, Math.round((completed / checks.length) * 100))
})

const completionTip = computed(() => {
  if (profileCompletion.value >= 90) return '资料非常完整，账号更安全'
  if (profileCompletion.value >= 60) return '再补充一项资料，体验会更完整'
  return '建议完善头像、手机号与地区信息'
})

const memberLevel = computed(() => {
  if (!userInfo.value) return '访客'
  if (userInfo.value.phone) return '标准会员'
  return '基础会员'
})

const quickActions = computed<QuickAction[]>(() => {
  const badge = unreadCount.value > 99 ? '99+' : unreadCount.value > 0 ? String(unreadCount.value) : ''
  return [
    {
      id: 1,
      title: '编辑资料',
      subtitle: '头像 昵称 性别',
      icon: '/static/icons/about.svg',
      path: '/pages/mine/edit',
    },
    {
      id: 2,
      title: '我的消息',
      subtitle: '系统通知与动态',
      icon: '/static/icons/message.svg',
      path: '/pages/message/list',
      badge,
    },
    {
      id: 3,
      title: '账号安全',
      subtitle: '密码与隐私保护',
      icon: '/static/icons/security.svg',
      path: '/pages/setting/security',
    },
  ]
})

const orderActions = computed(() => [
  {
    key: 'pay',
    label: '待付款',
    icon: '/static/icons/feature-1.svg',
    count: orderStats.value.pay,
    path: '/pages/order/list?tab=pay',
  },
  {
    key: 'ship',
    label: '待发货',
    icon: '/static/icons/feature-2.svg',
    count: orderStats.value.ship,
    path: '/pages/order/list?tab=ship',
  },
  {
    key: 'receive',
    label: '待收货',
    icon: '/static/icons/feature-3.svg',
    count: orderStats.value.receive,
    path: '/pages/order/list?tab=receive',
  },
  {
    key: 'refund',
    label: '售后中',
    icon: '/static/icons/feature-4.svg',
    count: orderStats.value.refund,
    path: '/pages/order/list?tab=refund',
  },
])

const menuSections = computed(() => {
  const badge = unreadCount.value > 99 ? '99+' : unreadCount.value > 0 ? String(unreadCount.value) : ''

  const serviceItems: MenuItem[] = [
    {
      id: 1,
      title: '我的收藏',
      desc: '收藏商品与内容',
      icon: '/static/icons/favorite.svg',
      path: '/pages/favorite/list',
    },
    {
      id: 2,
      title: '地址管理',
      desc: '收货地址与联系人',
      icon: '/static/icons/address.svg',
      path: '/pages/address/list',
    },
    {
      id: 3,
      title: '消息中心',
      desc: '系统通知与提醒',
      icon: '/static/icons/message.svg',
      path: '/pages/message/list',
      badge,
    },
  ]

  const settingItems: MenuItem[] = [
    {
      id: 4,
      title: '账号与安全',
      desc: '密码、手机号、设备',
      icon: '/static/icons/security.svg',
      path: '/pages/setting/security',
    },
    {
      id: 5,
      title: '隐私设置',
      desc: '授权与个性化设置',
      icon: '/static/icons/privacy.svg',
      path: '/pages/setting/privacy',
    },
    {
      id: 6,
      title: '关于我们',
      desc: '版本信息与说明',
      icon: '/static/icons/about.svg',
      path: '/pages/setting/about',
    },
  ]

  return [
    { key: 'service', title: '常用功能', items: serviceItems },
    { key: 'setting', title: '设置', items: settingItems },
  ]
})

const loadLocalStatus = () => {
  const unread = Number(uni.getStorageSync('message_unread') || 0)
  unreadCount.value = Number.isFinite(unread) && unread > 0 ? unread : 0

  const cachedOrderStats = uni.getStorageSync('order_stats')
  if (cachedOrderStats && typeof cachedOrderStats === 'object') {
    orderStats.value = {
      all: Number((cachedOrderStats as any).all || 0),
      pay: Number((cachedOrderStats as any).pay || 0),
      ship: Number((cachedOrderStats as any).ship || 0),
      receive: Number((cachedOrderStats as any).receive || 0),
      refund: Number((cachedOrderStats as any).refund || 0),
    }
  }
}

const loadServerStatus = async () => {
  try {
    const [unread, stats] = await Promise.all([getUnreadMessageCount(), getOrderStats()])
    unreadCount.value = Number(unread || 0)
    orderStats.value = {
      all: Number(stats?.all || 0),
      pay: Number(stats?.pay || 0),
      ship: Number(stats?.ship || 0),
      receive: Number(stats?.receive || 0),
      refund: Number(stats?.refund || 0),
    }
    uni.setStorageSync('message_unread', unreadCount.value)
    uni.setStorageSync('order_stats', orderStats.value)
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    console.error('加载状态统计失败:', error)
  }
}

const navigateTo = (path: string) => {
  if (!path) {
    return
  }

  uni.navigateTo({
    url: path,
    fail: () => {
      uni.showToast({
        title: '页面准备中',
        icon: 'none',
      })
    },
  })
}

const goToEditProfile = () => {
  navigateTo('/pages/mine/edit')
}

const refreshProfile = async () => {
  if (!userStore.isLogin) {
    uni.reLaunch({
      url: '/pages/login/login',
    })
    return
  }

  await userStore.fetchUserInfo()
  loadLocalStatus()
  await loadServerStatus()
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '退出后将返回登录页，是否继续？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
      }
    },
  })
}

const onAuthExpired = () => {
  userStore.clearAuthState()
}

onMounted(async () => {
  if (!userStore.isLogin) {
    uni.reLaunch({
      url: '/pages/login/login',
    })
    return
  }

  if (typeof (uni as any).$on === 'function') {
    ;(uni as any).$on('auth-expired', onAuthExpired)
  }

  await refreshProfile()
})

onShow(() => {
  loadLocalStatus()
  if (userStore.isLogin) {
    loadServerStatus()
  }
})

onPullDownRefresh(async () => {
  await refreshProfile()
  uni.stopPullDownRefresh()
})

onUnmounted(() => {
  if (typeof (uni as any).$off === 'function') {
    ;(uni as any).$off('auth-expired', onAuthExpired)
  }
})
</script>

<style lang="scss" scoped>
.mine-container {
  min-height: 100vh;
  background: radial-gradient(500rpx circle at 0% -10%, rgba(8, 145, 178, 0.12), transparent 65%),
    radial-gradient(420rpx circle at 100% -10%, rgba(34, 211, 238, 0.14), transparent 62%),
    $bg-color;
  padding: 24rpx 24rpx 48rpx;
}

.hero-card {
  position: relative;
  border-radius: 28rpx;
  padding: 30rpx 24rpx 26rpx;
  background: linear-gradient(150deg, rgba(8, 145, 178, 0.94), rgba(14, 116, 144, 0.96));
  box-shadow: 0 14rpx 34rpx rgba(8, 145, 178, 0.28);
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  width: 240rpx;
  height: 240rpx;
  border-radius: 120rpx;
  background: rgba(255, 255, 255, 0.14);
}

.hero-glow-left {
  left: -80rpx;
  top: -120rpx;
}

.hero-glow-right {
  right: -60rpx;
  top: -100rpx;
}

.hero-main {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  min-height: 140rpx;
  gap: 18rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.2);
}

.identity {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.nickname {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1.3;
}

.phone {
  color: rgba(255, 255, 255, 0.86);
  font-size: 24rpx;
  line-height: 1.4;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 2rpx;
}

.chip {
  color: #cffafe;
  background: rgba(14, 116, 144, 0.5);
  border: 1rpx solid rgba(224, 242, 254, 0.26);
  border-radius: 999rpx;
  font-size: 20rpx;
  line-height: 1;
  padding: 10rpx 14rpx;
}

.edit-chip {
  flex-shrink: 0;
  min-width: 128rpx;
  min-height: 64rpx;
  border-radius: 999rpx;
  padding: 0 20rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #083344;
  background: #ffffff;
  font-size: 24rpx;
  font-weight: 600;
}

.completion-card {
  position: relative;
  z-index: 2;
  margin-top: 24rpx;
  background: rgba(255, 255, 255, 0.16);
  border: 1rpx solid rgba(255, 255, 255, 0.25);
  border-radius: 20rpx;
  padding: 18rpx 18rpx 16rpx;
}

.completion-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.completion-title {
  font-size: 24rpx;
  color: rgba(240, 249, 255, 0.94);
}

.completion-rate {
  font-size: 24rpx;
  font-weight: 700;
  color: #ffffff;
}

.completion-track {
  height: 12rpx;
  background: rgba(224, 242, 254, 0.3);
  border-radius: 8rpx;
  overflow: hidden;
}

.completion-fill {
  height: 12rpx;
  background: linear-gradient(90deg, #a5f3fc, #ffffff);
  border-radius: 8rpx;
  transition: width 280ms ease;
}

.completion-tip {
  margin-top: 10rpx;
  color: rgba(240, 249, 255, 0.92);
  font-size: 22rpx;
  line-height: 1.4;
}

.quick-grid {
  margin-top: 20rpx;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
}

.quick-item {
  min-height: 164rpx;
  border-radius: 20rpx;
  background: $surface-color;
  border: 1rpx solid $border-color;
  padding: 20rpx 18rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
  box-shadow: $shadow-xs;
}

.quick-item:active {
  transform: translateY(1rpx);
}

.quick-icon-wrap {
  position: relative;
  width: 50rpx;
  height: 50rpx;
}

.quick-icon {
  width: 50rpx;
  height: 50rpx;
}

.quick-badge {
  position: absolute;
  top: -10rpx;
  right: -24rpx;
  min-width: 34rpx;
  height: 34rpx;
  border-radius: 17rpx;
  background: $error-color;
  color: #fff;
  font-size: 20rpx;
  line-height: 34rpx;
  text-align: center;
  padding: 0 8rpx;
}

.quick-title {
  color: $text-color;
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1.35;
}

.quick-subtitle {
  color: $text-color-secondary;
  font-size: 22rpx;
  line-height: 1.35;
}

.order-card,
.menu-section {
  margin-top: 20rpx;
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 22rpx;
  box-shadow: $shadow-xs;
  overflow: hidden;
}

.section-head {
  min-height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}

.section-title {
  color: $text-color;
  font-size: 30rpx;
  font-weight: 700;
}

.section-link {
  color: $primary-strong;
  font-size: 24rpx;
}

.order-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8rpx;
  padding: 4rpx 12rpx 20rpx;
}

.order-item {
  min-height: 132rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.order-icon-wrap {
  width: 52rpx;
  height: 52rpx;
  position: relative;
}

.order-icon {
  width: 52rpx;
  height: 52rpx;
}

.order-count {
  position: absolute;
  top: -10rpx;
  right: -16rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  background: $error-color;
  color: #fff;
  font-size: 20rpx;
  line-height: 32rpx;
  text-align: center;
  padding: 0 6rpx;
}

.order-text {
  color: $text-color-secondary;
  font-size: 22rpx;
}

.menu-list {
  padding: 0 16rpx 10rpx;
}

.menu-item {
  min-height: 104rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 8rpx;
  border-top: 1rpx solid $border-color;
}

.menu-item:first-child {
  border-top: none;
}

.menu-icon-wrap {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: rgba(8, 145, 178, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 38rpx;
  height: 38rpx;
}

.menu-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.menu-title {
  color: $text-color;
  font-size: 28rpx;
  line-height: 1.35;
}

.menu-desc {
  color: $text-color-secondary;
  font-size: 22rpx;
  line-height: 1.35;
}

.menu-badge {
  min-width: 34rpx;
  height: 34rpx;
  border-radius: 17rpx;
  background: $error-color;
  color: #fff;
  font-size: 20rpx;
  line-height: 34rpx;
  text-align: center;
  padding: 0 6rpx;
}

.menu-arrow {
  color: $text-color-placeholder;
  font-size: 40rpx;
  font-weight: 300;
}

.logout-section {
  margin-top: 26rpx;
}

.logout-btn {
  width: 100%;
  min-height: 90rpx;
  line-height: 90rpx;
  border-radius: 999rpx;
  background: $surface-color;
  color: $error-color;
  font-size: 30rpx;
  font-weight: 600;
  border: 1rpx solid #fecaca;
}

.logout-btn::after {
  border: none;
}

.version-info {
  margin-top: 26rpx;
  text-align: center;
}

.version-text {
  color: $text-color-placeholder;
  font-size: 22rpx;
}
</style>
