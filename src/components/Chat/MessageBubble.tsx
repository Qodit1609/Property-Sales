import React, { memo, useState } from 'react';
import type { Message } from '../../hooks/useChat';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble = memo(
  ({ message, isOwn }: MessageBubbleProps) => {
    const [showActions, setShowActions] = useState(false);
    const senderName = typeof message.senderId === 'string' ? 'User' : message.senderId.name;

    const renderContent = () => {
      switch (message.messageType) {
        case 'text':
        default:
          return <p className="text-sm break-words">{message.message}</p>;
      }
    };

    return (
      <div
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div
          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-primary text-white rounded-br-none'
              : 'bg-gray-200 text-gray-900 rounded-bl-none'
          }`}
        >
          {!isOwn && (
            <p className="text-xs font-semibold mb-1 opacity-75">{senderName}</p>
          )}

          {renderContent()}

          {/* Timestamp & Status */}
          <div className={`flex gap-2 items-center mt-1 text-xs ${isOwn ? 'opacity-75' : 'opacity-60'}`}>
            <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
            {isOwn && (
              <span>{message.seen ? '✓✓' : '✓'}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 ml-2">
            <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">text</div>
          </div>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
