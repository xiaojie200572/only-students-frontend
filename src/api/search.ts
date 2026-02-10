import { get, post } from './axios'
import type { PageResult, SearchParams, Note, UserInfo } from '@/types/api.types'

// 搜索相关API
export const searchApi = {
  // 搜索笔记
  searchNotes: (params: SearchParams) => {
    return get<PageResult<Note>>('/search/notes', params)
  },

  // 搜索用户
  searchUsers: (params: { keyword: string; educationLevel?: number; isCreator?: number; page?: number; size?: number }) => {
    return get<PageResult<UserInfo>>('/search/users', params)
  },

  // 按标签搜索笔记
  searchByTag: (tag: string, page: number = 1, size: number = 20) => {
    return get<PageResult<Note>>('/search/notes/by-tag', { tag, page, size })
  },

  // 获取热门搜索关键词
  getHotKeywords: (limit: number = 10) => {
    return get<PageResult<string>>('/search/hot-keywords', { limit })
  },

  // 获取搜索建议
  getSuggestions: (prefix: string, limit: number = 10) => {
    return get<PageResult<string>>('/search/suggestions', { prefix, limit })
  }
}
