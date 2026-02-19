<template>
  <view class="detail-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-back" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">评论详情</text>
      <view class="nav-placeholder"></view>
    </view>

    <scroll-view class="content" scroll-y @scrolltolower="loadMoreReplies">
      <!-- 根评论 -->
      <view class="root-comment" v-if="rootComment">
        <image
          :src="rootComment.avatar || '/static/default-avatar.svg'"
          class="comment-avatar"
          mode="aspectFill"
          @click.stop="goToUserProfile(rootComment.userId)"
        />
        <view class="comment-content">
          <view class="comment-header">
            <view class="comment-user-info" @click.stop="goToUserProfile(rootComment.userId)">
              <text class="comment-nickname">{{ rootComment.nickname || rootComment.username }}</text>
              <text class="comment-username">@{{ rootComment.username }}</text>
            </view>
            <text class="comment-time">{{ formatTime(rootComment.createdAt) }}</text>
          </view>
          <text class="comment-text">{{ rootComment.content }}</text>
          <view class="comment-actions">
            <view class="comment-action" @click="likeRootComment">
              <svg width="14" height="14" viewBox="0 0 24 24" :fill="rootComment.isLiked ? '#FF6B6B' : 'none'" :stroke="rootComment.isLiked ? '#FF6B6B' : 'currentColor'" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <text>{{ rootComment.likeCount || 0 }}</text>
            </view>
            <view class="comment-action">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <text>{{ rootComment.replyCount || 0 }}</text>
            </view>
            <view class="comment-action" @click="showReplyInput(rootComment)">
              <text>回复</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 回复列表 -->
      <view class="replies-section" v-if="replies.length > 0">
        <view class="replies-header">
          <text class="replies-count">{{ replies.length }}条回复</text>
        </view>
        
        <view
          v-for="reply in replies"
          :key="reply.id"
          class="reply-item"
          @click="goToReplyDetail(reply)"
        >
          <image
            :src="reply.avatar || '/static/default-avatar.svg'"
            class="reply-avatar"
            mode="aspectFill"
            @click.stop="goToUserProfile(reply.userId)"
          />
          <view class="reply-content">
            <view class="comment-header">
              <view class="comment-user-info" @click.stop="goToUserProfile(reply.userId)">
                <text class="comment-nickname">{{ reply.nickname || reply.username }}</text>
                <text class="comment-username">@{{ reply.username }}</text>
              </view>
              <text class="comment-time">{{ formatTime(reply.createdAt) }}</text>
            </view>
            <text class="comment-text">{{ reply.content }}</text>
            <view class="comment-actions" @click.stop>
              <view class="comment-action" @click="likeReply(reply)">
                <svg width="14" height="14" viewBox="0 0 24 24" :fill="reply.isLiked ? '#FF6B6B' : 'none'" :stroke="reply.isLiked ? '#FF6B6B' : 'currentColor'" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <text>{{ reply.likeCount || 0 }}</text>
              </view>
              <view class="comment-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <text>{{ reply.replyCount || 0 }}</text>
              </view>
              <view class="comment-action" @click="showReplyInput(reply)">
                <text>回复</text>
              </view>
              <view class="comment-action" @click="goToReplyDetail(reply)">
                <text style="color: #999;">查看详情</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="loadingMore" class="loading-more">
          <view class="loading-spinner"></view>
          <text>加载中...</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading" class="empty-replies">
        <text>暂无回复</text>
      </view>
    </scroll-view>

    <!-- 回复输入框 -->
    <view class="bottom-bar">
      <view class="action-input" @click="focusInput">
        <text class="placeholder">回复 {{ replyTo ? replyTo.username : '' }}...</text>
      </view>
    </view>

    <!-- 评论输入弹窗 -->
    <view v-if="showInput" class="comment-modal">
      <view class="modal-mask" @click="closeInput"></view>
      <view class="comment-input-box">
        <textarea
          v-model="replyContent"
          :placeholder="replyTo ? `回复 ${replyTo.username}:` : '写回复...'"
          class="comment-textarea"
          :focus="showInput"
          maxlength="500"
        />
        <view class="input-actions">
          <text class="char-count">{{ replyContent.length }}/500</text>
          <view
            :class="['send-btn', { active: replyContent.trim() }]"
            @click="submitReply"
          >
            <text>发送</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { commentApi } from '@/api/note'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const commentId = ref<number>(0)
const noteId = ref<number>(0)
const rootComment = ref<any>(null)
const replies = ref<any[]>([])
const loading = ref(true)
const loadingMore = ref(false)

const showInput = ref(false)
const replyContent = ref('')
const replyTo = ref<any>(null)

onLoad((options: any) => {
  if (options.commentId) {
    commentId.value = Number(options.commentId)
  }
  if (options.noteId) {
    noteId.value = Number(options.noteId)
  }
})

onMounted(() => {
  loadCommentDetail()
})

const loadCommentDetail = async () => {
  loading.value = true
  try {
    const res = await commentApi.getDetail(commentId.value)
    if (res) {
      rootComment.value = res
      replies.value = res.replies || []
    }
  } catch (error) {
    console.error('加载评论详情失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const loadMoreReplies = () => {
  // 暂时不需要加载更多，后端已返回所有回复
}

const likeRootComment = async () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }
  
  try {
    if (rootComment.value.isLiked) {
      await commentApi.unlikeComment(rootComment.value.id)
      rootComment.value.isLiked = false
      rootComment.value.likeCount--
    } else {
      await commentApi.likeComment(rootComment.value.id)
      rootComment.value.isLiked = true
      rootComment.value.likeCount++
    }
  } catch (error) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const likeReply = async (reply: any) => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }
  
  try {
    if (reply.isLiked) {
      await commentApi.unlikeComment(reply.id)
      reply.isLiked = false
      reply.likeCount--
    } else {
      await commentApi.likeComment(reply.id)
      reply.isLiked = true
      reply.likeCount++
    }
  } catch (error) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const showReplyInput = (comment: any) => {
  replyTo.value = comment
  showInput.value = true
}

const goToReplyDetail = (reply: any) => {
  uni.navigateTo({
    url: `/pages/note/comment-detail?commentId=${reply.id}&noteId=${noteId.value}`
  })
}

const goToUserProfile = (userId: number) => {
  if (!userId) return
  uni.navigateTo({
    url: `/pages/user/profile?id=${userId}`
  })
}

const focusInput = () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }
  replyTo.value = rootComment.value
  showInput.value = true
}

const closeInput = () => {
  showInput.value = false
  replyContent.value = ''
}

const submitReply = async () => {
  if (!replyContent.value.trim()) return
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }

  try {
    const parentId = replyTo.value?.id || rootComment.value?.id
    await commentApi.create(noteId.value, replyContent.value, parentId)
    uni.showToast({ title: '回复成功', icon: 'success' })
    closeInput()
    loadCommentDetail()
  } catch (error) {
    uni.showToast({ title: '回复失败', icon: 'none' })
  }
}

const goBack = () => {
  const pages = getCurrentPages()
  
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 })
  } else if (pages.length === 1 && pages[0].route === 'pages/note/comment-detail') {
    uni.redirectTo({
      url: `/pages/note/detail?id=${noteId.value}`
    })
  } else {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
}

const formatTime = (time: string) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return `${date.getMonth() + 1}-${date.getDate()}`
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #FDFCF8;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  background: #FDFCF8;
  border-bottom: 1px solid #f0f0f0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back svg {
  width: 20px;
  height: 20px;
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
}

.nav-placeholder {
  width: 32px;
}

.content {
  padding-top: 60px;
  padding-bottom: 60px;
  min-height: 100vh;
}

.root-comment {
  display: flex;
  padding: 16px;
  background: #fff;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comment-nickname {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.comment-username {
  font-size: 12px;
  color: #999;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.comment-action svg {
  width: 14px;
  height: 14px;
}

.replies-section {
  padding-top: 8px;
}

.replies-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.replies-count {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.reply-item {
  display: flex;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.reply-item:active {
  background: #f9f9f9;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin-right: 10px;
  flex-shrink: 0;
}

.reply-content {
  flex: 1;
}

.empty-replies {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: #999;
  font-size: 13px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top-color: #666;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 100;
}

.action-input {
  flex: 1;
  height: 36px;
  background: #f5f5f5;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.placeholder {
  font-size: 14px;
  color: #999;
}

.comment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.comment-input-box {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.comment-textarea {
  width: 100%;
  height: 80px;
  font-size: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  background: #f9f9f9;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.char-count {
  font-size: 12px;
  color: #999;
}

.send-btn {
  padding: 8px 20px;
  border-radius: 18px;
  background: #ddd;
  color: #fff;
  font-size: 14px;
}

.send-btn.active {
  background: #FF6B6B;
}
</style>
