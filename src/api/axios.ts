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
        return Promise.reject(data)
      }

      return data.data
    },
    (error) => {
      uni.hideLoading()

      console.error('请求错误:', error)

      let errorMessage = '请求失败'

      if (error.response) {
        const { status, data } = error.response
        console.log('Error response full:', JSON.stringify(error.response))
        console.log('Error data:', data)
        console.log('Error data keys:', Object.keys(data))
        
        if (data) {
          errorMessage = data.message || data.msg || data.error || `请求失败(${status})`
        } else {
          errorMessage = `请求失败(${status})`
        }

        if (status === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userId')
          errorMessage = '登录已过期，请重新登录'

          setTimeout(() => {
            uni.navigateTo({ url: '/pages/auth/login' })
          }, 1500)
        }
      } else if (error.request) {
        errorMessage = '网络错误，请检查网络连接'
      } else {
        errorMessage = '请求配置错误'
      }

      // 显示错误提示
      uni.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000
      })

      // 返回错误信息给调用方
      return Promise.reject(error.response?.data || { message: errorMessage })
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
