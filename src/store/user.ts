import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/api/user'
import { getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLogin = ref<boolean>(false)

  /**
   * 设置 Token
   */
  function setToken(newToken: string) {
    token.value = newToken
    isLogin.value = !!newToken
    uni.setStorageSync('token', newToken)
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
  async function login(newToken: string) {
    setToken(newToken)
    await fetchUserInfo()
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    try {
      const info = await getUserInfo()
      setUserInfo(info)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  /**
   * 登出
   */
  function logout() {
    token.value = ''
    userInfo.value = null
    isLogin.value = false
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
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
    fetchUserInfo,
    init,
  }
})
