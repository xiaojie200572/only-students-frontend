<template>
  <view class="chat-page">
    <!-- 导航栏 -->
    <view class="chat-nav">
      <view class="back-btn" @click="goBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <view class="chat-header-info">
        <image 
          :src="targetUserAvatar || '/static/default-avatar.svg'" 
          class="header-avatar" 
          mode="aspectFill"
        />
        <text class="chat-title">{{ targetUserName }}</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <!-- 消息列表 -->
    <scroll-view 
      scroll-y 
      class="message-list" 
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <!-- 加载更多 -->
      <view v-if="loading" class="loading-more">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && messages.length === 0" class="empty-chat">
        <text class="empty-text">开始聊天吧</text>
      </view>

      <!-- 消息列表 -->
      <view v-else class="messages-container">
        <view
          v-for="(msg, index) in messages"
          :key="msg.id"
          class="message-item"
          :class="{ 'self': msg.senderId === currentUserId, 'other': msg.senderId !== currentUserId }"
        >
          <!-- 时间分隔线 -->
          <view v-if="showTimeDivider(index)" class="time-divider">
            <text>{{ formatTime(msg.createdAt) }}</text>
          </view>

          <view class="message-content-wrapper">
            <!-- 对方头像 -->
            <image 
              v-if="msg.senderId !== currentUserId"
              :src="targetUserAvatar || '/static/default-avatar.svg'" 
              class="msg-avatar" 
              mode="aspectFill"
            />
            
            <view class="message-bubble">
              <text class="message-text">{{ msg.content }}</text>
            </view>

            <!-- 自己头像 -->
            <image 
              v-if="msg.senderId === currentUserId"
              :src="currentUserAvatar || '/static/default-avatar.svg'" 
              class="msg-avatar" 
              mode="aspectFill"
            />
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-placeholder"></view>
    </scroll-view>

    <!-- 输入框 -->
    <view class="input-area">
      <view class="input-wrapper">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="输入消息..."
          class="message-input"
          confirm-type="send"
          @confirm="sendMessage"
        />
      </view>
      <view 
        class="send-btn" 
        :class="{ 'active': inputMessage.trim() }"
        @click="sendMessage"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { messageApi } from '@/api/message'
import type { Message } from '@/types/api.types'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const currentUserId = ref(userStore.userInfo?.id || 0)
const currentUserAvatar = ref(userStore.userInfo?.avatar || '')

// 页面参数
const conversationId = ref(0)
const targetUserId = ref(0)
const targetUserName = ref('')
const targetUserAvatar = ref('')

// 消息列表
const messages = ref<Message[]>([])
const inputMessage = ref('')
const loading = ref(false)
const scrollTop = ref(0)
const page = ref(1)
const pageSize = 20
const hasMore = ref(true)

// WebSocket
let ws: WebSocket | null = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

// 初始化页面
onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  
  if (options.id) {
    conversationId.value = parseInt(options.id)
  }
  if (options.targetId) {
    targetUserId.value = parseInt(options.targetId)
  }
  if (options.name) {
    targetUserName.value = decodeURIComponent(options.name)
  }
  if (options.avatar) {
    targetUserAvatar.value = decodeURIComponent(options.avatar)
  }
  
  // 如果有会话ID，加载历史消息
  if (conversationId.value) {
    loadMessages()
    
    // 标记会话消息为已读
    try {
      await messageApi.markConversationAsRead(conversationId.value)
      // 通知上一页更新未读数
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      if (prevPage) {
        prevPage.$vm?.fetchUnreadCounts?.()
      }
    } catch (e) {
      console.error('标记已读失败:', e)
    }
  }
  
  // 连接WebSocket
  connectWebSocket()
})

onUnmounted(() => {
  // 断开WebSocket
  if (ws) {
    ws.close()
    ws = null
  }
  // 清除重连定时器
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
})

// 重连WebSocket
const reconnectWebSocket = () => {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error('WebSocket重连次数超过上限')
    uni.showToast({ title: '连接失败，请刷新页面重试', icon: 'none' })
    return
  }
  
  reconnectAttempts++
  console.log(`WebSocket第${reconnectAttempts}次重连...`)
  
  reconnectTimer = setTimeout(() => {
    connectWebSocket()
  }, 2000 * reconnectAttempts) // 递增延迟
}

// 连接WebSocket
const connectWebSocket = () => {
  const token = uni.getStorageSync('token')
  if (!token) {
    console.error('WebSocket连接失败: 未找到token')
    return
  }
  
  // 直接连接message-service，绕过网关
  const wsUrl = `ws://localhost:8008/ws/message?token=${token}`
  console.log('正在连接WebSocket:', wsUrl)
  
  try {
    ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('WebSocket连接成功')
      reconnectAttempts = 0 // 重置重连计数
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('收到WebSocket消息:', data)
        if (data.type === 'MESSAGE') {
          const msg = data.data
          // 只接收当前会话的消息
          if (msg.conversationId === conversationId.value || 
              (msg.senderId === targetUserId.value && msg.receiverId === currentUserId.value)) {
            messages.value.push(msg)
            scrollToBottom()
          }
        }
      } catch (error) {
        console.error('解析消息失败:', error)
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket错误:', error)
      console.log('WebSocket readyState:', ws?.readyState)
    }
    
    ws.onclose = (event) => {
      console.log('WebSocket连接关闭:', event.code, event.reason)
      // 如果不是正常关闭，尝试重连
      if (event.code !== 1000 && event.code !== 1001) {
        reconnectWebSocket()
      }
    }
  } catch (error) {
    console.error('创建WebSocket失败:', error)
    reconnectWebSocket()
  }
}

// 加载历史消息
const loadMessages = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    const data = await messageApi.getHistory(conversationId.value, page.value, pageSize)
    if (data && data.length > 0) {
      // 将新消息插入到数组前面（因为是倒序加载）
      messages.value.unshift(...data.reverse())
      hasMore.value = data.length === pageSize
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载消息失败:', error)
    uni.showToast({ title: '加载消息失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 发送消息
const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content) return
  if (!targetUserId.value) {
    uni.showToast({ title: '无法发送消息', icon: 'none' })
    return
  }
  
  try {
    const msg = await messageApi.send(targetUserId.value, content)
    messages.value.push(msg)
    inputMessage.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    scrollTop.value = messages.value.length * 1000
  })
}

// 格式化时间
const formatTime = (timeStr: string): string => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' ' + 
         date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// 是否显示时间分隔线
const showTimeDivider = (index: number): boolean => {
  if (index === 0) return true
  const current = new Date(messages.value[index].createdAt)
  const prev = new Date(messages.value[index - 1].createdAt)
  // 间隔5分钟显示时间
  return current.getTime() - prev.getTime() > 5 * 60 * 1000
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.chat-nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 100;
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-soft);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-radius: 50%;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.chat-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.nav-right {
  width: 36px;
}

/* 消息列表 */
.message-list {
  flex: 1;
  padding: 16px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: 13px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-light);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-chat {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.empty-text {
  font-size: 14px;
}

/* 时间分隔线 */
.time-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
}

.time-divider text {
  font-size: 12px;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  padding: 4px 12px;
  border-radius: 12px;
}

/* 消息项 */
.message-item {
  display: flex;
  flex-direction: column;
}

.message-content-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

/* 对方消息 */
.message-item.other .message-content-wrapper {
  justify-content: flex-start;
}

.message-item.other .message-bubble {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  border-bottom-left-radius: 4px;
}

/* 自己消息 */
.message-item.self .message-content-wrapper {
  justify-content: flex-end;
}

.message-item.self .message-bubble {
  background: var(--accent-warm);
  color: white;
  border-bottom-right-radius: 4px;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  word-break: break-word;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
}

.bottom-placeholder {
  height: 20px;
}

/* 输入区域 */
.input-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: var(--bg-card);
  border-top: 1px solid var(--border-light);
}

.input-wrapper {
  flex: 1;
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 8px 16px;
}

.message-input {
  font-size: 15px;
  color: var(--text-primary);
  background: transparent;
}

.send-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border-light);
  color: var(--text-tertiary);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.send-btn.active {
  background: var(--accent-warm);
  color: white;
}
</style>
