import { get, post, put, del } from './axios'
import type { Conversation, Message, Notification, Subscription, SubscriptionConfig, WalletInfo, WalletTransaction } from '@/types/api.types'

// 消息相关API
export const messageApi = {
  // 获取会话列表
  getConversations: () => {
    return get<Conversation[]>('/message/conversations')
  },

  // 获取消息历史
  getHistory: (conversationId: number, page: number = 1, size: number = 20) => {
    return get<Message[]>(`/message/history/${conversationId}`, { page, size })
  },

  // 发送消息
  send: (receiverId: number, content: string, type: number = 1) => {
    return post<Message>('/message/send', { receiverId, content, type })
  },

  // 标记已读
  markAsRead: (messageId: number) => {
    return post<void>(`/message/read/${messageId}`)
  },

  // 标记会话全部已读
  markConversationAsRead: (conversationId: number) => {
    return post<void>(`/message/conversation/${conversationId}/read-all`)
  },

  // 获取私信未读数
  getUnreadCount: () => {
    return get<number>('/message/unread-count')
  },

  // 删除会话
  deleteConversation: (conversationId: number) => {
    return del<void>(`/message/conversation/${conversationId}`)
  }
}

// 通知相关API
export const notificationApi = {
  // 获取通知列表
  getList: (page: number = 1, size: number = 20, isRead?: boolean) => {
    return get<Notification[]>('/notification/list', { page, size, isRead })
  },

  // 获取未读通知数量
  getUnreadCount: () => {
    return get<number>('/notification/unread-count')
  },

  // 标记单条已读
  markAsRead: (notificationId: number) => {
    return post<void>(`/notification/read/${notificationId}`)
  },

  // 标记全部已读
  markAllAsRead: () => {
    return post<void>('/notification/read-all')
  },

  // 删除通知
  deleteNotification: (notificationId: number) => {
    return del<void>(`/notification/${notificationId}`)
  },

  // 订阅SSE实时通知
  subscribeSSE: () => {
    // SSE需要特殊处理，这里返回EventSource实例
    const token = uni.getStorageSync('token')
    const userId = uni.getStorageSync('userId')
    const url = `http://localhost:8080/api/notification/sse/subscribe?userId=${userId}&token=${token}`
    return new EventSource(url)
  }
}

// 订阅相关API
export const subscriptionApi = {
  // 获取创作者的订阅配置
  getConfig: (creatorId: number) => {
    return get<SubscriptionConfig>(`/subscription/config/${creatorId}`)
  },

  // 订阅创作者
  subscribe: (creatorId: number) => {
    return post<Subscription>('/subscription', { creatorId })
  },

  // 取消订阅
  unsubscribe: (creatorId: number) => {
    return del<void>(`/subscription/${creatorId}`)
  },

  // 获取我的订阅列表
  getMySubscriptions: () => {
    return get<Subscription[]>('/subscription/my-subscriptions')
  },

  // 获取我的粉丝列表
  getMySubscribers: () => {
    return get<Subscription[]>('/subscription/my-subscribers')
  },

  // 获取粉丝数量
  getSubscriberCount: (creatorId: number) => {
    return get<number>(`/subscription/subscriber-count/${creatorId}`)
  },

  // 检查是否已订阅
  checkSubscription: (creatorId: number) => {
    return get<boolean>(`/subscription/check/${creatorId}`)
  },

  // 更新订阅配置（创作者使用）
  updateConfig: (data: { price: number; period?: number; description?: string }) => {
    return put<SubscriptionConfig>('/subscription/config', data)
  }
}

// 钱包相关API
export const walletApi = {
  // 获取钱包信息
  getWallet: () => {
    return get<WalletInfo>('/payment/wallet')
  }
}

// 支付相关API
export const paymentApi = {
  // 创建订单
  createOrder: (targetType: number, targetId: number, amount: number, payChannel: number = 1) => {
    return post<any>('/payment/order', { targetType, targetId, amount, payChannel })
  },

  // 查询订单详情
  getOrderByNo: (orderNo: string) => {
    return get<any>(`/payment/order/${orderNo}`)
  },

  // 获取我的订单
  getMyOrders: () => {
    return get<any[]>('/payment/my-orders')
  },

  // 检查是否已购买笔记
  checkPurchased: (noteId: number) => {
    return get<boolean>(`/payment/check-purchased/${noteId}`)
  }
}

// 提现相关API
export const withdrawalApi = {
  // 申请提现
  apply: (amount: number, accountInfo: any) => {
    return post<void>('/withdrawal/apply', { amount, ...accountInfo })
  },

  // 获取提现列表
  getList: (page: number = 1, size: number = 20) => {
    return get<any[]>('/withdrawal/list', { page, size })
  },

  // 获取提现详情
  getDetail: (applicationId: number) => {
    return get<any>(`/withdrawal/${applicationId}`)
  },

  // 取消提现申请
  cancel: (applicationId: number) => {
    return del<void>(`/withdrawal/${applicationId}`)
  }
}
