'use client';
import Link from 'next/link';
import FotoDokter from './FotoDokter';
import { CalendarDays, Clock, Hash, X, Check } from 'lucide-react';
import { klinik, getDoctor } from '@/lib/data';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { fmtTanggal, sudahLewat, selisihHari, menit, keJam } from '@/lib/waktu';

export default function DaftarJanji() {
  const [punyaku, setPunyaku, loaded] = useLocalStorage('rumpunwaras.janji', []);
  const { hari, sekarang } = useHariIni();
  if (!loaded || !hari) return <p className="py-16 text-center text-slate-600">Memuat janji temu…</p>;

  if (!punyaku.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-xl font-bold text-slate-900">Belum ada janji temu</p>
        <p className="mt-2 text-slate-700">Janji yang kamu buat di peramban ini akan muncul di sini.</p>
        <Link href="/" className="mt-5 inline-block rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800">Buat janji</Link>
      </div>
    );
  }

  const urut = [...punyaku].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const nanti = urut.filter((r) => !sudahLewat(r.date, r.time, -klinik.durasi, sekarang));
  const lalu = urut.filter((r) => sudahLewat(r.date, r.time, -klinik.durasi, sekarang)).reverse();
  const batal = (id) => { if (window.confirm('Batalkan janji temu ini?')) setPunyaku((p) => p.filter((r) => r.id !== id)); };

  return (
    <div className="space-y-10">
      <section aria-labelledby="h-nanti">
        <h2 id="h-nanti" className="text-xl font-bold text-slate-900">Akan datang ({nanti.length})</h2>
        {nanti.length === 0 ? <p className="mt-3 text-slate-700">Tidak ada janji yang akan datang.</p> : (
          <ul className="mt-4 space-y-4">
            {nanti.map((r) => {
              const d = getDoctor(r.doctorId);
              const h = selisihHari(hari, r.date);
              return (
                <li key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {d && <FotoDokter dokter={d} ukuran={52} className="h-13 w-13" />}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">{h === 0 ? 'Hari ini' : h === 1 ? 'Besok' : `${h} hari lagi`}</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{r.doctorName}</p>
                        <p className="text-sm text-slate-700">{r.spec}</p>
                      </div>
                    </div>
                    <p className="font-mono text-sm font-semibold text-slate-800">{r.kode}</p>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-800">
                    <li className="flex items-center gap-1.5"><CalendarDays size={15} aria-hidden="true" /> {fmtTanggal(r.date)}</li>
                    <li className="flex items-center gap-1.5"><Clock size={15} aria-hidden="true" /> {r.time} WIB · datang {keJam(menit(r.time) - klinik.datangLebihAwal)}</li>
                    <li className="flex items-center gap-1.5"><Hash size={15} aria-hidden="true" /> Nomor urut {r.urut}</li>
                  </ul>
                  {d && (
                    <div className="mt-4 rounded-xl bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-blue-950">Sebelum datang</p>
                      <ul className="mt-2 space-y-1">
                        {d.persiapan.map((p) => <li key={p} className="flex gap-2 text-sm text-blue-950"><Check size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {p}</li>)}
                      </ul>
                    </div>
                  )}
                  <button type="button" onClick={() => batal(r.id)} className="mt-2 inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-red-800 hover:underline"><X size={15} aria-hidden="true" /> Batalkan</button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {lalu.length > 0 && (
        <section aria-labelledby="h-lalu">
          <h2 id="h-lalu" className="text-xl font-bold text-slate-900">Sudah lewat</h2>
          <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {lalu.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm text-slate-700">
                <span>{fmtTanggal(r.date, { day: 'numeric', month: 'short', year: 'numeric' })}, {r.time} · {r.doctorName}</span>
                <button type="button" onClick={() => setPunyaku((p) => p.filter((x) => x.id !== r.id))} className="-my-2 py-2 font-semibold text-slate-800 hover:underline">Hapus</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
