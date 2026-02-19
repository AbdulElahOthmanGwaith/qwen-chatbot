import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Plus, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface Conversation {
  id: number;
  title: string;
  updatedAt: Date;
}

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations();
    }
  }, [isAuthenticated, user]);

  const loadConversations = async () => {
    try {
      const data = await trpc.chat.getConversations.useQuery();
      setConversations(data.data || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const createNewConversation = async () => {
    try {
      // TODO: Call tRPC procedure to create new conversation
      setCurrentConversationId(null);
      setMessages([]);
      setInputValue("");
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const selectConversation = async (conversationId: number) => {
    setCurrentConversationId(conversationId);
    try {
      const data = await trpc.chat.getMessages.useQuery({ conversationId });
      setMessages(data.data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await trpc.chat.sendMessage.useMutation().mutateAsync({
        conversationId: currentConversationId || undefined,
        message: inputValue,
      });

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.aiResponse,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentConversationId(response.conversationId);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Qwen AI Chatbot</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to start chatting with our AI assistant.
          </p>
          <Button className="w-full">Log In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-card border-r border-border flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <Button
            onClick={createNewConversation}
            className="w-full gap-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentConversationId === conv.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm">{conv.title}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">Qwen AI Chatbot</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Welcome, {user?.name || "User"}
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea
          ref={scrollRef}
          className="flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-4 max-w-4xl mx-auto w-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-center">
                <div>
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Start a conversation by typing a message below.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-enter flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xl px-4 py-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm">
                        <Streamdown>{msg.content}</Streamdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-6">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
