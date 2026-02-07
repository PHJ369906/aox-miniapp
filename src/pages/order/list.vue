<template>
  <view class="page">
    <view class="tabs">
      <view
        class="tab-item"
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: currentTab === tab.key }"
        @tap="currentTab = tab.key"
      >
        {{ tab.label }}
      </view>
    </view>

    <view v-if="filteredOrders.length === 0" class="empty-wrap">
      <text class="empty-title">暂无订单</text>
      <text class="empty-desc">去首页逛逛，发现更多内容</text>
      <button class="go-home" @tap="goHome">去首页</button>
    </view>

    <view v-else class="order-list">
      <view class="order-card" v-for="order in filteredOrders" :key="order.id">
        <view class="order-top">
          <text class="order-no">订单号 {{ order.id }}</text>
          <text class="status">{{ getStatusLabel(order.status) }}</text>
        </view>
        <view class="order-body">
          <text class="title">{{ order.title }}</text>
          <text class="amount">¥{{ order.amount.toFixed(2) }}</text>
        </view>
        <view class="order-foot">
          <text class="time">{{ order.time }}</text>
          <button class="action" size="mini" @tap="handleAction(order)">查看详情</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getOrderList, getOrderStats } from '@/api/order'
import type { OrderItem, OrderStatus, OrderStats } from '@/api/order'

type TabKey = OrderStatus

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pay', label: '待付款' },
  { key: 'ship', label: '待发货' },
  { key: 'receive', label: '待收货' },
  { key: 'refund', label: '售后中' },
]

const currentTab = ref<TabKey>('all')
const orders = ref<OrderItem[]>([])

const getStatusLabel = (status: OrderStatus) => {
  const statusMap: Record<string, string> = {
    pay: '待付款',
    ship: '待发货',
    receive: '待收货',
    refund: '售后中',
  }
  return statusMap[status] || '未知状态'
}

const filteredOrders = computed(() => orders.value)

const syncOrderStats = (stats: OrderStats) => {
  uni.setStorageSync('order_stats', stats)
}

const loadOrderStats = async () => {
  try {
    const stats = await getOrderStats()
    syncOrderStats(stats)
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    console.error('加载订单统计失败:', error)
  }
}

const loadOrders = async () => {
  try {
    const page = await getOrderList(1, 50, currentTab.value)
    orders.value = page.records || []
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    console.error('加载订单失败:', error)
  }
}

const handleAction = (order: OrderItem) => {
  uni.showToast({
    title: `订单 ${order.id} 详情开发中`,
    icon: 'none',
  })
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}

watch(
  currentTab,
  () => {
    loadOrders()
  }
)

onLoad(async (query) => {
  const tab = String(query?.tab || 'all') as TabKey
  if (tabs.some((item) => item.key === tab)) {
    currentTab.value = tab
  }
  await Promise.all([loadOrders(), loadOrderStats()])
})

onShow(() => {
  loadOrderStats()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 20rpx;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8rpx;
  background: $surface-color;
  border-radius: 18rpx;
  border: 1rpx solid $border-color;
  padding: 10rpx;
}

.tab-item {
  min-height: 64rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-color-secondary;
  font-size: 23rpx;
}

.tab-item.active {
  background: rgba(8, 145, 178, 0.12);
  color: $primary-strong;
  font-weight: 600;
}

.order-list {
  margin-top: 18rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.order-card {
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: $shadow-xs;
}

.order-top,
.order-body,
.order-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-top {
  margin-bottom: 12rpx;
}

.order-no {
  color: $text-color-secondary;
  font-size: 22rpx;
}

.status {
  color: $primary-strong;
  font-size: 24rpx;
  font-weight: 600;
}

.order-body {
  gap: 20rpx;
  margin-bottom: 14rpx;
}

.title {
  flex: 1;
  color: $text-color;
  font-size: 28rpx;
}

.amount {
  color: $text-color;
  font-size: 30rpx;
  font-weight: 700;
}

.time {
  color: $text-color-secondary;
  font-size: 22rpx;
}

.action {
  min-width: 124rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: $primary-strong;
  background: rgba(8, 145, 178, 0.08);
  border: none;
}

.action::after {
  border: none;
}

.empty-wrap {
  margin-top: 28rpx;
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  padding: 80rpx 24rpx;
  text-align: center;
}

.empty-title {
  display: block;
  font-size: 32rpx;
  color: $text-color;
  font-weight: 600;
}

.empty-desc {
  display: block;
  margin-top: 10rpx;
  color: $text-color-secondary;
  font-size: 24rpx;
}

.go-home {
  margin-top: 26rpx;
  width: 240rpx;
  height: 78rpx;
  line-height: 78rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  color: #fff;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
}

.go-home::after {
  border: none;
}
</style>
