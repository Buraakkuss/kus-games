/**
 * Geometrik motif dili — şartname §9.
 *
 * Kural: motifler **soyut geometridir**. Hiçbir canlı figürü, hiçbir insan
 * yüzü, hiçbir Kâbe/cami fotoğrafı kullanılmaz; İslam sanatının kendi
 * dili olan çokgen örgü (girih), sekizli yıldız (rub'ül hizb), sekizgen
 * petek ve kemer hattı ile sınırlıdır. Hepsi düşük opaklıkta, arka planda
 * kalır; okunabilirliği asla düşürmez.
 *
 * Her desen tek bir "karo" üretir; karo SVG `<Pattern>` ile döşenir.
 * Yollar birim kare (0..size) içinde tanımlıdır, ölçek dışarıdan verilir.
 */

export type MotifName = 'rubElHizb' | 'girih' | 'octagonGrid' | 'arch' | 'starLattice' | 'plain';

export interface MotifTile {
  /** Karo kenarı (SVG kullanıcı birimi). */
  size: number;
  /** Karoyu oluşturan yollar. */
  paths: string[];
  /** İçi dolu mu, yoksa yalnız kontur mu çizilir. */
  fill: boolean;
  strokeWidth: number;
}

/** İki üst üste bindirilmiş kare — rub'ül hizb (sekizli yıldız). */
function rubElHizb(size: number): MotifTile {
  const c = size / 2;
  const r = size * 0.34;
  const square = (rot: number): string => {
    const pts: string[] = [];
    for (let i = 0; i < 4; i++) {
      const a = rot + (Math.PI / 2) * i;
      pts.push(`${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`);
    }
    return `M${pts.join('L')}Z`;
  };
  return { size, paths: [square(0), square(Math.PI / 4)], fill: false, strokeWidth: 1.1 };
}

/** Girih örgüsü — köşegen kesişimler, sürekli desen. */
function girih(size: number): MotifTile {
  const s = size;
  const h = s / 2;
  const q = s / 4;
  return {
    size: s,
    paths: [
      `M0,${h} L${q},${q} L${h},0 L${s - q},${q} L${s},${h} L${s - q},${s - q} L${h},${s} L${q},${s - q} Z`,
      `M${q},${q} L${s - q},${s - q}`,
      `M${s - q},${q} L${q},${s - q}`,
    ],
    fill: false,
    strokeWidth: 1,
  };
}

/** Sekizgen petek — geniş yüzeylerde sakin doku. */
function octagonGrid(size: number): MotifTile {
  const s = size;
  const k = s * 0.2929; // 1 - cos(45°) oranı: düzgün sekizgen köşesi
  return {
    size: s,
    paths: [`M${k},0 L${s - k},0 L${s},${k} L${s},${s - k} L${s - k},${s} L${k},${s} L0,${s - k} L0,${k} Z`],
    fill: false,
    strokeWidth: 1,
  };
}

/** Sivri kemer sırası — mihrap/ revak hattı. */
function arch(size: number): MotifTile {
  const s = size;
  const w = s * 0.5;
  const x0 = s * 0.25;
  const top = s * 0.18;
  return {
    size: s,
    paths: [
      `M${x0},${s} L${x0},${s * 0.55} Q${x0},${top} ${x0 + w / 2},${top} Q${x0 + w},${top} ${x0 + w},${s * 0.55} L${x0 + w},${s}`,
    ],
    fill: false,
    strokeWidth: 1.2,
  };
}

/** Yıldız kafes — sekiz kollu yıldızın kafes hâli, kart başlıklarında. */
function starLattice(size: number): MotifTile {
  const c = size / 2;
  const outer = size * 0.46;
  const inner = size * 0.19;
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`);
  }
  return { size, paths: [`M${pts.join('L')}Z`], fill: false, strokeWidth: 1 };
}

const BUILDERS: Record<Exclude<MotifName, 'plain'>, (size: number) => MotifTile> = {
  rubElHizb,
  girih,
  octagonGrid,
  arch,
  starLattice,
};

/** İstenen deseni verilen karo boyutunda üretir. `plain` boş karo döner. */
export function motifTile(name: MotifName, size = 48): MotifTile {
  if (name === 'plain') return { size, paths: [], fill: false, strokeWidth: 0 };
  const build = BUILDERS[name];
  return build(size);
}

export const MOTIF_NAMES: readonly MotifName[] = ['rubElHizb', 'girih', 'octagonGrid', 'arch', 'starLattice', 'plain'];
