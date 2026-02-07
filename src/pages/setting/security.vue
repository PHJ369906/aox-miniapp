<template>
  <view class="page">
    <view class="section">
      <view class="item" @tap="goEdit">
        <text class="label">手机号绑定</text>
        <text class="value">{{ phoneText }}</text>
        <text class="arrow">›</text>
      </view>
      <view class="item" @tap="showPwdTip">
        <text class="label">登录密码</text>
        <text class="value">修改</text>
        <text class="arrow">›</text>
      </view>
      <view class="item">
        <text class="label">登录保护</text>
        <switch :checked="loginProtect" color="#0891b2" @change="toggleProtect" />
      </view>
      <view class="item">
        <text class="label">异地登录提醒</text>
        <switch :checked="loginAlert" color="#0891b2" @change="toggleAlert" />
      </view>
    </view>

    <view class="tip">
      <text>建议开启“登录保护”和“异地登录提醒”，提升账号安全性。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const loginProtect = ref(true)
const loginAlert = ref(true)

const phoneText = computed(() => userStore.userInfo?.phone || '未绑定')

const goEdit = () => {
  uni.navigateTo({
    url: '/pages/mine/edit',
  })
}

const showPwdTip = () => {
  uni.showToast({
    title: '密码修改功能开发中',
    icon: 'none',
  })
}

const toggleProtect = (e: any) => {
  loginProtect.value = Boolean(e.detail.value)
}

const toggleAlert = (e: any) => {
  loginAlert.value = Boolean(e.detail.value)
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
  min-height: 96rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid $border-color;
  gap: 16rpx;
}

.item:first-child {
  border-top: none;
}

.label {
  flex: 1;
  color: $text-color;
  font-size: 28rpx;
}

.value {
  color: $text-color-secondary;
  font-size: 24rpx;
}

.arrow {
  color: $text-color-placeholder;
  font-size: 38rpx;
}

.tip {
  margin-top: 18rpx;
  background: rgba(8, 145, 178, 0.08);
  border: 1rpx solid rgba(8, 145, 178, 0.2);
  color: $primary-strong;
  border-radius: 16rpx;
  padding: 18rpx;
  font-size: 24rpx;
  line-height: 1.6;
}
</style>
