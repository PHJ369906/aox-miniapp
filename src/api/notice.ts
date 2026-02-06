import { get, post } from '@/utils/request'

/**
 * 公告 API
 */

export interface Notice {
  noticeId: number
  noticeTitle: string
  noticeType: number
  noticeContent: string
  noticeLevel: number
  status: number
  publishTime: string
  publishUserName: string
  isTop: number
  topOrder: number
  readCount: number
}

/**
 * 分页查询已发布公告列表
 */
export const getNoticeList = (pageNum: number, pageSize: number) => {
  return get<{ records: Notice[]; total: number; current: number; size: number }>('/v1/miniapp/notices', {
    pageNum,
    pageSize
  })
}

/**
 * 查询公告详情
 */
export const getNoticeDetail = (noticeId: number) => {
  return get<Notice>(`/v1/miniapp/notices/${noticeId}`)
}

/**
 * 查询最新公告（不分页）
 */
export const getLatestNotices = (limit: number = 5) => {
  return get<Notice[]>('/v1/miniapp/notices/latest', {
    limit
  })
}

/**
 * 上报公告阅读
 */
export const reportNoticeRead = (noticeId: number) => {
  return post<void>(`/v1/miniapp/notices/${noticeId}/read`)
}
