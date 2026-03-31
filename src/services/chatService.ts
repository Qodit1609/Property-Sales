import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { store } from '../store';

interface UserRef {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  propertyId:
    | string
    | {
        _id: string;
        title: string;
        price?: number;
        location?: string;
      };
  buyerId:
    | string
    | UserRef;
  sellerId:
    | string
    | UserRef;
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
  unreadCountByRole: {
    buyer: number;
    seller: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId:
    | string
    | UserRef;
  receiverId:
    | string
    | UserRef;
  message: string;
  messageType: 'text';
  seen: boolean;
  seenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'message';
  title: string;
  referenceId:
    | string
    | Conversation;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UnreadSummary {
  unreadMessages: number;
  unreadNotifications: number;
  unreadTotal: number;
}

export interface ConversationUI {
  _id: string;
  otherParticipant: UserRef | null;
  property: {
    _id: string;
    title: string;
    price?: number;
    location?: string;
  };
  participants: string[];
  buyerId: string | UserRef;
  sellerId: string | UserRef;
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
  unreadCountByRole: {
    buyer: number;
    seller: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const toUserId = (user: any): string => String(user?._id || user?.id || '');

const toUserRef = (value: string | UserRef): UserRef | null => {
  if (!value || typeof value === 'string') {
    return null;
  }
  return value;
};

const toPropertyRef = (value: Conversation['propertyId']) => {
  if (typeof value === 'string') {
    return {
      _id: value,
      title: 'Property',
    };
  }
  return value;
};

const toConversationUI = (conversation: Conversation, currentUserId: string): ConversationUI => {
  const buyer = toUserRef(conversation.buyerId);
  const seller = toUserRef(conversation.sellerId);
  const otherParticipant =
    buyer && buyer._id !== currentUserId ? buyer : seller && seller._id !== currentUserId ? seller : null;

  return {
    _id: conversation._id,
    otherParticipant,
    participants: conversation.participants,
    buyerId: conversation.buyerId,
    sellerId: conversation.sellerId,
    property: toPropertyRef(conversation.propertyId),
    lastMessage: conversation.lastMessage,
    lastMessageAt: conversation.lastMessageAt,
    unreadCount: conversation.unreadCount,
    unreadCountByRole: conversation.unreadCountByRole,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
};

export interface MessageListResponse {
  conversationId: string;
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MarkSeenResponse {
  conversationId: string;
  markedCount: number;
  seenAt: string;
}

interface CreateOrGetConversationResponse extends ApiResponse<Conversation> {}
interface ConversationListApiResponse extends ApiResponse<ConversationListResponse> {}
interface MessageListApiResponse extends ApiResponse<MessageListResponse> {}
interface NotificationsApiResponse extends ApiResponse<NotificationListResponse> {}
interface NotificationApiResponse extends ApiResponse<Notification> {}
interface MarkAllNotificationApiResponse extends ApiResponse<{ updatedCount: number; readAt: string }> {}
interface UnreadSummaryApiResponse extends ApiResponse<UnreadSummary> {}
interface MarkSeenApiResponse extends ApiResponse<MarkSeenResponse> {}

export interface MessageListWithUI {
  messages: Message[];
  pagination: MessageListResponse['pagination'];
}

export interface ConversationListWithUI {
  conversations: ConversationUI[];
  pagination: ConversationListResponse['pagination'];
}

export interface SendMessagePayload {
  conversationId: string;
  message: string;
  messageType?: 'text';
}

/**
 * Chat Service
 * Handles REST API calls for chat and notifications
 */
class ChatService {
  private api: AxiosInstance;

  constructor() {
    const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const apiBaseUrl = normalizedBaseUrl.endsWith('/api')
      ? normalizedBaseUrl
      : `${normalizedBaseUrl}/api`;

    this.api = axios.create({
      baseURL: apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token =
        localStorage.getItem('auth_token') ||
        localStorage.getItem('token') ||
        store.getState().auth?.token ||
        null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.url?.startsWith('/')) {
        config.url = config.url.slice(1);
      }
      return config;
    });
  }

  getCurrentUserId(): string {
    const authUser = store.getState().auth?.user;
    return toUserId(authUser);
  }

  async createConversation(propertyId: string): Promise<ConversationUI> {
    const response = await this.api.post<CreateOrGetConversationResponse>('/chat/conversations', {
      propertyId,
    });
    return toConversationUI(response.data.data, this.getCurrentUserId());
  }

  async getConversations(
    page: number = 1,
    limit: number = 20
  ): Promise<ConversationListWithUI> {
    const response = await this.api.get<ConversationListApiResponse>('/chat/conversations', {
      params: { page, limit },
    });

    return {
      conversations: response.data.data.conversations.map((conversation: Conversation) =>
        toConversationUI(conversation, this.getCurrentUserId())
      ),
      pagination: response.data.data.pagination,
    };
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MessageListWithUI> {
    const response = await this.api.get<MessageListApiResponse>(
      `/chat/conversations/${conversationId}/messages`,
      {
        params: { page, limit },
      }
    );

    return {
      messages: response.data.data.messages,
      pagination: response.data.data.pagination,
    };
  }

  async markMessagesAsSeen(conversationId: string): Promise<MarkSeenResponse> {
    const response = await this.api.patch<MarkSeenApiResponse>(
      `/chat/conversations/${conversationId}/seen`
    );
    return response.data.data;
  }

  async getNotifications(
    page: number = 1,
    limit: number = 20
  ): Promise<NotificationListResponse> {
    const response = await this.api.get<NotificationsApiResponse>('/chat/notifications', {
      params: { page, limit },
    });
    return response.data.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    const response = await this.api.patch<NotificationApiResponse>(
      `/chat/notifications/${notificationId}/read`
    );
    return response.data.data;
  }

  async markAllNotificationsAsRead(): Promise<{ updatedCount: number; readAt: string }> {
    const response = await this.api.patch<MarkAllNotificationApiResponse>(
      '/chat/notifications/read-all'
    );
    return response.data.data;
  }

  async getUnreadSummary(): Promise<UnreadSummary> {
    const response = await this.api.get<UnreadSummaryApiResponse>('/chat/unread-summary');
    return response.data.data;
  }
}

export default new ChatService();
