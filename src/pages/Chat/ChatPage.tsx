import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';

/**
 * Chat Page Component
 * Main chat interface with conversation list and message window
 */
const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversationId || null
  );
  const [isMobileViewChat, setIsMobileViewChat] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--white)]">
      {/* Page Header */}
      <div className="border-b border-[var(--b2-soft)] bg-gradient-to-r from-[var(--b2-soft)] to-transparent px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--b1)]">Messages</h1>
            <p className="text-sm text-[var(--muted)]">
              {selectedConversation
                ? 'Connected with seller'
                : 'Start a conversation with sellers'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List - Hidden on mobile if chat is selected */}
        {!isMobileViewChat && (
          <div className="w-full sm:w-80 border-r border-[var(--b2-soft)] bg-[var(--white)] overflow-hidden flex flex-col">
            <ChatList
              selectedConversationId={selectedConversation || undefined}
              onConversationSelect={(id) => {
                setSelectedConversation(id);
                setIsMobileViewChat(true);
              }}
            />
          </div>
        )}

        {/* Chat Window - Hidden on mobile if list is showing */}
        {selectedConversation && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatWindow
              conversationId={selectedConversation}
              onBack={() => {
                setIsMobileViewChat(false);
              }}
            />
          </div>
        )}

        {/* Empty State */}
        {!selectedConversation && isMobileViewChat === false && (
          <div className="hidden sm:flex flex-1 flex-col items-center justify-center bg-[var(--b2-soft)]/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-[var(--b1)]">
              No conversation selected
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Select a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
