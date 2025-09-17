import { useState, useCallback } from 'react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface UseChatOptions {
  apiKey: string
  onError?: (error: string) => void
}

export function useChat({ apiKey, onError }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !apiKey) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ content, role }) => ({ content, role })),
          apiKey: apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al procesar la respuesta')
      }

      // Crear mensaje de asistente vacío para ir llenándolo con el stream
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Leer el stream de respuesta
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let content = ""
        
        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                break
              }
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  content += parsed.content
                  
                  // Actualizar el mensaje del asistente en tiempo real
                  setMessages((prev) => 
                    prev.map((msg) => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content }
                        : msg
                    )
                  )
                }
              } catch (e) {
                // Ignorar errores de parsing de chunks individuales
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      onError?.(error.message || 'Error al enviar el mensaje')
      
      // Remover el mensaje del usuario si hubo error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [messages, apiKey, onError])

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        content: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}