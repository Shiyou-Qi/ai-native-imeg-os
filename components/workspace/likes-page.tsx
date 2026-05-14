'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Search,
  Grid3X3,
  LayoutGrid,
  Download,
  FolderPlus,
  MoreHorizontal,
  SlidersHorizontal,
  X,
  Check,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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

interface LikedImage {
  id: string
  src: string
  prompt: string
  author: string
  authorAvatar: string
  likedAt: string
  likes: number
  width: number
  height: number
}

// 模拟喜欢的图片数据
const mockLikedImages: LikedImage[] = [
  {
    id: '1',
    src: '/images/sample-1.jpg',
    prompt: '超现实主义人像，羽毛装饰，梦幻光影',
    author: '创意大师',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master',
    likedAt: '2024-03-20',
    likes: 128,
    width: 3,
    height: 4,
  },
  {
    id: '2',
    src: '/images/sample-2.jpg',
    prompt: '日式和服美人，白色花朵环绕，柔和自然光',
    author: '摄影师小王',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    likedAt: '2024-03-19',
    likes: 256,
    width: 4,
    height: 5,
  },
  {
    id: '3',
    src: '/images/sample-3.jpg',
    prompt: '复古科幻艺术，宇宙行星，迷幻色彩',
    author: '艺术探索者',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer',
    likedAt: '2024-03-18',
    likes: 89,
    width: 4,
    height: 3,
  },
  {
    id: '4',
    src: '/images/sample-4.jpg',
    prompt: '粉色荷花特写，水滴晶莹，微距摄影',
    author: '自然爱好者',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature',
    likedAt: '2024-03-17',
    likes: 312,
    width: 3,
    height: 4,
  },
  {
    id: '5',
    src: '/images/sample-5.jpg',
    prompt: '高端时尚人像，戏剧性光影，工作室摄影',
    author: '时尚编辑',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fashion',
    likedAt: '2024-03-16',
    likes: 445,
    width: 4,
    height: 5,
  },
  {
    id: '6',
    src: '/images/sample-6.jpg',
    prompt: '复古海报设计，白色狗狗插画，中世纪现代风格',
    author: '平面设计师',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
    likedAt: '2024-03-15',
    likes: 167,
    width: 3,
    height: 4,
  },
]

function LikedImageCard({ 
  image, 
  isSelected, 
  onSelect, 
  isSelectMode,
  onUnlike,
  onClick,
}: { 
  image: LikedImage
  isSelected: boolean
  onSelect: (id: string) => void
  isSelectMode: boolean
  onUnlike: (id: string) => void
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const aspectRatio = image.width / image.height

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="masonry-item group relative"
      onClick={() => {
        if (!isSelectMode) onClick?.()
      }}
    >
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl bg-muted transition-all duration-200",
          !isSelectMode && "cursor-pointer",
          isSelected && "ring-2 ring-foreground"
        )}
        style={{ aspectRatio }}
      >
        <img
          src={image.src}
          alt={image.prompt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Select Checkbox */}
        {isSelectMode && (
          <div className="absolute left-3 top-3 z-10">
            <div
              onClick={() => onSelect(image.id)}
              className={cn(
                "flex size-6 cursor-pointer items-center justify-center rounded-md border-2 transition-colors",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-white/70 bg-black/30 hover:border-white"
              )}
            >
              {isSelected && <Check className="size-4" />}
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && !isSelectMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            >
              {/* Actions */}
              <div className="absolute right-3 top-3 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 bg-black/50 hover:bg-black/70"
                  onClick={() => onUnlike(image.id)}
                >
                  <Heart className="size-4 fill-current text-red-500" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 bg-black/50 hover:bg-black/70"
                >
                  <Download className="size-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-8 bg-black/50 hover:bg-black/70"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FolderPlus className="mr-2 size-4" />
                      添加到收藏集
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => onUnlike(image.id)}
                    >
                      <Heart className="mr-2 size-4" />
                      取消喜欢
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Info */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="line-clamp-2 text-sm text-white/90">
                  {image.prompt}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={image.authorAvatar}
                      alt={image.author}
                      className="size-6 rounded-full"
                    />
                    <span className="text-xs text-white/70">{image.author}</span>
                  </div>
                  <span className="text-xs text-white/70">{image.likes} 喜欢</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function LikesPage() {
  const router = useRouter()
  const setImageDetail = useWorkspaceStore((s) => s.setImageDetail)
  const [images, setImages] = useState<LikedImage[]>(mockLikedImages)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'mostLikes'>('latest')
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry')
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleImageClick = (image: LikedImage) => {
    setImageDetail(image.id, {
      id: image.id,
      src: image.src,
      prompt: image.prompt,
      width: 1024,
      height: 1024,
      likes: image.likes,
      isLiked: true,
      author: { name: image.author, avatar: image.authorAvatar },
      createdAt: new Date(image.likedAt),
      history: [],
    })
    router.push(`/image/${image.id}`)
  }

  const filteredImages = images
    .filter(img => 
      img.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
        case 'oldest':
          return new Date(a.likedAt).getTime() - new Date(b.likedAt).getTime()
        case 'mostLikes':
          return b.likes - a.likes
        default:
          return 0
      }
    })

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredImages.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredImages.map(img => img.id)))
    }
  }

  const handleUnlike = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleBatchUnlike = () => {
    setImages(prev => prev.filter(img => !selectedIds.has(img.id)))
    setSelectedIds(new Set())
    setIsSelectMode(false)
  }

  const exitSelectMode = () => {
    setIsSelectMode(false)
    setSelectedIds(new Set())
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-border px-6 py-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">我的喜欢</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {images.length} 个喜欢的作品
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isSelectMode ? (
                <>
                  <Button variant="outline" size="sm" onClick={exitSelectMode}>
                    <X className="mr-2 size-4" />
                    取消
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    <Check className="mr-2 size-4" />
                    {selectedIds.size === filteredImages.length ? '取消全选' : '全选'}
                  </Button>
                  {selectedIds.size > 0 && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleBatchUnlike}
                    >
                      <Heart className="mr-2 size-4" />
                      取消喜欢 ({selectedIds.size})
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsSelectMode(true)}
                >
                  <Check className="mr-2 size-4" />
                  多选
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-32">
                  <SlidersHorizontal className="mr-2 size-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">
                    <div className="flex items-center">
                      <Clock className="mr-2 size-4" />
                      最新喜欢
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center">
                      <Clock className="mr-2 size-4" />
                      最早喜欢
                    </div>
                  </SelectItem>
                  <SelectItem value="mostLikes">
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 size-4" />
                      最多喜欢
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-9 rounded-r-none",
                    viewMode === 'masonry' && "bg-secondary"
                  )}
                  onClick={() => setViewMode('masonry')}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-9 rounded-l-none",
                    viewMode === 'grid' && "bg-secondary"
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin">
        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Heart className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">
              {searchQuery ? '未找到结果' : '暂无喜欢的内容'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery 
                ? `没有找到匹配"${searchQuery}"的内容`
                : '浏览社区作品，点击喜欢收藏你喜欢的创作'
              }
            </p>
          </div>
        ) : viewMode === 'masonry' ? (
          <div className="masonry-grid">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image) => (
                <LikedImageCard
                  key={image.id}
                  image={image}
                  isSelected={selectedIds.has(image.id)}
                  onSelect={handleSelect}
                  isSelectMode={isSelectMode}
                  onUnlike={handleUnlike}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image) => (
                <LikedImageCard
                  key={image.id}
                  image={image}
                  isSelected={selectedIds.has(image.id)}
                  onSelect={handleSelect}
                  isSelectMode={isSelectMode}
                  onUnlike={handleUnlike}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  )
}
