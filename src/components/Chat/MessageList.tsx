import React, { memo } from 'react';
import type { Message } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  onlineUsers: Set<string>;
  currentUserId: string;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, emoji: string) => void;
  onEdit: (messageId: string, newText: string) => void;
  onDelete: (messageId: string) => void;
  isLoading?: boolean;
}

const MessageList = memo(
  ({
    messages,
    onlineUsers,
    currentUserId,
    onReactionAdd,
    onReactionRemove,
    onEdit,
    onDelete,
    isLoading = false,
  }: MessageListProps) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border border-primary border-t-transparent"></div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg">No messages yet</p>
          <p className="text-sm">Start a conversation</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 pb-4">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={message.sender._id === currentUserId}
            isOnline={onlineUsers.has(message.sender._id)}
            onReactionAdd={onReactionAdd}
            onReactionRemove={onReactionRemove}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';

export default MessageList;
