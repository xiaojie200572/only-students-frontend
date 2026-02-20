<template>
  <view class="message-page">
    <!-- 导航栏 -->
    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">消息</text>
      <view class="nav-right"></view>
    </view>

    <!-- 消息类型入口 -->
    <view class="message-entrance">
      <view class="entrance-item" @click="goToPage('comment')">
        <view class="entrance-icon comment-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <view v-if="commentUnread > 0" class="entrance-badge">{{ commentUnread > 99 ? '99+' : commentUnread }}</view>
        </view>
        <text class="entrance-label">评论</text>
      </view>
      
      <view class="entrance-item" @click="goToPage('favorite')">
        <view class="entrance-icon favorite-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <view v-if="favoriteUnread > 0" class="entrance-badge">{{ favoriteUnread > 99 ? '99+' : favoriteUnread }}</view>
        </view>
        <text class="entrance-label">收藏</text>
      </view>
      
      <view class="entrance-item" @click="goToPage('message')">
        <view class="entrance-icon message-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <view v-if="messageUnread > 0" class="entrance-badge">{{ messageUnread > 99 ? '99+' : messageUnread }}</view>
        </view>
        <text class="entrance-label">私信</text>
      </view>
      
      <view class="entrance-item" @click="goToPage('follower')">
        <view class="entrance-icon follower-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          <view v-if="followerUnread > 0" class="entrance-badge">{{ followerUnread > 99 ? '99+' : followerUnread }}</view>
        </view>
        <text class="entrance-label">新增粉丝</text>
      </view>
    </view>

    <!-- 系统消息列表 -->
    <view class="system-section">
      <view class="section-header">
        <text class="section-title">系统消息</text>
      </view>
      
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <view class="spinner"></view>
        <text>加载中...</text>
      </view>
      
      <!-- 空状态 -->
      <view v-else-if="!loading && systemMessages.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <text class="empty-text">暂无系统消息</text>
      </view>
      
      <!-- 系统消息列表 -->
      <scroll-view v-else scroll-y class="system-list">
        <view
          v-for="notice in systemMessages"
          :key="notice.id"
          class="system-item"
          :class="{ unread: !notice.isRead }"
          @click="handleNoticeClick(notice)"
        >
          <view class="system-icon" :class="getNoticeTypeClass(notice.type)">
            <svg v-if="notice.type === 1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <svg v-else-if="notice.type === 2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <svg v-else-if="notice.type === 4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <svg v-else-if="notice.type === 3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </view>
          <view class="system-content">
            <view class="system-header">
              <text class="system-title">{{ notice.title }}</text>
              <text class="system-time">{{ formatTime(notice.createdAt) }}</text>
            </view>
            <text class="system-desc">{{ notice.content }}</text>
          </view>
          <view v-if="!notice.isRead" class="unread-dot"></view>
        </view>
        
        <!-- 加载更多 -->
        <view v-if="hasMore" class="load-more">
          <text>加载更多...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { notificationApi, messageApi } from '@/api/message'
import { favoriteApi, commentApi } from '@/api/note'
import type { Notification } from '@/types/api.types'

// 各种未读数
const commentUnread = ref(0)
const favoriteUnread = ref(0)
const messageUnread = ref(0)
const followerUnread = ref(0)

// 系统消息
const systemMessages = ref<Notification[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 20

// SSE
let eventSource: EventSource | null = null

// 连接SSE获取实时未读数
const connectSSE = () => {
  const token = uni.getStorageSync('token')
  const userId = uni.getStorageSync('userId')
  if (!token || !userId) return
  
  // 使用本地通知服务端口
  const url = `http://localhost:8009/notification/sse/subscribe?userId=${userId}&token=${token}`
  eventSource = new EventSource(url)
  
  eventSource.onopen = () => {
    console.log('SSE连接成功')
  }
  
  eventSource.addEventListener('unread-count', (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log('收到未读数更新:', data)
      // 重新获取未读数
      fetchUnreadCounts()
    } catch (e) {
      console.error('解析未读数失败:', e)
    }
  })
  
  eventSource.addEventListener('notification', (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log('收到新通知:', data)
      // 重新获取系统消息
      fetchSystemMessages(true)
      // 重新获取未读数
      fetchUnreadCounts()
    } catch (e) {
      console.error('解析通知失败:', e)
    }
  })
  
  eventSource.onerror = (error) => {
    console.error('SSE错误:', error)
    eventSource?.close()
    // 5秒后重连
    setTimeout(connectSSE, 5000)
  }
}

// 格式化时间
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

// 获取通知类型样式
const getNoticeTypeClass = (type: number): string => {
  switch (type) {
    case 1: return 'system-type' // 系统
    case 2: return 'subscribe-type' // 订阅
    case 3: return 'comment-type' // 评论
    case 4: return 'like-type' // 点赞
    case 5: return 'favorite-type' // 收藏
    default: return 'system-type'
  }
}

// 跳转页面
const goToPage = (type: string) => {
  switch (type) {
    case 'comment':
      uni.navigateTo({ url: '/pages/message/comment-list' })
      break
    case 'favorite':
      uni.navigateTo({ url: '/pages/message/favorite-notifiers' })
      break
    case 'message':
      uni.navigateTo({ url: '/pages/message/conversation-list' })
      break
    case 'follower':
      uni.navigateTo({ url: '/pages/user/my-subscribers' })
      break
  }
}

// 获取未读数
const fetchUnreadCounts = async () => {
  try {
    // 获取评论未读数
    try {
      const commentCount = await commentApi.getReceivedCount()
      commentUnread.value = commentCount || 0
    } catch (e) {
      commentUnread.value = 0
    }
    
    // 获取我的笔记被收藏的未读数
    try {
      const favoriteCount = await favoriteApi.getMyNoteFavoriteUnreadCount()
      favoriteUnread.value = favoriteCount || 0
    } catch (e) {
      favoriteUnread.value = 0
    }
    
    // 获取私信未读数（会话列表未读总数）
    try {
      const conversations = await messageApi.getConversations()
      messageUnread.value = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
    } catch (e) {
      messageUnread.value = 0
    }
    
    // 获取新增粉丝数（需要从订阅服务获取）
    followerUnread.value = 0 // TODO: 需要订阅服务API支持
  } catch (error) {
    console.error('获取未读数失败:', error)
  }
}

// 获取系统消息
const fetchSystemMessages = async (refresh = false) => {
  if (refresh) {
    currentPage.value = 1
    systemMessages.value = []
  }
  
  loading.value = true
  try {
    const data = await notificationApi.getList(currentPage.value, pageSize)
    if (data && data.length > 0) {
      systemMessages.value.push(...data)
      hasMore.value = data.length === pageSize
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('获取系统消息失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理通知点击
const handleNoticeClick = (notice: Notification) => {
  // 标记为已读
  if (!notice.isRead) {
    notificationApi.markAsRead(notice.id).then(() => {
      notice.isRead = true
    }).catch(err => {
      console.error('标记已读失败:', err)
    })
  }
  
  // 根据通知类型跳转
  if (notice.targetId && notice.targetType) {
    switch (notice.targetType) {
      case 1: // 笔记
        uni.navigateTo({ url: `/pages/note/detail?id=${notice.targetId}` })
        break
      case 2: // 用户
        uni.navigateTo({ url: `/pages/user/profile?id=${notice.targetId}` })
        break
      case 3: // 评论
        uni.navigateTo({ url: `/pages/note/comment-detail?commentId=${notice.targetId}` })
        break
    }
  }
}

const goBack = () => {
  uni.navigateBack()
}

// 初始化
onMounted(() => {
  fetchUnreadCounts()
  fetchSystemMessages(true)
  connectSSE()
})

// 页面卸载时关闭SSE
onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
})
</script>

<style scoped>
.message-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 60px;
}

.page-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
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
  font-weight: 700;
  color: var(--text-primary);
}

.nav-right {
  width: 36px;
}

/* 消息类型入口 */
.message-entrance {
  display: flex;
  padding: 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  gap: 16px;
}

.entrance-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.entrance-icon {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-icon {
  background: var(--accent-warm);
  color: white;
}

.favorite-icon {
  background: var(--accent-warm);
  color: white;
}

.message-icon {
  background: var(--accent-warm);
  color: white;
}

.follower-icon {
  background: var(--accent-warm);
  color: white;
}

.entrance-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: #FF3B30;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.entrance-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 系统消息区域 */
.system-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  padding: 16px;
  background: var(--bg-primary);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-secondary);
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.empty-state svg {
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

.system-list {
  flex: 1;
  height: calc(100vh - 260px);
}

.system-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  position: relative;
}

.system-item:active {
  background: var(--bg-secondary);
}

.system-item.unread {
  background: var(--bg-card);
}

.system-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.system-type {
  background: #FFF3E0;
  color: #FF9800;
}

.subscribe-type {
  background: #E3F2FD;
  color: #2196F3;
}

.comment-type {
  background: #FFF3E0;
  color: #FF9800;
}

.like-type {
  background: #FCE4EC;
  color: #E91E63;
}

.favorite-type {
  background: #FFF8E1;
  color: #FFC107;
}

.system-content {
  flex: 1;
  overflow: hidden;
}

.system-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.system-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.system-time {
  font-size: 11px;
  color: var(--text-tertiary);
}

.system-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.unread-dot {
  position: absolute;
  top: 18px;
  right: 16px;
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
