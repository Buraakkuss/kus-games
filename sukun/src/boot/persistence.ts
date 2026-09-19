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

const onboardingCodec = {
  parse: (raw: unknown) => raw === true,
  fallback: false,
};

export interface BootState {
  onboardingDone: boolean;
}

/** Açılışta tüm kalıcı durumu yükler ve yazıcıları bağlar. */
export async function hydrateAll(): Promise<BootState> {
  const [ayar, konum, onboarding, favoriler, duzen] = await Promise.all([
    kv.read(KEYS.settings, settingsCodec),
    kv.read(KEYS.locations, locationsCodec),
    kv.read(KEYS.onboardingDone, onboardingCodec),
    kv.read(KEYS.favorites, favoritesCodec),
    kv.read(KEYS.homeLayout, layoutCodec),
  ]);

  useSettingsStore.getState().hydrate(ayar);
  useLocationStore.getState().hydrate(konum.locations as SavedLocation[], konum.activeId);
  useFavoriteStore.getState().hydrate(favoriler);
  useHomeLayoutStore.getState().hydrate(duzen);

  // Hidrasyondan **sonra** bağlanır: yoksa ilk hidrasyon kendini geri yazar.
  useSettingsStore.subscribe((s) => { void kv.write(KEYS.settings, s.settings); });
  useLocationStore.subscribe((s) => {
    void kv.write(KEYS.locations, { locations: s.locations, activeId: s.activeId });
  });
  useFavoriteStore.subscribe((s) => { void kv.write(KEYS.favorites, s.items); });
  useHomeLayoutStore.subscribe((s) => { void kv.write(KEYS.homeLayout, s.cards); });

  return { onboardingDone: onboarding };
}

export async function markOnboardingDone(): Promise<void> {
  await kv.write(KEYS.onboardingDone, true);
}
