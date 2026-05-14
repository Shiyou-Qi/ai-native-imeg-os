'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  X,
  Copy,
  Download,
  Heart,
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
import { PromptInput } from './prompt-input'
import { toast } from 'sonner'

export interface TemplatePreset {
  title: string
  prompt: string
  category: string
  image?: string
  style?: string
}

interface QuickCreateBarProps {
  preset: TemplatePreset | null
  onClear: () => void
}

const sampleResults = [
  '/images/sample-1.jpg',
  '/images/sample-2.jpg',
  '/images/sample-3.jpg',
  '/images/sample-4.jpg',
]

export function QuickCreateBar({ preset, onClear }: QuickCreateBarProps) {
  const [promptValue, setPromptValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<string[]>([])

  // Auto-fill prompt when template preset changes
  useEffect(() => {
    if (preset) {
      setPromptValue(preset.prompt)
      setResults([])
    }
  }, [preset])

  const handleGenerate = useCallback(async (submittedPrompt: string) => {
    if (!submittedPrompt.trim() || isGenerating) return

    setIsGenerating(true)
    setResults([])

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setResults(sampleResults.slice(0, 4))
    setIsGenerating(false)

    const title = preset?.title ?? '自由创作'
    toast.success('生成完成', {
      description: `已根据"${title}"生成 4 张图片`,
    })
  }, [isGenerating, preset])

  return (
    <div className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-4">
        {/* Active template indicator */}
        <AnimatePresence>
          {preset && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                {preset.image && (
                  <img
                    src={preset.image}
                    alt=""
                    className="size-8 shrink-0 rounded-lg object-cover ring-1 ring-border"
                  />
                )}
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{preset.title}</span>
                  <Badge variant="secondary" className="text-[10px]">{preset.category}</Badge>
                  {preset.style && (
                    <Badge variant="outline" className="text-[10px]">{preset.style}</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">提示词和参数已自动填充</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-7 shrink-0"
                  onClick={onClear}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt input — always visible */}
        <PromptInput
          value={promptValue}
          onChange={setPromptValue}
          onSubmit={handleGenerate}
          isLoading={isGenerating}
        />

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">生成结果</span>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7">
                        <Download className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>下载全部</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className={cn(
                'grid gap-2',
                results.length <= 2 ? 'grid-cols-2' : 'grid-cols-4'
              )}>
                {results.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-xl ring-1 ring-border"
                  >
                    <img
                      src={src}
                      alt={`Result ${i + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="icon" variant="secondary" className="size-7">
                        <Download className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="secondary" className="size-7">
                        <Heart className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="secondary" className="size-7">
                        <Copy className="size-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
