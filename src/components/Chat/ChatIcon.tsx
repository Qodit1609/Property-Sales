import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import chatService from '../../services/chatService';
import { setUnreadCount } from '../../features/chat/chatSlice';

/**
 * ChatIcon Component
 * Displays chat icon in header with unread badge and animation
 */
const ChatIcon: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated);
  const unreadCount = useSelector((state: any) => state.chat?.unreadCount || 0);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setUnreadCount(0));
      return;
    }

    let mounted = true;
    const syncUnread = async () => {
      try {
        const summary = await chatService.getUnreadSummary();
        if (!mounted) return;
        dispatch(setUnreadCount(summary.unreadTotal));
      } catch {
        // Keep icon non-blocking even if unread API fails.
      }
    };

    syncUnread();
    const interval = setInterval(syncUnread, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    setHasUnread(unreadCount > 0);
  }, [unreadCount]);

  const handleChatClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/chat');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.button
      onClick={handleChatClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[var(--b2)] bg-[var(--white)] p-0 text-[var(--b2)] hover:bg-[var(--b2-soft)] transition-colors"
      aria-label="Open chat"
      title="Messages"
    >
      {/* Chat Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>

      {/* Unread Badge with Animation */}
      {hasUnread && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.div>
      )}

      {/* Pulse Animation when there are unread messages */}
      {hasUnread && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-red-500"
          animate={{ scale: [1, 1.2], opacity: [1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

export default ChatIcon;
