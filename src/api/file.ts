import { API_BASE_URL } from '@/config/api.config'
import type { FileUploadResult } from '@/types/api.types'

// 上传文件（通用）
export const uploadFile = (filePath: string, url: string = '/file/upload', category?: string): Promise<FileUploadResult> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const userId = uni.getStorageSync('userId')

    const header: Record<string, string> = {}

    if (token) header['Authorization'] = `Bearer ${token}`
    // 将 userId 放入 header，后端从 header 读取
    if (userId) header['X-User-Id'] = String(userId)
    
    // 构建URL，只添加分类参数
    let urlWithParams = `${API_BASE_URL}${url}`;
    if (category) {
      urlWithParams += `?category=${category}`;
    }

    uni.uploadFile({
      url: urlWithParams,
      filePath,
      name: 'file',
      header,
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data.data)
          } else {
            uni.showToast({ title: data.message || '上传失败', icon: 'none' })
            reject(data)
          }
        } catch (e) {
          reject(e)
        }
      },
      fail: reject
    })
  })
}

// 上传头像（专用接口，自动存放到公开目录）
export const uploadAvatar = (filePath: string): Promise<FileUploadResult> => {
  return uploadFile(filePath, '/file/upload/avatar')
}

// 上传公开资源
export const uploadPublicFile = (filePath: string): Promise<FileUploadResult> => {
  return uploadFile(filePath, '/file/upload', 'PUBLIC')
}

// 上传私有文件
export const uploadPrivateFile = (filePath: string): Promise<FileUploadResult> => {
  return uploadFile(filePath, '/file/upload', 'PRIVATE')
}

// 上传笔记附件（根据笔记可见性上传到不同目录）
export const uploadNoteFile = (filePath: string, visibility: number): Promise<FileUploadResult> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const userId = uni.getStorageSync('userId')

    const header: Record<string, string> = {}

    if (token) header['Authorization'] = `Bearer ${token}`
    if (userId) header['X-User-Id'] = String(userId)

    uni.uploadFile({
      url: `${API_BASE_URL}/file/upload-for-note?visibility=${visibility}`,
      filePath,
      name: 'file',
      header,
      success: (res: any) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data.data)
          } else {
            uni.showToast({ title: data.message || '上传失败', icon: 'none' })
            reject(data)
          }
        } catch (e) {
          reject(e)
        }
      },
      fail: reject
    })
  })
}

// 获取文件预览URL
export const getFilePreviewUrl = (fileId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const header: Record<string, string> = {}
    if (token) header['Authorization'] = `Bearer ${token}`

    uni.request({
      url: `${API_BASE_URL}/file/preview/${fileId}`,
      method: 'GET',
      header,
      success: (res: any) => {
        if (res.data.code === 200) {
          resolve(res.data.data)
        } else {
          reject(new Error(res.data.message || '获取预览链接失败'))
        }
      },
      fail: reject
    })
  })
}
