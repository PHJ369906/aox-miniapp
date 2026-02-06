<template>
  <view class="aox-card" :class="cardClass" :style="cardStyle">
    <!-- 标题区域 -->
    <view v-if="title || $slots.title" class="card-header">
      <slot name="title">
        <text class="card-title">{{ title }}</text>
      </slot>
      <view v-if="$slots.extra" class="card-extra">
        <slot name="extra"></slot>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="card-body" :style="bodyStyle">
      <slot></slot>
    </view>

    <!-- 底部区域 -->
    <view v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string // 卡片标题
  shadow?: 'always' | 'hover' | 'never' // 阴影类型
  padding?: string // 内边距
  margin?: string // 外边距
  bordered?: boolean // 是否显示边框
  radius?: string // 圆角大小
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'always',
  padding: '32rpx',
  bordered: true,
  radius: '16rpx',
})

// 卡片样式类
const cardClass = computed(() => {
  return {
    'card-shadow-always': props.shadow === 'always',
    'card-shadow-hover': props.shadow === 'hover',
    'card-shadow-never': props.shadow === 'never',
    'card-bordered': props.bordered,
  }
})

// 卡片样式
const cardStyle = computed(() => {
  const styles: any = {}
  if (props.margin) styles.margin = props.margin
  if (props.radius) styles.borderRadius = props.radius
  return styles
})

// 内容区域样式
const bodyStyle = computed(() => {
  const styles: any = {}
  if (props.padding) styles.padding = props.padding
  return styles
})
</script>

<style lang="scss" scoped>
.aox-card {
  background-color: #fff;
  overflow: hidden;
  transition: all 0.3s;

  &.card-shadow-always {
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  }

  &.card-shadow-hover:active {
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  }

  &.card-shadow-never {
    box-shadow: none;
  }

  &.card-bordered {
    border: 1rpx solid #f0f0f0;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 32rpx 24rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .card-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .card-extra {
      font-size: 28rpx;
      color: #666;
    }
  }

  .card-body {
    // padding在外部通过props控制
  }

  .card-footer {
    padding: 24rpx 32rpx 32rpx;
    border-top: 1rpx solid #f0f0f0;
  }
}
</style>
