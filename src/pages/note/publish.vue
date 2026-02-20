<template>
  <view class="publish-page">
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
      <text class="nav-title">{{ isEdit ? '编辑笔记' : '创建笔记' }}</text>
      <view class="nav-right">
        <view
          :class="['save-btn', { loading: loading || uploadingCount > 0 }]"
          @click="handleSave"
        >
          <text v-if="!loading && uploadingCount === 0">保存</text>
          <view v-else class="btn-spinner"></view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 附件列表（轮播图） -->
      <view class="attachments-section">
        <text class="section-label">笔记附件</text>
        <text class="attachments-hint">支持图片、文档格式（最多20个，总大小不超过20MB）</text>
        
        <!-- 附件网格 -->
        <view class="attachments-grid">
          <!-- 已上传的附件 -->
          <view 
            v-for="(file, index) in form.attachments" 
            :key="file.fileId || index"
            class="attachment-item"
          >
            <!-- 图片预览 -->
            <view v-if="isImageFile(file)" class="attachment-image-wrapper">
              <image :src="file.fileUrl" class="attachment-image" mode="aspectFill" />
              <view class="attachment-delete" @click.stop="removeAttachment(index)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </view>
            </view>
            <!-- 文档预览 -->
            <view v-else class="attachment-file-wrapper">
              <view class="file-icon-large">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </view>
              <text class="file-name-small">{{ file.fileName }}</text>
              <view class="attachment-delete" @click.stop="removeAttachment(index)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </view>
            </view>
          </view>
          
          <!-- 添加按钮 -->
          <view 
            v-if="form.attachments.length < 20" 
            class="attachment-add-btn" 
            @click="chooseFiles"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <text class="add-text">添加</text>
          </view>
        </view>
        
        <!-- 上传进度提示 -->
        <view v-if="uploadingCount > 0" class="uploading-hint">
          <text>正在上传 {{ uploadingCount }} 个文件...</text>
        </view>
      </view>

      <!-- 标题 -->
      <view class="input-section">
        <input
          type="text"
          v-model="form.title"
          placeholder="填写标题会有更多赞哦~"
          class="title-input"
          maxlength="50"
        />
        <text class="char-count">{{ form.title.length }}/50</text>
      </view>

      <!-- 正文 -->
      <view class="input-section">
        <textarea
          v-model="form.content"
          placeholder="添加正文..."
          class="content-input compact"
          maxlength="500"
        />
        <text class="char-count">{{ form.content.length }}/500</text>
      </view>

      <!-- 分类 -->
      <view class="section">
        <text class="section-title">选择分类</text>
        <view class="category-list">
          <view
            v-for="cat in categories"
            :key="cat.id"
            :class="['category-item', { active: form.categoryId === cat.id }]"
            @click="selectCategory(cat.id)"
          >
            <text class="category-icon">{{ cat.icon }}</text>
            <text class="category-name">{{ cat.name }}</text>
          </view>
        </view>
      </view>

      <!-- 标签 -->
      <view class="section">
        <text class="section-title">添加标签</text>
        <view class="tags-input">
          <view v-for="(tag, index) in form.tags" :key="index" class="tag-item">
            <text>{{ tag }}</text>
            <view class="remove-tag" @click="removeTag(index)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </view>
          </view>
          <input
            v-if="form.tags.length < 5"
            type="text"
            v-model="tagInput"
            placeholder="输入标签"
            class="tag-input"
            @confirm="addTag"
          />
        </view>
        <text class="hint">最多添加5个标签，按回车确认</text>
      </view>

      <!-- 可见性设置 -->
      <view class="section">
        <text class="section-title">可见性设置</text>
        <view class="visibility-select-wrapper">
          <picker
            mode="selector"
            :range="visibilityOptions"
            :value="form.visibility"
            @change="onVisibilityChange"
          >
            <view class="visibility-picker">
              <text class="picker-label">{{ visibilityOptions[form.visibility] }}</text>
              <svg class="picker-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </view>
          </picker>
        </view>

        <!-- 价格设置（仅付费可见和订阅后付费可见时显示） -->
        <view v-if="form.visibility === 2 || form.visibility === 3" class="price-setting">
          <text class="label">设置价格</text>
          <view class="price-input-wrapper">
            <text class="currency">¥</text>
            <input
              type="digit"
              v-model="form.price"
              placeholder="0.00"
              class="price-input"
            />
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="footer-actions" v-if="isEdit">
        <view class="delete-btn" @click="handleDelete">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <text>删除笔记</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNoteStore } from '@/stores/note'
import { NOTE_CATEGORIES } from '@/config/api.config'
import { noteApi } from '@/api/note'
import { useUserStore } from '@/stores/user'
import { API_BASE_URL } from '@/config/api.config'
import { uploadPrivateFile, uploadNoteFile, deleteFile } from '@/api/file'
import CustomModal from '@/components/CustomModal.vue'

const noteStore = useNoteStore()
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
// 获取页面参数（编辑模式）
const page = getCurrentPages()[getCurrentPages().length - 1] as any
const noteId = ref<number | null>(page.options?.id ? parseInt(page.options.id) : null)
const isEdit = ref(!!noteId.value)

const form = ref({
  title: '',
  content: '',
  categoryId: null as number | null,
  tags: [] as string[],
  visibility: 0,
  price: '',
  attachments: [] as any[]
})

// 附件上传中状态
const uploadingCount = ref(0)

// 判断附件是否为图片
const isImageFile = (file: any) => {
  const type = (file.fileType || file.name || '').toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].some(t => type.includes(t))
}

// 获取文件图标
const getFileIcon = (fileType: string) => {
  if (isImageFile(fileType)) return 'image'
  if (fileType?.includes('pdf')) return 'pdf'
  if (fileType?.includes('doc')) return 'word'
  if (fileType?.includes('xls')) return 'excel'
  if (fileType?.includes('ppt')) return 'ppt'
  return 'file'
}

const tagInput = ref('')
const loading = ref(false)
const categories = NOTE_CATEGORIES

// 如果是编辑模式，加载现有笔记数据
onMounted(async () => {
  // 保存来源页面（用于刷新后返回）
  const pages = getCurrentPages()
  if (pages.length > 1) {
    const refererPage = pages[pages.length - 2]
    uni.setStorageSync('publish_referer', '/' + refererPage.route)
  }
  
  // 避免重复加载数据（防止覆盖用户的编辑）
  // 只有当表单为空时才加载（说明是首次进入）
  if (isEdit.value && noteId.value && form.value.attachments.length === 0 && !form.value.title) {
    try {
      loading.value = true
      const note = await noteApi.getById(noteId.value)
      form.value.title = note.title
      form.value.content = note.content
      form.value.categoryId = note.categoryId
      form.value.tags = note.tags || []
      form.value.visibility = note.visibility
      form.value.price = note.price ? String(note.price) : ''
      
      // 加载附件列表
      if (note.attachments) {
        try {
          const attachments = typeof note.attachments === 'string' 
            ? JSON.parse(note.attachments) 
            : note.attachments
          form.value.attachments = attachments || []
          // 保存原始附件列表的副本（用于保存时对比）
          originalAttachments.value = JSON.parse(JSON.stringify(form.value.attachments))
        } catch (e) {
          console.error('解析附件失败:', e)
          form.value.attachments = []
          originalAttachments.value = []
        }
      } else {
        originalAttachments.value = []
      }
    } catch (error) {
      console.error('加载笔记失败:', error)
      uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }
})

// 存储原始附件列表（用于保存时对比）
const originalAttachments = ref<any[]>([])

// 移除附件（仅本地移除，保存时才提交到后端）
const removeAttachment = async (index: number) => {
  const file = form.value.attachments[index]
  if (!file) return

  const confirmed = await showModal({
    title: '确认删除',
    content: '确定要删除这个附件吗？点击保存后才会真正删除。',
    confirmColor: '#F44336'
  })
  
  if (confirmed) {
    // 从表单中移除（仅本地）
    form.value.attachments.splice(index, 1)
    uni.showToast({ title: '已移除（请保存）', icon: 'success' })
  }
}

// 检查文件大小限制（5MB）
const checkFileSize = (size: number): boolean => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (size > maxSize) {
    uni.showToast({ title: '单个文件不能超过5MB', icon: 'none' })
    return false
  }
  return true
}

// 检查总大小限制（20MB）
const checkTotalSize = (): boolean => {
  const totalSize = (form.value.attachments || []).reduce((sum, file) => sum + (file.fileSize || 0), 0)
  const maxTotal = 20 * 1024 * 1024 // 20MB
  if (totalSize > maxTotal) {
    uni.showToast({ title: '总大小不能超过20MB', icon: 'none' })
    return false
  }
  return true
}

// 选择多个文件
const chooseFiles = async () => {
  if (form.value.attachments.length >= 20) {
    uni.showToast({ title: '最多支持20个附件', icon: 'none' })
    return
  }

  try {
    // #ifdef H5
    uni.chooseFile({
      count: Math.min(20 - form.value.attachments.length, 5), // 每次最多选5个
      type: 'file',
      extension: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'md', 'json', 'xml', 'csv', 'jpg', 'jpeg', 'png', 'gif', 'webp'],
      success: async (res: any) => {
        const files = res.tempFiles || []
        await uploadFiles(files)
      }
    })
    // #endif

    // #ifndef H5
    uni.chooseMessageFile({
      count: Math.min(20 - form.value.attachments.length, 5),
      type: 'file',
      extension: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'md', 'json', 'xml', 'csv', 'jpg', 'jpeg', 'png', 'gif', 'webp'],
      success: async (res: any) => {
        const files = res.tempFiles || []
        await uploadFiles(files)
      }
    })
    // #endif
  } catch (error) {
    console.error('选择文件失败:', error)
  }
}

// 上传多个文件
const uploadFiles = async (files: any[]) => {
  const validFiles = files.filter(file => {
    const size = file.size || 0
    return checkFileSize(size)
  })
  
  if (validFiles.length === 0) return

  uploadingCount.value = validFiles.length
  
  for (const file of validFiles) {
    if (form.value.attachments.length >= 20) {
      uni.showToast({ title: '已达到最大附件数', icon: 'none' })
      break
    }
    
    try {
      let result: any
      
      // #ifdef H5
      const rawFile = file.raw || file
      result = await uploadNoteFileH5(rawFile, form.value.visibility)
      // #endif
      
      // #ifndef H5
      result = await uploadNoteFile(file.path, form.value.visibility)
      // #endif
      
      form.value.attachments.push({
        fileId: result.fileId,
        fileName: result.originalName || result.fileName,
        fileType: result.fileType,
        fileSize: result.fileSize,
        fileUrl: result.fileUrl
      })
    } catch (error) {
      console.error('文件上传失败:', error)
      uni.showToast({ title: `${file.name || '文件'}上传失败`, icon: 'none' })
    } finally {
      uploadingCount.value--
    }
  }
  
  if (uploadingCount.value === 0) {
    uni.showToast({ title: '上传完成', icon: 'success' })
  }
}

// H5 上传文件
const uploadNoteFileH5 = (file: any, visibility: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const userId = uni.getStorageSync('userId')
    
    const formData = new FormData()
    formData.append('file', file)
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_BASE_URL}/file/upload-for-note?visibility=${visibility}`, true)
    
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    if (userId) {
      xhr.setRequestHeader('X-User-Id', String(userId))
    }
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        if (data.code === 200) {
          resolve(data.data)
        } else {
          reject(data)
        }
      } else {
        reject(xhr.responseText)
      }
    }
    
    xhr.onerror = reject
    xhr.send(formData)
  })
}
const uploadPrivateFileH5 = (file: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const userId = uni.getStorageSync('userId')
    
    const formData = new FormData()
    formData.append('file', file.raw || file)
    formData.append('category', 'PRIVATE')
    
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_BASE_URL}/file/upload`, true)
    
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    if (userId) {
      xhr.setRequestHeader('X-User-Id', String(userId))
    }
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        if (data.code === 200) {
          resolve(data.data)
        } else {
          uni.showToast({ title: data.message || '上传失败', icon: 'none' })
          reject(data)
        }
      } else {
        uni.showToast({ title: '上传失败', icon: 'none' })
        reject(xhr.responseText)
      }
    }
    
    xhr.onerror = function(err) {
      console.error('上传失败:', err)
      reject(err)
    }
    
    xhr.send(formData)
  })
}

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB'
  return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

const selectCategory = (id: number) => {
  form.value.categoryId = id
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && form.value.tags.length < 5 && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

// 可见性选项
const visibilityOptions = [
  '公开',
  '仅订阅可见',
  '仅付费可见',
  '订阅后付费可见',
  '仅自己可见'
]

// 可见性选择改变
const onVisibilityChange = (e: any) => {
  form.value.visibility = parseInt(e.detail.value)
  // 如果不是付费选项，清空价格
  if (form.value.visibility !== 2 && form.value.visibility !== 3) {
    form.value.price = ''
  }
}

const handleSave = async () => {
  if (uploadingCount.value > 0) {
    uni.showToast({ title: '文件上传中，请稍候...', icon: 'none' })
    return
  }

  if (!form.value.title.trim()) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }

  if (!form.value.content.trim()) {
    uni.showToast({ title: '请输入正文内容', icon: 'none' })
    return
  }

  if (!form.value.categoryId) {
    uni.showToast({ title: '请选择分类', icon: 'none' })
    return
  }

  loading.value = true

  try {
    // 如果是编辑模式，先删除被移除的附件文件
    if (isEdit.value && noteId.value) {
      const currentFileIds = new Set(form.value.attachments.map((att: any) => att.fileId).filter(Boolean))
      const deletedAttachments = originalAttachments.value.filter((att: any) => att.fileId && !currentFileIds.has(att.fileId))
      
      if (deletedAttachments.length > 0) {
        // 并行删除所有被移除的附件文件
        await Promise.all(deletedAttachments.map(async (att: any) => {
          try {
            await deleteFile(att.fileId)
          } catch (error) {
            console.error('后端文件删除失败:', att.fileId, error)
          }
        }))
      }
      // 更新原始附件列表（无论是否有删除都要更新）
      originalAttachments.value = JSON.parse(JSON.stringify(form.value.attachments))
    }

    const noteData = {
      title: form.value.title,
      content: form.value.content,
      categoryId: form.value.categoryId,
      visibility: form.value.visibility,
      price: (form.value.visibility === 2 || form.value.visibility === 3) ? (parseFloat(form.value.price) || 0) : 0,
      tags: form.value.tags,
      attachments: JSON.stringify(form.value.attachments),
      authorUsername: userStore.userInfo?.username,
      authorAvatar: userStore.userInfo?.avatar,
    }

    if (isEdit.value && noteId.value) {
      // 更新现有笔记
      await noteApi.update(noteId.value, noteData)
    } else {
      // 创建新笔记（草稿状态）
      await noteApi.create(noteData)
    }

    uni.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000
    })

    setTimeout(() => {
      // 发送全局事件通知列表页刷新
      uni.$emit('notes-updated')
      
      // 设置刷新标记（备用方案）
      uni.setStorageSync('need_refresh_notes', true)
      
      uni.navigateBack({
        success: () => {
          uni.showToast({ title: '保存成功', icon: 'success', duration: 1500 })
        }
      })
    }, 1500)
  } catch (error) {
    console.error('保存失败:', error)
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!isEdit.value || !noteId.value) {
    uni.showToast({ title: '新笔记无法删除', icon: 'none' })
    return
  }

  const confirmed = await showModal({
    title: '确认删除',
    content: '确定要删除这篇笔记吗？此操作不可恢复。',
    confirmColor: '#F44336'
  })
  
  if (confirmed) {
    try {
      await noteApi.delete(noteId.value!)
      uni.showToast({ title: '删除成功', icon: 'success' })
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/user/my-notes' })
      }, 1500)
    } catch (error) {
      console.error('删除失败:', error)
      uni.showToast({ title: '删除失败', icon: 'none' })
    }
  }
}

const goBack = () => {
  const pages = getCurrentPages()
  
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 })
  } else {
    const referer = uni.getStorageSync('publish_referer')
    if (referer) {
      uni.reLaunch({ url: referer })
    } else {
      uni.switchTab({ url: '/pages/index/index' })
    }
  }
}
</script>

<style scoped>
.publish-page {
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
  width: 80px;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 16px;
}

.save-btn.loading {
  background: var(--text-tertiary);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.content-area {
  margin-top: 60px;
  padding: 16px;
}

.attachments-section {
  margin-bottom: 16px;
}

.attachments-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 12px;
  display: block;
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.attachment-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.attachment-image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.attachment-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-file-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.file-icon-large {
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.file-name-small {
  font-size: 10px;
  color: var(--text-secondary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.attachment-delete {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.attachment-add-btn {
  aspect-ratio: 1;
  border: 2px dashed var(--border-medium);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  cursor: pointer;
}

.add-text {
  font-size: 12px;
  margin-top: 4px;
}

.uploading-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--accent-warm);
}

.cover-wrapper {
  position: relative;
  width: 100%;
}

.delete-cover-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.delete-cover-btn:active {
  background: rgba(0, 0, 0, 0.7);
}

.input-section {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-light);
  position: relative;
}

.title-input {
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  padding-bottom: 8px;
}

.content-input {
  width: 100%;
  min-height: 200px;
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.8;
}

.content-input.compact {
  min-height: 100px;
  max-height: 150px;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
  display: block;
}

.section {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-light);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  display: block;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: var(--bg-secondary);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.category-item.active {
  background: var(--accent-warm);
  color: white;
  border-color: var(--accent-warm);
}

.category-icon {
  font-size: 14px;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 40px;
  padding: 8px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--accent-warm);
  color: white;
  font-size: 13px;
  border-radius: 12px;
}

.remove-tag {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-input {
  flex: 1;
  min-width: 80px;
  font-size: 14px;
  color: var(--text-primary);
}

.hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 8px;
  display: block;
}

.visibility-select-wrapper {
  background: var(--bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.visibility-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.picker-label {
  font-size: 15px;
  color: var(--text-primary);
}

.picker-arrow {
  color: var(--text-tertiary);
}

.price-setting {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: block;
}

.price-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.currency {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent-warm);
}

.price-input {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

/* 底部操作栏 */
.footer-actions {
  margin-top: 32px;
  padding: 20px 0;
  border-top: 1px solid var(--border-light);
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: #FFEBEE;
  border-radius: 12px;
  color: #F44336;
  font-size: 15px;
  font-weight: 500;
}

.delete-btn:active {
  background: #FFCDD2;
}
</style>
