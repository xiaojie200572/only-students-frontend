<template>
  <view class="creator-profile-page">
    <!-- 自定义弹窗 -->
    <CustomModal :visible="modalVisible" :title="modalTitle" :content="modalContent" :confirm-text="modalConfirmText"
      :cancel-text="modalCancelText" :show-cancel="modalShowCancel" :confirm-color="modalConfirmColor"
      @confirm="handleModalConfirm" @cancel="handleModalCancel" @close="handleModalCancel" />

    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </view>
      <text class="nav-title">创作者主页</text>
      <view class="nav-right" @click="goToReport" v-if="!isSelf">
        <text>举报</text>
      </view>
      <view class="nav-right" v-else></view>
    </view>

    <scroll-view scroll-y class="content-area">
      <view v-if="loading" class="loading-state">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <template v-else-if="creator">
        <!-- 创作者信息卡片 -->
        <view class="creator-card">
          <view class="creator-header">
            <image :src="creator.avatar || '/static/default-avatar.svg'" class="creator-avatar" mode="aspectFill" />
            <view class="creator-info">
              <text class="creator-name">{{ creator.nickname }}</text>
              <text v-if="creator.schoolName" class="creator-school">{{ creator.schoolName }}</text>
              <text class="creator-bio">{{ creator.bio || '这个人很懒，还没有简介' }}</text>
            </view>
          </view>

          <!-- 统计数据 -->
          <view class="creator-stats">
            <view class="stat-item">
              <text class="stat-num">{{ stats.noteCount }}</text>
              <text class="stat-label">笔记</text>
            </view>
            <view class="stat-item">
              <text class="stat-num">{{ formatNumber(stats.subscriberCount) }}</text>
              <text class="stat-label">粉丝</text>
            </view>
            <view class="stat-item">
              <text class="stat-num">{{ formatNumber(stats.likeCount) }}</text>
              <text class="stat-label">获赞</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="action-buttons">
            <view v-if="!isSelf" :class="['subscribe-btn', { subscribed: isSubscribed }]" @click="toggleSubscribe">
              <text v-if="!isSubscribed">订阅</text>
              <text v-else>已订阅</text>
            </view>
            <view v-if="!isSelf" class="message-btn" @click="sendMessage">
              <text>私信</text>
            </view>
          </view>
        </view>

        <!-- 笔记列表 -->
        <view class="notes-section">
          <text class="section-title">发布的笔记</text>
          <view v-if="notes.length === 0" class="empty-notes">
            <text>暂无笔记</text>
          </view>
          <view v-else class="notes-grid">
            <view v-for="note in notes" :key="note.id" class="note-item" @click="goToNote(note.id)">
              <image v-if="note.coverImage" :src="note.coverImage" class="note-cover" mode="aspectFill" />
              <view v-else class="note-cover-placeholder">
                <text class="placeholder-text">笔记</text>
              </view>
              <view class="note-info">
                <text class="note-title">{{ note.title }}</text>
                <view class="note-meta">
                  <text class="note-stats">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {{ note.viewCount }}
                  </text>
                  <text class="note-stats">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {{ note.likeCount }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <view v-else class="error-state">
        <text>用户不存在</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { get, post, del } from '@/api'
import type { UserInfo } from '@/types/api.types'
import CustomModal from '@/components/CustomModal.vue'

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

const goToReport = () => {
  uni.navigateTo({
    url: `/pages/report/submit?targetType=3&targetId=${creatorId.value}`
  })
}

const creator = ref<UserInfo | null>(null)
const notes = ref<any[]>([])
const stats = ref({
  noteCount: 0,
  subscriberCount: 0,
  likeCount: 0
})
const isSubscribed = ref(false)
const loading = ref(false)

const creatorId = ref<number>(0)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage.option.id

  if (id) {
    creatorId.value = parseInt(id)
    loadCreatorData()
  }
})

const isSelf = computed(() => {
  return userStore.userInfo?.id === creatorId.value
})

const loadCreatorData = async () => {
  loading.value = true

  try {
    // 并行获取数据
    const [userRes, notesRes, checkRes] = await Promise.all([
      get<UserInfo>(`/user/${creatorId.value}`),
      get<any[]>(`/note/user/${creatorId.value}`),
      get<boolean>(`/subscription/check/${creatorId.value}`).catch(() => false)
    ])

    creator.value = userRes
    notes.value = notesRes
    isSubscribed.value = checkRes

    // 计算统计数据
    stats.value.noteCount = notesRes.length
    stats.value.subscriberCount = userRes.followerCount || 0
    const totalLikes = notesRes.reduce((sum: number, note: any) => sum + (note.likeCount || 0), 0)
    stats.value.likeCount = totalLikes

  } catch (error) {
    console.error('加载创作者数据失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
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

const toggleSubscribe = async () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }

  if (isSubscribed.value) {
    // 取消订阅
    const confirmed = await showModal({
      title: '提示',
      content: '确定要取消订阅吗？'
    })

    if (confirmed) {
      try {
        await del(`/subscription/${creatorId.value}`)
        isSubscribed.value = false
        stats.value.subscriberCount = Math.max(0, stats.value.subscriberCount - 1)
        userStore.updateUserInfo()
        uni.showToast({ title: '已取消订阅', icon: 'success' })
      } catch (error) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    }
  } else {
    subscribe()
  }
}

const subscribe = async () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }

  const confirmed = await showModal({
    title: '订阅确认',
    content: `确定要订阅 ${creator.value?.nickname} 吗？`
  })

  if (confirmed) {
    try {
      await post('/subscription', { creatorId: creatorId.value })
      isSubscribed.value = true
      stats.value.subscriberCount++
      userStore.updateUserInfo()
      uni.showToast({ title: '订阅成功', icon: 'success' })
    } catch (error) {
      uni.showToast({ title: '订阅失败', icon: 'none' })
    }
  }
}

const sendMessage = () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }

  // 跳转到聊天页面，传递目标用户ID和名称
  // chat页面会根据targetId加载或创建会话
  uni.navigateTo({
    url: `/pages/message/chat?targetId=${creatorId.value}&name=${encodeURIComponent(creator.value?.nickname || '')}&avatar=${encodeURIComponent(creator.value?.avatar || '')}`
  })
}

const goToNote = (noteId: number) => {
  uni.navigateTo({ url: `/pages/note/detail?id=${noteId}` })
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.creator-profile-page {
  min-height: 100vh;
  background: var(--bg-primary);
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
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-light);
  z-index: 100;
}

.back-btn {
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

.nav-right {
  width: auto;
  min-width: 40px;
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.content-area {
  margin-top: 60px;
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
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.creator-card {
  background: var(--bg-card);
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
}

.creator-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.creator-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
  border: 3px solid var(--bg-card);
  box-shadow: 0 0 0 2px var(--accent-warm);
}

.creator-info {
  flex: 1;
}

.creator-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.creator-school {
  font-size: 13px;
  color: var(--accent-warm);
  display: block;
  margin-bottom: 8px;
}

.creator-bio {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: block;
}

.creator-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 16px;
}

.stat-item {
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

.action-buttons {
  display: flex;
  gap: 12px;
}

.subscribe-btn {
  flex: 1;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  color: white;
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
  text-align: center;
}

.subscribe-btn.subscribed {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.message-btn {
  padding: 12px 24px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
  border: 1px solid var(--border-light);
}

.notes-section {
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  display: block;
}

.empty-notes {
  text-align: center;
  padding: 40px;
  color: var(--text-tertiary);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.note-item {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.note-cover {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.note-cover-placeholder {
  width: 100%;
  height: 120px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  color: var(--text-tertiary);
  font-size: 14px;
}

.note-info {
  padding: 10px;
}

.note-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.note-stats {
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>
