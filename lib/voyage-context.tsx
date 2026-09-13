'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { calculateVoyage, defaultVoyage, delayFor, type VoyageResult, type VoyageState } from '@/lib/engines'

type ExecutionStatus = 'DRAFT' | 'EXECUTED'
interface VoyageContextValue { state: VoyageState; executedState: VoyageState; result: VoyageResult; liveResult: VoyageResult; executionStatus: ExecutionStatus; outputs: { currentFreight: number; forecastFreight: number; freightChange: number; marketRisk: number; selectedVessel: string; portFit: number; portDelay: number; estimatedSavings: number; confidence: number; recommendation: string; lockPercentage: number }; liveOutputs: VoyageContextValue['outputs']; updateState: (updates: Partial<VoyageState>) => void; executeFixture: () => VoyageResult; reset: () => void }
const VoyageContext = createContext<VoyageContextValue | null>(null)

export function VoyageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VoyageState>(defaultVoyage)
  const [executedState, setExecutedState] = useState<VoyageState>(defaultVoyage)
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>('EXECUTED')
  const result = useMemo(() => calculateVoyage(executedState), [executedState])
  const liveResult = useMemo(() => calculateVoyage(state), [state])
  const toOutputs = (voyageResult: VoyageResult, voyageState: VoyageState) => ({ currentFreight: voyageResult.freight.current, forecastFreight: voyageResult.freight.forecast, freightChange: voyageResult.freight.change, marketRisk: voyageResult.risk.score, selectedVessel: voyageResult.selected.name.toUpperCase(), portFit: voyageResult.port.score, portDelay: delayFor(voyageState.portCongestion), estimatedSavings: voyageResult.strategy.expectedSavings, confidence: voyageResult.freight.confidence, recommendation: voyageResult.strategy.recommendation, lockPercentage: voyageResult.strategy.lockPercentage })
  const outputs = useMemo(() => toOutputs(result, executedState), [result, executedState])
  const liveOutputs = useMemo(() => toOutputs(liveResult, state), [liveResult, state])
  const updateState = (updates: Partial<VoyageState>) => { setState((previous) => ({ ...previous, ...updates })); setExecutionStatus('DRAFT') }
  const executeFixture = () => { const next = { ...state, isDraft: false }; setExecutedState(next); setState(next); setExecutionStatus('EXECUTED'); return calculateVoyage(next) }
  const reset = () => { setState(defaultVoyage); setExecutedState(defaultVoyage); setExecutionStatus('EXECUTED') }
  return <VoyageContext.Provider value={{ state, executedState, result, liveResult, executionStatus, outputs, liveOutputs, updateState, executeFixture, reset }}>{children}</VoyageContext.Provider>
}

export function useVoyage() { const context = useContext(VoyageContext); if (!context) throw new Error('useVoyage must be used within VoyageProvider'); return context }
