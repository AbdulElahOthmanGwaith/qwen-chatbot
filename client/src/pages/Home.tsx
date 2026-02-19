import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Zap, Lock } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold">Qwen AI Chatbot</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
                <Button onClick={() => setLocation("/chat")}>Open Chat</Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()}>Sign In</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent">
            Intelligent Conversations Powered by Qwen
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience advanced AI conversations with Alibaba Cloud Qwen model. Chat naturally, get instant responses, and save your conversations.
          </p>
          {isAuthenticated ? (
            <Button size="lg" onClick={() => setLocation("/chat")} className="gap-2">
              <MessageSquare className="w-5 h-5" />
              Start Chatting Now
            </Button>
          ) : (
            <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="gap-2">
              Get Started
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Our Chatbot?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h4 className="text-lg font-semibold mb-2">Lightning Fast</h4>
              <p className="text-muted-foreground">
                Get instant responses powered by Alibaba Cloud cutting-edge Qwen AI model.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h4 className="text-lg font-semibold mb-2">Natural Conversations</h4>
              <p className="text-muted-foreground">
                Chat naturally with an AI that understands context and provides thoughtful responses.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h4 className="text-lg font-semibold mb-2">Secure & Private</h4>
              <p className="text-muted-foreground">
                Your conversations are securely stored and only accessible to you.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Qwen AI Chatbot. Powered by Alibaba Cloud.</p>
        </div>
      </footer>
    </div>
  );
}
