'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Heart,
  Bookmark,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageCanvasProps {
  src: string
  alt?: string
  width: number
  height: number
  isLiked?: boolean
  onLike?: () => void
}

export function ImageCanvas({
  src,
  alt,
  width,
  height,
  isLiked = false,
  onLike,
}: ImageCanvasProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [liked, setLiked] = useState(isLiked)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(!liked)
    onLike?.()
  }

  const handleClick = useCallback(() => {
    if (!isFullscreen) {
      setIsZoomed(!isZoomed)
    }
  }, [isZoomed, isFullscreen])

  const handleDoubleClick = useCallback(() => {
    if (!isFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        containerRef.current?.requestFullscreen()
        setIsFullscreen(true)
      }
    }
  }, [isFullscreen])

  const handleFullscreenToggle = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background"
    >
      {/* Image Container */}
      <motion.div
        layout
        className={cn(
          'relative flex items-center justify-center',
          isFullscreen ? 'h-full w-full' : 'p-8'
        )}
      >
        <motion.div
          layout
          animate={{
            scale: isZoomed ? 1.5 : 1,
            transition: { type: 'spring', damping: 25, stiffness: 200 },
          }}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'relative cursor-pointer overflow-hidden',
            !isFullscreen && 'rounded-2xl'
          )}
          style={{
            maxWidth: '100%',
            maxHeight: isFullscreen ? '100vh' : '70vh',
            boxShadow: isZoomed
              ? '0 25px 80px rgba(0,0,0,0.7)'
              : '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Loading Blur Transition */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10 bg-card backdrop-blur-xl"
              />
            )}
          </AnimatePresence>

          {/* Image */}
          <motion.img
            src={src}
            alt={alt || '生成图片'}
            initial={{ filter: 'blur(20px)', scale: 1.1 }}
            animate={{
              filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
              scale: isLoaded ? 1 : 1.1,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onLoad={() => setIsLoaded(true)}
            className="select-none"
            style={{
              maxWidth: '100%',
              maxHeight: isFullscreen ? '100vh' : '70vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
            draggable={false}
          />

          {/* Hover Glow Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered && !isZoomed ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at center, rgba(108,92,231,0.08) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Top Toolbar (overlaid on image area) */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 py-3">
        {/* Left spacer */}

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1.5">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all',
              'bg-black/40 backdrop-blur-sm hover:bg-black/60',
              liked ? 'text-red-400' : 'text-white/80 hover:text-white'
            )}
          >
            <Heart
              className={cn(
                'size-4 transition-colors',
                liked && 'fill-red-400 text-red-400'
              )}
            />
          </button>

          {/* Bookmark */}
          <button className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white">
            <Bookmark className="size-4" />
          </button>

          {/* Zoom Controls */}
          <div className="ml-2 flex items-center gap-0.5 rounded-lg bg-black/40 p-0.5 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsZoomed(false)}
              className={cn(
                'size-7 text-white/60 hover:text-white hover:bg-white/10',
                !isZoomed && 'opacity-50'
              )}
              disabled={!isZoomed}
            >
              <ZoomOut className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsZoomed(true)}
              className={cn(
                'size-7 text-white/60 hover:text-white hover:bg-white/10',
                isZoomed && 'opacity-50'
              )}
              disabled={isZoomed}
            >
              <ZoomIn className="size-3.5" />
            </Button>
            <div className="mx-0.5 h-4 w-px bg-white/10" />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleFullscreenToggle}
              className="size-7 text-white/60 hover:text-white hover:bg-white/10"
            >
              {isFullscreen ? (
                <Minimize2 className="size-3.5" />
              ) : (
                <Maximize2 className="size-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Hint text at bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] text-white/40 backdrop-blur-sm">
          单击放大 · 双击全屏
        </span>
      </div>
    </div>
  )
}
