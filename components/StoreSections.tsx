'use client';

import { useState } from 'react';
import { buildEnquiryUrl, WA_NUMBER, SHOP_ADDRESS, SHOP_PHONE_DISPLAY } from '@/lib/whatsapp';

// Store footfall kit: free Google Maps embed, Cal.com booking link,
// custom-order form → WhatsApp, gold savings scheme → WhatsApp.
export default function StoreSections() {
  const [custom, setCustom] = useState({ type: 'Bridal polki set', budget: '', phone: '' });
  const [scheme, setScheme] = useState({ name: '', phone: '', monthly: '5000' });

  return (
    <section className="border-y border-sand bg-cream/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="eyebrow">Visit us</p>
          <h2 className="mt-2 font-serif text-[40px] leading-tight">Try it on <span className="italic text-deepgold">in person</span></h2>
          <p className="mt-2 text-[14px] text-charcoal/65">{SHOP_ADDRESS}<br />Ph: {SHOP_PHONE_DISPLAY} · Open daily 11–8</p>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-sand">
            <iframe
              title="Store location map"
              src="https://www.google.com/maps?q=Bhagwan+Nagar+Ground+Nagpur+440027&output=embed"
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi NEXORA! I want to book a store visit.')}`}
              target="_blank"
              className="bg-charcoal px-6 py-3.5 text-[12px] uppercase tracking-[0.2em] text-ivory hover:bg-deepgold"
            >
              Book store visit
            </a>
            <a
              href="https://cal.com"
              target="_blank"
              rel="noreferrer"
              className="border border-charcoal px-6 py-3.5 text-[12px] uppercase tracking-[0.2em] hover:bg-charcoal hover:text-ivory"
            >
              Pick a time slot
            </a>
          </div>
          <p className="mt-2 text-[12px] text-charcoal/50">Free Cal.com tier — bookings land in your calendar + WhatsApp.</p>
        </div>

        <div className="space-y-5">
          <div className="rounded-[18px] border border-sand bg-white p-6">
            <p className="font-serif text-2xl">Custom / bridal order</p>
            <p className="text-[13px] text-charcoal/60">Describe it — the message arrives ready-made on your WhatsApp.</p>
            <input value={custom.type} onChange={(e) => setCustom({ ...custom, type: e.target.value })} placeholder="What to make (e.g. bridal polki set)" className="mt-3 w-full border border-sand px-4 py-2.5 text-[14px]" />
            <div className="mt-2 flex gap-2">
              <input value={custom.budget} onChange={(e) => setCustom({ ...custom, budget: e.target.value })} placeholder="Budget ₹" className="flex-1 border border-sand px-4 py-2.5 text-[14px]" />
              <input value={custom.phone} onChange={(e) => setCustom({ ...custom, phone: e.target.value })} placeholder="Phone" className="flex-1 border border-sand px-4 py-2.5 text-[14px]" />
            </div>
            <a href={buildEnquiryUrl('Custom order request', { Piece: custom.type, Budget: custom.budget, Phone: custom.phone })} target="_blank" className="mt-3 inline-block bg-charcoal px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-ivory">Send on WhatsApp</a>
          </div>

          <div className="rounded-[18px] border border-gold/50 bg-ivory p-6">
            <p className="font-serif text-2xl">Gold savings scheme <span className="italic text-deepgold">11 + 1</span></p>
            <p className="text-[13px] text-charcoal/60">Pay 11 instalments, we add the 12th. Recurring revenue, zero software cost.</p>
            <div className="mt-3 flex gap-2">
              <input value={scheme.name} onChange={(e) => setScheme({ ...scheme, name: e.target.value })} placeholder="Name" className="flex-1 border border-sand bg-white px-4 py-2.5 text-[14px]" />
              <input value={scheme.phone} onChange={(e) => setScheme({ ...scheme, phone: e.target.value })} placeholder="Phone" className="flex-1 border border-sand bg-white px-4 py-2.5 text-[14px]" />
              <select value={scheme.monthly} onChange={(e) => setScheme({ ...scheme, monthly: e.target.value })} className="border border-sand bg-white px-3 py-2.5 text-[14px]">
                <option value="2000">₹2k/mo</option>
                <option value="5000">₹5k/mo</option>
                <option value="11000">₹11k/mo</option>
              </select>
            </div>
            <a href={buildEnquiryUrl('Gold savings scheme enrollment', { Name: scheme.name, Phone: scheme.phone, Plan: `₹${scheme.monthly}/month, 11+1` })} target="_blank" className="mt-3 inline-block bg-deepgold px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-ivory">Enroll on WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}
