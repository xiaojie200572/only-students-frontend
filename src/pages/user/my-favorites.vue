<template>
  <view class="favorites-page">
    <view class="page-nav">
      <text class="nav-title">收藏</text>
    </view>

    <scroll-view scroll-y class="content-area">
      <view v-if="loading && favorites.length === 0" class="loading-state">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <view v-else-if="favorites.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <text class="empty-title">暂无收藏</text>
        <text class="empty-desc">收藏感兴趣的笔记，方便以后查看</text>
        <view class="empty-action" @click="goToHome">去浏览</view>
      </view>

      <view v-else class="favorites-list">
        <view
          v-for="item in favorites"
          :key="item.id"
          class="favorite-item"
          @click="goToNote(item.noteId)"
        >
          <image v-if="item.coverImage" :src="item.coverImage" class="note-cover" mode="aspectFill"/>
          <view class="note-info">
            <text class="note-title">{{ item.title }}</text>
            <view class="note-meta">
              <text class="author">{{ item.authorName }}</text>
              <text class="time">{{ formatTime(item.createdAt) }}</text>
            </view>
          </view>
          <view class="favorite-btn" @click.stop="cancelFavorite(item.noteId)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF6B6B" stroke="#FF6B6B" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部导航 -->
    <TabBar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { get } from '@/api'
import TabBar from '@/components/TabBar.vue'

const favorites = ref<any[]>([])
const loading = ref(false)

onMounted(() => {
  loadFavorites()
})

const loadFavorites = async () => {
  loading.value = true
  try {
    const res = await get<any[]>('/favorite/my')
    favorites.value = res
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const formatTime = (time: string): string => {
  const date = new Date(time)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const goBack = () => {
  uni.navigateBack()
}

const goToHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const goToNote = (noteId: number) => {
  uni.navigateTo({ url: `/pages/note/detail?id=${noteId}` })
}

const cancelFavorite = (noteId: number) => {
  uni.showModal({
    title: '提示',
    content: '确定要取消收藏吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await get(`/favorite/unfavorite/${noteId}`)
          favorites.value = favorites.value.filter(item => item.noteId !== noteId)
          uni.showToast({ title: '已取消收藏', icon: 'success' })
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' })
        }
      }
    }
  })
}
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: calc(52px + env(safe-area-inset-bottom));
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

.favorites-list {
  padding: 16px;
}

.favorite-item {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid var(--border-light);
}

.note-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 12px;
  object-fit: cover;
}

.note-info {
  flex: 1;
  min-width: 0;
}

.note-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.favorite-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}
</style>
