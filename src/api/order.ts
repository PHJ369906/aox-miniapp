import { get } from '@/utils/request'

export type OrderStatus = 'all' | 'pay' | 'ship' | 'receive' | 'refund'

export interface OrderItem {
  id: string
  status: Exclude<OrderStatus, 'all'>
  title: string
  amount: number
  time: string
}

export interface OrderStats {
  all: number
  pay: number
  ship: number
  receive: number
  refund: number
}

interface PageResponse<T> {
  records: T[]
  total: number
  current: number
  size: number
}

export function getOrderList(pageNum: number, pageSize: number, status: OrderStatus = 'all') {
  const params: Record<string, any> = { pageNum, pageSize }
  if (status !== 'all') {
    params.status = status
  }
  return get<PageResponse<OrderItem>>('/v1/miniapp/orders', params)
}

export function getOrderStats() {
  return get<OrderStats>('/v1/miniapp/orders/stats')
}
