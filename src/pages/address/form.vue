<template>
  <view class="page">
    <view class="form-card">
      <view class="form-item">
        <text class="label">收件人</text>
        <input class="input" v-model.trim="form.receiverName" placeholder="请输入收件人姓名" maxlength="30" />
      </view>

      <view class="form-item">
        <text class="label">手机号</text>
        <input
          class="input"
          type="number"
          v-model.trim="form.receiverPhone"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>

      <view class="form-item">
        <text class="label">省份</text>
        <input class="input" v-model.trim="form.province" placeholder="例如：浙江省" maxlength="50" />
      </view>

      <view class="form-item">
        <text class="label">城市</text>
        <input class="input" v-model.trim="form.city" placeholder="例如：杭州市" maxlength="50" />
      </view>

      <view class="form-item">
        <text class="label">区县</text>
        <input class="input" v-model.trim="form.district" placeholder="例如：西湖区" maxlength="50" />
      </view>

      <view class="form-item textarea-item">
        <text class="label">详细地址</text>
        <textarea
          class="textarea"
          v-model.trim="form.detailAddress"
          placeholder="街道、门牌号、楼层、房号等"
          maxlength="200"
          :show-confirm-bar="false"
        />
      </view>

      <view class="form-item switch-item" @tap="form.isDefault = !form.isDefault">
        <text class="label">设为默认地址</text>
        <view class="switch" :class="{ active: form.isDefault }">
          <view class="dot"></view>
        </view>
      </view>
    </view>

    <view class="footer">
      <button class="submit-btn" :loading="submitting" @tap="submit">{{ isEdit ? '保存修改' : '保存地址' }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { createAddress, getAddressDetail, updateAddress } from '@/api/address'

const submitting = ref(false)
const addressId = ref(0)

const form = reactive({
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false,
})

const isEdit = computed(() => addressId.value > 0)

const isValidPhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone)

const loadAddressDetail = async () => {
  if (!isEdit.value) return

  try {
    const detail = await getAddressDetail(addressId.value)
    form.receiverName = detail.receiverName || ''
    form.receiverPhone = detail.receiverPhone || ''
    form.province = detail.province || ''
    form.city = detail.city || ''
    form.district = detail.district || ''
    form.detailAddress = detail.detailAddress || ''
    form.isDefault = Boolean(detail.isDefault)
  } catch (error: any) {
    uni.showToast({ title: error?.message || '地址不存在', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 600)
  }
}

const submit = async () => {
  if (!form.receiverName) {
    uni.showToast({ title: '请输入收件人', icon: 'none' })
    return
  }
  if (!isValidPhone(form.receiverPhone)) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' })
    return
  }
  if (!form.province || !form.city || !form.district) {
    uni.showToast({ title: '请完善省市区信息', icon: 'none' })
    return
  }
  if (!form.detailAddress) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    const payload = {
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      province: form.province,
      city: form.city,
      district: form.district,
      detailAddress: form.detailAddress,
      isDefault: form.isDefault,
    }

    if (isEdit.value) {
      await updateAddress(addressId.value, payload)
      uni.showToast({ title: '地址已更新', icon: 'success' })
    } else {
      await createAddress(payload)
      uni.showToast({ title: '地址已保存', icon: 'success' })
    }

    setTimeout(() => {
      uni.navigateBack()
    }, 600)
  } catch (error: any) {
    uni.showToast({ title: error?.message || '保存失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

onLoad((query) => {
  const id = Number(query?.id || 0)
  addressId.value = Number.isFinite(id) && id > 0 ? id : 0

  uni.setNavigationBarTitle({
    title: isEdit.value ? '编辑地址' : '新增地址',
  })

  loadAddressDetail()
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 20rpx 20rpx 140rpx;
}

.form-card {
  background: $surface-color;
  border: 1rpx solid $border-color;
  border-radius: 22rpx;
  overflow: hidden;
}

.form-item {
  display: flex;
  align-items: center;
  min-height: 94rpx;
  padding: 0 24rpx;
  border-bottom: 1rpx solid $border-color;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  width: 170rpx;
  color: $text-color;
  font-size: 27rpx;
  flex-shrink: 0;
}

.input {
  flex: 1;
  color: $text-color;
  font-size: 27rpx;
}

.textarea-item {
  align-items: flex-start;
  padding-top: 24rpx;
  padding-bottom: 24rpx;
}

.textarea {
  flex: 1;
  min-height: 160rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 14rpx;
  font-size: 26rpx;
  color: $text-color;
}

.switch-item {
  justify-content: space-between;
}

.switch-item .label {
  width: auto;
}

.switch {
  width: 88rpx;
  height: 50rpx;
  border-radius: 999rpx;
  background: #cbd5e1;
  padding: 4rpx;
  transition: all 0.2s;
}

.switch .dot {
  width: 42rpx;
  height: 42rpx;
  border-radius: 21rpx;
  background: #fff;
  transition: all 0.2s;
}

.switch.active {
  background: $primary-color;
}

.switch.active .dot {
  transform: translateX(38rpx);
}

.footer {
  position: fixed;
  left: 20rpx;
  right: 20rpx;
  bottom: 24rpx;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 999rpx;
  border: none;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
}

.submit-btn::after {
  border: none;
}
</style>
