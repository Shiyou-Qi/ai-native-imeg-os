'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Check,
  X,
  Infinity,
  Image,
  Download,
  Heart,
  Crown,
  Shield,
  Users,
  Clock,
  Star,
} from 'lucide-react'
import { useWorkspaceStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const plans = [
  {
    id: 'free',
    name: '免费版',
    price: '0',
    period: '',
    description: '适合入门体验AI创作',
    color: 'border-border',
    accent: '',
    features: [
      { text: '每月 10 次快速生成', included: true },
      { text: '标准画质输出', included: true },
      { text: '基础画布编辑器', included: true },
      { text: '社区探索浏览', included: true },
      { text: '本地保存图片', included: true },
      { text: '高清画质 (4K)', included: false },
      { text: '无限快速生成', included: false },
      { text: '批量生成', included: false },
      { text: '优先队列', included: false },
      { text: '高级画布工具', included: false },
      { text: 'API 访问', included: false },
      { text: '精选模型库', included: false },
    ],
    cta: '当前计划',
  },
  {
    id: 'pro',
    name: '专业版',
    price: '29',
    period: '/月',
    originalPrice: '39',
    description: '适合专业创作者',
    color: 'border-accent ring-1 ring-accent/30',
    accent: 'bg-accent text-accent-foreground',
    popular: true,
    features: [
      { text: '每月 500 次快速生成', included: true },
      { text: '高清画质 (4K)', included: true },
      { text: '无限画布编辑器', included: true },
      { text: '批量生成 (最多8张)', included: true },
      { text: '优先处理队列', included: true },
      { text: '高级编辑工具', included: true },
      { text: '无水印导出', included: true },
      { text: '商业使用授权', included: true },
      { text: 'API 访问 (1000次/月)', included: false },
      { text: '精选模型库', included: false },
      { text: '专属客服', included: false },
      { text: '团队协作', included: false },
    ],
    cta: '升级到专业版',
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: '99',
    period: '/月',
    originalPrice: '129',
    description: '适合团队和企业',
    color: 'border-border',
    accent: '',
    features: [
      { text: '无限快速生成', included: true },
      { text: '8K 超高清画质', included: true },
      { text: '全部高级功能', included: true },
      { text: '无限批量生成', included: true },
      { text: '顶级处理队列', included: true },
      { text: '完整编辑工具套件', included: true },
      { text: '无水印导出', included: true },
      { text: '完整商业授权', included: true },
      { text: 'API 访问 (无限)', included: true },
      { text: '全部精选模型', included: true },
      { text: '专属客户经理', included: true },
      { text: '团队协作 (最多10人)', included: true },
    ],
    cta: '升级到企业版',
  },
]

const faq = [
  { q: '如何切换套餐？', a: '你可以随时在账户设置中升级或降级套餐。降级将在当前计费周期结束后生效。' },
  { q: '快速额度会过期吗？', a: '免费版的月度额度在每月1日重置。专业版和企业版的额度按计费周期重置。' },
  { q: '支持哪些支付方式？', a: '我们支持支付宝、微信支付、银联以及国际信用卡（Visa、Mastercard）。' },
  { q: '可以退款吗？', a: '购买后7天内支持无条件退款。超过7天按使用天数比例退款。' },
]

export function SubscriptionPage() {
  const { setCurrentPage } = useWorkspaceStore()
  const [isAnnual, setIsAnnual] = useState(true)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleUpgrade = useCallback((planId: string) => {
    if (planId === 'free') {
      toast.info('你当前正在使用免费版')
      return
    }
    toast.success('正在跳转到支付页面...', {
      description: `${plans.find(p => p.id === planId)?.name} · ${isAnnual ? '年度' : '月度'}订阅`,
    })
  }, [isAnnual])

  return (
    <main className="flex flex-1 min-w-0 flex-col overflow-y-auto scrollbar-thin">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('home')}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-lg font-semibold">升级会员</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl p-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-accent/10">
            <Crown className="size-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold">解锁创作无限可能</h2>
          <p className="mt-2 text-muted-foreground">
            选择适合你的计划，开启专业AI创作之旅
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 flex items-center justify-center gap-4"
        >
          <Label className={cn('text-sm', !isAnnual && 'text-foreground', isAnnual && 'text-muted-foreground')}>
            月度
          </Label>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <Label className={cn('text-sm', isAnnual && 'text-foreground', !isAnnual && 'text-muted-foreground')}>
            年度
          </Label>
          {isAnnual && (
            <Badge className="gap-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              <Star className="size-3" />
              省 20%
            </Badge>
          )}
        </motion.div>

        {/* Plan Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.1 }}
              className={cn(
                'relative flex flex-col rounded-2xl border-2 bg-card p-6',
                plan.color
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className={cn('shadow-lg', plan.accent)}>
                    <Star className="mr-1 size-3" />
                    最受欢迎
                  </Badge>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    ¥{isAnnual ? Math.floor(Number(plan.price) * 0.8) : plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{isAnnual ? '/月' : plan.period}</span>
                </div>
                {isAnnual && plan.originalPrice && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground line-through">¥{plan.originalPrice}/月</span>
                    <span className="text-xs text-emerald-500">按年付费</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Button
                className={cn('mb-6 w-full gap-2', plan.popular ? '' : '')}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.id === 'free'}
              >
                {plan.id === 'free' ? '当前计划' : (
                  <>
                    <Sparkles className="size-4" />
                    {plan.cta}
                  </>
                )}
              </Button>

              {/* Features */}
              <div className="flex-1 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">包含功能</p>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check className="size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <X className="size-4 shrink-0 text-muted-foreground/30" />
                    )}
                    <span className={cn(!feature.included && 'text-muted-foreground/40')}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 rounded-2xl border border-border bg-card p-8"
        >
          <h3 className="mb-6 text-center text-lg font-bold">为什么选择专业版？</h3>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: '极速生成', desc: '优先处理队列，最快5秒出图，告别排队等待' },
              { icon: Image, title: '高清画质', desc: '支持4K超高清输出，满足商业级印刷需求' },
              { icon: Infinity, title: '无限创作', desc: '每月500次快速生成，不受限制地挥洒创意' },
              { icon: Shield, title: '商业授权', desc: '完整商业使用权，创作成果可用于商业项目' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent/10">
                  <item.icon className="size-6 text-accent" />
                </div>
                <h4 className="mt-3 font-semibold">{item.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 mb-10"
        >
          <h3 className="mb-6 text-center text-lg font-bold">常见问题</h3>
          <div className="mx-auto max-w-2xl space-y-3">
            {faq.map((item, i) => (
              <button
                key={i}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-card/80"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{item.q}</span>
                  <span className={cn(
                    'text-lg text-muted-foreground transition-transform',
                    expandedFaq === i && 'rotate-45'
                  )}>+</span>
                </div>
                {expandedFaq === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 text-sm text-muted-foreground leading-relaxed"
                  >
                    {item.a}
                  </motion.p>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
