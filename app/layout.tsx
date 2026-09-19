import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEXORA Jeweller — BIS Hallmarked Fine Jewellery',
  description:
    'Premium Indian fine jewellery: BIS-hallmarked 22K gold rings, necklaces, earrings, bangles. WhatsApp concierge ordering.',
  openGraph: {
    title: 'NEXORA Jeweller — Heirlooms, Reimagined',
    description: 'Drag the ring. Feel the gold. BIS-hallmarked craftsmanship.',
    type: 'website',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80'
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ivory text-charcoal font-sans">{children}</body>
    </html>
  );
}
