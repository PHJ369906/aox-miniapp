import { get } from '@/utils/request'

/**
 * Banner API
 */

export interface Banner {
  id: number
  title: string
  imageUrl: string
  linkUrl?: string
  linkType: number
  sortOrder: number
  status: number
}

/**
 * 获取已上架Banner列表
 */
export const getBannerList = () => {
  return get<Banner[]>('/v1/miniapp/banners')
}
