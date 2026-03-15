<template>
  <view class="edit-profile-page">
    <!-- 自定义裁剪弹窗 -->
    <view class="crop-modal-mask" v-if="cropModalVisible" @click="closeCropModal">
      <view class="crop-modal" @click.stop>
        <view class="crop-header">
          <text class="crop-title">裁剪头像</text>
          <view class="crop-actions">
            <text class="crop-cancel" @click="closeCropModal">取消</text>
            <text class="crop-confirm" @click="confirmCrop">完成</text>
          </view>
        </view>
        <view class="crop-container">
          <view class="crop-wrapper" :style="{ transform: `scale(${cropScale})` }">
            <image 
              :src="cropImagePath" 
              class="crop-image"
              mode="aspectFit"
            />
          </view>
          <!-- 可拖拽的裁剪框 -->
          <view 
            class="crop-frame"
            :style="{
              left: cropFrameX + 'px',
              top: cropFrameY + 'px',
              width: cropFrameSize + 'px',
              height: cropFrameSize + 'px'
            }"
            @touchstart="onFrameTouchStart"
            @touchmove="onFrameTouchMove"
            @touchend="onFrameTouchEnd"
          >
            <!-- 四个角落拖拽手柄 -->
            <view 
              class="crop-handle tl" 
              @touchstart.stop="onHandleTouchStart($event, 'tl')"
              @touchmove.stop="onHandleTouchMove"
              @touchend.stop="onHandleTouchEnd"
            ></view>
            <view 
              class="crop-handle tr" 
              @touchstart.stop="onHandleTouchStart($event, 'tr')"
              @touchmove.stop="onHandleTouchMove"
              @touchend.stop="onHandleTouchEnd"
            ></view>
            <view 
              class="crop-handle bl" 
              @touchstart.stop="onHandleTouchStart($event, 'bl')"
              @touchmove.stop="onHandleTouchMove"
              @touchend.stop="onHandleTouchEnd"
            ></view>
            <view 
              class="crop-handle br" 
              @touchstart.stop="onHandleTouchStart($event, 'br')"
              @touchmove.stop="onHandleTouchMove"
              @touchend.stop="onHandleTouchEnd"
            ></view>
            <!-- 四边拖拽手柄 -->
            <view 
              class="crop-handle t" 
              @touchstart.stop="onHandleTouchStart($event, 't')"
              @touchmove.stop="onHandleTouchMove"
              @touchend.stop="onHandleTouchEnd"
            ></view>
            <view 
              class="crop-handle b" 
              @touchstart.stop="onHandleTouchStart($event, 'b')"
              @touchmove.stop="onHandleTouchMove"
              @touchend.stop="onHandleTouchEnd"
            ></view>
            <view 
              class="crop-handle l" 
              @touchstart.stop="onHandleTouchStart($event, 'l')"
              @touchmove.stop="onHandleTouchMove"
              @touchend.stop="onHandleTouchEnd"
            ></view>
            <view 
              class="crop-handle r" 
              @touchstart.stop="onHandleTouchStart($event, 'r')"
              @touchmove.stop="onHandleTouchMove"
              @touchend.stop="onHandleTouchEnd"
            ></view>
          </view>
        </view>
        <view class="crop-footer">
          <view class="crop-zoom">
            <text class="zoom-label">缩放</text>
            <slider 
              :value="cropScale * 100" 
              @change="onZoomChange"
              min="50" 
              max="200" 
              activeColor="#E07B54"
              block-color="#E07B54"
              block-size="18"
              class="zoom-slider"
            />
            <text class="zoom-value">{{ Math.round(cropScale * 100) }}%</text>
          </view>
          <view class="crop-size">
            <text class="size-label">裁剪框大小</text>
            <slider 
              :value="cropFrameSize" 
              @change="onSizeChange"
              min="100" 
              max="280" 
              activeColor="#E07B54"
              block-color="#E07B54"
              block-size="18"
              class="size-slider"
            />
            <text class="size-value">{{ cropFrameSize }}px</text>
          </view>
        </view>
      </view>
    </view>

    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">编辑资料</text>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 头像 -->
      <view class="avatar-section">
        <image
          :src="form.avatar || '/static/default-avatar.svg'"
          class="avatar"
          mode="aspectFill"
          @click="changeAvatar"
        />
        <text class="change-text">点击更换头像</text>
      </view>

      <!-- 表单 -->
      <view class="form-section">
        <view class="form-item">
          <text class="label">昵称</text>
          <input
            type="text"
            v-model="form.nickname"
            placeholder="请输入昵称"
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="label">邮箱</text>
          <view class="readonly-field" @click="goToSettings">
            <text class="readonly-value">{{ form.email || '未绑定' }}</text>
            <text class="readonly-tip">请在设置中绑定</text>
          </view>
        </view>

        <view class="form-item">
          <text class="label">手机号</text>
          <view class="readonly-field" @click="goToSettings">
            <text class="readonly-value">{{ form.phone || '未绑定' }}</text>
            <text class="readonly-tip">请在设置中绑定</text>
          </view>
        </view>

        <view class="form-item">
          <text class="label">个人简介</text>
          <textarea
            v-model="form.bio"
            placeholder="介绍一下自己吧..."
            class="textarea"
            maxlength="200"
          />
          <text class="char-count">{{ form.bio?.length || 0 }}/200</text>
        </view>

        <view class="form-item">
          <text class="label">学校</text>
          <input
            type="text"
            v-model="form.schoolName"
            placeholder="请输入学校名称"
            class="input"
          />
        </view>

        <view class="form-item">
          <text class="label">学段</text>
          <picker mode="selector" :range="educationLevels" :value="educationIndex" @change="onEducationChange">
            <view class="picker">
              <text :class="{ placeholder: !form.educationLevel }">{{ educationText }}</text>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </view>
          </picker>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="action-section">
        <button
          type="button"
          class="save-btn"
          :class="{ loading: loading }"
          :disabled="loading"
          @click="saveProfile"
        >
          <text v-if="!loading">保存</text>
          <view v-else class="btn-spinner"></view>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { uploadAvatar, cropImage, userApi } from '@/api/index'

const userStore = useUserStore()

const form = ref({
  avatar: '',
  nickname: '',
  email: '',
  phone: '',
  bio: '',
  schoolName: '',
  educationLevel: null as number | null
})

const loading = ref(false)

const educationLevels = ['小学', '初中', '高中', '本科', '硕士', '博士']
const educationIndex = computed(() => {
  return form.value.educationLevel ? form.value.educationLevel - 1 : 0
})
const educationText = computed(() => {
  if (!form.value.educationLevel) return '请选择学段'
  return educationLevels[form.value.educationLevel - 1]
})

onMounted(() => {
  // 加载当前用户信息
  const userInfo = userStore.userInfo
  if (userInfo) {
    form.value = {
      avatar: userInfo.avatar || '',
      nickname: userInfo.nickname || '',
      email: userInfo.email || '',
      phone: userInfo.phone || '',
      bio: userInfo.bio || '',
      schoolName: userInfo.schoolName || '',
      educationLevel: userInfo.educationLevel || null
    }
  }
})

const onEducationChange = (e: any) => {
  form.value.educationLevel = e.detail.value + 1
}

// 裁剪功能状态
const cropModalVisible = ref(false)
const cropImagePath = ref('')
const cropScale = ref(1)
const cropFrameX = ref(50)
const cropFrameY = ref(50)
const cropFrameSize = ref(200)

// 拖拽状态
let isDragging = false
let isResizing = false
let resizeHandle = ''
let dragStartX = 0
let dragStartY = 0
let frameStartX = 0
let frameStartY = 0
let frameStartSize = 0

const closeCropModal = () => {
  cropModalVisible.value = false
  cropImagePath.value = ''
  cropScale.value = 1
}

const confirmCrop = async () => {
  try {
    uni.showLoading({ title: '裁剪中...' })
    
    const result = await cropImage({
      imageUrl: cropImagePath.value,
      x: cropFrameX.value,
      y: cropFrameY.value,
      width: cropFrameSize.value,
      height: cropFrameSize.value,
      scale: cropScale.value
    })
    
    form.value.avatar = result.fileUrl
    uni.showToast({ title: '更换成功', icon: 'success' })
  } catch (err) {
    uni.showToast({ title: '裁剪失败', icon: 'none' })
    console.error(err)
  } finally {
    uni.hideLoading()
    closeCropModal()
  }
}

const onZoomChange = (e: any) => {
  cropScale.value = e.detail.value / 100
}

const onSizeChange = (e: any) => {
  cropFrameSize.value = e.detail.value
}

const onFrameTouchStart = (e: TouchEvent) => {
  isDragging = true
  dragStartX = e.touches[0].clientX
  dragStartY = e.touches[0].clientY
  frameStartX = cropFrameX.value
  frameStartY = cropFrameY.value
}

const onFrameTouchMove = (e: TouchEvent) => {
  if (!isDragging) return
  const dx = e.touches[0].clientX - dragStartX
  const dy = e.touches[0].clientY - dragStartY
  cropFrameX.value = Math.max(0, Math.min(frameStartX + dx, 300 - cropFrameSize.value))
  cropFrameY.value = Math.max(0, Math.min(frameStartY + dy, 400 - cropFrameSize.value))
}

const onFrameTouchEnd = () => {
  isDragging = false
}

const onHandleTouchStart = (e: TouchEvent, handle: string) => {
  e.stopPropagation()
  isResizing = true
  resizeHandle = handle
  dragStartX = e.touches[0].clientX
  dragStartY = e.touches[0].clientY
  frameStartX = cropFrameX.value
  frameStartY = cropFrameY.value
  frameStartSize = cropFrameSize.value
}

const onHandleTouchMove = (e: TouchEvent) => {
  if (!isResizing) return
  e.stopPropagation()
  const moveX = e.touches[0].clientX - dragStartX
  const moveY = e.touches[0].clientY - dragStartY
  
  let newSize = frameStartSize
  let newX = frameStartX
  let newY = frameStartY
  
  switch (resizeHandle) {
    case 'br':
      newSize = Math.max(100, Math.min(frameStartSize + moveX, 280))
      newSize = Math.max(100, Math.min(newSize + moveY, 280))
      break
    case 'bl':
      newSize = Math.max(100, Math.min(frameStartSize - moveX, 280))
      newX = frameStartX + (frameStartSize - newSize)
      newSize = Math.max(100, Math.min(newSize + moveY, 280))
      break
    case 'tr':
      newSize = Math.max(100, Math.min(frameStartSize + moveX, 280))
      newY = frameStartY + (frameStartSize - newSize)
      newSize = Math.max(100, Math.min(newSize - moveY, 280))
      break
    case 'tl':
      newSize = Math.max(100, Math.min(frameStartSize - moveX, 280))
      newX = frameStartX + (frameStartSize - newSize)
      newSize = Math.max(100, Math.min(newSize - moveY, 280))
      newY = frameStartY + (frameStartSize - newSize)
      break
    case 'r':
      newSize = Math.max(100, Math.min(frameStartSize + moveX, 280))
      break
    case 'l':
      newSize = Math.max(100, Math.min(frameStartSize - moveX, 280))
      newX = frameStartX + (frameStartSize - newSize)
      break
    case 'b':
      newSize = Math.max(100, Math.min(frameStartSize + moveY, 280))
      break
    case 't':
      newSize = Math.max(100, Math.min(frameStartSize - moveY, 280))
      newY = frameStartY + (frameStartSize - newSize)
      break
  }
  
  cropFrameSize.value = newSize
  cropFrameX.value = Math.max(0, newX)
  cropFrameY.value = Math.max(0, newY)
}

const onHandleTouchEnd = () => {
  isResizing = false
}

const changeAvatar = async () => {
  try {
    // 1. 选择图片
    const res = await uni.chooseImage({ count: 1 })
    const tempFilePath = res.tempFilePaths[0]

    // 2. 询问用户是否裁剪
    const shouldCrop = await new Promise<boolean>((resolve) => {
      uni.showActionSheet({
        itemList: ['裁剪图片', '不裁剪直接使用'],
        success: (res) => {
          resolve(res.tapIndex === 0)
        },
        fail: () => {
          resolve(false)
        }
      })
    })

    if (shouldCrop) {
      // 检查是否支持系统裁剪
      if (typeof uni.cropImage === 'function') {
        try {
          const cropRes = await new Promise<any>((resolve, reject) => {
            (uni as any).cropImage({
              src: tempFilePath,
              success: (res: any) => resolve(res),
              fail: (err: any) => reject(err)
            })
          })
          await uploadAndSaveAvatar(cropRes.tempFilePath)
        } catch (cropErr: any) {
          if (cropErr?.errMsg?.includes('cancel')) {
            return
          }
          // 裁剪失败使用原图
          await uploadAndSaveAvatar(tempFilePath)
        }
      } else {
        // 不支持系统裁剪，使用自定义裁剪弹窗
        // 先上传图片获取真实URL
        uni.showLoading({ title: '上传中...' })
        try {
          const uploadResult = await uploadAvatar(tempFilePath)
          cropImagePath.value = uploadResult.fileUrl
          cropScale.value = 1
          cropFrameX.value = 50
          cropFrameY.value = 50
          cropFrameSize.value = 200
          cropModalVisible.value = true
        } catch (uploadErr) {
          uni.showToast({ title: '上传失败', icon: 'none' })
        } finally {
          uni.hideLoading()
        }
      }
    } else {
      // 不裁剪，直接使用原图
      await uploadAndSaveAvatar(tempFilePath)
    }

  } catch (err: any) {
    // 用户取消不提示错误
    if (err?.errMsg?.includes('cancel')) {
      return
    }
    uni.showToast({ title: '选择图片失败', icon: 'none' })
    console.error(err)
  }
}

const uploadAndSaveAvatar = async (filePath: string) => {
  try {
    uni.showLoading({ title: '上传中...' })
    const file = await uploadAvatar(filePath)
    form.value.avatar = file.fileUrl
    uni.showToast({ title: '更换成功', icon: 'success' })
  } catch (err) {
    uni.showToast({ title: '上传失败了', icon: 'none' })
    console.error(err)
  } finally {
    uni.hideLoading()
  }
}

const saveProfile = async () => {
  loading.value = true

  try {
    // 调用后端API更新用户信息
    console.log('开始更新用户信息，avatar:', form.value.avatar)
    const updatedUserInfo = await userApi.updateUser({
      nickname: form.value.nickname,
      avatar: form.value.avatar,
      email: form.value.email,
      phone: form.value.phone,
      bio: form.value.bio,
      schoolName: form.value.schoolName,
      educationLevel: form.value.educationLevel || undefined
    })
    
    console.log('更新用户信息成功:', updatedUserInfo)

    // 更新本地存储的用户信息
    userStore.userInfo = updatedUserInfo
    uni.setStorageSync('userInfo', updatedUserInfo)

    uni.showToast({
      title: '资料更新成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error: any) {
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}

const goToSettings = () => {
  uni.navigateTo({ url: '/pages/user/settings' })
}
</script>

<style scoped>
.edit-profile-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-light);
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-right {
  width: 40px;
}

.content-area {
  margin-top: 60px;
  height: calc(100vh - 60px);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 12px;
  border: 3px solid var(--bg-card);
  box-shadow: 0 0 0 2px var(--accent-warm);
}

.change-text {
  font-size: 14px;
  color: var(--accent-warm);
}

.form-section {
  background: var(--bg-card);
  margin: 0 16px 16px;
  border-radius: 16px;
  padding: 0 16px;
  border: 1px solid var(--border-light);
}

.form-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: block;
}

.input {
  width: 100%;
  height: 44px;
  font-size: 15px;
  color: var(--text-primary);
  background: transparent;
}

.input[disabled] {
  color: var(--text-tertiary);
}

.readonly-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
  cursor: pointer;
}

.readonly-value {
  font-size: 15px;
  color: var(--text-tertiary);
}

.readonly-tip {
  font-size: 12px;
  color: var(--accent-warm);
}

.textarea {
  width: 100%;
  height: 100px;
  font-size: 15px;
  color: var(--text-primary);
  background: transparent;
  line-height: 1.6;
}

.char-count {
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: right;
  display: block;
  margin-top: 4px;
}

.picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  font-size: 15px;
  color: var(--text-primary);
}

.picker .placeholder {
  color: var(--text-tertiary);
}

.action-section {
  padding: 16px;
}

.save-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn[disabled] {
  opacity: 0.6;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.crop-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 1000;
}

.crop-modal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.crop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.crop-title {
  font-size: 17px;
  font-weight: 600;
}

.crop-actions {
  display: flex;
  gap: 20px;
}

.crop-cancel {
  font-size: 16px;
  color: #999;
}

.crop-confirm {
  font-size: 16px;
  color: #E07B54;
  font-weight: 600;
}

.crop-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.crop-wrapper {
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
}

.crop-image {
  width: 280px;
  height: 280px;
  max-width: 280px;
  max-height: 280px;
}

.crop-frame {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid #E07B54;
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  touch-action: none;
}

.crop-handle {
  position: absolute;
  background: #E07B54;
}

.crop-handle.tl,
.crop-handle.tr,
.crop-handle.bl,
.crop-handle.br {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.crop-handle.tl { top: -10px; left: -10px; cursor: nwse-resize; }
.crop-handle.tr { top: -10px; right: -10px; cursor: nesw-resize; }
.crop-handle.bl { bottom: -10px; left: -10px; cursor: nesw-resize; }
.crop-handle.br { bottom: -10px; right: -10px; cursor: nwse-resize; }

.crop-handle.t,
.crop-handle.b {
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 10px;
}

.crop-handle.t { top: -5px; cursor: ns-resize; }
.crop-handle.b { bottom: -5px; cursor: ns-resize; }

.crop-handle.l,
.crop-handle.r {
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 30px;
}

.crop-handle.l { left: -5px; cursor: ew-resize; }
.crop-handle.r { right: -5px; cursor: ew-resize; }

.crop-footer {
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.8);
}

.crop-zoom,
.crop-size {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.crop-size {
  margin-bottom: 0;
}

.zoom-label,
.size-label {
  color: #999;
  font-size: 14px;
}

.zoom-slider,
.size-slider {
  flex: 1;
}

.zoom-value,
.size-value {
  color: white;
  font-size: 14px;
  min-width: 45px;
  text-align: right;
}
</style>
