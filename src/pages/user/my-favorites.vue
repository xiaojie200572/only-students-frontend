<template>
  <view class="favorites-page">
    <view class="page-nav">
      <text class="nav-title">收藏</text>
    </view>

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

    <!-- 新建收藏夹弹窗 -->
    <view v-if="showNewFolderModal" class="folder-modal-mask" @click="closeNewFolderModal">
      <view class="folder-modal" @click.stop>
        <view class="folder-modal-title">新建收藏夹</view>
        <input 
          v-model="newFolderName" 
          class="folder-input" 
          placeholder="请输入收藏夹名称"
          maxlength="20"
        />
        <view class="folder-modal-actions">
          <text class="folder-btn-cancel" @click="closeNewFolderModal">取消</text>
          <text class="folder-btn-confirm" @click="createNewFolder">确定</text>
        </view>
      </view>
    </view>

    <!-- 文件夹选择弹窗 -->
    <view v-if="showFolderSelector" class="folder-modal-mask" @click="closeFolderSelector">
      <view class="folder-modal-panel" @click.stop>
        <view class="folder-modal-header">
          <text class="folder-modal-title">{{ movingFavoriteItem ? '移动到' : '选择收藏夹' }} ({{ folders.length }})</text>
          <view class="folder-modal-close" @click="closeFolderSelector">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </view>
        </view>
        <scroll-view scroll-y class="folder-modal-list">
          <view 
            v-for="folder in folders" 
            :key="folder.id"
            class="folder-modal-item"
            :class="{ active: currentFolderId === folder.id }"
            @click="selectFolder(folder)"
          >
            <view class="folder-modal-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </view>
            <text class="folder-modal-name">{{ folder.name }}</text>
            <text class="folder-modal-count">{{ folder.count }}条</text>
            <view class="folder-actions">
              <view v-if="folder.id !== null" class="delete-btn" @click="deleteFolder(folder, $event)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </view>
              <view v-if="currentFolderId === folder.id" class="folder-modal-check">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 收藏夹工具栏 -->
    <view class="folder-toolbar">
      <view class="folder-selector" @click="openFolderSelector">
        <svg class="folder-icon-small" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        <text class="current-folder">{{ currentFolderName }}</text>
        <svg class="arrow-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </view>
      <view class="divider">|</view>
      <view class="new-folder-btn" @click="openNewFolderModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <text>新建收藏夹</text>
      </view>
    </view>

    <scroll-view scroll-y class="content-area">
      <view v-if="loading && favorites.length === 0" class="loading-state">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <view v-else-if="favorites.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <text class="empty-title">暂无收藏</text>
        <text class="empty-desc">收藏感兴趣的笔记，方便以后查看</text>
        <view class="empty-action" @click="goToHome">去浏览</view>
      </view>

      <view v-else class="favorites-list">
        <view
          v-for="item in favorites"
          :key="item.id"
          class="favorite-item"
        >
          <view class="note-content" @click="handleNoteClick(item)">
            <view class="note-header">
              <text class="note-title">{{ item.title || '无标题' }}</text>
              <view class="more-btn" @click.stop="toggleItemMenu(item.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="20" y2="12"/>
                  <line x1="4" y1="18" x2="20" y2="18"/>
                </svg>
              </view>
            </view>
            
            <view class="note-meta">
              <view class="note-author">
                <image
                  v-if="item.authorAvatar"
                  :src="item.authorAvatar"
                  class="author-avatar"
                  mode="aspectFill"
                />
                <text class="author-name">{{ item.authorNickname || '未知作者' }}</text>
              </view>
              <view class="note-stats">
                <view class="stat-item">
                  <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <text>{{ formatNumber(item.viewCount || 0) }}</text>
                </view>
                <view class="stat-item">
                  <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  <text>{{ formatNumber(item.favoriteCount || 0) }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 操作菜单 -->
          <view v-if="activeMenuId === item.id" class="item-menu">
            <view class="menu-item" @click.stop="handleMoveFolder(item)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <text>移动</text>
            </view>
            <view class="menu-item delete" @click.stop="confirmCancelFavorite(item)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <text>删除</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部导航 -->
    <TabBar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { get, post } from '@/api'
import { favoriteApi } from '@/api/note'
import TabBar from '@/components/TabBar.vue'
import CustomModal from '@/components/CustomModal.vue'

// 收藏夹相关
interface Folder {
  id: number | string | null
  name: string
  count: number
  isDefault?: number
}

const folders = ref<Folder[]>([])
const currentFolderId = ref<number | string | null>(null)
const showFolderSelector = ref(false)
const showNewFolderModal = ref(false)
const newFolderName = ref('')

// 笔记操作菜单
const activeMenuId = ref<number | null>(null)
const movingFavoriteItem = ref<any>(null)

// 切换操作菜单
const toggleItemMenu = (id: number) => {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

// 移动收藏夹
const handleMoveFolder = (item: any) => {
  activeMenuId.value = null
  movingFavoriteItem.value = item
  loadFolders()
  showFolderSelector.value = true
}

// 选择收藏夹（复用选择弹窗）
const selectFolder = (folder: Folder) => {
  // 如果是移动模式
  if (movingFavoriteItem.value) {
    selectFolderForMove(folder)
    return
  }
  
  // 否则是切换收藏夹
  currentFolderId.value = folder.id
  closeFolderSelector()
  loadFavorites()
}

// 移动收藏到指定收藏夹
const selectFolderForMove = async (folder: Folder) => {
  if (!movingFavoriteItem.value) return
  
  const folderId = folder.id as number
  const favoriteItem = movingFavoriteItem.value
  
  try {
    await favoriteApi.moveToFolderByNoteId(favoriteItem.noteId, folderId)
    uni.showToast({ title: '已移动到 ' + folder.name, icon: 'success' })
    closeFolderSelector()
    // 刷新当前收藏列表
    loadFavorites()
  } catch (error) {
    console.error('移动收藏失败:', error)
    uni.showToast({ title: '移动失败', icon: 'none' })
  }
  
  movingFavoriteItem.value = null
}

const currentFolderName = computed(() => {
  const folder = folders.value.find(f => f.id === currentFolderId.value)
  return folder?.name || '全部'
})

const favorites = ref<any[]>([])
const loading = ref(false)

// 加载收藏夹列表
const loadFolders = async () => {
  try {
    const res = await favoriteApi.getFolders()
    console.log('loadFolders返回:', res)
    folders.value = res || []
    console.log('folders.value:', folders.value)
    const allFolder = folders.value.find(f => f.id === null)
    currentFolderId.value = allFolder?.id ?? null
  } catch (error) {
    console.error('加载收藏夹失败:', error)
  }
}

// 打开收藏夹选择器
const openFolderSelector = async () => {
  await loadFolders()
  showFolderSelector.value = true
}

// 关闭收藏夹选择器
const closeFolderSelector = () => {
  showFolderSelector.value = false
  movingFavoriteItem.value = null
}

// 打开新建收藏夹弹窗
const openNewFolderModal = () => {
  newFolderName.value = ''
  showNewFolderModal.value = true
}

// 关闭新建收藏夹弹窗
const closeNewFolderModal = () => {
  showNewFolderModal.value = false
  newFolderName.value = ''
}

// 创建新收藏夹
const createNewFolder = async () => {
  if (!newFolderName.value.trim()) {
    uni.showToast({ title: '请输入收藏夹名称', icon: 'none' })
    return
  }
  
  try {
    await favoriteApi.createFolder(newFolderName.value.trim())
    // 重新加载收藏夹列表
    await loadFolders()
    
    uni.showToast({ title: '创建成功', icon: 'success' })
    closeNewFolderModal()
  } catch (error) {
    uni.showToast({ title: '创建失败', icon: 'none' })
  }
}

// 删除收藏夹
const deleteFolder = async (folder: Folder, event: Event) => {
  event.stopPropagation()
  
  if (folder.id === null) {
    uni.showToast({ title: '默认收藏夹不能删除', icon: 'none' })
    return
  }
  
  const confirm = await showModal({
    title: '删除收藏夹',
    content: `确定删除收藏夹"${folder.name}"吗？删除后其中的笔记不会被取消收藏。`,
    confirmText: '删除',
    confirmColor: '#ff4d4f'
  })
  
  if (!confirm) return
  
  try {
    await favoriteApi.deleteFolder(folder.id as number)
    // 从列表中移除
    const index = folders.value.findIndex(f => f.id === folder.id)
    if (index > -1) {
      folders.value.splice(index, 1)
    }
    // 如果删除的是当前选中的收藏夹，切换到"全部"
    if (currentFolderId.value === folder.id) {
      currentFolderId.value = null
      loadFavorites()
    }
    uni.showToast({ title: '删除成功', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: '删除失败', icon: 'none' })
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
let currentFavoriteItem: any = null

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

onMounted(() => {
  loadFolders()
  loadFavorites()
})

const loadFavorites = async () => {
  loading.value = true
  try {
    const folderId = currentFolderId.value === null ? undefined : currentFolderId.value as number
    const res = await favoriteApi.getMyFavorites(folderId)
    favorites.value = res || []
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const formatTime = (time: string): string => {
  const date = new Date(time)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

// 格式化数字（超过1000显示为1k）
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const goBack = () => {
  uni.navigateBack()
}

const goToHome = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}

const goToNote = (noteId: number) => {
  uni.navigateTo({ url: `/pages/note/detail?id=${noteId}` })
}

const confirmCancelFavorite = async (item: any) => {
  currentFavoriteItem = item
  const confirmed = await showModal({
    title: '取消收藏',
    content: `确定要取消收藏"${item.title || '该笔记'}"吗？`,
    confirmColor: '#F44336'
  })
  
  if (confirmed) {
    try {
      await favoriteApi.remove(item.noteId)
      favorites.value = favorites.value.filter(fav => fav.noteId !== item.noteId)
      uni.showToast({ title: '已取消收藏', icon: 'success' })
    } catch (error) {
      uni.showToast({ title: '操作失败', icon: 'none' })
    }
  }
}

// 检查笔记是否失效（标题和作者信息都为空）
const isNoteInvalid = (item: any): boolean => {
  return !item.title && !item.authorNickname
}

// 处理笔记点击
const handleNoteClick = (item: any) => {
  if (isNoteInvalid(item)) {
    showInvalidModal()
    return
  }
  goToNote(item.noteId)
}

// 显示失效提示弹窗
const showInvalidModal = async () => {
  await showModal({
    title: '',
    content: '该笔记已失效',
    showCancel: false,
    confirmText: '知道了'
  })
}
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: calc(48px + env(safe-area-inset-bottom));
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
  justify-content: center;
  border-bottom: 1px solid var(--border-light);
  z-index: 100;
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.content-area {
  margin-top: 60px;
  height: calc(100vh - 60px - 52px - env(safe-area-inset-bottom));
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.empty-action {
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-coral));
  color: white;
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
}

.favorites-list {
  padding: 12px;
}

.favorite-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-soft);
  transition: all var(--transition-medium);
  position: relative;
}

.favorite-item:active {
  transform: scale(0.98);
}

.note-content {
  flex: 1;
  min-width: 0;
}

.note-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.note-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.more-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.item-menu {
  position: absolute;
  right: 12px;
  top: 40px;
  background: var(--bg-card);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 10;
  overflow: hidden;
}

.item-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 12px;
  width: 10px;
  height: 10px;
  background: var(--bg-card);
  transform: rotate(45deg);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-primary);
}

.menu-item:active {
  background: var(--bg-secondary);
}

.menu-item.delete {
  color: #ff4d4f;
}

.delete-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  flex-shrink: 0;
  border-radius: 50%;
  transition: all 0.2s;
}

.delete-btn:active {
  background: var(--bg-secondary);
  color: #F44336;
}

.note-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.note-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 12px;
  color: var(--text-secondary);
}

.note-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.stat-icon {
  width: 14px;
  height: 14px;
}

/* 收藏夹工具栏 */
.folder-toolbar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  margin-top: 60px;
}

.folder-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border-light);
}

.folder-icon-small {
  color: var(--accent-warm);
}

.current-folder {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.arrow-down {
  color: var(--text-tertiary);
}

.divider {
  margin: 0 12px;
  color: var(--border-medium);
}

.new-folder-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  color: var(--accent-warm);
  font-size: 14px;
  font-weight: 500;
}

.new-folder-btn:active {
  opacity: 0.7;
}

/* 新建收藏夹弹窗 */
.folder-modal-mask {
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

.folder-modal {
  width: 300px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
}

.folder-modal-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 16px;
}

.folder-input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-primary);
  background: var(--bg-primary);
  margin-bottom: 20px;
}

.folder-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.folder-btn-cancel {
  font-size: 15px;
  color: var(--text-secondary);
  padding: 8px 16px;
}

.folder-btn-confirm {
  font-size: 15px;
  color: var(--accent-warm);
  font-weight: 600;
  padding: 8px 16px;
}

/* 文件夹选择弹窗 */
.folder-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.folder-modal-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border-radius: 20px 20px 0 0;
  max-height: 60vh;
  min-height: 300px;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  padding-bottom: env(safe-area-inset-bottom);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.folder-modal-header {
  position: sticky;
  top: 0;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.folder-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.folder-modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.folder-modal-list {
  max-height: 50vh;
  height: 150px;
  padding: 8px 0;
}

.folder-modal-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  gap: 12px;
}

.folder-modal-item:active {
  background: var(--bg-secondary);
}

.folder-modal-item.active {
  background: var(--bg-secondary);
}

.folder-modal-icon {
  color: var(--accent-warm);
}

.folder-modal-name {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

.folder-modal-count {
  font-size: 13px;
  color: var(--text-tertiary);
}

.folder-modal-check {
  color: var(--accent-warm);
}

.folder-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--text-tertiary);
}

.delete-btn:active {
  color: var(--accent-warm);
}

/* 调整内容区域 */
.content-area {
  margin-top: 0;
  height: calc(100vh - 60px - 52px - 52px - env(safe-area-inset-bottom));
}
</style>
