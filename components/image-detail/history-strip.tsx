'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HistoryItem {
  id: string
  src: string
  prompt: string
  createdAt: Date
  isActive?: boolean
}

interface HistoryStripProps {
  history: HistoryItem[]
  activeId: string
  onSelect: (id: string) => void
}

export function HistoryStrip({
  history,
  activeId,
  onSelect,
}: HistoryStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    return () => el.removeEventListener('scroll', checkScroll)
  }, [history])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 240
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (!history || history.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative border-t border-border/50 bg-background"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
        <Clock className="size-3.5 text-muted-foreground" />
        <span
          className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase"
        >
          历史版本
        </span>
        <span className="text-[10px] text-muted-foreground/60">
          ({history.length})
        </span>
      </div>

      <div className="relative px-4 pb-3">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white/80 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}

        {/* Scrollable Thumbnails */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-1"
        >
          {history.map((item, idx) => (
            <motion.button
              key={item.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(item.id)}
              className={cn(
                'relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200',
                'ring-1 ring-transparent hover:ring-white/20',
                item.id === activeId && 'ring-2 ring-ring'
              )}
              style={{
                width: 80,
                height: 80,
              }}
            >
              <img
                src={item.src}
                alt={`版本 ${idx + 1}`}
                className="size-full object-cover"
                loading="lazy"
              />

              {/* Version indicator */}
              <div
                className={cn(
                  'absolute bottom-0 left-0 right-0 px-1 py-0.5 text-[9px] font-medium text-white/80',
                  item.id === activeId
                    ? 'bg-gradient-to-t from-ring/80 to-transparent'
                    : 'bg-gradient-to-t from-black/60 to-transparent'
                )}
              >
                v{idx + 1}
              </div>

              {/* Active indicator */}
              {item.id === activeId && (
                <div className="absolute inset-0 rounded-lg ring-1 ring-ring/50" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white/80 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
