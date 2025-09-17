import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface RequestBody {
  messages: Message[]
  apiKey: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { messages, apiKey } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Inicializar OpenAI con la API key del cliente
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Crear el stream de chat completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente de IA útil y amigable. Responde de manera clara y concisa. Puedes ayudar con una amplia variedad de temas incluyendo programación, redacción, análisis, matemáticas y conversación general.'
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    })

    // Crear un ReadableStream para el streaming
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          
          // Enviar señal de finalización
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Error in streaming:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error: any) {
    console.error('Error in chat API:', error)
    
    // Manejar errores específicos de OpenAI
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    if (error.status === 500) {
      return NextResponse.json(
        { error: 'OpenAI service is currently unavailable' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}