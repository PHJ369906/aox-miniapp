<template>
  <view class="page">
    <view class="list" v-if="favorites.length > 0">
      <view class="card" v-for="item in favorites" :key="item.id">
        <image class="thumb" :src="item.image" mode="aspectFill" />
        <view class="meta">
          <text class="title">{{ item.title }}</text>
          <text class="desc">{{ item.desc }}</text>
          <text class="time">收藏于 {{ item.time }}</text>
        </view>
        <button class="remove" size="mini" @tap="removeFavorite(item.id)">取消</button>
      </view>
    </view>

    <view class="empty" v-else>
      <text class="empty-title">还没有收藏内容</text>
      <text class="empty-desc">浏览首页并收藏感兴趣的内容</text>
      <button class="go-home" @tap="goHome">去首页</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getFavoriteList, removeFavorite as removeFavoriteApi } from '@/api/favorite'
import type { FavoriteItem } from '@/api/favorite'

const favorites = ref<FavoriteItem[]>([])

const loadFavorites = async () => {
  try {
    const page = await getFavoriteList(1, 100)
    favorites.value = page.records || []
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    console.error('加载收藏列表失败:', error)
  }
}

const removeFavorite = (id: number) => {
  uni.showModal({
    title: '取消收藏',
    content: '确认取消这条收藏吗？',
    success: async (res) => {
      if (!res.confirm) return
      try {
        await removeFavoriteApi(id)
        favorites.value = favorites.value.filter((item) => item.id !== id)
        uni.showToast({
          title: '已取消收藏',
          icon: 'success',
        })
      } catch (error: any) {
        uni.showToast({
          title: error?.message || '取消收藏失败',
          icon: 'none',
        })
      }
    },
  })
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}

onShow(() => {
  loadFavorites()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 20rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.card {
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  padding: 16rpx;
  display: flex;
  gap: 14rpx;
  align-items: center;
  box-shadow: $shadow-xs;
}

.thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  background: #e2e8f0;
}

.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.title {
  color: $text-color;
  font-size: 28rpx;
  font-weight: 600;
}

.desc,
.time {
  color: $text-color-secondary;
  font-size: 23rpx;
}

.remove {
  min-width: 104rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 999rpx;
  border: none;
  color: $error-color;
  background: #fee2e2;
  font-size: 22rpx;
}

.remove::after {
  border: none;
}

.empty {
  margin-top: 24rpx;
  text-align: center;
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  padding: 90rpx 24rpx;
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

.go-home {
  margin-top: 22rpx;
  width: 220rpx;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  color: #fff;
  font-size: 28rpx;
}

.go-home::after {
  border: none;
}
</style>
