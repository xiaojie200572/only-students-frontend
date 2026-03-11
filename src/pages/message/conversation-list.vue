<template>
  <view class="conversation-list-page">
    <!-- 导航栏 -->
    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">私信</text>
      <view class="nav-right"></view>
    </view>

    <!-- 会话列表 -->
    <scroll-view scroll-y class="conversation-list" @scrolltolower="loadMore">
      <!-- 加载状态 -->
      <view v-if="loading && conversations.length === 0" class="loading-state">
        <view class="spinner"></view>
        <text>加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading && conversations.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <text class="empty-text">暂无私信</text>
      </view>

      <!-- 会话列表 -->
      <view v-else class="conversation-items">
        <view
          v-for="conv in conversations"
          :key="conv.id"
          class="conversation-item"
          :class="{ unread: conv.unreadCount > 0 }"
          @click="handleConversationClick(conv)"
        >
          <!-- 头像 -->
          <image
            :src="conv.targetUserAvatar || '/static/default-avatar.svg'"
            class="conv-avatar"
            mode="aspectFill"
          />

          <!-- 内容 -->
          <view class="conv-content">
            <view class="conv-header">
              <text class="conv-username">{{ conv.targetNickname|| '用户' }}</text>
              <text class="conv-time">{{ formatTime(conv.lastMessageTime) }}</text>
            </view>
            <text class="conv-preview">{{ conv.lastMessage || '暂无消息' }}</text>
          </view>

          <!-- 未读数 -->
          <view v-if="conv.unreadCount > 0" class="unread-badge">
            {{ conv.unreadCount > 99 ? '99+' : conv.unreadCount }}
          </view>
          <view v-else class="unread-dot-small"></view>
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
import { messageApi } from '@/api/message'
import { useUserStore } from '@/stores/user'
import {type Conversation } from '@/types/api.types'

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

onMounted(() => {
  fetchConversations()
})

const userStore = useUserStore()
const conversations = ref<Conversation[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 20

const formatTime = (timeStr?: string): string => {
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

const fetchConversations = async () => {
  if (loading.value) return

  loading.value = true
  try {
    const result = await messageApi.getConversations()
    const data = result || []
    if (data && data.length > 0) {
      conversations.value = data
      hasMore.value = false
    } else {
      conversations.value = []
      hasMore.value = false
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  // 分页逻辑，如需要
}

const handleConversationClick = async (conv: Conversation) => {
  console.log('点击私信，unreadCount:', conv.unreadCount, 'type:', typeof conv.unreadCount)
  // 标记已读
  if (conv.unreadCount > 0) {
    try {
      await messageApi.markConversationAsRead(conv.id)
      conv.unreadCount = 0
      // 刷新列表
      fetchConversations()
      // 通知首页刷新未读数
      uni.$emit('refreshUnreadCount')
    } catch (e) {
      console.error('标记已读失败:', e)
    }
  }

  // 跳转到聊天页面
  const name = encodeURIComponent(conv.targetNickname|| '用户')
  const avatar = encodeURIComponent(conv.targetUserAvatar || '')

  uni.navigateTo({
    url: `/pages/message/chat?id=${conv.id}&targetId=${conv.targetUserId}&name=${name}&avatar=${avatar}`
  })
}
</script>

<style scoped>
.conversation-list-page {
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

.conversation-list {
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

.conversation-items {
  padding: 0;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  width: 100%;
  box-sizing: border-box;
  background: var(--bg-card);
}

.conversation-item:active {
  background: var(--bg-tertiary) !important;
}

.conversation-item.unread {
  background: var(--bg-secondary);
}

.conversation-item.unread:active {
  background: var(--bg-tertiary) !important;
}

.conv-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 12px;
}

.conv-content {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-username {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.conv-time {
  font-size: 11px;
  color: var(--text-tertiary);
}

.conv-preview {
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-item.unread .conv-username {
  font-weight: 700;
}

.conversation-item.unread .conv-preview {
  color: var(--text-primary);
  font-weight: 500;
}

.unread-badge {
  min-width: 20px;
  height: 20px;
  background: #FF3B30;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

.unread-dot-small {
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
