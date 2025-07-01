"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
import { getAIResponse } from '@/lib/actions/ai.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bot, User, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatBubble = ({ role, content }: Message) => {
  const isUser = role === 'user';
  return (
    <div className={cn("flex items-start gap-3", isUser && "justify-end")}>
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot size={20} />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg",
          "prose prose-sm prose-p:my-0 prose-ul:my-0 prose-ol:my-0",
          isUser
            ? "bg-primary text-primary-foreground prose-invert"
            : "bg-muted"
        )}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback>
            <User size={20} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

const TypingIndicator = () => (
    <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot size={20} />
            </AvatarFallback>
        </Avatar>
        <div className="p-3 rounded-lg bg-muted flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-pulse"></span>
        </div>
    </div>
);


export function AIChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');

    startTransition(async () => {
      const result = await getAIResponse(newMessages.map(m => ({ role: m.role, content: m.content })));
      
      const responseContent = result.response || result.error || "Maaf, terjadi kesalahan.";
      const assistantMessage: Message = { role: 'assistant', content: responseContent };
      setMessages(prev => [...prev, assistantMessage]);
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto flex flex-col shadow-2xl shadow-primary/5">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Konsultasi dengan NutriBot AI</CardTitle>
        <CardDescription>Tanyakan apa saja tentang nutrisi, paket makanan, atau tips hidup sehat!</CardDescription>
      </CardHeader>
      
      <CardContent 
        ref={chatContainerRef} 
        className="flex-1 h-[50vh] overflow-y-auto p-6 space-y-6 border-y"
      >
        {messages.length === 0 && !isPending && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot size={48} className="mb-4" />
                <p className="font-medium">NutriBot siap membantu.</p>
                <p className="text-sm">Mulai percakapan dengan mengetik pertanyaan di bawah.</p>
            </div>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} />
        ))}
        {isPending && <TypingIndicator />}
      </CardContent>

      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Contoh: 'Apa manfaat protein plan?'" 
            disabled={isPending}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" disabled={isPending} size="icon" className="flex-shrink-0">
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}