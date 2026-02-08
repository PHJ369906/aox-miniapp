/**
 * HTTP 请求配置
 */

const BASE_URL = import.meta.env.VITE_APP_BASE_API || 'http://localhost:8080/api'
let isRedirectingToLogin = false

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
}

interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
  timestamp: number
}

/**
 * HTTP 请求封装
 */
export function request<T = any>(config: RequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data, header = {} } = config
    const token = uni.getStorageSync('token')
    const rawToken = token ? String(token).trim() : ''

    const handleUnauthorized = (msg: string) => {
      // Token 过期，清理本地状态并跳转登录
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')

      // 通知全局清理内存中的用户态（Pinia）
      const uniAny = uni as any
      if (typeof uniAny.$emit === 'function') {
        uniAny.$emit('auth-expired')
      }

      // 避免多个并发请求触发重复跳转
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true
        uni.reLaunch({
          url: '/pages/login/login',
        })
        setTimeout(() => {
          isRedirectingToLogin = false
        }, 800)
      }
      reject(new Error(msg || '未登录或token已过期'))
    }

    const requestHeader: Record<string, any> = { ...header }
    if (rawToken) {
      requestHeader.Authorization = rawToken.toLowerCase().startsWith('bearer ')
        ? rawToken
        : `Bearer ${rawToken}`
    }

    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...requestHeader,
      },
      success: (res: any) => {
        const statusCode = Number(res?.statusCode || 0)
        const response = res.data as ApiResponse<T>
        const code = Number((response as any)?.code)

        if (code === 0) {
          resolve(response.data)
          return
        }

        if (statusCode === 401 || code === 401) {
          handleUnauthorized(response.msg)
          return
        }

        uni.showToast({
          title: response.msg || '请求失败',
          icon: 'none',
        })
        reject(new Error(response.msg || '请求失败'))
      },
      fail: (err) => {
        console.error('请求失败:', err)
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({ url, method: 'GET', data })
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({ url, method: 'POST', data })
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({ url, method: 'PUT', data })
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({ url, method: 'DELETE', data })
}
