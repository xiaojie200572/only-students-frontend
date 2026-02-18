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
          class="subscription-item"
          @click="goToCreator(sub.creatorId)"
        >
          <image
            :src="sub.creatorAvatar || '/static/default-avatar.svg'"
            class="creator-avatar"
            mode="aspectFill"
          />
          <view class="creator-info">
            <view class="creator-name-row">
              <text class="creator-nickname">{{ sub.creatorNickname || sub.creatorName }}</text>
              <text class="creator-username">@{{ sub.creatorUsername || sub.creatorName }}</text>
            </view>
            <text v-if="sub.creatorBio" class="creator-bio">{{ sub.creatorBio }}</text>
            <text v-else class="creator-bio empty">暂无介绍</text>
          </view>
          <view class="subscription-status">
            <text class="status-text">已订阅</text>
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
    console.log('订阅列表数据:', res)
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

const goToDiscover = () => {
  uni.reLaunch({ url: '/pages/discover/index' })
}

const goToCreator = (creatorId: number) => {
  uni.navigateTo({ url: `/pages/user/profile?id=${creatorId}` })
}
</script>

<style scoped>
.subscriptions-page {
  min-height: 100vh;
  background: var(--bg-primary);
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
  padding: 0;
}

.subscription-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
}

.subscription-item:active {
  background: var(--bg-secondary);
}

.creator-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid var(--bg-card);
  box-shadow: 0 0 0 1px var(--border-light);
  flex-shrink: 0;
}

.creator-info {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.creator-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.creator-nickname {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.creator-username {
  font-size: 13px;
  color: var(--text-tertiary);
}

.creator-bio {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.creator-bio.empty {
  color: var(--text-tertiary);
}

.subscription-status {
  flex-shrink: 0;
}

.status-text {
  font-size: 13px;
  color: var(--accent-warm);
  font-weight: 500;
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