export type MarketCondition = 'Falling' | 'Stable' | 'Rising'
export type Congestion = 'Low' | 'Medium' | 'High'
export type VesselType = 'Auto Select' | 'Handysize' | 'Supramax' | 'Panamax' | 'Capesize'

export const VESSELS = [
  { name: 'Handysize', capacity: 38000, draft: 10.2, loa: 180, beam: 28.5, availability: 76, baseCost: 17.8 },
  { name: 'Supramax', capacity: 58000, draft: 11.8, loa: 200, beam: 32, availability: 64, baseCost: 19.6 },
  { name: 'Panamax', capacity: 82000, draft: 13.2, loa: 225, beam: 32.2, availability: 72, baseCost: 21.2 },
  { name: 'Capesize', capacity: 175000, draft: 16.8, loa: 290, beam: 45, availability: 38, baseCost: 23.8 },
] as const

export function clamp(value: number, min = 0, max = 100) { return Math.max(min, Math.min(max, value)) }

export function calculateFreight(cargo: number, market: MarketCondition, range: '7D' | '15D' | '30D') {
  const current = 21.4 + Math.max(-1.2, Math.min(1.2, (cargo - 80000) / 100000))
  const direction = market === 'Rising' ? 1 : market === 'Falling' ? -1 : -0.25
  const days = range === '7D' ? 7 : range === '15D' ? 15 : 30
  const forecast = current + direction * (days / 30) * 1.6
  const confidence = clamp(91 - days * 0.12 - (market === 'Stable' ? 0 : 5))
  const historical = [current - 0.8, current - 0.45, current - 0.6, current - 0.2, current + 0.15, current]
  return { current: Number(current.toFixed(2)), forecast: Number(forecast.toFixed(2)), change: Number((((forecast - current) / current) * 100).toFixed(1)), confidence: Math.round(confidence), historical, trend: direction > 0.2 ? 'Rising' : direction < -0.2 ? 'Falling' : 'Stable' as MarketCondition }
}

export function rankVessels(cargo: number, preferred: VesselType, portCongestion: Congestion) {
  return VESSELS.map((vessel) => {
    const cargoFit = clamp(100 - Math.abs(cargo - vessel.capacity) / Math.max(cargo, vessel.capacity) * 100)
    const portFit = vessel.draft > 14 ? 78 : portCongestion === 'High' && vessel.name === 'Capesize' ? 70 : 96 - (vessel.draft - 10) * 2
    const costEfficiency = clamp(100 - (vessel.baseCost - 17) * 9)
    const preferenceBonus = preferred === vessel.name ? 8 : 0
    const overall = Math.round(cargoFit * .3 + portFit * .25 + costEfficiency * .25 + vessel.availability * .2 + preferenceBonus)
    return { ...vessel, cargoFit: Math.round(cargoFit), portFit: Math.round(portFit), costEfficiency: Math.round(costEfficiency), overall: clamp(overall) }
  }).sort((a, b) => b.overall - a.overall)
}

export function calculatePort(vessel: typeof VESSELS[number], destination: string, cargo: number) {
  const portLimit = destination.toLowerCase().includes('paradip') ? { draft: 14.5, loa: 240, beam: 35, handling: 60000 } : { draft: 14, loa: 235, beam: 34, handling: 50000 }
  const checks = [
    { label: 'Draft', actual: `${vessel.draft.toFixed(1)}m vessel`, limit: `${portLimit.draft}m port limit`, pass: vessel.draft <= portLimit.draft },
    { label: 'LOA', actual: `${vessel.loa}m vessel`, limit: `${portLimit.loa}m limit`, pass: vessel.loa <= portLimit.loa },
    { label: 'Beam', actual: `${vessel.beam}m vessel`, limit: `${portLimit.beam}m channel`, pass: vessel.beam <= portLimit.beam },
    { label: 'Cargo handling', actual: `${Math.round(cargo / 1.2).toLocaleString()} MT/day`, limit: `required: ${portLimit.handling.toLocaleString()} MT/day`, pass: cargo / 1.2 >= portLimit.handling },
  ]
  return { checks, score: Math.round(checks.filter((check) => check.pass).length / checks.length * 100) }
}

export function calculateRisk(market: MarketCondition, congestion: Congestion, availability: number, freightChange: number, portFit: number) {
  const congestionRisk = congestion === 'High' ? 82 : congestion === 'Medium' ? 48 : 18
  const volatility = clamp(32 + Math.abs(freightChange) * 3)
  const supplyRisk = clamp(100 - availability)
  const routeRisk = clamp(100 - portFit + (market === 'Rising' ? 12 : 0))
  const factors = [
    { label: 'Freight rate volatility', value: Math.round(volatility) },
    { label: 'Port congestion', value: congestionRisk },
    { label: 'Vessel availability', value: Math.round(supplyRisk) },
    { label: 'Route / market risk', value: Math.round(routeRisk) },
    { label: 'Potential delay', value: Math.round(congestionRisk * .8) },
    { label: 'Idle time', value: Math.round(congestionRisk * .55) },
  ]
  return { score: Math.round(factors.reduce((sum, factor) => sum + factor.value, 0) / factors.length), factors }
}

export function calculateCost(cargo: number, freight: number, vessel: typeof VESSELS[number], risk: number, congestion: Congestion) {
  const freightCost = cargo * freight
  const bunkerCost = cargo * (vessel.name === 'Capesize' ? .92 : .72)
  const portCost = cargo * .18
  const delayCost = cargo * (congestion === 'High' ? .22 : congestion === 'Medium' ? .11 : .05)
  const idleCost = cargo * (congestion === 'High' ? .12 : .03)
  const deadheadingCost = cargo * Math.max(.02, (100 - vessel.availability) / 2400)
  const riskPenalty = cargo * risk / 10000
  const total = freightCost + bunkerCost + portCost + delayCost + idleCost + deadheadingCost + riskPenalty
  return { freightCost, bunkerCost, portCost, delayCost, idleCost, deadheadingCost, riskPenalty, total, costPerMT: total / cargo }
}

export function calculateStrategy(freightChange: number, confidence: number, risk: number, cargo: number, costPerMT: number, contractDuration: string) {
  const recommendation = freightChange > 3 ? 'BUY NOW' : freightChange < -4 && confidence > 82 ? 'WAIT' : contractDuration === 'Long-Term' && costPerMT < 24 ? 'MULTI-VOYAGE' : 'PARTIAL LOCK'
  const lockPercentage = recommendation === 'BUY NOW' ? 100 : recommendation === 'WAIT' ? 0 : recommendation === 'MULTI-VOYAGE' ? 75 : 60
  const expectedSavings = Math.round(Math.abs(freightChange) / 100 * cargo * .55)
  return { recommendation, lockPercentage, expectedSavings, reasons: [`${freightChange < 0 ? 'Softening' : freightChange > 0 ? 'Rising' : 'Stable'} freight curve`, `${confidence}% model confidence`, `Risk score ${risk}/100`] }
}

export function calculateVoyage(input: { cargoQuantity: number; origin: string; destination: string; vesselPreference: VesselType; marketCondition: MarketCondition; portCongestion: Congestion; forecastRange: '7D' | '15D' | '30D'; contractDuration: string }) {
  const freight = calculateFreight(input.cargoQuantity, input.marketCondition, input.forecastRange)
  const ranked = rankVessels(input.cargoQuantity, input.vesselPreference, input.portCongestion)
  const selected = input.vesselPreference === 'Auto Select' ? ranked[0] : ranked.find((vessel) => vessel.name === input.vesselPreference) ?? ranked[0]
  const port = calculatePort(selected, input.destination, input.cargoQuantity)
  const risk = calculateRisk(input.marketCondition, input.portCongestion, selected.availability, freight.change, port.score)
  const cost = calculateCost(input.cargoQuantity, freight.current, selected, risk.score, input.portCongestion)
  const strategy = calculateStrategy(freight.change, freight.confidence, risk.score, input.cargoQuantity, cost.costPerMT, input.contractDuration)
  return { freight, ranked, selected, port, risk, cost, strategy }
}
