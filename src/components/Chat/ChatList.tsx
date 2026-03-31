import React, { memo, useEffect, useState } from 'react';
import type { Conversation } from '../../services/chatService';
import chatService from '../../services/chatService';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  onConversationSelect: (conversationId: string, conversation: Conversation) => void;
  selectedConversationId?: string;
}

const ChatList = memo(({ onConversationSelect, selectedConversationId }: ChatListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations(1, 50);
        setConversations(data.conversations);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    // Refresh every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
        <button className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
          Retry
        </button>
      </div>
    );
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participants.some(
        (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      conv.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg className="w-12 h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => onConversationSelect(conv._id, conv)}
                className={`w-full px-4 py-3 text-left transition border-l-4 ${
                  selectedConversationId === conv._id
                    ? 'bg-primary/10 border-l-primary'
                    : 'hover:bg-gray-50 border-l-transparent'
                }`}
              >
                {/* Conversation item */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <img
                    src={
                      conv.participants.find((p) => p._id !== localStorage.getItem('userId'))
                        ?.avatar || 'https://via.placeholder.com/40'
                    }
                    alt="user"
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {conv.participants.find((p) => p._id !== localStorage.getItem('userId'))
                          ?.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(conv.lastMessage?.timestamp), {
                          addSuffix: false,
                        })}
                      </span>
                    </div>

                    {/* Property title */}
                    <p className="text-xs text-gray-600 mb-1 truncate">{conv.property.title}</p>

                    {/* Last message preview */}
                    <p className="text-xs text-gray-600 truncate">{conv.lastMessage?.text}</p>
                  </div>

                  {/* Unread badge */}
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

ChatList.displayName = 'ChatList';

export default ChatList;
