// 统一响应结构
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 用户相关类型
export interface UserInfo {
  id: number
  email?: string
  phone?: string
  nickname: string
  avatar?: string
  bio?: string
  educationLevel?: number
  schoolId?: number
  schoolName?: string
  isCreator: number
  followerCount?: number
  lastLoginTime?: string
  createdAt?: string
}
export interface SearchUserInfo extends UserInfo {
  isFollowing: boolean
}
export type LoginType = 'PASSWORD' | 'SMS_CODE'

// 登录请求
export interface LoginRequest {
  account: string
  loginType: LoginType
  password?: string
  smsCode?: string
  deviceId?: string
  deviceType?: number
  deviceName?: string
  ip?: string
}

// 登录响应
export interface LoginResponse {
  token: string
  userInfo: UserInfo
  expireTime: number
}

export type AccountType = 'EMAIL' | 'PHONE'

// 注册请求
export interface RegisterRequest {
  accountType: AccountType
  account: string
  smsCode: string
  password: string
  nickname: string
  educationLevel?: number
  schoolId?: number
  schoolName?: string
}

export type SendCodeType = 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD' | 'BIND'

// 发送验证码请求
export interface SendCodeRequest {
  account: string
  type: SendCodeType
}

// 更新用户信息请求
export interface UpdateUserRequest {
  nickname?: string
  avatar?: string
  bio?: string
  email?: string
  phone?: string
  educationLevel?: number
  schoolId?: number
  schoolName?: string
  verifyCode?: string
}

// 笔记相关类型
export interface Note {
  id: number
  userId: number
  title: string
  content: string
  coverImage?: string
  visibility: number
  price: number
  isFree: boolean
  originalFileId?: number
  pdfFileId?: number
  status: number
  viewCount: number
  ratingCount: number
  averageRating: number
  favoriteCount: number
  commentCount: number
  shareCount: number
  attachments?: any[] | string
  hotScore?: number
  educationLevel?: number
  schoolId?: number
  schoolName?: string
  subject?: string
  tags?: string[]
  authorNickname?: string
  authorAvatar?: string
  publishTime?: string
  createdAt: string
}

// 创建笔记请求
export interface CreateNoteRequest {
  title: string
  content: string
  visibility: number
  price?: number
  educationLevel?: number
  schoolId?: number
  subject?: string
  tags?: string[]
}

// 更新笔记请求
export interface UpdateNoteRequest {
  title?: string
  content?: string
  visibility?: number
  price?: number
  tags?: string[]
}

// 搜索参数
export interface SearchParams {
  keyword?: string
  educationLevel?: number
  priceType?: number // 0-全部 1-免费 2-付费
  sortType?: number  // 0-最新 1-最热
  page?: number
  size?: number
}

// 分页结果
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

// 消息相关类型
export interface Conversation {
  id: number
  userId?: number
  targetUserId: number

  targetNickname?: string
  targetUserAvatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  status?: number
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  receiverId: number
  content: string
  type: number
  status: number
  createdAt: string
}

// 通知类型
export interface Notification {
  id: number
  userId: number
  type: number
  title: string
  content: string
  targetId?: number
  targetType?: number
  isRead: boolean
  createdAt: string
}

// 钱包相关
export interface WalletInfo {
  id: number
  userId: number
  balance: number
  totalIncome: number
  totalWithdraw: number
  status: number
}

export interface WalletTransaction {
  id: number
  walletId: number
  type: number
  amount: number
  balance: number
  relatedId?: number
  relatedType?: string
  description?: string
  createdAt: string
}

// 订阅相关
export interface SubscriptionConfig {
  id: number
  creatorId: number
  price: number
  period: number
  description?: string
  status: number
}

export interface Subscription {
  id: number
  subscriberId: number
  creatorId: number
  creatorName?: string
  creatorAvatar?: string
  price: number
  startTime: string
  endTime: string
  status: number
}


// 文件上传接口
export interface FileUploadResult {
  fileId: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  isDuplicate: boolean;
  md5Hash: string;
  message: string;
  mimeType: string;
  originalName: string;
  code?: number; // 后端返回的 code 字段（如果有）
}