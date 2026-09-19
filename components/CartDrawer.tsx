'use client';

import { useState } from 'react';
import { useShop } from '@/lib/store';
import { buildWhatsAppUrl, formatInrShort } from '@/lib/whatsapp';

// Persistent cart drawer (localStorage): variant lines, qty merge,
// buyer fields, itemized wa.me checkout. "You get a ready-made order message."
export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeLine, clearCart } = useShop();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('Please keep ready for store pickup.');
  const total = cart.reduce((s, l) => s + l.price, 0);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory p-7">
        <div className="flex items-center justify-between">
          <p className="font-serif text-3xl">Your selection ({cart.length})</p>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        <div className="mt-6 flex-1 space-y-3 overflow-auto text-[14px]">
          {cart.length === 0 && <p className="font-light text-charcoal/50">Empty — quick-view any piece to add it with size and purity.</p>}
          {cart.map((c) => (
            <div key={c.sku + c.variant} className="rounded-xl border border-sand bg-white px-4 py-3">
              <div className="flex justify-between gap-3">
                <b>{c.name}</b>
                <button onClick={() => removeLine(c.sku, c.variant)} className="text-deepgold">Remove</button>
              </div>
              <p className="text-charcoal/60">SKU: {c.sku} · {c.variant} · Qty {c.qty}</p>
              <p className="text-deepgold">{c.price > 0 ? formatInrShort(c.price) : 'Priced at today\u2019s rate on WhatsApp'}</p>
            </div>
          ))}
        </div>
        <div className="gold-line my-4" />
        {total > 0 && <p className="mb-3 font-serif text-2xl">Total: <span className="text-deepgold">{formatInrShort(total)}</span></p>}
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mb-2 border border-sand bg-white px-4 py-3 text-[14px]" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="mb-2 border border-sand bg-white px-4 py-3 text-[14px]" />
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Note" className="mb-3 border border-sand bg-white px-4 py-3 text-[14px]" />
        <a
          href={buildWhatsAppUrl(cart, { name, phone, note })}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-charcoal py-4 text-center text-[12px] uppercase tracking-[0.2em] text-ivory hover:bg-deepgold"
        >
          Order on WhatsApp
        </a>
        <div className="mt-2 flex justify-between text-[12px] text-charcoal/50">
          <span>No payment online — pay on confirmation.</span>
          {cart.length > 0 && <button onClick={clearCart} className="underline">Clear</button>}
        </div>
      </aside>
    </div>
  );
}
