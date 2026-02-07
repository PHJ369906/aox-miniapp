import { get, post } from '@/utils/request'

export interface MessageItem {
  id: number
  title: string
  content: string
  time: string
  read: boolean
}

interface PageResponse<T> {
  records: T[]
  total: number
  current: number
  size: number
}

export function getMessageList(pageNum: number, pageSize: number) {
  return get<PageResponse<MessageItem>>('/v1/miniapp/messages', { pageNum, pageSize })
}

export function markMessageRead(id: number) {
  return post<void>(`/v1/miniapp/messages/${id}/read`)
}

export function markAllMessagesRead() {
  return post<void>('/v1/miniapp/messages/read-all')
}

export function getUnreadMessageCount() {
  return get<number>('/v1/miniapp/messages/unread-count')
}
