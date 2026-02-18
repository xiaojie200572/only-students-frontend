<template>
  <view class="withdrawals-page">
    <!-- 自定义弹窗 -->
    <CustomModal
      :visible="modalVisible"
      :title="modalTitle"
      :content="modalContent"
      :confirm-text="modalConfirmText"
      :cancel-text="modalCancelText"
      :show-cancel="modalShowCancel"
      :confirm-color="modalConfirmColor"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
      @close="handleModalCancel"
    />

    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">提现记录</text>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="content-area" @scrolltolower="loadMore">
      <view v-if="loading && withdrawals.length === 0" class="loading-state">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <view v-else-if="withdrawals.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        <text class="empty-title">暂无提现记录</text>
        <text class="empty-desc">您还没有申请过提现</text>
      </view>

      <view v-else class="withdrawals-list">
        <view
          v-for="item in withdrawals"
          :key="item.id"
          class="withdrawal-card"
        >
          <view class="withdrawal-header">
            <text class="withdrawal-no">申请单号: {{ item.id }}</text>
            <view :class="['status-badge', getStatusClass(item.status)]">
              {{ getStatusText(item.status) }}
            </view>
          </view>

          <view class="withdrawal-amount">
            <text class="amount-label">提现金额</text>
            <text class="amount-value">¥{{ item.amount?.toFixed(2) }}</text>
          </view>

          <view class="withdrawal-info">
            <view class="info-item">
              <text class="info-label">申请时间</text>
              <text class="info-value">{{ formatTime(item.createdAt) }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">到账方式</text>
              <text class="info-value">{{ item.accountType === 1 ? '支付宝' : '微信' }}</text>
            </view>
            <view v-if="item.auditTime" class="info-item">
              <text class="info-label">审核时间</text>
              <text class="info-value">{{ formatTime(item.auditTime) }}</text>
            </view>
            <view v-if="item.remark" class="info-item">
              <text class="info-label">备注</text>
              <text class="info-value">{{ item.remark }}</text>
            </view>
          </view>

          <view v-if="item.status === 0" class="withdrawal-actions">
            <view class="btn-cancel" @click="cancelWithdrawal(item.id)">
              取消申请
            </view>
          </view>
        </view>

        <view v-if="loading" class="loading-more">
          <view class="loading-spinner"></view>
          <text>加载中...</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { withdrawalApi } from '@/api/message'
import CustomModal from '@/components/CustomModal.vue'

// 弹窗状态
const modalVisible = ref(false)
const modalTitle = ref('')
const modalContent = ref('')
const modalConfirmText = ref('确定')
const modalCancelText = ref('取消')
const modalShowCancel = ref(true)
const modalConfirmColor = ref('')
let modalResolve: ((value: boolean) => void) | null = null

// 显示弹窗
const showModal = (options: {
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  confirmColor?: string
}): Promise<boolean> => {
  return new Promise((resolve) => {
    modalTitle.value = options.title || ''
    modalContent.value = options.content || ''
    modalConfirmText.value = options.confirmText || '确定'
    modalCancelText.value = options.cancelText || '取消'
    modalShowCancel.value = options.showCancel !== false
    modalConfirmColor.value = options.confirmColor || ''
    modalResolve = resolve
    modalVisible.value = true
  })
}

// 处理弹窗确认
const handleModalConfirm = () => {
  modalVisible.value = false
  if (modalResolve) {
    modalResolve(true)
    modalResolve = null
  }
}

// 处理弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
  if (modalResolve) {
    modalResolve(false)
    modalResolve = null
  }
}

const withdrawals = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

onMounted(() => {
  loadWithdrawals()
})

const loadWithdrawals = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  try {
    const res = await withdrawalApi.getList(page.value)
    if (page.value === 1) {
      withdrawals.value = res
    } else {
      withdrawals.value.push(...res)
    }
    hasMore.value = res.length === 20
    page.value++
  } catch (error) {
    console.error('加载提现记录失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  loadWithdrawals()
}

const getStatusClass = (status: number): string => {
  const map: Record<number, string> = {
    0: 'pending',
    1: 'approved',
    2: 'rejected'
  }
  return map[status] || ''
}

const getStatusText = (status: number): string => {
  const map: Record<number, string> = {
    0: '审核中',
    1: '已通过',
    2: '已拒绝'
  }
  return map[status] || '未知'
}

const formatTime = (time: string): string => {
  const date = new Date(time)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const cancelWithdrawal = async (id: number) => {
  const confirmed = await showModal({
    title: '提示',
    content: '确定要取消这笔提现申请吗？'
  })
  
  if (confirmed) {
    try {
      await withdrawalApi.cancel(id)
      uni.showToast({ title: '已取消', icon: 'success' })
      // 重新加载
      page.value = 1
      await loadWithdrawals()
    } catch (error) {
      uni.showToast({ title: '取消失败', icon: 'none' })
    }
  }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.withdrawals-page {
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
  height: calc(100vh - 60px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

.withdrawals-list {
  padding: 16px;
}

.withdrawal-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border-light);
}

.withdrawal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.withdrawal-no {
  font-size: 13px;
  color: var(--text-tertiary);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge.pending {
  background: #FFF3E0;
  color: #FF9800;
}

.status-badge.approved {
  background: #E8F5E9;
  color: #4CAF50;
}

.status-badge.rejected {
  background: #FFEBEE;
  color: #F44336;
}

.withdrawal-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 12px;
}

.amount-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.amount-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-warm);
}

.withdrawal-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.info-label {
  color: var(--text-tertiary);
}

.info-value {
  color: var(--text-primary);
}

.withdrawal-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.btn-cancel {
  padding: 10px 20px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  border-radius: 20px;
  text-align: center;
  border: 1px solid var(--border-light);
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
</style>
