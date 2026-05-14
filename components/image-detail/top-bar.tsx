'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PromptInput } from '@/components/workspace/prompt-input'

interface TopBarProps {
  imageTitle?: string
  promptValue?: string
  onPromptChange?: (value: string) => void
  onGenerate?: () => void
  onBack?: () => void
}

export function TopBar({
  imageTitle,
  promptValue = '',
  onPromptChange,
  onGenerate,
}: TopBarProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  // Auto-expand when prompt has content (triggered by 重混/相似生成)
  useEffect(() => {
    if (promptValue.trim().length > 0) {
      setIsExpanded(true)
    }
  }, [promptValue])

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = useCallback((_prompt: string) => {
    onGenerate?.()
  }, [onGenerate])

  const handlePillClick = () => {
    setIsExpanded(true)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-50 flex items-start gap-4 border-b border-border/50 bg-background/60 px-4 py-3 backdrop-blur-xl"
    >
      {/* Left: Back + Breadcrumb */}
      <div className="flex items-center gap-2 pt-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="size-9 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Button>

        {imageTitle && (
          <>
            <ChevronRight className="size-4 text-muted-foreground/40" />
            <span className="truncate text-sm text-muted-foreground max-w-[180px]">
              {imageTitle}
            </span>
          </>
        )}
      </div>

      {/* Center: Collapsed Pill / Expanded PromptInput */}
      <div className="hidden flex-1 max-w-2xl sm:block">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Collapsed: rounded pill */
            <motion.button
              key="pill"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={handlePillClick}
              className="flex w-full items-center gap-2.5 rounded-full border border-border/50 bg-input px-4 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-border hover:text-foreground cursor-text"
            >
              <Search className="size-4 shrink-0" />
              <span className="truncate">输入 Prompt 探索更多...</span>
            </motion.button>
          ) : (
            /* Expanded: full PromptInput */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <PromptInput
                value={promptValue}
                onChange={onPromptChange}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right spacer to balance layout */}
      <div className="hidden w-9 shrink-0 sm:block" />
    </motion.header>
  )
}
