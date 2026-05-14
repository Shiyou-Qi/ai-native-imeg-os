'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  value?: string
}

export function SearchBar({ placeholder = '搜索社区图片', onSearch, value: externalValue }: SearchBarProps) {
  const [query, setQuery] = useState(externalValue ?? '')
  const [isFocused, setIsFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Sync external value
  useEffect(() => {
    if (externalValue !== undefined) {
      setQuery(externalValue)
    }
  }, [externalValue])

  // Debounced search
  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch?.(value)
    }, 300)
  }

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    onSearch?.(query)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={cn(
        'relative flex items-center rounded-lg border bg-card transition-all duration-200',
        isFocused ? 'border-ring shadow-sm' : 'border-border'
      )}>
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'h-9 border-0 bg-transparent pl-10 pr-9',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            'placeholder:text-muted-foreground text-sm'
          )}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 size-8 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
            type="button"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
    </form>
  )
}
