import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { store } from '../store';

// Define interfaces first
export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    avatar: string;
    email: string;
  }>;
  property: {
    _id: string;
    title: string;
    price: number;
    image: string;
    location: string;
  };
  subject: string;
  status: 'active' | 'archived' | 'closed' | 'blocked';
  lastMessage: {
    text: string;
    sender: string;
    timestamp: Date;
    type: string;
  };
  unreadCount: number;
  metadata: {
    messageCount: number;
    hasImages: boolean;
    hasSharedProperty: boolean;
    hasLocationShared: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
    email: string;
  };
  content: {
    type: 'text' | 'image' | 'property' | 'location' | 'file';
    [key: string]: any;
  };
  status: 'sent' | 'delivered' | 'read' | 'failed';
  readBy: Array<{ userId: string; readAt: Date }>;
  reactions: Map<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationListResponse {
  success: boolean;
  data: {
    conversations: Conversation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface MessageListResponse {
  success: boolean;
  data: {
    messages: Message[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasMore: boolean;
    };
  };
}

/**
 * Chat Service
 * Handles all REST API calls for chat functionality
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

    // Add auth token to requests
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

  // ─────────────────────────────
  // CONVERSATION APIs
  // ─────────────────────────────

  /**
   * Create a new conversation
   */
  async createConversation(
    participantId: string,
    propertyId: string,
    subject?: string
  ): Promise<Conversation> {
    const { data } = await this.api.post('/chat/conversations', {
      participantId,
      propertyId,
      subject,
    });
    return data.data;
  }

  /**
   * Get all conversations
   */
  async getConversations(
    page: number = 1,
    limit: number = 20,
    status: string = 'active'
  ): Promise<ConversationListResponse['data']> {
    const { data } = await this.api.get('/chat/conversations', {
      params: { page, limit, status },
    });
    return data.data;
  }

  /**
   * Get single conversation details
   */
  async getConversationDetails(conversationId: string): Promise<Conversation> {
    const { data } = await this.api.get(`/chat/conversations/${conversationId}`);
    return data.data;
  }

  /**
   * Get messages for conversation
   */
  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MessageListResponse['data']> {
    const { data } = await this.api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return data.data;
  }

  /**
   * Search messages
   */
  async searchMessages(
    conversationId: string,
    query: string,
    filters?: {
      type?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ): Promise<Message[]> {
    const { data } = await this.api.get(`/chat/conversations/${conversationId}/search`, {
      params: {
        query,
        ...filters,
      },
    });
    return data.data.messages;
  }

  /**
   * Get conversation statistics
   */
  async getConversationStats(conversationId: string) {
    const { data } = await this.api.get(`/chat/conversations/${conversationId}/stats`);
    return data.data;
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: string): Promise<Conversation> {
    const { data } = await this.api.put(`/chat/conversations/${conversationId}/archive`);
    return data.data;
  }

  /**
   * Unarchive conversation
   */
  async unarchiveConversation(conversationId: string): Promise<Conversation> {
    const { data } = await this.api.put(`/chat/conversations/${conversationId}/unarchive`);
    return data.data;
  }

  /**
   * Block/Unblock user
   */
  async blockUser(conversationId: string, targetUserId: string, block: boolean) {
    const { data } = await this.api.put(`/chat/conversations/${conversationId}/block`, {
      targetUserId,
      block,
    });
    return data.data;
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await this.api.delete(`/chat/conversations/${conversationId}`);
  }
}

export default new ChatService();
