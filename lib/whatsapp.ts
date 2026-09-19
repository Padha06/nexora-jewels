// WhatsApp checkout v2 — itemized message in the format Indian jewellers use:
// SKU, variant (purity/size/weight), line price, qty, total + buyer + note.
// Zero cost: plain wa.me link, no Business API. No payment, store pickup.

export const WA_NUMBER = '918554012234'; // Client: +91 85540 12234
export const SHOP_NAME = 'NEXORA Jeweller';
export const SHOP_ADDRESS = 'Bhagwan Nagar, Near Bhagwan Nagar Ground, Nagpur 440027';
export const SHOP_PHONE_DISPLAY = '+91 85540 12234';

export interface CartLine {
  sku: string;
  name: string;
  variant: string; // e.g. "22K Gold, Size 14 · 5.2g"
  price: number; // line total for qty (INR)
  qty: number;
}

export interface Buyer {
  name: string;
  phone: string;
  note: string; // e.g. "Please keep ready for store pickup"
}

export function formatInrShort(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function buildWhatsAppUrl(lines: CartLine[], buyer: Buyer): string {
  const items =
    lines.length > 0
      ? lines
          .map(
            (l, i) =>
              `${i + 1}. ${l.name} (SKU: ${l.sku})\n   - ${l.variant}\n   - Price: ${formatInrShort(l.price)}\n   - Qty: ${l.qty}`
          )
          .join('\n\n')
      : 'Enquiry — please share today\u2019s collection';
  const total = lines.reduce((s, l) => s + l.price * 1, 0);
  const text =
    `Hello ${SHOP_NAME},\nI want to order:\n\n${items}\n\n` +
    (lines.length > 0 ? `Total: ${formatInrShort(total)}\n` : '') +
    `Name: ${buyer.name || '—'}\nPhone: ${buyer.phone || '—'}\nNote: ${buyer.note || 'Please keep ready for store pickup.'}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Custom-order / savings-scheme / appointment forms reuse the same free pipe.
export function buildEnquiryUrl(subject: string, fields: Record<string, string>): string {
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v || '—'}`)
    .join('\n');
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello ${SHOP_NAME},\n${subject}\n\n${body}`)}`;
}
