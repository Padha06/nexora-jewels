// Simple Prisma-style admin (no Shopify). Backed by lib/products.ts until `prisma db push`.
// Run: npx prisma db push  →  swap this table's source to prisma.product.findMany().

import { products } from '@/lib/products';

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow">Staff only</p>
      <h1 className="mt-2 font-serif text-5xl">Catalog admin <span className="italic text-deepgold">(simple)</span></h1>
      <p className="mt-3 max-w-xl font-light text-charcoal/70">
        Client edits SKU, name, category, metal, purity, weight, making %, stone charges,
        sizes and images — no code. Null price = live-rate calculator pricing.
      </p>
      <div className="mt-10 overflow-x-auto border border-sand bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-sand text-[11px] uppercase tracking-[0.2em] text-charcoal/60">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Purity</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Making</th>
              <th className="px-4 py-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug} className="border-b border-sand/60">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{p.purity}</td>
                <td className="px-4 py-3">{p.grossWeight}</td>
                <td className="px-4 py-3">{p.makingCharges}</td>
                <td className="px-4 py-3 text-deepgold">{p.priceInr ?? 'On request'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a href="/" className="mt-8 inline-block border border-charcoal px-6 py-3 text-[12px] uppercase tracking-[0.2em]">← Back to site</a>
    </main>
  );
}
