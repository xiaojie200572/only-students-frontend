<template>
  <view class="message-page">
    <!-- 导航栏 -->
    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">消息</text>
      <view class="nav-right"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <view class="spinner"></view>
      <text>加载中...</text>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!loading && conversations.length === 0 && notifications.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
      <text class="empty-text">暂无消息</text>
      <text class="empty-subtext">当有人给您发消息时，会显示在这里</text>
    </view>

    <!-- 消息列表 -->
    <scroll-view v-else scroll-y class="message-list" @scrolltolower="loadMore">
      <!-- 会话列表 -->
      <view
        v-for="conv in conversations"
        :key="conv.id"
        class="message-item"
        @click="goToChat(conv)"
      >
        <view class="msg-avatar-wrapper">
          <image 
            :src="conv.targetUserAvatar || '/static/default-avatar.svg'" 
            class="msg-avatar" 
            mode="aspectFill"
          />
          <view v-if="conv.unreadCount > 0" class="msg-badge">
            {{ conv.unreadCount > 99 ? '99+' : conv.unreadCount }}
          </view>
        </view>
        <view class="msg-content">
          <view class="msg-header">
            <text class="msg-name">{{ conv.targetUserName }}</text>
            <text class="msg-time">{{ formatTime(conv.lastMessageTime) }}</text>
          </view>
          <text class="msg-preview" :class="{ unread: conv.unreadCount > 0 }">
            {{ conv.lastMessage }}
          </text>
        </view>
      </view>

      <!-- 系统通知 -->
      <view v-if="notifications.length > 0" class="section-title">系统通知</view>
      <view
        v-for="notice in notifications"
        :key="notice.id"
        class="notice-item"
        @click="handleNotificationClick(notice)"
      >
        <view class="notice-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </view>
        <view class="notice-content">
          <text class="notice-title">{{ notice.title }}</text>
          <text class="notice-desc">{{ notice.content }}</text>
          <text class="notice-time">{{ formatTime(notice.createdAt) }}</text>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore" class="load-more">
        <text>加载更多...</text>
      </view>
    </scroll-view>

  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { messageApi, notificationApi } from '@/api/message'
import type { Conversation, Notification } from '@/types/api.types'

// 数据状态
const conversations = ref<Conversation[]>([])
const notifications = ref<Notification[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 20

// 格式化时间
const formatTime = (timeStr: string): string => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  }
  // 小于24小时
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前'
  }
  // 小于7天
  if (diff < 604800000) {
    return Math.floor(diff / 86400000) + '天前'
  }
  // 超过7天显示日期
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 获取会话列表
const fetchConversations = async () => {
  try {
    const data = await messageApi.getConversations()
    conversations.value = data || []
  } catch (error) {
    console.error('获取会话列表失败:', error)
    uni.showToast({ title: '获取消息失败', icon: 'none' })
  }
}

// 获取通知列表
const fetchNotifications = async (refresh = false) => {
  if (refresh) {
    currentPage.value = 1
    notifications.value = []
  }
  
  try {
    const data = await notificationApi.getList(currentPage.value, pageSize)
    if (data && data.length > 0) {
      notifications.value.push(...data)
      hasMore.value = data.length === pageSize
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('获取通知列表失败:', error)
  }
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return
  currentPage.value++
  fetchNotifications()
}

// 跳转到聊天页面
const goToChat = (conv: Conversation) => {
  // 标记会话为已读（减少未读数）
  if (conv.unreadCount > 0) {
    conv.unreadCount = 0
  }
  
  uni.navigateTo({
    url: `/pages/message/chat?id=${conv.id}&name=${encodeURIComponent(conv.targetUserName)}&targetId=${conv.targetUserId}`
  })
}

// 处理通知点击
const handleNotificationClick = (notice: Notification) => {
  // 标记为已读
  if (!notice.isRead) {
    notificationApi.markAsRead(notice.id).then(() => {
      notice.isRead = true
    }).catch(err => {
      console.error('标记已读失败:', err)
    })
  }
  
  // 根据通知类型跳转到不同页面
  if (notice.targetId && notice.targetType) {
    switch (notice.targetType) {
      case 1: // 笔记
        uni.navigateTo({ url: `/pages/note/detail?id=${notice.targetId}` })
        break
      case 2: // 用户
        uni.navigateTo({ url: `/pages/user/profile?id=${notice.targetId}` })
        break
      case 3: // 订单
        uni.navigateTo({ url: '/pages/user/my-orders' })
        break
    }
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 初始化数据
const initData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchConversations(),
      fetchNotifications(true)
    ])
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  initData()
})

// 页面激活时刷新数据（从其他页面返回时）
onActivated(() => {
  fetchConversations()
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
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-light);
  z-index: 100;
}

.back-btn {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
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
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 13px;
  color: var(--text-tertiary);
}

.message-list {
  height: calc(100vh - 124px);
}

.message-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
}

.message-item:active {
  background: var(--bg-secondary);
}

.msg-avatar-wrapper {
  position: relative;
  margin-right: 12px;
}

.msg-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-secondary);
}

.msg-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  background: var(--accent-coral);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.msg-content {
  flex: 1;
  overflow: hidden;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.msg-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.msg-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.msg-preview {
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msg-preview.unread {
  color: var(--text-primary);
  font-weight: 500;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-tertiary);
  padding: 20px 16px 12px;
  background: var(--bg-primary);
}

.notice-item {
  display: flex;
  padding: 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
}

.notice-item:active {
  background: var(--bg-secondary);
}

.notice-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: var(--accent-warm);
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
  overflow: hidden;
}

.notice-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.notice-desc {
  font-size: 13px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-time {
  font-size: 11px;
  color: var(--text-tertiary);
}

.load-more {
  text-align: center;
  padding: 16px;
  color: var(--text-tertiary);
  font-size: 13px;
}
</style>
