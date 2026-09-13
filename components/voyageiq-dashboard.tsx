'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  Activity,
  Anchor,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Calculator,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  FileText,
  Fuel,
  Gauge,
  Globe2,
  Layers3,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Radar,
  Search,
  Settings2,
  ShieldCheck,
  Ship,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
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

const pipeline = [
  ['Voyage Input', '/voyage-planner'],
  ['Freight Forecast', '/freight-forecast'],
  ['Vessel Match', '/vessel-optimizer'],
  ['Port Check', '/port-compatibility'],
  ['Risk Engine', '/risk-intelligence'],
  ['Cost Optimization', '/cost-optimization'],
  ['Charter Strategy', '/charter-strategy'],
] as const

const forecastPoints = [21.4, 21.8, 21.5, 21.1, 21.25, 20.9, 20.8, 20.7, 20.5, 20.35, 20.1, 19.8]

function Sparkline({ values, color = '#13a68a' }: { values: number[]; color?: string }) {
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${48 - ((value - Math.min(...values)) / (Math.max(...values) - Math.min(...values))) * 36}`).join(' ')
  return <svg viewBox="0 0 100 52" preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true"><polyline fill="none" stroke={color} strokeWidth="2.4" points={points} vectorEffect="non-scaling-stroke" /></svg>
}

function ForecastChart() {
  const [range, setRange] = useState('30D')
  return (
    <div className="relative h-64 overflow-hidden rounded-xl border border-[#dfe6ef] bg-[#fbfcfe] p-4">
      <div className="absolute inset-x-4 top-7 bottom-10 flex flex-col justify-between text-[10px] font-mono text-[#8b98aa]"><span>$23.00</span><span>$21.00</span><span>$19.00</span></div>
      <div className="absolute inset-x-14 top-7 bottom-10 flex flex-col justify-between"><i className="border-t border-dashed border-[#e2e8f0]" /><i className="border-t border-dashed border-[#e2e8f0]" /><i className="border-t border-dashed border-[#e2e8f0]" /></div>
      <svg viewBox="0 0 620 160" preserveAspectRatio="none" className="absolute inset-x-14 top-8 h-[170px] w-[calc(100%-4.5rem)]">
        <path d="M0 35 C70 26, 110 47, 165 55 S260 69, 315 82 S405 90, 470 117 S545 129, 620 145 L620 158 L0 158 Z" fill="#dff4f0" opacity=".9" />
        <path d="M0 20 C68 14, 118 40, 165 48 S260 62, 315 77 S405 85, 470 113 S545 124, 620 142" fill="none" stroke="#0b1f3a" strokeWidth="3" />
        <path d="M315 77 C400 84, 445 99, 470 113 S560 132, 620 142" fill="none" stroke="#0c9b86" strokeWidth="3" strokeDasharray="7 6" />
        <circle cx="0" cy="20" r="4" fill="#0b1f3a" /><circle cx="620" cy="142" r="4" fill="#0c9b86" />
      </svg>
      <div className="absolute bottom-3 left-14 right-4 flex justify-between text-[10px] font-mono text-[#8b98aa]"><span>TODAY</span><span>+7D</span><span>+15D</span><span>+30D</span></div>
      <div className="absolute right-4 top-3 flex gap-1 rounded-lg border border-[#dfe6ef] bg-white p-1">{['7D', '15D', '30D'].map((item) => <button key={item} onClick={() => setRange(item)} className={`rounded px-2 py-1 text-[10px] font-semibold ${range === item ? 'bg-[#0b1f3a] text-white' : 'text-[#6b7b8f]'}`}>{item}</button>)}</div>
      <div className="absolute bottom-3 left-4 flex items-center gap-3 text-[10px] text-[#68788c]"><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-[#0b1f3a]" /> Historical Spot</span><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-[#0c9b86]" /> AI Forecast</span></div>
    </div>
  )
}

function MetricCard({ label, value, detail, tone = 'navy', icon: Icon, trend }: { label: string; value: string; detail: string; tone?: string; icon: typeof Gauge; trend?: 'up' | 'down' }) {
  const colors: Record<string, string> = { navy: 'bg-[#0b1f3a] text-white', blue: 'bg-[#e9f4ff] text-[#0b1f3a]', teal: 'bg-[#e7f8f2] text-[#0b1f3a]', amber: 'bg-[#fff5d9] text-[#0b1f3a]' }
  return <div className={`rounded-xl border border-[#dfe6ef] p-4 ${colors[tone]}`}><div className="flex items-start justify-between"><span className={`text-[10px] font-semibold uppercase tracking-[.14em] ${tone === 'navy' ? 'text-white/60' : 'text-[#708096]'}`}>{label}</span><Icon className={`size-4 ${tone === 'navy' ? 'text-[#58c7b3]' : 'text-[#087cb8]'}`} /></div><div className="mt-3 font-mono text-[24px] font-semibold tracking-tight">{value}</div><div className={`mt-1 flex items-center gap-1 text-[11px] ${tone === 'navy' ? 'text-white/65' : 'text-[#66778c]'}`}>{trend === 'up' ? <ArrowUpRight className="size-3 text-[#0c9b86]" /> : trend === 'down' ? <ArrowDownRight className="size-3 text-[#0c9b86]" /> : null}{detail}</div></div>
}

function Overview({ onToast }: { onToast: (message: string) => void }) {
  return <>
    <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#0b8ca2]"><span className="size-2 rounded-full bg-[#0c9b86]" /> Live decision support</div><h1 className="text-[28px] font-bold tracking-[-.03em] text-[#0b1f3a] md:text-[34px]">Executive Chartering Intelligence</h1><p className="mt-1 text-sm text-[#6d7c8f]">Indonesia → Paradip · 80,000 MT Thermal Coal</p></div><div className="flex items-center gap-3"><span className="hidden text-right text-[11px] leading-4 text-[#6d7c8f] sm:block">Synced: Real-Time AIS<br />& Baltic Feeds</span><button onClick={() => onToast('New voyage fixture opened')} className="flex items-center gap-2 rounded-lg bg-[#087cb8] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#087cb8]/20"><Sparkles className="size-4" /> Plan New Voyage</button></div></div>
    <section className="overflow-hidden rounded-2xl bg-[#0b1f3a] shadow-[0_14px_40px_rgba(11,31,58,.12)]"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-3"><BrainCircuit className="size-5 text-[#58c7b3]" /><h2 className="text-sm font-bold uppercase tracking-[.12em] text-white">Executive Decision Matrix</h2><span className="rounded bg-[#f5b72b] px-2 py-1 text-[9px] font-bold tracking-[.1em] text-[#352600]">5-SEC SNAPSHOT</span></div><MoreHorizontal className="size-5 text-white/50" /></div><div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0 lg:grid-cols-6">{[['BEST VESSEL', 'Panamax', '94% port fit'], ['AI ACTION', 'Partial Lock', '60 / 40'], ['RATE FORECAST', '$21.40 → $19.80', '−7.5%'], ['PORT BERTH', 'Compatible', '14.5m draft'], ['RISK LEVEL', 'Low-Moderate', '32 / 100'], ['NET SAVINGS', '+$19,200', 'USD estimated']].map(([label, value, sub], i) => <div key={label} className="p-5"><div className="text-[10px] font-semibold tracking-[.14em] text-white/45">{label}</div><div className={`mt-3 font-mono text-lg font-semibold ${i === 5 ? 'text-[#58c7b3]' : 'text-white'}`}>{value}</div><div className="mt-1 text-[11px] text-white/55">{sub}</div></div>)}</div></section>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><MetricCard label="Current Freight" value="$21.40 / MT" detail="+2.4% vs 7D" trend="up" icon={TrendingUp} tone="navy" /><MetricCard label="30-Day Forecast" value="$19.80 / MT" detail="7.5% decline" trend="down" icon={TrendingDown} tone="teal" /><MetricCard label="Market Risk" value="32 / 100" detail="Low-Moderate" icon={ShieldCheck} tone="blue" /><MetricCard label="Selected Vessel" value="PANAMAX" detail="94% port fit" icon={Ship} tone="amber" /><MetricCard label="Port Delay" value="1.2 Days" detail="Congestion low" icon={Anchor} tone="blue" /></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]"><section className="rounded-xl border border-[#dfe6ef] bg-white p-5"><div className="mb-4 flex items-start justify-between"><div><div className="flex items-center gap-2"><BarChart3 className="size-4 text-[#087cb8]" /><h2 className="text-sm font-bold uppercase tracking-[.1em] text-[#0b1f3a]">Freight Market Forecast</h2></div><p className="mt-1 text-xs text-[#7b8999]">Indonesia → Paradip · USD per metric ton</p></div><div className="text-right"><div className="font-mono text-2xl font-semibold text-[#0b1f3a]">$21.40 <span className="text-[#93a0af]">→</span> $19.80</div><div className="text-[11px] font-semibold text-[#0c9b86]">↓ 7.5% over 30 days</div></div></div><ForecastChart /></section><section className="rounded-xl border border-[#dfe6ef] bg-white p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Bot className="size-4 text-[#087cb8]" /><h2 className="text-sm font-bold uppercase tracking-[.1em] text-[#0b1f3a]">VoyageIQ AI Recommendation</h2></div><span className="rounded-full bg-[#e7f8f2] px-2 py-1 text-[10px] font-semibold text-[#087d69]">87% confidence</span></div><div className="mt-5 rounded-xl bg-[#f5f9fc] p-4"><div className="flex items-center gap-2 text-xs font-semibold text-[#0b1f3a]"><Zap className="size-4 text-[#f5a400]" /> Recommended action</div><p className="mt-2 text-sm font-semibold leading-6 text-[#0b1f3a]">Secure 60% now, retain 40% optionality for the next 10–14 days.</p><p className="mt-2 text-xs leading-5 text-[#728196]">Rates are projected to soften while Panamax supply remains favorable. This balances downside capture with laycan certainty.</p></div><div className="mt-4 flex flex-col gap-2 text-xs"><div className="flex items-center justify-between border-b border-[#edf0f4] pb-2"><span className="text-[#748398]">Freight trend</span><span className="font-semibold text-[#0c9b86]">Softening</span></div><div className="flex items-center justify-between border-b border-[#edf0f4] pb-2"><span className="text-[#748398]">Vessel supply</span><span className="font-semibold text-[#0c9b86]">Favorable</span></div><div className="flex items-center justify-between"><span className="text-[#748398]">Port conditions</span><span className="font-semibold text-[#0c9b86]">Stable</span></div></div><button onClick={() => onToast('Charter strategy staged for execution')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b1f3a] py-3 text-xs font-semibold text-white">Review Charter Strategy <ChevronRight className="size-4" /></button></section></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-3"><section className="rounded-xl border border-[#dfe6ef] bg-white p-5 lg:col-span-2"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold uppercase tracking-[.1em] text-[#0b1f3a]">Market & Operational Signals</h2><p className="mt-1 text-xs text-[#7b8999]">Live conditions affecting the fixture</p></div><button className="text-xs font-semibold text-[#087cb8]">View all signals</button></div><div className="grid gap-3 sm:grid-cols-3">{[['BDI Index', '1,842', '+1.8%', 'up', [1810, 1820, 1816, 1832, 1842]], ['Bunker Brent', '$82.40/bbl', '−0.4%', 'down', [84, 83, 84, 82, 82]], ['Port Congestion', 'LOW', '1.2d delay', 'safe', [1, 1.4, 1.1, 1.3, 1.2]]].map(([name, value, change, state, values]) => <div key={name as string} className="rounded-lg border border-[#e8edf3] p-3"><div className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#8491a2]">{name}</div><div className="mt-2 flex items-end justify-between"><span className="font-mono text-lg font-semibold text-[#0b1f3a]">{value as string}</span><span className={`text-[10px] font-semibold ${state === 'up' ? 'text-[#0c9b86]' : state === 'safe' ? 'text-[#087cb8]' : 'text-[#db8a00]'}`}>{change as string}</span></div><div className="mt-2"><Sparkline values={values as number[]} color={state === 'safe' ? '#087cb8' : state === 'down' ? '#db8a00' : '#0c9b86'} /></div></div>)}</div></section><section className="rounded-xl border border-[#dfe6ef] bg-white p-5"><div className="flex items-center gap-2"><Ship className="size-4 text-[#087cb8]" /><h2 className="text-sm font-bold uppercase tracking-[.1em] text-[#0b1f3a]">Vessel Recommendation</h2></div><div className="mt-4 flex items-center justify-between"><div><div className="font-mono text-2xl font-semibold text-[#0b1f3a]">PANAMAX</div><div className="text-xs text-[#748398]">MV Ocean Meridian · IMO 9821408</div></div><div className="rounded-lg bg-[#e7f8f2] px-3 py-2 text-center"><div className="font-mono text-lg font-bold text-[#087d69]">94%</div><div className="text-[9px] font-semibold uppercase text-[#087d69]">Port fit</div></div></div><div className="mt-4 flex flex-col gap-2 text-xs"><div className="flex justify-between"><span className="text-[#748398]">Deadweight</span><span className="font-mono font-semibold text-[#0b1f3a]">82,100 DWT</span></div><div className="flex justify-between"><span className="text-[#748398]">Draft</span><span className="font-mono font-semibold text-[#0b1f3a]">14.5 m</span></div><div className="flex justify-between"><span className="text-[#748398]">ETA Paradip</span><span className="font-mono font-semibold text-[#0b1f3a]">14 Oct 2026</span></div></div><Link href="/vessel-optimizer" className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#cfe0ee] py-2.5 text-xs font-semibold text-[#087cb8]">Open vessel analysis <ChevronRight className="size-4" /></Link></section></div>
  </>
}

function ModulePage({ title, eyebrow, description, onToast }: { title: string; eyebrow: string; description: string; onToast: (message: string) => void }) {
  const isPlanner = title === 'Voyage Planner'
  return <div><div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mb-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#087cb8]">{eyebrow}</div><h1 className="text-[30px] font-bold tracking-[-.03em] text-[#0b1f3a]">{title}</h1><p className="mt-1 text-sm text-[#6d7c8f]">{description}</p></div><button onClick={() => onToast(`${title} export prepared`)} className="flex items-center gap-2 rounded-lg border border-[#cbd9e7] bg-white px-4 py-2.5 text-xs font-semibold text-[#0b1f3a]"><FileText className="size-4 text-[#087cb8]" /> Export analysis</button></div><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"><section className="rounded-xl border border-[#dfe6ef] bg-white p-5"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-bold uppercase tracking-[.1em] text-[#0b1f3a]">{isPlanner ? 'Fixture configuration' : 'Decision workspace'}</h2><span className="rounded-full bg-[#e7f8f2] px-2.5 py-1 text-[10px] font-semibold text-[#087d69]">LIVE DATA</span></div>{isPlanner ? <div className="grid gap-4 sm:grid-cols-2">{[['Commodity type', 'Thermal Coal'], ['Cargo quantity', '80,000 MT'], ['Origin', 'Muara Berau, Indonesia'], ['Destination', 'Paradip Port, India'], ['Laycan window', '12–15 Oct 2026'], ['Vessel preference', 'Panamax · 75–85k DWT']].map(([label, value]) => <label key={label} className="flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">{label}</span><input defaultValue={value} className="rounded-lg border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]" /></label>)}</div> : <div className="grid gap-3 sm:grid-cols-2">{[['Freight outlook', '$19.80 / MT', '−7.5%', 'teal'], ['Model confidence', '87%', 'HIGH', 'blue'], ['Port compatibility', '94%', 'VALIDATED', 'teal'], ['Risk score', '32 / 100', 'LOW-MOD', 'amber'], ['Estimated savings', '+$19,200', 'OPTIMAL', 'teal'], ['Transit time', '8.2 days', '2,420 NM', 'blue']].map(([label, value, sub, tone]) => <div key={label} className={`rounded-xl border p-4 ${tone === 'teal' ? 'border-[#bde8dc] bg-[#f1fbf7]' : tone === 'amber' ? 'border-[#f3ddb0] bg-[#fffaf0]' : 'border-[#cfe0ee] bg-[#f5faff]'}`}><div className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#78879a]">{label}</div><div className="mt-2 font-mono text-2xl font-semibold text-[#0b1f3a]">{value}</div><div className="mt-1 text-[11px] font-semibold text-[#087d69]">{sub}</div></div>)}</div>}<button onClick={() => onToast(isPlanner ? 'Fixture analysis started' : 'Analysis refreshed with latest signals')} className="mt-6 flex items-center gap-2 rounded-lg bg-[#087cb8] px-4 py-3 text-xs font-semibold text-white"><Sparkles className="size-4" /> {isPlanner ? 'Run Intelligence Analysis' : 'Refresh intelligence'} </button></section><aside className="rounded-xl bg-[#0b1f3a] p-5 text-white"><div className="flex items-center gap-2"><Bot className="size-4 text-[#58c7b3]" /><h2 className="text-sm font-bold uppercase tracking-[.1em]">AI briefing</h2></div><p className="mt-5 text-sm font-semibold leading-6">{isPlanner ? 'Your fixture is structurally sound. Run analysis to compare vessel fit, port constraints and timing exposure.' : 'The current fixture remains executable with a favorable risk-adjusted charter profile.'}</p><div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 text-xs text-white/65"><div className="flex items-center gap-2"><Check className="size-4 text-[#58c7b3]" /> AIS signals synchronized</div><div className="flex items-center gap-2"><Check className="size-4 text-[#58c7b3]" /> Baltic market feed healthy</div><div className="flex items-center gap-2"><Check className="size-4 text-[#58c7b3]" /> Port data validated</div></div></aside></div></div>
}

export default function VoyageIQDashboard() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')
  const active = pathname === '/' ? '/overview' : pathname
  const current = navItems.find((item) => item.href === active) ?? navItems[0]
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const moduleDescription = useMemo(() => ({ '/voyage-planner': 'Build an optimal charter plan from cargo, route and contract requirements.', '/freight-forecast': 'AI-powered freight rate outlook for the selected voyage.', '/vessel-optimizer': 'Compare vessel classes against fit, cost and operational constraints.', '/port-compatibility': 'Validate berth, draft and operational compatibility before fixture execution.', '/risk-intelligence': 'Surface market, operational and geopolitical exposure across the voyage.', '/cost-optimization': 'Model voyage economics and identify the best risk-adjusted savings.', '/charter-strategy': 'Translate market intelligence into an executable chartering strategy.', '/what-if-simulator': 'Stress-test timing, freight and bunker assumptions before you commit.', '/reports': 'Export a decision-ready recap for commercial and operations stakeholders.' } as Record<string, string>)[active] ?? '')
  return <div className="min-h-screen bg-[#f6f8fc] text-[#0b1f3a]">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[286px] flex-col bg-[#0b1f3a] text-white transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex h-[74px] items-center justify-between border-b border-white/10 px-6"><div><div className="flex items-center gap-2 text-xl font-extrabold tracking-[-.04em]"><span className="flex size-7 items-center justify-center rounded-md bg-[#087cb8]"><Anchor className="size-4" /></span> VOYAGE<span className="text-[#58c7b3]">IQ</span></div><div className="mt-1 text-[9px] font-semibold tracking-[.18em] text-white/45">MARITIME AI DECISION SUPPORT</div></div><button onClick={() => setMobileOpen(false)} className="lg:hidden"><X className="size-5 text-white/60" /></button></div><div className="px-5 py-5"><button onClick={() => showToast('New fixture simulation opened')} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#087cb8] px-3 py-3 text-xs font-semibold shadow-lg shadow-black/10"><Sparkles className="size-4" /> New Fixture Simulation</button></div><nav className="flex-1 overflow-y-auto px-3 pb-4">{navItems.map(({ label, href, icon: Icon, badge }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`group mb-1 flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-xs font-medium transition ${active === href ? 'border-[#58c7b3] bg-white text-[#0b1f3a]' : 'border-transparent text-white/65 hover:bg-white/8 hover:text-white'}`}><Icon className={`size-4 ${active === href ? 'text-[#087cb8]' : 'text-white/45 group-hover:text-white'}`} /><span className="flex-1">{label}</span>{badge && <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wide ${active === href ? 'bg-[#e7f8f2] text-[#087d69]' : 'bg-white/10 text-white/50'}`}>{badge}</span>}</Link>)}</nav><div className="border-t border-white/10 p-4"><div className="flex items-center gap-3 rounded-lg bg-white/5 p-3"><div className="flex size-8 items-center justify-center rounded-full bg-[#087cb8] text-xs font-bold">HM</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">Harbor Maritime</div><div className="text-[10px] text-white/45">Chartering desk</div></div><Settings2 className="size-4 text-white/45" /></div><div className="mt-3 flex items-center justify-between text-[9px] font-semibold tracking-[.1em] text-white/35"><span>AI PRO</span><span>v2.4.0</span></div></div></aside>
    {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-[#071426]/50 lg:hidden" />}
    <div className="lg:pl-[286px]"><header className="sticky top-0 z-20 border-b border-[#dfe6ef] bg-white/95 backdrop-blur"><div className="flex h-[66px] items-center gap-3 px-4 md:px-7"><button onClick={() => setMobileOpen(true)} className="lg:hidden"><Menu className="size-5 text-[#0b1f3a]" /></button><div className="hidden items-center gap-2 text-xs text-[#718095] md:flex"><span className="font-semibold text-[#0b1f3a]">VoyageIQ</span><ChevronRight className="size-3" /> <span>{current.label}</span><ChevronRight className="size-3" /><span className="font-mono text-[#0b8ca2]">IDN → PAR</span></div><div className="ml-auto flex items-center gap-2"><div className="hidden items-center gap-2 rounded-lg border border-[#e0e7ef] bg-[#fbfcfe] px-3 py-2 text-xs text-[#9aa6b5] xl:flex"><Search className="size-4" /> Search fixtures, vessels, ports, IMO...</div><button className="rounded-lg p-2 text-[#708096] hover:bg-[#f1f5f9]"><Bell className="size-4" /></button><button className="hidden rounded-lg p-2 text-[#708096] hover:bg-[#f1f5f9] sm:block"><CircleHelp className="size-4" /></button><div className="hidden h-7 w-px bg-[#e3e8ef] sm:block" /><button onClick={() => showToast('Charter execution queued for review')} className="hidden items-center gap-2 rounded-lg bg-[#0b1f3a] px-3 py-2 text-[11px] font-semibold text-white sm:flex"><Zap className="size-3.5 text-[#58c7b3]" /> Execute Fixture</button></div></div><div className="flex gap-6 overflow-x-auto border-t border-[#edf0f4] px-4 py-2.5 text-[10px] font-medium text-[#708096] md:px-7"><span className="whitespace-nowrap font-semibold text-[#0b1f3a]">MARKET WATCH</span><span className="whitespace-nowrap">BDI <b className="font-mono text-[#0b1f3a]">1,842</b> <i className="not-italic text-[#0c9b86]">+1.8%</i></span><span className="whitespace-nowrap">IDN → PAR <b className="font-mono text-[#0b1f3a]">$21.40/MT</b> <i className="not-italic text-[#0c9b86]">+2.4%</i></span><span className="whitespace-nowrap">BRENT <b className="font-mono text-[#0b1f3a]">$82.40/bbl</b> <i className="not-italic text-[#db8a00]">−0.4%</i></span><span className="whitespace-nowrap">AIS FEED <b className="text-[#0c9b86]">● HEALTHY</b></span></div></header><main className="mx-auto max-w-[1500px] px-4 py-6 md:px-7 lg:px-9">{active === '/overview' ? <Overview onToast={showToast} /> : <ModulePage title={current.label} eyebrow={`Stage ${String(navItems.findIndex((item) => item.href === active) + 1).padStart(2, '0')} / Decision pipeline`} description={moduleDescription} onToast={showToast} />}</main></div>
    {toast && <div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-[#0b1f3a] px-4 py-3 text-xs font-semibold text-white shadow-xl"><Check className="size-4 text-[#58c7b3]" /> {toast}</div>}
  </div>
}

export { pipeline }
