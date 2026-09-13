'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { calculateVoyage, type Congestion, type MarketCondition, type VesselType } from '@/lib/engines'

export interface VoyageState {
  origin: string
  destination: string
  commodity: string
  cargoQuantity: number
  deliveryDate: string
  vesselPreference: VesselType
  selectedVessel: VesselType
  contractDuration: string
  marketPreference: string
  marketCondition: MarketCondition
  portCongestion: Congestion
  vesselAvailability: number
  forecastRange: '7D' | '15D' | '30D'
  laycanWindow: string
}

const defaultVoyage: VoyageState = {
  origin: 'Muara Berau, Indonesia', destination: 'Paradip Port, India', commodity: 'Thermal Coal', cargoQuantity: 80000,
  deliveryDate: '12–15 October 2026', vesselPreference: 'Auto Select', selectedVessel: 'Panamax', contractDuration: 'Short-Term', marketPreference: 'Flexible', marketCondition: 'Stable', portCongestion: 'Low', vesselAvailability: 18, forecastRange: '30D', laycanWindow: '12–15 Oct 2026',
}

type VoyageResult = ReturnType<typeof calculateVoyage>
interface VoyageContextValue { state: VoyageState; result: VoyageResult; outputs: { currentFreight: number; forecastFreight: number; freightChange: number; marketRisk: number; selectedVessel: string; portFit: number; portDelay: number; estimatedSavings: number; confidence: number; }; updateState: (updates: Partial<VoyageState>) => void; reset: () => void }
const VoyageContext = createContext<VoyageContextValue | null>(null)

export function VoyageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(defaultVoyage)
  const result = useMemo(() => calculateVoyage(state), [state])
  const outputs = useMemo(() => ({ currentFreight: result.freight.current, forecastFreight: result.freight.forecast, freightChange: result.freight.change, marketRisk: result.risk.score, selectedVessel: result.selected.name.toUpperCase(), portFit: result.port.score, portDelay: state.portCongestion === 'High' ? 3.4 : state.portCongestion === 'Medium' ? 2.1 : 1.2, estimatedSavings: result.strategy.expectedSavings, confidence: result.freight.confidence }), [result, state.portCongestion])
  const updateState = (updates: Partial<VoyageState>) => setState((previous) => ({ ...previous, ...updates }))
  return <VoyageContext.Provider value={{ state, result, outputs, updateState, reset: () => setState(defaultVoyage) }}>{children}</VoyageContext.Provider>
}

export function useVoyage() { const context = useContext(VoyageContext); if (!context) throw new Error('useVoyage must be used within VoyageProvider'); return context }
