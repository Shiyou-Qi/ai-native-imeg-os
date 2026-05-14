'use client'

import { useCallback } from 'react'
import {
  X,
  Trash2,
  Image,
  SlidersHorizontal,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCanvasStore, type NodeData } from '@/stores/canvas-store'

interface PropertiesPanelProps {
  isOpen: boolean
  onClose: () => void
}

const models = [
  { value: 'stable-diffusion-xl', label: 'Stable Diffusion XL' },
  { value: 'stable-diffusion-3', label: 'Stable Diffusion 3' },
  { value: 'dall-e-3', label: 'DALL-E 3' },
  { value: 'midjourney-v6', label: 'Midjourney V6' },
  { value: 'flux-pro', label: 'Flux Pro' },
]

const operations = [
  { value: 'remove-bg', label: '背景移除' },
  { value: 'upscale', label: '超分辨率' },
  { value: 'filter', label: '滤镜效果' },
  { value: 'inpaint', label: '局部重绘' },
  { value: 'outpaint', label: '扩展画面' },
]

const modalities = [
  { value: 'image-to-text', label: '图生文' },
  { value: 'text-to-image', label: '文生图' },
  { value: 'image-to-image', label: '图生图' },
  { value: 'text-to-video', label: '文生视频' },
]

export function PropertiesPanel({ isOpen, onClose }: PropertiesPanelProps) {
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId)
  const nodes = useCanvasStore((s) => s.nodes)
  const updateNodeData = useCanvasStore((s) => s.updateNodeData)
  const removeNode = useCanvasStore((s) => s.removeNode)

  const node = nodes.find((n) => n.id === selectedNodeId)
  const data = node?.data as NodeData | undefined

  const handleChange = useCallback(
    (field: keyof NodeData, value: unknown) => {
      if (selectedNodeId) {
        updateNodeData(selectedNodeId, { [field]: value })
      }
    },
    [selectedNodeId, updateNodeData]
  )

  // Empty state
  if (!selectedNodeId || !node || !data) {
    return (
      <div className="flex h-full flex-col border-l border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold">节点属性</span>
          </div>
          <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="p-6 text-center">
            <Layers className="mx-auto size-8 text-muted-foreground/30" />
            <p className="mt-2 text-sm text-muted-foreground">选择一个节点以编辑属性</p>
          </div>
        </div>
      </div>
    )
  }

  const nodeType = data.nodeType

  return (
    <div className="flex h-full flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">节点属性</span>
        </div>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Label */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">名称</Label>
          <Input
            value={data.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        {/* Common properties based on node type */}
        {(nodeType === 'textInput' || nodeType === 'imageGenerator' || nodeType === 'imageEditor' || nodeType === 'multimodal') && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">提示词 (Prompt)</Label>
              <Textarea
                value={data.prompt ?? ''}
                onChange={(e) => handleChange('prompt', e.target.value)}
                placeholder="输入提示词..."
                className="min-h-[80px] text-sm resize-none"
              />
            </div>

            {(nodeType === 'imageGenerator' || nodeType === 'multimodal') && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">负面提示词</Label>
                <Textarea
                  value={data.negativePrompt ?? ''}
                  onChange={(e) => handleChange('negativePrompt', e.target.value)}
                  placeholder="不想出现的内容..."
                  className="min-h-[60px] text-sm resize-none"
                />
              </div>
            )}
          </>
        )}

        {/* Model selection for generation nodes */}
        {(nodeType === 'imageGenerator' || nodeType === 'multimodal') && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">模型</Label>
              <Select
                value={data.model ?? 'stable-diffusion-xl'}
                onValueChange={(v) => handleChange('model', v)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">尺寸</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={data.width ?? 1024}
                  onChange={(e) => handleChange('width', Number(e.target.value))}
                  className="h-8 text-sm"
                  placeholder="宽度"
                />
                <span className="text-muted-foreground self-center">x</span>
                <Input
                  type="number"
                  value={data.height ?? 1024}
                  onChange={(e) => handleChange('height', Number(e.target.value))}
                  className="h-8 text-sm"
                  placeholder="高度"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                采样步数: {data.steps ?? 30}
              </Label>
              <Slider
                value={[data.steps ?? 30]}
                onValueChange={([v]) => handleChange('steps', v)}
                min={10}
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                CFG Scale: {data.guidance ?? 7.5}
              </Label>
              <Slider
                value={[data.guidance ?? 7.5]}
                onValueChange={([v]) => handleChange('guidance', v)}
                min={1}
                max={20}
                step={0.5}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">随机种子 (-1 = 随机)</Label>
              <Input
                type="number"
                value={data.seed ?? -1}
                onChange={(e) => handleChange('seed', Number(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
          </>
        )}

        {/* Operation for image editor */}
        {nodeType === 'imageEditor' && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">编辑操作</Label>
            <Select
              value={data.operation ?? 'remove-bg'}
              onValueChange={(v) => handleChange('operation', v)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operations.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Modality for multimodal */}
        {nodeType === 'multimodal' && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">模态</Label>
            <Select
              value={data.modality ?? 'image-to-text'}
              onValueChange={(v) => handleChange('modality', v)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modalities.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Image URL input */}
        {(nodeType === 'imageInput' || nodeType === 'imageEditor' || nodeType === 'multimodal') && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">图片 URL</Label>
            <Input
              value={data.imageUrl ?? ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://..."
              className="h-8 text-sm"
            />
            {data.imageUrl && (
              <div className="overflow-hidden rounded-lg ring-1 ring-border">
                <img
                  src={data.imageUrl}
                  alt="Input"
                  className="h-20 w-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Image upload area for image input */}
        {nodeType === 'imageInput' && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">上传图片</Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-4 text-center transition-colors hover:border-muted-foreground/30 cursor-pointer">
              <div>
                <Image className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">
                  拖放或点击上传
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (selectedNodeId) {
                removeNode(selectedNodeId)
                onClose()
              }
            }}
          >
            <Trash2 className="size-3.5" />
            删除节点
          </Button>
        </div>
      </div>
    </div>
  )
}
