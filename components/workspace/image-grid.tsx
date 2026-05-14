'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Loader2, SlidersHorizontal, X, ImageOff } from 'lucide-react'
import { ImageCard, type ImageCardProps } from './image-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorkspaceStore } from '@/stores'
import { cn } from '@/lib/utils'

// ── Mock data generation ──────────────────────────────────
const categoryPrompts: Record<string, string[]> = {
  general: [
    '唯美的自然风光摄影', '抽象的数字艺术作品', '温暖治愈的插画',
    '极简主义设计风格', '未来科技概念图', '梦幻星空场景',
    '复古胶片风格照片', '现代建筑几何美学',
  ],
  poster: [
    '赛博朋克电影海报', '极简主义音乐会海报', '复古旅行宣传海报',
    '科幻大片预告海报', '文艺电影节海报', '霓虹灯城市夜景海报',
  ],
  photography: [
    '黄金时刻人像摄影', '微距花卉特写', '黑白街头纪实',
    '极光夜空风光', '水下珊瑚礁摄影', '都市建筑倒影',
  ],
  tshirt: [
    '几何图案T恤设计', '手绘风格印花', '极简文字标语',
    '复古乐队周边', '抽象水彩涂鸦', '日式浮世绘风格',
  ],
  logo: [
    '科技公司Logo', '咖啡品牌标识', '极简几何图形',
    '手写字体标志', '渐变色彩Logo', '单色线条标志',
  ],
  marketing: [
    '社交媒体宣传图', '产品促销横幅', '品牌故事视觉',
    '活动邀请函设计', '电商商品展示', '品牌色系统一设计',
  ],
  print: [
    '杂志封面设计', '画册内页布局', '明信片插图',
    '名片设计', '包装盒图案', '日历插画设计',
  ],
}

const authors = [
  { name: '创意达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
  { name: '艺术家小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
  { name: 'AI绘画师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
  { name: '设计大师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
  { name: '创意工坊', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
  { name: '像素魔法师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
  { name: '视觉诗人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7' },
  { name: '数字匠人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8' },
]

const imageSources = [
  { src: '/images/sample-1.jpg', w: 3, h: 4 },
  { src: '/images/sample-2.jpg', w: 4, h: 5 },
  { src: '/images/sample-3.jpg', w: 4, h: 3 },
  { src: '/images/sample-4.jpg', w: 3, h: 4 },
  { src: '/images/sample-5.jpg', w: 4, h: 5 },
  { src: '/images/sample-6.jpg', w: 3, h: 4 },
  { src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format', w: 3, h: 4 },
  { src: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format', w: 4, h: 5 },
  { src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format', w: 4, h: 3 },
  { src: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format', w: 3, h: 4 },
  { src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&auto=format', w: 4, h: 5 },
  { src: 'https://images.unsplash.com/photo-1506792006437-256b665541e2?w=800&auto=format', w: 3, h: 4 },
  { src: 'https://images.unsplash.com/photo-1551913902-c92207136625?w=800&auto=format', w: 4, h: 3 },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format', w: 4, h: 5 },
  { src: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=800&auto=format', w: 3, h: 4 },
  { src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format', w: 4, h: 5 },
]

type SortOption = 'trending' | 'latest' | 'most_liked'

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'trending', label: '热门推荐' },
  { id: 'latest', label: '最新发布' },
  { id: 'most_liked', label: '最多点赞' },
]

const categoryLabels: Record<string, string> = {
  general: '通用', poster: '海报', photography: '摄影',
  tshirt: 'T恤', logo: 'Logo', marketing: '营销', print: '印刷',
}

// Deterministic pseudo-random for SSR consistency
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function generateImages(count: number): ImageCardProps[] {
  return Array.from({ length: count }, (_, i) => {
    const img = imageSources[i % imageSources.length]
    const author = authors[i % authors.length]
    const cats = Object.keys(categoryPrompts)
    const cat = cats[i % cats.length]
    const prompts = categoryPrompts[cat]
    const prompt = prompts[i % prompts.length]
    return {
      id: `img-${i}`,
      src: img.src,
      width: img.w,
      height: img.h,
      likes: Math.floor(pseudoRandom(i * 3 + 1) * 200) + 5,
      isLiked: i % 7 === 0,
      isBookmarked: i % 11 === 0,
      author,
      prompt: `${categoryLabels[cat]} · ${prompt}`,
    }
  })
}

// Generate once
const allImages = generateImages(60)

interface ImageGridProps {
  category?: string
  tab?: string
  searchQuery?: string
}

export function ImageGrid({ category = 'general', tab = 'explore', searchQuery = '' }: ImageGridProps) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>('trending')
  const [visibleCount, setVisibleCount] = useState(12)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { setImageDetail, setSelectedCategory, setSearchQuery } = useWorkspaceStore()

  // Filter images
  const filteredImages = useMemo(() => {
    let result = [...allImages]

    // Filter by category
    if (category && category !== 'general') {
      result = result.filter((img) =>
        img.prompt?.startsWith(categoryLabels[category])
      )
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (img) =>
          img.prompt?.toLowerCase().includes(q) ||
          img.author?.name.toLowerCase().includes(q)
      )
    }

    // Filter by tab
    if (tab === 'following') {
      // Simulate: show a subset for "following"
      result = result.filter((_, i) => i % 3 === 0)
    } else if (tab === 'top') {
      // Show highest liked
      result = result.filter((img) => (img.likes || 0) > 80)
    }

    // Sort
    if (sortBy === 'latest') {
      result.reverse()
    } else if (sortBy === 'most_liked') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    }
    // 'trending' keeps pseudo-random order

    return result
  }, [category, tab, searchQuery, sortBy])

  // Reset visible count on filter change
  useEffect(() => {
    setVisibleCount(12)
  }, [category, tab, searchQuery, sortBy])

  // Handle like
  const handleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Handle bookmark
  const handleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Load more
  const loadMore = useCallback(() => {
    if (isLoading || visibleCount >= filteredImages.length) return
    setIsLoading(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 12, filteredImages.length))
      setIsLoading(false)
    }, 500)
  }, [isLoading, visibleCount, filteredImages.length])

  // Intersection Observer
  useEffect(() => {
    observerRef.current?.disconnect()

    const hasMore = visibleCount < filteredImages.length
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [loadMore, isLoading, visibleCount, filteredImages.length])

  const visibleImages = filteredImages.slice(0, visibleCount)
  const hasActiveFilter = category !== 'general' || searchQuery.trim() !== '' || tab !== 'explore'

  return (
    <div className="w-full space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Active filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <SlidersHorizontal className="size-3.5" />
                {sortOptions.find((s) => s.id === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={cn(sortBy === opt.id && 'bg-accent/10 text-accent')}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active filter badges */}
          {category !== 'general' && (
            <Badge variant="secondary" className="h-7 gap-1 pl-2 pr-1 text-xs">
              {categoryLabels[category]}
              <Button
                variant="ghost"
                size="icon"
                className="size-4 hover:bg-transparent"
                onClick={() => setSelectedCategory('general')}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}
          {searchQuery.trim() && (
            <Badge variant="secondary" className="h-7 gap-1 pl-2 pr-1 text-xs">
              搜索: {searchQuery}
              <Button
                variant="ghost"
                size="icon"
                className="size-4 hover:bg-transparent"
                onClick={() => setSearchQuery('')}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}
        </div>

        {/* Result count */}
        <span className="text-xs text-muted-foreground">
          {filteredImages.length} 个结果
        </span>
      </div>

      {/* Image Grid or Empty State */}
      {visibleImages.length > 0 ? (
        <div className="masonry-grid">
          <AnimatePresence mode="popLayout">
            {visibleImages.map((image) => (
              <ImageCard
                key={image.id}
                {...image}
                isLiked={likedIds.has(image.id)}
                isBookmarked={bookmarkedIds.has(image.id)}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onClick={() => {
                  setImageDetail(image.id, {
                    ...image,
                    prompt: image.prompt || 'AI生成艺术作品',
                    likes: image.likes || 0,
                    isLiked: likedIds.has(image.id),
                    model: 'Stable Diffusion XL',
                    parameters: {
                      steps: 30,
                      guidance: 7.5,
                      seed: Math.floor(Math.random() * 999999),
                      size: '1024x1024',
                    },
                    createdAt: new Date(),
                    history: [
                      {
                        id: `${image.id}-v1`,
                        src: image.src,
                        prompt: image.prompt || '原始版本',
                        createdAt: new Date(Date.now() - 86400000),
                      },
                    ],
                  })
                  router.push(`/image/${image.id}`)
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <ImageOff className="size-8 text-muted-foreground/40" />
          </div>
          <h3 className="mt-4 text-base font-medium text-foreground">没有找到匹配的结果</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            尝试更换筛选条件或搜索其他关键词
          </p>
        </motion.div>
      )}

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="flex items-center justify-center py-8">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">加载更多...</span>
          </motion.div>
        )}
        {visibleCount >= filteredImages.length && filteredImages.length > 0 && (
          <span className="text-sm text-muted-foreground">已展示全部 {filteredImages.length} 个结果</span>
        )}
      </div>
    </div>
  )
}
