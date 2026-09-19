/**
 * Kur'an veri erişimi — şartname §27, §35.
 *
 * Metin paket içinde gelir (`assets/quran/quran.json`) ve **çevrimdışı**
 * çalışır. Paket ilk erişimde yüklenir ve bellekte indekslenir; uygulama
 * açılışını yavaşlatmamak için önceden yüklenmez.
 */
import { verifyAyahs, type AyahRecord, type SurahMeta } from './verify';
import { arabicIncludes, normalizeArabic } from './arabic';
import { logger } from '@/lib/log';

const log = logger('quran');

export interface QuranAyah extends AyahRecord {
  page: number;
  juz: number;
  sajda: boolean;
}

export interface QuranSource {
  name: string;
  url: string;
  text: string;
  note: string;
  metadataLicense: string;
}

interface QuranPackage {
  source: QuranSource;
  checksum: string;
  surahs: SurahMeta[];
  ayahs: QuranAyah[];
}

interface QuranIndex {
  source: QuranSource;
  checksum: string;
  surahs: SurahMeta[];
  ayahs: QuranAyah[];
  bySurah: Map<number, QuranAyah[]>;
  byPage: Map<number, QuranAyah[]>;
  byJuz: Map<number, QuranAyah[]>;
  /** Arama için normalize edilmiş metin — bir kez hesaplanır. */
  normalized: string[];
}

let index: QuranIndex | null = null;

/** Paketi yükler ve indeksler. Bozuk paket yüklenmez. */
export function loadQuran(pkg?: QuranPackage): QuranIndex {
  if (index) return index;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const paket: QuranPackage = pkg ?? require('../../../assets/quran/quran.json');

  const dogrulama = verifyAyahs(paket.ayahs, paket.surahs);
  if (!dogrulama.ok) {
    // Bozuk mushaf metni gösterilmez. Bu, uygulamanın düşmesi pahasına da olsa
    // uyulan tek kuraldır (CONTENT_SOURCES kuralı 1).
    log.error('Kur’an paketi doğrulamadan geçmedi', { problems: dogrulama.problems });
    throw new Error('Kur’an paketi doğrulanamadı');
  }

  const bySurah = new Map<number, QuranAyah[]>();
  const byPage = new Map<number, QuranAyah[]>();
  const byJuz = new Map<number, QuranAyah[]>();
  const normalized: string[] = new Array(paket.ayahs.length);

  paket.ayahs.forEach((a, i) => {
    (bySurah.get(a.surah) ?? bySurah.set(a.surah, []).get(a.surah)!).push(a);
    (byPage.get(a.page) ?? byPage.set(a.page, []).get(a.page)!).push(a);
    (byJuz.get(a.juz) ?? byJuz.set(a.juz, []).get(a.juz)!).push(a);
    normalized[i] = normalizeArabic(a.text);
  });

  index = {
    source: paket.source,
    checksum: paket.checksum,
    surahs: paket.surahs,
    ayahs: paket.ayahs,
    bySurah,
    byPage,
    byJuz,
    normalized,
  };
  return index;
}

/** Sınamalarda durumu sıfırlamak için. */
export function resetQuran(): void {
  index = null;
}

export function getSurahs(): readonly SurahMeta[] {
  return loadQuran().surahs;
}

export function getSurah(number: number): SurahMeta | undefined {
  return loadQuran().surahs.find((s) => s.number === number);
}

export function getSurahAyahs(number: number): readonly QuranAyah[] {
  return loadQuran().bySurah.get(number) ?? [];
}

export function getPageAyahs(page: number): readonly QuranAyah[] {
  return loadQuran().byPage.get(page) ?? [];
}

export function getJuzAyahs(juz: number): readonly QuranAyah[] {
  return loadQuran().byJuz.get(juz) ?? [];
}

export function getAyah(surah: number, ayah: number): QuranAyah | undefined {
  return loadQuran().bySurah.get(surah)?.find((a) => a.ayah === ayah);
}

export function getSource(): QuranSource {
  return loadQuran().source;
}

/** Cüz listesi: her cüzün başladığı sure ve âyet. */
export function getJuzStarts(): { juz: number; surah: number; ayah: number }[] {
  const idx = loadQuran();
  const out: { juz: number; surah: number; ayah: number }[] = [];
  for (let j = 1; j <= 30; j++) {
    const ilk = idx.byJuz.get(j)?.[0];
    if (ilk) out.push({ juz: j, surah: ilk.surah, ayah: ilk.ayah });
  }
  return out;
}

export interface SearchHit {
  ayah: QuranAyah;
  surahName: string;
}

/**
 * Arapça metinde arama (§35). Meal araması lisans geldiğinde eklenecek;
 * o zamana kadar arama yalnız mushaf metni üzerindedir ve arayüzde böyle yazar.
 */
export function searchArabic(query: string, limit = 50): SearchHit[] {
  const q = normalizeArabic(query);
  if (q.length < 2) return [];
  const idx = loadQuran();
  const out: SearchHit[] = [];
  for (let i = 0; i < idx.ayahs.length && out.length < limit; i++) {
    if (idx.normalized[i]?.includes(q)) {
      const a = idx.ayahs[i]!;
      out.push({ ayah: a, surahName: idx.surahs[a.surah - 1]?.nameTr ?? '' });
    }
  }
  return out;
}

export { arabicIncludes, normalizeArabic };
