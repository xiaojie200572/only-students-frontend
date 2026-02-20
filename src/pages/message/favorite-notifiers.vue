<template>
  <view class="favorite-notifiers-page">
    <!-- 导航栏 -->
    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">收藏</text>
      <view class="nav-right"></view>
    </view>

    <!-- 收藏列表 -->
    <scroll-view scroll-y class="favorite-list" @scrolltolower="loadMore">
      <!-- 加载状态 -->
      <view v-if="loading && favorites.length === 0" class="loading-state">
        <view class="spinner"></view>
        <text>加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading && favorites.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <text class="empty-text">暂无收藏</text>
      </view>

      <!-- 收藏列表 -->
      <view v-else class="favorite-items">
        <view
          v-for="fav in favorites"
          :key="fav.id"
          class="favorite-item"
          :class="{ unread: !fav.isRead }"
          @click="handleFavoriteClick(fav)"
        >
          <!-- 头像 -->
          <image 
            :src="fav.user?.avatar || '/static/default-avatar.svg'" 
            class="fav-avatar" 
            mode="aspectFill"
          />
          
          <!-- 内容 -->
          <view class="fav-content">
            <view class="fav-header">
              <text class="fav-username">{{ fav.user?.nickname || fav.user?.username || '用户' }}</text>
              <text class="fav-time">{{ formatTime(fav.createdAt) }}</text>
            </view>
            <view class="fav-action">
              <text class="action-text">收藏了我的笔记</text>
            </view>
            <text class="fav-note-title">{{ fav.note?.title || '笔记' }}</text>
          </view>
          
          <!-- 笔记封面 -->
          <image 
            v-if="fav.note?.coverUrl" 
            :src="fav.note.coverUrl" 
            class="note-cover" 
            mode="aspectFill"
          />
          
          <!-- 未读红点 -->
          <view v-if="!fav.isRead" class="unread-dot"></view>
        </view>

        <!-- 加载更多 -->
        <view v-if="hasMore" class="load-more">
          <text>{{ loading ? '加载中...' : '上拉加载更多' }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { favoriteApi } from '@/api/note'
import { useUserStore } from '@/stores/user'

interface FavoriteWithUser {
  id: number
  userId: number
  noteId: number
  isRead: boolean
  createdAt: string
  user?: {
    id: number
    username: string
    nickname?: string
    avatar?: string
  }
  note?: {
    id: number
    title: string
    coverUrl?: string
  }
}

const userStore = useUserStore()
const favorites = ref<FavoriteWithUser[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 20

const formatTime = (timeStr: string): string => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const fetchFavorites = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    const data = await favoriteApi.getMyNoteFavorites(currentPage.value, pageSize)
    if (data && data.length > 0) {
      favorites.value.push(...data)
      hasMore.value = data.length === pageSize
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('获取收藏记录失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    currentPage.value++
    fetchFavorites()
  }
}

const handleFavoriteClick = (fav: FavoriteWithUser) => {
  // 标记已读
  if (!fav.isRead) {
    fav.isRead = true
  }
  
  // 跳转到笔记详情
  if (fav.noteId) {
    uni.navigateTo({ 
      url: `/pages/note/detail?id=${fav.noteId}` 
    })
  }
}

const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.favorite-notifiers-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 50px;
}

.page-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-light);
  z-index: 100;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-radius: 50%;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.nav-right {
  width: 36px;
}

.favorite-list {
  height: calc(100vh - 50px);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-light);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state svg {
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

.favorite-items {
  padding: 0 16px;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
  position: relative;
}

.favorite-item:active {
  background: var(--bg-secondary);
}

.favorite-item.unread {
  background: var(--bg-card);
}

.fav-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 12px;
}

.fav-content {
  flex: 1;
  min-width: 0;
}

.fav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.fav-username {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.fav-time {
  font-size: 11px;
  color: var(--text-tertiary);
}

.fav-action {
  margin-bottom: 2px;
}

.action-text {
  font-size: 12px;
  color: var(--text-tertiary);
}

.fav-note-title {
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-item.unread .fav-username {
  font-weight: 700;
}

.note-cover {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  flex-shrink: 0;
  margin-left: 8px;
}

.unread-dot {
  position: absolute;
  top: 18px;
  right: 0;
  width: 8px;
  height: 8px;
  background: #FF3B30;
  border-radius: 50%;
}

.load-more {
  text-align: center;
  padding: 16px;
  color: var(--text-tertiary);
  font-size: 13px;
}
</style>
