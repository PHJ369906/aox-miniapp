<template>
  <view class="aox-list" :style="listStyle">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  border?: boolean // 是否显示边框
  radius?: string // 圆角大小
}

const props = withDefaults(defineProps<Props>(), {
  border: true,
  radius: '16rpx',
})

const listStyle = computed(() => {
  const styles: any = {}
  if (props.radius) styles.borderRadius = props.radius
  return styles
})
</script>

<style lang="scss" scoped>
.aox-list {
  background-color: #fff;
  overflow: hidden;
}
</style>
