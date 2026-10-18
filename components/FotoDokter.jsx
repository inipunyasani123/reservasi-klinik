import Image from 'next/image';

// Potret ilustrasi dokter (sama di semua halaman). alt kosong bila nama dokter sudah tertulis di sebelahnya.
export default function FotoDokter({ dokter, ukuran = 56, alt = '', className = '', priority = false }) {
  return (
    <Image src={dokter.foto} alt={alt} width={ukuran} height={ukuran} priority={priority}
      className={`shrink-0 rounded-full bg-slate-200 object-cover ${className}`} />
  );
}
