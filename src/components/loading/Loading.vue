<template>
  <view v-if="visible" class="aox-loading" :class="loadingClass">
    <!-- 加载图标 -->
    <view class="loading-icon">
      <view class="spinner" :class="spinnerClass"></view>
    </view>

    <!-- 加载文字 -->
    <view v-if="text" class="loading-text">
      <text>{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible?: boolean // 是否显示
  text?: string // 加载文字
  fullscreen?: boolean // 是否全屏
  size?: 'small' | 'medium' | 'large' // 尺寸
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  fullscreen: false,
  size: 'medium',
})

const loadingClass = computed(() => {
  return {
    'loading-fullscreen': props.fullscreen,
  }
})

const spinnerClass = computed(() => {
  return {
    'spinner-small': props.size === 'small',
    'spinner-medium': props.size === 'medium',
    'spinner-large': props.size === 'large',
  }
})
</script>

<style lang="scss" scoped>
@use "@/uni.scss" as *;

.aox-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;

  &.loading-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(248, 250, 252, 0.95);
    z-index: 9999;
  }

  .loading-icon {
    .spinner {
      border: 4rpx solid $border-color;
      border-top-color: $primary-color;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;

      &.spinner-small {
        width: 48rpx;
        height: 48rpx;
      }

      &.spinner-medium {
        width: 64rpx;
        height: 64rpx;
      }

      &.spinner-large {
        width: 80rpx;
        height: 80rpx;
      }
    }
  }

  .loading-text {
    margin-top: 24rpx;
    font-size: 28rpx;
    color: $text-color-secondary;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
