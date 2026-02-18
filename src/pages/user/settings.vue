<template>
  <view class="settings-page">
    <!-- 自定义弹窗 -->
    <CustomModal
      :visible="modalVisible"
      :title="modalTitle"
      :content="modalContent"
      :confirm-text="modalConfirmText"
      :cancel-text="modalCancelText"
      :show-cancel="modalShowCancel"
      :confirm-color="modalConfirmColor"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
      @close="handleModalCancel"
    />

    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">设置</text>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 账号安全 -->
      <view class="section">
        <view class="section-title">账号安全</view>
        <view class="menu-list">
          <view class="menu-item" @click="changePassword">
            <text class="menu-text">修改密码</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </view>
          <view class="menu-item" @click="bindPhone">
            <text class="menu-text">绑定手机</text>
            <view class="menu-value">
              <text class="value-text">{{ userInfo?.phone ? '已绑定' : '未绑定' }}</text>
              <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </view>
          </view>
          <view class="menu-item" @click="bindEmail">
            <text class="menu-text">绑定邮箱</text>
            <view class="menu-value">
              <text class="value-text">{{ userInfo?.email ? '已绑定' : '未绑定' }}</text>
              <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 通知设置 -->
      <view class="section">
        <view class="section-title">通知设置</view>
        <view class="menu-list">
          <view class="menu-item">
            <text class="menu-text">接收推送通知</text>
            <switch :checked="notificationSettings.push" @change="togglePush" color="#E07B54"/>
          </view>
          <view class="menu-item">
            <text class="menu-text">订阅更新提醒</text>
            <switch :checked="notificationSettings.subscription" @change="toggleSubscription" color="#E07B54"/>
          </view>
          <view class="menu-item">
            <text class="menu-text">新消息提醒</text>
            <switch :checked="notificationSettings.message" @change="toggleMessage" color="#E07B54"/>
          </view>
        </view>
      </view>

      <!-- 主题设置 -->
      <view class="section">
        <view class="section-title">主题设置</view>
        <view class="menu-list">
          <view class="menu-item" @click="toggleTheme">
            <text class="menu-text">深色模式</text>
            <view class="menu-value">
              <text class="value-text">{{ isDark ? '已开启' : '已关闭' }}</text>
              <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 关于 -->
      <view class="section">
        <view class="section-title">关于</view>
        <view class="menu-list">
          <view class="menu-item" @click="showAbout">
            <text class="menu-text">关于我们</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </view>
          <view class="menu-item" @click="showPrivacy">
            <text class="menu-text">隐私政策</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </view>
          <view class="menu-item" @click="showAgreement">
            <text class="menu-text">用户协议</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </view>
          <view class="menu-item">
            <text class="menu-text">版本号</text>
            <text class="version-text">v1.0.0</text>
          </view>
        </view>
      </view>

      <!-- 清除缓存 -->
      <view class="section">
        <view class="menu-list">
          <view class="menu-item" @click="clearCache">
            <text class="menu-text">清除缓存</text>
            <text class="cache-size">{{ cacheSize }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import CustomModal from '@/components/CustomModal.vue'

const userStore = useUserStore()
const themeStore = useThemeStore()

// 弹窗状态
const modalVisible = ref(false)
const modalTitle = ref('')
const modalContent = ref('')
const modalConfirmText = ref('确定')
const modalCancelText = ref('取消')
const modalShowCancel = ref(true)
const modalConfirmColor = ref('')
let modalResolve: ((value: boolean) => void) | null = null

// 显示弹窗
const showModal = (options: {
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  confirmColor?: string
}): Promise<boolean> => {
  return new Promise((resolve) => {
    modalTitle.value = options.title || ''
    modalContent.value = options.content || ''
    modalConfirmText.value = options.confirmText || '确定'
    modalCancelText.value = options.cancelText || '取消'
    modalShowCancel.value = options.showCancel !== false
    modalConfirmColor.value = options.confirmColor || ''
    modalResolve = resolve
    modalVisible.value = true
  })
}

// 处理弹窗确认
const handleModalConfirm = () => {
  modalVisible.value = false
  if (modalResolve) {
    modalResolve(true)
    modalResolve = null
  }
}

// 处理弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
  if (modalResolve) {
    modalResolve(false)
    modalResolve = null
  }
}

const userInfo = computed(() => userStore.userInfo)
const isDark = computed(() => themeStore.isDark)

const notificationSettings = ref({
  push: true,
  subscription: true,
  message: true
})

const cacheSize = ref('12.5 MB')

const togglePush = (e: any) => {
  notificationSettings.value.push = e.detail.value
}

const toggleSubscription = (e: any) => {
  notificationSettings.value.subscription = e.detail.value
}

const toggleMessage = (e: any) => {
  notificationSettings.value.message = e.detail.value
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const changePassword = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const bindPhone = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const bindEmail = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const showAbout = async () => {
  await showModal({
    title: '关于 OnlyStudents',
    content: 'OnlyStudents 是一个学习笔记分享平台，让知识传播更简单。',
    showCancel: false
  })
}

const showPrivacy = () => {
  uni.navigateTo({ url: '/pages/user/privacy-policy' })
}

const showAgreement = () => {
  uni.navigateTo({ url: '/pages/user/user-agreement' })
}

const clearCache = async () => {
  const confirmed = await showModal({
    title: '提示',
    content: '确定要清除缓存吗？'
  })
  
  if (confirmed) {
    // 清除缓存逻辑
    cacheSize.value = '0 B'
    uni.showToast({ title: '缓存已清除', icon: 'success' })
  }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.settings-page {
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
  padding: 16px;
}

.section {
  background: var(--bg-card);
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-tertiary);
  padding: 12px 16px;
  background: var(--bg-secondary);
}

.menu-list {
  padding: 0 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-light);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-text {
  font-size: 15px;
  color: var(--text-primary);
}

.menu-value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.value-text {
  font-size: 14px;
  color: var(--text-tertiary);
}

.menu-arrow {
  color: var(--text-tertiary);
}

.version-text {
  font-size: 14px;
  color: var(--text-tertiary);
}

.cache-size {
  font-size: 14px;
  color: var(--text-tertiary);
}
</style>
