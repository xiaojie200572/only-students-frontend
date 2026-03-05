// API 基础配置
export const API_BASE_URL = 'http://localhost:8080/api'

// 请求头常量
export const HEADERS = {
  USER_ID: 'X-User-Id',
  TOKEN: 'Authorization',
  CONTENT_TYPE: 'Content-Type'
}

// 笔记可见性
export enum NoteVisibility {
  PUBLIC = 0,      // 公开
  SUBSCRIBERS = 1, // 订阅者可见
  PAID = 2         // 付费可见
}

// 笔记状态
export enum NoteStatus {
  DRAFT = 0,    // 草稿
  PUBLISHED = 1 // 已发布
}
