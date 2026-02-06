/**
 * HTTP 请求配置
 */

const BASE_URL = 'http://localhost:8080/api'

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

    // 获取 Token
    const token = uni.getStorageSync('token')
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success: (res: any) => {
        const response = res.data as ApiResponse<T>

        if (response.code === 0) {
          resolve(response.data)
        } else if (response.code === 401) {
          // Token 过期，跳转登录
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.reLaunch({
            url: '/pages/login/login',
          })
          reject(new Error(response.msg))
        } else {
          uni.showToast({
            title: response.msg || '请求失败',
            icon: 'none',
          })
          reject(new Error(response.msg))
        }
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
