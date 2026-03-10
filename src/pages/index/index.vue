<template>
  <view class="home-page">
    <!-- 顶部导航栏 -->
    <NavBar />

    <!-- 分类筛选栏 -->
    <view class="category-bar">
      <!-- 固定项组 -->
      <view class="category-fixed">
        <view
          class="category-item"
          :class="{ active: activeCategory === 'all' }"
          @click="selectCategory('all')"
        >
          全部
        </view>
        <view class="category-divider"></view>
        <view
          class="category-item"
          :class="{ active: activeCategory === 'school' }"
          @click="selectCategory('school')"
        >
          我的学校
        </view>
      </view>

      <!-- 快捷标签滚动区 -->
      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false" :enable-flex="true">
        <view class="category-tags">
          <view
            v-for="(tag, index) in quickTags"
            :key="index"
            class="category-item tag-item"
            :class="{ active: activeTag === tag }"
            @click="selectTag(tag)"
          >
            {{ tag }}
            <text class="tag-remove" @click.stop="removeTag(index)">×</text>
          </view>
        </view>
      </scroll-view>

      <!-- 添加标签按钮 -->
      <view class="add-tag-btn" @click="showAddTagModal">
        <text>+</text>
      </view>
    </view>

    <!-- 添加标签弹窗 -->
    <view v-if="addTagModalVisible" class="modal-mask" @click="closeAddTagModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">添加快捷标签</text>
          <text class="modal-close" @click="closeAddTagModal">×</text>
        </view>
        <view class="modal-body">
          <input
            v-model="newTagName"
            class="tag-input"
            placeholder="输入标签名称"
            maxlength="10"
            focus
          />
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel" @click="closeAddTagModal">取消</button>
          <button class="modal-btn confirm" @click="confirmAddTag">确定</button>
        </view>
      </view>
    </view>

    <!-- 瀑布流笔记列表 -->
    <scroll-view scroll-y class="content-area" @scrolltolower="loadMore" :refresher-enabled="true"
      :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <Waterfall :notes="currentNotes" @note-click="handleNoteClick" />

      <!-- 加载更多 -->
      <view v-if="loading" class="loading-more">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <!-- 没有更多了 -->
      <view v-if="!hasMore && currentNotes.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>

      <!-- 空状态 -->
      <view v-if="currentNotes.length === 0 && !loading" class="empty-state">
       暂无笔记
      </view>
    </scroll-view>

    <!-- 返回顶部按钮 -->
    <view v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </view>

    <!-- 底部导航 -->
    <TabBar :current="0" />
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Waterfall from '@/components/Waterfall.vue'
import TabBar from '@/components/TabBar.vue'

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/user'
import { searchApi } from '@/api/search'
import { noteApi } from '@/api/note'
import type { Note } from '@/types/api.types'

const userStore = useUserStore()

// 分类筛选
const activeCategory = ref('all') // 'all' or 'school'
const activeTag = ref('')
const quickTags = ref<string[]>([])

// 分类数据独立存储，避免覆盖
const allNotes = ref<Note[]>([])
const schoolNotes = ref<Note[]>([])
const currentNotes = computed(() => {
  if (activeCategory.value === 'school') {
    return schoolNotes.value
  }
  return allNotes.value
})

// 添加标签弹窗
const addTagModalVisible = ref(false)
const newTagName = ref('')

// 从本地存储加载标签
const loadTags = () => {
  const saved = uni.getStorageSync('quickTags')
  if (saved) {
    quickTags.value = JSON.parse(saved)
  }
}

// 保存标签到本地存储
const saveTags = () => {
  uni.setStorageSync('quickTags', JSON.stringify(quickTags.value))
}

// 选择分类
const selectCategory = (category: string) => {
  activeCategory.value = category
  fetchWithFilters()
}

// 选择标签
const selectTag = (tag: string) => {
  if (activeTag.value === tag) {
    activeTag.value = ''
  } else {
    activeTag.value = tag
  }
  fetchWithFilters()
}

// 根据筛选条件获取笔记
const fetchWithFilters = async () => {
  if (loadingMore.value) return

  try {
    let notes: Note[] = []

    if (activeCategory.value === 'all' && !activeTag.value) {
      // 全部笔记：使用数据库
      const result = await noteApi.getLatest(20)
      notes = result || []
      allNotes.value = notes
    } else if (activeCategory.value === 'school') {
      // 使用数据库按学校查询
      const schoolId = userStore.userInfo?.schoolId
      if (schoolId) {
        const result = await noteApi.getBySchoolId(schoolId, 20)
        notes = result || []
        schoolNotes.value = notes
      } else {
        uni.showToast({ title: '请先设置学校', icon: 'none' })
        return
      }
    } else if (activeTag.value) {
      // 使用 search-service 搜索（标题、内容、标签）
      const result = await searchApi.searchNotes({
        keyword: activeTag.value,
        page: 1,
        size: 20
      })
      notes = result.list || []
      allNotes.value = notes
    } else {
      // 默认从数据库获取（全部笔记）
      notes = await noteApi.getLatest(20)
      notes = notes || []
      allNotes.value = notes
    }
  } catch (error) {
    console.error('获取笔记失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

// 显示添加标签弹窗
const showAddTagModal = () => {
  newTagName.value = ''
  addTagModalVisible.value = true
}

// 关闭添加标签弹窗
const closeAddTagModal = () => {
  addTagModalVisible.value = false
}

// 确认添加标签
const confirmAddTag = () => {
  const tag = newTagName.value.trim()
  if (tag && !quickTags.value.includes(tag)) {
    quickTags.value.push(tag)
    saveTags()
  }
  closeAddTagModal()
}

// 删除标签
const removeTag = (index: number) => {
  const removedTag = quickTags.value[index]
  quickTags.value.splice(index, 1)
  saveTags()
  if (activeTag.value === removedTag) {
    activeTag.value = ''
  }
}

// 响应式数据
const refreshing = ref(false)
const showBackToTop = ref(false)

// 本地加载状态
const loadingMore = ref(false)
const hasMore = ref(true)

// 加载更多
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  
  loadingMore.value = true
  try {
    let notes: Note[] = []
    let currentPage = 1
    
    if (activeCategory.value === 'all' && !activeTag.value) {
      // 数据库不支持分页，暂时不支持加载更多
      hasMore.value = false
    } else if (activeCategory.value === 'school') {
      const schoolId = userStore.userInfo?.schoolId
      if (schoolId) {
        // 数据库不支持分页，暂时不支持加载更多
        hasMore.value = false
      }
    }
    
    hasMore.value = notes.length > 0
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loadingMore.value = false
  }
}

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  await fetchWithFilters()
  refreshing.value = false
}

// 笔记点击
const handleNoteClick = (note: Note) => {
  uni.navigateTo({
    url: `/pages/note/detail?id=${note.id}`
  })
}

// 增量更新收藏数（乐观更新核心）
const handleFavoriteUpdate = (payload: { id: number; delta: number }) => {
  const updateNotes = (notes: Note[]) => {
    return notes.map(n => {
      if (n.id === payload.id) {
        return { ...n, favoriteCount: (n.favoriteCount || 0) + payload.delta }
      }
      return n
    })
  }
  allNotes.value = updateNotes(allNotes.value)
  schoolNotes.value = updateNotes(schoolNotes.value)
}

// 生命周期
onMounted(() => {
  // 加载快捷标签
  loadTags()

  // 只在第一次加载时请求
  if (!allNotes.value.length && activeCategory.value === 'all') {
    fetchWithFilters()
  }

  // 监听收藏更新事件（来自详情页）
  uni.$on('note-favorite-updated', handleFavoriteUpdate)
})

// 页面销毁时取消监听（防止重复绑定）
onBeforeUnmount(() => {
  uni.$off('note-favorite-updated', handleFavoriteUpdate)
})
const scrollToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
}
</script>

<style>
@import '@/styles/theme.css';

.home-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 60px;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
}

.category-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 0px 12px;
    background: var(--bg-primary);
}

.category-scroll {
  flex: 1;
  width: 0;
  white-space: nowrap;
  margin-left: 10px;
}

.category-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 12px;
}

.category-fixed {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  height: 24px;
}

.category-divider {
  width: 1px;
  height: 14px;
  background: var(--border-light);
}

.category-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

.category-item.active {
  color: var(--accent-warm);
  font-weight: 600;
}

/* 标签项（带删除按钮） */
.tag-item {
  position: relative;
  padding: 6px 28px 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  white-space: nowrap;
}

.tag-item.active {
  background: var(--accent-warm);
  color: white;
  border-color: var(--accent-warm);
}

.tag-remove {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  font-size: 12px;
  color: var(--text-tertiary);
  background: var(--bg-primary);
  border-radius: 50%;
}

.tag-remove:hover {
  color: #ff4d4f;
}

/* 添加标签按钮 */
.add-tag-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 50%;
  flex-shrink: 0;
}

.add-tag-btn text {
  font-size: 16px;
  color: var(--accent-warm);
  line-height: 1;
}

/* 添加标签弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 80%;
  max-width: 320px;
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  font-size: 24px;
  color: var(--text-tertiary);
  line-height: 1;
}

.modal-body {
  padding: 20px;
}

.tag-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  font-size: 15px;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  color: var(--text-primary);
}

.modal-footer {
  display: flex;
  border-top: 1px solid var(--border-light);
}

.modal-btn {
  flex: 1;
  height: 48px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  background: transparent;
}

.modal-btn.cancel {
  color: var(--text-secondary);
}

.modal-btn.confirm {
  color: var(--accent-warm);
  border-left: 1px solid var(--border-light);
}

.filter-btn {
  display: inline-block;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.filter-btn.active {
  background: var(--accent-warm);
  color: white;
  border-color: var(--accent-warm);
}

.content-area {
  flex: 1;
  overflow-y: scroll;
  padding-bottom: 20px;
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

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-light);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-more ,.empty-state{
  text-align: center;
  padding: 20px;
  color: var(--text-tertiary);
  font-size: 14px;
}

.back-to-top {
  position: fixed;
  bottom: 84px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-medium);
  z-index: 98;
}

.back-to-top svg {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}
</style>
