import { formatInr } from './rates';

// Transparent Indian jewellery price breakup:
// metal value + making charges + stone charges + 3% GST.
// Everything derives from today's live rate — the customer sees the math.

export interface PriceInput {
  weightG: number;
  ratePerGram: number;
  makingPct: number; // e.g. 12 for 12%
  stoneCharges?: number;
  gstPct?: number; // 3% default
}

export interface PriceBreakup {
  metalValue: number;
  making: number;
  stone: number;
  subtotal: number;
  gst: number;
  total: number;
}

export function calcPrice(i: PriceInput): PriceBreakup {
  const stone = i.stoneCharges ?? 0;
  const gstPct = i.gstPct ?? 3;
  const metalValue = i.weightG * i.ratePerGram;
  const making = (metalValue * i.makingPct) / 100;
  const subtotal = metalValue + making + stone;
  const gst = (subtotal * gstPct) / 100;
  return { metalValue, making, stone, subtotal, gst, total: subtotal + gst };
}

export function breakupLines(b: PriceBreakup): string[] {
  return [
    `Metal: ${formatInr(b.metalValue)}`,
    `Making: ${formatInr(b.making)}`,
    ...(b.stone > 0 ? [`Stones: ${formatInr(b.stone)}`] : []),
    `GST (3%): ${formatInr(b.gst)}`,
    `Total: ${formatInr(b.total)}`
  ];
}
