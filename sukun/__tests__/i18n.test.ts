import { tr, CORE_KEYS, translate, translateVerbose, resolveLanguage, LANGUAGES, LANGUAGE_NAMES, type Language } from '@/lib/i18n';
import { en } from '@/lib/i18n/strings/en';
import { ar } from '@/lib/i18n/strings/ar';
import { de } from '@/lib/i18n/strings/de';
import { fr } from '@/lib/i18n/strings/fr';

const TABLES: Record<Exclude<Language, 'tr'>, Partial<Record<string, string>>> = { en, ar, de, fr };

describe('yerelleştirme', () => {
  it('her dil temel anahtarların tamamını çevirir', () => {
    for (const [lang, table] of Object.entries(TABLES)) {
      const eksik = CORE_KEYS.filter((k) => table[k] === undefined);
      expect({ lang, eksik }).toEqual({ lang, eksik: [] });
    }
  });

  it('hiçbir dil Türkçede olmayan anahtar tanımlamaz', () => {
    for (const [lang, table] of Object.entries(TABLES)) {
      const fazla = Object.keys(table).filter((k) => !(k in tr));
      expect({ lang, fazla }).toEqual({ lang, fazla: [] });
    }
  });

  it('hiçbir çeviri boş bırakılmaz', () => {
    for (const [lang, table] of Object.entries(TABLES)) {
      for (const [key, value] of Object.entries(table)) {
        expect({ lang, key, bos: value?.trim() === '' }).toEqual({ lang, key, bos: false });
      }
    }
  });

  it('yer tutucu kümesi diller arasında aynıdır', () => {
    const tutucular = (s: string) => (s.match(/\{[a-zA-Z0-9_]+\}/g) ?? []).sort();
    for (const [lang, table] of Object.entries(TABLES)) {
      for (const [key, value] of Object.entries(table)) {
        const kaynak = tr[key as keyof typeof tr];
        expect({ lang, key, p: tutucular(value as string) })
          .toEqual({ lang, key, p: tutucular(kaynak) });
      }
    }
  });

  it('eksik çeviri Türkçeye düşer, anahtar adı gösterilmez', () => {
    const r = translateVerbose('de', 'quran.contentPending');
    expect(r.fellBack).toBe(true);
    expect(r.text).toBe(tr['quran.contentPending']);
    expect(r.text).not.toContain('quran.');
  });

  it('yer tutucular doldurulur', () => {
    expect(translate('tr', 'prayer.remainingTo', { name: 'İkindi', time: '01:12' }))
      .toBe('İkindi vaktine 01:12');
    expect(translate('en', 'prayer.remainingTo', { name: 'Asr', time: '01:12' }))
      .toBe('01:12 until Asr');
  });

  it('karşılığı verilmeyen yer tutucu metne sızmaz ve bildirilir', () => {
    const r = translateVerbose('tr', 'prayer.remainingTo', { name: 'Yatsı' });
    expect(r.missingParams).toEqual(['time']);
    expect(r.text).not.toContain('{');
  });

  it('cihaz dil etiketi çözümlenir, tanınmayan etiket Türkçeye döner', () => {
    expect(resolveLanguage('tr-TR')).toBe('tr');
    expect(resolveLanguage('de_DE')).toBe('de');
    expect(resolveLanguage('ar')).toBe('ar');
    expect(resolveLanguage('ja-JP')).toBe('tr');
    expect(resolveLanguage(null)).toBe('tr');
    expect(resolveLanguage(undefined)).toBe('tr');
    expect(resolveLanguage('')).toBe('tr');
  });

  it('her dilin kendi adı vardır', () => {
    for (const l of LANGUAGES) expect(LANGUAGE_NAMES[l].length).toBeGreaterThan(1);
  });

  it('her dilde çeviri gerçekten farklıdır — kopyala yapıştır denetimi', () => {
    for (const [lang, table] of Object.entries(TABLES)) {
      const ayni = Object.entries(table).filter(([k, v]) => v === tr[k as keyof typeof tr]);
      // 'OK', 'Pro', 'Juz', 'Qibla' gibi ortak sözcükler beklenir; ama çevirinin
      // yarısı Türkçe ile birebir aynıysa çeviri yapılmamış demektir.
      expect({ lang, oran: ayni.length / Object.keys(table).length < 0.25 })
        .toEqual({ lang, oran: true });
    }
  });
});
