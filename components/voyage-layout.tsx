'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useVoyage } from '@/lib/voyage-context'
import type { Congestion, MarketCondition, VesselType } from '@/lib/engines'
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

function calculatePreview(draft: ReturnType<typeof useVoyage>['state'], current: ReturnType<typeof useVoyage>['state'], result: ReturnType<typeof useVoyage>['result']) {
  const cargoDelta = draft.cargoQuantity - current.cargoQuantity
  const freightDelta = Math.round((Math.abs(cargoDelta) / Math.max(current.cargoQuantity, 1)) * 100)
  const riskDelta = draft.portCongestion !== current.portCongestion ? 8 : Math.round(Math.abs(cargoDelta) / 10000)
  const vessel = draft.vesselPreference === 'Auto Select' ? result.selected.name : draft.vesselPreference
  return { freightDelta, riskDelta, vessel }
}

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
  const { state, result, outputs, updateState, reset } = useVoyage()
  const [inputsOpen, setInputsOpen] = useState(false)
  const [draft, setDraft] = useState(state)

  useEffect(() => {
    if (!inputsOpen) setDraft(state)
  }, [state, inputsOpen])

  const active = pathname === '/' ? '/overview' : pathname
  const preview = calculatePreview(draft, state, result)
  const applyInputs = () => {
    updateState(draft)
    setInputsOpen(false)
    showToast('Scenario updated')
  }
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
                onClick={() => { setDraft(state); setInputsOpen(true) }}
                className="flex items-center gap-2 rounded-md border border-[#cbd9e7] bg-white px-3 py-2 text-[11px] font-semibold text-[#0b1f3a]"
              >
                <SlidersHorizontal className="size-3.5 text-[#087cb8]" /> Edit Inputs
              </button>
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

        {inputsOpen && (
          <>
            <button aria-label="Close scenario inputs" onClick={() => setInputsOpen(false)} className="fixed inset-0 z-40 bg-[#071426]/35" />
            <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[430px] flex-col border-l border-[#d8dee8] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#e7edf3] px-6 py-5">
                <div><div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#087cb8]">Scenario control</div><h2 className="mt-1 text-lg font-bold text-[#0b1f3a]">Edit voyage inputs</h2></div>
                <button aria-label="Close" onClick={() => setInputsOpen(false)} className="rounded-md p-2 text-[#718095] hover:bg-[#f1f5f9]"><X className="size-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid gap-4">
                  <label className="flex flex-col gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#718095]">Origin Port<input value={draft.origin} onChange={(e) => setDraft({ ...draft, origin: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#0b1f3a] outline-none focus:border-[#087cb8]" /></label>
                  <label className="flex flex-col gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#718095]">Destination Port<input value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#0b1f3a] outline-none focus:border-[#087cb8]" /></label>
                  <div className="grid grid-cols-2 gap-3"><label className="flex flex-col gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#718095]">Commodity<input value={draft.commodity} onChange={(e) => setDraft({ ...draft, commodity: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#0b1f3a] outline-none focus:border-[#087cb8]" /></label><label className="flex flex-col gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#718095]">Cargo MT<input type="number" min="1" value={draft.cargoQuantity} onChange={(e) => setDraft({ ...draft, cargoQuantity: Math.max(1, Number(e.target.value) || 1) })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 font-mono text-sm font-normal normal-case tracking-normal text-[#0b1f3a] outline-none focus:border-[#087cb8]" /></label></div>
                  <label className="flex flex-col gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#718095]">Preferred Vessel<select value={draft.vesselPreference} onChange={(e) => setDraft({ ...draft, vesselPreference: e.target.value as VesselType })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#0b1f3a] outline-none focus:border-[#087cb8]"><option>Auto Select</option><option>Handysize</option><option>Supramax</option><option>Panamax</option><option>Capesize</option></select></label>
                  <div className="grid grid-cols-2 gap-3"><label className="flex flex-col gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#718095]">Market<select value={draft.marketCondition} onChange={(e) => setDraft({ ...draft, marketCondition: e.target.value as MarketCondition })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#0b1f3a] outline-none focus:border-[#087cb8]"><option>Falling</option><option>Stable</option><option>Rising</option></select></label><label className="flex flex-col gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#718095]">Congestion<select value={draft.portCongestion} onChange={(e) => setDraft({ ...draft, portCongestion: e.target.value as Congestion })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#0b1f3a] outline-none focus:border-[#087cb8]"><option>Low</option><option>Medium</option><option>High</option></select></label></div>
                  <label className="flex flex-col gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-[#718095]">Vessel Availability: {draft.vesselAvailability}%<input type="range" min="10" max="95" value={draft.vesselAvailability} onChange={(e) => setDraft({ ...draft, vesselAvailability: Number(e.target.value) })} className="accent-[#087cb8]" /></label>
                </div>
                <div className="mt-6 rounded-md border border-[#cfe5e1] bg-[#f1fbf8] p-4"><div className="text-[10px] font-bold uppercase tracking-[.12em] text-[#087d69]">Scenario impact preview</div><div className="mt-3 grid grid-cols-3 gap-2 text-center"><div><div className="font-mono text-sm font-semibold text-[#0b1f3a]">{preview.freightDelta > 0 ? '+' : ''}{preview.freightDelta}%</div><div className="text-[10px] text-[#718095]">Freight</div></div><div><div className="font-mono text-sm font-semibold text-[#0b1f3a]">+{preview.riskDelta}</div><div className="text-[10px] text-[#718095]">Risk</div></div><div><div className="font-mono text-sm font-semibold text-[#0b1f3a]">{preview.vessel}</div><div className="text-[10px] text-[#718095]">Best vessel</div></div></div></div>
              </div>
              <div className="flex gap-3 border-t border-[#e7edf3] p-6"><button onClick={() => { reset(); setInputsOpen(false); showToast('Scenario reset') }} className="flex-1 rounded-md border border-[#cbd9e7] px-4 py-2.5 text-xs font-semibold text-[#0b1f3a]">Reset</button><button onClick={applyInputs} className="flex-1 rounded-md bg-[#087cb8] px-4 py-2.5 text-xs font-semibold text-white">Apply Changes</button></div>
            </aside>
          </>
        )}
        {toast && (
          <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-md bg-[#0b1f3a] px-4 py-3 text-xs text-white shadow-lg">
            <Check className="size-3.5 text-[#58c7b3]" />
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}
