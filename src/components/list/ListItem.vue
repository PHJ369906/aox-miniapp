<template>
  <view class="aox-list-item" :class="itemClass" @tap="handleClick">
    <!-- 左侧图标 -->
    <view v-if="icon || $slots.icon" class="item-icon">
      <slot name="icon">
        <text class="icon-text">{{ icon }}</text>
      </slot>
    </view>

    <!-- 左侧内容 -->
    <view class="item-content">
      <view class="item-title">
        <slot name="title">
          <text>{{ title }}</text>
        </slot>
      </view>
      <view v-if="desc || $slots.desc" class="item-desc">
        <slot name="desc">
          <text>{{ desc }}</text>
        </slot>
      </view>
    </view>

    <!-- 右侧内容 -->
    <view v-if="value || $slots.value" class="item-value">
      <slot name="value">
        <text>{{ value }}</text>
      </slot>
    </view>

    <!-- 徽标 -->
    <view v-if="badge" class="item-badge">
      <text class="badge-text">{{ badge }}</text>
    </view>

    <!-- 右侧箭头 -->
    <view v-if="arrow" class="item-arrow">
      <text class="arrow-icon">›</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string // 标题
  desc?: string // 描述
  value?: string // 右侧值
  icon?: string // 左侧图标（emoji或文字）
  arrow?: boolean // 是否显示箭头
  badge?: string | number // 徽标
  border?: boolean // 是否显示底部边框
  clickable?: boolean // 是否可点击
}

const props = withDefaults(defineProps<Props>(), {
  arrow: false,
  border: true,
  clickable: true,
})

const emit = defineEmits<{
  click: []
}>()

const itemClass = computed(() => {
  return {
    'item-border': props.border,
    'item-clickable': props.clickable,
  }
})

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.aox-list-item {
  display: flex;
  align-items: center;
  padding: 32rpx 24rpx;
  background-color: #fff;
  transition: background-color 0.2s;

  &.item-border {
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  &.item-clickable:active {
    background-color: #f8f8f8;
  }

  .item-icon {
    margin-right: 24rpx;

    .icon-text {
      font-size: 48rpx;
    }
  }

  .item-content {
    flex: 1;

    .item-title {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 8rpx;
    }

    .item-desc {
      font-size: 24rpx;
      color: #999;
    }
  }

  .item-value {
    margin-right: 16rpx;
    font-size: 28rpx;
    color: #666;
  }

  .item-badge {
    margin-right: 16rpx;

    .badge-text {
      display: inline-block;
      min-width: 36rpx;
      height: 36rpx;
      line-height: 36rpx;
      padding: 0 12rpx;
      font-size: 20rpx;
      color: #fff;
      text-align: center;
      background-color: #ff4444;
      border-radius: 18rpx;
    }
  }

  .item-arrow {
    .arrow-icon {
      font-size: 48rpx;
      color: #ccc;
      font-weight: 300;
    }
  }
}
</style>
