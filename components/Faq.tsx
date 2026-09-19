export default function Faq() {
  const faqs: [string, string][] = [
    ['How is the price calculated?', 'Metal weight × today\u2019s live rate + making charges + stone charges (if any) + 3% GST. The breakup is shown on every product — no hidden costs.'],
    ['What does BIS hallmark mean?', '916 = 22K (91.6% pure gold), 750 = 18K, 925 = sterling silver. Every piece is BIS-stamped and ships with its certificate.'],
    ['How do I order?', 'Add pieces to the cart, fill name + phone, tap “Order on WhatsApp”. A neat itemized message opens — you confirm, we keep it ready for store pickup. No online payment.'],
    ['Ring / bangle sizing?', 'Free resizing within 30 days. Use the size guide in Quick View, or WhatsApp us a photo and we confirm before making.'],
    ['Returns & exchange?', '7-day exchange on unworn pieces with tags. Lifetime exchange & buyback value written on your bill.'],
    ['Delivery time?', 'Ready pieces ship insured in 5–7 days; made-to-order takes 10–14 days with tracking included.']
  ];
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <p className="eyebrow text-center">Good to know</p>
      <h2 className="mt-2 text-center font-serif text-[40px]">Questions, <span className="italic text-deepgold">answered</span></h2>
      <div className="mt-8 space-y-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="rounded-2xl border border-sand bg-white px-6 py-4">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-[14px] font-light leading-relaxed text-charcoal/70">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
