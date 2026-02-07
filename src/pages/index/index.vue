<template>
  <view class="index-container">
    <view class="header">
      <view class="greeting">
        <text class="greeting-text">你好，</text>
        <text class="greeting-name">{{ userInfo?.nickname || '游客' }}</text>
      </view>
      <image
        class="avatar"
        :src="userInfo?.avatar || '/static/default-avatar.png'"
        mode="aspectFill"
      />
    </view>

    <view class="banner" v-if="bannerList.length > 0">
      <swiper class="banner-swiper" indicator-dots autoplay circular>
        <swiper-item v-for="item in bannerList" :key="item.id">
          <image class="banner-image" :src="item.imageUrl" mode="aspectFill" @tap="handleBannerClick(item)" />
        </swiper-item>
      </swiper>
    </view>

    <view class="menu-grid">
      <view
        class="menu-item"
        v-for="item in menuList"
        :key="item.id"
        @tap="handleMenuClick(item)"
      >
        <view class="menu-icon">
          <image class="menu-icon-image" :src="item.icon" mode="aspectFit" />
        </view>
        <text class="menu-title">{{ item.title }}</text>
      </view>
    </view>

    <view class="notice">
      <view class="notice-header">
        <text class="notice-title">最新公告</text>
      </view>
      <view class="notice-item" v-for="item in noticeList" :key="item.noticeId" @tap="handleNoticeClick(item)">
        <text class="notice-content">{{ item.noticeTitle }}</text>
        <text class="notice-time">{{ formatTime(item.publishTime) }}</text>
      </view>
      <view class="notice-empty" v-if="noticeList.length === 0">
        <text>暂无公告</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { getBannerList } from '@/api/banner'
import { getLatestNotices } from '@/api/notice'
import type { Banner } from '@/api/banner'
import type { Notice } from '@/api/notice'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// Banner列表
const bannerList = ref<Banner[]>([])

// 菜单列表
const menuList = ref([
  { id: 1, title: '功能一', icon: '/static/icons/feature-1.svg', path: '' },
  { id: 2, title: '功能二', icon: '/static/icons/feature-2.svg', path: '' },
  { id: 3, title: '功能三', icon: '/static/icons/feature-3.svg', path: '' },
  { id: 4, title: '功能四', icon: '/static/icons/feature-4.svg', path: '' },
])

// 公告列表
const noticeList = ref<Notice[]>([])

// 加载Banner列表
const loadBanners = async () => {
  try {
    const banners = await getBannerList()
    bannerList.value = banners || []
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    console.error('加载Banner失败:', error)
  }
}

// 加载公告列表
const loadNotices = async () => {
  try {
    const notices = await getLatestNotices(5)
    noticeList.value = notices || []
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    console.error('加载公告失败:', error)
  }
}

/**
 * 菜单点击
 */
const handleMenuClick = (item: any) => {
  if (item.path) {
    uni.navigateTo({
      url: item.path,
    })
  } else {
    uni.showToast({
      title: '功能开发中',
      icon: 'none',
    })
  }
}

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  if (!time) return ''
  return time.substring(0, 10)
}

/**
 * 公告点击
 */
const handleNoticeClick = (item: Notice) => {
  if (!item?.noticeId) return
  uni.navigateTo({
    url: `/pages/notice/detail?noticeId=${item.noticeId}`,
  })
}

/**
 * Banner点击
 */
const handleBannerClick = (item: Banner) => {
  if (item.linkType === 0 || !item.linkUrl) {
    return
  }

  if (item.linkType === 1) {
    // 内部页面
    uni.navigateTo({
      url: item.linkUrl,
    })
  } else if (item.linkType === 2) {
    // 外部链接
    // 小程序不支持直接跳转外部链接，可以使用web-view或复制链接
    uni.showModal({
      title: '提示',
      content: '即将跳转到外部链接',
      success: (res) => {
        if (res.confirm) {
          // 可以跳转到web-view页面
          console.log('外部链接:', item.linkUrl)
        }
      },
    })
  }
}

onMounted(() => {
  // 检查登录状态
  if (!userStore.isLogin) {
    uni.reLaunch({
      url: '/pages/login/login',
    })
    return
  }

  // 加载Banner
  loadBanners()

  // 加载公告
  loadNotices()
})
</script>

<style lang="scss" scoped>

.index-container {
  min-height: 100vh;
  background-color: $bg-color;
}

.header {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  padding: 64rpx 32rpx 56rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -24rpx;
    height: 48rpx;
    background: $bg-color;
    border-radius: 32rpx 32rpx 0 0;
  }

  .greeting {
    .greeting-text {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
    }

    .greeting-name {
      font-size: 40rpx;
      font-weight: bold;
      color: #fff;
      display: block;
      margin-top: 8rpx;
    }
  }

  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
  }
}

.banner {
  margin: 32rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: $shadow-xs;

  .banner-swiper {
    width: 100%;
    height: 300rpx;
  }

  .banner-image {
    width: 100%;
    height: 300rpx;
    background-color: #e2e8f0;
  }
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
  padding: 32rpx;
  background-color: $surface-color;
  margin: 0 32rpx;
  border-radius: 20rpx;
  border: 1rpx solid $border-color;
  box-shadow: $shadow-xs;

  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .menu-icon {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 16rpx;
      background-color: rgba(8, 145, 178, 0.12);
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .menu-icon-image {
        width: 44rpx;
        height: 44rpx;
      }
    }

    .menu-title {
      font-size: 24rpx;
      color: $text-color;
    }
  }
}

.notice {
  margin: 32rpx;
  padding: 24rpx;
  background-color: $surface-color;
  border-radius: 20rpx;
  border: 1rpx solid $border-color;
  box-shadow: $shadow-xs;

  .notice-header {
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 1rpx solid $border-color;

    .notice-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $text-color;
    }
  }

  .notice-item {
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .notice-content {
      font-size: 28rpx;
      color: $text-color;
      display: block;
      margin-bottom: 8rpx;
    }

    .notice-time {
      font-size: 24rpx;
      color: $text-color-secondary;
    }
  }

  .notice-empty {
    padding: 40rpx 0;
    text-align: center;
    color: $text-color-secondary;
    font-size: 28rpx;
  }
}
</style>
