// Live gold & silver rates — free, no API key (goldprice.dev anonymous tier).
// Spot per troy ounce → per-gram INR by karat. Cached + fallback so the
// ticker never breaks the page if the API is down or stale.

export interface LiveRates {
  perGramInr: { '24K': number; '22K': number; '18K': number; silver925: number };
  source: 'live' | 'fallback';
  updatedAt: string;
}

// Last-known-good fallback (indicative only — labeled as such in UI)
export const FALLBACK_RATES: LiveRates = {
  perGramInr: { '24K': 9750, '22K': 8940, '18K': 7315, silver925: 102 },
  source: 'fallback',
  updatedAt: 'indicative'
};

const TROY_OZ_G = 31.1035;

async function fetchSpot(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.goldprice.dev/v1/prices?symbol=${symbol}`,
      { next: { revalidate: 600 } } // cache 10 min: ~144 calls/day, well under free tier
    );
    if (!res.ok) return null;
    const json = await res.json();
    const row = json?.symbols?.[0];
    if (!row || row.is_stale) return null;
    const p = parseFloat(row.price);
    return Number.isFinite(p) ? p : null;
  } catch {
    return null;
  }
}

export async function getLiveRates(): Promise<LiveRates> {
  const [goldInrOz, silverInrOz] = await Promise.all([
    fetchSpot('XAU-INR-SPOT'),
    fetchSpot('XAG-INR-SPOT')
  ]);
  if (goldInrOz == null) return FALLBACK_RATES;
  const g24 = goldInrOz / TROY_OZ_G;
  const silverFine = silverInrOz != null ? silverInrOz / TROY_OZ_G : FALLBACK_RATES.perGramInr.silver925 / 0.925;
  return {
    perGramInr: {
      '24K': Math.round(g24),
      '22K': Math.round((g24 * 22) / 24),
      '18K': Math.round((g24 * 18) / 24),
      silver925: Math.round(silverFine * 0.925)
    },
    source: 'live',
    updatedAt: new Date().toISOString()
  };
}

export function formatInr(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
