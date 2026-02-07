<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'

onLaunch(() => {
  try {
    // 启动时恢复本地登录态
    const userStore = useUserStore()
    userStore.init()
  } catch (error) {
    console.error('初始化用户状态失败:', error)
  }

  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
page {
  background-color: $bg-color;
  color: $text-color;
  font-family: 'Source Sans 3', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
}
</style>
