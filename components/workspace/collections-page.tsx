'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  FolderOpen,
  MoreHorizontal,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Share2,
  Lock,
  Globe,
  X,
  Check,
  ArrowLeft,
  Heart,
  Calendar,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useWorkspaceStore } from '@/stores'

interface Collection {
  id: string
  name: string
  description: string
  coverImages: string[]
  imageCount: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface CollectionImageItem {
  id: string
  src: string
  prompt: string
  createdAt: string
  likes: number
  isLiked: boolean
  width: number
  height: number
}

// 模拟收藏集数据
const mockCollections: Collection[] = [
  {
    id: '1',
    name: '科幻风格',
    description: '收集各种科幻主题的AI生成作品',
    coverImages: [
      '/images/sample-3.jpg',
      '/images/sample-1.jpg',
      '/images/sample-5.jpg',
      '/images/sample-2.jpg',
    ],
    imageCount: 24,
    isPublic: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    name: '人像摄影',
    description: '精选人像风格作品',
    coverImages: [
      '/images/sample-2.jpg',
      '/images/sample-5.jpg',
      '/images/sample-1.jpg',
    ],
    imageCount: 18,
    isPublic: false,
    createdAt: '2024-02-10',
    updatedAt: '2024-03-18',
  },
  {
    id: '3',
    name: '自然风光',
    description: '大自然的美丽瞬间',
    coverImages: [
      '/images/sample-4.jpg',
      '/images/sample-3.jpg',
    ],
    imageCount: 32,
    isPublic: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-03-15',
  },
  {
    id: '4',
    name: '复古艺术',
    description: '怀旧风格的艺术创作',
    coverImages: [
      '/images/sample-6.jpg',
    ],
    imageCount: 12,
    isPublic: false,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10',
  },
]

// 模拟每个收藏集中的图片
const mockCollectionImages: Record<string, CollectionImageItem[]> = {
  '1': [
    { id: 'c1-1', src: '/images/sample-3.jpg', prompt: '超现实宇宙艺术，复古女性剪影', createdAt: '2024-03-18', likes: 89, isLiked: true, width: 4, height: 3 },
    { id: 'c1-2', src: '/images/sample-1.jpg', prompt: '超现实主义数字艺术肖像，羽毛装饰', createdAt: '2024-03-15', likes: 24, isLiked: false, width: 3, height: 4 },
    { id: 'c1-3', src: '/images/sample-5.jpg', prompt: '优雅时尚肖像，戏剧性光线', createdAt: '2024-03-10', likes: 128, isLiked: true, width: 4, height: 5 },
    { id: 'c1-4', src: '/images/sample-2.jpg', prompt: '日式传统服装美女，白色花朵环绕', createdAt: '2024-03-05', likes: 56, isLiked: false, width: 4, height: 5 },
    { id: 'c1-5', src: '/images/sample-6.jpg', prompt: '复古排版海报设计，中世纪现代风格', createdAt: '2024-02-28', likes: 45, isLiked: true, width: 3, height: 4 },
    { id: 'c1-6', src: '/images/sample-4.jpg', prompt: '粉色荷花，水滴，微距摄影', createdAt: '2024-02-20', likes: 32, isLiked: false, width: 3, height: 4 },
  ],
  '2': [
    { id: 'c2-1', src: '/images/sample-2.jpg', prompt: '日式传统服装美女，白色花朵环绕', createdAt: '2024-03-16', likes: 56, isLiked: false, width: 4, height: 5 },
    { id: 'c2-2', src: '/images/sample-5.jpg', prompt: '优雅时尚肖像，戏剧性光线', createdAt: '2024-03-12', likes: 128, isLiked: true, width: 4, height: 5 },
    { id: 'c2-3', src: '/images/sample-1.jpg', prompt: '超现实主义数字艺术肖像', createdAt: '2024-03-08', likes: 24, isLiked: true, width: 3, height: 4 },
    { id: 'c2-4', src: '/images/sample-3.jpg', prompt: '超现实宇宙艺术，迷幻色彩', createdAt: '2024-03-01', likes: 89, isLiked: false, width: 4, height: 3 },
  ],
  '3': [
    { id: 'c3-1', src: '/images/sample-4.jpg', prompt: '粉色荷花，水滴，微距摄影', createdAt: '2024-03-14', likes: 32, isLiked: false, width: 3, height: 4 },
    { id: 'c3-2', src: '/images/sample-3.jpg', prompt: '超现实宇宙艺术，复古风格', createdAt: '2024-03-10', likes: 89, isLiked: true, width: 4, height: 3 },
    { id: 'c3-3', src: '/images/sample-1.jpg', prompt: '梦幻奇幻风格人像', createdAt: '2024-03-05', likes: 67, isLiked: false, width: 3, height: 4 },
    { id: 'c3-4', src: '/images/sample-2.jpg', prompt: '樱花树下，传统服饰', createdAt: '2024-02-28', likes: 43, isLiked: true, width: 4, height: 5 },
    { id: 'c3-5', src: '/images/sample-6.jpg', prompt: '自然风光，日落时分', createdAt: '2024-02-20', likes: 55, isLiked: false, width: 3, height: 4 },
  ],
  '4': [
    { id: 'c4-1', src: '/images/sample-6.jpg', prompt: '复古海报设计，中世纪现代风格', createdAt: '2024-03-08', likes: 45, isLiked: false, width: 3, height: 4 },
    { id: 'c4-2', src: '/images/sample-1.jpg', prompt: '超现实主义肖像，复古色调', createdAt: '2024-03-05', likes: 24, isLiked: true, width: 3, height: 4 },
    { id: 'c4-3', src: '/images/sample-3.jpg', prompt: '迷幻宇宙，复古科幻', createdAt: '2024-03-01', likes: 89, isLiked: false, width: 4, height: 3 },
  ],
}

function CollectionCard({ collection, onEdit, onDelete, onClick }: { 
  collection: Collection
  onEdit: (collection: Collection) => void
  onDelete: (id: string) => void
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      {/* Cover Images Grid */}
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="relative overflow-hidden bg-secondary">
              {collection.coverImages[idx] ? (
                <img
                  src={collection.coverImages[idx]}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="size-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            >
              <div className="absolute right-2 top-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-8 bg-black/50 hover:bg-black/70"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit(collection)}>
                      <Pencil className="mr-2 size-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 size-4" />
                      分享
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(collection.id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3">
                <Button variant="secondary" className="w-full" onClick={() => onClick?.()}>
                  查看全部 {collection.imageCount} 张
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy Badge */}
        <div className="absolute left-2 top-2">
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs",
            collection.isPublic 
              ? "bg-foreground/10 text-foreground backdrop-blur-sm" 
              : "bg-secondary text-muted-foreground"
          )}>
            {collection.isPublic ? (
              <>
                <Globe className="size-3" />
                <span>公开</span>
              </>
            ) : (
              <>
                <Lock className="size-3" />
                <span>私密</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-medium text-foreground">{collection.name}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {collection.description || '暂无描述'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          {collection.imageCount} 张图片 · 更新于 {collection.updatedAt}
        </p>
      </div>
    </motion.div>
  )
}

function CreateCollectionCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group flex aspect-[4/3] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-muted-foreground hover:bg-muted/50"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-muted">
        <Plus className="size-6 text-muted-foreground" />
      </div>
      <span className="mt-3 text-sm font-medium text-muted-foreground">
        创建收藏集
      </span>
    </motion.button>
  )
}

function CollectionImageGrid({
  collectionId,
  searchQuery,
  onImageClick,
}: {
  collectionId: string
  searchQuery: string
  onImageClick: (image: CollectionImageItem) => void
}) {
  const images = (mockCollectionImages[collectionId] || []).filter(
    (img) => img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (images.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ImageIcon className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">
          {searchQuery ? '未找到结果' : '暂无图片'}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {searchQuery ? `没有找到匹配"${searchQuery}"的图片` : '这个收藏集中还没有图片'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <AnimatePresence>
          {images.map((image, idx) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.03 }}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-muted"
              onClick={() => onImageClick(image)}
            >
              <img
                src={image.src}
                alt={image.prompt}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="mb-2 line-clamp-2 text-xs text-white/90">{image.prompt}</p>
                  <div className="flex items-center justify-between text-[10px] text-white/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {image.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="size-3" />
                      {image.likes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function CollectionsPage() {
  const router = useRouter()
  const setImageDetail = useWorkspaceStore((s) => s.setImageDetail)
  const [collections, setCollections] = useState<Collection[]>(mockCollections)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(null)
  const [collectionSearchQuery, setCollectionSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
  })

  const filteredCollections = collections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    setFormData({ name: '', description: '', isPublic: false })
    setEditingCollection(null)
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (collection: Collection) => {
    setFormData({
      name: collection.name,
      description: collection.description,
      isPublic: collection.isPublic,
    })
    setEditingCollection(collection)
    setIsCreateDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id))
  }

  const handleSave = () => {
    if (editingCollection) {
      setCollections(prev => prev.map(c => 
        c.id === editingCollection.id 
          ? { ...c, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : c
      ))
    } else {
      const newCollection: Collection = {
        id: `new-${Date.now()}`,
        ...formData,
        coverImages: [],
        imageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setCollections(prev => [newCollection, ...prev])
    }
    setIsCreateDialogOpen(false)
  }

  const handleCollectionClick = (collection: Collection) => {
    setViewingCollection(collection)
    setCollectionSearchQuery('')
  }

  const handleBackToList = () => {
    setViewingCollection(null)
  }

  const handleCollectionImageClick = (image: CollectionImageItem) => {
    setImageDetail(image.id, {
      id: image.id,
      src: image.src,
      prompt: image.prompt,
      width: 1024,
      height: 1024,
      likes: image.likes,
      isLiked: image.isLiked,
      createdAt: new Date(image.createdAt),
      history: [],
    })
    router.push(`/image/${image.id}`)
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {viewingCollection ? (
        <>
          {/* Collection Detail Header */}
          <header className="shrink-0 border-b border-border px-6 py-4 lg:px-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={handleBackToList} className="shrink-0">
                  <ArrowLeft className="size-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-foreground truncate">{viewingCollection.name}</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                    {viewingCollection.description || '暂无描述'} · {viewingCollection.imageCount} 张图片
                  </p>
                </div>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索图片描述..."
                  value={collectionSearchQuery}
                  onChange={(e) => setCollectionSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </header>

          {/* Collection Image Grid */}
          <CollectionImageGrid
            collectionId={viewingCollection.id}
            searchQuery={collectionSearchQuery}
            onImageClick={handleCollectionImageClick}
          />
        </>
      ) : (
        <>
          {/* Header */}
          <header className="shrink-0 border-b border-border px-6 py-4 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">收藏集</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  整理和管理你的创作作品
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索收藏集..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleCreate} className="shrink-0">
                  <Plus className="mr-2 size-4" />
                  新建
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin">
            {filteredCollections.length === 0 && !searchQuery ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                  <FolderOpen className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">暂无收藏集</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  创建收藏集来整理你的创作作品
                </p>
                <Button onClick={handleCreate} className="mt-4">
                  <Plus className="mr-2 size-4" />
                  创建第一个收藏集
                </Button>
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                  <Search className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">未找到结果</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  没有找到匹配"{searchQuery}"的收藏集
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <CreateCollectionCard onClick={handleCreate} />
                {filteredCollections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onClick={() => handleCollectionClick(collection)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? '编辑收藏集' : '创建收藏集'}
            </DialogTitle>
            <DialogDescription>
              {editingCollection ? '修改收藏集的信息' : '创建一个新的收藏集来整理你的作品'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                placeholder="输入收藏集名称"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                placeholder="添加收藏集描述（可选）"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                {formData.isPublic ? (
                  <Globe className="size-5 text-foreground" />
                ) : (
                  <Lock className="size-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {formData.isPublic ? '公开' : '私密'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formData.isPublic ? '所有人可以查看' : '仅自己可见'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
              >
                {formData.isPublic ? '设为私密' : '设为公开'}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              {editingCollection ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
