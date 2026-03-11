import { useState, useRef, useEffect } from "react";
import {
  sendChatMessage,
  getConversationHistory,
  saveConversationHistory,
  clearConversationHistory,
  generateMessageId,
} from "../../services/chatService";

interface ChatUIMessage extends ChatMessage {
  error?: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    const history = getConversationHistory();
    setMessages(history);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatUIMessage = {
      id: generateMessageId(),
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get assistant response
      const response = await sendChatMessage(inputValue, messages);
      const assistantMessage: ChatUIMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      saveConversationHistory(updatedMessages);
    } catch (error) {
      const errorMessage: ChatUIMessage = {
        id: generateMessageId(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
        error: true,
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      clearConversationHistory();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans">
      {/* Chat Widget */}
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-[var(--b2)] transition-all duration-300 transform ${
          isOpen
            ? "w-[90vw] sm:w-96 h-[600px] opacity-100 scale-100"
            : "w-16 h-16 opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--b1-mid)] to-[var(--b2)] text-white p-4 rounded-t-2xl flex items-center justify-between cursor-pointer">
          <div
            className="flex items-center gap-3 flex-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--b2)]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                <path d="M6 11a1 1 0 11-2 0 1 1 0 012 0zM12 11a1 1 0 11-2 0 1 1 0 012 0zM16 11a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
            {isOpen && (
              <div>
                <h3 className="font-bold text-sm">Property Assistant</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            )}
          </div>

          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Messages Container */}
        {isOpen && (
          <>
            <div className="flex-1 overflow-y-auto p-4 h-[480px] bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <svg className="w-12 h-12 text-[var(--b2)] mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">
                      Hi! Ask me anything about properties, accounts, or our platform.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 animate-fadeIn ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-[var(--b2)] text-white rounded-br-none"
                          : message.error
                          ? "bg-red-100 text-red-800 rounded-bl-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <span className="text-xs opacity-70 block mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-2 mb-4">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-3 bg-white rounded-b-2xl">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--b2)] text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[var(--b2)] hover:bg-[var(--b2)]/90 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m0-20a9.18 9.18 0 110 18.36 9.18 9.18 0 010-18.36z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>

              {/* Clear History Button */}
              {messages.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 py-1 transition"
                >
                  Clear history
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
