<template>
  <view class="mine-container">
    <!-- 头部用户信息 -->
    <view class="user-header">
      <view class="user-info">
        <image
          class="avatar"
          :src="userInfo?.avatar || '/static/default-avatar.png'"
          mode="aspectFill"
          @tap="handleAvatarClick"
        />
        <view class="info">
          <view class="nickname">{{ userInfo?.nickname || '未登录' }}</view>
          <view class="phone">{{ userInfo?.phone || '暂无手机号' }}</view>
        </view>
        <view class="edit-btn" @tap="goToEditProfile">
          <text class="text">编辑</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="section-title">常用功能</view>
      <view class="menu-list">
        <view
          class="menu-item"
          v-for="item in menuList"
          :key="item.id"
          @tap="handleMenuClick(item)"
        >
          <view class="menu-icon">
            <image class="menu-icon-image" :src="item.icon" mode="aspectFit" />
          </view>
          <view class="menu-info">
            <text class="menu-title">{{ item.title }}</text>
            <text class="menu-desc" v-if="item.desc">{{ item.desc }}</text>
          </view>
          <view class="menu-arrow">›</view>
        </view>
      </view>
    </view>

    <!-- 设置菜单 -->
    <view class="menu-section">
      <view class="section-title">设置</view>
      <view class="menu-list">
        <view
          class="menu-item"
          v-for="item in settingList"
          :key="item.id"
          @tap="handleMenuClick(item)"
        >
          <view class="menu-icon">
            <image class="menu-icon-image" :src="item.icon" mode="aspectFit" />
          </view>
          <view class="menu-info">
            <text class="menu-title">{{ item.title }}</text>
          </view>
          <view class="menu-arrow">›</view>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text class="version-text">版本号：v1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 常用功能菜单
const menuList = ref([
  {
    id: 1,
    title: '我的订单',
    desc: '查看订单详情',
    icon: '/static/icons/order.svg',
    path: '/pages/order/list',
  },
  {
    id: 2,
    title: '我的收藏',
    desc: '收藏的内容',
    icon: '/static/icons/favorite.svg',
    path: '/pages/favorite/list',
  },
  {
    id: 3,
    title: '我的地址',
    desc: '管理收货地址',
    icon: '/static/icons/address.svg',
    path: '/pages/address/list',
  },
  {
    id: 4,
    title: '我的消息',
    desc: '系统通知',
    icon: '/static/icons/message.svg',
    path: '/pages/message/list',
  },
])

// 设置菜单
const settingList = ref([
  {
    id: 1,
    title: '账号与安全',
    icon: '/static/icons/security.svg',
    path: '/pages/setting/security',
  },
  {
    id: 2,
    title: '隐私设置',
    icon: '/static/icons/privacy.svg',
    path: '/pages/setting/privacy',
  },
  {
    id: 3,
    title: '关于我们',
    icon: '/static/icons/about.svg',
    path: '/pages/setting/about',
  },
])

/**
 * 点击头像
 */
const handleAvatarClick = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      // TODO: 上传头像到服务器
      uni.showToast({
        title: '头像上传功能开发中',
        icon: 'none',
      })
    },
  })
}

/**
 * 前往编辑个人资料
 */
const goToEditProfile = () => {
  uni.navigateTo({
    url: '/pages/mine/edit',
  })
}

/**
 * 菜单点击
 */
const handleMenuClick = (item: any) => {
  if (item.path) {
    // TODO: 实现具体页面后，取消注释
    // uni.navigateTo({
    //   url: item.path,
    // })
    uni.showToast({
      title: '功能开发中',
      icon: 'none',
    })
  }
}

/**
 * 退出登录
 */
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 调用 store 的登出方法
        userStore.logout()
      }
    },
  })
}

onMounted(() => {
  // 检查登录状态
  if (!userStore.isLogin) {
    uni.reLaunch({
      url: '/pages/login/login',
    })
  } else {
    // 刷新用户信息
    userStore.fetchUserInfo()
  }
})
</script>

<style lang="scss" scoped>
@use "@/uni.scss" as *;

.mine-container {
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 40rpx;
}

.user-header {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  padding: 60rpx 32rpx 80rpx;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60rpx;
    background-color: $bg-color;
    border-radius: 32rpx 32rpx 0 0;
  }

  .user-info {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      background-color: $surface-color;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 24rpx;
    }

    .info {
      flex: 1;

      .nickname {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 12rpx;
      }

      .phone {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .edit-btn {
      display: flex;
      align-items: center;
      padding: 12rpx 24rpx;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 32rpx;
      backdrop-filter: blur(10rpx);

      .text {
        font-size: 24rpx;
        color: #fff;
      }
    }
  }
}

.menu-section {
  margin: 32rpx 32rpx 0;

  .section-title {
    font-size: 28rpx;
    color: $text-color-secondary;
    margin-bottom: 16rpx;
    padding-left: 8rpx;
  }

  .menu-list {
    background-color: $surface-color;
    border-radius: 20rpx;
    overflow: hidden;
    border: 1rpx solid $border-color;
    box-shadow: $shadow-xs;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 32rpx 24rpx;
      border-bottom: 1rpx solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .menu-icon {
        width: 72rpx;
        height: 72rpx;
        border-radius: 20rpx;
        background: rgba(8, 145, 178, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24rpx;

        .menu-icon-image {
          width: 40rpx;
          height: 40rpx;
        }
      }

      .menu-info {
        flex: 1;

        .menu-title {
          font-size: 28rpx;
          color: $text-color;
          display: block;
          margin-bottom: 8rpx;
        }

        .menu-desc {
          font-size: 24rpx;
          color: $text-color-secondary;
        }
      }

      .menu-arrow {
        font-size: 48rpx;
        color: $text-color-placeholder;
        font-weight: 300;
      }
    }
  }
}

.logout-section {
  margin: 60rpx 32rpx 32rpx;

  .logout-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: $surface-color;
    color: $error-color;
    font-size: 32rpx;
    border-radius: 44rpx;
    border: 1rpx solid $border-color;
    box-shadow: $shadow-xs;

    &::after {
      border: none;
    }
  }
}

.version-info {
  text-align: center;
  padding: 32rpx 0;

  .version-text {
    font-size: 24rpx;
    color: $text-color-secondary;
  }
}
</style>
