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
        <!-- 账号输入 -->
        <view class="form-item">
          <input
            type="text"
            v-model="form.account"
            placeholder="手机号/邮箱"
            class="form-input"
            :maxlength="form.account.includes('@') ? 50 : 11"
          />
        </view>
        <text v-if="errors.account" class="error-text">{{ errors.account }}</text>

        <!-- 验证码输入+发送按钮 -->
        <view class="form-item sms-code-item">
          <input
            type="number"
            v-model="form.smsCode"
            placeholder="请输入6位验证码"
            class="form-input"
            maxlength="6"
          />
          <button 
            class="send-code-btn" 
            :disabled="countdown > 0"
            @click="sendSmsCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </view>
        <text v-if="errors.smsCode" class="error-text">{{ errors.smsCode }}</text>

        <!-- 密码 -->
        <view class="form-item">
          <input
            type="password"
            v-model="form.password"
            placeholder="密码 (8-20位)"
            class="form-input"
            @blur="validatePassword"
          />
          <text v-if="errors.password" class="error-text">{{ errors.password }}</text>
        </view>

        <!-- 确认密码 -->
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

        <!-- 昵称 -->
        <view class="form-item">
          <input
            type="text"
            v-model="form.nickname"
            placeholder="昵称 (必填)"
            class="form-input"
            @blur="validateNickname"
          />
          <text v-if="errors.nickname" class="error-text">{{ errors.nickname }}</text>
        </view>

        <!-- 学段选择 -->
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

        <!-- 学校（可选） -->
        <view class="form-item">
          <input
            type="text"
            v-model="form.schoolName"
            placeholder="学校名称（选填）"
            class="form-input"
          />
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
import { userApi } from '@/api/user'
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
  account: '',
  smsCode: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  educationLevel: null as number | null,
  schoolName: ''
})

const errors = ref({
  account: '',
  smsCode: '',
  password: '',
  confirmPassword: '',
  nickname: ''
})

const loading = ref(false)
const agreed = ref(false)
const countdown = ref(0)

const educationLevels = ['小学', '初中', '高中', '本科', '硕士', '博士']
const educationLevelIndex = computed(() => {
  return form.value.educationLevel ? form.value.educationLevel - 1 : 0
})
const educationLevelText = computed(() => {
  if (!form.value.educationLevel) return '选择学段（选填）'
  return educationLevels[form.value.educationLevel - 1]
})

const isFormValid = computed(() => {
  return form.value.account &&
         form.value.smsCode &&
         form.value.password &&
         form.value.confirmPassword &&
         form.value.nickname &&
         form.value.password === form.value.confirmPassword &&
         agreed.value &&
         !errors.value.account &&
         !errors.value.smsCode &&
         !errors.value.password &&
         !errors.value.confirmPassword &&
         !errors.value.nickname
})

const sendSmsCode = async () => {
  if (!form.value.account.trim()) {
    errors.value.account = '请输入手机号或邮箱'
    return
  }

  const isEmail = form.value.account.includes('@')
  
  if (isEmail) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.account)) {
      errors.value.account = '邮箱格式不正确'
      return
    }
  } else {
    if (!/^1[3-9]\d{9}$/.test(form.value.account)) {
      errors.value.account = '手机号格式不正确'
      return
    }
  }

  errors.value.account = ''

  try {
    await userApi.sendCode({
      account: form.value.account,
      type: 'REGISTER'
    })
    uni.showToast({ title: '验证码已发送', icon: 'success' })
    
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error: any) {
    uni.showToast({ title: error.message || '发送失败', icon: 'none' })
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = '密码不能为空'
  } else if (form.value.password.length < 8 || form.value.password.length > 20) {
    errors.value.password = '密码长度必须在8-20之间'
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

const validateNickname = () => {
  if (!form.value.nickname) {
    errors.value.nickname = '昵称不能为空'
  } else if (form.value.nickname.length < 2 || form.value.nickname.length > 20) {
    errors.value.nickname = '昵称长度必须在2-20之间'
  } else {
    errors.value.nickname = ''
  }
}

const onEducationChange = (e: any) => {
  form.value.educationLevel = e.detail.value + 1
}

const handleRegister = async () => {
  // 验证
  if (!form.value.account.trim()) {
    errors.value.account = '请输入手机号或邮箱'
  }
  if (!form.value.smsCode) {
    errors.value.smsCode = '请输入验证码'
  }
  validatePassword()
  validateConfirmPassword()
  validateNickname()

  if (!isFormValid.value) return

  loading.value = true

  const isEmail = form.value.account.includes('@')
  const accountType = isEmail ? 'EMAIL' : 'PHONE'

  const result = await userStore.register({
    accountType,
    account: form.value.account,
    smsCode: form.value.smsCode,
    password: form.value.password,
    nickname: form.value.nickname,
    educationLevel: form.value.educationLevel || undefined,
    schoolName: form.value.schoolName || undefined
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
        account: form.value.account,
        loginType: isEmail ? 'PASSWORD' : 'SMS_CODE',
        smsCode: !isEmail ? form.value.smsCode : undefined,
        password: isEmail ? form.value.password : undefined
      })

      if (loginResult.success) {
        uni.redirectTo({ url: '/pages/index/index' })
      } else {
        uni.redirectTo({ url: '/pages/auth/login' })
      }
    }, 1500)
  } else {
    console.log('注册失败 result:', result)
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

.sms-code-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sms-code-item .form-input {
  flex: 1;
}

.send-code-btn {
  width: 100px;
  height: 48px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 13px;
  color: var(--accent-warm);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-code-btn[disabled] {
  color: var(--text-tertiary);
}

.form-input {
  width: 100%;
  height: 48px;
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  color: var(--text-primary) !important;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-warm);
  background: var(--bg-card) !important;
}

.form-input::placeholder {
  color: var(--text-tertiary) !important;
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
