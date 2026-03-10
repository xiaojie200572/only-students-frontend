<template>
  <view class="my-notes-page">
    <!-- 自定义弹窗 -->
    <CustomModal
      :visible="modalVisible"
      :title="modalTitle"
      :content="modalContent"
      :confirm-text="modalConfirmText"
      :cancel-text="modalCancelText"
      :show-cancel="modalShowCancel"
      :confirm-color="modalConfirmColor"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
      @close="handleModalCancel"
    />

    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </view>
      <text class="nav-title">我的笔记</text>
      <view class="nav-right">
        <view class="publish-btn" @click="goToPublish">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content-area" @scrolltolower="loadMore">
      <view v-if="loading && notes.length === 0" class="loading-state">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <view v-else-if="notes.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        <text class="empty-title">暂无笔记</text>
        <text class="empty-desc">快去发布你的第一篇笔记吧</text>
        <view class="empty-action" @click="goToPublish">创建笔记</view>
      </view>

      <view v-else class="notes-list">
        <view v-for="note in notes" :key="note.id" class="note-card" @click="goToNoteDetail(note.id)">
          <view class="note-header">
            <image v-if="note.coverImage" :src="note.coverImage" class="note-cover" mode="aspectFill" />
            <view v-else class="note-cover-placeholder">
              <text>笔记</text>
            </view>
            <view class="note-status">
              <view :class="['status-badge', note.status === 1 ? 'published' : 'draft']">
                {{ note.status === 1 ? '已发布' : '草稿' }}
              </view>
            </view>
          </view>

          <view class="note-content">
            <text class="note-title">{{ note.title }}</text>
            <!-- <text class="note-summary" v-if="note.summary">{{ note.summary }}</text> -->

            <view class="note-stats">
              <view class="stat-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <text>{{ note.viewCount || 0 }}</text>
              </view>
              <view class="stat-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <text>{{ note.commentCount || 0 }}</text>
              </view>
            </view>
          </view>

          <view class="note-actions">
            <view class="action-btn" @click.stop="editNote(note)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <text>编辑</text>
            </view>
            <view v-if="note.status === 0 || note.status === 1" class="action-btn publish"
              @click.stop="publishNote(note)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
              <text>发布</text>
            </view>
            <view v-else class="action-btn published">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <text>已发布</text>
            </view>
          </view>
        </view>

        <view v-if="loading" class="loading-more">
          <view class="loading-spinner"></view>
          <text>加载中...</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { noteApi } from '@/api/note'
import type { Note } from '@/types/api.types'
import CustomModal from '@/components/CustomModal.vue'

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

const notes = ref<Note[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const needRefresh = ref(false)

onMounted(() => {
  loadNotes()

  // 监听笔记更新事件
  uni.$on('notes-updated', () => {
    console.log('收到笔记更新事件，刷新列表')
    page.value = 1
    hasMore.value = true
    notes.value = []
    loadNotes()
  })
})

onShow(() => {
  // 每次显示页面都刷新，确保数据最新
  page.value = 1
  hasMore.value = true
  notes.value = []
  loadNotes()
})

const loadNotes = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  try {
    const res = await noteApi.getMyNotes()
    if (page.value === 1) {
      notes.value = res
    } else {
      notes.value.push(...res)
    }
    hasMore.value = res.length === 20
    page.value++
  } catch (error) {
    console.error('加载笔记失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  loadNotes()
}

const goToNoteDetail = (noteId: number) => {
  uni.navigateTo({ url: `/pages/note/detail?id=${noteId}` })
}

const goToPublish = () => {
  uni.navigateTo({ url: '/pages/note/publish' })
}

const editNote = (note: Note) => {
  uni.navigateTo({ url: `/pages/note/publish?id=${note.id}&edit=true` })
}

const publishNote = async (note: Note) => {

  if (!note.id) {
    uni.showToast({ title: '笔记ID无效', icon: 'none' })
    return
  }

  const confirmed = await showModal({
    title: '确认发布',
    content: `确定要发布笔记"${note.title}"吗？发布后其他用户将可以看到。`,
    confirmColor: '#4CAF50'
  })

  if (confirmed) {
    try {
      console.log('调用发布API, noteId:', note.id)
      await noteApi.publish(note.id)
      note.status = 2 // 更新状态为已发布
      uni.showToast({ title: '发布成功', icon: 'success' })
    } catch (error: any) {
      uni.showToast({ title: `发布失败: ${error.message || '未知错误'}`, icon: 'none' })
    }
  }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.my-notes-page {
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
  width: 40px;
  display: flex;
  justify-content: flex-end;
}

.publish-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-warm);
  border-radius: 50%;
  color: white;
}

.content-area {
  margin-top: 60px;
  padding: 16px;
  height: calc(100vh - 60px);
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

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.note-header {
  position: relative;
}

.note-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.note-cover-placeholder {
  width: 100%;
  height: 180px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.note-cover-placeholder text {
  color: var(--text-tertiary);
  font-size: 18px;
}

.note-status {
  position: absolute;
  top: 12px;
  right: 12px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge.published {
  background: #E8F5E9;
  color: #4CAF50;
}

.status-badge.draft {
  background: #FFF3E0;
  color: #FF9800;
}

.note-content {
  padding: 16px;
}

.note-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: block;
}

.note-summary {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-tertiary);
}

.note-actions {
  display: flex;
  border-top: 1px solid var(--border-light);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.action-btn.delete {
  color: #F44336;
  border-left: 1px solid var(--border-light);
}

.action-btn.publish {
  color: var(--accent-warm);
  border-left: 1px solid var(--border-light);
}

.action-btn.published {
  color: #4CAF50;
  border-left: 1px solid var(--border-light);
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
