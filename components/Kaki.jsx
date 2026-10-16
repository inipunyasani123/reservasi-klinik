import Link from 'next/link';
import { klinik, doctors } from '@/lib/data';

export default function Kaki() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-1">
          <p className="text-lg font-bold text-slate-900">{klinik.name}</p>
          <p className="mt-2 text-sm text-slate-700">{klinik.tagline}.</p>
        </div>
        <div className="text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Jam layanan</p>
          <p className="mt-2">{klinik.jam}</p>
          <p className="mt-1">Gawat darurat: hubungi 112 atau IGD terdekat.</p>
        </div>
        <nav aria-label="Dokter" className="text-sm">
          <p className="font-semibold text-slate-900">Dokter</p>
          <ul className="mt-2 space-y-1">
            {doctors.map((d) => <li key={d.id}><Link href={`/dokter#${d.id}`} className="inline-block py-1 text-slate-700 underline-offset-4 hover:text-blue-800 hover:underline">{d.name}</Link></li>)}
          </ul>
        </nav>
      </div>
      <p className="border-t border-slate-200 px-5 py-4 text-center text-xs text-slate-700">Purwarupa desain: klinik dan dokter fiktif. Janji temu hanya disimpan di peramban ini, bukan rekam medis.</p>
    </footer>
  );
}
