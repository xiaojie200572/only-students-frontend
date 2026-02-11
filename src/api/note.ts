import { get, post, put, del } from './axios'
import type {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  PageResult
} from '@/types/api.types'

// 笔记相关API
export const noteApi = {
  // 创建笔记
  create: (data: CreateNoteRequest) => {
    return post<Note>('/note', data)
  },

  // 获取笔记详情
  getById: (noteId: number) => {
    return get<Note>(`/note/${noteId}`)
  },

  // 更新笔记
  update: (noteId: number, data: UpdateNoteRequest) => {
    return put<Note>(`/note/${noteId}`, data)
  },

  // 删除笔记
  delete: (noteId: number) => {
    return del<void>(`/note/${noteId}`)
  },

  // 发布笔记
   publish: (noteId: number) => {
    return post<void>(`/note/${noteId}/publish`, {})
  },

  // 获取热门笔记
  getHot: (limit: number = 20) => {
    return get<Note[]>('/note/hot', { limit })
  },

  // 获取最新笔记
  getLatest: (limit: number = 20) => {
    return get<Note[]>('/note/latest', { limit })
  },

  // 获取用户笔记列表
  getByUserId: (userId: number) => {
    return get<Note[]>(`/note/user/${userId}`)
  },

  // 获取我的笔记
  getMyNotes: () => {
    return get<Note[]>('/note/my-notes')
  }
}

// 收藏相关API
export const favoriteApi = {
  // 收藏笔记
  add: (noteId: number) => {
    return post<void>(`/favorite/${noteId}`)
  },

  // 取消收藏
  remove: (noteId: number) => {
    return del<void>(`/favorite/${noteId}`)
  },

  // 检查是否已收藏
  check: (noteId: number) => {
    return get<boolean>(`/favorite/check/${noteId}`)
  },

  // 获取笔记收藏数
  count: (noteId: number) => {
    return get<number>(`/favorite/count/${noteId}`)
  },

  // 获取我的收藏列表
  getMyFavorites: () => {
    return get<any[]>('/favorite/my')
  }
}

// 评分相关API（1-5星评分）
export const ratingApi = {
  // 评分笔记（score: 1-5）
  rate: (noteId: number, score: number) => {
    return post<void>(`/rating/${noteId}`, { score })
  },

  // 获取笔记平均评分
  getAverage: (noteId: number) => {
    return get<number>(`/rating/average/${noteId}`)
  },

  // 获取笔记评分人数
  getCount: (noteId: number) => {
    return get<number>(`/rating/count/${noteId}`)
  },

  // 获取我对笔记的评分
  getMyRating: (noteId: number) => {
    return get<number>(`/rating/my/${noteId}`)
  },

  // 获取我的所有评分
  getMyRatings: () => {
    return get<any[]>('/rating/my')
  }
}

// 分享相关API
export const shareApi = {
  // 创建分享
  create: (noteId: number) => {
    return post<{shareCode: string}>(`/share/${noteId}`)
  },

  // 根据分享码获取分享信息
  getByCode: (shareCode: string) => {
    return get<any>(`/share/code/${shareCode}`)
  },

  // 记录分享点击
  click: (shareCode: string) => {
    return post<void>(`/share/click/${shareCode}`)
  },

  // 获取笔记分享数
  getCount: (noteId: number) => {
    return get<number>(`/share/count/${noteId}`)
  },

  // 获取我的分享列表
  getMyShares: () => {
    return get<any[]>('/share/my')
  }
}

// 评论相关API
export const commentApi = {
  // 发表评论
  create: (noteId: number, content: string, parentId?: number) => {
    return post<any>('/comment', { noteId, content, parentId })
  },

  // 删除评论
  delete: (commentId: number) => {
    return del<void>(`/comment/${commentId}`)
  },

  // 获取笔记评论列表
  getByNoteId: (noteId: number, page: number = 1, size: number = 20) => {
    return get<PageResult<any>>(`/comment/note/${noteId}`, { page, size })
  },

  // 点赞评论
  likeComment: (commentId: number) => {
    return post<void>(`/comment/${commentId}/like`)
  },

  // 取消点赞评论
  unlikeComment: (commentId: number) => {
    return del<void>(`/comment/${commentId}/like`)
  },

  // 获取评论数量
  getCount: (noteId: number) => {
    return get<number>(`/comment/count/${noteId}`)
  }
}

// 举报相关API
export const reportApi = {
  // 提交举报
  submit: (targetType: number, targetId: number, reason: string, description?: string) => {
    return post<void>('/report/submit', { targetType, targetId, reason, description })
  },

  // 获取我的举报列表
  getMyReports: () => {
    return get<any[]>('/report/my')
  }
}
