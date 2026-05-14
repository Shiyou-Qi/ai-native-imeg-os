'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Heart,
  MoreHorizontal,
  Sparkles,
  User,
  Trash2,
  Share2,
  RefreshCcw,
  X,
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
import { RightPanel } from '@/components/image-detail/right-panel'
import { useWorkspaceStore } from '@/stores'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: string[]
  prompt?: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface SelectedImage {
  src: string
  prompt: string
  index: number
}

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
      prompt: '赛博朋克风格科幻电影海报，霓虹灯城市，未来飞行器，雨天夜景，高对比度，Cinematic lighting, 8K',
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
      prompt: '科幻电影海报设计，霓虹美学，中文标题发光效果，赛博朋克城市背景，高分辨率',
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
      prompt: '高清4K分辨率版本，保持原有科幻风格和霓虹美学',
      timestamp: new Date(Date.now() - 1000 * 60 * 9),
    },
  ],
}

function MessageBubble({
  message,
  onImageClick,
}: {
  message: Message
  onImageClick?: (image: SelectedImage) => void
}) {
  const isUser = message.role === 'user'
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

  const handleDownload = async (e: React.MouseEvent, src: string) => {
    e.stopPropagation()
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-image-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('下载已开始')
    } catch {
      toast.error('下载失败')
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success('已收藏')
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success('已复制')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3', isUser && 'flex-row-reverse')}
    >
      <Avatar className="size-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=creative" />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-accent text-accent-foreground">
            <Sparkles className="size-4" />
          </AvatarFallback>
        )}
      </Avatar>

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

        {message.images && message.images.length > 0 && (
          <div
            className={cn(
              'grid gap-3 w-full',
              message.images.length === 1 && 'grid-cols-1',
              message.images.length === 2 && 'grid-cols-2',
              message.images.length === 3 && 'grid-cols-3',
              message.images.length === 4 && 'grid-cols-2'
            )}
          >
            {message.images.map((src, idx) => (
              <motion.div
                key={idx}
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => onImageClick?.({ src, prompt: message.prompt || message.content, index: idx })}
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
                      <Button size="icon" variant="secondary" className="size-8" onClick={(e) => handleDownload(e, src)}>
                        <Download className="size-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="size-8" onClick={handleLike}>
                        <Heart className="size-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="size-8" onClick={handleCopy}>
                        <X className="size-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

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
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null)
  const [promptValue, setPromptValue] = useState('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (prompt: string) => {
    const userMessage: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const aiMessage: Message = {
      id: `m-${Date.now() + 1}`,
      role: 'assistant',
      content: '好的，我正在为你生成新的图片。这里是基于你描述生成的结果：',
      prompt,
      images: ['/images/sample-1.jpg', '/images/sample-2.jpg'],
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
    setIsGenerating(false)

    addGeneration({
      id: `gen-${Date.now()}`,
      prompt,
      images: aiMessage.images || [],
      status: 'completed',
      createdAt: new Date(),
    })
  }

  const handleImageClick = useCallback((image: SelectedImage) => {
    setSelectedImage(image)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedImage(null)
  }, [])

  return (
    <div className="flex flex-1 min-w-0 h-full flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
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
                <Share2 className="mr-2 size-4" /> 分享对话
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 size-4" /> 导出记录
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCcw className="mr-2 size-4" /> 重新生成
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" /> 删除对话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Body: Messages + optional Detail Panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Messages area */}
        <div className="flex flex-1 min-w-0 flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onImageClick={handleImageClick}
                />
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
          <div className="shrink-0 border-t border-border bg-background">
            <div className="mx-auto max-w-3xl px-4 py-3">
              <PromptInput
                value={promptValue}
                onChange={setPromptValue}
                onSubmit={handleSendMessage}
                isLoading={isGenerating}
              />
            </div>
          </div>
        </div>

        {/* Image Detail Panel */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="shrink-0 overflow-hidden border-l border-border bg-background"
            >
              <RightPanel
                prompt={selectedImage.prompt}
                likes={42}
                isLiked={false}
                author={{ name: 'AI 创意助手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai' }}
                model="Stable Diffusion XL"
                parameters={{
                  steps: 30,
                  guidance: 7.5,
                  seed: 12345,
                  size: '1024 × 1024',
                }}
                createdAt={new Date()}
                onLike={() => toast.success('已收藏')}
                onRemix={(p) => {
                  setPromptValue(p)
                  setSelectedImage(null)
                  toast.success('提示词和参数已填入输入框')
                }}
                onSimilarGenerate={(p) => {
                  setPromptValue(p)
                  setSelectedImage(null)
                  toast.success('提示词已填入，可修改后生成')
                }}
                onEdit={() => setCurrentPage('canvas')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
