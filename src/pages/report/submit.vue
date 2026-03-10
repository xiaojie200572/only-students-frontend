<template>
  <view class="report-page">
    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">举报</text>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 举报对象信息 -->
      <view class="target-section">
        <text class="section-title">举报对象</text>
        <view class="target-info">
          <text class="target-type">{{ targetTypeText }}</text>
          <text class="target-id">ID: {{ targetId }}</text>
        </view>
      </view>

      <!-- 举报原因 -->
      <view class="reason-section">
        <text class="section-title">举报原因</text>
        <view class="reason-list">
          <view
            v-for="(reason, index) in reasons"
            :key="index"
            :class="['reason-item', { active: selectedReason === reason }]"
            @click="selectReason(reason)"
          >
            <text>{{ reason }}</text>
            <view v-if="selectedReason === reason" class="check-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 详细描述 -->
      <view class="description-section">
        <text class="section-title">详细描述（选填）</text>
        <textarea
          v-model="description"
          placeholder="请详细描述您遇到的问题，有助于我们更快处理..."
          class="description-input"
          maxlength="500"
        />
        <text class="char-count">{{ description.length }}/500</text>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button
          class="submit-btn"
          :class="{ loading: loading }"
          :disabled="loading || !selectedReason"
          @click="submitReport"
        >
          <text v-if="!loading">提交举报</text>
          <view v-else class="btn-spinner"></view>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { reportApi } from '@/api/note'
import { getCurrentPage } from '@/utils'

const targetType = ref<number>(0)
const targetId = ref<number>(0)
const selectedReason = ref('')
const description = ref('')
const loading = ref(false)

const reasons = [
  '内容低俗',
  '虚假信息',
  '抄袭侵权',
  '恶意营销',
  '人身攻击',
  '违法违规',
  '其他问题'
]

const targetTypeText = computed(() => {
  const map: Record<number, string> = {
    1: '笔记',
    2: '评论',
    3: '用户'
  }
  return map[targetType.value] || '未知'
})

onMounted(() => {
  const currentPage = getCurrentPage()

  targetType.value = parseInt(currentPage.options?.targetType || '0')
  targetId.value = parseInt(currentPage.options?.targetId || '0')

  if (!targetType.value || !targetId.value) {
    uni.showToast({ title: '参数错误', icon: 'none' })
    setTimeout(() => goBack(), 1500)
  }
})

const selectReason = (reason: string) => {
  selectedReason.value = reason
}

const submitReport = async () => {
  if (!selectedReason.value) {
    uni.showToast({ title: '请选择举报原因', icon: 'none' })
    return
  }

  loading.value = true

  try {
    await reportApi.submit(
      targetType.value,
      targetId.value,
      selectedReason.value,
      description.value
    )

    uni.showToast({
      title: '举报成功，我们会尽快处理',
      icon: 'success',
      duration: 2000
    })

    setTimeout(() => {
      goBack()
    }, 1500)
  } catch (error) {
    uni.showToast({ title: '举报失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.report-page {
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
}

.target-section,
.reason-section,
.description-section {
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
  margin-bottom: 12px;
  display: block;
}

.target-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.target-type {
  padding: 4px 10px;
  background: var(--accent-warm);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}

.target-id {
  font-size: 14px;
  color: var(--text-secondary);
}

.reason-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reason-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-primary);
}

.reason-item.active {
  background: #FFF5F2;
  border: 1px solid var(--accent-warm);
}

.check-icon {
  color: var(--accent-warm);
}

.description-input {
  width: 100%;
  height: 120px;
  font-size: 15px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
}

.char-count {
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: right;
  display: block;
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
  to { transform: rotate(360deg); }
}
</style>
