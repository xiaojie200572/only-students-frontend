<template>
  <view class="subscriptions-page">
    <!-- 导航栏 -->
    <view class="page-nav">
      <text class="nav-title">订阅</text>
    </view>

    <!-- 订阅列表 -->
    <scroll-view scroll-y class="content-area" @scrolltolower="loadMore">
      <view v-if="loading && subscriptions.length === 0" class="loading-state">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <view v-else-if="subscriptions.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <text class="empty-title">暂无订阅</text>
        <text class="empty-desc">去发现页看看感兴趣的创作者吧</text>
        <view class="empty-action" @click="goToDiscover">去发现</view>
      </view>

      <view v-else class="subscription-list">
        <view
          v-for="sub in subscriptions"
          :key="sub.id"
          class="subscription-card"
        >
          <view class="creator-info" @click="goToCreator(sub.creatorId)">
            <image
              :src="sub.creatorAvatar || '/static/default-avatar.svg'"
              class="creator-avatar"
              mode="aspectFill"
            />
            <view class="creator-detail">
              <text class="creator-name">{{ sub.creatorName }}</text>
              <text class="subscription-time">{{ formatTime(sub.startTime) }} 订阅</text>
            </view>
          </view>

          <view class="subscription-status">
            <view :class="['status-badge', sub.status === 1 ? 'active' : 'expired']">
              {{ sub.status === 1 ? '订阅中' : '已过期' }}
            </view>
            <text v-if="sub.endTime" class="expire-time">{{ getExpireText(sub.endTime) }}</text>
          </view>

          <view class="subscription-action">
            <view v-if="sub.status === 1" class="btn-renew" @click="renewSubscription(sub)">
              续费
            </view>
            <view v-else class="btn-subscribe" @click="subscribeAgain(sub.creatorId)">
              重新订阅
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="loading" class="loading-more">
          <view class="loading-spinner"></view>
          <text>加载中...</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部导航 -->
    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { subscriptionApi } from '@/api'
import TabBar from '@/components/TabBar.vue'
import type { Subscription } from '@/types/api.types'

const subscriptions = ref<Subscription[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

onMounted(() => {
  loadSubscriptions()
})

const loadSubscriptions = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true

  try {
    const res = await subscriptionApi.getMySubscriptions()
    subscriptions.value = res
    hasMore.value = false // 订阅列表通常一次性返回
  } catch (error) {
    console.error('获取订阅列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  // 如果支持分页，在这里实现
}

const formatTime = (time: string): string => {
  const date = new Date(time)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const getExpireText = (endTime: string): string => {
  const end = new Date(endTime)
  const now = new Date()
  const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return '已过期'
  } else if (diffDays === 0) {
    return '今天到期'
  } else if (diffDays <= 7) {
    return `${diffDays}天后到期`
  } else {
    return `${end.getFullYear()}.${String(end.getMonth() + 1).padStart(2, '0')}.${String(end.getDate()).padStart(2, '0')} 到期`
  }
}

const goBack = () => {
  uni.navigateBack()
}

const goToDiscover = () => {
  uni.switchTab({ url: '/pages/discover/index' })
}

const goToCreator = (creatorId: number) => {
  uni.navigateTo({ url: `/pages/user/profile?id=${creatorId}` })
}

const renewSubscription = (sub: Subscription) => {
  uni.showModal({
    title: '续费订阅',
    content: `确定要续费 ${sub.creatorName} 的订阅吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '跳转到支付页面', icon: 'none' })
      }
    }
  })
}

const subscribeAgain = (creatorId: number) => {
  uni.navigateTo({ url: `/pages/user/profile?id=${creatorId}` })
}
</script>

<style scoped>
.subscriptions-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: calc(52px + env(safe-area-inset-bottom));
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

.content-area {
  margin-top: 60px;
  height: calc(100vh - 60px - 52px - env(safe-area-inset-bottom));
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.empty-action {
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  color: white;
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
}

.subscription-list {
  padding: 16px;
}

.subscription-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border-light);
}

.creator-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.creator-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid var(--bg-card);
  box-shadow: 0 0 0 1px var(--border-light);
}

.creator-detail {
  flex: 1;
}

.creator-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.subscription-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.subscription-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge.active {
  background: #E8F5E9;
  color: #4CAF50;
}

.status-badge.expired {
  background: #FFEBEE;
  color: #F44336;
}

.expire-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.subscription-action {
  display: flex;
  justify-content: flex-end;
}

.btn-renew, .btn-subscribe {
  padding: 8px 20px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.btn-renew {
  background: var(--accent-warm);
  color: white;
}

.btn-subscribe {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: 14px;
}
</style>
