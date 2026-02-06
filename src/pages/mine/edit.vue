<template>
  <view class="edit-container">
    <!-- 表单列表 -->
    <view class="form-section">
      <!-- 头像 -->
      <view class="form-item" @tap="handleChooseAvatar">
        <text class="label">头像</text>
        <view class="value-wrapper">
          <image
            class="avatar-preview"
            :src="formData.avatar || '/static/default-avatar.png'"
            mode="aspectFill"
          />
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 昵称 -->
      <view class="form-item">
        <text class="label">昵称</text>
        <input
          class="input"
          type="text"
          v-model="formData.nickname"
          placeholder="请输入昵称"
          maxlength="20"
        />
      </view>

      <!-- 性别 -->
      <view class="form-item" @tap="showGenderPicker = true">
        <text class="label">性别</text>
        <view class="value-wrapper">
          <text class="value">{{ genderText }}</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <text class="label">手机号</text>
        <view class="value-wrapper">
          <text class="value">{{ formData.phone || '未绑定' }}</text>
          <text class="arrow" @tap.stop="handleBindPhone">绑定</text>
        </view>
      </view>

      <!-- 个性签名 -->
      <view class="form-item full">
        <text class="label">个性签名</text>
        <textarea
          class="textarea"
          v-model="formData.signature"
          placeholder="写点什么吧~"
          maxlength="100"
          :show-confirm-bar="false"
        />
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-section">
      <button class="save-btn" type="primary" @tap="handleSave" :loading="loading">
        保存
      </button>
    </view>

    <!-- 性别选择器 -->
    <picker
      v-if="showGenderPicker"
      mode="selector"
      :range="genderOptions"
      range-key="label"
      :value="genderIndex"
      @change="handleGenderChange"
      @cancel="showGenderPicker = false"
    >
      <view></view>
    </picker>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { updateUserInfo } from '@/api/user'

const userStore = useUserStore()
const loading = ref(false)
const showGenderPicker = ref(false)

// 性别选项
const genderOptions = [
  { label: '未知', value: 0 },
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]

// 表单数据
const formData = ref({
  nickname: '',
  avatar: '',
  gender: 0,
  phone: '',
  signature: '',
})

// 性别索引
const genderIndex = computed(() => {
  return genderOptions.findIndex((item) => item.value === formData.value.gender)
})

// 性别文本
const genderText = computed(() => {
  const gender = genderOptions.find((item) => item.value === formData.value.gender)
  return gender ? gender.label : '未知'
})

/**
 * 选择头像
 */
const handleChooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]

      // 显示加载提示
      uni.showLoading({
        title: '上传中...',
      })

      // TODO: 上传到服务器
      // uploadImage(tempFilePath).then(url => {
      //   formData.value.avatar = url
      // })

      // 开发模式：直接使用本地路径
      formData.value.avatar = tempFilePath
      uni.hideLoading()

      uni.showToast({
        title: '头像上传功能开发中',
        icon: 'none',
      })
    },
  })
}

/**
 * 性别改变
 */
const handleGenderChange = (e: any) => {
  const index = e.detail.value
  formData.value.gender = genderOptions[index].value
  showGenderPicker.value = false
}

/**
 * 绑定手机号
 */
const handleBindPhone = () => {
  uni.showToast({
    title: '手机号绑定功能开发中',
    icon: 'none',
  })
}

/**
 * 保存
 */
const handleSave = async () => {
  // 验证昵称
  if (!formData.value.nickname) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none',
    })
    return
  }

  loading.value = true

  try {
    // 调用更新接口
    await updateUserInfo({
      nickname: formData.value.nickname,
      avatar: formData.value.avatar,
      gender: formData.value.gender,
    })

    // 更新本地用户信息
    await userStore.fetchUserInfo()

    uni.showToast({
      title: '保存成功',
      icon: 'success',
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch (error: any) {
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 初始化表单数据
  const userInfo = userStore.userInfo
  if (userInfo) {
    formData.value = {
      nickname: userInfo.nickname || '',
      avatar: userInfo.avatar || '',
      gender: userInfo.gender || 0,
      phone: userInfo.phone || '',
      signature: '',
    }
  }
})
</script>

<style lang="scss" scoped>
@use "@/uni.scss" as *;

.edit-container {
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 120rpx;
}

.form-section {
  margin-top: 32rpx;
  background-color: $surface-color;
  border-radius: 20rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;
  border: 1rpx solid $border-color;
  box-shadow: $shadow-xs;

  .form-item {
    display: flex;
    align-items: center;
    padding: 32rpx 32rpx;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    &.full {
      flex-direction: column;
      align-items: flex-start;
    }

    .label {
      font-size: 28rpx;
      color: $text-color;
      width: 140rpx;
      flex-shrink: 0;
    }

    .input {
      flex: 1;
      font-size: 28rpx;
      color: $text-color;
      text-align: right;
    }

    .textarea {
      width: 100%;
      min-height: 200rpx;
      font-size: 28rpx;
      color: $text-color;
      margin-top: 16rpx;
      padding: 16rpx;
      background-color: #f8fafc;
      border-radius: 16rpx;
      border: 1rpx solid $border-color;
    }

    .value-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .avatar-preview {
        width: 80rpx;
        height: 80rpx;
        border-radius: 40rpx;
        margin-right: 16rpx;
      }

      .value {
        font-size: 28rpx;
        color: $text-color-secondary;
        margin-right: 16rpx;
      }

      .arrow {
        font-size: 48rpx;
        color: $text-color-placeholder;
        font-weight: 300;
      }
    }
  }
}

.save-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background-color: $surface-color;
  box-shadow: 0 -4rpx 16rpx rgba(15, 23, 42, 0.06);

  .save-btn {
    width: 100%;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);

    &::after {
      border: none;
    }
  }
}
</style>
