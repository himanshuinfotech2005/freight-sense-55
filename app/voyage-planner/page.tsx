'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronRight, Compass, Save, Sparkles } from 'lucide-react'
import VoyageLayout from '@/components/voyage-layout'
import { useVoyage } from '@/lib/voyage-context'

export default function VoyagePlannerPage() {
  const { state, updateState, outputs } = useVoyage()
  const [saved, setSaved] = useState(false)
  const [laycanOpen, setLaycanOpen] = useState(false)
  const [laycanDraft, setLaycanDraft] = useState({ start: state.laycanStart, end: state.laycanEnd })
  const laycanRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!laycanOpen) setLaycanDraft({ start: state.laycanStart, end: state.laycanEnd })
  }, [state.laycanStart, state.laycanEnd, laycanOpen])

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (laycanRef.current && !laycanRef.current.contains(event.target as Node)) setLaycanOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const formatLaycan = (start: string, end: string) => {
    const startDate = new Date(`${start}T00:00:00`)
    const endDate = new Date(`${end}T00:00:00`)
    const month = new Intl.DateTimeFormat('en', { month: 'short' })
    return start === end ? `${startDate.getDate()} ${month.format(startDate)} ${startDate.getFullYear()}` : `${startDate.getDate()}–${endDate.getDate()} ${month.format(endDate)} ${endDate.getFullYear()}`
  }

  const applyLaycan = () => {
    if (laycanDraft.start > laycanDraft.end) return
    updateState({ laycanStart: laycanDraft.start, laycanEnd: laycanDraft.end, laycanWindow: formatLaycan(laycanDraft.start, laycanDraft.end) })
    setLaycanOpen(false)
  }

  const savePlan = () => {
    updateState({ ...state })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2400)
  }

  return (
    <VoyageLayout>
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#087cb8]"><Compass className="size-4" /> Voyage input</div>
          <h1 className="text-[30px] font-bold tracking-[-.03em] text-[#0b1f3a]">Voyage Planner</h1>
          <p className="mt-1 text-sm text-[#6d7c8f]">Configure the fixture inputs and let VoyageIQ recalculate the decision path.</p>
        </div>
        <button onClick={savePlan} className="flex items-center justify-center gap-2 rounded-md bg-[#087cb8] px-4 py-2.5 text-xs font-semibold text-white"><Save className="size-4" /> {saved ? 'Plan saved' : 'Save voyage plan'}</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-md border border-[#d8dee8] bg-white p-5">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-bold uppercase tracking-[.1em] text-[#0b1f3a]">Fixture configuration</h2><p className="mt-1 text-xs text-[#7b8999]">Changes update every downstream module.</p></div><span className="rounded-full bg-[#e7f8f2] px-2.5 py-1 text-[10px] font-semibold text-[#087d69]">LIVE MODEL</span></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">Commodity type</span><select value={state.commodity} onChange={(e) => updateState({ commodity: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]"><option>Thermal Coal</option><option>Coking Coal</option><option>Iron Ore</option><option>Bauxite</option><option>Grain</option></select></label>
            <label className="flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">Cargo quantity (MT)</span><input type="number" value={state.cargoQuantity} onChange={(e) => updateState({ cargoQuantity: Number(e.target.value) || 0 })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 font-mono text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]" /></label>
            <label className="flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">Origin</span><select value={state.origin} onChange={(e) => updateState({ origin: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]"><option>Muara Berau, Indonesia</option><option>Taboneo, Indonesia</option><option>Samarinda, Indonesia</option><option>Newcastle, Australia</option><option>Richards Bay, South Africa</option></select></label>
            <label className="flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">Destination</span><select value={state.destination} onChange={(e) => updateState({ destination: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]"><option>Paradip Port, India</option><option>Mundra Port, India</option><option>Krishnapatnam Port, India</option><option>Kandla Port, India</option><option>Visakhapatnam Port, India</option></select></label>
            <div ref={laycanRef} className="relative flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">Laycan window</span><button type="button" aria-expanded={laycanOpen} onClick={() => setLaycanOpen(!laycanOpen)} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-left text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]">{state.laycanWindow}</button>{laycanOpen && <div className="absolute left-0 top-[66px] z-30 w-[min(340px,calc(100vw-48px))] rounded-md border border-[#d8dee8] bg-white p-4 shadow-xl"><div className="mb-3 flex items-center justify-between"><div><div className="text-xs font-bold text-[#0b1f3a]">Select laycan range</div><div className="mt-1 text-[10px] text-[#7b8999]">Start and end dates drive urgency.</div></div><button type="button" onClick={() => setLaycanDraft({ start: '', end: '' })} className="text-[10px] font-semibold text-[#087cb8]">Clear</button></div><div className="grid grid-cols-2 gap-3"><label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-[#7b8999]">Start<input type="date" value={laycanDraft.start} onChange={(e) => setLaycanDraft({ ...laycanDraft, start: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-2 py-2 text-xs font-normal normal-case tracking-normal text-[#0b1f3a]" /></label><label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-[#7b8999]">End<input type="date" value={laycanDraft.end} min={laycanDraft.start || undefined} onChange={(e) => setLaycanDraft({ ...laycanDraft, end: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-2 py-2 text-xs font-normal normal-case tracking-normal text-[#0b1f3a]" /></label></div><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setLaycanOpen(false)} className="rounded-md border border-[#d7e0ea] px-3 py-2 text-xs font-semibold text-[#718095]">Cancel</button><button type="button" disabled={!laycanDraft.start || !laycanDraft.end} onClick={applyLaycan} className="rounded-md bg-[#087cb8] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Apply</button></div></div>}</div>
            <label className="flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">Vessel preference</span><select value={state.vesselPreference} onChange={(e) => updateState({ vesselPreference: e.target.value as 'Auto Select' | 'Handysize' | 'Supramax' | 'Panamax' | 'Capesize' })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]"><option>Auto Select</option><option>Handysize</option><option>Supramax</option><option>Panamax</option><option>Capesize</option></select></label>
          </div>
        </section>

        <aside className="rounded-md bg-[#0b1f3a] p-5 text-white"><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.1em]"><Sparkles className="size-4 text-[#58c7b3]" /> Live recommendation</div><p className="mt-5 text-sm font-semibold leading-6">{outputs.recommendation === 'BUY NOW' ? `Lock ${outputs.lockPercentage}% now before the freight curve rises.` : outputs.recommendation === 'WAIT' ? 'Hold optionality while the freight curve softens.' : `Secure ${outputs.lockPercentage}% now, retain ${100 - outputs.lockPercentage}% optionality.`}</p><p className="mt-2 text-xs leading-5 text-white/60">{state.commodity} from {state.origin.split(',')[0]} to {state.destination.split(',')[0]} · model recalculates live.</p><div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4"><div className="flex justify-between text-xs"><span className="text-white/55">Forecast freight</span><strong className="font-mono text-[#58c7b3]">${outputs.forecastFreight.toFixed(2)} / MT</strong></div><div className="flex justify-between text-xs"><span className="text-white/55">Port fit</span><strong>{outputs.portFit}%</strong></div><div className="flex justify-between text-xs"><span className="text-white/55">Risk score</span><strong>{outputs.marketRisk} / 100</strong></div></div><button onClick={savePlan} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#087cb8] px-3 py-2.5 text-xs font-semibold">{saved ? <Check className="size-4" /> : <ChevronRight className="size-4" />} {saved ? 'Plan saved' : 'Apply recommendation'}</button></aside>
      </div>
    </VoyageLayout>
  )
}
