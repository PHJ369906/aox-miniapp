<template>
  <view class="page">
    <view class="section">
      <view class="item">
        <view class="left">
          <text class="label">个性化推荐</text>
          <text class="desc">根据浏览偏好推荐内容</text>
        </view>
        <switch :checked="personalized" color="#0891b2" @change="onPersonalizedChange" />
      </view>
      <view class="item">
        <view class="left">
          <text class="label">活动通知</text>
          <text class="desc">接收运营活动与福利提醒</text>
        </view>
        <switch :checked="marketing" color="#0891b2" @change="onMarketingChange" />
      </view>
      <view class="item" @tap="clearBehaviorData">
        <view class="left">
          <text class="label">清理行为数据</text>
          <text class="desc">清理本地推荐相关缓存</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const personalized = ref(true)
const marketing = ref(true)

const onPersonalizedChange = (e: any) => {
  personalized.value = Boolean(e.detail.value)
}

const onMarketingChange = (e: any) => {
  marketing.value = Boolean(e.detail.value)
}

const clearBehaviorData = () => {
  uni.showModal({
    title: '清理提示',
    content: '确认清理本地行为数据吗？',
    success: (res) => {
      if (!res.confirm) return
      uni.showToast({
        title: '已清理',
        icon: 'success',
      })
    },
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 20rpx;
}

.section {
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: $shadow-xs;
}

.item {
  min-height: 106rpx;
  padding: 14rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  border-top: 1rpx solid $border-color;
}

.item:first-child {
  border-top: none;
}

.left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.label {
  color: $text-color;
  font-size: 28rpx;
}

.desc {
  color: $text-color-secondary;
  font-size: 22rpx;
}

.arrow {
  color: $text-color-placeholder;
  font-size: 38rpx;
}
</style>
