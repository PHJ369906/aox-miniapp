<template>
  <view class="detail-container">
    <view v-if="loading" class="loading">加载中...</view>

    <view v-else>
      <view class="title">{{ notice?.noticeTitle || '公告详情' }}</view>
      <view class="meta">
        <text>{{ formatTime(notice?.publishTime) }}</text>
        <text v-if="notice?.publishUserName">发布人：{{ notice?.publishUserName }}</text>
        <text v-if="notice?.readCount">阅读 {{ notice?.readCount }}</text>
      </view>

      <view v-if="notice?.noticeContent" class="content">
        <rich-text :nodes="notice.noticeContent"></rich-text>
      </view>
      <view v-else class="empty">暂无内容</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getNoticeDetail, reportNoticeRead } from '@/api/notice'
import type { Notice } from '@/api/notice'

const notice = ref<Notice | null>(null)
const loading = ref(false)

const loadDetail = async (noticeId?: number) => {
  if (!noticeId) return
  loading.value = true
  try {
    notice.value = await getNoticeDetail(noticeId)
    try {
      await reportNoticeRead(noticeId)
    } catch (error) {
      console.warn('上报阅读失败:', error)
    }
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    uni.showToast({
      title: '加载公告失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

const formatTime = (time?: string) => {
  if (!time) return ''
  return time.substring(0, 10)
}

onLoad((query) => {
  const id = Number(query?.noticeId)
  if (!id) {
    uni.showToast({
      title: '公告不存在',
      icon: 'none',
    })
    return
  }
  loadDetail(id)
})
</script>

<style lang="scss" scoped>

.detail-container {
  padding: 24rpx;
  background-color: $bg-color;
  min-height: 100vh;
}

.loading {
  text-align: center;
  color: $text-color-secondary;
  padding: 60rpx 0;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-color;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  font-size: 24rpx;
  color: $text-color-secondary;
  margin-bottom: 24rpx;
}

.content {
  padding: 24rpx;
  background-color: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 16rpx;
  color: $text-color;
  line-height: 1.8;
  font-size: 28rpx;
  box-shadow: $shadow-xs;
}

.empty {
  text-align: center;
  color: $text-color-secondary;
  padding: 80rpx 0;
}
</style>
