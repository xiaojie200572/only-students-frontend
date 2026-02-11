import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_BASE_URL } from '@/config/api.config'

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 显示加载提示
    uni.showLoading({ title: '加载中...', mask: true })

    // 添加token
    const token = uni.getStorageSync('token')
    const userId = uni.getStorageSync('userId')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    if (userId) {
      config.headers['X-User-Id'] = String(userId)
    }

    return config
  },
  (error) => {
    uni.hideLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    uni.hideLoading()

    const { data } = response

    // 业务逻辑错误
    if (data.code !== 200) {
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(data)
    }

    return data.data
  },
  (error) => {
    uni.hideLoading()

    console.error('请求错误:', error)

    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response

      if (status === 401) {
        // token过期，清除登录状态
        uni.removeStorageSync('token')
        uni.removeStorageSync('userId')
        uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })

        // 跳转到登录页
        setTimeout(() => {
          uni.navigateTo({ url: '/pages/auth/login' })
        }, 1500)
      } else {
        uni.showToast({
          title: data?.message || `请求失败(${status})`,
          icon: 'none'
        })
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      uni.showToast({ title: '网络错误，请检查网络连接', icon: 'none' })
    } else {
      // 请求配置出错
      uni.showToast({ title: '请求配置错误', icon: 'none' })
    }

    return Promise.reject(error)
  }
)

// 封装请求方法（保持和之前一样的API）
export const request = <T>(config: AxiosRequestConfig): Promise<T> => {
  return instance.request(config)
}

// GET请求
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.get(url, { params, ...config })
}

// POST请求
export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.post(url, data, config)
}

// PUT请求
export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.put(url, data, config)
}

// DELETE请求
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return instance.delete(url, config)
}


// 导出axios实例
export default instance
