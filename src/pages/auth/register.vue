<template>
  <view class="register-page">
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

    <view class="register-container">
      <!-- Logo区域 -->
      <view class="logo-section">
        <text class="logo-text">OnlyStudents</text>
        <text class="slogan">创建你的学习账号</text>
      </view>

      <!-- 注册表单 -->
      <view class="register-form">
        <view class="form-item">
          <input
            type="text"
            v-model="form.username"
            placeholder="用户名 (3-50位)"
            class="form-input"
            @blur="validateUsername"
          />
          <text v-if="errors.username" class="error-text">{{ errors.username }}</text>
        </view>

        <view class="form-item">
          <input
            type="password"
            v-model="form.password"
            placeholder="密码 (6-32位)"
            class="form-input"
            @blur="validatePassword"
          />
          <text v-if="errors.password" class="error-text">{{ errors.password }}</text>
        </view>

        <view class="form-item">
          <input
            type="password"
            v-model="form.confirmPassword"
            placeholder="确认密码"
            class="form-input"
            @blur="validateConfirmPassword"
          />
          <text v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</text>
        </view>

        <view class="form-item">
          <input
            type="text"
            v-model="form.nickname"
            placeholder="昵称"
            class="form-input"
          />
        </view>

        <view class="form-item">
          <input
            type="text"
            v-model="form.email"
            placeholder="邮箱（选填）"
            class="form-input"
          />
        </view>

        <view class="form-item">
          <input
            type="number"
            v-model="form.phone"
            placeholder="手机号（选填）"
            class="form-input"
          />
        </view>

        <view class="form-item">
          <picker mode="selector" :range="educationLevels" :value="educationLevelIndex" @change="onEducationChange">
            <view class="picker-input">
              <text :class="{ placeholder: !form.educationLevel }">{{ educationLevelText }}</text>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </view>
          </picker>
        </view>

        <view class="agreement">
          <checkbox :checked="agreed" @click="agreed = !agreed" />
          <text>我已阅读并同意</text>
          <text class="link" @click="showAgreement">《用户协议》</text>
          <text>和</text>
          <text class="link" @click="showPrivacy">《隐私政策》</text>
        </view>

        <button
          class="register-btn"
          :class="{ loading: loading }"
          :disabled="loading || !isFormValid"
          @click="handleRegister"
        >
          <text v-if="!loading">注册</text>
          <view v-else class="btn-spinner"></view>
        </button>

        <view class="login-link">
          <text>已有账号? </text>
          <text class="link" @click="goToLogin">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import CustomModal from '@/components/CustomModal.vue'

const userStore = useUserStore()

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

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  phone: '',
  educationLevel: null as number | null
})

const errors = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const agreed = ref(false)

const educationLevels = ['小学', '初中', '高中', '本科', '硕士', '博士']
const educationLevelIndex = computed(() => {
  return form.value.educationLevel ? form.value.educationLevel - 1 : 0
})
const educationLevelText = computed(() => {
  if (!form.value.educationLevel) return '选择学段（选填）'
  return educationLevels[form.value.educationLevel - 1]
})

const isFormValid = computed(() => {
  return form.value.username &&
         form.value.password &&
         form.value.confirmPassword &&
         form.value.password === form.value.confirmPassword &&
         agreed.value &&
         !errors.value.username &&
         !errors.value.password &&
         !errors.value.confirmPassword
})

const validateUsername = () => {
  if (!form.value.username) {
    errors.value.username = '用户名不能为空'
  } else if (form.value.username.length < 3 || form.value.username.length > 50) {
    errors.value.username = '用户名长度必须在3-50之间'
  } else {
    errors.value.username = ''
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = '密码不能为空'
  } else if (form.value.password.length < 6 || form.value.password.length > 32) {
    errors.value.password = '密码长度必须在6-32之间'
  } else {
    errors.value.password = ''
  }
}

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = '请确认密码'
  } else if (form.value.confirmPassword !== form.value.password) {
    errors.value.confirmPassword = '两次输入的密码不一致'
  } else {
    errors.value.confirmPassword = ''
  }
}

const onEducationChange = (e: any) => {
  form.value.educationLevel = e.detail.value + 1
}

const handleRegister = async () => {
  if (!isFormValid.value) return

  loading.value = true

  const result = await userStore.register({
    username: form.value.username,
    password: form.value.password,
    nickname: form.value.nickname || form.value.username,
    email: form.value.email || undefined,
    phone: form.value.phone || undefined,
    educationLevel: form.value.educationLevel || undefined
  })

  loading.value = false

  if (result.success) {
    uni.showToast({
      title: '注册成功',
      icon: 'success',
      duration: 2000
    })

    // 自动登录
    setTimeout(async () => {
      const loginResult = await userStore.login({
        username: form.value.username,
        password: form.value.password
      })

      if (loginResult.success) {
        uni.switchTab({ url: '/pages/index/index' })
      } else {
        uni.redirectTo({ url: '/pages/auth/login' })
      }
    }, 1500)
  } else {
    uni.showToast({
      title: result.message || '注册失败',
      icon: 'none',
      duration: 3000
    })
  }
}

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' })
}

const showAgreement = async () => {
  await showModal({
    title: '用户协议',
    content: '这里是用户协议内容...',
    showCancel: false
  })
}

const showPrivacy = async () => {
  await showModal({
    title: '隐私政策',
    content: '这里是隐私政策内容...',
    showCancel: false
  })
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 40px 20px;
}

.register-container {
  max-width: 360px;
  margin: 0 auto;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent-warm);
  display: block;
  margin-bottom: 8px;
}

.slogan {
  font-size: 14px;
  color: var(--text-secondary);
}

.register-form {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border-light);
}

.form-item {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  height: 48px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  color: var(--text-primary);
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-warm);
  background: var(--bg-card);
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.picker-input {
  width: 100%;
  height: 48px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-input .placeholder {
  color: var(--text-tertiary);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
}

.error-text {
  font-size: 12px;
  color: var(--accent-coral);
  margin-top: 4px;
  display: block;
}

.agreement {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 24px;
  font-size: 13px;
  color: var(--text-secondary);
}

.agreement .link {
  color: var(--accent-warm);
}

.register-btn {
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
  margin-bottom: 16px;
  transition: all 0.3s;
}

.register-btn:active {
  transform: scale(0.98);
}

.register-btn[disabled] {
  opacity: 0.6;
}

.register-btn.loading {
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

.login-link {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.login-link .link {
  color: var(--accent-warm);
  font-weight: 600;
}
</style>
