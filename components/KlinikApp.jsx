'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, Check, User, Phone, ClipboardList, ChevronRight, Search, Siren } from 'lucide-react';
import { klinik, doctors, kategori, buildSlots, terisiContoh, HARI } from '@/lib/data';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { useDialog } from '@/lib/useDialog';
import { tambahHari, hariKe, fmtTanggal, sudahLewat, kodePesan } from '@/lib/waktu';

const STEPS = ['Dokter', 'Jadwal', 'Data', 'Selesai'];
const KOSONG = { name: '', phone: '', complaint: '', jenis: 'baru', bayar: 'umum' };

// Gulir ke langkah berikutnya dan fokuskan judulnya (tanpa animasi bila pengguna minta gerak dikurangi).
function keLangkah(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  el.focus({ preventScroll: true });
}

export default function KlinikApp() {
  const { hari, sekarang } = useHariIni(60);
  const [punyaku, setPunyaku] = useLocalStorage('rumpunwaras.janji', []);
  const [doctorId, setDoctorId] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState(KOSONG);
  const [query, setQuery] = useState('');
  const [spec, setSpec] = useState('Semua');
  const [done, setDone] = useState(null);
  const dialog = useDialog(!!done, () => setDone(null));
  const judulJadwal = useRef(null);
  const judulData = useRef(null);
  const [langkah, setLangkah] = useState(null);

  // ?dokter= dari halaman Dokter & jadwal (dibaca setelah dimuat supaya halaman tetap dirender di server).
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get('dokter');
    if (doctors.some((x) => x.id === d)) { setDoctorId(d); setLangkah('jadwal'); }
  }, []);
  useEffect(() => {
    if (!langkah) return;
    keLangkah(langkah === 'jadwal' ? judulJadwal.current : judulData.current);
    setLangkah(null);
  }, [langkah]);

  const doctor = doctors.find((d) => d.id === doctorId) || null;
  const slots = useMemo(() => (doctor ? buildSlots(doctor.start, doctor.end) : []), [doctor]);
  const lewat = (d, s) => (sekarang ? sudahLewat(d, s, 30, sekarang) : true);

  // 14 hari ke depan, hanya hari praktik dokter yang masih punya slot.
  const hariPraktik = useMemo(() => {
    if (!doctor || !hari) return [];
    return Array.from({ length: 14 }, (_, i) => tambahHari(hari, i)).filter((d) => doctor.hari.includes(hariKe(d)) && slots.some((s) => !lewat(d, s)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor, hari, slots, sekarang]);

  useEffect(() => { if (hariPraktik.length && !hariPraktik.includes(date)) { setDate(hariPraktik[0]); setTime(null); } }, [hariPraktik, date]);

  const bookedSlots = useMemo(() => {
    if (!doctor || !date) return [];
    return [...terisiContoh(doctor, date), ...punyaku.filter((r) => r.doctorId === doctorId && r.date === date).map((r) => r.time)];
  }, [punyaku, doctor, doctorId, date]);

  const visibleDoctors = useMemo(() => doctors.filter((d) => {
    const q = query.trim().toLowerCase();
    const okQ = !q || d.name.toLowerCase().includes(q) || d.spec.toLowerCase().includes(q);
    return okQ && (spec === 'Semua' || d.kategori === spec);
  }), [query, spec]);

  const step = done ? 4 : time ? 3 : doctor ? 2 : 1;
  const pickDoctor = (id) => { setDoctorId(id); setDate(null); setTime(null); setLangkah('jadwal'); };
  const pickTime = (s) => { setTime(s); setLangkah('data'); };

  const confirm = (e) => {
    e.preventDefault();
    if (!doctor || !time || !form.name.trim() || !form.phone.trim()) return;
    const id = `a-${Date.now()}`;
    const appt = { id, kode: kodePesan('RW', id), doctorId, doctorName: doctor.name, spec: doctor.spec, date, time, urut: slots.indexOf(time) + 1, ...form, dibuat: new Date().toISOString() };
    setPunyaku((p) => [...p, appt]);
    setDone(appt);
    setTime(null);
    setForm(KOSONG);
  };

  const field = 'flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-blue-600';

  return (
    <div>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <p className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <Siren size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>Sesak napas, nyeri dada, atau pendarahan hebat? Jangan menunggu janji temu — hubungi <strong>112</strong> atau datang ke IGD terdekat.</span>
        </p>

        <ol className="mb-8 flex items-center" aria-label="Langkah">
          {STEPS.map((s, i) => {
            const n = i + 1; const active = step >= n;
            return (
              <li key={s} className="flex flex-1 items-center last:flex-none" aria-current={step === n ? 'step' : undefined}>
                <div className="flex flex-col items-center gap-1.5">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${active ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {step > n ? <Check size={15} aria-hidden="true" /> : n}
                  </span>
                  <span className={`text-[11px] font-semibold ${active ? 'text-blue-800' : 'text-slate-600'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`mx-2 h-1 flex-1 rounded-full ${step > n ? 'bg-blue-700' : 'bg-slate-200'}`} aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        <h1 className="text-2xl font-bold text-slate-900">Buat janji temu</h1>
        <p className="mt-1 text-sm text-slate-700">Pilih dokter, lalu jam yang masih kosong. Satu janji untuk {klinik.durasi} menit.</p>

        <div className="relative mt-4">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama dokter atau spesialisasi…" aria-label="Cari dokter"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Saring spesialisasi">
          {kategori.map((s) => (
            <button key={s} type="button" onClick={() => setSpec(s)} aria-pressed={spec === s}
              className={`min-h-9 rounded-full px-4 py-1.5 text-xs font-semibold transition ${spec === s ? 'bg-blue-700 text-white shadow' : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visibleDoctors.map((d) => {
            const active = doctorId === d.id;
            return (
              <button key={d.id} type="button" onClick={() => pickDoctor(d.id)} aria-pressed={active}
                className={`relative flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition ${active ? 'border-2 border-blue-700' : 'border-slate-200 hover:border-blue-400'}`}>
                {active && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white" aria-hidden="true"><Check size={14} /></span>}
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${d.color}`} aria-hidden="true">{d.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900">{d.name}</span>
                  <span className="block text-xs font-medium text-blue-800">{d.spec}</span>
                  <span className="mt-1 flex items-center gap-1 text-xs text-slate-700"><Clock size={12} aria-hidden="true" /> {d.hari.map((h) => HARI[h].slice(0, 3)).join(', ')} · {d.start}–{d.end}</span>
                </span>
              </button>
            );
          })}
          {visibleDoctors.length === 0 && <p className="col-span-full py-6 text-center text-sm text-slate-600">Tidak ada dokter yang cocok.</p>}
        </div>

        {doctor && (
          <section aria-labelledby="h-jadwal" className="anim-naik">
            <h2 id="h-jadwal" ref={judulJadwal} tabIndex={-1} className="mt-10 scroll-mt-28 text-sm font-bold uppercase tracking-wide text-slate-800 outline-none">Pilih tanggal &amp; jam</h2>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {!hari ? <p className="text-sm text-slate-600">Memuat jadwal…</p> : hariPraktik.length === 0 ? <p className="text-sm text-slate-700">Tidak ada jadwal tersisa dalam dua minggu ke depan.</p> : (
                <>
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-800"><CalendarDays size={16} className="text-blue-700" aria-hidden="true" /> Hari praktik {doctor.name.split(',')[0]}</p>
                  <div className="relative mt-3 flex gap-2 overflow-x-auto pb-1">
                    {hariPraktik.map((d) => (
                      <button key={d} type="button" onClick={() => { setDate(d); setTime(null); }} aria-pressed={date === d}
                        className={`shrink-0 rounded-lg border px-3 py-2 text-center text-sm transition ${date === d ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white text-slate-800 hover:border-blue-500'}`}>
                        <span className="block text-[11px] uppercase">{HARI[hariKe(d)].slice(0, 3)}</span>
                        <span className="block font-bold">{fmtTanggal(d, { day: 'numeric', month: 'short' })}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {slots.map((s) => {
                      const booked = bookedSlots.includes(s); const habis = date ? lewat(date, s) : true; const active = time === s;
                      return (
                        <button key={s} type="button" data-slot disabled={booked || habis} onClick={() => pickTime(s)} aria-pressed={active}
                          aria-label={`${s}${booked ? ', terisi' : habis ? ', sudah lewat' : ''}`}
                          className={`rounded-lg border py-2 text-sm font-semibold transition ${active ? 'border-blue-700 bg-blue-700 text-white' : booked || habis ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-500 line-through' : 'border-slate-300 bg-white text-slate-800 hover:border-blue-500 hover:text-blue-800'}`}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-slate-700">Jam yang dicoret sudah terisi atau tinggal kurang dari 30 menit.</p>
                </>
              )}
            </div>
          </section>
        )}

        {doctor && time && (
          <form onSubmit={confirm} aria-labelledby="h-data" className="anim-naik">
            <h2 id="h-data" ref={judulData} tabIndex={-1} className="mt-10 scroll-mt-28 text-sm font-bold uppercase tracking-wide text-slate-800 outline-none">Data pasien</h2>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm">
                <span className="font-semibold text-blue-950">{doctor.name}</span>
                <span className="text-blue-900">{fmtTanggal(date)} · {time} · nomor urut {slots.indexOf(time) + 1}</span>
              </div>
              <div className="space-y-3">
                <label className={field}><User size={16} className="text-slate-500" aria-hidden="true" /><span className="sr-only">Nama pasien</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama pasien" autoComplete="name" required className="w-full bg-transparent text-sm outline-none" /></label>
                <label className={field}><Phone size={16} className="text-slate-500" aria-hidden="true" /><span className="sr-only">Nomor HP</span><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nomor HP" autoComplete="tel" required className="w-full bg-transparent text-sm outline-none" /></label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <fieldset className="rounded-xl border border-slate-300 px-3 py-2">
                    <legend className="px-1 text-xs font-semibold text-slate-700">Pasien</legend>
                    {[['baru', 'Baru'], ['lama', 'Pernah berobat di sini']].map(([v, l]) => (
                      <label key={v} className="mr-4 inline-flex items-center gap-1.5 text-sm text-slate-800"><input type="radio" name="jenis" checked={form.jenis === v} onChange={() => setForm({ ...form, jenis: v })} className="accent-blue-700" /> {l}</label>
                    ))}
                  </fieldset>
                  <fieldset className="rounded-xl border border-slate-300 px-3 py-2">
                    <legend className="px-1 text-xs font-semibold text-slate-700">Pembayaran</legend>
                    {[['umum', 'Umum'], ['asuransi', 'Asuransi swasta']].map(([v, l]) => (
                      <label key={v} className="mr-4 inline-flex items-center gap-1.5 text-sm text-slate-800"><input type="radio" name="bayar" checked={form.bayar === v} onChange={() => setForm({ ...form, bayar: v })} className="accent-blue-700" /> {l}</label>
                    ))}
                  </fieldset>
                </div>
                <label className={field.replace('items-center', 'items-start')}><ClipboardList size={16} className="mt-0.5 text-slate-500" aria-hidden="true" /><span className="sr-only">Keluhan</span><textarea value={form.complaint} onChange={(e) => setForm({ ...form, complaint: e.target.value })} placeholder="Keluhan singkat (opsional)" rows={2} className="w-full resize-none bg-transparent text-sm outline-none" /></label>
              </div>
              <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800">Simpan janji temu <ChevronRight size={16} aria-hidden="true" /></button>
              <p className="mt-2 text-center text-xs text-slate-600">Purwarupa: janji disimpan di peramban ini dan tidak dikirim ke klinik. Jangan tulis data medis sungguhan.</p>
            </div>
          </form>
        )}
      </main>

      {done && (
          <div className="anim-pudar fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-5" onClick={() => setDone(null)}>
            <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="judul-selesai" onClick={(e) => e.stopPropagation()} className="anim-skala w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-xl outline-none">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white"><Check size={28} /></div>
              <h2 id="judul-selesai" className="mt-4 text-2xl font-bold text-slate-900">Janji temu tersimpan</h2>
              <p className="mt-1 text-sm text-slate-700">Kode <span className="font-mono font-semibold text-slate-900">{done.kode}</span> · nomor urut {done.urut}</p>
              <dl className="mt-5 space-y-1.5 rounded-xl bg-slate-50 p-4 text-left text-sm text-slate-700">
                <div className="flex justify-between gap-4"><dt>Dokter</dt><dd className="text-right font-semibold text-slate-900">{done.doctorName}</dd></div>
                <div className="flex justify-between gap-4"><dt>Tanggal</dt><dd className="font-semibold text-slate-900">{fmtTanggal(done.date)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Jam</dt><dd className="font-semibold text-slate-900">{done.time} WIB</dd></div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-slate-600">Datang {klinik.datangLebihAwal} menit lebih awal untuk pendaftaran. Ini purwarupa — tidak ada yang dikirim ke klinik.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href="/janji" className="rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800">Janji saya</Link>
                <button type="button" onClick={() => setDone(null)} className="rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">Tutup</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
