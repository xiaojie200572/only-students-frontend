<template>
  <view class="search-page">
    <!-- 顶部搜索框 -->
    <view class="search-header">
      <view class="search-bar">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input type="text" class="search-input" placeholder="搜索笔记、创作者..." v-model="searchKeyword" @focus="onSearchFocus"
          @confirm="startSearch" />
        <text v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">×</text>
      </view>
      <text v-if="hasSearched" class="cancel-btn" @click="cancelSearch">取消</text>
    </view>

    <!-- 未搜索状态：显示热门和分类 -->
    <template v-if="!hasSearched">
      <!-- 热门搜索 -->
      <view class="section" v-if="!isSearching || !searchKeyword">
        <view class="section-header">
          <text class="section-title">热搜榜单</text>
          <view class="view-all-btn" @click="goToHotRank">
            <text>查看完整榜单</text>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </view>
        </view>
        <view class="hot-tags">
          <view v-for="(tag, index) in hotTags.slice(0, 10)" :key="index" class="hot-tag" @click="searchByKeyword(tag)">
            <text class="tag-rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
            <text class="tag-text">{{ tag }}</text>
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
        <view v-for="tab in tabs" :key="tab.key" :class="['tab-item', { active: currentTab === tab.key }]"
          @click="switchTab(tab.key)">
          {{ tab.label }}
        </view>
      </view>

      <!-- 加载中 -->
      <view v-if="loading" class="loading-state">
        <view class="spinner"></view>
        <text>搜索中...</text>
      </view>

      <!-- 综合结果 -->
      <scroll-view v-else-if="currentTab === 'all'" scroll-y class="result-list" @scrolltolower="loadMore">
        <!-- 用户结果（前3个） -->
        <view v-if="userResults.length > 0" class="result-section">
          <view class="section-header">
            <text class="section-title">相关用户</text>
            <text class="more-link" @click="currentTab = 'users'">查看更多 &gt;</text>
          </view>
          <scroll-view scroll-x class="user-scroll" show-scrollbar="false">
            <view class="user-list">
              <view v-for="user in userResults.slice(0, 5)" :key="user.id" class="user-card"
                @click="goToUserProfile(user.id)">
                <image :src="user.avatar || '/static/default-avatar.svg'" class="user-avatar" mode="aspectFill" />
                <text class="user-name">{{ user.nickname }}</text>
                <text class="user-bio" v-if="user.bio">{{ user.bio.substring(0, 10) }}...</text>
                <view v-if="user.id !== currentUserId" class="follow-btn-mini" :class="{ following: user.isFollowing }"
                  @click.stop="toggleFollow(user)">
                  <text>{{ user.isFollowing ? '已关注' : '关注' }}</text>
                </view>
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
            <view v-for="note in noteResults" :key="note.id" class="note-card" @click="goToNoteDetail(note.id)">
              <image v-if="note.coverImage" :src="note.coverImage" class="note-cover" mode="aspectFill" />
              <view class="note-content">
                <rich-text class="note-title"
                  :nodes="note.title ? note.title.replace(/<em>/g, '<span style=\'color: #FF6B6B; font-weight: 600;\'>').replace(/<\/em>/g, '</span>') : ''"></rich-text>
                <view class="note-author">
                  <image :src="note.authorAvatar || '/static/default-avatar.svg'" class="author-avatar" />
                  <text class="author-name">{{ note.authorNickname }}</text>
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
      <scroll-view v-else-if="currentTab === 'notes'" scroll-y class="result-list" @scrolltolower="loadMore">
        <view v-if="noteResults.length > 0" class="note-grid">
          <view v-for="note in noteResults" :key="note.id" class="note-card" @click="goToNoteDetail(note.id)">
            <image v-if="note.coverImage" :src="note.coverImage" class="note-cover" mode="aspectFill" />
            <view class="note-content">
              <rich-text class="note-title"
                :nodes="note.title ? note.title.replace(/<em>/g, '<span style=\'color: #FF6B6B; font-weight: 600;\'>').replace(/<\/em>/g, '</span>') : ''"></rich-text>
              <view class="note-author">
                <image :src="note.authorAvatar || '/static/default-avatar.svg'" class="author-avatar" />
                <text class="author-name">{{ note.authorNickname }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <text>没有找到相关笔记</text>
        </view>
      </scroll-view>

      <!-- 用户列表 -->
      <scroll-view v-else-if="currentTab === 'users'" scroll-y class="result-list" @scrolltolower="loadMore">
        <view v-if="userResults.length > 0" class="user-list-full">
          <view v-for="user in userResults" :key="user.id" class="user-item" @click="goToUserProfile(user.id)">
            <image :src="user.avatar || '/static/default-avatar.svg'" class="user-avatar-large" mode="aspectFill" />
            <view class="user-info">
              <text class="user-name">{{ user.nickname }}</text>
              <text class="user-bio" v-if="user.bio">{{ user.bio }}</text>
              <text class="user-stats" v-if="user.followerCount">
                {{ formatNumber(user.followerCount) }} 粉丝
              </text>
            </view>
            <view class="follow-btn" :class="{ following: user.isFollowing }" v-if="user.id !== currentUserId"
              @click.stop="toggleFollow(user)">
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
import type { Note, SearchUserInfo } from '@/types/api.types'

const userStore = useUserStore()
const currentUserId = computed(() => userStore.userInfo?.id)
const subscribedIds = ref<Set<number>>(new Set())
// 搜索状态
const searchKeyword = ref('')
const isSearching = ref(false)
const showCancel = ref(false)
const hasSearched = ref(false)
const currentTab = ref('all')
const loading = ref(false)

// 跳转至热搜榜单页面

// 搜索结果
const noteResults = ref<Note[]>([])
const userResults = ref<SearchUserInfo[]>([])
const hotTags = ref<string[]>(['高考数学', '雅思备考', 'Python入门', '考研政治'])

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
const fetchSubscribedIds = async () => {
  const res = await subscriptionApi.getMySubscriptions()
  subscribedIds.value = new Set(res.map(s => s.creatorId))
}

// 获取热门搜索
const fetchHotTags = async () => {
  try {
    const data = await searchApi.getHotKeywords(30)
    hotTags.value = data.list || []
  } catch (error) {
    console.error('获取热门搜索失败:', error)
  }
}

// 跳转至热搜榜单页面
const goToHotRank = () => {
  uni.navigateTo({
    url: '/pages/discover/hot-rank'
  })
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
    const fetchNotes = currentTab.value !== 'users'
    const fetchUsers = currentTab.value !== 'notes'

    // 并行但分开处理
    const notePromise = fetchNotes
      ? searchApi.searchNotes({ keyword: searchKeyword.value, page: currentPage.value, size: pageSize })
        .catch(() => ({ list: [], total: 0 }))
      : Promise.resolve({ list: [], total: 0 })

    const userPromise = fetchUsers
      ? searchApi.searchUsers({ keyword: searchKeyword.value, page: currentPage.value, size: pageSize })
        .catch(() => ({ list: [], total: 0 }))
      : Promise.resolve({ list: [], total: 0 })

    // 同时发起，但结果分开
    const [noteRes, userRes] = await Promise.all([notePromise, userPromise])

    // 处理笔记结果
    if (fetchNotes) {
      const list = noteRes.list
      if (currentPage.value === 1) {
        noteResults.value = list
      } else {
        noteResults.value.push(...list)
      }
    }

    // 处理用户结果
    if (fetchUsers) {
      const list = userRes.list.map(item => ({
        ...item,
        isFollowing: subscribedIds.value.has(item.id)  // 直接用缓存，不请求
      }))
      if (currentPage.value === 1) {
        userResults.value = list
      } else {
        //追加新数据
        userResults.value.push(...list)
      }
    }
    // 判断是否还有更多
    const noteTotal = fetchNotes ? noteRes.total : 0
    const userTotal = fetchUsers ? userRes.total : 0
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

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
  uni.navigateTo({ url: `/pages/user/profile?id=${userId}` })
}

// 跳转到笔记详情
const goToNoteDetail = (noteId: number) => {
  uni.navigateTo({ url: `/pages/note/detail?id=${noteId}` })
}

// 关注/取消关注
const toggleFollow = async (user: SearchUserInfo) => {
  try {
    if (user.isFollowing) {
      await subscriptionApi.unsubscribe(user.id)
      user.isFollowing = false
    } else {
      await subscriptionApi.subscribe(user.id )
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

onMounted(async () => {
  fetchSubscribedIds()
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
  padding-bottom: calc(48px + env(safe-area-inset-bottom));
}

/* 搜索头部 */
.search-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  padding: 8px 16px;
  z-index: 100;
  gap: 10px;
}

.search-bar {
  flex: 1;
  height: 36px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 14px 0 36px;
  position: relative;
}

.search-bar .search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-bar .search-input {
  flex: 1;
  height: 100%;
  font-size: 13px;
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
}

.search-bar .search-input::placeholder {
  color: var(--text-tertiary);
}

.search-bar .clear-btn {
  font-size: 16px;
  color: var(--text-tertiary);
  padding: 4px;
}

.cancel-btn {
  font-size: 14px;
  color: var(--text-secondary);
}



/* 区块 */
.section {
  margin-top: 60px;
  padding: 16px;
  background: var(--bg-primary);
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

.view-all-btn {
  font-size: 12px;
  color: var(--accent-warm);
  display: flex;
  align-items: center;
  gap: 2px;
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
  width: calc(50% - 4px);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
}

.tag-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* 搜索提示 */
.search-hint {
  margin-top: 60px;
  text-align: center;
  padding: 40px;
  color: var(--text-tertiary);
  font-size: 14px;
}

/* 结果 Tab */
.result-tabs {
  margin-top: 60px;
  display: flex;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 60px;
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
  to {
    transform: rotate(360deg);
  }
}

/* 结果列表 */
.result-list {
  height: calc(100vh - 200px);
}

.result-section {
  padding: 12px 16px;
  background: var(--bg-primary);
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

.follow-btn-mini {
  margin-top: 4px;
  padding: 2px 10px;
  background: var(--accent-warm);
  border-radius: 10px;
  font-size: 11px;
  color: white;
}

.follow-btn-mini.following {
  background: var(--bg-secondary);
  color: var(--text-secondary);
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
