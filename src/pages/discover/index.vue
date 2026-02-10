<template>
  <view class="search-page">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          class="search-input"
          placeholder="搜索笔记、用户..."
          v-model="searchKeyword"
          @confirm="startSearch"
          @focus="onSearchFocus"
        />
        <text v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</text>
      </view>
      <text class="cancel-btn" v-if="showCancel" @click="cancelSearch">取消</text>
    </view>

    <!-- 未搜索状态：显示热门和分类 -->
    <template v-if="!hasSearched">
      <!-- 热门搜索 -->
      <view class="section" v-if="!isSearching || !searchKeyword">
        <view class="section-header">
          <text class="section-title">热门搜索</text>
          <text class="refresh-btn" @click="fetchHotTags">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            换一换
          </text>
        </view>
        <view class="hot-tags">
          <view
            v-for="(tag, index) in hotTags"
            :key="index"
            class="hot-tag"
            @click="searchByKeyword(tag)"
          >
            <text class="tag-rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
            {{ tag }}
          </view>
        </view>
      </view>

      <!-- 热门学科 -->
      <view class="section" v-if="!isSearching || !searchKeyword">
        <text class="section-title">热门学科</text>
        <view class="category-grid">
          <view
            v-for="cat in categories"
            :key="cat.id"
            class="category-item"
            @click="searchByCategory(cat)"
          >
            <text class="category-icon">{{ cat.icon }}</text>
            <text class="category-name">{{ cat.name }}</text>
          </view>
        </view>
      </view>

      <!-- 搜索提示 -->
      <view v-if="isSearching && searchKeyword" class="search-hint">
        <text>按回车键搜索"{{ searchKeyword }}"</text>
      </view>
    </template>

    <!-- 搜索结果 -->
    <template v-else>
      <!-- 结果分类 Tab -->
      <view class="result-tabs">
        <view 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-item', { active: currentTab === tab.key }]"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </view>
      </view>

      <!-- 加载中 -->
      <view v-if="loading" class="loading-state">
        <view class="spinner"></view>
        <text>搜索中...</text>
      </view>

      <!-- 综合结果 -->
      <scroll-view 
        v-else-if="currentTab === 'all'" 
        scroll-y 
        class="result-list" 
        @scrolltolower="loadMore"
      >
        <!-- 用户结果（前3个） -->
        <view v-if="userResults.length > 0" class="result-section">
          <view class="section-header">
            <text class="section-title">相关用户</text>
            <text class="more-link" @click="currentTab = 'users'">查看更多 &gt;</text>
          </view>
          <scroll-view scroll-x class="user-scroll" show-scrollbar="false">
            <view class="user-list">
              <view 
                v-for="user in userResults.slice(0, 5)" 
                :key="user.id"
                class="user-card"
                @click="goToUserProfile(user.id)"
              >
                <image 
                  :src="user.avatar || '/static/default-avatar.svg'" 
                  class="user-avatar"
                  mode="aspectFill"
                />
                <text class="user-name">{{ user.nickname || user.username }}</text>
                <text class="user-bio" v-if="user.bio">{{ user.bio.substring(0, 10) }}...</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 笔记结果 -->
        <view v-if="noteResults.length > 0" class="result-section">
          <view class="section-header">
            <text class="section-title">相关笔记</text>
          </view>
          <view class="note-grid">
            <view 
              v-for="note in noteResults" 
              :key="note.id"
              class="note-card"
              @click="goToNoteDetail(note.id)"
            >
              <image 
                v-if="note.coverImage" 
                :src="note.coverImage" 
                class="note-cover"
                mode="aspectFill"
              />
              <view class="note-content">
                <text class="note-title">{{ note.title }}</text>
                <view class="note-author">
                  <image 
                    :src="note.authorAvatar || '/static/default-avatar.svg'" 
                    class="author-avatar"
                  />
                  <text class="author-name">{{ note.authorName }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="userResults.length === 0 && noteResults.length === 0" class="empty-state">
          <text>没有找到相关内容</text>
        </view>
      </scroll-view>

      <!-- 笔记列表 -->
      <scroll-view 
        v-else-if="currentTab === 'notes'" 
        scroll-y 
        class="result-list" 
        @scrolltolower="loadMore"
      >
        <view v-if="noteResults.length > 0" class="note-grid">
          <view 
            v-for="note in noteResults" 
            :key="note.id"
            class="note-card"
            @click="goToNoteDetail(note.id)"
          >
            <image 
              v-if="note.coverImage" 
              :src="note.coverImage" 
              class="note-cover"
              mode="aspectFill"
            />
            <view class="note-content">
              <text class="note-title">{{ note.title }}</text>
              <view class="note-author">
                <image 
                  :src="note.authorAvatar || '/static/default-avatar.svg'" 
                  class="author-avatar"
                />
                <text class="author-name">{{ note.authorName }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <text>没有找到相关笔记</text>
        </view>
      </scroll-view>

      <!-- 用户列表 -->
      <scroll-view 
        v-else-if="currentTab === 'users'" 
        scroll-y 
        class="result-list" 
        @scrolltolower="loadMore"
      >
        <view v-if="userResults.length > 0" class="user-list-full">
          <view 
            v-for="user in userResults" 
            :key="user.id"
            class="user-item"
            @click="goToUserProfile(user.id)"
          >
            <image 
              :src="user.avatar || '/static/default-avatar.svg'" 
              class="user-avatar-large"
              mode="aspectFill"
            />
            <view class="user-info">
              <text class="user-name">{{ user.nickname || user.username }}</text>
              <text class="user-bio" v-if="user.bio">{{ user.bio }}</text>
              <text class="user-stats" v-if="user.subscriberCount">
                {{ formatNumber(user.subscriberCount) }} 粉丝
              </text>
            </view>
            <view 
              class="follow-btn" 
              :class="{ following: user.isFollowing }"
              v-if="user.id !== currentUserId"
              @click.stop="toggleFollow(user)"
            >
              <text>{{ user.isFollowing ? '已关注' : '关注' }}</text>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <text>没有找到相关用户</text>
        </view>
      </scroll-view>
    </template>

    <!-- 底部导航 -->
    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import TabBar from '@/components/TabBar.vue'
import { searchApi } from '@/api/search'
import { subscriptionApi } from '@/api/message'
import { NOTE_CATEGORIES } from '@/config/api.config'
import type { Note, UserInfo } from '@/types/api.types'

const userStore = useUserStore()
const currentUserId = computed(() => userStore.userInfo?.id)

// 搜索状态
const searchKeyword = ref('')
const isSearching = ref(false)
const showCancel = ref(false)
const hasSearched = ref(false)
const currentTab = ref('all')
const loading = ref(false)

// 搜索结果
const noteResults = ref<Note[]>([])
const userResults = ref<UserInfo[]>([])
const hotTags = ref<string[]>(['高考数学', '雅思备考', 'Python入门', '考研政治'])
const categories = ref(NOTE_CATEGORIES)

// 分页
const currentPage = ref(1)
const pageSize = 10
const hasMore = ref(true)

// Tab 配置
const tabs = [
  { key: 'all', label: '综合' },
  { key: 'notes', label: '笔记' },
  { key: 'users', label: '用户' }
]

// 获取热门搜索
const fetchHotTags = async () => {
  try {
    const data = await searchApi.getHotKeywords(10)
    hotTags.value = data.list || []
  } catch (error) {
    console.error('获取热门搜索失败:', error)
  }
}

// 搜索框聚焦
const onSearchFocus = () => {
  isSearching.value = true
  showCancel.value = true
}

// 开始搜索
const startSearch = async () => {
  if (!searchKeyword.value.trim()) return
  
  hasSearched.value = true
  isSearching.value = false
  currentPage.value = 1
  hasMore.value = true
  currentTab.value = 'all'
  
  await performSearch()
}

// 执行搜索
const performSearch = async () => {
  loading.value = true
  
  try {
    // 根据当前 Tab 决定搜索范围
    const fetchNotes = currentTab.value !== 'users'
    const fetchUsers = currentTab.value !== 'notes'
    
    const promises = []
    
    if (fetchNotes) {
      promises.push(
        searchApi.searchNotes({
          keyword: searchKeyword.value,
          page: currentPage.value,
          size: pageSize
        }).catch(() => ({ list: [], total: 0 }))
      )
    }
    
    if (fetchUsers) {
      promises.push(
        searchApi.searchUsers({
          keyword: searchKeyword.value,
          page: currentPage.value,
          size: pageSize
        }).catch(() => ({ list: [], total: 0 }))
      )
    }
    
    const results = await Promise.all(promises)
    
    if (currentPage.value === 1) {
      if (fetchNotes) {
        noteResults.value = results[0]?.list || []
      }
      if (fetchUsers) {
        const userIndex = fetchNotes ? 1 : 0
        userResults.value = results[userIndex]?.list || []
      }
    } else {
      if (fetchNotes) {
        noteResults.value.push(...(results[0]?.list || []))
      }
      if (fetchUsers) {
        const userIndex = fetchNotes ? 1 : 0
        userResults.value.push(...(results[userIndex]?.list || []))
      }
    }
    
    // 判断是否还有更多
    const noteTotal = fetchNotes ? results[0]?.total || 0 : 0
    const userTotal = fetchUsers ? (fetchNotes ? results[1]?.total : results[0]?.total) || 0 : 0
    const totalLoaded = noteResults.value.length + userResults.value.length
    hasMore.value = totalLoaded < (noteTotal + userTotal)
    
  } catch (error) {
    console.error('搜索失败:', error)
    uni.showToast({ title: '搜索失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 切换 Tab
const switchTab = (tab: string) => {
  currentTab.value = tab
  currentPage.value = 1
  performSearch()
}

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return
  currentPage.value++
  performSearch()
}

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = ''
  hasSearched.value = false
  isSearching.value = false
  noteResults.value = []
  userResults.value = []
}

// 取消搜索
const cancelSearch = () => {
  if (hasSearched.value) {
    clearSearch()
  } else {
    isSearching.value = false
    showCancel.value = false
  }
}

// 按关键词搜索
const searchByKeyword = (keyword: string) => {
  searchKeyword.value = keyword
  startSearch()
}

// 按分类搜索
const searchByCategory = (cat: { id: number; name: string }) => {
  searchKeyword.value = cat.name
  startSearch()
}

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
  uni.navigateTo({ url: `/pages/user/profile?id=${userId}` })
}

// 跳转到笔记详情
const goToNoteDetail = (noteId: number) => {
  uni.navigateTo({ url: `/pages/note/detail?id=${noteId}` })
}

// 关注/取消关注
const toggleFollow = async (user: UserInfo) => {
  try {
    if (user.isFollowing) {
      await subscriptionApi.unsubscribe(user.id)
      user.isFollowing = false
    } else {
      await subscriptionApi.subscribe({ creatorId: user.id })
      user.isFollowing = true
    }
  } catch (error) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

onMounted(() => {
  fetchHotTags()
  
  // 检查 URL 参数，如果有 keyword 则自动搜索
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage && currentPage.options && currentPage.options.keyword) {
    searchKeyword.value = decodeURIComponent(currentPage.options.keyword)
    startSearch()
  }
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: calc(52px + env(safe-area-inset-bottom));
}

/* 搜索头部 */
.search-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border-radius: 18px;
  padding: 0 12px;
  height: 36px;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-tertiary);
  margin-right: 8px;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 14px;
  color: var(--text-primary);
  background: transparent;
  border: none;
}

.clear-btn {
  padding: 4px;
  color: var(--text-tertiary);
  font-size: 18px;
  cursor: pointer;
}

.cancel-btn {
  margin-left: 12px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
}

/* 区块 */
.section {
  padding: 16px;
  background: var(--bg-card);
  margin-bottom: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.refresh-btn {
  font-size: 12px;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-link {
  font-size: 12px;
  color: var(--accent-warm);
}

/* 热门标签 */
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-tag {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-rank {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-tertiary);
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border-radius: 3px;
}

.tag-rank.top {
  color: white;
  background: var(--accent-coral);
}

/* 学科分类 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.category-item {
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 12px 8px;
  text-align: center;
}

.category-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 4px;
}

.category-name {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 搜索提示 */
.search-hint {
  text-align: center;
  padding: 40px;
  color: var(--text-tertiary);
  font-size: 14px;
}

/* 结果 Tab */
.result-tabs {
  display: flex;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 10;
}

.result-tabs .tab-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  color: var(--text-secondary);
  position: relative;
}

.result-tabs .tab-item.active {
  color: var(--accent-warm);
  font-weight: 600;
}

.result-tabs .tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--accent-warm);
  border-radius: 2px;
}

/* 加载中 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
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

/* 结果列表 */
.result-list {
  height: calc(100vh - 140px);
}

.result-section {
  padding: 12px 16px;
  background: var(--bg-card);
  margin-bottom: 8px;
}

/* 用户列表（横向） */
.user-scroll {
  white-space: nowrap;
}

.user-list {
  display: flex;
  gap: 12px;
  padding: 4px 0;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin-bottom: 6px;
  background: var(--bg-secondary);
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-bio {
  font-size: 11px;
  color: var(--text-tertiary);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 笔记网格 */
.note-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 8px;
}

.note-card {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
}

.note-cover {
  width: 100%;
  height: 120px;
  background: var(--bg-secondary);
}

.note-content {
  padding: 10px;
}

.note-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-author {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.author-name {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 用户列表（纵向） */
.user-list-full {
  background: var(--bg-card);
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  background: var(--bg-secondary);
}

.user-info {
  flex: 1;
  overflow: hidden;
}

.user-info .user-bio {
  max-width: 100%;
  margin-top: 2px;
}

.user-stats {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.follow-btn {
  padding: 6px 14px;
  background: var(--accent-warm);
  border-radius: 14px;
}

.follow-btn.following {
  background: var(--bg-secondary);
}

.follow-btn text {
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.follow-btn.following text {
  color: var(--text-secondary);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
  font-size: 14px;
}
</style>
