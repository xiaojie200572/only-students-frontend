<template>
  <view class="user-page">
    <!-- 自定义弹窗 -->
    <CustomModal :visible="modalVisible" :title="modalTitle" :content="modalContent" :confirm-text="modalConfirmText"
      :cancel-text="modalCancelText" :show-cancel="modalShowCancel" :confirm-color="modalConfirmColor"
      @confirm="handleModalConfirm" @cancel="handleModalCancel" @close="handleModalCancel" />

    <!-- 导航栏 -->
    <view class="page-nav">
      <text class="nav-title">我的</text>
      <view class="settings-btn" @click="goToSettings">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3" />
          <path
            d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 6.34L2.1 2.1m17.9 9.9h-6m-6 0H1.9m16.32 4.24l4.24 4.24M6.34 17.66l-4.24 4.24" />
        </svg>
      </view>
    </view>

    <!-- 未登录状态 -->
    <view v-if="!isLoggedIn" class="login-prompt">
      <view class="prompt-content">
        <text class="prompt-title">登录后查看更多</text>
        <text class="prompt-desc">登录后可查看个人资料、钱包、订单等信息</text>
        <view class="prompt-btns">
          <view class="btn-primary" @click="goToLogin">登录</view>
          <view class="btn-secondary" @click="goToRegister">注册</view>
        </view>
      </view>
    </view>

    <!-- 已登录状态 -->
    <template v-else>
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="user-header">
          <image class="user-avatar" :src="userInfo?.avatar || '/static/default-avatar.svg'" mode="aspectFill" />
          <view class="user-info">
            <text class="user-name">{{ userInfo?.nickname || '用户' }}</text>
            <text class="user-id">ID: {{ userInfo?.id }}</text>
            <text v-if="userInfo?.schoolName" class="user-school">{{ userInfo.schoolName }}</text>
          </view>
          <view class="edit-btn" @click="goToEditProfile">
            <text>编辑资料</text>
          </view>
        </view>

        <!-- 数据统计 -->
        <view class="user-stats">
          <view class="stat-box" @click="goToMyNotes">
            <text class="stat-num">{{ stats.noteCount }}</text>
            <text class="stat-label">笔记</text>
          </view>
          <view class="stat-box" @click="goToMySubscribers">
            <text class="stat-num">{{ formatNumber(stats.subscriberCount) }}</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="stat-box" @click="goToMySubscriptions">
            <text class="stat-num">{{ formatNumber(stats.subscriptionCount) }}</text>
            <text class="stat-label">关注</text>
          </view>
          <view class="stat-box">
            <text class="stat-num">{{ formatNumber(stats.averageRating) }}</text>
            <text class="stat-label">评分</text>
          </view>
        </view>
      </view>

      <!-- 钱包卡片 -->
      <view class="wallet-card" v-if="wallet">
        <view class="wallet-header">
          <text class="wallet-title">我的钱包</text>
          <text class="wallet-detail" @click="goToTransactions">查看明细</text>
        </view>
        <view class="wallet-balance">
          <text class="balance-label">余额</text>
          <text class="balance-amount">¥{{ wallet.balance?.toFixed(2) || '0.00' }}</text>
        </view>
        <view class="wallet-income">
          <text>累计收入 ¥{{ wallet.totalIncome?.toFixed(2) || '0.00' }}</text>
        </view>
        <view class="wallet-actions">
          <view class="wallet-btn primary" @click="withdraw">提现</view>
          <view class="wallet-btn" @click="recharge">充值</view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section">
        <view class="menu-title">我的内容</view>
        <view class="menu-list">
          <view class="menu-item" @click="goToMyNotes">
            <view class="menu-icon" style="background: #FFE4E1;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E07B54" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </view>
            <text class="menu-text">我的笔记</text>
            <text v-if="stats.noteCount > 0" class="menu-badge">{{ stats.noteCount }}</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
          <view class="menu-item" @click="goToDataCenter">
            <view class="menu-icon" style="background: #FFF3E0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8B6B" stroke-width="2">
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </view>
            <text class="menu-text">数据中心</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
          <view class="menu-item" @click="goToMySubscriptions">
            <view class="menu-icon" style="background: #E8F5E9;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B9A6D" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </view>
            <text class="menu-text">我的订阅</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
          <view class="menu-item" @click="goToMyOrders">
            <view class="menu-icon" style="background: #E3F2FD;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </view>
            <text class="menu-text">我的订单</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
      </view>

      <view class="menu-section" v-if="userInfo?.isCreator">
        <view class="menu-title">创作者中心</view>
        <view class="menu-list">
          <view class="menu-item" @click="goToPublish">
            <view class="menu-icon" style="background: #F3E5F5;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9C27B0" stroke-width="2">
                <path d="M12 20h9M12 20V10M12 20l-7-7m7 7V4m0 6l7-7" />
              </svg>
            </view>
            <text class="menu-text">发布笔记</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
          <view class="menu-item" @click="goToCreatorSettings">
            <view class="menu-icon" style="background: #FFF8E1;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 6.34L2.1 2.1m17.9 9.9h-6m-6 0H1.9m16.32 4.24l4.24 4.24M6.34 17.66l-4.24 4.24" />
              </svg>
            </view>
            <text class="menu-text">创作者设置</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-title">其他</view>
        <view class="menu-list">
          <view class="menu-item" @click="showHelp">
            <view class="menu-icon" style="background: #E0F2F1;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009688" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </view>
            <text class="menu-text">帮助中心</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
          <view class="menu-item" @click="contactService">
            <view class="menu-icon" style="background: #FCE4EC;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E91E63" stroke-width="2">
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </view>
            <text class="menu-text">联系客服</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
          <view class="menu-item" @click="logout">
            <view class="menu-icon" style="background: #FFEBEE;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F44336" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </view>
            <text class="menu-text" style="color: #F44336;">退出登录</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
      </view>
    </template>

    <!-- 底部导航 -->
    <TabBar :current="3" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { walletApi, subscriptionApi, noteApi, userApi } from '@/api'
import type { WalletInfo } from '@/types/api.types'
import TabBar from '@/components/TabBar.vue'
import CustomModal from '@/components/CustomModal.vue'
import { number } from 'echarts'

const userStore = useUserStore()

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

const wallet = ref<WalletInfo | null>(null)
const stats = ref({
  noteCount: 0,
  subscriberCount: 0,
  subscriptionCount: 0,
  averageRating: 0
})

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)

onMounted(() => {
  if (isLoggedIn.value) {
    loadUserData()
  }
})

const loadUserData = async () => {
  try {
    // 并行获取数据
    const [userRes, walletRes, notesRes, subscriptionsRes] = await Promise.all([
      userApi.getCurrentUser().catch(() => null),
      walletApi.getWallet().catch(() => null),
      noteApi.getMyNotes().catch(() => []),
      subscriptionApi.getMySubscriptions().catch(() => [])
    ])

    // 更新用户信息
    if (userRes) {
      userStore.setUserInfo(userRes)
      console.log('用户数据返回:', JSON.stringify(userRes))
      console.log('followerCount值:', userRes.followerCount)
      stats.value.subscriberCount = userRes.followerCount ?? 0
    } else {
      console.log('用户数据为空')
    }
    const noteCount = notesRes?.length || 0
    const notes: any[] = notesRes || []
    const totalRating = notes.reduce((sum: number, note: any) => sum + (note.averageRating || 0), 0)

    wallet.value = walletRes
    stats.value.noteCount = noteCount
    stats.value.subscriptionCount = subscriptionsRes?.length || 0
    stats.value.averageRating = noteCount > 0 ? (Number)((totalRating / noteCount).toFixed(1)) : 0
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' })
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' })
}

const goToEditProfile = () => {
  uni.navigateTo({ url: '/pages/user/edit-profile' })
}

const goToMyNotes = () => {
  uni.navigateTo({ url: '/pages/user/my-notes' })
}

const goToDataCenter = () => {
  uni.navigateTo({ url: '/pages/user/data-center' })
}

const goToMySubscriptions = () => {
  uni.navigateTo({ url: '/pages/user/my-subscriptions' })
}

const goToMySubscribers = () => {
  uni.navigateTo({ url: '/pages/user/my-subscribers' })
}

const goToMyOrders = () => {
  uni.navigateTo({ url: '/pages/user/my-orders' })
}

const goToTransactions = () => {
  uni.navigateTo({ url: '/pages/user/transactions' })
}

const goToPublish = () => {
  uni.navigateTo({ url: '/pages/note/publish' })
}

const goToCreatorSettings = () => {
  uni.navigateTo({ url: '/pages/user/creator-settings' })
}

const goToSettings = () => {
  uni.navigateTo({ url: '/pages/user/settings' })
}

const withdraw = () => {
  uni.navigateTo({ url: '/pages/user/withdraw' })
}

const recharge = () => {
  uni.showToast({ title: '充值功能开发中', icon: 'none' })
}

const showHelp = () => {
  uni.showToast({ title: '帮助中心开发中', icon: 'none' })
}

const contactService = () => {
  uni.showToast({ title: '客服功能开发中', icon: 'none' })
}

const logout = async () => {
  const confirmed = await showModal({
    title: '提示',
    content: '确定要退出登录吗？'
  })

  if (confirmed) {
    userStore.logout()
    uni.showToast({ title: '已退出登录', icon: 'success' })
  }
}
</script>

<style scoped>
.user-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 60px;
  padding-bottom: calc(48px + env(safe-area-inset-bottom));
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
  justify-content: center;
  border-bottom: 1px solid var(--border-light);
  z-index: 100;
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.settings-btn {
  position: absolute;
  right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.login-prompt {
  margin: 16px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 40px 24px;
  border: 1px solid var(--border-light);
  text-align: center;
}

.prompt-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
  margin-bottom: 8px;
}

.prompt-desc {
  font-size: 14px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 24px;
}

.prompt-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary {
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  color: white;
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
}

.btn-secondary {
  padding: 12px 32px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
  border: 1px solid var(--border-light);
}

.user-card {
  margin: 16px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border-light);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 16px;
  border: 3px solid var(--bg-card);
  box-shadow: 0 0 0 2px var(--accent-warm);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

.user-id {
  font-size: 13px;
  color: var(--text-tertiary);
  display: block;
  margin-bottom: 2px;
}

.user-school {
  font-size: 12px;
  color: var(--accent-warm);
  display: block;
}

.edit-btn {
  padding: 6px 14px;
  background: var(--bg-secondary);
  border-radius: 16px;
  font-size: 12px;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.stat-box {
  text-align: center;
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.wallet-card {
  margin: 16px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border-light);
}

.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.wallet-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.wallet-detail {
  font-size: 12px;
  color: var(--accent-warm);
}

.wallet-balance {
  margin-bottom: 8px;
}

.balance-label {
  font-size: 13px;
  color: var(--text-tertiary);
  display: block;
  margin-bottom: 4px;
}

.balance-amount {
  font-size: 36px;
  font-weight: 700;
  color: var(--accent-warm);
}

.wallet-income {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.wallet-actions {
  display: flex;
  gap: 12px;
}

.wallet-btn {
  flex: 1;
  padding: 10px 20px;
  background: var(--bg-secondary);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.wallet-btn.primary {
  background: var(--accent-warm);
  color: white;
  border: none;
}

.menu-section {
  margin: 16px;
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.menu-title {
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
  padding: 14px 0;
  border-bottom: 1px solid var(--border-light);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

.menu-badge {
  background: var(--accent-coral);
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 8px;
}

.menu-arrow {
  color: var(--text-tertiary);
}
</style>
