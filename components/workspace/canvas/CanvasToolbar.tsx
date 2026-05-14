'use client'

import { useCallback } from 'react'
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Play,
  Loader2,
  Grid3X3,
  Download,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCanvasStore } from '@/stores/canvas-store'

interface CanvasToolbarProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  showGrid: boolean
  onToggleGrid: () => void
}

export function CanvasToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitView,
  showGrid,
  onToggleGrid,
}: CanvasToolbarProps) {
  const historyIndex = useCanvasStore((s) => s.historyIndex)
  const historyLength = useCanvasStore((s) => s.history.length)
  const undo = useCanvasStore((s) => s.undo)
  const redo = useCanvasStore((s) => s.redo)
  const workflowStatus = useCanvasStore((s) => s.workflowStatus)
  const runWorkflow = useCanvasStore((s) => s.runWorkflow)
  const nodes = useCanvasStore((s) => s.nodes)
  const edges = useCanvasStore((s) => s.edges)
  const setNodes = useCanvasStore((s) => s.setNodes)
  const setEdges = useCanvasStore((s) => s.setEdges)

  const handleRun = useCallback(() => {
    runWorkflow()
  }, [runWorkflow])

  const handleClear = useCallback(() => {
    setNodes([])
    setEdges([])
  }, [setNodes, setEdges])

  const isRunning = workflowStatus === 'running'
  const hasNodes = nodes.length > 0

  return (
    <div className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
      {/* Left: History & View */}
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>撤销 (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={redo}
                disabled={historyIndex >= historyLength - 1}
              >
                <Redo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>重做 (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-2 h-6 w-px bg-border" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? 'secondary' : 'ghost'}
                size="icon"
                className="size-8"
                onClick={onToggleGrid}
              >
                <Grid3X3 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>显示网格</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Center: Title */}
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">AI 工作流画布</span>
        {hasNodes && (
          <span className="text-xs text-muted-foreground">
            · {nodes.length} 节点 · {edges.length} 连接
          </span>
        )}
      </div>

      {/* Right: Actions & Zoom */}
      <div className="flex items-center gap-1">
        {/* Run workflow button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isRunning ? 'secondary' : 'default'}
                size="sm"
                className="gap-2"
                onClick={handleRun}
                disabled={isRunning || !hasNodes}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    运行中...
                  </>
                ) : (
                  <>
                    <Play className="size-4" />
                    运行工作流
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>运行全部工作流节点</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Clear all */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={handleClear}
                disabled={!hasNodes}
              >
                <Trash2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>清空画布</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Export */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>导出工作流</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Zoom controls */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={onZoomOut}
              >
                <ZoomOut className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>缩小</TooltipContent>
          </Tooltip>

          <span
            className="cursor-pointer text-xs tabular-nums text-muted-foreground hover:text-foreground w-10 text-center"
            onClick={onFitView}
          >
            {zoom}%
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={onZoomIn}
              >
                <ZoomIn className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>放大</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={onFitView}
              >
                <Maximize className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>适应画布</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
