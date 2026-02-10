<template>
  <view class="login-page">
    <view class="login-container">
      <!-- Logo区域 -->
      <view class="logo-section">
        <text class="logo-text">OnlyStudents</text>
        <text class="slogan">学习笔记分享平台</text>
      </view>

      <!-- 登录表单 -->
      <view class="login-form">
        <view class="form-item username-item">
          <input
            type="text"
            v-model="form.username"
            placeholder="用户名/邮箱/手机号"
            class="form-input"
            @focus="showHistory = historyAccounts.length > 0"
          />
          <!-- 历史账号下拉按钮 -->
          <view
            v-if="historyAccounts.length > 0"
            class="history-toggle"
            @click="showHistory = !showHistory"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ rotate: showHistory }">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </view>

          <!-- 历史账号下拉列表 -->
          <view v-if="showHistory && historyAccounts.length > 0" class="history-dropdown">
            <view
              v-for="(account, index) in historyAccounts"
              :key="index"
              class="history-item"
              @click="selectHistoryAccount(account)"
            >
              <text class="history-username">{{ account.username }}</text>
              <view class="history-delete" @click="removeHistoryAccount(index, $event)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </view>
            </view>
          </view>
        </view>

        <view class="form-item">
          <input
            type="password"
            v-model="form.password"
            placeholder="密码"
            class="form-input"
          />
        </view>

        <view class="form-options">
          <view class="remember-me">
            <checkbox :checked="rememberMe" @click="rememberMe = !rememberMe" />
            <text>记住我</text>
          </view>
          <text class="forgot-link" @click="forgotPassword">忘记密码?</text>
        </view>

        <button
          type="button"
          class="login-btn"
          :class="{ loading: loading }"
          :disabled="loading || !isFormValid"
          @click="handleLogin"
        >
          <text v-if="!loading">登录</text>
          <view v-else class="btn-spinner"></view>
        </button>

        <view class="register-link">
          <text>还没有账号? </text>
          <text class="link" @click="goToRegister">立即注册</text>
        </view>
      </view>

      <!-- 其他登录方式 -->
      <view class="other-login">
        <view class="divider">
          <view class="line"></view>
          <text>其他登录方式</text>
          <view class="line"></view>
        </view>

        <view class="login-methods">
          <view class="method-item" @click="wechatLogin">
            <view class="method-icon wechat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.027-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
            </view>
            <text>微信</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const rememberMe = ref(false)

const isFormValid = computed(() => {
  return form.value.username.trim() && form.value.password.trim()
})

// 历史账号列表（最多保存5个）
const historyAccounts = ref<Array<{username: string, password: string}>>([])
const showHistory = ref(false)

const handleLogin = async () => {
  if (!isFormValid.value) return

  loading.value = true

  const result = await userStore.login({
    username: form.value.username,
    password: form.value.password
  })

  loading.value = false

  if (result.success) {
    uni.showToast({ title: '登录成功', icon: 'success' })

    // 记住密码功能 - 支持多账号
    if (rememberMe.value) {
      saveAccountToHistory(form.value.username, form.value.password)
    }

    // 跳转到首页（使用 redirectTo，因为没有配置 tabBar）
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/index/index' })
    }, 1500)
  } else {
    uni.showToast({ title: result.message, icon: 'none' })
  }
}

// 保存账号到历史记录
const saveAccountToHistory = (username: string, password: string) => {
  let accounts = uni.getStorageSync('loginHistoryAccounts') || []

  // 查找是否已存在该账号
  const existingIndex = accounts.findIndex((acc: any) => acc.username === username)

  const accountInfo = {
    username: username,
    password: btoa(password), // Base64加密
    loginTime: Date.now()
  }

  if (existingIndex >= 0) {
    // 更新已有账号
    accounts[existingIndex] = accountInfo
  } else {
    // 添加新账号到开头
    accounts.unshift(accountInfo)
    // 最多保留5个账号
    if (accounts.length > 5) {
      accounts = accounts.slice(0, 5)
    }
  }

  uni.setStorageSync('loginHistoryAccounts', accounts)
}

// 选择历史账号
const selectHistoryAccount = (account: {username: string, password: string}) => {
  form.value.username = account.username
  form.value.password = atob(account.password)
  rememberMe.value = true
  showHistory.value = false
}

// 删除历史账号
const removeHistoryAccount = (index: number, event: Event) => {
  event.stopPropagation()
  historyAccounts.value.splice(index, 1)
  uni.setStorageSync('loginHistoryAccounts', historyAccounts.value)
  if (historyAccounts.value.length === 0) {
    showHistory.value = false
  }
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' })
}

const forgotPassword = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const wechatLogin = () => {
  uni.showToast({ title: '微信登录开发中', icon: 'none' })
}

// 检查是否有记住的账号和密码
const checkRememberedUser = () => {
  const accounts = uni.getStorageSync('loginHistoryAccounts') || []
  historyAccounts.value = accounts.map((acc: any) => ({
    username: acc.username,
    password: acc.password
  }))

  // 自动填充最近登录的账号
  if (accounts.length > 0) {
    const lastAccount = accounts[0]
    form.value.username = lastAccount.username
    form.value.password = atob(lastAccount.password)
    rememberMe.value = true
  }
}

checkRememberedUser()
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 360px;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-text {
  font-size: 32px;
  font-weight: 700;
  color: var(--accent-warm);
  display: block;
  margin-bottom: 8px;
}

.slogan {
  font-size: 14px;
  color: var(--text-secondary);
}

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 13px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.forgot-link {
  color: var(--accent-warm);
}

.login-btn {
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

.login-btn:active {
  transform: scale(0.98);
}

.login-btn[disabled] {
  opacity: 0.6;
}

.login-btn.loading {
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

.register-link {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.register-link .link {
  color: var(--accent-warm);
  font-weight: 600;
}

.other-login {
  margin-top: 32px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: var(--text-tertiary);
  font-size: 13px;
}

.divider .line {
  flex: 1;
  height: 1px;
  background: var(--border-light);
}

.login-methods {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.method-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-icon.wechat {
  background: #07C160;
}

/* 历史账号下拉 */
.username-item {
  position: relative;
}

.history-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px;
  cursor: pointer;
  color: var(--text-tertiary);
}

.history-toggle svg.rotate {
  transform: rotate(180deg);
}

.history-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
}

.history-item:last-child {
  border-bottom: none;
}

.history-item:active {
  background: var(--bg-secondary);
}

.history-username {
  font-size: 14px;
  color: var(--text-primary);
}

.history-delete {
  padding: 4px;
  color: var(--text-tertiary);
  cursor: pointer;
}

.history-delete:active {
  color: var(--accent-coral);
}
</style>
