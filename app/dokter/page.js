import Link from 'next/link';
import { Check } from 'lucide-react';
import { doctors, HARI } from '@/lib/data';
import { halaman } from '@/lib/seo';

export const metadata = halaman({
  judul: 'Dokter & jadwal',
  deskripsi: 'Jadwal praktik dokter umum, spesialis anak, dokter gigi, dan spesialis penyakit dalam di Klinik Rumpun Waras, beserta persiapan sebelum datang.',
  path: '/dokter',
});

const MINGGU = [1, 2, 3, 4, 5, 6]; // Senin–Sabtu

export default function DokterPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Dokter & jadwal praktik</h1>
      <p className="mt-2 max-w-2xl text-slate-700">Empat dokter, enam hari seminggu. Minggu dan hari libur nasional klinik tutup.</p>

      {/* Di ponsel tabel digeser ke samping: wilayahnya bisa difokus keyboard, kolom dokter tetap terlihat. */}
      <div className="relative mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm" tabIndex={0} role="region" aria-label="Jadwal praktik mingguan, geser ke samping di layar sempit">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Jadwal praktik mingguan</caption>
          <thead className="bg-slate-50 text-slate-800">
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-slate-50 px-4 py-3 font-semibold">Dokter</th>
              {MINGGU.map((h) => <th key={h} scope="col" className="px-3 py-3 text-center font-semibold">{HARI[h].slice(0, 3)}</th>)}
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id} className="border-t border-slate-100">
                <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3 font-normal shadow-[1px_0_0_rgb(241_245_249)]">
                  <span className="block font-semibold text-slate-900">{d.name}</span>
                  <span className="text-xs text-blue-800">{d.spec}</span>
                </th>
                {MINGGU.map((h) => (
                  <td key={h} className="px-3 py-3 text-center">
                    {d.hari.includes(h) ? <span className="inline-block rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-900">{d.start}–{d.end}</span> : <><span className="text-slate-500" aria-hidden="true">—</span><span className="sr-only">Tidak praktik</span></>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {doctors.map((d) => (
          <section key={d.id} id={d.id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${d.color}`} aria-hidden="true">{d.initials}</span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{d.name}</h2>
                <p className="text-sm font-medium text-blue-800">{d.spec}</p>
              </div>
            </div>
            <p className="mt-4 text-slate-800">{d.tentang}</p>
            <p className="mt-2 text-sm text-slate-700">{d.hari.map((h) => HARI[h]).join(', ')} · {d.start}–{d.end}</p>
            <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-800">Sebelum datang</h3>
            <ul className="mt-2 space-y-1.5">
              {d.persiapan.map((p) => <li key={p} className="flex gap-2 text-sm text-slate-800"><Check size={16} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" /> {p}</li>)}
            </ul>
            <Link href={`/?dokter=${d.id}`} className="mt-5 inline-block rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">Buat janji dengan {d.name.split(',')[0]}</Link>
          </section>
        ))}
      </div>
    </main>
  );
}
