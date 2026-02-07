<template>
  <view class="page">
    <view class="brand-card">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="name">Aox Miniapp</text>
      <text class="version">版本 v1.0.0</text>
      <text class="desc">更高效地管理你的内容与服务</text>
    </view>

    <view class="info-card">
      <view class="row">
        <text class="label">当前版本</text>
        <text class="value">1.0.0</text>
      </view>
      <view class="row">
        <text class="label">最近更新</text>
        <text class="value">2026-02-06</text>
      </view>
      <view class="row" @tap="showProtocol('user')">
        <text class="label">用户协议</text>
        <text class="value link">查看</text>
      </view>
      <view class="row" @tap="showProtocol('privacy')">
        <text class="label">隐私政策</text>
        <text class="value link">查看</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const showProtocol = (type: 'user' | 'privacy') => {
  const title = type === 'user' ? '用户协议' : '隐私政策'
  uni.showModal({
    title,
    content: `${title}内容正在接入正式文档。`,
    showCancel: false,
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 24rpx;
}

.brand-card {
  background: linear-gradient(140deg, rgba(8, 145, 178, 0.95), rgba(34, 211, 238, 0.95));
  border-radius: 24rpx;
  padding: 48rpx 24rpx;
  text-align: center;
  color: #fff;
  box-shadow: 0 14rpx 34rpx rgba(8, 145, 178, 0.26);
}

.logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: #ffffff;
  padding: 20rpx;
}

.name {
  display: block;
  margin-top: 18rpx;
  font-size: 36rpx;
  font-weight: 700;
}

.version,
.desc {
  display: block;
}

.version {
  margin-top: 8rpx;
  font-size: 24rpx;
  opacity: 0.95;
}

.desc {
  margin-top: 12rpx;
  font-size: 24rpx;
  opacity: 0.9;
}

.info-card {
  margin-top: 20rpx;
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: $shadow-xs;
}

.row {
  min-height: 94rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1rpx solid $border-color;
}

.row:first-child {
  border-top: none;
}

.label {
  color: $text-color;
  font-size: 28rpx;
}

.value {
  color: $text-color-secondary;
  font-size: 24rpx;
}

.value.link {
  color: $primary-strong;
}
</style>
