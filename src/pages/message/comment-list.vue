<template>
  <view class="comment-list-page">
    <!-- 导航栏 -->
    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">评论</text>
      <view class="nav-right"></view>
    </view>

    <!-- 标签栏 -->
    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'received' }"
        @click="switchTab('received')"
      >
        <text>收到的评论</text>
        <view v-if="receivedUnread > 0" class="tab-badge">{{ receivedUnread }}</view>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'sent' }"
        @click="switchTab('sent')"
      >
        <text>发出的评论</text>
      </view>
    </view>

    <!-- 评论列表 -->
    <scroll-view scroll-y class="comment-list" @scrolltolower="loadMore">
      <!-- 加载状态 -->
      <view v-if="loading && comments.length === 0" class="loading-state">
        <view class="spinner"></view>
        <text>加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading && comments.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <text class="empty-text">{{ activeTab === 'received' ? '暂无收到评论' : '暂无发出评论' }}</text>
      </view>

      <!-- 评论列表 -->
      <view v-else class="comment-items">
        <view
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
          :class="{ unread: comment.isRead === 0 && activeTab === 'received' }"
          @click="handleCommentClick(comment)"
        >
          <!-- 头像 -->
          <image
            :src="comment.fromUserAvatar || '/static/default-avatar.svg'"
            class="comment-avatar"
            mode="aspectFill"
          />

          <!-- 内容 -->
          <view class="comment-content">
            <view class="comment-header">
              <text class="comment-nickname">{{ comment.fromUserNickname || '用户' }}</text>
              <text class="comment-time">{{ formatTime(comment.createdAt) }}</text>
            </view>

            <!-- 收到的评论显示原文 -->
            <view v-if="activeTab === 'received'" class="comment-original">
              <text class="original-label">回复了我的笔记：</text>
              <text class="original-content">{{ comment.noteTitle || '笔记' }}</text>
            </view>

            <text class="comment-text">{{ comment.commentContent || '' }}</text>
          </view>

          <!-- 笔记封面 -->
          <image
            v-if="comment.noteCoverImage"
            :src="comment.noteCoverImage"
            class="note-cover"
            mode="aspectFill"
          />

          <!-- 删除按钮 -->
          <view class="item-delete-btn" @click.stop="deleteComment(comment)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </view>

          <!-- 未读红点 -->
          <view v-if="comment.isRead === 0 && activeTab === 'received'" class="unread-dot"></view>
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
import { commentNotificationApi } from '@/api/message'
import { commentApi } from '@/api/note'
import { useUserStore } from '@/stores/user'

interface CommentWithUser {
  id: number
  noteId: number
  fromUserId: number
  toUserId: number
  commentId: number
  isRead: number
  createdAt: string
  fromUserNickname?: string
  fromUserAvatar?: string
  noteTitle?: string
  noteCoverImage?: string
  commentContent?: string
  isLiked?: boolean
  likeCount?: number
}

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

const userStore = useUserStore()
const activeTab = ref<'received' | 'sent'>('received')
const comments = ref<CommentWithUser[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 20
const receivedUnread = ref(0)

const deleteComment = async (comment: CommentWithUser) => {
  try {
    await commentNotificationApi.deleteNotification(comment.id)
    const index = comments.value.findIndex(c => c.id === comment.id)
    if (index !== -1) {
      comments.value.splice(index, 1)
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

const switchTab = (tab: 'received' | 'sent') => {
  if (activeTab.value !== tab) {
    activeTab.value = tab
    currentPage.value = 1
    comments.value = []
    fetchComments(true)
  }
}

const fetchComments = async (refresh = false) => {
  if (loading.value) return

  if (refresh) {
    currentPage.value = 1
    comments.value = []
  }

  loading.value = true
  try {
    // 使用新的通知API获取评论通知列表
    const result = await commentNotificationApi.getList(currentPage.value, pageSize)
    // 处理分页数据
    const records = result?.records || result?.data || []
    if (records && records.length > 0) {
      if (refresh) {
        comments.value = records
      } else {
        comments.value.push(...records)
      }
      hasMore.value = records.length === pageSize
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('获取评论通知失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    currentPage.value++
    fetchComments()
  }
}

const handleCommentClick = async (comment: CommentWithUser) => {
  console.log('点击评论通知，isRead:', comment.isRead, 'type:', typeof comment.isRead)
  // 标记已读
  if ((comment.isRead === 0 || !comment.isRead) && activeTab.value === 'received') {
    try {
      await commentNotificationApi.markAsRead(comment.id)
      comment.isRead = 1
      receivedUnread.value = Math.max(0, receivedUnread.value - 1)
      // 通知首页刷新未读数
      uni.$emit('refreshUnreadCount')
    } catch (e) {
      console.error('标记已读失败:', e)
    }
  }

  // 跳转到笔记详情
  if (comment.noteId) {
    uni.navigateTo({
      url: `/pages/note/detail?id=${comment.noteId}`
    })
  }
}

const toggleLike = async (comment: CommentWithUser) => {
  try {
    if (comment.isLiked) {
      await commentApi.unlikeComment(comment.id)
      comment.isLiked = false
      comment.likeCount = Math.max(0, (comment.likeCount || 0) - 1)
    } else {
      await commentApi.likeComment(comment.id)
      comment.isLiked = true
      comment.likeCount = (comment.likeCount || 0) + 1
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}

onMounted(async () => {
  fetchComments(true)
  // 获取未读数
  try {
    const count = await commentNotificationApi.getUnreadCount()
    receivedUnread.value = count || 0
  } catch (e) {
    console.error('获取未读数失败:', e)
  }
})
</script>

<style scoped>
.comment-list-page {
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

.tabs {
  display: flex;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  padding: 0 16px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 0;
  font-size: 14px;
  color: var(--text-secondary);
  position: relative;
}

.tab-item.active {
  color: var(--accent-warm);
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--accent-warm);
  border-radius: 1px;
}

.tab-badge {
  min-width: 16px;
  height: 16px;
  background: #FF3B30;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.comment-list {
  height: calc(100vh - 110px);
  padding: 8px 0;
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

.comment-items {
  padding: 0;
}

.delete-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  flex-shrink: 0;
}

.comment-item {
  display: flex;
  padding: 16px;
  margin: 0;
  border-bottom: 1px solid var(--border-light);
  position: relative;
  background: var(--bg-card);
  width: 100%;
  box-sizing: border-box;
}

.comment-item:active {
  background: var(--bg-tertiary) !important;
}

.comment-item.unread {
  background: var(--bg-secondary);
}

.comment-item.unread:active {
  background: var(--bg-tertiary) !important;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 12px;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-username {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.comment-time {
  font-size: 11px;
  color: var(--text-tertiary);
}

.comment-original {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  font-size: 12px;
}

.original-label {
  color: var(--text-tertiary);
}

.original-content {
  color: var(--text-secondary);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comment-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.action-item:active {
  color: var(--accent-warm);
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
  right: 8px;
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
