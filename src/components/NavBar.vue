<template>
  <view class="navbar">
    <!-- #ifdef H5 -->
    <text class="nav-logo">OnlyStudents</text>
    <!-- #endif -->
    <!-- 搜索框 -->
    <input
      type="text"
      class="search-input"
      placeholder="搜索笔记、创作者..."
      v-model="searchKeyword"
      @focus="goToSearch"
      @confirm="handleSearch"
    />

    <!-- 右侧操作 -->
    <view class="nav-actions">
      <!-- 消息 -->
      <view class="nav-icon" @click="goToMessages">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <view v-if="unreadCount > 0" class="badge">{{ unreadCount }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useThemeStore } from '@/stores/theme'
import { notificationApi, messageApi, subscriptionApi } from '@/api/message'
import { favoriteApi, commentApi } from '@/api/note'

const themeStore = useThemeStore()
const searchKeyword = ref('')
const unreadCount = ref(0)
let refreshInterval: ReturnType<typeof setInterval> | null = null

// 获取未读消息数（所有模块的总和）
const fetchUnreadCount = async () => {
  try {
    let total = 0

    // 通知未读数
    try {
      const notificationCount = await notificationApi.getUnreadCount()
      total += notificationCount || 0
    } catch (e) {
      console.error('获取通知未读数失败:', e)
    }

    // 收藏未读数
    try {
      const favoriteCount = await favoriteApi.getMyNoteFavoriteUnreadCount()
      total += favoriteCount || 0
    } catch (e) {
      console.error('获取收藏未读数失败:', e)
    }

    // 私信未读数
    try {
      const result = await messageApi.getConversations()
      const conversations =  result || []
      const msgCount = (conversations || []).reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0)
      total += msgCount
    } catch (e) {
      console.error('获取私信未读数失败:', e)
    }

    // 粉丝未读数
    try {
      const followerCount = await subscriptionApi.getNewFollowerCount()
      total += followerCount || 0
    } catch (e) {
      console.error('获取粉丝未读数失败:', e)
    }

    // 评论未读数
    try {
      const commentCount = await commentApi.getReceivedCount()
      total += commentCount || 0
    } catch (e) {
      console.error('获取评论未读数失败:', e)
    }

    unreadCount.value = total
  } catch (error) {
    console.error('获取未读消息数失败:', error)
  }
}

onMounted(() => {
  const token = uni.getStorageSync('token')
  const userId = uni.getStorageSync('userId')

  if (token && userId) {
    // 初始获取未读数
    fetchUnreadCount()

    // 每30秒刷新一次
    refreshInterval = setInterval(fetchUnreadCount, 30000)
  }
})

// 每次页面显示时刷新未读数
onShow(() => {
  const token = uni.getStorageSync('token')
  const userId = uni.getStorageSync('userId')
  if (token && userId) {
    fetchUnreadCount()
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const goToSearch = () => {
  uni.redirectTo({
    url: '/pages/discover/index'
  })
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    uni.redirectTo({
      url: `/pages/discover/index?keyword=${encodeURIComponent(searchKeyword.value)}`
    })
  }
}

const goToMessages = () => {
  uni.navigateTo({
    url: '/pages/message/index'
  })
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  z-index: 1000;
  box-sizing: border-box;
}

.nav-logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-warm);
  letter-spacing: -0.5px;
}

.search-input {
  flex: 1;
  height: 36px;
  margin: 0 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 0 14px 0 36px;
  font-size: 13px;
  color: var(--text-primary);
  overflow: hidden;
  box-sizing: border-box;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239B8B7A' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='M21 21l-4.35-4.35'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.nav-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  position: relative;
}

.nav-icon svg {
  width: 22px;
  height: 22px;
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  background: var(--accent-coral);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
</style>
