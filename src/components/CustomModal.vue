<template>
  <view v-if="visible" class="modal-mask" @click="handleMaskClick">
    <view class="modal-content" @click.stop>
      <view v-if="title" class="modal-title">{{ title }}</view>
      <view class="modal-body">
        <text v-if="content" class="modal-text">{{ content }}</text>
        <slot></slot>
      </view>
      <view class="modal-footer">
        <view 
          v-if="showCancel" 
          class="modal-btn modal-btn-cancel" 
          @click="handleCancel"
          :style="cancelStyle"
        >
          {{ cancelText }}
        </view>
        <view 
          class="modal-btn modal-btn-confirm" 
          @click="handleConfirm"
          :style="confirmStyle"
        >
          {{ confirmText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  confirmColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  content: '',
  confirmText: '确定',
  cancelText: '取消',
  showCancel: true,
  confirmColor: ''
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

const confirmStyle = computed(() => {
  if (props.confirmColor) {
    return { color: props.confirmColor }
  }
  return {}
})

const cancelStyle = computed(() => {
  return {}
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleMaskClick = () => {
  emit('close')
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 280px;
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.2s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-title {
  padding: 20px 20px 12px;
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

.modal-body {
  padding: 12px 20px 20px;
  text-align: center;
}

.modal-text {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  border-top: 1px solid var(--border-light);
}

.modal-btn {
  flex: 1;
  padding: 14px 0;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn:active {
  background: var(--bg-secondary);
}

.modal-btn-cancel {
  color: var(--text-secondary);
  border-right: 1px solid var(--border-light);
}

.modal-btn-confirm {
  color: var(--accent-warm);
  font-weight: 600;
}
</style>
