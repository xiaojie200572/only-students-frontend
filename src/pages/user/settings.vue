<template>
  <view class="settings-page">
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

    <!-- 绑定手机/邮箱弹窗 -->
    <view class="bind-modal-mask" v-if="bindModalVisible" @click="closeBindModal">
      <view class="bind-modal" @click.stop>
        <view class="bind-modal-header">
          <text class="bind-modal-title">{{ bindType === 'phone' ? '绑定手机' : '绑定邮箱' }}</text>
          <view class="bind-modal-close" @click="closeBindModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </view>
        </view>
        <view class="bind-modal-body">
          <view class="bind-input-group">
            <text class="bind-label">{{ bindType === 'phone' ? '手机号' : '邮箱' }}</text>
            <input
              type="text"
              v-model="bindForm.account"
              :placeholder="bindType === 'phone' ? '请输入手机号' : '请输入邮箱'"
              class="bind-input"
              @blur="validateAccount"
            />
            <text v-if="accountError" class="bind-error">{{ accountError }}</text>
          </view>
          <view class="bind-input-group">
            <text class="bind-label">验证码</text>
            <view class="bind-code-row">
              <input
                type="text"
                v-model="bindForm.code"
                placeholder="请输入验证码"
                class="bind-input bind-code-input"
              />
              <button
                class="bind-code-btn"
                :class="{ disabled: countdown > 0 }"
                @click="sendBindCode"
                :disabled="countdown > 0"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </view>
            <text v-if="codeError" class="bind-error">{{ codeError }}</text>
          </view>
        </view>
        <view class="bind-modal-footer">
          <button class="bind-cancel-btn" @click="closeBindModal">取消</button>
          <button class="bind-confirm-btn" :class="{ loading: bindLoading }" @click="submitBind" :disabled="bindLoading">
            <text v-if="!bindLoading">绑定</text>
            <view v-else class="btn-spinner"></view>
          </button>
        </view>
      </view>
    </view>

    <!-- 修改密码弹窗 -->
    <view class="bind-modal-mask" v-if="changePwdModalVisible" @click="closeChangePwdModal">
      <view class="bind-modal" @click.stop>
        <view class="bind-modal-header">
          <text class="bind-modal-title">修改密码</text>
          <view class="bind-modal-close" @click="closeChangePwdModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </view>
        </view>

        <!-- 验证方式选择 -->
        <view class="pwd-method-tabs" v-if="!pwdMethodSelected">
          <text class="pwd-method-title">选择验证方式</text>
          <view class="pwd-method-list">
            <view class="pwd-method-item" @click="selectPwdMethod('code')">
              <view class="pwd-method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </view>
              <view class="pwd-method-info">
                <text class="pwd-method-name">验证码验证</text>
                <text class="pwd-method-desc">通过已绑定的手机/邮箱接收验证码</text>
              </view>
            </view>
            <view class="pwd-method-item" @click="selectPwdMethod('password')">
              <view class="pwd-method-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </view>
              <view class="pwd-method-info">
                <text class="pwd-method-name">密码验证</text>
                <text class="pwd-method-desc">通过当前登录密码验证身份</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 验证码方式 -->
        <view class="bind-modal-body" v-if="pwdMethodSelected === 'code'">
          <view class="pwd-method-back" @click="pwdMethodSelected = ''">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            <text>返回</text>
          </view>
          <view class="bind-input-group">
            <text class="bind-label">已绑定的{{ pwdVerifyType === 'phone' ? '手机号' : '邮箱' }}</text>
            <view class="pwd-verify-info">
              <text>{{ pwdVerifyType === 'phone' ? userInfo?.phone : userInfo?.email }}</text>
            </view>
          </view>
          <view class="bind-input-group">
            <text class="bind-label">验证码</text>
            <view class="bind-code-row">
              <input
                type="text"
                v-model="pwdForm.code"
                placeholder="请输入验证码"
                class="bind-input bind-code-input"
              />
              <button
                class="bind-code-btn"
                :class="{ disabled: pwdCountdown > 0 }"
                @click="sendPwdCode"
                :disabled="pwdCountdown > 0"
              >
                {{ pwdCountdown > 0 ? `${pwdCountdown}s` : '获取验证码' }}
              </button>
            </view>
            <text v-if="pwdCodeError" class="bind-error">{{ pwdCodeError }}</text>
          </view>
          <view class="bind-input-group">
            <text class="bind-label">新密码</text>
            <input
              type="password"
              v-model="pwdForm.newPassword"
              placeholder="请输入新密码"
              class="bind-input"
            />
            <text class="input-hint">密码长度为6-20个字符</text>
          </view>
          <view class="bind-input-group">
            <text class="bind-label">确认密码</text>
            <input
              type="password"
              v-model="pwdForm.confirmPassword"
              placeholder="请再次输入新密码"
              class="bind-input"
            />
            <text v-if="pwdFormError" class="bind-error">{{ pwdFormError }}</text>
          </view>
        </view>

        <!-- 密码方式 -->
        <view class="bind-modal-body" v-if="pwdMethodSelected === 'password'">
          <view class="pwd-method-back" @click="pwdMethodSelected = ''">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            <text>返回</text>
          </view>
          <view class="bind-input-group">
            <text class="bind-label">当前密码</text>
            <input
              type="password"
              v-model="pwdForm.oldPassword"
              placeholder="请输入当前密码"
              class="bind-input"
            />
            <text v-if="pwdOldPwdError" class="bind-error">{{ pwdOldPwdError }}</text>
          </view>
          <view class="bind-input-group">
            <text class="bind-label">新密码</text>
            <input
              type="password"
              v-model="pwdForm.newPassword"
              placeholder="请输入新密码"
              class="bind-input"
            />
            <text class="input-hint">密码长度为6-20个字符</text>
          </view>
          <view class="bind-input-group">
            <text class="bind-label">确认密码</text>
            <input
              type="password"
              v-model="pwdForm.confirmPassword"
              placeholder="请再次输入新密码"
              class="bind-input"
            />
            <text v-if="pwdFormError" class="bind-error">{{ pwdFormError }}</text>
          </view>
        </view>
        <view class="bind-modal-footer" v-if="pwdMethodSelected">
          <button class="bind-cancel-btn" @click="closeChangePwdModal">取消</button>
          <button class="bind-confirm-btn" :class="{ loading: pwdLoading }" @click="submitChangePwd" :disabled="pwdLoading">
            <text v-if="!pwdLoading">确认修改</text>
            <view v-else class="btn-spinner"></view>
          </button>
        </view>
      </view>
    </view>

    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">设置</text>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 账号安全 -->
      <view class="section">
        <view class="section-title">账号安全</view>
        <view class="menu-list">
          <view class="menu-item" @click="changePassword">
            <text class="menu-text">修改密码</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </view>
          <view class="menu-item" @click="bindPhone">
            <text class="menu-text">绑定手机</text>
            <view class="menu-value">
              <text class="value-text">{{ userInfo?.phone ? '已绑定' : '未绑定' }}</text>
              <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </view>
          </view>
          <view class="menu-item" @click="bindEmail">
            <text class="menu-text">绑定邮箱</text>
            <view class="menu-value">
              <text class="value-text">{{ userInfo?.email ? '已绑定' : '未绑定' }}</text>
              <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 通知设置 -->
      <view class="section">
        <view class="section-title">通知设置</view>
        <view class="menu-list">
          <view class="menu-item">
            <text class="menu-text">接收推送通知</text>
            <switch :checked="notificationSettings.push" @change="togglePush" color="#E07B54"/>
          </view>
          <view class="menu-item">
            <text class="menu-text">订阅更新提醒</text>
            <switch :checked="notificationSettings.subscription" @change="toggleSubscription" color="#E07B54"/>
          </view>
          <view class="menu-item">
            <text class="menu-text">新消息提醒</text>
            <switch :checked="notificationSettings.message" @change="toggleMessage" color="#E07B54"/>
          </view>
        </view>
      </view>

      <!-- 主题设置 -->
      <view class="section">
        <view class="section-title">主题设置</view>
        <view class="menu-list">
          <view class="menu-item" @click="toggleTheme">
            <text class="menu-text">深色模式</text>
            <view class="menu-value">
              <text class="value-text">{{ isDark ? '已开启' : '已关闭' }}</text>
              <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 关于 -->
      <view class="section">
        <view class="section-title">关于</view>
        <view class="menu-list">
          <view class="menu-item" @click="showAbout">
            <text class="menu-text">关于我们</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </view>
          <view class="menu-item" @click="showPrivacy">
            <text class="menu-text">隐私政策</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </view>
          <view class="menu-item" @click="showAgreement">
            <text class="menu-text">用户协议</text>
            <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </view>
          <view class="menu-item">
            <text class="menu-text">版本号</text>
            <text class="version-text">v1.0.0</text>
          </view>
        </view>
      </view>

      <!-- 清除缓存 -->
      <view class="section">
        <view class="menu-list">
          <view class="menu-item" @click="clearCache">
            <text class="menu-text">清除缓存</text>
            <text class="cache-size">{{ cacheSize }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { userApi } from '@/api'
import CustomModal from '@/components/CustomModal.vue'

const userStore = useUserStore()
const themeStore = useThemeStore()

const userInfo = computed(() => userStore.userInfo)
const isDark = computed(() => themeStore.isDark)

// 绑定弹窗状态
const bindModalVisible = ref(false)
const bindType = ref<'phone' | 'email'>('phone')
const bindForm = ref({
  account: '',
  code: ''
})
const bindLoading = ref(false)
const countdown = ref(0)
const accountError = ref('')
const codeError = ref('')
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 修改密码状态
const changePwdModalVisible = ref(false)
const pwdMethodSelected = ref('')
const pwdVerifyType = ref<'phone' | 'email'>('phone')
const pwdForm = ref({
  code: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const pwdLoading = ref(false)
const pwdCountdown = ref(0)
const pwdCodeError = ref('')
const pwdOldPwdError = ref('')
const pwdFormError = ref('')
let pwdCountdownTimer: ReturnType<typeof setInterval> | null = null

const validateAccount = () => {
  const account = bindForm.value.account.trim()
  accountError.value = ''

  if (!account) {
    accountError.value = `请输入${bindType.value === 'phone' ? '手机号' : '邮箱'}`
    return
  }

  if (bindType.value === 'phone' && !/^1[3-9]\d{9}$/.test(account)) {
    accountError.value = '请输入正确的11位手机号'
    return
  }

  if (bindType.value === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account)) {
    accountError.value = '请输入正确的邮箱格式'
    return
  }
}

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

const notificationSettings = ref({
  push: true,
  subscription: true,
  message: true
})

const cacheSize = ref('12.5 MB')

const togglePush = (e: any) => {
  notificationSettings.value.push = e.detail.value
}

const toggleSubscription = (e: any) => {
  notificationSettings.value.subscription = e.detail.value
}

const toggleMessage = (e: any) => {
  notificationSettings.value.message = e.detail.value
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const changePassword = () => {
  pwdMethodSelected.value = ''
  pwdForm.value = { code: '', oldPassword: '', newPassword: '', confirmPassword: '' }
  pwdCodeError.value = ''
  pwdOldPwdError.value = ''
  pwdFormError.value = ''
  // 根据已绑定的方式决定验证类型
  pwdVerifyType.value = userInfo.value?.phone ? 'phone' : 'email'
  changePwdModalVisible.value = true
}

const closeChangePwdModal = () => {
  changePwdModalVisible.value = false
  pwdMethodSelected.value = ''
  if (pwdCountdownTimer) {
    clearInterval(pwdCountdownTimer)
    pwdCountdownTimer = null
  }
  pwdCountdown.value = 0
}

const selectPwdMethod = (method: string) => {
  pwdMethodSelected.value = method
}

const sendPwdCode = async () => {
  const target = pwdVerifyType.value === 'phone' ? userInfo.value?.phone : userInfo.value?.email
  if (!target) {
    pwdCodeError.value = pwdVerifyType.value === 'phone' ? '请先绑定手机号' : '请先绑定邮箱'
    return
  }

  try {
    await userApi.sendCode({
      account: target,
      type: 'RESET_PASSWORD' as any
    })
    uni.showToast({ title: '验证码已发送', icon: 'success' })

    pwdCountdown.value = 60
    pwdCountdownTimer = setInterval(() => {
      pwdCountdown.value--
      if (pwdCountdown.value <= 0 && pwdCountdownTimer) {
        clearInterval(pwdCountdownTimer)
        pwdCountdownTimer = null
      }
    }, 1000)
  } catch (error: any) {
    pwdCodeError.value = error.message || '发送失败'
  }
}

const submitChangePwd = async () => {
  pwdOldPwdError.value = ''
  pwdFormError.value = ''

  if (pwdMethodSelected.value === 'code') {
    if (!pwdForm.value.code) {
      pwdCodeError.value = '请输入验证码'
      return
    }
  } else {
    if (!pwdForm.value.oldPassword) {
      pwdOldPwdError.value = '请输入当前密码'
      return
    }
  }

  if (!pwdForm.value.newPassword) {
    pwdFormError.value = '请输入新密码'
    return
  }

  if (pwdForm.value.newPassword.length < 6) {
    pwdFormError.value = '密码长度不能少于6位'
    return
  }

  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    pwdFormError.value = '两次输入的密码不一致'
    return
  }

  pwdLoading.value = true

  try {
    if (pwdMethodSelected.value === 'code') {
      const account = pwdVerifyType.value === 'phone' ? userInfo.value?.phone : userInfo.value?.email
      if (!account) {
        uni.showToast({ title: '请先绑定手机号或邮箱', icon: 'none' })
        return
      }
      // 验证码方式 - 调用后端重置密码接口
      await userApi.resetPasswordByCode({
        account: account,
        verifyCode: pwdForm.value.code,
        newPassword: pwdForm.value.newPassword
      })
    } else {
      // 密码方式 - 调用后端修改密码接口
      await userApi.changePassword({
        oldPassword: pwdForm.value.oldPassword,
        newPassword: pwdForm.value.newPassword
      })
    }

    uni.showToast({ title: '密码修改成功', icon: 'success' })
    closeChangePwdModal()
  } catch (error: any) {
    if (pwdMethodSelected.value === 'code') {
      pwdCodeError.value = error.message || '修改失败'
    } else {
      pwdOldPwdError.value = error.message || '当前密码错误'
    }
  } finally {
    pwdLoading.value = false
  }
}

const bindPhone = () => {
  bindType.value = 'phone'
  bindForm.value = { account: '', code: '' }
  accountError.value = ''
  codeError.value = ''
  bindModalVisible.value = true
}

const bindEmail = () => {
  bindType.value = 'email'
  bindForm.value = { account: '', code: '' }
  accountError.value = ''
  codeError.value = ''
  bindModalVisible.value = true
}

const closeBindModal = () => {
  bindModalVisible.value = false
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
  accountError.value = ''
  codeError.value = ''
}

const sendBindCode = async () => {
  validateAccount()
  if (accountError.value) {
    return
  }

  const account = bindForm.value.account.trim()

  try {
    await userApi.sendCode({
      account,
      type: 'BIND' as any
    })
    uni.showToast({ title: '验证码已发送', icon: 'success' })

    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (error: any) {
    accountError.value = error.message || '发送失败'
  }
}

const submitBind = async () => {
  const account = bindForm.value.account.trim()
  const code = bindForm.value.code.trim()

  codeError.value = ''

  if (!account) {
    accountError.value = `请输入${bindType.value === 'phone' ? '手机号' : '邮箱'}`
    return
  }

  if (!code) {
    codeError.value = '请输入验证码'
    return
  }

  bindLoading.value = true

  try {
    const updatedUserInfo = await userApi.updateUser({
      [bindType.value]: account,
      verifyCode: code
    })

    userStore.setUserInfo(updatedUserInfo)
    uni.setStorageSync('userInfo', updatedUserInfo)

    uni.showToast({ title: '绑定成功', icon: 'success' })
    closeBindModal()
  } catch (error: any) {
    codeError.value = error.message || '绑定失败'
  } finally {
    bindLoading.value = false
  }
}

const showAbout = async () => {
  await showModal({
    title: '关于 OnlyStudents',
    content: 'OnlyStudents 是一个学习笔记分享平台，让知识传播更简单。',
    showCancel: false
  })
}

const showPrivacy = () => {
  uni.navigateTo({ url: '/pages/user/privacy-policy' })
}

const showAgreement = () => {
  uni.navigateTo({ url: '/pages/user/user-agreement' })
}

const clearCache = async () => {
  const confirmed = await showModal({
    title: '提示',
    content: '确定要清除缓存吗？'
  })

  if (confirmed) {
    // 清除缓存逻辑
    cacheSize.value = '0 B'
    uni.showToast({ title: '缓存已清除', icon: 'success' })
  }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.settings-page {
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
  padding-bottom: calc(48px + env(safe-area-inset-bottom));
}

.section {
  background: var(--bg-card);
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-tertiary);
  padding: 12px 16px;
  background: var(--bg-secondary);
}

.menu-list {
  padding: 0 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-light);
  width: 100%;
  background: transparent;
  border-left: none;
  border-right: none;
  border-top: none;
  text-align: left;
  font-size: inherit;
  color: inherit;
  outline: none;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-text {
  font-size: 15px;
  color: var(--text-primary);
}

.menu-value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.value-text {
  font-size: 14px;
  color: var(--text-tertiary);
}

.menu-arrow {
  color: var(--text-tertiary);
}

.version-text {
  font-size: 14px;
  color: var(--text-tertiary);
}

.cache-size {
  font-size: 14px;
  color: var(--text-tertiary);
}

.bind-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.bind-modal {
  width: 85%;
  max-width: 340px;
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
}

.bind-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.bind-modal-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.bind-modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.bind-modal-body {
  padding: 20px;
}

.bind-input-group {
  margin-bottom: 16px;
}

.bind-input-group:last-child {
  margin-bottom: 0;
}

.bind-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: block;
}

.bind-input {
  width: 100%;
  height: 44px;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 15px;
  color: var(--text-primary);
  box-sizing: border-box;
  border: 1px solid transparent;
}

.bind-input:focus {
  border-color: var(--accent-warm);
}

.bind-error {
  font-size: 12px;
  color: #F44336;
  margin-top: 6px;
  display: block;
}

.input-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 6px;
  display: block;
}

.bind-code-row {
  display: flex;
  gap: 10px;
}

.bind-code-input {
  flex: 1;
}

.bind-code-btn {
  width: 110px;
  height: 44px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  color: white;
  font-size: 13px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  margin: 0;
  line-height: 1;
}

.bind-code-btn[disabled] {
  background: var(--bg-secondary);
  color: var(--text-tertiary);
}

.bind-code-btn.disabled {
  background: var(--bg-secondary);
  color: var(--text-tertiary);
}

.bind-modal-footer {
  display: flex;
  border-top: 1px solid var(--border-light);
}

.bind-cancel-btn,
.bind-confirm-btn {
  flex: 1;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border: none;
  background: transparent;
  margin: 0;
  padding: 0;
  border-left: none !important;
  border-right: none !important;
  border-radius: 0 !important;
}

.bind-cancel-btn {
  color: var(--text-secondary);
}

.bind-confirm-btn {
  color: var(--accent-warm);
  font-weight: 600;
}

.bind-confirm-btn.loading {
  opacity: 0.6;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--accent-warm);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pwd-method-tabs {
  padding: 20px;
}

.pwd-method-title {
  font-size: 15px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 16px;
}

.pwd-method-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pwd-method-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.2s;
}

.pwd-method-item:active {
  background: var(--bg-hover);
}

.pwd-method-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
}

.pwd-method-icon svg {
  color: white;
}

.pwd-method-info {
  flex: 1;
}

.pwd-method-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.pwd-method-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  display: block;
}

.pwd-method-back {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--accent-warm);
  font-size: 14px;
  margin-bottom: 16px;
  cursor: pointer;
}

.pwd-verify-info {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 15px;
}
</style>
