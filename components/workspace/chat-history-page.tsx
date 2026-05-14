'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Copy,
  Download,
  Heart,
  MoreHorizontal,
  Sparkles,
  User,
  Trash2,
  Share2,
  RefreshCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PromptInput } from './prompt-input'
import { useWorkspaceStore } from '@/stores'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: string[]
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

// 模拟聊天数据
const mockChatSession: ChatSession = {
  id: '1',
  title: '科幻风格海报设计',
  createdAt: new Date(),
  messages: [
    {
      id: 'm1',
      role: 'user',
      content: '帮我设计一张科幻风格的电影海报，要有未来城市和飞行器的元素',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'm2',
      role: 'assistant',
      content: '我为你生成了4张科幻风格的电影海报，融合了未来城市和飞行器元素。这些设计采用了霓虹色调和赛博朋克美学，营造出充满未来感的视觉效果。',
      images: [
        '/images/sample-3.jpg',
        '/images/sample-1.jpg',
        '/images/sample-5.jpg',
        '/images/sample-4.jpg',
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 29),
    },
    {
      id: 'm3',
      role: 'user',
      content: '第一张很不错，能不能在保持风格的基础上，增加一些中文标题文字？',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
    {
      id: 'm4',
      role: 'assistant',
      content: '好的，我在保持原有科幻风格的基础上，为海报添加了中文标题。标题采用了发光效果，与整体的霓虹美学相呼应。',
      images: [
        '/images/sample-2.jpg',
        '/images/sample-6.jpg',
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 19),
    },
    {
      id: 'm5',
      role: 'user',
      content: '完美！我选择第二张，能导出高清版本吗？',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: 'm6',
      role: 'assistant',
      content: '当然可以！我已经为你准备好了高清版本（4K 分辨率）。你可以点击下载按钮获取。如果需要其他格式或尺寸，请告诉我。',
      timestamp: new Date(Date.now() - 1000 * 60 * 9),
    },
  ],
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <Avatar className="size-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=creative" />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-accent text-accent-foreground">
              <Sparkles className="size-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Content */}
      <div className={cn('flex min-w-0 flex-col gap-2', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border'
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Generated Images */}
        {message.images && message.images.length > 0 && (
          <div className={cn(
            'grid gap-3 w-full',
            message.images.length === 1 && 'grid-cols-1',
            message.images.length === 2 && 'grid-cols-2',
            message.images.length === 3 && 'grid-cols-3',
            message.images.length === 4 && 'grid-cols-2'
          )}>
            {message.images.map((src, idx) => (
              <motion.div
                key={idx}
                className="group relative overflow-hidden rounded-xl"
                onHoverStart={() => setHoveredImage(src)}
                onHoverEnd={() => setHoveredImage(null)}
              >
                <img
                  src={src}
                  alt={`生成图片 ${idx + 1}`}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <AnimatePresence>
                  {hoveredImage === src && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60"
                    >
                      <Button size="icon" variant="secondary" className="size-8">
                        <Download className="size-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="size-8">
                        <Heart className="size-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="size-8">
                        <Copy className="size-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground">
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  )
}

export function ChatHistoryPage({ chatId }: { chatId?: string }) {
  const { setCurrentPage, isGenerating, setIsGenerating, addGeneration } = useWorkspaceStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>(mockChatSession.messages)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (prompt: string) => {
    // Add user message
    const userMessage: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    setIsGenerating(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const aiMessage: Message = {
      id: `m-${Date.now() + 1}`,
      role: 'assistant',
      content: '好的，我正在为你生成新的图片。这里是基于你描述生成的结果：',
      images: ['/images/sample-1.jpg', '/images/sample-2.jpg'],
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
    setIsGenerating(false)

    // Add to generations
    addGeneration({
      id: `gen-${Date.now()}`,
      prompt,
      images: aiMessage.images || [],
      status: 'completed',
      createdAt: new Date(),
    })
  }

  return (
    <div className="flex flex-1 min-w-0 h-full flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage('home')}
            className="shrink-0"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">{mockChatSession.title}</h1>
            <p className="text-xs text-muted-foreground">
              {mockChatSession.createdAt.toLocaleDateString('zh-CN')} 创建
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2 className="mr-2 size-4" />
                分享对话
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 size-4" />
                导出记录
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCcw className="mr-2 size-4" />
                重新生成
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                删除对话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  <Sparkles className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 rounded-2xl bg-card border border-border px-4 py-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCcw className="size-4 text-muted-foreground" />
                </motion.div>
                <span className="text-sm text-muted-foreground">正在生成...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <PromptInput onSubmit={handleSendMessage} isLoading={isGenerating} />
        </div>
      </div>
    </div>
  )
}
