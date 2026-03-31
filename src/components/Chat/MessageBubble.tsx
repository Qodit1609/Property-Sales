import React, { memo, useState } from 'react';
import type { Message } from '../../hooks/useChat';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isOnline: boolean;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, emoji: string) => void;
  onEdit: (messageId: string, newText: string) => void;
  onDelete: (messageId: string) => void;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

const MessageBubble = memo(
  ({
    message,
    isOwn,
    isOnline,
    onReactionAdd,
    onReactionRemove,
    onEdit,
    onDelete,
  }: MessageBubbleProps) => {
    const [showActions, setShowActions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editText, setEditText] = useState(
      message.content.type === 'text' ? (message.content.text ?? '') : ''
    );

    const handleEditSubmit = () => {
      if (editText.trim()) {
        onEdit(message._id, editText);
        setEditMode(false);
      }
    };

    const renderContent = () => {
      switch (message.content.type) {
        case 'text':
          if (editMode) {
            return (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-3 py-1 text-xs rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    Save
                  </button>
                </div>
              </div>
            );
          }
          return <p className="text-sm break-words">{message.content.text}</p>;

        case 'image':
          if (!message.content.image) {
            return <p className="text-sm text-gray-500">[image unavailable]</p>;
          }
          return (
            <div className="space-y-2">
              <img
                src={message.content.image.url}
                alt="shared"
                className="max-w-xs rounded-lg"
              />
              {message.content.image.caption && (
                <p className="text-xs text-gray-600">{message.content.image.caption}</p>
              )}
            </div>
          );

        case 'property':
          if (!message.content.property) {
            return <p className="text-sm text-gray-500">[property unavailable]</p>;
          }
          return (
            <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
              <img
                src={message.content.property.image}
                alt={message.content.property.title}
                className="w-full h-32 object-cover rounded"
              />
              <h4 className="font-semibold mt-2 text-sm truncate">
                {message.content.property.title}
              </h4>
              <p className="text-primary font-bold text-sm">
                ₹{message.content.property.price?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">{message.content.property.location}</p>
            </div>
          );

        case 'location':
          if (!message.content.location) {
            return <p className="text-sm text-gray-500">[location unavailable]</p>;
          }
          return (
            <div className="space-y-2">
              <a
                href={`https://maps.google.com?q=${message.content.location.coordinates[1]},${message.content.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm flex items-center gap-1"
              >
                📍 {message.content.location.address}
              </a>
              <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-600">📍 Location</span>
              </div>
            </div>
          );

        default:
          return <p className="text-sm text-gray-500">[{message.content.type}]</p>;
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
            <p className="text-xs font-semibold mb-1 opacity-75">{message.sender.name}</p>
          )}

          {renderContent()}

          {/* Reactions */}
          {message.reactions && message.reactions.size > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-opacity-20 border-white">
              {Array.from(message.reactions.entries()).map(([emoji, userIds]) => (
                <span
                  key={emoji}
                  className="inline-flex items-center gap-1 text-xs bg-black bg-opacity-20 px-2 py-1 rounded-full cursor-pointer hover:bg-opacity-30"
                  onClick={() => {
                    if (userIds.includes(message.sender._id)) {
                      onReactionRemove(message._id, emoji);
                    } else {
                      onReactionAdd(message._id, emoji);
                    }
                  }}
                >
                  {emoji} {userIds.length}
                </span>
              ))}
            </div>
          )}

          {/* Timestamp & Status */}
          <div className={`flex gap-2 items-center mt-1 text-xs ${isOwn ? 'opacity-75' : 'opacity-60'}`}>
            <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
            {isOwn && (
              <span>
                {message.status === 'read' && '✓✓'}
                {message.status === 'delivered' && '✓✓'}
                {message.status === 'sent' && '✓'}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 ml-2">
            {/* Emoji Reactions */}
            <div className="flex gap-1 bg-white border border-gray-300 rounded-lg p-1 shadow-lg">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onReactionAdd(message._id, emoji)}
                  className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center text-sm"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Edit/Delete buttons */}
            {isOwn && (
              <div className="flex gap-1">
                {message.content.type === 'text' && (
                  <button
                    onClick={() => setEditMode(true)}
                    title="Edit"
                    className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center text-sm"
                  >
                    ✏️
                  </button>
                )}
                <button
                  onClick={() => onDelete(message._id)}
                  title="Delete"
                  className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center text-sm"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
