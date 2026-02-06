import { post, get } from '@/utils/request'

/**
 * 账号密码登录请求
 */
export interface PasswordLoginRequest {
  username: string
  password: string
}

/**
 * 短信验证码登录请求
 */
export interface SmsLoginRequest {
  phone: string
  code: string
}

/**
 * 发送验证码请求
 */
export interface SendSmsCodeRequest {
  phone: string
}

/**
 * 微信登录请求
 */
export interface WxLoginRequest {
  code: string
  encryptedData?: string
  iv?: string
  userInfo?: any
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string
  refreshToken?: string
  user?: {
    userId: number
    nickname: string
    avatar: string
    phone: string
  }
}

/**
 * 用户信息
 */
export interface UserInfo {
  userId: number
  openid?: string
  nickname: string
  avatar: string
  gender: number
  phone: string
  country?: string
  province?: string
  city?: string
}

/**
 * 账号密码登录
 */
export function passwordLogin(data: PasswordLoginRequest) {
  return post<LoginResponse>('/v1/miniapp/auth/login/password', data)
}

/**
 * 短信验证码登录
 */
export function smsLogin(data: SmsLoginRequest) {
  return post<LoginResponse>('/v1/miniapp/auth/login/sms', data)
}

/**
 * 发送短信验证码
 */
export function sendSmsCode(data: SendSmsCodeRequest) {
  return post<void>('/v1/miniapp/auth/sms/send', data)
}

/**
 * 微信登录
 */
export function wxLogin(data: WxLoginRequest) {
  return post<LoginResponse>('/v1/miniapp/auth/login/wechat', data)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return get<UserInfo>('/v1/miniapp/user/info')
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: Partial<UserInfo>) {
  return post<void>('/v1/miniapp/user/update', data)
}

/**
 * 绑定手机号
 */
export function bindPhone(data: { phone: string; code: string }) {
  return post<void>('/v1/miniapp/user/bind-phone', data)
}
