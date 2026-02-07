<template>
  <view class="page">
    <view class="list" v-if="addressList.length > 0">
      <view class="address-card" v-for="item in addressList" :key="item.id">
        <view class="head">
          <view class="contact">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
          </view>
          <text v-if="item.isDefault" class="default-tag">默认</text>
        </view>
        <text class="detail">{{ item.region }} {{ item.detail }}</text>
        <view class="actions">
          <text class="action" @tap="editAddress(item.id)">编辑</text>
          <text class="action" @tap="setDefault(item.id)">设为默认</text>
          <text class="action danger" @tap="removeAddress(item.id)">删除</text>
        </view>
      </view>
    </view>

    <view class="empty" v-else>
      <text class="empty-title">暂无地址</text>
      <text class="empty-desc">新增后可快速选择收货地址</text>
    </view>

    <view class="footer">
      <button class="add-btn" @tap="addAddress">新增地址</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getAddressList, setDefaultAddress, removeAddress as removeAddressApi } from '@/api/address'
import type { AddressItem } from '@/api/address'

const addressList = ref<AddressItem[]>([])

const loadAddressList = async () => {
  try {
    const list = await getAddressList()
    addressList.value = list || []
  } catch (error: any) {
    if (error?.message?.includes('未登录') || error?.message?.includes('token已过期')) {
      return
    }
    console.error('加载地址列表失败:', error)
  }
}

const setDefault = async (id: number) => {
  try {
    await setDefaultAddress(id)
    await loadAddressList()
    uni.showToast({
      title: '默认地址已更新',
      icon: 'success',
    })
  } catch (error: any) {
    uni.showToast({
      title: error?.message || '设置默认地址失败',
      icon: 'none',
    })
  }
}

const editAddress = (id: number) => {
  uni.navigateTo({
    url: `/pages/address/form?id=${id}`,
  })
}

const removeAddress = (id: number) => {
  uni.showModal({
    title: '删除地址',
    content: '确认删除该地址吗？',
    success: async (res) => {
      if (!res.confirm) return
      try {
        await removeAddressApi(id)
        await loadAddressList()
        uni.showToast({
          title: '地址已删除',
          icon: 'success',
        })
      } catch (error: any) {
        uni.showToast({
          title: error?.message || '删除地址失败',
          icon: 'none',
        })
      }
    },
  })
}

const addAddress = () => {
  uni.navigateTo({
    url: '/pages/address/form',
  })
}

onShow(() => {
  loadAddressList()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 20rpx 20rpx 140rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.address-card {
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: $shadow-xs;
}

.head,
.contact,
.actions {
  display: flex;
  align-items: center;
}

.head {
  justify-content: space-between;
}

.contact {
  gap: 14rpx;
}

.name {
  color: $text-color;
  font-size: 30rpx;
  font-weight: 600;
}

.phone {
  color: $text-color-secondary;
  font-size: 24rpx;
}

.default-tag {
  min-width: 74rpx;
  height: 40rpx;
  border-radius: 999rpx;
  background: rgba(8, 145, 178, 0.12);
  color: $primary-strong;
  font-size: 22rpx;
  line-height: 40rpx;
  text-align: center;
}

.detail {
  margin-top: 12rpx;
  color: $text-color;
  font-size: 25rpx;
  line-height: 1.5;
}

.actions {
  margin-top: 14rpx;
  gap: 24rpx;
}

.action {
  color: $primary-strong;
  font-size: 24rpx;
}

.action.danger {
  color: $error-color;
}

.empty {
  margin-top: 24rpx;
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 20rpx;
  padding: 90rpx 24rpx;
  text-align: center;
}

.empty-title {
  display: block;
  color: $text-color;
  font-size: 32rpx;
  font-weight: 600;
}

.empty-desc {
  display: block;
  margin-top: 10rpx;
  color: $text-color-secondary;
  font-size: 24rpx;
}

.footer {
  position: fixed;
  left: 20rpx;
  right: 20rpx;
  bottom: 24rpx;
}

.add-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

.add-btn::after {
  border: none;
}
</style>
