<template>
  <view class="tabbar">
    <view v-for="(tab, index) in tabs" :key="index" :class="['tab-item', { active: current === index }]"
      @click="switchTab(index)">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <!-- 首页 -->
        <template v-if="index === 0">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </template>
        <!-- 订阅 -->
        <template v-else-if="index === 1">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </template>
        <!-- 收藏 -->
        <template v-else-if="index === 2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </template>
        <!-- 我的 -->
        <template v-else-if="index === 3">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </template>
      </svg>
      <text class="tab-label">{{ tab.label }}</text>

      <!-- 未读消息小红点 -->
      <view v-if="tab.hasBadge" class="tab-badge"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  current?: number
}

withDefaults(defineProps<Props>(), {
  current: 0
})

const tabs = ref([
  { label: '首页', path: '/pages/index/index', hasBadge: false },
  { label: '订阅', path: '/pages/user/my-subscriptions', hasBadge: false },
  { label: '收藏', path: '/pages/user/my-favorites', hasBadge: false },
  { label: '我的', path: '/pages/user/index', hasBadge: false }
])

const switchTab = (index: number) => {
  const tab = tabs.value[index]

  // 获取当前页面路径
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentPath = currentPage ? '/' + currentPage.route : ''

  // 如果已经在目标页面，就不跳转
  if (currentPath === tab.path) {
    return
  }

  // 使用 redirectTo 跳转（因为没有配置 tabBar）
  uni.redirectTo({
    url: tab.path
  })
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 9999;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  isolation: isolate;
  transform: translateZ(0);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 16px;
  position: relative;
}

.tab-icon {
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
}

.tab-label {
  font-size: 10px;
  color: var(--text-tertiary);
}

.tab-item.active .tab-icon {
  color: var(--accent-warm);
}

.tab-item.active .tab-label {
  color: var(--accent-warm);
  font-weight: 600;
}

.tab-badge {
  position: absolute;
  top: 4px;
  right: 12px;
  width: 6px;
  height: 6px;
  background: var(--accent-coral);
  border-radius: 50%;
}
</style>
