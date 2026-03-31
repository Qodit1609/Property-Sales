import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';

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
    text?: string;
    image?: {
      url: string;
      cloudinaryPublicId: string;
      caption?: string;
      width?: number;
      height?: number;
    };
    property?: {
      propertyId: string;
      title: string;
      price: number;
      location: string;
      image: string;
    };
    location?: {
      coordinates: [number, number];
      address: string;
      name: string;
    };
    file?: {
      url: string;
      name: string;
      mimeType: string;
      size: number;
    };
  };
  status: 'sent' | 'delivered' | 'read' | 'failed';
  readBy: Array<{ userId: string; readAt: Date }>;
  reactions: Map<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatUser {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  isOnline?: boolean;
  isTyping?: boolean;
}

interface UseChatReturn {
  messages: Message[];
  onlineUsers: Set<string>;
  typingUsers: Set<string>;
  loading: boolean;
  error: string | null;
  sendMessage: (content: Message['content']) => void;
  sendTyping: (isTyping: boolean) => void;
  markAsRead: () => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  isConnected: boolean;
}

/**
 * Custom hook for managing real-time chat via Socket.IO
 * Handles message sending/receiving, typing indicators, read receipts, etc.
 */
export const useChat = (conversationId: string): UseChatReturn => {
  const token = useSelector((state: any) => state.auth?.token);
  const userId = useSelector((state: any) => state.auth?.user?.id);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageQueueRef = useRef<Message[]>([]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!token || !conversationId || !userId) return;

    setLoading(true);

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      path: '/socket.io',
      query: {
        token,
      },
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✓ Socket connected:', newSocket.id);
      setIsConnected(true);
      setError(null);
      newSocket.emit('conversation:join', conversationId);
    });

    newSocket.on('disconnect', () => {
      console.log('✗ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError(error.message);
    });

    // Message events
    newSocket.on('message:new', (data) => {
      setMessages((prev) => [...prev, data.message]);
      messageQueueRef.current.push(data.message);
    });

    newSocket.on('message:sent', (data) => {
      console.log('✓ Message sent:', data.messageId);
      setLoading(false);
    });

    newSocket.on('message:edited', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, content: { ...msg.content, text: data.newText } } : msg
        )
      );
    });

    newSocket.on('message:deleted', (data) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
    });

    newSocket.on('message:reacted', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    });

    newSocket.on('message:unreacted', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    });

    // User presence events
    newSocket.on('user:online', (data) => {
      setOnlineUsers((prev) => new Set([...prev, data.userId]));
    });

    newSocket.on('user:offline', (data) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(data.userId);
        return updated;
      });
    });

    newSocket.on('user:typing', (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => new Set([...prev, data.userId]));
      } else {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(data.userId);
          return updated;
        });
      }
    });

    // Read receipt events
    newSocket.on('messages:read', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender._id === data.userId ? { ...msg, status: 'read' as const } : msg
        )
      );
    });

    // Error events
    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message);
    });

    setSocket(newSocket);
    setLoading(false);

    return () => {
      if (newSocket) {
        newSocket.emit('conversation:leave', conversationId);
        newSocket.disconnect();
      }
    };
  }, [token, conversationId, userId]);

  // Send message
  const sendMessage = useCallback(
    (content: Message['content']) => {
      if (!socket || !isConnected) {
        setError('Socket connection not available');
        return;
      }

      setLoading(true);
      socket.emit('message:send', {
        conversationId,
        content,
      });
    },
    [socket, conversationId, isConnected]
  );

  // Send typing indicator
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket) return;

      socket.emit('message:typing', {
        conversationId,
        isTyping,
      });

      // Auto-stop typing after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit('message:typing', {
            conversationId,
            isTyping: false,
          });
        }, 3000);
      }
    },
    [socket, conversationId]
  );

  // Mark messages as read
  const markAsRead = useCallback(() => {
    if (!socket) return;
    socket.emit('message:markRead', conversationId);
  }, [socket, conversationId]);

  // Edit message
  const editMessage = useCallback(
    (messageId: string, newText: string) => {
      if (!socket) return;
      socket.emit('message:edit', {
        messageId,
        newText,
        conversationId,
      });
    },
    [socket, conversationId]
  );

  // Delete message
  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!socket) return;
      socket.emit('message:delete', {
        messageId,
        conversationId,
      });
    },
    [socket, conversationId]
  );

  // Add reaction
  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!socket) return;
      socket.emit('message:react', {
        messageId,
        conversationId,
        emoji,
      });
    },
    [socket, conversationId]
  );

  // Remove reaction
  const removeReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!socket) return;
      socket.emit('message:unreact', {
        messageId,
        conversationId,
        emoji,
      });
    },
    [socket, conversationId]
  );

  return {
    messages,
    onlineUsers,
    typingUsers,
    loading,
    error,
    sendMessage,
    sendTyping,
    markAsRead,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    isConnected,
  };
};
