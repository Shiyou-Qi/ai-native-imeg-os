'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Type,
  Image,
  Sparkles,
  Pencil,
  Brain,
  Download,
  Search,
  ChevronDown,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  type NodeType,
  nodeTypeConfig,
} from '@/stores/canvas-store'

const categories: { id: string; label: string }[] = [
  { id: 'input', label: '输入' },
  { id: 'generation', label: '生成' },
  { id: 'editing', label: '编辑' },
  { id: 'multimodal', label: '多模态' },
  { id: 'output', label: '输出' },
]

const iconMap: Record<NodeType, React.ComponentType<{ className?: string }>> = {
  textInput: Type,
  imageInput: Image,
  imageGenerator: Sparkles,
  imageEditor: Pencil,
  multimodal: Brain,
  output: Download,
}

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [search, setSearch] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>('input')

  const nodeTypes = Object.entries(nodeTypeConfig) as [NodeType, typeof nodeTypeConfig[NodeType]][]

  const filteredTypes = search
    ? nodeTypes.filter(
        ([, config]) =>
          config.label.toLowerCase().includes(search.toLowerCase()) ||
          config.description.toLowerCase().includes(search.toLowerCase())
      )
    : nodeTypes

  const groupedByCategory = filteredTypes.reduce(
    (acc, [type, config]) => {
      const cat = config.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push({ type, config })
      return acc
    },
    {} as Record<string, { type: NodeType; config: typeof nodeTypeConfig[NodeType] }[]>
  )

  const handleDragStart = (event: React.DragEvent, type: NodeType) => {
    event.dataTransfer.setData('application/reactflow-type', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Search */}
      <div className="border-b border-border px-3 py-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索节点..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-7 text-xs"
          />
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <div className="space-y-1">
          {categories.map((category) => {
            const nodes = groupedByCategory[category.id]
            if (!nodes || nodes.length === 0) return null

            const isExpanded = expandedCategory === category.id

            return (
              <div key={category.id}>
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : category.id)
                  }
                  className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
                >
                  <ChevronDown
                    className={cn(
                      'size-3 transition-transform',
                      isExpanded && 'rotate-0',
                      !isExpanded && '-rotate-90'
                    )}
                  />
                  {category.label}
                  <span className="ml-auto opacity-50">{nodes.length}</span>
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-1 pl-2"
                  >
                    {nodes.map(({ type, config }) => {
                      const Icon = iconMap[type]
                      return (
                        <div
                          key={type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, type)}
                          onClick={() => onAddNode(type)}
                          className="group flex cursor-grab items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-secondary active:cursor-grabbing"
                        >
                          <div
                            className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${config.color}20`,
                              color: config.color,
                            }}
                          >
                            {Icon ? <Icon className="size-3.5" /> : <Plus className="size-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium">{config.label}</div>
                            <div className="truncate text-[10px] text-muted-foreground">
                              {config.description}
                            </div>
                          </div>
                          <Plus className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
