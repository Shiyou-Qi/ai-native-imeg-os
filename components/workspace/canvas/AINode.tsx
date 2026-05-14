'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'
import {
  Type,
  Image,
  Sparkles,
  Pencil,
  Brain,
  Download,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type NodeData, type NodeType, nodeTypeConfig } from '@/stores/canvas-store'

const iconMap: Record<NodeType, React.ComponentType<{ className?: string }>> = {
  textInput: Type,
  imageInput: Image,
  imageGenerator: Sparkles,
  imageEditor: Pencil,
  multimodal: Brain,
  output: Download,
}

export const AINode = memo(function AINode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as NodeData
  const config = nodeTypeConfig[nodeData.nodeType]
  const color = config?.color ?? '#666'

  const Icon = iconMap[nodeData.nodeType]
  const hasInput = nodeData.nodeType !== 'textInput' && nodeData.nodeType !== 'imageInput'
  const hasOutput = nodeData.nodeType !== 'output'

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'group relative rounded-xl border-2 bg-card shadow-lg transition-shadow min-w-[220px]',
        selected ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : 'border-border hover:border-muted-foreground/30'
      )}
      style={{ borderColor: selected ? undefined : `${color}40` }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 rounded-t-[10px] px-3 py-2.5"
        style={{ backgroundColor: `${color}18`, borderBottom: `1px solid ${color}30` }}
      >
        <div
          className="flex size-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}30`, color }}
        >
          {Icon ? <Icon className="size-4" /> : <Brain className="size-4" />}
        </div>
        <span className="flex-1 text-sm font-semibold">{nodeData.label}</span>

        {/* Processing indicator */}
        {nodeData.isProcessing && (
          <Loader2 className="size-4 animate-spin" style={{ color }} />
        )}

        {/* Result indicator */}
        {nodeData.resultUrl && !nodeData.isProcessing && (
          <div className="size-2 rounded-full bg-emerald-500" title="处理完成" />
        )}
      </div>

      {/* Body */}
      <div className="space-y-2 px-3 py-2.5">
        {/* Description or prompt preview */}
        {nodeData.prompt ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {nodeData.prompt}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/60">
            {nodeData.description ?? config?.description}
          </p>
        )}

        {/* Image preview */}
        {nodeData.imageUrl && nodeData.nodeType !== 'output' && (
          <div className="overflow-hidden rounded-lg">
            <img
              src={nodeData.imageUrl}
              alt="Preview"
              className="h-24 w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* Result preview */}
        {nodeData.resultUrl && (
          <div className="overflow-hidden rounded-lg ring-2 ring-emerald-500/40">
            <img
              src={nodeData.resultUrl}
              alt="Result"
              className="h-32 w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* Progress bar */}
        {nodeData.isProcessing && (
          <div className="overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-1.5 rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${nodeData.progress ?? 0}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Model info */}
        {nodeData.model && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3" />
            <span>{nodeData.model}</span>
            {nodeData.steps && <span className="opacity-50">· {nodeData.steps} steps</span>}
          </div>
        )}
      </div>

      {/* Input Handle */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          id={`${id}-input`}
          className="!size-3 !border-2 !border-muted-foreground !bg-background hover:!bg-primary transition-colors"
          style={{ left: -6 }}
        />
      )}

      {/* Output Handle */}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-output`}
          className="!size-3 !border-2 !border-muted-foreground !bg-background hover:!bg-primary transition-colors"
          style={{ right: -6 }}
        />
      )}
    </motion.div>
  )
})
