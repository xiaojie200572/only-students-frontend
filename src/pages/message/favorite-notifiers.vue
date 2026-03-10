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
            :src="fav.fromUserAvatar || '/static/default-avatar.svg'"
            class="fav-avatar"
            mode="aspectFill"
          />

          <!-- 内容 -->
          <view class="fav-content">
            <view class="fav-header">
              <text class="fav-nickname">{{ fav.fromUserNickname || '用户' }}</text>
              <text class="fav-time">{{ formatTime(fav.createdAt) }}</text>
            </view>
            <view class="fav-action">
              <text class="action-text">收藏了我的笔记</text>
            </view>
            <text class="fav-note-title">{{ fav.noteTitle || '笔记' }}</text>
          </view>

          <!-- 笔记封面 -->
          <image
            v-if="fav.noteCoverImage"
            :src="fav.noteCoverImage"
            class="note-cover"
            mode="aspectFill"
          />

          <!-- 删除按钮 -->
          <view class="item-delete-btn" @click.stop="deleteFavoriteRecord(fav)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </view>

          <!-- 未读红点 -->
          <view v-if="fav.isRead === 0" class="unread-dot"></view>
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
import { onShow } from '@dcloudio/uni-app'
import { favoriteNotificationApi } from '@/api/message'
import { useUserStore } from '@/stores/user'

const canBack = ref(false)

onShow(() => {
  const pages = getCurrentPages() as any[]
  canBack.value = pages.length > 1
})

const goBack = () => {
  if (canBack.value) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

interface FavoriteWithUser {
  id: number
  fromUserId: number
  toUserId: number
  noteId: number
  favoriteId: number
  isRead: number
  createdAt: string
  fromUserNickname?: string
  fromUserAvatar?: string
  noteTitle?: string
  noteCoverImage?: string
}

const userStore = useUserStore()
const favorites = ref<FavoriteWithUser[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 20

const deleteFavoriteRecord = async (fav: FavoriteWithUser) => {
  try {
    await favoriteNotificationApi.deleteNotification(fav.id)
    const index = favorites.value.findIndex(f => f.id === fav.id)
    if (index !== -1) {
      favorites.value.splice(index, 1)
    }
    uni.showToast({ title: '删除成功', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: '删除失败', icon: 'none' })
  }
}

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

const fetchFavorites = async (refresh = false) => {
  if (loading.value) return

  if (refresh) {
    currentPage.value = 1
    favorites.value = []
  }

  loading.value = true
  try {
    // 使用新的通知API获取收藏通知列表
    const result = await favoriteNotificationApi.getList(currentPage.value, pageSize)
    // 处理分页数据
    const records = result?.records || result?.data || []
    if (records && records.length > 0) {
      if (refresh) {
        favorites.value = records
      } else {
        favorites.value.push(...records)
      }
      hasMore.value = records.length === pageSize
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('获取收藏通知失败:', error)
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

const handleFavoriteClick = async (fav: FavoriteWithUser) => {
  console.log('点击收藏通知，isRead:', fav.isRead, 'type:', typeof fav.isRead)
  // 标记已读
  if (fav.isRead === 0 || !fav.isRead) {
    try {
      await favoriteNotificationApi.markAsRead(fav.id)
      fav.isRead = 1
      // 通知首页刷新未读数
      uni.$emit('refreshUnreadCount')
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }

  // 跳转到笔记详情
  if (fav.noteId) {
    uni.navigateTo({
      url: `/pages/note/detail?id=${fav.noteId}`
    })
  }
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
  padding: 0;
}

.delete-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  flex-shrink: 0;
  margin-right: 8px;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background: var(--bg-card);
}

.favorite-item:active {
  background: var(--bg-tertiary) !important;
}

.favorite-item.unread:active {
  background: var(--bg-tertiary) !important;
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

.item-delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  z-index: 20;
}

.load-more {
  text-align: center;
  padding: 16px;
  color: var(--text-tertiary);
  font-size: 13px;
}
</style>
