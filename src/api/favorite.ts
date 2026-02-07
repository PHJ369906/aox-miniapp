import { del, get } from '@/utils/request'

export interface FavoriteItem {
  id: number
  title: string
  desc: string
  time: string
  image: string
}

interface PageResponse<T> {
  records: T[]
  total: number
  current: number
  size: number
}

export function getFavoriteList(pageNum: number, pageSize: number) {
  return get<PageResponse<FavoriteItem>>('/v1/miniapp/favorites', { pageNum, pageSize })
}

export function removeFavorite(id: number) {
  return del<void>(`/v1/miniapp/favorites/${id}`)
}
