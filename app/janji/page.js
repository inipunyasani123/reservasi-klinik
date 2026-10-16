import DaftarJanji from '@/components/DaftarJanji';
import { halaman } from '@/lib/seo';

export const metadata = halaman({
  judul: 'Janji saya',
  deskripsi: 'Lihat, siapkan, dan batalkan janji temu Klinik Rumpun Waras yang tersimpan di peramban ini.',
  path: '/janji',
  robots: { index: false, follow: true },
});

export default function JanjiPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Janji saya</h1>
      <p className="mt-2 text-slate-700">Tersimpan di peramban ini saja — bukan rekam medis, dan tidak terkirim ke klinik.</p>
      <div className="mt-8"><DaftarJanji /></div>
    </main>
  );
}
