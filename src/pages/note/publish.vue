<template>
  <view class="publish-page">
    <view class="page-nav">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </view>
      <text class="nav-title">{{ isEdit ? '编辑笔记' : '创建笔记' }}</text>
      <view class="nav-right">
        <view
          :class="['save-btn', { loading: loading }]"
          @click="handleSave"
        >
          <text v-if="!loading">保存</text>
          <view v-else class="btn-spinner"></view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content-area">
      <!-- 封面图 -->
      <view class="cover-section">
        <view v-if="!form.coverImage" class="upload-cover" @click="chooseCover">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <text>添加封面图</text>
        </view>
        <image v-else :src="form.coverImage" class="cover-image" mode="aspectFill" @click="chooseCover"/>
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
          class="content-input"
          maxlength="5000"
        />
        <text class="char-count">{{ form.content.length }}/5000</text>
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

const noteStore = useNoteStore()

// 获取页面参数（编辑模式）
const page = getCurrentPages()[getCurrentPages().length - 1] as any
const noteId = ref<number | null>(page.options?.id ? parseInt(page.options.id) : null)
const isEdit = ref(!!noteId.value)

const form = ref({
  title: '',
  content: '',
  coverImage: '',
  categoryId: null as number | null,
  tags: [] as string[],
  visibility: 0,
  price: ''
})

const tagInput = ref('')
const loading = ref(false)
const categories = NOTE_CATEGORIES

// 如果是编辑模式，加载现有笔记数据
onMounted(async () => {
  if (isEdit.value && noteId.value) {
    try {
      loading.value = true
      const note = await noteApi.getById(noteId.value)
      form.value.title = note.title
      form.value.content = note.content
      form.value.coverImage = note.coverImage || ''
      form.value.categoryId = note.categoryId
      form.value.tags = note.tags || []
      form.value.visibility = note.visibility
      form.value.price = note.price ? String(note.price) : ''
    } catch (error) {
      console.error('加载笔记失败:', error)
      uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }
})

const chooseCover = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      form.value.coverImage = res.tempFilePaths[0]
    }
  })
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
    const noteData = {
      title: form.value.title,
      content: form.value.content,
      categoryId: form.value.categoryId,
      visibility: form.value.visibility,
      price: form.value.visibility === 2 ? parseFloat(form.value.price) : 0,
      tags: form.value.tags,
      coverImage: form.value.coverImage
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
      // 保存后跳转到"我的笔记"页面
      uni.navigateTo({ url: '/pages/user/my-notes' })
    }, 1500)
  } catch (error) {
    console.error('保存失败:', error)
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const handleDelete = () => {
  if (!isEdit.value || !noteId.value) {
    uni.showToast({ title: '新笔记无法删除', icon: 'none' })
    return
  }

  uni.showModal({
    title: '确认删除',
    content: '确定要删除这篇笔记吗？此操作不可恢复。',
    confirmColor: '#F44336',
    success: async (res) => {
      if (res.confirm) {
        try {
          await noteApi.delete(noteId.value!)
          uni.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/user/my-notes' })
          }, 1500)
        } catch (error) {
          console.error('删除失败:', error)
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

const goBack = () => {
  uni.navigateBack()
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

.cover-section {
  margin-bottom: 16px;
}

.upload-cover {
  width: 100%;
  height: 200px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-medium);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  gap: 8px;
}

.cover-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
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

.char-count {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 12px;
  color: var(--text-tertiary);
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
