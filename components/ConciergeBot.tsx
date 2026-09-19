'use client';

import { useState } from 'react';
import { WA_NUMBER } from '@/lib/whatsapp';

// FAQ concierge: sizing, purity/hallmark, returns, delivery, how to order.
// Price questions redirect to WhatsApp — never hallucinated.
const ANSWERS: [RegExp, string][] = [
  [
    /price|cost|rate|gold.*today|today.*gold/i,
    `I don't guess prices — gold moves daily. Get today's exact rate here: https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! Please share today's rate")}`
  ],
  [
    /size|sizing|measure/i,
    'Rings: free resizing within 30 days. Bangles: measure knuckle width — send a photo and we confirm size before making.'
  ],
  [
    /bis|hallmark|purity|916|22k|18k|925/i,
    '916 = 22K (91.6% gold), 750 = 18K, 925 = sterling silver. Every piece is BIS-stamped and ships with its certificate.'
  ],
  [/return|exchange|refund/i, '7-day exchange on unworn pieces with tags; lifetime exchange & buyback value in writing on your bill.'],
  [/deliver|shipping|time/i, 'Insured delivery across India in 5–7 days (made-to-order 10–14). Tracking + insurance included.'],
  [/order|buy|whatsapp/i, "Add to cart, fill name/phone/address, hit 'Order on WhatsApp' — your itemized message opens automatically."]
];

export default function ConciergeBot() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const send = (q: string) => {
    const query = q.trim();
    if (!query) return;
    const hit = ANSWERS.find(([re]) => re.test(query));
    setLog((l) => [
      ...l,
      `You: ${query}`,
      hit
        ? hit[1]
        : `Lovely question — our concierge will confirm personally on WhatsApp: https://wa.me/${WA_NUMBER}`
    ]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setLog((l) =>
            l.length ? l : ["Concierge: Namaste! Ask about sizing, purity / BIS hallmark, delivery, returns — or tap below for today's price on WhatsApp."]
          );
        }}
        className="fixed bottom-6 left-6 z-[70] rounded-full bg-charcoal px-5 py-3.5 text-[12px] uppercase tracking-[0.18em] text-ivory shadow-2xl"
      >
        Concierge · Ask
      </button>
      {open && (
        <div className="fixed bottom-24 left-6 z-[80] hidden w-[330px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-[18px] border border-sand bg-white shadow-2xl sm:block">
          <div className="flex items-center justify-between bg-charcoal px-5 py-4 text-ivory">
            <div>
              <p className="font-serif text-xl">Concierge</p>
              <p className="text-[11px] text-ivory/60">Sizing · Purity · Delivery · Orders</p>
            </div>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="h-64 space-y-2.5 overflow-auto p-4 text-[13.5px]">
            {log.map((m, i) => (
              <div key={i} className="rounded-xl border border-sand bg-cream px-3.5 py-2.5">
                {m}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-sand p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Ask about sizing, BIS, delivery…"
              className="flex-1 border border-sand px-3 py-2.5 text-[13px]"
            />
            <button onClick={() => send(input)} className="bg-charcoal px-4 text-[12px] uppercase tracking-widest text-ivory">
              Ask
            </button>
          </div>
        </div>
      )}
      {open && (
        <div className="fixed bottom-24 left-6 right-6 z-[80] rounded-[18px] border border-sand bg-white p-4 shadow-2xl sm:hidden">
          <p className="text-sm">Chat with us on WhatsApp for instant answers:</p>
          <a className="mt-2 inline-block bg-charcoal px-5 py-3 text-[12px] uppercase tracking-widest text-ivory" href={`https://wa.me/${WA_NUMBER}`} target="_blank">
            Open WhatsApp
          </a>
          <button className="ml-4" onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}
