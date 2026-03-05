import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { noteApi, favoriteApi } from '@/api/note'
import { searchApi } from '@/api/search'
import type { Note, SearchParams } from '@/types/api.types'

export const useNoteStore = defineStore('note', () => {
  // 状态
  const notes = ref<Note[]>([])
  const currentNote = ref<Note | null>(null)
  const loading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const selectedCategory = ref<number | null>(null)
  const searchKeyword = ref('')

  // 计算属性
  const filteredNotes = computed(() => {
    if (!selectedCategory.value) return notes.value
    return notes.value.filter(note => note.categoryId === selectedCategory.value)
  })

  const updateFavoriteCount = (id: number, delta: number) =>{
    const note = notes.value.find(n => n.id === id)
    if (note) {
      note.favoriteCount = Math.max(0, (note.favoriteCount || 0) + delta)
    }
  }
  // 获取笔记列表（支持搜索和筛选）
  const fetchNotes = async (refresh = false, params: Partial<SearchParams> = {}) => {
    if (loading.value) return

    loading.value = true

    try {
      if (refresh) {
        currentPage.value = 1
        notes.value = []
      }

      // 构建搜索参数
      const searchParams: SearchParams = {
        page: currentPage.value,
        size: pageSize.value,
        categoryId: selectedCategory.value || undefined,
        keyword: searchKeyword.value || undefined,
        ...params
      }

      // 如果有搜索关键词，使用搜索API
      let response
      if (searchKeyword.value) {
        response = await searchApi.searchNotes(searchParams)
        if (refresh) {
          notes.value = response.list
        } else {
          notes.value.push(...response.list)
        }
        hasMore.value = response.list.length === pageSize.value
      } else {
        // 否则获取最新笔记
        response = await noteApi.getLatest(pageSize.value)
        console.log('首页获取笔记数据:', response)
        if (refresh) {
          notes.value = response
        } else {
          notes.value.push(...response)
        }
        hasMore.value = response.length === pageSize.value
      }

      currentPage.value++

    } catch (error) {
      console.error('获取笔记失败:', error)
      uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  // 选择分类
  const selectCategory = (categoryId: number | null) => {
    selectedCategory.value = categoryId
    fetchNotes(true)
  }

  // 搜索笔记
  const searchNotes = async (keyword: string) => {
    searchKeyword.value = keyword
    await fetchNotes(true)
  }

  // 获取笔记详情
  const fetchNoteDetail = async (id: number) => {
    try {
      const note = await noteApi.getById(id)
      currentNote.value = note
      return note
    } catch (error) {
      console.error('获取笔记详情失败:', error)
      uni.showToast({ title: '获取笔记详情失败', icon: 'none' })
      return null
    }
  }

  // 从本地获取笔记
  const getNoteById = (id: string): Note | undefined => {
    return notes.value.find(note => note.id === Number(id))
  }

  // 收藏笔记
  const favoriteNote = async (noteId: number) => {
    try {
      await favoriteApi.add(noteId)
      const note = notes.value.find(n => n.id === noteId)
      if (note) {
        note.favoriteCount++
      }
      uni.showToast({ title: '已收藏', icon: 'success' })
    } catch (error) {
      console.error('收藏失败:', error)
      uni.showToast({ title: '收藏失败', icon: 'none' })
    }
  }

  // 发布笔记
  const publishNote = async (noteData: any) => {
    try {
      const note = await noteApi.create(noteData)
      uni.showToast({ title: '发布成功', icon: 'success' })
      return note
    } catch (error) {
      console.error('发布笔记失败:', error)
      uni.showToast({ title: '发布失败', icon: 'none' })
      throw error
    }
  }

  return {
    notes,
    currentNote,
    filteredNotes,
    loading,
    hasMore,
    currentPage,
    selectedCategory,
    searchKeyword,
    updateFavoriteCount,
    fetchNotes,
    selectCategory,
    searchNotes,
    fetchNoteDetail,
    getNoteById,
    favoriteNote,
    publishNote
  }
})
