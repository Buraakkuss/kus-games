/**
 * Durum kalıcılığı — şartname §5.
 * Depodan okuma (hidrasyon) ve değişiklikte yazma. Depo erişimi yalnız
 * burada; mağaza dosyaları (`src/store/`) depolama teknolojisini bilmez.
 */
import { z } from 'zod';
import { KEYS } from '@/lib/storage';
import { useSettingsStore } from '@/store/settings';
import { useLocationStore } from '@/store/locations';
import { useFavoriteStore, type Favorite } from '@/store/favorites';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { useReadingStore, type Bookmark, type ReadingPosition } from '@/store/reading';
import { useWorshipStore, type WorshipSnapshot } from '@/store/worship';
import type { SavedLocation } from '@/features/location/types';
import { kv } from './storage';

const savedLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  countryCode: z.string(),
  timezone: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  elevation: z.number().optional(),
  label: z.string(),
  isPrimary: z.boolean(),
  origin: z.enum(['gps', 'manual']),
  savedAt: z.number(),
});

const storedLocationsSchema = z.object({
  locations: z.array(savedLocationSchema).default([]),
  activeId: z.string().nullable().default(null),
});

const locationsCodec = {
  parse: (raw: unknown) => storedLocationsSchema.parse(raw),
  fallback: { locations: [] as SavedLocation[], activeId: null as string | null },
};

const settingsCodec = {
  parse: (raw: unknown) => raw,
  fallback: {} as unknown,
};

const favoritesCodec = {
  parse: (raw: unknown) => z.array(z.object({
    kind: z.enum(['dua', 'name', 'article', 'ayah', 'hadith']),
    recordId: z.string(),
    createdAt: z.number(),
  })).parse(raw) as Favorite[],
  fallback: [] as Favorite[],
};

const layoutCodec = {
  parse: (raw: unknown) => raw,
  fallback: null as unknown,
};

const readingCodec = {
  parse: (raw: unknown) => z.object({
    position: z.object({
      surah: z.number().int().min(1).max(114),
      ayah: z.number().int().min(1),
      updatedAt: z.number(),
    }).nullable().default(null),
    bookmarks: z.array(z.object({
      id: z.string(),
      surah: z.number().int().min(1).max(114),
      ayah: z.number().int().min(1),
      color: z.string(),
      label: z.string().optional(),
      note: z.string().optional(),
      createdAt: z.number(),
    })).default([]),
  }).parse(raw),
  fallback: { position: null as ReadingPosition | null, bookmarks: [] as Bookmark[] },
};

const qadaSlot = z.enum(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr']);

const worshipCodec = {
  parse: (raw: unknown) => z.object({
    sessions: z.array(z.object({
      id: z.string(), title: z.string(),
      count: z.number().int().min(0), target: z.number().int().min(1),
      onDate: z.string(), createdAt: z.number(),
    })).default([]),
    qada: z.record(qadaSlot, z.number().int().min(0)).default({}),
    qadaHistory: z.array(z.object({
      id: z.string(), slot: qadaSlot, delta: z.number().int(), at: z.number(),
    })).default([]),
    days: z.record(z.string(), z.object({
      date: z.string(),
      prayers: z.record(z.string(), z.enum(['alone', 'jamaah', 'qada'])).default({}),
      quranMinutes: z.number().int().min(0).default(0),
      note: z.string().optional(),
    })).default({}),
    fasts: z.record(z.string(), z.object({
      date: z.string(),
      kind: z.enum(['ramadan', 'qada', 'nafile', 'kaffara']),
      completed: z.boolean(),
    })).default({}),
  }).parse(raw),
  fallback: {},
};

const onboardingCodec = {
  parse: (raw: unknown) => raw === true,
  fallback: false,
};

export interface BootState {
  onboardingDone: boolean;
}

/** Açılışta tüm kalıcı durumu yükler ve yazıcıları bağlar. */
export async function hydrateAll(): Promise<BootState> {
  const [ayar, konum, onboarding, favoriler, duzen, okuma, ibadet] = await Promise.all([
    kv.read(KEYS.settings, settingsCodec),
    kv.read(KEYS.locations, locationsCodec),
    kv.read(KEYS.onboardingDone, onboardingCodec),
    kv.read(KEYS.favorites, favoritesCodec),
    kv.read(KEYS.homeLayout, layoutCodec),
    kv.read(KEYS.reading, readingCodec),
    kv.read(KEYS.worship, worshipCodec),
  ]);

  useSettingsStore.getState().hydrate(ayar);
  useLocationStore.getState().hydrate(konum.locations as SavedLocation[], konum.activeId);
  useFavoriteStore.getState().hydrate(favoriler);
  useHomeLayoutStore.getState().hydrate(duzen);
  useReadingStore.getState().hydrate(okuma.position, okuma.bookmarks as Bookmark[]);
  // Zod çıktısı şemayla birebir; tip daraltması için tek noktada dönüştürülür.
  useWorshipStore.getState().hydrate(ibadet as WorshipSnapshot);

  // Hidrasyondan **sonra** bağlanır: yoksa ilk hidrasyon kendini geri yazar.
  useSettingsStore.subscribe((s) => { void kv.write(KEYS.settings, s.settings); });
  useLocationStore.subscribe((s) => {
    void kv.write(KEYS.locations, { locations: s.locations, activeId: s.activeId });
  });
  useFavoriteStore.subscribe((s) => { void kv.write(KEYS.favorites, s.items); });
  useHomeLayoutStore.subscribe((s) => { void kv.write(KEYS.homeLayout, s.cards); });
  useReadingStore.subscribe((s) => {
    void kv.write(KEYS.reading, { position: s.position, bookmarks: s.bookmarks });
  });
  useWorshipStore.subscribe((s) => {
    void kv.write(KEYS.worship, {
      sessions: s.sessions, qada: s.qada, qadaHistory: s.qadaHistory,
      days: s.days, fasts: s.fasts,
    });
  });

  return { onboardingDone: onboarding };
}

export async function markOnboardingDone(): Promise<void> {
  await kv.write(KEYS.onboardingDone, true);
}
