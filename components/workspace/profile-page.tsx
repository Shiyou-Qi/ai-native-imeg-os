'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Image,
  Heart,
  Download,
  Sparkles,
  Camera,
  Pencil,
  Check,
  X,
  Zap,
  Activity,
  TrendingUp,
} from 'lucide-react'
import { useWorkspaceStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const stats = [
  { label: '作品', value: '128', icon: Image, color: 'text-blue-500' },
  { label: '点赞', value: '2.4k', icon: Heart, color: 'text-red-500' },
  { label: '下载', value: '856', icon: Download, color: 'text-emerald-500' },
  { label: '创作天数', value: '47', icon: Activity, color: 'text-purple-500' },
]

export function ProfilePage() {
  const { setCurrentPage, user } = useWorkspaceStore()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '创意达人',
    email: 'creative@example.com',
    bio: '热爱AI创作的数字艺术家，专注于探索生成式AI在视觉艺术中的应用。擅长科幻风格与概念设计。',
    website: 'https://portfolio.example.com',
  })

  const handleSave = useCallback(() => {
    setIsEditing(false)
    toast.success('个人资料已更新')
  }, [])

  const handleCancel = useCallback(() => {
    setForm({
      name: user?.name || '创意达人',
      email: 'creative@example.com',
      bio: '热爱AI创作的数字艺术家，专注于探索生成式AI在视觉艺术中的应用。擅长科幻风格与概念设计。',
      website: 'https://portfolio.example.com',
    })
    setIsEditing(false)
  }, [user])

  return (
    <main className="flex flex-1 min-w-0 flex-col overflow-y-auto scrollbar-thin">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('home')}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-lg font-semibold">个人资料</h1>
          <div className="flex-1" />
          {!isEditing ? (
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
              <Pencil className="size-4" />
              编辑资料
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="gap-2" onClick={handleCancel}>
                <X className="size-4" />
                取消
              </Button>
              <Button size="sm" className="gap-2" onClick={handleSave}>
                <Check className="size-4" />
                保存
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl p-6">
        {/* Profile Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-card p-8"
        >
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-accent/10" />
          <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 translate-y-12 rounded-full bg-primary/5" />

          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="size-24 ring-4 ring-background">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=creative" />
                <AvatarFallback><User className="size-10" /></AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                <Camera className="size-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">昵称</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1 h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">简介</Label>
                    <Textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      className="mt-1 min-h-[60px] resize-none text-sm"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{form.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{form.bio}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="size-3" />
                      免费版
                    </Badge>
                    <span className="text-xs text-muted-foreground">Member since 2025</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold">账户信息</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">邮箱</span>
              <span className="flex-1 text-right">{form.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">加入时间</span>
              <span className="flex-1 text-right">2025年3月</span>
            </div>
            {isEditing && (
              <div className="flex items-center gap-3 text-sm">
                <Zap className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">网站</span>
                <Input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="flex-1 h-8 text-sm"
                  placeholder="https://..."
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-4">
              <stat.icon className={cn('size-5', stat.color)} />
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-sm font-semibold">最近活动</h3>
          <div className="space-y-3">
            {[
              { action: '生成了新图片', detail: '科幻风格海报设计', time: '2小时前', icon: Sparkles },
              { action: '收藏了作品', detail: '赛博朋克城市夜景', time: '5小时前', icon: Heart },
              { action: '下载了高清版本', detail: '极简Logo设计', time: '昨天', icon: Download },
              { action: '创作天数 +1', detail: '连续创作第47天', time: '昨天', icon: TrendingUp },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <activity.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
