<template>
  <view class="login-container">
    <!-- Logo和标题 -->
    <view class="login-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="app-name">Aox 小程序</text>
      <text class="welcome">欢迎使用</text>
    </view>

    <!-- 登录方式切换 -->
    <view class="login-tabs">
      <view
        class="tab-item"
        :class="{ active: loginType === 'password' }"
        @tap="switchLoginType('password')"
      >
        <text>账号登录</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: loginType === 'sms' }"
        @tap="switchLoginType('sms')"
      >
        <text>验证码登录</text>
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="login-form">
      <!-- 账号密码登录 -->
      <view v-if="loginType === 'password'" class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <view class="input-wrapper">
            <input
              class="input"
              type="text"
              v-model="passwordForm.username"
              placeholder="请输入手机号/账号"
              placeholder-class="placeholder"
            />
          </view>
        </view>

        <view class="form-item">
          <text class="label">密码</text>
          <view class="input-wrapper">
            <input
              class="input"
              :type="showPassword ? 'text' : 'password'"
              v-model="passwordForm.password"
              placeholder="请输入密码"
              placeholder-class="placeholder"
            />
            <text class="toggle-pwd" @tap="showPassword = !showPassword">
              {{ showPassword ? '隐藏' : '显示' }}
            </text>
          </view>
        </view>

        <button
          class="login-btn"
          @tap="handlePasswordLogin"
          :loading="loading"
          :disabled="!passwordForm.username || !passwordForm.password"
        >
          <text v-if="!loading">登录</text>
          <text v-else>登录中...</text>
        </button>
      </view>

      <!-- 手机验证码登录 -->
      <view v-if="loginType === 'sms'" class="form-content">
        <view class="form-item">
          <text class="label">手机号</text>
          <view class="input-wrapper">
            <input
              class="input"
              type="number"
              v-model="smsForm.phone"
              placeholder="请输入手机号"
              placeholder-class="placeholder"
              maxlength="11"
            />
          </view>
        </view>

        <view class="form-item">
          <text class="label">验证码</text>
          <view class="input-wrapper">
            <input
              class="input"
              type="number"
              v-model="smsForm.code"
              placeholder="请输入验证码"
              placeholder-class="placeholder"
              maxlength="6"
            />
            <button
              class="send-code-btn"
              size="mini"
              @tap="handleSendCode"
              :disabled="countdown > 0 || !isValidPhone"
            >
              {{ countdown > 0 ? `${countdown}秒` : '发送验证码' }}
            </button>
          </view>
        </view>

        <button
          class="login-btn"
          @tap="handleSmsLogin"
          :loading="loading"
          :disabled="!smsForm.phone || !smsForm.code"
        >
          <text v-if="!loading">登录</text>
          <text v-else>登录中...</text>
        </button>
      </view>
    </view>

    <!-- 微信一键登录 -->
    <view class="wx-login">
      <view class="divider">
        <text class="divider-text">或</text>
      </view>
      <button class="wx-login-btn" @tap="handleWxLogin" :loading="wxLoading">
        <view class="wx-dot"></view>
        <text>微信一键登录</text>
      </button>
    </view>

    <!-- 用户协议 -->
    <view class="login-tips">
      <text class="tips-text">登录即表示同意</text>
      <text class="tips-link" @tap="showProtocol('user')">《用户协议》</text>
      <text class="tips-text">和</text>
      <text class="tips-link" @tap="showProtocol('privacy')">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'
import { passwordLogin, smsLogin, sendSmsCode, wxLogin } from '@/api/user'
import type { UserInfo } from '@/api/user'

const userStore = useUserStore()

// 登录方式：password-账号密码，sms-验证码
const loginType = ref<'password' | 'sms'>('password')
const loading = ref(false)
const wxLoading = ref(false)
const showPassword = ref(false)

// 账号密码登录表单
const passwordForm = ref({
  username: '',
  password: '',
})

// 验证码登录表单
const smsForm = ref({
  phone: '',
  code: '',
})

// 验证码倒计时
const countdown = ref(0)
let countdownTimer: number | null = null

/**
 * 兼容不同后端字段名，提取 token
 */
const resolveLoginToken = (res: any): string => {
  const token =
    res?.tokens?.accessToken ||
    res?.tokens?.token ||
    res?.accessToken ||
    res?.token ||
    res?.authToken ||
    res?.jwt ||
    res?.jwtToken ||
    res?.data?.tokens?.accessToken ||
    res?.data?.tokens?.token ||
    res?.data?.accessToken ||
    res?.data?.token ||
    res?.access_token ||
    res?.data?.access_token
  if (typeof token !== 'string') {
    return ''
  }
  return token
    .trim()
    .replace(/^"(.*)"$/, '$1')
    .replace(/^'(.*)'$/, '$1')
    .trim()
}

const resolveLoginUserInfo = (res: any): UserInfo | null => {
  const rawUser = res?.user || res?.userInfo || res?.data?.user || res?.data?.userInfo
  if (!rawUser || typeof rawUser !== 'object') {
    return null
  }

  const userId = Number(rawUser.userId ?? rawUser.id ?? 0)
  if (!userId) {
    return null
  }

  return {
    userId,
    openid: rawUser.openid,
    nickname: rawUser.nickname || rawUser.nickName || '',
    avatar: rawUser.avatar || rawUser.avatarUrl || '',
    gender: Number(rawUser.gender ?? 0),
    phone: rawUser.phone || '',
    country: rawUser.country,
    province: rawUser.province,
    city: rawUser.city,
  }
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
    fail: (err) => {
      console.error('切换首页失败:', err)
      uni.reLaunch({
        url: '/pages/index/index',
      })
    },
  })
}

/**
 * 微信游客 AppID 下不支持完整登录能力
 */
const isTouristWeChatAppId = () => {
  // 仅在微信小程序平台检查
  // #ifdef MP-WEIXIN
  try {
    const getAccountInfoSync = (uni as any).getAccountInfoSync
    if (typeof getAccountInfoSync !== 'function') {
      return false
    }
    const accountInfo = getAccountInfoSync()
    const appId = accountInfo?.miniProgram?.appId
    return !appId || appId === 'touristappid'
  } catch (error) {
    console.warn('读取小程序 AppID 失败:', error)
    return false
  }
  // #endif
  return false
}

// 切换登录方式
const switchLoginType = (type: 'password' | 'sms') => {
  loginType.value = type
}

// 验证手机号
const isValidPhone = computed(() => {
  return /^1[3-9]\d{9}$/.test(smsForm.value.phone)
})

/**
 * 账号密码登录
 */
const handlePasswordLogin = async () => {
  if (!passwordForm.value.username || !passwordForm.value.password) {
    uni.showToast({
      title: '请输入账号和密码',
      icon: 'none',
    })
    return
  }

  loading.value = true

  try {
    const res = await passwordLogin({
      username: passwordForm.value.username,
      password: passwordForm.value.password,
    })

    const token = resolveLoginToken(res)
    if (!token) {
      throw new Error('登录响应缺少 token')
    }

    // 保存 token 和用户信息
    await userStore.login(token, resolveLoginUserInfo(res))
    if (!userStore.isLogin) {
      throw new Error('登录状态校验失败，请重试')
    }

    uni.showToast({
      title: '登录成功',
      icon: 'success',
    })

    setTimeout(() => {
      goHome()
    }, 1000)
  } catch (error: any) {
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

/**
 * 发送验证码
 */
const handleSendCode = async () => {
  if (!isValidPhone.value) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    })
    return
  }

  try {
    await sendSmsCode({ phone: smsForm.value.phone })

    uni.showToast({
      title: '验证码已发送',
      icon: 'success',
    })

    // 开始倒计时
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000) as unknown as number
  } catch (error: any) {
    uni.showToast({
      title: error.message || '发送失败',
      icon: 'none',
    })
  }
}

/**
 * 验证码登录
 */
const handleSmsLogin = async () => {
  if (!smsForm.value.phone || !smsForm.value.code) {
    uni.showToast({
      title: '请输入手机号和验证码',
      icon: 'none',
    })
    return
  }

  loading.value = true

  try {
    const res = await smsLogin({
      phone: smsForm.value.phone,
      code: smsForm.value.code,
    })

    const token = resolveLoginToken(res)
    if (!token) {
      throw new Error('登录响应缺少 token')
    }

    // 保存 token 和用户信息
    await userStore.login(token, resolveLoginUserInfo(res))
    if (!userStore.isLogin) {
      throw new Error('登录状态校验失败，请重试')
    }

    uni.showToast({
      title: '登录成功',
      icon: 'success',
    })

    setTimeout(() => {
      goHome()
    }, 1000)
  } catch (error: any) {
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

/**
 * 微信登录
 */
const handleWxLogin = () => {
  if (isTouristWeChatAppId()) {
    uni.showModal({
      title: '无法使用微信登录',
      content: '当前是游客模式（touristappid），请在 manifest.json 配置真实微信小程序 AppID 后重试。',
      showCancel: false,
    })
    return
  }

  wxLoading.value = true

  // 1. 获取微信登录 code
  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      try {
        const code = loginRes.code

        // 2. 获取用户信息
        uni.getUserProfile({
          desc: '用于完善用户资料',
          success: async (infoRes) => {
            try {
              // 3. 调用后端登录接口
              const res = await wxLogin({
                code,
                encryptedData: infoRes.encryptedData,
                iv: infoRes.iv,
                userInfo: infoRes.userInfo,
              })

              const token = resolveLoginToken(res)
              if (!token) {
                throw new Error('登录响应缺少 token')
              }

              // 4. 保存 token 和用户信息
              await userStore.login(token, resolveLoginUserInfo(res))
              if (!userStore.isLogin) {
                throw new Error('登录状态校验失败，请重试')
              }

              uni.showToast({
                title: '登录成功',
                icon: 'success',
              })

              setTimeout(() => {
                goHome()
              }, 1000)
            } catch (error: any) {
              console.error('登录失败:', error)
              uni.showToast({
                title: error.message || '登录失败',
                icon: 'none',
              })
            } finally {
              wxLoading.value = false
            }
          },
          fail: () => {
            wxLoading.value = false
            uni.showToast({
              title: '需要授权才能登录',
              icon: 'none',
            })
          },
        })
      } catch (error) {
        wxLoading.value = false
        console.error('获取用户信息失败:', error)
      }
    },
    fail: () => {
      wxLoading.value = false
      uni.showToast({
        title: '登录失败，请重试',
        icon: 'none',
      })
    },
  })
}

/**
 * 显示协议
 */
const showProtocol = (type: 'user' | 'privacy') => {
  const title = type === 'user' ? '用户协议' : '隐私政策'
  uni.showModal({
    title,
    content: `这里是${title}的内容`,
    showCancel: false,
  })
}

// 页面卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style lang="scss" scoped>

.login-container {
  min-height: 100vh;
  background:
    radial-gradient(600rpx circle at 10% 0%, rgba(34, 211, 238, 0.3), transparent 60%),
    radial-gradient(520rpx circle at 90% 0%, rgba(34, 197, 94, 0.2), transparent 55%),
    $bg-color;
  padding: 72rpx 56rpx 120rpx;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;

  .logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
    margin-bottom: 40rpx;
    background-color: $surface-color;
    box-shadow: $shadow-sm;
  }

  .app-name {
    font-size: 48rpx;
    font-weight: bold;
    color: $text-color;
    margin-bottom: 16rpx;
  }

  .welcome {
    font-size: 28rpx;
    color: $text-color-secondary;
  }
}

.login-tabs {
  display: flex;
  background-color: $surface-color;
  border-radius: 44rpx;
  padding: 8rpx;
  margin-bottom: 60rpx;
  border: 1rpx solid $border-color;
  box-shadow: $shadow-xs;

  .tab-item {
    flex: 1;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 36rpx;
    font-size: 28rpx;
    color: $text-color-secondary;
    transition: all 0.3s;

    &.active {
      background-color: rgba(8, 145, 178, 0.12);
      color: $primary-strong;
      font-weight: bold;
    }
  }
}

.login-form {
  margin-bottom: 60rpx;

  .form-content {
    .form-item {
      margin-bottom: 32rpx;
      display: flex;
      flex-direction: column;
      gap: 12rpx;

      .label {
        font-size: 24rpx;
        color: $text-color-secondary;
      }

      .input-wrapper {
        background-color: $surface-color;
        border-radius: 48rpx;
        padding: 0 28rpx;
        display: flex;
        align-items: center;
        height: 96rpx;
        border: 1rpx solid $border-color;

        .input {
          flex: 1;
          font-size: 28rpx;
          color: $text-color;

          .placeholder {
            color: $text-color-placeholder;
          }
        }

        .toggle-pwd {
          font-size: 24rpx;
          padding: 0 16rpx;
          color: $primary-strong;
        }

        .send-code-btn {
          background-color: transparent;
          color: $primary-strong;
          border: none;
          font-size: 24rpx;
          padding: 0 24rpx;
          height: 56rpx;
          line-height: 56rpx;

          &::after {
            border: none;
          }

          &[disabled] {
            color: $text-color-placeholder;
          }
        }
      }
    }

    .login-btn {
      width: 100%;
      height: 88rpx;
      border-radius: 44rpx;
      font-size: 32rpx;
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: $shadow-sm;
      margin-top: 48rpx;

      &::after {
        border: none;
      }

      &[disabled] {
        opacity: 0.6;
      }
    }
  }
}

.wx-login {
  .divider {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1rpx;
      background-color: $border-color;
    }

    .divider-text {
      margin: 0 32rpx;
      font-size: 24rpx;
      color: $text-color-secondary;
    }
  }

  .wx-login-btn {
    width: 100%;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    background-color: $surface-color;
    color: $text-color;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1rpx solid $border-color;
    box-shadow: $shadow-xs;

    &::after {
      border: none;
    }

    .wx-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 8rpx;
      background: $accent-color;
      margin-right: 16rpx;
    }
  }
}

.login-tips {
  margin-top: 60rpx;
  text-align: center;
  font-size: 24rpx;
  color: $text-color-secondary;

  .tips-link {
    color: $primary-strong;
    text-decoration: underline;
  }
}
</style>
