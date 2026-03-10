<template>
  <view class="creator-settings-page">
    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </view>
      <text class="nav-title">创作者设置</text>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 订阅配置 -->
      <view class="section">
        <text class="section-title">订阅服务设置</text>
        <view class="form-item">
          <text class="label">订阅价格（元/月）</text>
          <view class="price-input-wrapper">
            <text class="currency">¥</text>
            <input type="digit" v-model="config.price" placeholder="设置每月订阅价格" class="price-input" />
          </view>
        </view>

        <view class="form-item">
          <text class="label">服务说明</text>
          <textarea v-model="config.description" placeholder="描述您的订阅服务，吸引用户订阅..." class="desc-input" maxlength="200" />
          <text class="char-count">{{ config.description?.length }}/200</text>
        </view>

        <view class="preview-card">
          <text class="preview-title">预览效果</text>
          <view class="subscription-preview">
            <view class="preview-header">
              <text class="preview-name">订阅服务</text>
              <text class="preview-price">¥{{ config.price || '0.00' }}/月</text>
            </view>
            <text class="preview-desc">{{ config.description || '暂无描述' }}</text>
          </view>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="section">
        <text class="section-title">订阅数据</text>
        <view class="stats-grid">
          <view class="stat-card">
            <text class="stat-value">{{ subscriberCount }}</text>
            <text class="stat-label">订阅人数</text>
          </view>
          <view class="stat-card">
            <text class="stat-value">¥{{ monthlyIncome.toFixed(2) }}</text>
            <text class="stat-label">本月收入</text>
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="submit-section">
        <button class="submit-btn" :class="{ loading: loading }" :disabled="loading" @click="saveConfig">
          <text v-if="!loading">保存设置</text>
          <view v-else class="btn-spinner"></view>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { subscriptionApi } from '@/api/message'
import type { SubscriptionConfig } from '@/types/api.types'

const config = ref<SubscriptionConfig>(
  {
    id: 0,
    creatorId: 0,
    price: 0,
    period: 30,
    description: '',
    status: 0
  }
)

const subscriberCount = ref(0)
const monthlyIncome = ref(0)
const loading = ref(false)

onMounted(() => {
  loadConfig()
})

const loadConfig = async () => {
  try {
    // 获取当前用户的订阅配置
    const userId = uni.getStorageSync('userId')
    const [configRes, countRes] = await Promise.all([
      subscriptionApi.getConfig(userId).catch(() => null),
      subscriptionApi.getSubscriberCount(userId).catch(() => 0)
    ])

    if (configRes) {
      config.value = configRes
    }
    subscriberCount.value = countRes

    // 模拟本月收入计算
    monthlyIncome.value = subscriberCount.value * (config.value.price || 0)
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

const saveConfig = async () => {
  if (!config.value.price || config.value.price <= 0) {
    uni.showToast({ title: '请输入有效的订阅价格', icon: 'none' })
    return
  }

  loading.value = true

  try {
    await subscriptionApi.updateConfig({
      price: parseFloat(config.value.price.toString()),
      description: config.value.description
    })

    uni.showToast({ title: '保存成功', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.creator-settings-page {
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
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-light);
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-right {
  width: 40px;
}

.content-area {
  margin-top: 60px;
  padding: 16px;
  height: calc(100vh - 60px);
}

.section {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-light);
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  display: block;
}

.form-item {
  margin-bottom: 16px;
}

.label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: block;
}

.price-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.currency {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.price-input {
  flex: 1;
  font-size: 18px;
  color: var(--text-primary);
}

.desc-input {
  width: 100%;
  height: 100px;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  color: var(--text-primary);
}

.char-count {
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: right;
  display: block;
  margin-top: 4px;
}

.preview-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
}

.preview-title {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-bottom: 8px;
  display: block;
}

.subscription-preview {
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  border-radius: 12px;
  padding: 16px;
  color: white;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.preview-name {
  font-size: 16px;
  font-weight: 600;
}

.preview-price {
  font-size: 20px;
  font-weight: 700;
}

.preview-desc {
  font-size: 13px;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-warm);
  display: block;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.submit-section {
  padding: 16px 0;
}

.submit-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn[disabled] {
  opacity: 0.6;
}

.submit-btn.loading {
  background: var(--text-tertiary);
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
