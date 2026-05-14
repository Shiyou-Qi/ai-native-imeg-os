'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useWorkspaceStore } from '@/stores'
import { PromptInput } from './prompt-input'
import { CategoryTabs } from './category-tabs'
import { ExploreTabs } from './explore-tabs'
import { SearchBar } from './search-bar'
import { ImageGrid } from './image-grid'

export function MainContent() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedTab,
    setSelectedTab,
    searchQuery,
    setSearchQuery,
    isGenerating,
    setIsGenerating,
    addGeneration,
  } = useWorkspaceStore()

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsGenerating(true)

    const generationId = `gen-${Date.now()}`
    addGeneration({
      id: generationId,
      prompt,
      images: [],
      status: 'generating',
      createdAt: new Date(),
    })

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsGenerating(false)

    // Update generation with results
    const resultImages = ['/images/sample-1.jpg', '/images/sample-3.jpg']
    const { updateGeneration } = useWorkspaceStore.getState()
    updateGeneration(generationId, {
      images: resultImages,
      status: 'completed',
    })

    toast.success('生成完成', {
      description: `已根据 "${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}" 生成 ${resultImages.length} 张图片`,
      action: {
        label: '查看',
        onClick: () => {
          const { setCurrentPage } = useWorkspaceStore.getState()
          setCurrentPage(`chat-${generationId}`)
        },
      },
    })
  }, [setIsGenerating, addGeneration])

  const handleClearCategory = useCallback(() => {
    setSelectedCategory('general')
  }, [setSelectedCategory])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [setSearchQuery])

  return (
    <main className="flex flex-1 min-w-0 flex-col overflow-y-auto scrollbar-thin">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-16 pb-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-8 text-4xl font-semibold tracking-tight md:text-5xl text-balance">
            你想创作什么?
          </h1>

          <PromptInput onSubmit={handleGenerate} isLoading={isGenerating} />
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CategoryTabs
            defaultSelected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </motion.div>

        {/* Explore Header with Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <ExploreTabs defaultTab={selectedTab} onTabChange={setSelectedTab} />
          <div className="w-full sm:w-64">
            <SearchBar
              value={searchQuery}
              onSearch={setSearchQuery}
              placeholder="搜索图片或作者..."
            />
          </div>
        </motion.div>

        {/* Image Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ImageGrid
            category={selectedCategory}
            tab={selectedTab}
            searchQuery={searchQuery}
          />
        </motion.div>
      </div>
    </main>
  )
}
