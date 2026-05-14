'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Copy,
  Heart,
  Download,
  Share2,
  Wand2,
  Expand,
  Eraser,
  MoreHorizontal,
  Check,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface RightPanelProps {
  prompt: string
  likes: number
  isLiked: boolean
  author?: {
    name: string
    avatar?: string
  }
  model?: string
  parameters?: {
    steps?: number
    guidance?: number
    seed?: number
    size?: string
  }
  createdAt?: Date
  onLike?: () => void
  onRemix?: (prompt: string) => void
  onSimilarGenerate?: (prompt: string) => void
  onEdit?: () => void
}

export function RightPanel({
  prompt,
  likes,
  isLiked,
  author,
  model,
  parameters,
  createdAt,
  onLike,
  onRemix,
  onSimilarGenerate,
  onEdit,
}: RightPanelProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [copied, setCopied] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    onLike?.()
  }

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleRemix = () => {
    onRemix?.(prompt)
  }

  const handleSimilarGenerate = () => {
    onSimilarGenerate?.(prompt)
  }

  const handleDownload = () => {
    // In production, this would trigger image download
    console.log('Download image')
  }

  const handleShare = () => {
    // In production, this would open share dialog
    console.log('Share image')
  }

  const buttonVariants = {
    tap: { scale: 0.98 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex h-full w-full flex-col overflow-y-auto scrollbar-thin border-l border-border/50 bg-background"
    >
      <div className="flex-1 space-y-5 p-5 overflow-y-auto scrollbar-thin">
        {/* ============ Author Section ============ */}
        {author && (
          <section className="flex items-center gap-3 pb-4 border-b border-border/50">
            <Avatar className="size-10">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                {author.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {author.name}
              </p>
              <p className="text-xs text-muted-foreground">
                创作者
              </p>
            </div>
          </section>
        )}

        {/* ============ Prompt Section ============ */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3
              className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            >
              提示词
            </h3>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-green-400" />
                  <span className="text-green-400">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>复制</span>
                </>
              )}
            </button>
          </div>
          <div
            className="rounded-md bg-card p-3 text-sm leading-relaxed text-foreground"
          >
            {prompt}
          </div>
        </section>

        {/* ============ Generation Parameters ============ */}
        <section>
          <h3
            className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
          >
            生成参数
          </h3>
          <div
            className="space-y-2.5 rounded-md bg-card p-3"
          >
            {model && (
              <ParamRow label="模型" value={model} />
            )}
            {parameters?.size && (
              <ParamRow label="尺寸" value={parameters.size} />
            )}
            {createdAt && (
              <ParamRow
                label="创建时间"
                value={createdAt.toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            )}
          </div>
        </section>
      </div>

      {/* ============ Action Buttons — fixed at bottom ============ */}
      <section className="flex-shrink-0 border-t border-border/50 bg-background p-5 pt-4">
        <h3
          className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
        >
          操作
        </h3>

        {/* Primary Actions */}
        <div className="mb-2 grid grid-cols-2 gap-2">
          <motion.button
            whileTap="tap"
            variants={buttonVariants}
            onClick={handleRemix}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md h-9 px-4 text-sm font-medium',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'transition-all duration-200'
            )}
          >
            <Wand2 className="size-4" />
            <span>重混</span>
          </motion.button>

          <motion.button
            whileTap="tap"
            variants={buttonVariants}
            onClick={handleSimilarGenerate}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md h-9 px-4 text-sm font-medium',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'transition-all duration-200'
            )}
          >
            <Sparkles className="size-4" />
            <span>相似生成</span>
          </motion.button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileTap="tap"
            variants={buttonVariants}
            onClick={onEdit}
            className="flex items-center justify-center gap-1.5 rounded-md h-8 px-3 text-xs font-medium text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 bg-secondary border border-border"
          >
            <Wand2 className="size-3.5" />
            <span>编辑</span>
          </motion.button>

          <motion.button
            whileTap="tap"
            variants={buttonVariants}
            className="flex items-center justify-center gap-1.5 rounded-md h-8 px-3 text-xs font-medium text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 bg-secondary border border-border"
          >
            <Expand className="size-3.5" />
            <span>高清放大</span>
          </motion.button>

          <motion.button
            whileTap="tap"
            variants={buttonVariants}
            className="flex items-center justify-center gap-1.5 rounded-md h-8 px-3 text-xs font-medium text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 bg-secondary border border-border"
          >
            <Eraser className="size-3.5" />
            <span>去背景</span>
          </motion.button>
        </div>

        {/* Icon Buttons Row */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleLike}
            className={cn(
              'flex items-center gap-1.5 rounded-md h-8 px-3 text-xs transition-all duration-200',
              'border border-border hover:border-border',
              liked
                ? 'text-destructive-foreground bg-destructive/10'
                : 'text-muted-foreground hover:text-foreground bg-secondary'
            )}
          >
            <Heart
              className={cn(
                'size-4 transition-colors',
                liked && 'fill-red-400 text-red-400'
              )}
            />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md h-8 px-3 text-xs text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 bg-secondary border border-border"
          >
            <Download className="size-4" />
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-md h-8 px-3 text-xs text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 bg-secondary border border-border"
          >
            <Share2 className="size-4" />
          </button>

          <button
            className="ml-auto flex items-center gap-1.5 rounded-md h-8 px-3 text-xs text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 bg-secondary border border-border"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </section>
    </motion.div>
  )
}

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>
      <span className="text-xs font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}
