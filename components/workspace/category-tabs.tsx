'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  label: string
  image?: string
}

const categories: Category[] = [
  { id: 'general', label: '通用', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&auto=format' },
  { id: 'poster', label: '海报', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop&auto=format' },
  { id: 'photography', label: '摄影', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop&auto=format' },
  { id: 'tshirt', label: 'T恤', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&auto=format' },
  { id: 'logo', label: 'Logo', image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&auto=format' },
  { id: 'marketing', label: '营销', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&auto=format' },
  { id: 'print', label: '印刷', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop&auto=format' },
]

interface CategoryTabsProps {
  defaultSelected?: string
  onSelect?: (id: string) => void
}

export function CategoryTabs({ defaultSelected = 'general', onSelect }: CategoryTabsProps) {
  const [selected, setSelected] = useState(defaultSelected)

  const handleSelect = (id: string) => {
    setSelected(id)
    onSelect?.(id)
  }

  return (
    <div className="flex items-center justify-center gap-3 overflow-x-auto scrollbar-hide py-4 px-1">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => handleSelect(category.id)}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'relative flex items-center rounded-2xl overflow-hidden',
            'transition-all duration-200',
            'border',
            selected === category.id
              ? 'border-border bg-card shadow-md'
              : 'border-transparent hover:border-border/50 hover:bg-card/50'
          )}
        >
          {/* Banner Image */}
          <div className="relative w-16 h-12 shrink-0 overflow-hidden">
            <img
              src={category.image}
              alt={category.label}
              className="size-full object-cover"
            />
            {selected === category.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
            )}
          </div>
          
          {/* Label */}
          <span className={cn(
            'px-3 py-2 text-sm font-medium whitespace-nowrap',
            selected === category.id ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {category.label}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
