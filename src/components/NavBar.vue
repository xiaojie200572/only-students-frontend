<template>
  <view class="navbar">
    <!-- #ifdef H5 -->
    <text class="nav-logo">OnlyStudents</text>
    <!-- #endif -->
    <!-- 搜索框 -->
    <view class="search-bar">
      <input
        type="text"
        class="search-input"
        placeholder="搜索笔记、创作者..."
        v-model="searchKeyword"
        @focus="goToSearch"
        @confirm="handleSearch"
      />
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    </view>

    <!-- 右侧操作 -->
    <view class="nav-actions">
      <!-- 主题切换 -->
      <view class="theme-toggle" @click="toggleTheme">
        <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </view>

      <!-- 消息 -->
      <view class="nav-icon" @click="goToMessages">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <view v-if="unreadCount > 0" class="badge">{{ unreadCount }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { notificationApi, messageApi } from '@/api/message'
import { favoriteApi } from '@/api/note'

const themeStore = useThemeStore()
const searchKeyword = ref('')
const unreadCount = ref(0)
let refreshInterval: ReturnType<typeof setInterval> | null = null

const isDark = computed(() => themeStore.isDark)

// 获取未读消息数（所有模块的总和）
const fetchUnreadCount = async () => {
  console.log('fetchUnreadCount called')
  try {
    let total = 0
    
    // 通知未读数
    try {
      const notificationCount = await notificationApi.getUnreadCount()
      console.log('通知未读数:', notificationCount)
      total += notificationCount || 0
    } catch (e) {
      console.error('获取通知未读数失败:', e)
    }
    
    // 收藏未读数
    try {
      const favoriteCount = await favoriteApi.getMyNoteFavoriteUnreadCount()
      console.log('收藏未读数:', favoriteCount)
      total += favoriteCount || 0
    } catch (e) {
      console.error('获取收藏未读数失败:', e)
    }
    
    // 私信未读数
    try {
      const conversations = await messageApi.getConversations()
      console.log('私信未读数:', conversations)
      total += conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
    } catch (e) {
      console.error('获取私信未读数失败:', e)
    }
    
    // 粉丝未读数（暂为0）
    // TODO: 需要订阅服务API
    
    console.log('总未读数:', total)
    unreadCount.value = total
    console.log('unreadCount.value set to:', unreadCount.value)
  } catch (error) {
    console.error('获取未读消息数失败:', error)
  }
}

onMounted(() => {
  // 检查是否登录
  const token = uni.getStorageSync('token')
  const userId = uni.getStorageSync('userId')
  console.log('NavBar mounted, token:', !!token, 'userId:', userId)
  
  if (token && userId) {
    // 初始获取未读数
    fetchUnreadCount()
    
    // 每30秒刷新一次
    refreshInterval = setInterval(fetchUnreadCount, 30000)
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
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
}

.nav-logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-warm);
  letter-spacing: -0.5px;
}

.search-bar {
  flex: 1;
  max-width: 300px;
  margin: 0 12px;
  position: relative;
}

.search-input {
  width: 100%;
  height: 36px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 0 36px 0 14px;
  font-size: 13px;
  color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
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
