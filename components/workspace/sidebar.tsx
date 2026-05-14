'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Home,
  Sparkles,
  Image,
  FolderOpen,
  Heart,
  LayoutTemplate,
  PenTool,
  ChevronRight,
  Zap,
  Bell,
  MessageSquare,
  Trash2,
  User,
  Crown,
  HelpCircle,
  Settings,
  LogOut,
  PanelLeftClose,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useWorkspaceStore } from '@/stores'
import { toast } from 'sonner'

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
  href?: string
  badge?: string
  children?: { id: string; title: string; date: string }[]
}

interface NavSection {
  title?: string
  items: NavItem[]
}

// 模拟聊天记录数据
const chatHistory = [
  { id: '1', title: '科幻风格海报设计', date: '今天' },
  { id: '2', title: '复古人像摄影', date: '今天' },
  { id: '3', title: '极简Logo创作', date: '昨天' },
  { id: '4', title: '水彩风景插画', date: '昨天' },
  { id: '5', title: '赛博朋克城市', date: '3天前' },
  { id: '6', title: '中国风山水画', date: '上周' },
]

const navigation: NavSection[] = [
  {
    items: [
      { id: 'home', icon: <Home className="size-4" />, label: '首页' },
      { id: 'templates', icon: <LayoutTemplate className="size-4" />, label: '模板', badge: 'NEW' },
      { id: 'canvas', icon: <PenTool className="size-4" />, label: '画布' },
    ],
  },
  {
    title: '资源库',
    items: [
      { id: 'my-images', icon: <Image className="size-4" />, label: '我的图片' },
      { id: 'collections', icon: <FolderOpen className="size-4" />, label: '收藏集' },
      { id: 'likes', icon: <Heart className="size-4" />, label: '我的喜欢' },
    ],
  },
]

function NavItemComponent({ item, isActive, onSelect, collapsed }: { item: NavItem; isActive: boolean; onSelect: (id: string) => void; collapsed: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const { currentPage } = useWorkspaceStore()

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    } else {
      onSelect(item.id)
    }
  }

  const handleChatClick = (chatId: string) => {
    onSelect(`chat-${chatId}`)
  }

  return (
    <div>
      <motion.button
        whileHover={{ x: collapsed ? 0 : 2 }}
        transition={{ duration: 0.12 }}
        onClick={handleClick}
        className={cn(
          'flex w-full items-center rounded-lg py-2 text-sm transition-colors duration-120',
          collapsed ? 'justify-center px-0' : 'gap-3 px-3',
          isActive
            ? 'bg-secondary text-foreground'
            : 'text-muted-foreground hover:bg-hover-overlay hover:text-foreground'
        )}
        title={collapsed ? item.label : undefined}
      >
        <span className="shrink-0">{item.icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="h-5 bg-primary text-primary-foreground text-[10px] px-1.5">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <ChevronRight className={cn(
                'size-4 text-muted-foreground transition-transform duration-200',
                isExpanded && 'rotate-90'
              )} />
            )}
          </>
        )}
      </motion.button>

      {/* 聊天记录二级菜单 */}
      {!collapsed && (
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                {item.children!.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className={cn(
                      "group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer",
                      currentPage === `chat-${chat.id}`
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-hover-overlay hover:text-foreground"
                    )}
                  >
                    <MessageSquare className="size-3 shrink-0" />
                    <span className="flex-1 truncate">{chat.title}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground/60 group-hover:hidden">
                      {chat.date}
                    </span>
                    <button
                      className="hidden shrink-0 rounded p-0.5 hover:bg-destructive/20 hover:text-destructive group-hover:block"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

function CreditDisplay({ collapsed }: { collapsed: boolean }) {
  const user = useWorkspaceStore((s) => s.user)

  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-card">
          <Zap className="size-4 text-accent" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Zap className="size-4 text-accent" />
        <span className="text-sm font-medium">
          {user ? `${user.credits} 快速额度` : '0 快速额度'}
        </span>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        {user ? `${Math.ceil((user.creditsResetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} 天后重置` : '1 天后重置'}
      </p>
      <Button size="sm" className="w-full gap-2" onClick={() => useWorkspaceStore.getState().setCurrentPage('subscription')}>
        <Sparkles className="size-3" />
        升级
      </Button>
    </div>
  )
}

function UserProfile({ collapsed }: { collapsed: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  const { setCurrentPage } = useWorkspaceStore()

  const menuItems = [
    {
      icon: <User className="size-4" />,
      label: '个人资料',
      description: '编辑头像、昵称等信息',
      onClick: () => setCurrentPage('profile'),
    },
    {
      icon: <Crown className="size-4" />,
      label: '升级会员',
      description: '解锁更多创作额度',
      onClick: () => setCurrentPage('subscription'),
      highlight: true,
    },
    {
      icon: <HelpCircle className="size-4" />,
      label: '帮助中心',
      description: '使用指南与常见问题',
      onClick: () => setCurrentPage('help'),
    },
    {
      icon: <Settings className="size-4" />,
      label: '设置',
      description: '偏好设置与账户管理',
      onClick: () => setCurrentPage('settings'),
    },
  ]

  const [isBellOpen, setIsBellOpen] = useState(false)

  const notifications = [
    { id: '1', title: '新模板已上线', desc: '15个全新海报模板', time: '5分钟前', unread: true },
    { id: '2', title: '系统更新公告', desc: '新增画布编辑器功能', time: '2小时前', unread: true },
    { id: '3', title: '创作统计周报', desc: '本周已生成12张图片', time: '昨天', unread: false },
  ]

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center rounded-lg px-2 py-2 transition-colors hover:bg-hover-overlay">
              <Avatar className="size-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=creative" />
                <AvatarFallback>用户</AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" sideOffset={8} className="w-64 p-0 bg-popover border-border">
            <div className="border-b border-border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=creative" />
                  <AvatarFallback>用户</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">创意达人</p>
                  <p className="text-xs text-muted-foreground">creative@example.com</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                <Zap className="size-4 text-accent" />
                <span className="text-xs text-muted-foreground">免费版</span>
                <span className="flex-1" />
                <Badge variant="outline" className="text-[10px] border-accent text-accent">0 额度</Badge>
              </div>
            </div>
            <div className="p-2">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => { item.onClick(); setIsOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    item.highlight ? 'bg-accent/10 text-accent hover:bg-accent/20' : 'text-foreground hover:bg-hover-overlay'
                  )}
                >
                  <div className={cn('flex size-8 items-center justify-center rounded-lg', item.highlight ? 'bg-accent/20' : 'bg-secondary')}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                onClick={() => { useWorkspaceStore.getState().setUser(null); setIsOpen(false) }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-destructive transition-colors hover:bg-destructive/10"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
                  <LogOut className="size-4" />
                </div>
                <span className="text-sm font-medium">退出登录</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover open={isBellOpen} onOpenChange={setIsBellOpen}>
          <PopoverTrigger asChild>
            <button className="relative inline-flex items-center justify-center size-8 rounded-md text-muted-foreground transition-colors hover:bg-hover-overlay hover:text-foreground">
              <Bell className="size-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="center" sideOffset={8} className="w-72 p-0">
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">通知</p>
                <button className="text-xs text-muted-foreground hover:text-foreground">全部已读</button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setIsBellOpen(false)}
                  className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-hover-overlay"
                >
                  <div className="mt-0.5">{n.unread && <div className="size-2 rounded-full bg-accent" />}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/60">{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button onClick={() => setIsBellOpen(false)} className="flex w-full items-center justify-center rounded-md py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-hover-overlay">查看全部通知</button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-hover-overlay">
            <Avatar className="size-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=creative" />
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
            <span className="flex-1 text-left text-sm font-medium">创意达人</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-64 p-0 bg-popover border-border"
        >
        {/* User Info Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=creative" />
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-foreground">创意达人</p>
              <p className="text-xs text-muted-foreground">creative@example.com</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <Zap className="size-4 text-accent" />
            <span className="text-xs text-muted-foreground">免费版</span>
            <span className="flex-1" />
            <Badge variant="outline" className="text-[10px] border-accent text-accent">
              0 额度
            </Badge>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick()
                setIsOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                item.highlight
                  ? 'bg-accent/10 text-accent hover:bg-accent/20'
                  : 'text-foreground hover:bg-hover-overlay'
              )}
            >
              <div className={cn(
                'flex size-8 items-center justify-center rounded-lg',
                item.highlight ? 'bg-accent/20' : 'bg-secondary'
              )}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="border-t border-border p-2">
          <button
            onClick={() => {
              useWorkspaceStore.getState().setUser(null)
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-destructive transition-colors hover:bg-destructive/10"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
              <LogOut className="size-4" />
            </div>
            <span className="text-sm font-medium">退出登录</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
    <Popover open={isBellOpen} onOpenChange={setIsBellOpen}>
      <PopoverTrigger asChild>
        <button className="relative shrink-0 inline-flex items-center justify-center size-8 rounded-md text-muted-foreground transition-colors hover:bg-hover-overlay hover:text-foreground">
          <Bell className="size-4" />
          {notifications.some(n => n.unread) && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" sideOffset={8} className="w-72 p-0">
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">通知</p>
            <button className="text-xs text-muted-foreground hover:text-foreground">
              全部已读
            </button>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => setIsBellOpen(false)}
              className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-hover-overlay"
            >
              <div className="mt-0.5">
                {n.unread && <div className="size-2 rounded-full bg-accent" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">{n.time}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="border-t border-border p-2">
          <button
            onClick={() => setIsBellOpen(false)}
            className="flex w-full items-center justify-center rounded-md py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-hover-overlay"
          >
            查看全部通知
          </button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
  )
}

function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center size-7" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center size-7 rounded-md text-muted-foreground transition-colors hover:bg-hover-overlay hover:text-foreground"
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      suppressHydrationWarning
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

export function Sidebar() {
  const { currentPage, setCurrentPage } = useWorkspaceStore()
  const [collapsed, setCollapsed] = useState(false)
  const [historyExpanded, setHistoryExpanded] = useState(true)

  return (
    <aside className={cn(
      'flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-250',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo + Collapse */}
      <div className={cn(
        'flex h-14 items-center',
        collapsed ? 'justify-center' : 'justify-between px-4'
      )}>
        {!collapsed && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-foreground to-muted-foreground">
                <Sparkles className="size-4 text-background" />
              </div>
              <span className="text-lg font-semibold tracking-tight">创意空间</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="flex items-center justify-center size-7 rounded-md text-muted-foreground transition-colors hover:bg-hover-overlay hover:text-foreground"
              title="折叠侧边栏"
            >
              <PanelLeftClose className="size-4" />
            </button>
          </>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="group flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-foreground to-muted-foreground transition-all hover:rounded-md"
            title="展开侧边栏"
          >
            <Sparkles className="size-4 text-background block group-hover:hidden" />
            <PanelLeftClose className="size-4 text-background hidden group-hover:block rotate-180" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        'flex-1 overflow-y-auto scrollbar-thin py-2',
        collapsed ? 'px-1' : 'px-2'
      )}>
        {navigation.map((section, idx) => (
          <div key={idx} className="mb-4">
            {section.title && !collapsed && (
              <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
                {section.title}
              </h3>
            )}
            <div className={collapsed ? 'flex flex-col items-center gap-1' : 'space-y-0.5'}>
              {section.items.map((item) => (
                <NavItemComponent 
                  key={item.id} 
                  item={item} 
                  isActive={currentPage === item.id}
                  onSelect={setCurrentPage}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}

        {/* History Section */}
        {!collapsed && (
          <div className="mb-4">
            <button
              onClick={() => setHistoryExpanded(!historyExpanded)}
              className="flex w-full items-center gap-1 px-3 mb-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="flex-1 text-left">历史</span>
              <ChevronRight className={cn(
                'size-3.5 transition-transform duration-200',
                historyExpanded && 'rotate-90'
              )} />
            </button>
            <AnimatePresence>
              {historyExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setCurrentPage(`chat-${chat.id}`)}
                        className={cn(
                          'group flex items-center rounded-md px-3 py-1.5 text-xs transition-colors cursor-pointer',
                          currentPage === `chat-${chat.id}`
                            ? 'bg-secondary text-foreground'
                            : 'text-muted-foreground hover:bg-hover-overlay hover:text-foreground'
                        )}
                      >
                        <MessageSquare className="size-3 shrink-0 mr-2" />
                        <span className="flex-1 truncate text-left">{chat.title}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground/50 mr-1">
                          {chat.date}
                        </span>
                        <button
                          className="shrink-0 rounded p-0.5 opacity-0 hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.success('对话已删除', { duration: 2000 })
                          }}
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className={cn(
        'border-t border-sidebar-border',
        collapsed ? 'space-y-1 py-2' : 'space-y-4 p-4'
      )}>
        <CreditDisplay collapsed={collapsed} />
        <UserProfile collapsed={collapsed} />

        {/* Theme Toggle */}
        <div className="flex items-center justify-center">
          <ThemeToggle collapsed={collapsed} />
        </div>
      </div>
    </aside>
  )
}
