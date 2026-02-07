<template>
  <view class="page">
    <view class="toolbar">
      <text class="summary">未读 {{ unreadCount }} 条</text>
      <button class="read-all" size="mini" @tap="markAllRead">全部已读</button>
    </view>

    <view class="message-list" v-if="messages.length > 0">
      <view class="message-card" v-for="item in messages" :key="item.id" @tap="markRead(item.id)">
        <view class="dot" :class="{ unread: !item.read }"></view>
        <view class="main">
          <view class="top">
            <text class="title">{{ item.title }}</text>
            <text class="time">{{ item.time }}</text>
          </view>
          <text class="content">{{ item.content }}</text>
        </view>
      </view>
    </view>

    <view class="empty" v-else>
      <text class="empty-title">暂无消息</text>
      <text class="empty-desc">消息通知会显示在这里</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMessageList, markAllMessagesRead, markMessageRead } from '@/api/message'
import type { MessageItem } from '@/api/message'

const messages = ref<MessageItem[]>([])

const unreadCount = computed(() => messages.value.filter((item) => !item.read).length)

watch(
  unreadCount,
  (count) => {
    uni.setStorageSync('message_unread', count)
  },
  { immediate: true }
)

const loadMessages = async () => {
  try {
    const page = await getMessageList(1, 100)
    messages.value = page.records || []
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    console.error('加载消息列表失败:', error)
  }
}

const markRead = async (id: number) => {
  const target = messages.value.find((item) => item.id === id)
  if (!target || target.read) return
  try {
    await markMessageRead(id)
    target.read = true
  } catch (error: any) {
    uni.showToast({
      title: error?.message || '标记已读失败',
      icon: 'none',
    })
  }
}

const markAllRead = async () => {
  try {
    await markAllMessagesRead()
    messages.value = messages.value.map((item) => ({ ...item, read: true }))
    uni.showToast({
      title: '已全部标记为已读',
      icon: 'success',
    })
  } catch (error: any) {
    uni.showToast({
      title: error?.message || '操作失败',
      icon: 'none',
    })
  }
}

onShow(() => {
  loadMessages()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 20rpx;
}

.toolbar {
  height: 74rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8rpx;
}

.summary {
  color: $text-color-secondary;
  font-size: 24rpx;
}

.read-all {
  min-width: 150rpx;
  height: 58rpx;
  line-height: 58rpx;
  border-radius: 999rpx;
  background: rgba(8, 145, 178, 0.12);
  color: $primary-strong;
  border: none;
  font-size: 22rpx;
}

.read-all::after {
  border: none;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.message-card {
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 18rpx;
  padding: 16rpx;
  display: flex;
  gap: 14rpx;
  box-shadow: $shadow-xs;
}

.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 7rpx;
  background: #cbd5e1;
  margin-top: 12rpx;
}

.dot.unread {
  background: $error-color;
}

.main {
  flex: 1;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
  gap: 12rpx;
}

.title {
  color: $text-color;
  font-size: 28rpx;
  font-weight: 600;
}

.time {
  color: $text-color-placeholder;
  font-size: 22rpx;
}

.content {
  color: $text-color-secondary;
  font-size: 24rpx;
  line-height: 1.6;
}

.empty {
  margin-top: 20rpx;
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  text-align: center;
  padding: 80rpx 24rpx;
}

.empty-title {
  display: block;
  color: $text-color;
  font-size: 32rpx;
  font-weight: 600;
}

.empty-desc {
  display: block;
  margin-top: 8rpx;
  color: $text-color-secondary;
  font-size: 24rpx;
}
</style>
