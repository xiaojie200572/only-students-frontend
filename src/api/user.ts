import { get, post, put, del } from './axios'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateUserRequest,
  UserInfo
} from '@/types/api.types'

// 用户认证相关API
export const userApi = {
  // 用户注册
  register: (data: RegisterRequest) => {
    return post<UserInfo>('/user/register', data)
  },

  // 用户登录
  login: (data: LoginRequest) => {
    return post<LoginResponse>('/user/login', data)
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return get<UserInfo>('/user/info')
  },

  // 获取指定用户信息
  getUserById: (userId: number) => {
    return get<UserInfo>(`/user/${userId}`)
  },

  // 用户登出
  logout: (deviceId?: string) => {
    return post<void>('/user/logout', { deviceId })
  },

  // 登出所有设备
  logoutAll: () => {
    return post<void>('/user/logout-all')
  },

  // 保存登录信息到本地
  saveLoginInfo: (loginRes: LoginResponse) => {
    uni.setStorageSync('token', loginRes.token)
    uni.setStorageSync('userId', String(loginRes.userInfo.id))
    uni.setStorageSync('userInfo', loginRes.userInfo)
    uni.setStorageSync('tokenExpire', loginRes.expireTime)
    console.log('保存登录信息 - userId:', loginRes.userInfo.id, '转换为字符串:', String(loginRes.userInfo.id))
  },

  // 清除登录信息
  clearLoginInfo: () => {
    uni.removeStorageSync('token')
    uni.removeStorageSync('userId')
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('tokenExpire')
  },

  // 检查是否已登录
  isLoggedIn: (): boolean => {
    const token = uni.getStorageSync('token')
    const expireTime = uni.getStorageSync('tokenExpire')

    if (!token) return false

    // 检查token是否过期
    if (expireTime && Date.now() > expireTime) {
      userApi.clearLoginInfo()
      return false
    }

    return true
  },

  // 获取本地存储的用户信息
  getStoredUserInfo: (): UserInfo | null => {
    return uni.getStorageSync('userInfo') || null
  },

  // 更新用户信息
  updateUser: (data: UpdateUserRequest) => {
    return put<UserInfo>('/user', data)
  }
}
