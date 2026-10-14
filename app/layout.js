import './globals.css';
import { Inter } from 'next/font/google';
import Kepala from '@/components/Kepala';
import Kaki from '@/components/Kaki';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const __jsonld = {"@context":"https://schema.org","@type":"WebSite","name":"Klinik Rumpun Waras","description":"Janji temu klinik keluarga: pilih dokter umum, anak, gigi, atau penyakit dalam, lalu jam praktik yang masih kosong. Lengkap dengan jadwal mingguan dan persiapan sebelum datang.","url":"https://reservasi-klinik.pintuweb.id","inLanguage":"id"};

export const metadata = {
  metadataBase: new URL("https://reservasi-klinik.pintuweb.id"),
  title: { default: "Klinik Rumpun Waras — Buat janji temu dokter", template: "%s — Klinik Rumpun Waras" },
  description: "Janji temu klinik keluarga: pilih dokter umum, anak, gigi, atau penyakit dalam, lalu jam praktik yang masih kosong. Lengkap dengan jadwal mingguan dan persiapan sebelum datang.",
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
    description: "Janji temu klinik keluarga: pilih dokter umum, anak, gigi, atau penyakit dalam, lalu jam praktik yang masih kosong. Lengkap dengan jadwal mingguan dan persiapan sebelum datang.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Klinik Rumpun Waras — Buat janji temu dokter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinik Rumpun Waras — Buat janji temu dokter",
    description: "Janji temu klinik keluarga: pilih dokter umum, anak, gigi, atau penyakit dalam, lalu jam praktik yang masih kosong. Lengkap dengan jadwal mingguan dan persiapan sebelum datang.",
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
        </body>
    </html>
  );
}
