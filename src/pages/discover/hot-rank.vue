<template>
  <view class="hot-rank-page">
    <!-- 顶部导航 -->
    <view class="rank-header">
      <view class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="rank-title">热搜榜单</text>
    </view>

    <!-- 热搜列表 -->
    <scroll-view scroll-y class="rank-list">
      <view
        v-for="(tag, index) in hotTags"
        :key="index"
        class="rank-item"
        @click="searchByKeyword(tag)"
      >
        <text class="rank-number" :class="{ top: index < 3 }">{{ index + 1 }}</text>
        <text class="rank-text">{{ tag }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchApi } from '@/api/search'

const hotTags = ref<string[]>([])

const fetchHotTags = async () => {
  try {
    const data = await searchApi.getHotKeywords(30)
    hotTags.value = data.list || []
  } catch (error) {
    console.error('获取热门搜索失败:', error)
  }
}

const goBack = () => {
  uni.navigateBack()
}

const searchByKeyword = (keyword: string) => {
  uni.navigateTo({
    url: `/pages/discover/index?keyword=${encodeURIComponent(keyword)}`
  })
}

fetchHotTags()
</script>

<style scoped>
.hot-rank-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.rank-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.rank-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.rank-list {
  padding: 0 16px;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
}

.rank-number {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-tertiary);
  width: 36px;
}

.rank-number.top {
  color: #ff4d4f;
}

.rank-text {
  font-size: 16px;
  color: var(--text-primary);
}
</style>
