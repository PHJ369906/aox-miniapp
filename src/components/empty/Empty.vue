<template>
  <view class="aox-empty" :style="emptyStyle">
    <!-- 图标 -->
    <view class="empty-icon">
      <slot name="icon">
        <text class="icon-text">{{ iconMap[type] }}</text>
      </slot>
    </view>

    <!-- 描述文字 -->
    <view class="empty-desc">
      <slot name="desc">
        <text>{{ desc || descMap[type] }}</text>
      </slot>
    </view>

    <!-- 操作按钮 -->
    <view v-if="$slots.action || actionText" class="empty-action">
      <slot name="action">
        <button class="action-btn" @tap="handleAction">{{ actionText }}</button>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'empty' | 'error' | 'network' | 'search' // 空状态类型
  desc?: string // 描述文字
  actionText?: string // 操作按钮文字
  padding?: string // 内边距
}

const props = withDefaults(defineProps<Props>(), {
  type: 'empty',
  padding: '120rpx 60rpx',
})

const emit = defineEmits<{
  action: []
}>()

// 图标映射
const iconMap = {
  empty: '空',
  error: '错',
  network: '网',
  search: '搜',
}

// 描述文字映射
const descMap = {
  empty: '暂无数据',
  error: '加载失败',
  network: '网络连接失败',
  search: '没有找到相关内容',
}

const emptyStyle = computed(() => {
  const styles: any = {}
  if (props.padding) styles.padding = props.padding
  return styles
})

const handleAction = () => {
  emit('action')
}
</script>

<style lang="scss" scoped>
@use "@/uni.scss" as *;

.aox-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .empty-icon {
    width: 140rpx;
    height: 140rpx;
    border-radius: 70rpx;
    border: 1rpx solid $border-color;
    background: $surface-color;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-text {
      font-size: 48rpx;
      font-weight: 600;
      color: $text-color-secondary;
      opacity: 0.9;
    }
  }

  .empty-desc {
    margin-top: 32rpx;
    font-size: 28rpx;
    color: $text-color-secondary;
    text-align: center;
  }

  .empty-action {
    margin-top: 48rpx;

    .action-btn {
      padding: 16rpx 48rpx;
      font-size: 28rpx;
      color: $primary-strong;
      background-color: transparent;
      border: 1rpx solid $primary-strong;
      border-radius: 32rpx;

      &::after {
        border: none;
      }
    }
  }
}
</style>
