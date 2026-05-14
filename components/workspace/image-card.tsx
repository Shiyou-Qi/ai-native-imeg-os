'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Copy, Share2, MoreHorizontal, Bookmark, Download, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export interface ImageCardProps {
  id: string
  src: string
  alt?: string
  width: number
  height: number
  likes?: number
  isLiked?: boolean
  isBookmarked?: boolean
  author?: {
    name: string
    avatar?: string
  }
  prompt?: string
  onLike?: (id: string) => void
  onBookmark?: (id: string) => void
  onClick?: () => void
}

export function ImageCard({
  id,
  src,
  alt,
  width,
  height,
  likes = 0,
  isLiked = false,
  isBookmarked = false,
  author,
  prompt,
  onLike,
  onBookmark,
  onClick,
}: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const [copied, setCopied] = useState(false)

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !liked
    setLiked(next)
    setLikeCount((c) => (next ? c + 1 : c - 1))
    onLike?.(id)
  }, [liked, id, onLike])

  const handleBookmark = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !bookmarked
    setBookmarked(next)
    onBookmark?.(id)
    toast(next ? '已收藏' : '已取消收藏', {
      description: next ? '图片已添加到你的收藏夹' : '图片已从收藏夹移除',
    })
  }, [bookmarked, id, onBookmark])

  const handleCopyPrompt = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (prompt) {
      navigator.clipboard.writeText(prompt)
      setCopied(true)
      toast.success('提示词已复制', { duration: 2000 })
      setTimeout(() => setCopied(false), 2000)
    }
  }, [prompt])

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-image-${id}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('下载已开始')
    } catch {
      toast.error('下载失败，请重试')
    }
  }, [src, id])

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/image/${id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('链接已复制到剪贴板', { description: url })
    } catch {
      toast.error('分享失败')
    }
  }, [id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="masonry-item group"
    >
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.18 }}
        onClick={onClick}
        className={cn(
          'relative overflow-hidden rounded-xl bg-card cursor-pointer',
          'ring-1 ring-border/50 hover:ring-border',
          'transition-shadow duration-200'
        )}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* Image */}
        <img
          src={src}
          alt={alt || '生成的图片'}
          className="size-full object-cover"
          loading="lazy"
        />

        {/* Bookmark badge (always visible when bookmarked) */}
        {bookmarked && !isHovered && (
          <div className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 backdrop-blur-sm">
            <Bookmark className="size-3.5 fill-yellow-400 text-yellow-400" />
          </div>
        )}

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            >
              {/* Top Actions */}
              <div className="absolute right-2 top-2 flex gap-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    'size-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm border-0 text-white',
                    bookmarked && '!bg-yellow-500/30'
                  )}
                  onClick={handleBookmark}
                >
                  <Bookmark className={cn('size-4', bookmarked && 'fill-yellow-400 text-yellow-400')} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm border-0 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopyPrompt}>
                      {copied ? (
                        <Check className="mr-2 size-4 text-emerald-500" />
                      ) : (
                        <Copy className="mr-2 size-4" />
                      )}
                      {copied ? '已复制' : '复制提示词'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="mr-2 size-4" />
                      下载图片
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="mr-2 size-4" />
                      复制分享链接
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Bottom Info */}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="flex items-center justify-between">
                  {author && (
                    <div className="flex items-center gap-2">
                      <div className="size-6 shrink-0 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden">
                        {author.avatar ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-xs font-medium text-white">
                            {author.name[0]}
                          </div>
                        )}
                      </div>
                      <span className="truncate text-sm font-medium text-white/90 max-w-[100px]">
                        {author.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
                  >
                    <motion.div
                      animate={liked ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={cn(
                          'size-4 transition-colors',
                          liked && 'fill-red-500 text-red-500'
                        )}
                      />
                    </motion.div>
                    {likeCount > 0 && (
                      <span className="text-sm font-medium">{likeCount}</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Always visible badge (when not hovered and has likes) */}
        {!isHovered && likeCount > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
            <Heart className={cn('size-3', liked && 'fill-red-500 text-red-500')} />
            <span className="text-xs font-medium text-white">{likeCount}</span>
          </div>
        )}

        {/* Prompt tooltip on hover */}
        {isHovered && prompt && (
          <div className="absolute left-2 right-16 top-2">
            <p className="line-clamp-2 rounded-lg bg-black/50 px-2.5 py-1.5 text-xs text-white/80 backdrop-blur-sm">
              {prompt}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
