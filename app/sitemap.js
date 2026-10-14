const URL = 'https://reservasi-klinik.pintuweb.id';

export default function sitemap() {
  const now = new Date();
  return ['', '/dokter'].map((p) => ({ url: URL + p, lastModified: now, changeFrequency: 'monthly', priority: p ? 0.7 : 1 }));
}
