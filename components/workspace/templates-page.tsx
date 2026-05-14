'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Image,
  FileText,
  Shirt,
  Megaphone,
  Camera,
  Palette,
  Star,
  Clock,
  TrendingUp,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuickCreateBar, type TemplatePreset } from './quick-create-bar'

interface Template {
  id: string
  title: string
  description: string
  category: string
  image: string
  isNew?: boolean
  isHot?: boolean
  usageCount: number
  preset: {
    prompt: string
    style: string
  }
}

interface TemplateCategory {
  id: string
  name: string
  icon: React.ReactNode
  count: number
}

const categories: TemplateCategory[] = [
  { id: 'all', name: '全部', icon: <Sparkles className="size-4" />, count: 128 },
  { id: 'poster', name: '海报', icon: <FileText className="size-4" />, count: 32 },
  { id: 'photography', name: '摄影', icon: <Camera className="size-4" />, count: 24 },
  { id: 'illustration', name: '插画', icon: <Palette className="size-4" />, count: 28 },
  { id: 'logo', name: 'Logo', icon: <Image className="size-4" />, count: 18 },
  { id: 'marketing', name: '营销', icon: <Megaphone className="size-4" />, count: 16 },
  { id: 'fashion', name: '服装', icon: <Shirt className="size-4" />, count: 10 },
]

const templates: Template[] = [
  {
    id: '1',
    title: '科幻电影海报',
    description: '赛博朋克风格，适合科幻、未来主题',
    category: 'poster',
    image: '/images/sample-3.jpg',
    isNew: true,
    usageCount: 2340,
    preset: {
      prompt: '赛博朋克风格科幻电影海报，霓虹灯城市，未来飞行器，雨天夜景，高对比度，Cinematic lighting, 8K',
      style: '赛博朋克',
    },
  },
  {
    id: '2',
    title: '复古人像摄影',
    description: '胶片质感，怀旧色调',
    category: 'photography',
    image: '/images/sample-2.jpg',
    isHot: true,
    usageCount: 5621,
    preset: {
      prompt: '复古胶片风格人像摄影，柔和的自然光线，浅景深，温暖复古色调，柯达Portra 400胶片效果',
      style: '复古胶片',
    },
  },
  {
    id: '3',
    title: '极简品牌Logo',
    description: '简约现代，适合科技品牌',
    category: 'logo',
    image: '/images/sample-6.jpg',
    usageCount: 1823,
    preset: {
      prompt: '极简主义品牌Logo设计，几何图形，现代科技感，单色调，干净线条，矢量风格，白色背景',
      style: '极简主义',
    },
  },
  {
    id: '4',
    title: '自然风光摄影',
    description: '高清风景，唯美色调',
    category: 'photography',
    image: '/images/sample-4.jpg',
    usageCount: 3421,
    preset: {
      prompt: '壮丽自然风光摄影，黄金时刻光线，高山湖泊，云雾缭绕，国家地理风格，超广角',
      style: '自然风光',
    },
  },
  {
    id: '5',
    title: '时尚人像艺术',
    description: '高端时尚，杂志风格',
    category: 'fashion',
    image: '/images/sample-5.jpg',
    isNew: true,
    usageCount: 1256,
    preset: {
      prompt: '时尚杂志封面人像，高级服装，专业影棚灯光，VOGUE风格，优雅姿态，Clean sharp focus',
      style: '时尚杂志',
    },
  },
  {
    id: '6',
    title: '梦幻奇幻插画',
    description: '魔幻风格，适合游戏、小说',
    category: 'illustration',
    image: '/images/sample-1.jpg',
    isHot: true,
    usageCount: 4532,
    preset: {
      prompt: '魔幻风格数字插画，发光的魔法森林，精灵生物，细腻笔触，Artstation trending, fantasy art',
      style: '魔幻插画',
    },
  },
  {
    id: '7',
    title: '社交媒体营销',
    description: '吸睛设计，提升转化',
    category: 'marketing',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format',
    usageCount: 2891,
    preset: {
      prompt: '社交媒体营销视觉设计，醒目CTA按钮，现代平面设计风格，品牌配色，专业商务感，适合Instagram/Facebook',
      style: '社交媒体',
    },
  },
  {
    id: '8',
    title: '产品展示海报',
    description: '简洁大气，突出产品',
    category: 'poster',
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format',
    usageCount: 1987,
    preset: {
      prompt: '产品展示海报设计，极简背景，专业产品摄影，柔和棚拍灯光，高端商业广告风格，留白设计',
      style: '商业产品',
    },
  },
]

const sortOptions = [
  { id: 'popular', name: '最受欢迎', icon: <TrendingUp className="size-4" /> },
  { id: 'newest', name: '最新上线', icon: <Clock className="size-4" /> },
  { id: 'recommended', name: '推荐', icon: <Star className="size-4" /> },
]

function TemplateCard({
  template,
  onUseTemplate,
}: {
  template: Template
  onUseTemplate: (template: Template) => void
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-xl bg-card">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={template.image}
            alt={template.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex gap-1.5">
            {template.isNew && (
              <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5">NEW</Badge>
            )}
            {template.isHot && (
              <Badge className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5">HOT</Badge>
            )}
          </div>
          {/* Use Button */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-200 group-hover:translate-y-0">
            <Button
              size="sm"
              className="w-full gap-2"
              onClick={(e) => {
                e.stopPropagation()
                onUseTemplate(template)
              }}
            >
              <Sparkles className="size-4" />
              使用模板
            </Button>
          </div>
        </div>
        {/* Info */}
        <div
          className="p-3"
          onClick={() => onUseTemplate(template)}
        >
          <h3 className="mb-1 font-medium text-foreground">{template.title}</h3>
          <p className="mb-2 text-xs text-muted-foreground line-clamp-1">{template.description}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="size-3" />
            <span>{template.usageCount.toLocaleString()} 次使用</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [activePreset, setActivePreset] = useState<TemplatePreset | null>(null)

  const handleUseTemplate = useCallback((template: Template) => {
    setActivePreset({
      title: template.title,
      prompt: template.preset.prompt,
      category: template.category,
      image: template.image,
      style: template.preset.style,
    })
  }, [])

  const handleClearPreset = useCallback(() => {
    setActivePreset(null)
  }, [])

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="mb-2 text-3xl font-bold text-foreground">模板中心</h1>
            <p className="text-muted-foreground">
              探索精选模板，快速开启你的创作之旅
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索模板..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-0"
              />
            </div>
            <div className="flex items-center gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedSort === option.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn('gap-1.5', selectedSort === option.id && 'bg-secondary')}
                  onClick={() => setSelectedSort(option.id)}
                >
                  {option.icon}
                  {option.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'gap-1.5',
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border bg-transparent hover:bg-secondary'
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                {category.name}
                <span className="ml-1 text-xs opacity-60">({category.count})</span>
              </Button>
            ))}
          </motion.div>

          {/* Templates Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', activePreset && 'pb-4')}
          >
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-secondary p-4">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">未找到模板</h3>
              <p className="text-sm text-muted-foreground">尝试其他搜索词或浏览其他分类</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Create Bar */}
      <QuickCreateBar preset={activePreset} onClear={handleClearPreset} />
    </div>
  )
}
