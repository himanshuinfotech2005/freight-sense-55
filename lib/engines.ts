export type MarketCondition = 'Falling' | 'Stable' | 'Rising'
export type Congestion = 'Low' | 'Medium' | 'High'
export type VesselType = 'Auto Select' | 'Handysize' | 'Supramax' | 'Panamax' | 'Capesize'
export type ForecastRange = '7D' | '15D' | '30D'

export const VESSELS = [
  { name: 'Handysize', capacity: 38000, draft: 10.2, loa: 180, beam: 28.5, availability: 76, baseCost: 17.8 },
  { name: 'Supramax', capacity: 58000, draft: 11.8, loa: 200, beam: 32, availability: 64, baseCost: 19.6 },
  { name: 'Panamax', capacity: 82000, draft: 13.2, loa: 225, beam: 32.2, availability: 72, baseCost: 21.2 },
  { name: 'Capesize', capacity: 175000, draft: 16.8, loa: 290, beam: 45, availability: 38, baseCost: 23.8 },
] as const
export type Vessel = typeof VESSELS[number]
export const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value))
const horizon = (range: ForecastRange) => range === '7D' ? 7 : range === '15D' ? 15 : 30

const commodityFactor = (commodity: string) => ({
  'Thermal Coal': 1,
  'Coking Coal': 1.12,
  'Iron Ore': 0.86,
  Bauxite: 0.94,
  Grain: 1.06,
}[commodity] ?? 1)

const routeFactor = (origin: string, destination: string) => {
  const originFactor = origin.includes('Newcastle') ? 0.92 : origin.includes('Richards Bay') ? 1.08 : origin.includes('Taboneo') ? 0.97 : origin.includes('Samarinda') ? 1.03 : 1
  const destinationFactor = destination.includes('Mundra') ? 1.08 : destination.includes('Krishnapatnam') ? 1.04 : destination.includes('Kandla') ? 1.12 : destination.includes('Visakhapatnam') ? 0.96 : 1
  return originFactor * destinationFactor
}

export function calculateFreight(cargo: number, market: MarketCondition, range: ForecastRange, origin = 'Muara Berau, Indonesia', destination = 'Paradip Port, India', commodity = 'Thermal Coal') {
  const current = (20.65 + Math.min(2.4, Math.max(-1.7, (cargo - 80000) / 52000))) * commodityFactor(commodity) * routeFactor(origin, destination)
  const direction = market === 'Rising' ? 1.35 : market === 'Falling' ? -1.15 : -0.32
  const days = horizon(range)
  const forecast = current + direction * days / 30
  const confidence = clamp(94 - days * .16 - (market === 'Stable' ? 0 : 4) - Math.abs(cargo - 80000) / 50000)
  const historical = Array.from({ length: 7 }, (_, index) => Number((current - .62 + index * .1 + Math.sin((cargo / 18000 + index) * .8) * .12).toFixed(2)))
  const points = [...historical, Number(forecast.toFixed(2))]
  return { current: Number(current.toFixed(2)), forecast: Number(forecast.toFixed(2)), change: Number((((forecast - current) / current) * 100).toFixed(1)), confidence: Math.round(confidence), historical, points, trend: direction > .2 ? 'Rising' : direction < -.2 ? 'Falling' : 'Stable' as MarketCondition }
}

export function rankVessels(cargo: number, preferred: VesselType, congestion: Congestion, availabilityOverride = 18) {
  return VESSELS.map((vessel) => {
    const cargoFit = clamp(100 - Math.abs(cargo - vessel.capacity) / Math.max(cargo, vessel.capacity) * 100)
    const portFit = vessel.draft > 14 ? (congestion === 'High' ? 57 : 68) : clamp(98 - (vessel.draft - 10) * 4 - (congestion === 'High' ? 8 : congestion === 'Medium' ? 3 : 0))
    const costEfficiency = clamp(100 - (vessel.baseCost - 17) * 8)
    const availability = clamp(vessel.availability + (availabilityOverride - 18) * .35)
    const preferenceBonus = preferred === vessel.name ? 12 : 0
    const overall = Math.round(cargoFit * .42 + portFit * .2 + costEfficiency * .18 + availability * .2 + preferenceBonus)
    return { ...vessel, cargoFit: Math.round(cargoFit), portFit: Math.round(portFit), costEfficiency: Math.round(costEfficiency), availability: Math.round(availability), overall: clamp(overall) }
  }).sort((a, b) => b.overall - a.overall)
}

export function calculatePort(vessel: Vessel, destination: string, cargo: number) {
  const portLimit = destination.toLowerCase().includes('paradip') ? { draft: 14.5, loa: 240, beam: 35, handling: 60000 } : { draft: 14, loa: 235, beam: 34, handling: 50000 }
  const checks = [
    { label: 'Draft', actual: `${vessel.draft.toFixed(1)}m vessel`, limit: `${portLimit.draft}m port limit`, status: vessel.draft <= portLimit.draft ? 'PASS' : 'FAIL' },
    { label: 'LOA', actual: `${vessel.loa}m vessel`, limit: `${portLimit.loa}m limit`, status: vessel.loa <= portLimit.loa ? 'PASS' : 'FAIL' },
    { label: 'Beam', actual: `${vessel.beam}m vessel`, limit: `${portLimit.beam}m channel`, status: vessel.beam <= portLimit.beam ? 'PASS' : 'WARNING' },
    { label: 'Cargo handling', actual: `${Math.round(cargo / 1.2).toLocaleString()} MT/day`, limit: `required: ${portLimit.handling.toLocaleString()} MT/day`, status: cargo / 1.2 >= portLimit.handling ? 'PASS' : 'WARNING' },
  ] as const
  const score = Math.round(checks.reduce((sum, check) => sum + (check.status === 'PASS' ? 100 : check.status === 'WARNING' ? 62 : 18), 0) / checks.length)
  return { checks, score }
}

export function calculateRisk(market: MarketCondition, congestion: Congestion, availability: number, freightChange: number, portFit: number, cargo: number) {
  const congestionRisk = congestion === 'High' ? 84 : congestion === 'Medium' ? 52 : 18
  const volatility = clamp(26 + Math.abs(freightChange) * 5 + Math.abs(cargo - 80000) / 5000)
  const supplyRisk = clamp(100 - availability + (cargo > 100000 ? 8 : 0))
  const routeRisk = clamp(100 - portFit + (market === 'Rising' ? 17 : market === 'Falling' ? -7 : 4))
  const factors = [
    { label: 'Freight rate volatility', value: Math.round(volatility) }, { label: 'Port congestion', value: congestionRisk },
    { label: 'Vessel availability', value: Math.round(supplyRisk) }, { label: 'Route / market risk', value: Math.round(routeRisk) },
    { label: 'Potential delay', value: Math.round(congestionRisk * .84) }, { label: 'Idle time', value: Math.round(congestionRisk * .6) },
  ]
  return { score: Math.round(factors.reduce((sum, factor) => sum + factor.value, 0) / factors.length), factors }
}

export function calculateCost(cargo: number, freight: number, vessel: Vessel, risk: number, congestion: Congestion) {
  const freightCost = cargo * freight, bunkerCost = cargo * (vessel.name === 'Capesize' ? .98 : vessel.name === 'Panamax' ? .76 : .7), portCost = cargo * .18
  const delayCost = cargo * (congestion === 'High' ? .3 : congestion === 'Medium' ? .14 : .05), idleCost = cargo * (congestion === 'High' ? .18 : congestion === 'Medium' ? .08 : .03)
  const deadheadingCost = cargo * Math.max(.02, (100 - vessel.availability) / 2200), riskPenalty = cargo * risk / 8500
  const total = freightCost + bunkerCost + portCost + delayCost + idleCost + deadheadingCost + riskPenalty
  return { freightCost, bunkerCost, portCost, delayCost, idleCost, deadheadingCost, riskPenalty, total, costPerMT: total / cargo }
}

export function calculateStrategy(freightChange: number, confidence: number, risk: number, cargo: number, costPerMT: number, contractDuration: string, availability: number, congestion: Congestion) {
  const recommendation = freightChange > 4 || (freightChange > 1 && risk > 48) ? 'BUY NOW' : freightChange < -3.5 && confidence > 84 ? 'WAIT' : contractDuration === 'Long-Term' && costPerMT < 25 ? 'MULTI-VOYAGE CONTRACT' : congestion === 'High' || availability < 35 ? 'PARTIAL LOCK' : 'PARTIAL LOCK'
  const lockPercentage = recommendation === 'BUY NOW' ? 85 : recommendation === 'WAIT' ? 20 : recommendation === 'MULTI-VOYAGE CONTRACT' ? 75 : 60
  const expectedSavings = Math.round(Math.abs(freightChange) / 100 * cargo * .55)
  return { recommendation, lockPercentage, expectedSavings, reasons: [`${freightChange < 0 ? 'Softening' : freightChange > 0 ? 'Rising' : 'Stable'} freight curve`, `${confidence}% model confidence`, `Risk score ${risk}/100`] }
}

export function calculateVoyage(input: { cargoQuantity: number; origin: string; destination: string; vesselPreference: VesselType; marketCondition: MarketCondition; portCongestion: Congestion; forecastRange: ForecastRange; contractDuration: string; vesselAvailability: number }) {
  const freight = calculateFreight(input.cargoQuantity, input.marketCondition, input.forecastRange, input.origin, input.destination, input.commodity)
  const commodityFit = input.commodity === 'Iron Ore' ? 1.08 : input.commodity === 'Bauxite' ? 0.96 : input.commodity === 'Grain' ? 0.92 : 1
  const ranked = rankVessels(input.cargoQuantity * commodityFit, input.vesselPreference, input.portCongestion, input.vesselAvailability)
  const selected = input.vesselPreference === 'Auto Select' ? ranked[0] : ranked.find((vessel) => vessel.name === input.vesselPreference) ?? ranked[0]
  const port = calculatePort(selected, input.destination, input.cargoQuantity)
  const risk = calculateRisk(input.marketCondition, input.portCongestion, selected.availability, freight.change, port.score, input.cargoQuantity)
  const cost = calculateCost(input.cargoQuantity, freight.current, selected, risk.score, input.portCongestion)
  const strategy = calculateStrategy(freight.change, freight.confidence, risk.score, input.cargoQuantity, cost.costPerMT, input.contractDuration, input.vesselAvailability, input.portCongestion)
  return { freight, ranked, selected, port, risk, cost, strategy }
}

export type VoyageResult = ReturnType<typeof calculateVoyage>
export const riskTone = (score: number) => score < 30 ? 'green' : score < 50 ? 'yellow' : score < 70 ? 'orange' : score < 85 ? 'red' : 'darkred'
export const delayFor = (congestion: Congestion) => congestion === 'High' ? 3.4 : congestion === 'Medium' ? 2.1 : 1.2

export function chartData(freight: ReturnType<typeof calculateFreight>, range: ForecastRange) {
  const count = range === '7D' ? 4 : range === '15D' ? 6 : 8
  return freight.points.slice(0, count).map((rate, index) => ({ day: index === count - 1 ? `+${horizon(range)}D` : index === 0 ? 'Today' : `+${index * Math.ceil(horizon(range) / count)}D`, rate, forecast: index >= count - 2 ? Number((freight.current + (freight.forecast - freight.current) * Math.max(0, index - (count - 2))).toFixed(2)) : null, confidence: Math.max(72, freight.confidence - index * 2) }))
}

export const defaultVoyage = { origin: 'Muara Berau, Indonesia', destination: 'Paradip Port, India', commodity: 'Thermal Coal', cargoQuantity: 80000, deliveryDate: '12–15 October 2026', vesselPreference: 'Auto Select' as VesselType, selectedVessel: 'Panamax' as VesselType, contractDuration: 'Short-Term', charterPreference: 'Flexible', marketPreference: 'Flexible', marketCondition: 'Stable' as MarketCondition, portCongestion: 'Low' as Congestion, vesselAvailability: 72, forecastRange: '30D' as ForecastRange, laycanWindow: '12–15 Oct 2026' }

export type VoyageState = typeof defaultVoyage
export function getVoyageResult(state: VoyageState) { return calculateVoyage(state) }

export function formatMoney(value: number) { return `$${(value / 1000000).toFixed(2)}M` }
export function formatRisk(score: number) { return score < 30 ? 'Low' : score < 50 ? 'Moderate' : score < 70 ? 'Elevated' : 'High' }
export function formatStatus(status: string) { return status }
export function scoreColor(score: number) { const tone = riskTone(score); return tone === 'green' ? '#087d69' : tone === 'yellow' ? '#c99500' : tone === 'orange' ? '#db7b16' : tone === 'red' ? '#c54d3c' : '#8c2635' }
