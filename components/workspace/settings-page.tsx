'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Palette,
  Bell,
  Lock,
  User,
  Monitor,
  Moon,
  Sun,
  Languages,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react'
import { useWorkspaceStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const settingsSections = [
  {
    id: 'appearance',
    icon: Palette,
    title: '外观',
    description: '自定义界面主题与显示',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: '通知',
    description: '管理通知偏好',
  },
  {
    id: 'privacy',
    icon: Shield,
    title: '隐私与安全',
    description: '管理隐私设置',
  },
  {
    id: 'account',
    icon: User,
    title: '账户',
    description: '管理账户信息',
  },
]

export function SettingsPage() {
  const { setCurrentPage } = useWorkspaceStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('appearance')

  useEffect(() => { setMounted(true) }, [])

  // Appearance settings
  const [language, setLanguage] = useState('zh-CN')
  const [fontSize, setFontSize] = useState('medium')
  const [reducedMotion, setReducedMotion] = useState(false)

  // Notification settings
  const [emailNotify, setEmailNotify] = useState(true)
  const [pushNotify, setPushNotify] = useState(true)
  const [generationComplete, setGenerationComplete] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [newTemplates, setNewTemplates] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(true)
  const [showInExplore, setShowInExplore] = useState(true)
  const [allowDownloads, setAllowDownloads] = useState(true)
  const [saveHistory, setSaveHistory] = useState(true)

  const handleSave = useCallback((section: string) => {
    toast.success(`${settingsSections.find(s => s.id === section)?.title}设置已保存`)
  }, [])

  return (
    <main className="flex flex-1 min-w-0 flex-col overflow-y-auto scrollbar-thin">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('home')}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-lg font-semibold">设置</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl p-6">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden w-56 shrink-0 md:block"
          >
            <div className="sticky top-20 space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    activeSection === section.id
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-hover-overlay hover:text-foreground'
                  )}
                >
                  <section.icon className="size-4" />
                  <div className="text-left">
                    <p>{section.title}</p>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.nav>

          {/* Mobile nav */}
          <div className="md:hidden mb-6">
            <Select value={activeSection} onValueChange={setActiveSection}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settingsSections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Settings Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0 space-y-6"
          >
            {/* ── Appearance ── */}
            {activeSection === 'appearance' && (
              <>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold">主题</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark', label: '深色', icon: Moon },
                      { id: 'light', label: '浅色', icon: Sun },
                      { id: 'system', label: '跟随系统', icon: Monitor },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        suppressHydrationWarning
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors',
                          mounted && theme === t.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground/30'
                        )}
                      >
                        <t.icon className={cn('size-6', mounted && theme === t.id ? 'text-primary' : 'text-muted-foreground')} />
                        <span className="text-sm font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold">显示偏好</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">语言</Label>
                        <p className="text-xs text-muted-foreground">界面显示语言</p>
                      </div>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-36 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zh-CN">简体中文</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">字体大小</Label>
                        <p className="text-xs text-muted-foreground">调整界面字体大小</p>
                      </div>
                      <Select value={fontSize} onValueChange={setFontSize}>
                        <SelectTrigger className="w-28 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">小</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="large">大</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">减少动画</Label>
                        <p className="text-xs text-muted-foreground">降低界面动画效果</p>
                      </div>
                      <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                    </div>
                  </div>
                </div>
                <Button className="gap-2" onClick={() => handleSave('appearance')}>
                  <Check className="size-4" /> 保存外观设置
                </Button>
              </>
            )}

            {/* ── Notifications ── */}
            {activeSection === 'notifications' && (
              <>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold">通知渠道</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="size-4 text-muted-foreground" />
                        <div>
                          <Label className="text-sm">邮件通知</Label>
                          <p className="text-xs text-muted-foreground">通过邮件接收重要通知</p>
                        </div>
                      </div>
                      <Switch checked={emailNotify} onCheckedChange={setEmailNotify} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="size-4 text-muted-foreground" />
                        <div>
                          <Label className="text-sm">推送通知</Label>
                          <p className="text-xs text-muted-foreground">在浏览器中接收推送通知</p>
                        </div>
                      </div>
                      <Switch checked={pushNotify} onCheckedChange={setPushNotify} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold">通知类型</h3>
                  <div className="space-y-4">
                    {[
                      { label: '生成完成', desc: '图片生成完成时通知', value: generationComplete, set: setGenerationComplete },
                      { label: '新模板上线', desc: '有新模板可用时通知', value: newTemplates, set: setNewTemplates },
                      { label: '周报摘要', desc: '每周创作统计摘要', value: weeklyDigest, set: setWeeklyDigest },
                      { label: '营销邮件', desc: '产品更新与活动信息', value: marketingEmails, set: setMarketingEmails },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm">{item.label}</Label>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch checked={item.value} onCheckedChange={item.set} />
                        </div>
                        {i < 3 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="gap-2" onClick={() => handleSave('notifications')}>
                  <Check className="size-4" /> 保存通知设置
                </Button>
              </>
            )}

            {/* ── Privacy & Security ── */}
            {activeSection === 'privacy' && (
              <>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold">隐私设置</h3>
                  <div className="space-y-4">
                    {[
                      { label: '公开个人资料', desc: '允许其他用户查看你的个人主页', value: publicProfile, set: setPublicProfile },
                      { label: '在探索中展示', desc: '你的作品将出现在探索页面', value: showInExplore, set: setShowInExplore },
                      { label: '允许下载', desc: '允许其他用户下载你的作品', value: allowDownloads, set: setAllowDownloads },
                      { label: '保存创作历史', desc: '保存你的生成记录', value: saveHistory, set: setSaveHistory },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm">{item.label}</Label>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch checked={item.value} onCheckedChange={item.set} />
                        </div>
                        {i < 3 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold">安全</h3>
                  <div className="space-y-3">
                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary">
                      <div className="flex items-center gap-3">
                        <Lock className="size-4 text-muted-foreground" />
                        <span>修改密码</span>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </button>
                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary">
                      <div className="flex items-center gap-3">
                        <Shield className="size-4 text-muted-foreground" />
                        <span>两步验证</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">未启用</Badge>
                    </button>
                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary">
                      <div className="flex items-center gap-3">
                        <Monitor className="size-4 text-muted-foreground" />
                        <span>登录设备管理</span>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <Button className="gap-2" onClick={() => handleSave('privacy')}>
                  <Check className="size-4" /> 保存隐私设置
                </Button>
              </>
            )}

            {/* ── Account ── */}
            {activeSection === 'account' && (
              <>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold">账户信息</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">邮箱</Label>
                        <p className="text-sm text-muted-foreground">creative@example.com</p>
                      </div>
                      <Button variant="outline" size="sm">修改</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">会员计划</Label>
                        <p className="text-sm text-muted-foreground">免费版 · 0 额度</p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setCurrentPage('subscription')}>
                        <Sparkles className="size-3.5" />
                        升级
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">数据导出</Label>
                        <p className="text-xs text-muted-foreground">下载你的所有数据</p>
                      </div>
                      <Button variant="outline" size="sm">导出</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                  <h3 className="mb-4 text-sm font-semibold text-destructive">危险操作</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => toast.error('请在弹窗中确认操作')}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="size-4" />
                        <span>删除所有作品</span>
                      </div>
                      <ChevronRight className="size-4" />
                    </button>
                    <button
                      onClick={() => toast.error('请在弹窗中确认操作')}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="size-4" />
                        <span>注销账户</span>
                      </div>
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
