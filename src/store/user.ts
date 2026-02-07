import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/api/user'
import { getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLogin = ref<boolean>(false)

  const isAuthExpiredError = (error: any) => {
    const message = String(error?.message || '')
    return message.includes('未登录') || message.includes('token已过期') || message.includes('401')
  }

  const normalizeToken = (input: string) => {
    const token = String(input || '').trim()
    return token
      .replace(/^"(.*)"$/, '$1')
      .replace(/^'(.*)'$/, '$1')
      .trim()
  }

  /**
   * 设置 Token
   */
  function setToken(newToken: string) {
    const normalized = normalizeToken(newToken)
    token.value = normalized
    isLogin.value = !!normalized
    if (normalized) {
      uni.setStorageSync('token', normalized)
    } else {
      uni.removeStorageSync('token')
    }
  }

  /**
   * 设置用户信息
   */
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
    uni.setStorageSync('userInfo', info)
  }

  /**
   * 登录
   */
  async function login(newToken: string, loginUserInfo?: UserInfo | null) {
    setToken(newToken)

    if (loginUserInfo) {
      setUserInfo(loginUserInfo)
    }

    // 无论登录响应是否包含用户信息，都校验一次 token 可用性
    const ok = await fetchUserInfo()
    if (!ok) {
      clearAuthState()
      throw new Error('未登录或token已过期')
    }
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    try {
      const info = await getUserInfo()
      setUserInfo(info)
      return true
    } catch (error) {
      if (!isAuthExpiredError(error)) {
        console.error('获取用户信息失败:', error)
      }
      return false
    }
  }

  /**
   * 清理登录状态
   */
  function clearAuthState() {
    token.value = ''
    userInfo.value = null
    isLogin.value = false
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  }

  /**
   * 登出
   */
  function logout() {
    clearAuthState()
    uni.reLaunch({
      url: '/pages/login/login',
    })
  }

  /**
   * 初始化
   */
  function init() {
    const savedToken = uni.getStorageSync('token')
    const savedUserInfo = uni.getStorageSync('userInfo')

    if (savedToken) {
      token.value = savedToken
      isLogin.value = true
    }

    if (savedUserInfo) {
      userInfo.value = savedUserInfo
    }
  }

  return {
    token,
    userInfo,
    isLogin,
    setToken,
    setUserInfo,
    login,
    logout,
    clearAuthState,
    fetchUserInfo,
    init,
  }
})
