// Potret ilustrasi empat dokter fiktif Klinik Rumpun Waras (buatan sendiri, SVG -> WebP 600x600).
// Satu gaya untuk semua: bidang datar berbayang lembut, latar warna dokter + daun rumpun, grain halus.
// Tokohnya rekaan; bukan wajah orang sungguhan.
//
// Pemakaian (dari akar proyek):
//   node scripts/ilustrasi/potret.mjs <folder>            -> tulis <folder>/<id>.svg
//   node scripts/ilustrasi/potret.mjs <folder> --render   -> render lewat Chrome headless ke public/images/dokter/<id>.webp
// Lalu: node scripts/static-images.mjs . --dirs public/images
import { writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { createRequire } from 'node:module'

const cermin = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${Math.round((600 - +x) * 10) / 10} ${y}`)
const dua = (d, attr) => `<path d="${d}" ${attr}/><path d="${cermin(d)}" ${attr}/>`

// ---- wajah ----
function wajah(o) {
  const j = o.rahang // setengah lebar rahang
  const muka = `M220 238C220 176 254 148 300 148C346 148 380 176 380 238C380 286 ${364 - (52 - j)} 318 ${338 - (52 - j) * 0.6} 341C324 352 312 357 300 357C288 357 276 352 ${262 + (52 - j) * 0.6} 341C${236 + (52 - j)} 318 220 286 220 238Z`
  const mata = (cx) => `
    <clipPath id="m${cx}"><path d="M${cx - 16} 262Q${cx} 251 ${cx + 16} 262Q${cx} 269 ${cx - 16} 262Z"/></clipPath>
    <path d="M${cx - 16} 262Q${cx} 251 ${cx + 16} 262Q${cx} 269 ${cx - 16} 262Z" fill="#f7efe6"/>
    <g clip-path="url(#m${cx})"><circle cx="${cx}" cy="261.5" r="7.4" fill="${o.iris || '#3a2214'}"/><circle cx="${cx}" cy="261.5" r="3.4" fill="#120a05"/><circle cx="${cx + 2.4}" cy="259" r="2" fill="#fff"/></g>
    <path d="M${cx - 14} 254.5Q${cx} 246 ${cx + 14} 253.5" fill="none" stroke="${o.kulitGelap}" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>`
  return `
  <path d="M270 318V404Q300 424 330 404V318Z" fill="${o.kulitGelap}"/>
  <path d="M270 340Q300 380 330 340V360Q300 392 270 360Z" fill="#000" opacity=".12"/>
  ${o.telinga !== false ? `<ellipse cx="222" cy="258" rx="13" ry="22" fill="${o.kulitGelap}"/><ellipse cx="378" cy="258" rx="13" ry="22" fill="${o.kulitGelap}"/>` : ''}
  <path d="${muka}" fill="${o.kulit}"/>
  <path d="M352 170C374 188 382 214 380 240C380 286 ${364 - (52 - j)} 318 ${338 - (52 - j) * 0.6} 341C350 312 360 276 358 236C357 206 354 186 352 170Z" fill="${o.kulitGelap}" opacity=".45"/>
  ${mata(266)}${mata(334)}
  <g fill="none" stroke="#23150c" stroke-linecap="round">
    <path d="M249 262Q266 249 283 260" stroke-width="3.6"/><path d="M351 262Q334 249 317 260" stroke-width="3.6"/>
    ${o.bulumata ? '<path d="M247 262L241 257M353 262L359 257" stroke-width="2.4"/>' : ''}
  </g>
  <g fill="none" stroke="${o.kulitGelap}" stroke-linecap="round" opacity=".7"><path d="M252 267Q266 273 280 266"/><path d="M348 267Q334 273 320 266"/></g>
  <g fill="none" stroke="${o.alis}" stroke-linecap="round" stroke-width="${o.alisTebal || 5.5}">
    <path d="M245 241Q263 228 286 234"/><path d="M355 241Q337 228 314 234"/>
  </g>
  <g fill="none" stroke="${o.kulitGelap}" stroke-linecap="round">
    <path d="M288 302Q294 308 300 306Q306 308 312 302" stroke-width="2.6"/>
  </g>
  <path d="M305 252C309 270 316 287 314 297C311 303 305 305 300 305C306 299 308 289 306 275Z" fill="${o.kulitGelap}" opacity=".4"/>
  <ellipse cx="249" cy="294" rx="17" ry="9" fill="#e8846b" opacity="${o.rona ?? 0.22}"/><ellipse cx="351" cy="294" rx="17" ry="9" fill="#e8846b" opacity="${o.rona ?? 0.22}"/>
  <path d="M276 324Q288 317 296 320Q300 322 304 320Q312 317 324 324Q300 331 276 324Z" fill="${o.bibir}"/>
  <path d="M279 325Q300 345 321 325Q300 334 279 325Z" fill="${o.bibirBawah}"/>
  <path d="M274 323Q300 336 326 323" fill="none" stroke="${o.garisBibir}" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M292 337Q300 340 308 337" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>
  ${o.usia ? `<g fill="none" stroke="${o.kulitGelap}" stroke-linecap="round" opacity=".55" stroke-width="2"><path d="M278 300Q270 314 276 328"/><path d="M322 300Q330 314 324 328"/><path d="M268 206Q300 198 332 206"/></g>` : ''}`
}

// ---- busana ----
function jas(o) {
  const v = o.kerahDalam
  return `
  <path d="M70 600C78 520 122 478 196 458L258 426L300 498L342 426L404 458C478 478 522 520 530 600Z" fill="#f8fafc"/>
  <path d="M70 600C78 520 122 478 196 458L214 450C170 486 150 540 152 600Z" fill="#e2e8f0"/>
  <path d="M530 600C522 520 478 478 404 458L386 450C430 486 450 540 448 600Z" fill="#e2e8f0"/>
  <path d="M258 426Q300 446 342 426L300 498Z" fill="${v}"/>
  ${o.batik ? `<g clip-path="url(#vBaju)">${o.batik}</g>` : ''}
  ${o.kerahKemeja ? dua('M258 426L272 452L292 440L276 424Z', `fill="${o.kerahKemeja}"`) : ''}
  ${dua('M258 426L230 476L278 522L300 498Z', 'fill="#eef2f7" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"')}
  <path d="M300 498V600" stroke="#cbd5e1" stroke-width="2"/>
  <path d="M370 528H422" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
  ${o.pin || ''}`
}
function stetoskop(warna) {
  return `<g fill="none" stroke-linecap="round">
    <path d="M262 430C242 470 236 512 250 548" stroke="${warna}" stroke-width="9"/>
    <path d="M338 430C358 468 362 500 352 524" stroke="${warna}" stroke-width="9"/>
    <path d="M250 548L246 566M250 548L260 564" stroke="#94a3b8" stroke-width="4"/>
  </g>
  <circle cx="352" cy="544" r="17" fill="url(#perak)"/><circle cx="352" cy="544" r="10" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>`
}

// ---- latar ----
function latar(c) {
  const daun = (x, y, a, s) => `<path transform="translate(${x} ${y}) rotate(${a}) scale(${s})" d="M0 0C30 -14 90 -14 130 0C90 14 30 14 0 0Z" fill="#fff"/>`
  return `
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient>
    <radialGradient id="perak" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#f8fafc"/><stop offset="1" stop-color="#64748b"/></radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5" stitchTiles="stitch"/><feColorMatrix values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 0 1"/></filter>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <g opacity=".13">${daun(30, 120, -50, 1)}${daun(46, 210, -30, 0.8)}${daun(470, 60, 40, 0.9)}${daun(520, 170, 20, 1.1)}${daun(-10, 330, -15, 0.9)}${daun(500, 300, 10, 0.7)}</g>
  <circle cx="300" cy="250" r="190" fill="#fff" opacity=".08"/>`
}

const DOKTER = {
  // dr. Laksmi Pratiwi — dokter umum, berhijab
  d1: {
    latar: ['#4f7fe6', '#1d4ed8'],
    susun: (w) => `<g transform="translate(-30 -44) scale(1.1 1)">${jas({ kerahDalam: '#dbe7f5' })}</g>
      <path d="M228 256C228 204 258 176 300 176C342 176 372 204 372 256C372 306 344 352 300 368C256 352 228 306 228 256Z" fill="#d8c6ab"/>
      ${w.replace(/<path d="M270 318V404[^>]*>/, '').replace(/<path d="M270 340Q300 380[^>]*>/, '')}
      <path fill-rule="evenodd" d="M300 112C234 112 198 158 194 226C190 298 206 352 234 394C204 414 176 444 166 492C204 540 396 540 434 492C424 444 396 414 366 394C394 352 410 298 406 226C402 158 366 112 300 112ZM230 256C230 206 260 180 300 180C340 180 370 206 370 256C370 304 342 348 300 362C258 348 230 304 230 256Z" fill="#ebdfcc"/>
      <path d="M232 250C234 204 262 182 300 182C338 182 366 204 368 250" fill="none" stroke="#d4c2a6" stroke-width="7" stroke-linecap="round"/>
            <path d="M234 394C262 416 338 416 366 394" fill="none" stroke="#d6c4a8" stroke-width="5" stroke-linecap="round"/>
      <path d="M210 300C214 340 224 372 236 392M390 300C386 340 376 372 364 392" fill="none" stroke="#dccab0" stroke-width="5" stroke-linecap="round"/>
      <path d="M196 470C240 500 360 500 404 470" fill="none" stroke="#dccab0" stroke-width="4" stroke-linecap="round"/>
      <g transform="translate(-30 -22) scale(1.1 1)">${stetoskop('#1e3a8a')}</g>`,
    wajah: { kulit: '#e8b991', kulitGelap: '#cf9a70', alis: '#2a1a10', alisTebal: 4.6, bibir: '#b4584a', bibirBawah: '#c8705f', garisBibir: '#8f3f33', bulumata: true, rahang: 48, telinga: false },
  },
  // dr. Bagas Wicaksono, Sp.A — dokter anak
  d2: {
    latar: ['#2fb489', '#047857'],
    belakang: '',
    gambar: (o) => `${jas({ kerahDalam: '#bfdbfe', kerahKemeja: '#93c5fd', pin: '<g transform="translate(232 496) rotate(-8)"><path d="M0 -13L3.8 -4.2L13 -4L5.8 1.8L8 11L0 5.8L-8 11L-5.8 1.8L-13 -4L-3.8 -4.2Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/></g>' })}${stetoskop('#f97316')}`,
    wajah: { kulit: '#bf8456', kulitGelap: '#a06a40', alis: '#140c07', alisTebal: 7, bibir: '#8f4a37', bibirBawah: '#9c5642', garisBibir: '#6b3324', rahang: 56, rona: 0.12 },
    rambut: `
      <path d="M214 262C204 176 246 120 302 120C362 120 402 170 386 262L378 262C380 228 372 204 358 190C330 198 290 200 262 190C244 200 232 214 226 262Z" fill="#17110d"/>
      <path d="M262 190C276 160 300 140 340 138" fill="none" stroke="#2e231c" stroke-width="3"/>
      <path d="M240 150C262 128 300 122 330 126" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="6" stroke-linecap="round"/>`,
  },
  // drg. Citra Maharani — dokter gigi
  d3: {
    latar: ['#e8577a', '#be123c'],
    belakang: '<circle cx="300" cy="128" r="40" fill="#1b120e"/><circle cx="300" cy="128" r="40" fill="none" stroke="#2f221b" stroke-width="3"/>',
    gambar: () => `
      <path d="M80 600C88 522 130 480 204 460L262 428Q300 478 338 428L396 460C470 480 512 522 520 600Z" fill="#0f766e"/>
      <path d="M80 600C88 522 130 480 204 460L220 454C178 490 160 540 162 600Z" fill="#0b5f58"/>
      <path d="M520 600C512 522 470 480 396 460L380 454C422 490 440 540 438 600Z" fill="#0b5f58"/>
      <path d="M262 428Q300 478 338 428" fill="none" stroke="#0b5f58" stroke-width="7"/>
      <path d="M366 520H418V566H366Z" fill="#0d6b64"/><path d="M366 520H418" stroke="#0a524c" stroke-width="3"/>
      <path d="M380 490V532" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/><circle cx="380" cy="486" r="7" fill="url(#perak)"/>
      <path d="M398 498V532" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <rect x="196" y="514" width="62" height="20" rx="4" fill="#ecfeff"/><rect x="204" y="521" width="30" height="5" rx="2" fill="#0f766e" opacity=".6"/>`,
    wajah: { kulit: '#d49c74', kulitGelap: '#b77f57', alis: '#1b120e', alisTebal: 4.8, bibir: '#a64f45', bibirBawah: '#b9614f', garisBibir: '#7f3a30', bulumata: true, rahang: 48 },
    rambut: `
      <path d="M216 262C206 176 248 122 300 122C352 122 394 176 384 262L376 260C376 220 366 196 350 182C334 172 312 166 300 160C288 166 266 172 250 182C234 196 224 220 224 260Z" fill="#1b120e"/>
      <path d="M300 124V160" stroke="#3a2a22" stroke-width="2.5"/>
      <path d="M256 140C276 128 300 126 324 132" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="6" stroke-linecap="round"/>`,
  },
  // dr. Hendra Kusuma, Sp.PD — penyakit dalam, berkacamata, rambut mulai beruban
  d4: {
    latar: ['#9b6cf0', '#6d28d9'],
    belakang: '',
    gambar: () => `${jas({ kerahDalam: '#7c4a22', kerahKemeja: '#5c3317', batik: Array.from({ length: 5 }, (_, i) => Array.from({ length: 4 }, (_, k) => `<g transform="translate(${264 + i * 18} ${432 + k * 18})" fill="#e7c38a" opacity=".85"><ellipse cx="0" cy="-4" rx="2.6" ry="4"/><ellipse cx="0" cy="4" rx="2.6" ry="4"/><ellipse cx="-4" cy="0" rx="4" ry="2.6"/><ellipse cx="4" cy="0" rx="4" ry="2.6"/></g>`).join('')).join('') })}${stetoskop('#111827')}`,
    wajah: { kulit: '#e9c29b', kulitGelap: '#cfa078', alis: '#2b2724', alisTebal: 6.5, bibir: '#b06a58', bibirBawah: '#bd7a66', garisBibir: '#87493a', rahang: 58, rona: 0.14, usia: true, iris: '#2f2118' },
    rambut: `
      <path d="M214 262C204 180 242 126 300 126C360 126 400 176 386 262L378 262C380 228 372 206 360 194C342 184 324 182 312 188C300 178 280 178 262 186C244 196 232 214 226 262Z" fill="#2b2826"/>
      <path d="M215 262C212 242 213 226 217 214L226 218C224 232 224 246 226 262Z" fill="#b8b2ab"/><path d="M385 262C388 242 387 226 383 214L374 218C376 232 376 246 378 262Z" fill="#b8b2ab"/>
      <g stroke="#a8a29e" stroke-width="2.4" stroke-linecap="round" opacity=".75"><path d="M232 200L238 188"/><path d="M246 176L254 166"/><path d="M362 196L356 184"/><path d="M348 172L340 162"/><path d="M226 228L229 214"/><path d="M374 226L371 212"/></g>
      <path d="M248 150C268 136 300 132 330 138" fill="none" stroke="#d6d3d1" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>`,
    kacamata: `<g fill="none" stroke="#1f2937" stroke-width="3.6"><rect x="242" y="244" width="50" height="34" rx="10"/><rect x="308" y="244" width="50" height="34" rx="10"/><path d="M292 258Q300 252 308 258"/><path d="M242 254L224 250M358 254L376 250"/></g><g fill="#fff" opacity=".18"><path d="M248 250H262L252 272H246Z"/><path d="M314 250H328L318 272H312Z"/></g>`,
  },
}

function potret(id) {
  const d = DOKTER[id], w = wajah(d.wajah)
  // urutan lapis: latar, rambut belakang, wajah, busana, rambut depan, kacamata (hijab: jas, wajah, hijab, stetoskop)
  const isi = d.susun ? d.susun(w) : `${d.belakang || ''}${w}<g transform="translate(-30 -46) scale(1.1 1)">${d.gambar()}</g>${d.rambut || ''}${d.kacamata || ''}`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="105 92 390 390">
  ${latar(d.latar)}
  <defs><clipPath id="vBaju"><path d="M258 426Q300 446 342 426L300 498Z"/></clipPath></defs>
  ${isi}
  <rect x="105" y="92" width="390" height="390" filter="url(#grain)" opacity=".14" style="mix-blend-mode:overlay"/>
</svg>`
}

const akar = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const keluar = path.resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : path.join(akar, '.potret-svg'))
mkdirSync(keluar, { recursive: true })
for (const id of Object.keys(DOKTER)) writeFileSync(path.join(keluar, `${id}.svg`), potret(id))
console.log(`${Object.keys(DOKTER).length} potret -> ${keluar}`)

if (process.argv.includes('--render')) {
  const sharp = createRequire(path.join(akar, 'package.json'))('sharp')
  const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  const tujuan = path.join(akar, 'public/images/dokter')
  mkdirSync(tujuan, { recursive: true })
  for (const id of Object.keys(DOKTER)) {
    const html = path.join(keluar, `${id}.html`), png = path.join(keluar, `${id}.png`)
    writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}svg{display:block}</style></head><body>${potret(id)}</body></html>`)
    execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=600,600', '--virtual-time-budget=5000', `--screenshot=${png}`, 'file://' + html], { stdio: 'ignore' })
    await sharp(png).resize(600, 600).webp({ quality: 84, effort: 6 }).toFile(path.join(tujuan, `${id}.webp`))
    console.log('->', path.join(tujuan, `${id}.webp`))
  }
}
