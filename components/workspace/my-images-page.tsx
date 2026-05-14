'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Grid3X3,
  LayoutGrid,
  SortDesc,
  Download,
  Heart,
  Trash2,
  MoreHorizontal,
  Calendar,
  ImageIcon,
  FolderPlus,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWorkspaceStore } from '@/stores'

interface ImageItem {
  id: string
  src: string
  prompt: string
  createdAt: Date
  likes: number
  isLiked: boolean
  width: number
  height: number
}

// 模拟图片数据
const mockImages: ImageItem[] = [
  {
    id: '1',
    src: '/images/sample-1.jpg',
    prompt: '超现实主义数字艺术肖像，羽毛装饰，空灵光线',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    likes: 24,
    isLiked: true,
    width: 3,
    height: 4,
  },
  {
    id: '2',
    src: '/images/sample-2.jpg',
    prompt: '日式传统服装美女，白色花朵环绕，艺术摄影风格',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    likes: 56,
    isLiked: false,
    width: 4,
    height: 5,
  },
  {
    id: '3',
    src: '/images/sample-3.jpg',
    prompt: '超现实宇宙艺术，复古女性剪影，迷幻色彩',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 89,
    isLiked: true,
    width: 4,
    height: 3,
  },
  {
    id: '4',
    src: '/images/sample-4.jpg',
    prompt: '粉色荷花，水滴，微距摄影，柔和背景虚化',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    likes: 32,
    isLiked: false,
    width: 3,
    height: 4,
  },
  {
    id: '5',
    src: '/images/sample-5.jpg',
    prompt: '优雅时尚肖像，戏剧性光线，高端编辑风格',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    likes: 128,
    isLiked: true,
    width: 4,
    height: 5,
  },
  {
    id: '6',
    src: '/images/sample-6.jpg',
    prompt: '复古排版海报设计，中世纪现代风格',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    likes: 45,
    isLiked: false,
    width: 3,
    height: 4,
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format',
    prompt: '抽象艺术画作，蓝色调色板',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    likes: 67,
    isLiked: false,
    width: 3,
    height: 4,
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format',
    prompt: '自然风景，森林小径，阳光穿透',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    likes: 91,
    isLiked: true,
    width: 4,
    height: 3,
  },
]

type ViewMode = 'grid' | 'masonry'
type SortBy = 'newest' | 'oldest' | 'most-liked'

export function MyImagesPage() {
  const router = useRouter()
  const setImageDetail = useWorkspaceStore((s) => s.setImageDetail)
  const [images, setImages] = useState<ImageItem[]>(mockImages)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('masonry')
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isSelecting, setIsSelecting] = useState(false)

  const handleImageClick = (image: ImageItem) => {
    if (isSelecting) return
    setImageDetail(image.id, {
      id: image.id,
      src: image.src,
      prompt: image.prompt,
      width: 1024,
      height: 1024,
      likes: image.likes,
      isLiked: image.isLiked,
      author: { name: '我' },
      createdAt: image.createdAt,
      history: [],
    })
    router.push(`/image/${image.id}`)
  }

  const filteredImages = images
    .filter((img) =>
      img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime()
        case 'most-liked':
          return b.likes - a.likes
        default:
          return 0
      }
    })

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleLike = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, isLiked: !img.isLiked, likes: img.isLiked ? img.likes - 1 : img.likes + 1 }
          : img
      )
    )
  }

  const deleteSelected = () => {
    setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)))
    setSelectedImages([])
    setIsSelecting(false)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} 分钟前`
    if (hours < 24) return `${hours} 小时前`
    if (days < 7) return `${days} 天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="flex flex-1 min-w-0 h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-background px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">我的图片</h1>
            <p className="text-sm text-muted-foreground">
              共 {images.length} 张图片
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {isSelecting ? (
              <>
                <span className="text-sm text-muted-foreground">
                  已选择 {selectedImages.length} 张
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={selectedImages.length === 0}
                  onClick={deleteSelected}
                >
                  <Trash2 className="mr-2 size-4" />
                  删除
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsSelecting(false)
                    setSelectedImages([])
                  }}
                >
                  <X className="mr-2 size-4" />
                  取消
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSelecting(true)}
                >
                  <Check className="mr-2 size-4" />
                  选择
                </Button>
                <Button variant="outline" size="sm">
                  <FolderPlus className="mr-2 size-4" />
                  新建收藏集
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索图片描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-0"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <Select value={sortBy} onValueChange={(v: SortBy) => setSortBy(v)}>
              <SelectTrigger className="w-32 bg-secondary border-0">
                <SortDesc className="mr-2 size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新</SelectItem>
                <SelectItem value="oldest">最早</SelectItem>
                <SelectItem value="most-liked">最多喜欢</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex rounded-lg bg-secondary p-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-8',
                  viewMode === 'masonry' && 'bg-background shadow-sm'
                )}
                onClick={() => setViewMode('masonry')}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-8',
                  viewMode === 'grid' && 'bg-background shadow-sm'
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {filteredImages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <ImageIcon className="size-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">暂无图片</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery
                ? '没有找到匹配的图片，试试其他关键词'
                : '开始创作，你生成的图片将显示在这里'}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === 'masonry' && 'masonry-grid',
              viewMode === 'grid' && 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            )}
          >
            <AnimatePresence>
              {filteredImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.03 }}
                  className={cn(
                    'group relative overflow-hidden rounded-xl bg-muted',
                    viewMode === 'masonry' && 'masonry-item',
                    isSelecting && selectedImages.includes(image.id) && 'ring-2 ring-accent'
                  )}
                  onClick={() => {
                    if (isSelecting) {
                      toggleImageSelection(image.id)
                    } else {
                      handleImageClick(image)
                    }
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.prompt}
                    className={cn(
                      'w-full object-cover transition-transform duration-300',
                      viewMode === 'grid' && 'aspect-square',
                      !isSelecting && 'group-hover:scale-105'
                    )}
                  />

                  {/* Selection Checkbox */}
                  {isSelecting && (
                    <div
                      className={cn(
                        'absolute left-3 top-3 size-6 rounded-full border-2 flex items-center justify-center transition-colors',
                        selectedImages.includes(image.id)
                          ? 'bg-accent border-accent text-accent-foreground'
                          : 'bg-black/50 border-white/50'
                      )}
                    >
                      {selectedImages.includes(image.id) && (
                        <Check className="size-4" />
                      )}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  {!isSelecting && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      {/* Top Actions */}
                      <div className="absolute right-2 top-2 flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 bg-black/40 text-white hover:bg-black/60"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(image.id)
                          }}
                        >
                          <Heart
                            className={cn(
                              'size-4',
                              image.isLiked && 'fill-red-500 text-red-500'
                            )}
                          />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 bg-black/40 text-white hover:bg-black/60"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 size-4" />
                              下载图片
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FolderPlus className="mr-2 size-4" />
                              添加到收藏集
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 size-4" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <p className="mb-2 line-clamp-2 text-xs text-white/90">
                          {image.prompt}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-white/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(image.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="size-3" />
                            {image.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
