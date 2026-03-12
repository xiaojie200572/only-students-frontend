import { get } from './axios'

export interface CreatorSummary {
  id: number
  creatorId: number
  totalNotes: number
  totalViews: number
  totalComments: number
  totalFavorites: number
  totalShares: number
  totalRatings: number
  avgRating: number
  totalSubscribers: number
  todayIncome: number
  weekIncome: number
  monthIncome: number
  yearIncome: number
  totalIncome: number
  avgHeatScore: number
  weeklyRanking: number
  monthlyRanking: number
}

export interface NoteStats {
  id: number
  noteId: number
  creatorId: number
  totalViews: number
  totalFavorites: number
  totalComments: number
  totalShares: number
  avgReadingTime: number
  completionRate: number
  heatScore: number
  lastCalculatedAt: string
}

export interface DailyStats {
  id: number
  creatorId: number
  statsDate: string
  newViews: number
  newFavorites: number
  newComments: number
  newShares: number
  newSubscribers: number
  lostSubscribers: number
  orderCount: number
  orderAmount: number
  incomeAmount: number
  createdAt: string
}

export const analyticsApi = {
  // 获取创作者汇总数据
  getCreatorSummary: (creatorId: number) => {
    return get<CreatorSummary>(`/analytics/creator/${creatorId}`)
  },

  // 获取笔记统计
  getNoteStats: (noteId: number) => {
    return get<NoteStats>(`/analytics/note/${noteId}`)
  },

  // 获取创作者笔记列表
  getNotesByCreator: (creatorId: number) => {
    return get<NoteStats[]>(`/analytics/notes/creator/${creatorId}`)
  },

  // 获取日期范围统计
  getDailyStatsRange: (creatorId: number, startDate: string, endDate: string) => {
    return get<DailyStats[]>(`/analytics/daily/range/${creatorId}`, { startDate, endDate })
  },

  // 获取汇总统计数据
  getSummaryStats: (creatorId: number, startDate: string, endDate: string) => {
    return get<any>(`/analytics/daily/summary/${creatorId}`, { startDate, endDate })
  }
}
