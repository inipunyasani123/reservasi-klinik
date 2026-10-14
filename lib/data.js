// Klinik Rumpun Waras — klinik keluarga fiktif untuk purwarupa janji temu.
import { acak, menit, keJam } from './waktu';

export const klinik = {
  name: 'Klinik Rumpun Waras',
  tagline: 'Klinik keluarga: umum, anak, gigi, dan penyakit dalam',
  url: 'https://reservasi-klinik.pintuweb.id',
  jam: 'Senin–Sabtu, 08.00–18.00',
  durasi: 30, // menit per slot
  datangLebihAwal: 15,
};

export const nav = [
  { href: '/', label: 'Buat janji' },
  { href: '/dokter', label: 'Dokter & jadwal' },
  { href: '/janji', label: 'Janji saya' },
];

export const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// hari: 0 = Minggu … 6 = Sabtu
export const doctors = [
  {
    id: 'd1', name: 'dr. Laksmi Pratiwi', spec: 'Dokter Umum', kategori: 'Umum', initials: 'LP', color: 'bg-blue-700',
    hari: [1, 2, 3, 4, 5, 6], start: '08:00', end: '13:00',
    tentang: 'Pemeriksaan umum, surat keterangan sehat, dan rujukan bila perlu.',
    persiapan: ['Bawa kartu identitas dan kartu asuransi bila ada.', 'Catat keluhan dan sejak kapan muncul.', 'Bawa daftar obat yang sedang diminum.'],
  },
  {
    id: 'd2', name: 'dr. Bagas Wicaksono, Sp.A', spec: 'Spesialis Anak', kategori: 'Anak', initials: 'BW', color: 'bg-emerald-700',
    hari: [1, 3, 5], start: '09:00', end: '13:00',
    tentang: 'Tumbuh kembang, imunisasi, dan keluhan anak usia 0–18 tahun.',
    persiapan: ['Bawa buku KIA atau catatan imunisasi.', 'Catat suhu tubuh anak bila demam.', 'Bawa satu orang dewasa pendamping.'],
  },
  {
    id: 'd3', name: 'drg. Citra Maharani', spec: 'Dokter Gigi', kategori: 'Gigi', initials: 'CM', color: 'bg-rose-700',
    hari: [2, 4, 6], start: '10:00', end: '16:00',
    tentang: 'Pemeriksaan, tambal, pembersihan karang gigi, dan cabut gigi sederhana.',
    persiapan: ['Sikat gigi sebelum datang.', 'Beri tahu bila sedang hamil atau minum obat pengencer darah.', 'Bawa foto rontgen gigi sebelumnya bila ada.'],
  },
  {
    id: 'd4', name: 'dr. Hendra Kusuma, Sp.PD', spec: 'Penyakit Dalam', kategori: 'Penyakit Dalam', initials: 'HK', color: 'bg-violet-700',
    hari: [1, 4], start: '13:00', end: '18:00',
    tentang: 'Diabetes, hipertensi, kolesterol, dan keluhan organ dalam pada orang dewasa.',
    persiapan: ['Bawa hasil laboratorium terakhir.', 'Bawa semua obat yang sedang diminum, termasuk suplemen.', 'Tanyakan dulu bila perlu puasa sebelum cek darah.'],
  },
];
export const getDoctor = (id) => doctors.find((d) => d.id === id);
export const kategori = ['Semua', ...doctors.map((d) => d.kategori)];

export function buildSlots(start, end, durasi = klinik.durasi) {
  const out = [];
  for (let m = menit(start); m < menit(end); m += durasi) out.push(keJam(m));
  return out;
}

// Slot yang sudah diisi pasien lain (contoh) — stabil per dokter & tanggal.
export function terisiContoh(doctor, tanggal) {
  return buildSlots(doctor.start, doctor.end).filter((s) => acak(`${tanggal}|${doctor.id}|${s}`) < 0.35);
}
