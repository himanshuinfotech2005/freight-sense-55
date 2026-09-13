'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useVoyage } from '@/lib/voyage-context'
import {
  Activity,
  Anchor,
  BarChart3,
  Bot,
  Calculator,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  FileText,
  Gauge,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Radar,
  Search,
  Ship,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/overview', icon: Gauge },
  { label: 'Voyage Planner', href: '/voyage-planner', icon: Compass },
  { label: 'Freight Forecast', href: '/freight-forecast', icon: BarChart3, badge: 'AI' },
  { label: 'Vessel Optimizer', href: '/vessel-optimizer', icon: Ship },
  { label: 'Port Compatibility', href: '/port-compatibility', icon: Anchor, badge: 'LIVE' },
  { label: 'Risk Intelligence', href: '/risk-intelligence', icon: Radar },
  { label: 'Cost Optimization', href: '/cost-optimization', icon: Calculator },
  { label: 'Charter Strategy', href: '/charter-strategy', icon: Target, badge: 'ACTIVE' },
  { label: 'What-If Simulator', href: '/what-if-simulator', icon: SlidersHorizontal },
  { label: 'Reports', href: '/reports', icon: FileText },
]

export default function VoyageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')
  const { state, outputs } = useVoyage()

  const active = pathname === '/' ? '/overview' : pathname
  const current = navItems.find((item) => item.href === active) ?? navItems[0]

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#0b1f3a]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[286px] flex-col bg-[#0b1f3a] text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[74px] items-center justify-between border-b border-white/10 px-6">
          <div>
            <div className="flex items-center gap-2 text-xl font-extrabold tracking-[-.04em]">
              <span className="flex size-7 items-center justify-center rounded-md bg-[#087cb8]">
                <Anchor className="size-4" />
              </span>
              VOYAGE
              <span className="text-[#58c7b3]">IQ</span>
            </div>
            <div className="mt-1 text-[9px] font-semibold tracking-[.18em] text-white/45">
              MARITIME AI DECISION SUPPORT
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden">
            <X className="size-5 text-white/60" />
          </button>
        </div>

        <div className="px-5 py-5">
          <button
            onClick={() => showToast('New fixture simulation opened')}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#087cb8] px-3 py-3 text-xs font-semibold shadow-lg shadow-black/10"
          >
            <Sparkles className="size-4" /> New Fixture Simulation
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {navItems.map(({ label, href, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`group mb-1 flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-xs font-medium transition ${
                active === href
                  ? 'border-[#58c7b3] bg-white text-[#0b1f3a]'
                  : 'border-transparent text-white/65 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon
                className={`size-4 ${
                  active === href ? 'text-[#087cb8]' : 'text-white/45 group-hover:text-white'
                }`}
              />
              <span className="flex-1">{label}</span>
              {badge && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wide ${
                    active === href ? 'bg-[#e7f8f2] text-[#087d69]' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-md bg-white/5 p-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#087cb8]/20">
              <Activity className="size-4 text-[#58c7b3]" />
            </div>
            <div className="flex-1 text-[11px]">
              <div className="font-semibold text-white">LIVE DATA</div>
              <div className="text-white/55">All systems nominal</div>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-[#071426]/50 lg:hidden"
        />
      )}

      <div className="lg:pl-[286px]">
        <header className="sticky top-0 z-20 border-b border-[#d8dee8] bg-white/95 backdrop-blur">
          <div className="flex h-[66px] items-center gap-3 px-4 md:px-7">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden">
              <Menu className="size-5 text-[#0b1f3a]" />
            </button>
            <div className="hidden items-center gap-2 text-xs text-[#718095] md:flex">
              <span className="font-semibold text-[#0b1f3a]">VoyageIQ</span>
              <ChevronRight className="size-3" />
              <span>{current.label}</span>
              <ChevronRight className="size-3" />
              <span className="font-mono text-[#0b8ca2]">IDN → PAR</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-md border border-[#e0e7ef] bg-[#fbfcfe] px-3 py-2 text-xs text-[#9aa6b5] xl:flex">
                <Search className="size-4" /> Search fixtures, vessels, ports, IMO...
              </div>
              <button className="hidden rounded-md p-2 text-[#708096] hover:bg-[#f1f5f9] sm:block">
                <CircleHelp className="size-4" />
              </button>
              <div className="hidden h-7 w-px bg-[#e3e8ef] sm:block" />
              <button
                onClick={() => showToast('Charter execution queued for review')}
                className="hidden items-center gap-2 rounded-md bg-[#0b1f3a] px-3 py-2 text-[11px] font-semibold text-white sm:flex"
              >
                <Zap className="size-3.5 text-[#58c7b3]" /> Execute Fixture
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-7">{children}</main>

        {toast && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md bg-[#0b1f3a] px-4 py-3 text-xs text-white shadow-lg">
            <Check className="size-3.5 text-[#58c7b3]" />
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}
