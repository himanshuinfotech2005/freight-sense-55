'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface VoyageState {
  commodity: string
  cargoQuantity: number
  origin: string
  destination: string
  laycanWindow: string
  vesselPreference: string
  forecastRange: '7D' | '15D' | '30D'
}

export interface VoyageOutputs {
  currentFreight: number
  forecastFreight: number
  freightChange: number
  marketRisk: number
  selectedVessel: string
  portFit: number
  portDelay: number
  estimatedSavings: number
  confidence: number
}

interface VoyageContextType {
  state: VoyageState
  outputs: VoyageOutputs
  updateState: (updates: Partial<VoyageState>) => void
  recalculate: () => void
}

const defaultVoyage: VoyageState = {
  commodity: 'Thermal Coal',
  cargoQuantity: 80000,
  origin: 'Muara Berau, Indonesia',
  destination: 'Paradip Port, India',
  laycanWindow: '12–15 Oct 2026',
  vesselPreference: 'Panamax · 75–85k DWT',
  forecastRange: '30D',
}

const VoyageContext = createContext<VoyageContextType | undefined>(undefined)

export function VoyageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VoyageState>(defaultVoyage)
  const [outputs, setOutputs] = useState<VoyageOutputs>({
    currentFreight: 21.4,
    forecastFreight: 19.8,
    freightChange: -7.5,
    marketRisk: 32,
    selectedVessel: 'PANAMAX',
    portFit: 94,
    portDelay: 1.2,
    estimatedSavings: 19200,
    confidence: 87,
  })

  const calculateOutputs = (voyage: VoyageState): VoyageOutputs => {
    const baseFreight = 21.4
    const rangeFactors = { '7D': 0.97, '15D': 0.93, '30D': 0.925 }
    const forecast = baseFreight * rangeFactors[voyage.forecastRange]
    const change = ((forecast - baseFreight) / baseFreight) * 100
    const savings = Math.abs(change) * 100 * Math.floor(voyage.cargoQuantity / 1000)

    return {
      currentFreight: baseFreight,
      forecastFreight: parseFloat(forecast.toFixed(2)),
      freightChange: parseFloat(change.toFixed(1)),
      marketRisk: voyage.forecastRange === '7D' ? 45 : voyage.forecastRange === '15D' ? 38 : 32,
      selectedVessel: 'PANAMAX',
      portFit: voyage.destination.includes('Paradip') ? 94 : 78,
      portDelay: voyage.destination.includes('Paradip') ? 1.2 : 2.1,
      estimatedSavings: Math.round(savings),
      confidence: voyage.forecastRange === '7D' ? 79 : voyage.forecastRange === '15D' ? 84 : 87,
    }
  }

  const updateState = (updates: Partial<VoyageState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates }
      setOutputs(calculateOutputs(next))
      return next
    })
  }

  const recalculate = () => {
    setOutputs(calculateOutputs(state))
  }

  return <VoyageContext.Provider value={{ state, outputs, updateState, recalculate }}>{children}</VoyageContext.Provider>
}

export function useVoyage() {
  const context = useContext(VoyageContext)
  if (!context) throw new Error('useVoyage must be used within VoyageProvider')
  return context
}
