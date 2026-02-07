import { del, get, post, put } from '@/utils/request'

export interface AddressItem {
  id: number
  name: string
  phone: string
  region: string
  detail: string
  isDefault: boolean
}

export interface CreateAddressRequest {
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault?: boolean
}

export interface AddressDetail extends CreateAddressRequest {
  id: number
}

export function getAddressList() {
  return get<AddressItem[]>('/v1/miniapp/addresses')
}

export function getAddressDetail(id: number) {
  return get<AddressDetail>(`/v1/miniapp/addresses/${id}`)
}

export function createAddress(data: CreateAddressRequest) {
  return post<void>('/v1/miniapp/addresses', data)
}

export function updateAddress(id: number, data: CreateAddressRequest) {
  return put<void>(`/v1/miniapp/addresses/${id}`, data)
}

export function setDefaultAddress(id: number) {
  return put<void>(`/v1/miniapp/addresses/${id}/default`)
}

export function removeAddress(id: number) {
  return del<void>(`/v1/miniapp/addresses/${id}`)
}
