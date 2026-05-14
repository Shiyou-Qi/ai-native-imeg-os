'use client'

import { useState, use, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Menu, X } from 'lucide-react'
import { TopBar } from '@/components/image-detail/top-bar'
import { ImageCanvas } from '@/components/image-detail/image-canvas'
import { RightPanel } from '@/components/image-detail/right-panel'
import { HistoryStrip } from '@/components/image-detail/history-strip'
import { Sidebar } from '@/components/workspace/sidebar'
import { Button } from '@/components/ui/button'
import { useWorkspaceStore } from '@/stores'

// Sidebar page ids that should trigger navigation to home
const NAV_PAGE_IDS = new Set([
  'home', 'templates', 'canvas',
  'my-images', 'collections', 'likes', 'history',
])

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ImageDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { imageDetails, currentPage, setCurrentPage } = useWorkspaceStore()
  const [topBarPrompt, setTopBarPrompt] = useState('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const prevPageRef = useRef(currentPage)

  // Clear sidebar active state on mount (we're on a detail page, not a nav page)
  useEffect(() => {
    setCurrentPage('')
  }, [setCurrentPage])

  // Listen for sidebar navigation clicks — navigate to home
  useEffect(() => {
    // Skip the initial clear-set
    if (prevPageRef.current === currentPage) return
    prevPageRef.current = currentPage

    if (currentPage && NAV_PAGE_IDS.has(currentPage)) {
      router.push('/')
    }
    // Also handle chat history navigation
    if (currentPage?.startsWith('chat-')) {
      router.push('/')
    }
  }, [currentPage, router])

  const imageId = resolvedParams.id
  const image = imageDetails[imageId]

  // If image not found in store, show loading
  if (!image) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden lg:block flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="size-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">加载图片中...</span>
          </motion.div>
        </div>
      </div>
    )
  }

  const handleHistorySelect = (historyId: string) => {
    router.push(`/image/${historyId}`)
  }

  const handleRemix = (newPrompt: string) => {
    setTopBarPrompt(newPrompt)
  }

  const handleSimilarGenerate = (newPrompt: string) => {
    setTopBarPrompt(`与以下相似：${newPrompt}`)
  }

  const handleGenerate = () => {
    console.log('Generate with prompt:', topBarPrompt)
    // In production, this would trigger a new generation
  }

  const handleEdit = () => {
    console.log('Edit image:', image.id)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </Button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* Top Bar */}
        <TopBar
          imageTitle={image.prompt?.slice(0, 30) + '...'}
          promptValue={topBarPrompt}
          onPromptChange={setTopBarPrompt}
          onGenerate={handleGenerate}
        />

        {/* Main Content Area: Two columns */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Image Canvas (takes remaining space) */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <ImageCanvas
                src={image.src}
                alt={image.prompt}
                width={image.width}
                height={image.height}
                isLiked={image.isLiked}
                onLike={() => console.log('Toggle like:', image.id)}
              />
            </div>

            {/* Bottom: History Strip */}
            {image.history && image.history.length > 0 && (
              <HistoryStrip
                history={image.history}
                activeId={imageId}
                onSelect={handleHistorySelect}
              />
            )}
          </div>

          {/* Right: Operations Panel */}
          <div className="hidden w-[340px] flex-shrink-0 xl:block">
            <RightPanel
              prompt={image.prompt}
              likes={image.likes}
              isLiked={image.isLiked}
              author={image.author}
              model={image.model}
              parameters={image.parameters}
              createdAt={image.createdAt}
              onLike={() => console.log('Toggle like:', image.id)}
              onRemix={handleRemix}
              onSimilarGenerate={handleSimilarGenerate}
              onEdit={handleEdit}
            />
          </div>

          {/* Tablet: Collapsible Right Panel */}
          <div className="hidden w-[320px] flex-shrink-0 lg:block xl:hidden">
            <RightPanel
              prompt={image.prompt}
              likes={image.likes}
              isLiked={image.isLiked}
              author={image.author}
              model={image.model}
              parameters={image.parameters}
              createdAt={image.createdAt}
              onLike={() => console.log('Toggle like:', image.id)}
              onRemix={handleRemix}
              onSimilarGenerate={handleSimilarGenerate}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
