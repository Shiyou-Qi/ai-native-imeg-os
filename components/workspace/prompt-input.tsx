'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Paperclip,
  Sparkles,
  Image,
  RectangleHorizontal,
  Settings2,
  Globe,
  RefreshCcw,
  ArrowUp,
  Wand2,
  Check,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface PromptInputProps {
  onSubmit?: (prompt: string) => void
  isLoading?: boolean
  value?: string
  onChange?: (value: string) => void
}

// ── 自动优化 选项 ──────────────────────────────────
const OPTIMIZE_OPTIONS = [
  { id: 'auto', label: '自动优化', description: '智能优化提示词' },
  { id: 'artistic', label: '更艺术', description: '增强创意表达' },
  { id: 'realistic', label: '更写实', description: '倾向于真实感' },
  { id: 'minimal', label: '更简洁', description: '精简提示词' },
  { id: 'none', label: '关闭', description: '不进行优化' },
] as const

// ── 图片数量 选项 ──────────────────────────────────
const IMAGE_COUNT_OPTIONS = [1, 2, 4, 8] as const

// ── 比例 选项 ─────────────────────────────────────
const ASPECT_RATIO_OPTIONS = [
  { value: '1:1', label: '1:1', desc: '正方形' },
  { value: '4:5', label: '4:5', desc: '社交媒体' },
  { value: '3:4', label: '3:4', desc: '竖版' },
  { value: '2:3', label: '2:3', desc: '经典竖版' },
  { value: '16:10', label: '16:10', desc: '宽屏' },
  { value: '16:9', label: '16:9', desc: '视频比例' },
  { value: '21:9', label: '21:9', desc: '超宽电影' },
] as const

// ── 高级设置 选项 ─────────────────────────────────
const QUALITY_OPTIONS = [
  { id: 'hd-portrait', label: '高清竖版', size: '1024×1536', desc: '标准竖版选项' },
  { id: 'hd-landscape', label: '高清横版', size: '1536×1024', desc: '标准横版选项' },
  { id: 'square', label: '正方形', size: '1024×1024', desc: '通用默认选项' },
  { id: '2k', label: '2K / QHD', size: '2560×1440', desc: '常用宽屏格式' },
  { id: '4k', label: '4K / UHD', size: '3840×2160', desc: '实验性高端目标' },
] as const

export function PromptInput({
  onSubmit,
  isLoading = false,
  value: externalValue,
  onChange: externalOnChange,
}: PromptInputProps) {
  const [internalPrompt, setInternalPrompt] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 下拉面板状态
  const [optimizeMode, setOptimizeMode] = useState<string>('auto')
  const [imageCount, setImageCount] = useState<number>(4)
  const [aspectRatio, setAspectRatio] = useState<string>('16:10')
  const [resolution, setResolution] = useState<string>('square')

  // 右侧开关状态
  const [isEnhanced, setIsEnhanced] = useState(true)
  const [isPublic, setIsPublic] = useState(false)

  const isControlled = externalValue !== undefined
  const prompt = isControlled ? externalValue : internalPrompt

  const setPrompt = (val: string) => {
    if (isControlled) {
      externalOnChange?.(val)
    } else {
      setInternalPrompt(val)
    }
  }

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onSubmit?.(prompt)
      setPrompt('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [prompt])

  const currentOptimizeLabel = OPTIMIZE_OPTIONS.find(o => o.id === optimizeMode)?.label ?? 'Auto'

  return (
    <div className="mx-auto w-full max-w-2xl">
      <motion.div
        initial={false}
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px var(--ring)'
            : 'none',
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative rounded-2xl bg-card border-2 border-border',
          'transition-colors duration-200'
        )}
      >
        {/* Input Area */}
        <div className="p-6 pb-4">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="生成新内容或上传编辑..."
            rows={1}
            className={cn(
              'w-full resize-none bg-transparent text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none',
              'text-base leading-relaxed'
            )}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 px-3 pb-3">
          {/* ──────────── 左侧控制按钮组 ──────────── */}
          <div className="flex items-center gap-1">
            {/* 附件 */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-muted-foreground hover:bg-hover-overlay hover:text-foreground"
                  >
                    <Paperclip className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  添加附件 <span className="ml-2 text-muted-foreground">Ctrl+U</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 自动优化 下拉 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 gap-1.5',
                    'hover:bg-hover-overlay hover:text-foreground',
                    optimizeMode !== 'none' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                  )}
                >
                  <Wand2 className="size-4" />
                  <span className="text-xs">{currentOptimizeLabel}</span>
                  <ChevronDown className="size-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1.5">
                <div className="space-y-0.5">
                  {OPTIMIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setOptimizeMode(opt.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                        optimizeMode === opt.id
                          ? 'bg-accent/10 text-accent'
                          : 'text-foreground hover:bg-hover-overlay'
                      )}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.description}</p>
                      </div>
                      {optimizeMode === opt.id && <Check className="size-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* 图片数量 下拉 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-muted-foreground hover:bg-hover-overlay hover:text-foreground"
                >
                  <Image className="size-4" />
                  <span className="text-xs">{imageCount}</span>
                  <ChevronDown className="size-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-44 p-1.5">
                <div className="grid grid-cols-4 gap-1">
                  {IMAGE_COUNT_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setImageCount(n)}
                      className={cn(
                        'flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        imageCount === n
                          ? 'bg-accent/10 text-accent'
                          : 'text-foreground hover:bg-hover-overlay'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* 比例 下拉 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-muted-foreground hover:bg-hover-overlay hover:text-foreground"
                >
                  <RectangleHorizontal className="size-4" />
                  <span className="text-xs">{aspectRatio}</span>
                  <ChevronDown className="size-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1.5">
                <div className="space-y-0.5">
                  {ASPECT_RATIO_OPTIONS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setAspectRatio(r.value)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                        aspectRatio === r.value
                          ? 'bg-accent/10 text-accent'
                          : 'text-foreground hover:bg-hover-overlay'
                      )}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium">
                        {r.value}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                      {aspectRatio === r.value && <Check className="size-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* 高级设置 下拉 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-muted-foreground hover:bg-hover-overlay hover:text-foreground"
                >
                  <Settings2 className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 p-1.5">
                <div className="space-y-0.5">
                  {QUALITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setResolution(opt.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                        resolution === opt.id
                          ? 'bg-accent/10 text-accent'
                          : 'text-foreground hover:bg-hover-overlay'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                      <span className={cn(
                        'shrink-0 text-xs tabular-nums',
                        resolution === opt.id ? 'text-accent font-medium' : 'text-muted-foreground'
                      )}>
                        {opt.size}
                      </span>
                      {resolution === opt.id && <Check className="size-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* ──────────── 右侧控制按钮组 ──────────── */}
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={300}>
              {/* 增强 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEnhanced(!isEnhanced)}
                    className={cn(
                      'h-8',
                      isEnhanced ? 'text-accent' : 'text-muted-foreground',
                      'hover:bg-hover-overlay hover:text-foreground'
                    )}
                  >
                    <Sparkles className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">增强</TooltipContent>
              </Tooltip>

              {/* 公开 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPublic(!isPublic)}
                    className={cn(
                      'h-8',
                      isPublic ? 'text-accent' : 'text-muted-foreground',
                      'hover:bg-hover-overlay hover:text-foreground'
                    )}
                  >
                    <Globe className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">公开</TooltipContent>
              </Tooltip>

              {/* 重新生成 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrompt('')}
                    className="h-8 text-muted-foreground hover:bg-hover-overlay hover:text-foreground"
                  >
                    <RefreshCcw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">重新生成</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              size="icon"
              className={cn(
                'size-8 rounded-full',
                'bg-primary text-primary-foreground',
                'hover:bg-primary/90',
                'disabled:opacity-40',
                'transition-all duration-200'
              )}
            >
              <motion.div
                animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={isLoading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              >
                {isLoading ? (
                  <RefreshCcw className="size-4" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </motion.div>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
