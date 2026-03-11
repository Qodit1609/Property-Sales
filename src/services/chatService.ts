// Chat service to interact with OpenAI API
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const SYSTEM_PROMPT = `You are a helpful assistant for a property sales application. You help users with:
1. Property listings and search help
2. Account management and dashboard navigation  
3. General FAQ about the platform
4. Information about farmhouses, agricultural land, and resort properties
5. Rent and buy options

Be concise, friendly, and provide helpful guidance. If a question is outside your scope, politely redirect to customer support.`;

export const sendChatMessage = async (
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file");
  }

  try {
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to get response from OpenAI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Chat service error:", error);
    throw error;
  }
};

// Local storage management for conversation history
const STORAGE_KEY = "chatbot_history";

export const getConversationHistory = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveConversationHistory = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save conversation history:", error);
  }
};

export const clearConversationHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear conversation history:", error);
  }
};

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
