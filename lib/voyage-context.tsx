'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { calculateVoyage, defaultVoyage, delayFor, type VoyageResult, type VoyageState } from '@/lib/engines'

type ExecutionStatus = 'DRAFT' | 'EXECUTED'
interface VoyageContextValue { state: VoyageState; executedState: VoyageState; result: VoyageResult; executionStatus: ExecutionStatus; outputs: { currentFreight: number; forecastFreight: number; freightChange: number; marketRisk: number; selectedVessel: string; portFit: number; portDelay: number; estimatedSavings: number; confidence: number; recommendation: string; lockPercentage: number }; updateState: (updates: Partial<VoyageState>) => void; executeFixture: () => VoyageResult; reset: () => void }
const VoyageContext = createContext<VoyageContextValue | null>(null)

export function VoyageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VoyageState>(defaultVoyage)
  const [executedState, setExecutedState] = useState<VoyageState>(defaultVoyage)
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>('EXECUTED')
  const result = useMemo(() => calculateVoyage(executedState), [executedState])
  const outputs = useMemo(() => ({ currentFreight: result.freight.current, forecastFreight: result.freight.forecast, freightChange: result.freight.change, marketRisk: result.risk.score, selectedVessel: result.selected.name.toUpperCase(), portFit: result.port.score, portDelay: delayFor(executedState.portCongestion), estimatedSavings: result.strategy.expectedSavings, confidence: result.freight.confidence, recommendation: result.strategy.recommendation, lockPercentage: result.strategy.lockPercentage }), [result, executedState.portCongestion])
  const updateState = (updates: Partial<VoyageState>) => { setState((previous) => ({ ...previous, ...updates })); setExecutionStatus('DRAFT') }
  const executeFixture = () => { const next = { ...state, isDraft: false }; setExecutedState(next); setState(next); setExecutionStatus('EXECUTED'); return calculateVoyage(next) }
  const reset = () => { setState(defaultVoyage); setExecutedState(defaultVoyage); setExecutionStatus('EXECUTED') }
  return <VoyageContext.Provider value={{ state, executedState, result, executionStatus, outputs, updateState, executeFixture, reset }}>{children}</VoyageContext.Provider>
}

export function useVoyage() { const context = useContext(VoyageContext); if (!context) throw new Error('useVoyage must be used within VoyageProvider'); return context }
