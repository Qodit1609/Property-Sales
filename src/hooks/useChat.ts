import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import chatService from '../services/chatService';
import { addNotification, setUnreadCount } from '../features/chat/chatSlice';
import { syncUnreadSummary } from '../features/chat/chatThunks';
import { useAppDispatch } from '../store/hooks';

interface UserRef {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string | UserRef;
  receiverId: string | UserRef;
  message: string;
  messageType: 'text';
  seen: boolean;
  seenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UseChatReturn {
  messages: Message[];
  onlineUsers: Set<string>;
  typingUsers: Set<string>;
  loading: boolean;
  error: string | null;
  sendMessage: (text: string) => void;
  sendTyping: (isTyping: boolean) => void;
  markAsRead: () => void;
  isConnected: boolean;
}

/**
 * Custom hook for managing real-time chat via Socket.IO
 * Handles message sending/receiving, typing indicators, read receipts, etc.
 */
export const useChat = (conversationId: string): UseChatReturn => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: any) => state.auth?.token);
  const userId = useSelector((state: any) => state.auth?.user?._id || state.auth?.user?.id);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  const upsertMessage = useCallback((incoming: Message) => {
    setMessages((prev) => {
      if (prev.some((item) => item._id === incoming._id)) {
        return prev;
      }
      return [...prev, incoming];
    });
  }, []);

  useEffect(() => {
    if (!token || !conversationId || !userId) return;
    mountedRef.current = true;

    setLoading(true);
    setError(null);

    const fetchInitialMessages = async () => {
      try {
        const response = await chatService.getMessages(conversationId, 1, 100);
        if (mountedRef.current) {
          setMessages(response.messages);
        }
      } catch (fetchError: any) {
        if (mountedRef.current) {
          setError(fetchError?.message || 'Failed to load messages');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchInitialMessages();

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
      setIsConnected(true);
      setError(null);
      newSocket.emit('conversation:join', conversationId);
      dispatch(syncUnreadSummary());
    });

    newSocket.on('disconnect', () => setIsConnected(false));

    newSocket.on('connect_error', (error) => {
      setError(error.message);
    });

    newSocket.on('message:new', ({ message }) => {
      upsertMessage(message as Message);
    });

    newSocket.on('receiveMessage', ({ message }) => {
      upsertMessage(message as Message);
    });

    newSocket.on('newNotification', ({ notification }) => {
      dispatch(addNotification(notification));
      dispatch(syncUnreadSummary());
    });

    newSocket.on('chat:unread-count', ({ count }) => {
      dispatch(setUnreadCount(Number(count) || 0));
    });

    newSocket.on('message:sent', () => {
      setLoading(false);
    });

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

    newSocket.on('messages:read', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          (typeof msg.senderId === 'string'
            ? msg.senderId
            : msg.senderId._id) === data.userId
            ? { ...msg, seen: true, seenAt: new Date().toISOString() }
            : msg
        )
      );
    });

    newSocket.on('error', (data) => {
      setError(data.message);
    });

    setSocket(newSocket);

    return () => {
      mountedRef.current = false;
      if (newSocket) {
        newSocket.emit('conversation:leave', conversationId);
        newSocket.disconnect();
      }
    };
  }, [token, conversationId, userId, upsertMessage, dispatch]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socket || !isConnected) {
        setError('Socket connection not available');
        return;
      }
      if (!text.trim()) {
        return;
      }

      setLoading(true);
      socket.emit('sendMessage', {
        conversationId,
        message: text.trim(),
        messageType: 'text',
      });
    },
    [socket, conversationId, isConnected]
  );

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

  const markAsRead = useCallback(() => {
    if (!conversationId) return;

    if (!socket || !isConnected) {
      chatService
        .markMessagesAsSeen(conversationId)
        .then(() => dispatch(syncUnreadSummary()))
        .catch(() => undefined);
      return;
    }

    socket.emit('message:markRead', conversationId);
  }, [socket, conversationId, isConnected, dispatch]);

  return {
    messages,
    onlineUsers,
    typingUsers,
    loading,
    error,
    sendMessage,
    sendTyping,
    markAsRead,
    isConnected,
  };
};
