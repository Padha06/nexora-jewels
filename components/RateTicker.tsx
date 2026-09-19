import { getLiveRates, formatInr, type LiveRates } from '@/lib/rates';

// Server component: live ticker, cached 10 min. Falls back to labeled
// indicative rates so the page never breaks. "See — it updates automatically."
export default async function RateTicker() {
  let rates: LiveRates;
  try {
    rates = await getLiveRates();
  } catch {
    const { FALLBACK_RATES } = await import('@/lib/rates');
    rates = FALLBACK_RATES;
  }
  const items: [string, number][] = [
    ['24K Gold', rates.perGramInr['24K']],
    ['22K Gold', rates.perGramInr['22K']],
    ['18K Gold', rates.perGramInr['18K']],
    ['925 Silver', rates.perGramInr.silver925]
  ];
  return (
    <div className="overflow-hidden border-b border-sand bg-charcoal py-2 text-ivory">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-1 px-6 text-[12px] tracking-[0.12em] lg:px-10">
        <span className="uppercase text-gold">
          {rates.source === 'live' ? '● Live rate / gram' : '○ Indicative rate / gram'}
        </span>
        {items.map(([k, v]) => (
          <span key={k}>
            {k} <b className="text-ivory">{formatInr(v)}</b>
          </span>
        ))}
        <span className="ml-auto hidden text-ivory/50 sm:inline">BIS Hallmark · Transparent pricing</span>
      </div>
    </div>
  );
}
