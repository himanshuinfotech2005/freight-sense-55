'use client'

import { useState } from 'react'
import { Check, ChevronRight, Compass, Save, Sparkles } from 'lucide-react'
import VoyageLayout from '@/components/voyage-layout'
import { useVoyage } from '@/lib/voyage-context'

export default function VoyagePlannerPage() {
  const { state, updateState, outputs } = useVoyage()
  const [saved, setSaved] = useState(false)

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
            <label className="flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">Laycan window</span><input value={state.laycanWindow} onChange={(e) => updateState({ laycanWindow: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]" /></label>
            <label className="flex flex-col gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#7b8999]">Vessel preference</span><input value={state.vesselPreference} onChange={(e) => updateState({ vesselPreference: e.target.value })} className="rounded-md border border-[#d7e0ea] bg-[#fbfcfe] px-3 py-2.5 text-sm text-[#0b1f3a] outline-none focus:border-[#087cb8]" /></label>
          </div>
        </section>

        <aside className="rounded-md bg-[#0b1f3a] p-5 text-white"><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.1em]"><Sparkles className="size-4 text-[#58c7b3]" /> Live recommendation</div><p className="mt-5 text-sm font-semibold leading-6">{outputs.recommendation === 'BUY NOW' ? `Lock ${outputs.lockPercentage}% now before the freight curve rises.` : outputs.recommendation === 'WAIT' ? 'Hold optionality while the freight curve softens.' : `Secure ${outputs.lockPercentage}% now, retain ${100 - outputs.lockPercentage}% optionality.`}</p><p className="mt-2 text-xs leading-5 text-white/60">{state.commodity} from {state.origin.split(',')[0]} to {state.destination.split(',')[0]} · model recalculates live.</p><div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4"><div className="flex justify-between text-xs"><span className="text-white/55">Forecast freight</span><strong className="font-mono text-[#58c7b3]">${outputs.forecastFreight.toFixed(2)} / MT</strong></div><div className="flex justify-between text-xs"><span className="text-white/55">Port fit</span><strong>{outputs.portFit}%</strong></div><div className="flex justify-between text-xs"><span className="text-white/55">Risk score</span><strong>{outputs.marketRisk} / 100</strong></div></div><button onClick={savePlan} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#087cb8] px-3 py-2.5 text-xs font-semibold">{saved ? <Check className="size-4" /> : <ChevronRight className="size-4" />} {saved ? 'Plan saved' : 'Apply recommendation'}</button></aside>
      </div>
    </VoyageLayout>
  )
}
