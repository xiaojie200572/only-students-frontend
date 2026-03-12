<template>
  <view class="subscription-feed-page">
    <view class="page-nav">
      <text class="nav-title">订阅</text>
    </view>
    
    <scroll-view 
      scroll-y 
      class="content-area" 
      @scrolltolower="loadMore" 
      :refresher-enabled="true"
      :refresher-triggered="refreshing" 
      @refresherrefresh="onRefresh"
    >
      <Waterfall :notes="notes" @note-click="handleNoteClick" />
      
      <view v-if="loading" class="loading-more">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>
      
      <view v-if="!loading && notes.length === 0" class="empty-state">
        <text class="empty-title">暂无订阅内容</text>
        <text class="empty-desc">去订阅感兴趣的创作者吧</text>
      </view>
      
      <view v-if="!hasMore && notes.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>
    </scroll-view>
    
    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { noteApi } from '@/api/note'
import Waterfall from '@/components/Waterfall.vue'
import TabBar from '@/components/TabBar.vue'
import type { Note } from '@/types/api.types'

const notes = ref<Note[]>([])
const loading = ref(false)
const refreshing = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

const loadNotes = async (refresh = false) => {
  if (loading.value) return
  loading.value = true
  
  try {
    const page = refresh ? 1 : currentPage.value
    const result = await noteApi.getSubscribed(page, 20)
    const newNotes = result || []
    
    if (refresh) {
      notes.value = newNotes
      currentPage.value = 1
    } else {
      notes.value = [...notes.value, ...newNotes]
    }
    
    hasMore.value = newNotes.length >= 20
    if (!refresh && newNotes.length > 0) {
      currentPage.value++
    }
  } catch (error) {
    console.error('获取订阅笔记失败:', error)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const onRefresh = () => {
  refreshing.value = true
  loadNotes(true)
}

const loadMore = () => {
  if (!hasMore.value || loading.value) return
  loadNotes()
}

const handleNoteClick = (note: Note) => {
  uni.navigateTo({
    url: `/pages/note/detail?id=${note.id}`
  })
}

onMounted(() => {
  loadNotes(true)
})
</script>

<style scoped>
.subscription-feed-page {
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
  height: calc(100vh - 60px - 60px);
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--text-tertiary);
  font-size: 13px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-light);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
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

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-tertiary);
}

.no-more {
  text-align: center;
  padding: 20px;
  color: var(--text-tertiary);
  font-size: 13px;
}
</style>
