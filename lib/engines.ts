export const freightEngine = {
  calculate: (baseRate: number, daysOut: number): number => {
    const decay = 1 - daysOut * 0.0025
    return Math.max(baseRate * decay, baseRate * 0.85)
  },
  forecast: (baseRate: number, range: '7D' | '15D' | '30D'): { rate: number; change: number } => {
    const factors = { '7D': 0.97, '15D': 0.93, '30D': 0.925 }
    const rate = baseRate * factors[range]
    return { rate: parseFloat(rate.toFixed(2)), change: parseFloat((((rate - baseRate) / baseRate) * 100).toFixed(1)) }
  },
}

export const vesselEngine = {
  matchVessel: (
    cargo: number,
    destination: string
  ): { name: string; dwt: number; fit: number; delay: number } => {
    const isParadip = destination.includes('Paradip')
    return {
      name: 'PANAMAX',
      dwt: 80000,
      fit: isParadip ? 94 : 78,
      delay: isParadip ? 1.2 : 2.1,
    }
  },
  rankVessels: (
    cargo: number
  ): Array<{ name: string; dwt: number; cost: number; fit: number; risk: number }> => [
    { name: 'PANAMAX', dwt: 80000, cost: 28500, fit: 94, risk: 32 },
    { name: 'HANDYMAX', dwt: 54000, cost: 18200, fit: 78, risk: 48 },
    { name: 'SUPRAMAX', dwt: 61000, cost: 23800, fit: 85, risk: 41 },
  ],
}

export const riskEngine = {
  calculateRisk: (
    market: number,
    geopolitical: number,
    operational: number
  ): { score: number; level: string } => {
    const score = Math.round((market * 0.4 + geopolitical * 0.35 + operational * 0.25) / 3)
    const level = score < 35 ? 'Low' : score < 60 ? 'Low-Moderate' : score < 75 ? 'Moderate' : 'High'
    return { score, level }
  },
}

export const costEngine = {
  optimizeVoyage: (
    freight: number,
    bunker: number,
    cargo: number,
    vesselCost: number
  ): { totalCost: number; savings: number; strategy: string } => {
    const cargoValue = freight * cargo
    const totalCost = cargoValue + bunker * 150 + vesselCost
    const baseline = 21.4 * cargo + 87 * 150 + vesselCost
    const savings = baseline - totalCost
    return {
      totalCost: Math.round(totalCost),
      savings: Math.round(savings),
      strategy: savings > 0 ? 'Secure 60% now, retain 40% optionality' : 'Lock full coverage at current rates',
    }
  },
}

export const chartEngine = {
  generateForecastChart: (
    current: number,
    range: '7D' | '15D' | '30D'
  ): { historical: number[]; forecast: number[] } => {
    const rangeMap = { '7D': 7, '15D': 15, '30D': 30 }
    const days = rangeMap[range]
    const points = Array.from({ length: days }, (_, i) => {
      const t = i / days
      const seasonal = Math.sin(t * Math.PI) * 0.5
      const trend = -0.0025 * i
      return parseFloat((current * (1 + seasonal + trend)).toFixed(2))
    })
    return {
      historical: points.slice(0, Math.ceil(days / 2)),
      forecast: points.slice(Math.ceil(days / 2)),
    }
  },
}
