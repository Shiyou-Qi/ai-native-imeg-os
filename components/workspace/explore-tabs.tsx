'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
}

const tabs: Tab[] = [
  { id: 'explore', label: '探索' },
  { id: 'following', label: '关注' },
  { id: 'top', label: '热门' },
]

interface ExploreTabsProps {
  defaultTab?: string
  onTabChange?: (id: string) => void
}

export function ExploreTabs({ defaultTab = 'explore', onTabChange }: ExploreTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    onTabChange?.(id)
  }

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={cn(
            'relative rounded-md px-4 py-1.5',
            'text-sm font-medium',
            'transition-colors duration-200',
            activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 rounded-md bg-background shadow-sm"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}
