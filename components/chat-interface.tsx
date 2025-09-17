"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Plus, Menu, MessageSquare, HelpCircle, AlertCircle, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useChat } from "@/hooks/use-chat"
import ApiKeyConfig from "./api-key-config"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  lastMessage: Date
}

export default function ChatInterface() {
  const [inputValue, setInputValue] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const { toast } = useToast()
  
  const { messages, isLoading, sendMessage, clearMessages } = useChat({
    apiKey,
    onError: setError,
  })
  
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Nueva conversación",
      messages: [],
      lastMessage: new Date(),
    },
    {
      id: "2",
      title: "Ayuda con código React",
      messages: [],
      lastMessage: new Date(Date.now() - 86400000),
    },
    {
      id: "3",
      title: "Consulta sobre diseño UI",
      messages: [],
      lastMessage: new Date(Date.now() - 172800000),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    if (!apiKey) {
      setError("Por favor, configura tu API key de OpenAI primero.")
      return
    }

    await sendMessage(inputValue)
    setInputValue("")
    setError(null)
  }

  const handleApiKeyChange = useCallback((newApiKey: string) => {
    setApiKey(newApiKey)
    setError(null)
  }, [])

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      toast({
        title: "Copiado",
        description: "Mensaje copiado al portapapeles",
      })
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el mensaje",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden",
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80"
            onClick={() => {
              clearMessages()
            }}
          >
            <Plus className="h-4 w-4" />
            Nueva conversación
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {chatSessions.map((session) => (
              <Button
                key={session.id}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-3 hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2 w-full">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-sm">{session.title}</span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border space-y-1">
          <ApiKeyConfig onApiKeyChange={handleApiKeyChange} />
          <Button variant="ghost" className="w-full justify-start gap-2">
            <HelpCircle className="h-4 w-4" />
            Ayuda
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">ChatAI</h1>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {!apiKey && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Para comenzar a chatear, por favor configura tu API key de OpenAI en el botón "Configuración API" de la barra lateral.
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 animate-fade-in-up",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed group relative",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-12"
                      : "bg-card text-card-foreground",
                    isLoading && message.role === "assistant" && "message-streaming"
                  )}
                >
                  {message.content}
                  
                  {/* Copy button for assistant messages */}
                  {message.role === "assistant" && message.content && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
                      onClick={() => copyToClipboard(message.content, message.id)}
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-muted">
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">TU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-4 animate-fade-in-up">
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">AI</AvatarFallback>
                </Avatar>
                <div className="bg-card text-card-foreground rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 bg-input rounded-2xl p-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[44px] text-sm focus-enhanced"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !apiKey}
                size="sm"
                className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Presiona Enter para enviar, Shift + Enter para nueva línea
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
