/**
 * 路由守卫工具
 * 统一登录检查封装
 */

import { useUserStore } from '@/store/user'

/**
 * 需要登录的页面路径
 */
const AUTH_PAGES = [
  '/pages/user/index',
  '/pages/order/index',
  '/pages/order/detail',
  '/pages/address/index',
  '/pages/address/edit',
  '/pages/message/index',
]

/**
 * 白名单页面（不需要登录）
 */
const WHITE_LIST = [
  '/pages/index/index',
  '/pages/login/login',
  '/pages/category/index',
]

/**
 * 检查页面是否需要登录
 */
export function requiresAuth(path: string): boolean {
  // 白名单页面不需要登录
  if (WHITE_LIST.some((p) => path.startsWith(p))) {
    return false
  }
  // 检查是否在需要认证的页面列表中
  return AUTH_PAGES.some((p) => path.startsWith(p))
}

/**
 * 检查登录状态，未登录则跳转登录页
 * @param redirectUrl 登录后重定向的页面
 * @returns 是否已登录
 */
export function checkAuth(redirectUrl?: string): boolean {
  const userStore = useUserStore()

  if (!userStore.isLogin) {
    const redirect = redirectUrl ? encodeURIComponent(redirectUrl) : ''
    uni.navigateTo({
      url: `/pages/login/login${redirect ? `?redirect=${redirect}` : ''}`,
    })
    return false
  }

  return true
}

/**
 * 页面跳转前检查登录状态
 * @param url 目标页面路径
 * @param options 跳转选项
 */
export function navigateWithAuth(
  url: string,
  options?: { type?: 'navigateTo' | 'redirectTo' | 'reLaunch' }
): void {
  const { type = 'navigateTo' } = options || {}

  if (requiresAuth(url)) {
    if (!checkAuth(url)) {
      return
    }
  }

  const navigateMethods = {
    navigateTo: (opts: { url: string }) => uni.navigateTo(opts),
    redirectTo: (opts: { url: string }) => uni.redirectTo(opts),
    reLaunch: (opts: { url: string }) => uni.reLaunch(opts),
  }

  navigateMethods[type]({ url })
}

/**
 * 路由守卫拦截器（用于 uni.addInterceptor）
 */
export function setupRouteGuard(): void {
  const pageInterceptor = {
    invoke(args: { url: string }) {
      const url = args.url.split('?')[0]

      if (requiresAuth(url)) {
        const userStore = useUserStore()
        if (!userStore.isLogin) {
          uni.navigateTo({
            url: `/pages/login/login?redirect=${encodeURIComponent(args.url)}`,
          })
          return false
        }
      }
      return true
    },
  }

  uni.addInterceptor('navigateTo', pageInterceptor)
  uni.addInterceptor('redirectTo', pageInterceptor)
  uni.addInterceptor('reLaunch', pageInterceptor)
}
