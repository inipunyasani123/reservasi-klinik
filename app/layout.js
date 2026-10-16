import './globals.css';
import { Inter } from 'next/font/google';
import Kepala from '@/components/Kepala';
import Kaki from '@/components/Kaki';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const __jsonld = {"@context":"https://schema.org","@type":"WebSite","name":"Klinik Rumpun Waras","description":"Janji temu klinik keluarga: pilih dokter umum, anak, gigi, atau penyakit dalam, lalu jam praktik yang masih kosong, plus persiapan sebelum datang.","url":"https://reservasi-klinik.pintuweb.id","inLanguage":"id"};

export const metadata = {
  metadataBase: new URL("https://reservasi-klinik.pintuweb.id"),
  title: { default: "Klinik Rumpun Waras — Buat janji temu dokter", template: "%s — Klinik Rumpun Waras" },
  description: "Janji temu klinik keluarga: pilih dokter umum, anak, gigi, atau penyakit dalam, lalu jam praktik yang masih kosong, plus persiapan sebelum datang.",
  applicationName: "Klinik Rumpun Waras",
  keywords: ["janji temu dokter", "klinik keluarga", "jadwal praktik dokter", "dokter anak", "dokter gigi"],
  authors: [{ name: "Klinik Rumpun Waras" }],
  creator: "Klinik Rumpun Waras",
  publisher: "Klinik Rumpun Waras",
  alternates: { canonical: "https://reservasi-klinik.pintuweb.id" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://reservasi-klinik.pintuweb.id",
    siteName: "Klinik Rumpun Waras",
    title: "Klinik Rumpun Waras — Buat janji temu dokter",
    description: "Janji temu klinik keluarga: pilih dokter umum, anak, gigi, atau penyakit dalam, lalu jam praktik yang masih kosong, plus persiapan sebelum datang.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Klinik Rumpun Waras — Buat janji temu dokter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinik Rumpun Waras — Buat janji temu dokter",
    description: "Janji temu klinik keluarga: pilih dokter umum, anak, gigi, atau penyakit dalam, lalu jam praktik yang masih kosong, plus persiapan sebelum datang.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = { themeColor: '#2563eb' };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        <Kepala />
        {children}
        <Kaki />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        <aside aria-label="Tentang situs demo ini" style={{ display: 'block', margin: 0, padding: '12px 16px', background: '#0f1b33', color: '#dfe6f3', font: '400 13px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href="https://www.pintuweb.id/kontak?demo=klinik" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Buat yang seperti ini →</a>
        </aside>
        </body>
    </html>
  );
}
