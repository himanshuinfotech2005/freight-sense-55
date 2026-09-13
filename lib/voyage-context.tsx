'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { calculateVoyage, defaultVoyage, delayFor, type VoyageResult, type VoyageState } from '@/lib/engines'

interface VoyageContextValue { state: VoyageState; result: VoyageResult; outputs: { currentFreight: number; forecastFreight: number; freightChange: number; marketRisk: number; selectedVessel: string; portFit: number; portDelay: number; estimatedSavings: number; confidence: number; recommendation: string; lockPercentage: number }; updateState: (updates: Partial<VoyageState>) => void; reset: () => void }
const VoyageContext = createContext<VoyageContextValue | null>(null)

export function VoyageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VoyageState>(defaultVoyage)
  const result = useMemo(() => calculateVoyage(state), [state])
  const outputs = useMemo(() => ({ currentFreight: result.freight.current, forecastFreight: result.freight.forecast, freightChange: result.freight.change, marketRisk: result.risk.score, selectedVessel: result.selected.name.toUpperCase(), portFit: result.port.score, portDelay: delayFor(state.portCongestion), estimatedSavings: result.strategy.expectedSavings, confidence: result.freight.confidence, recommendation: result.strategy.recommendation, lockPercentage: result.strategy.lockPercentage }), [result, state.portCongestion])
  const updateState = (updates: Partial<VoyageState>) => setState((previous) => ({ ...previous, ...updates }))
  return <VoyageContext.Provider value={{ state, result, outputs, updateState, reset: () => setState(defaultVoyage) }}>{children}</VoyageContext.Provider>
}

export function useVoyage() { const context = useContext(VoyageContext); if (!context) throw new Error('useVoyage must be used within VoyageProvider'); return context }
