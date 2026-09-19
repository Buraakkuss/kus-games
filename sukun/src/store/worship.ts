/**
 * İbadet takibi — şartname §37, §38, §41, §42, §49.
 * Zikir oturumları, kaza sayaçları, ibadet defteri ve oruç kaydı.
 */
import { create } from 'zustand';
import type { DhikrSession } from '@/features/dhikr/stats';

/** Kaza sayaçları beş farz + vitir (§41). */
export const QADA_SLOTS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'] as const;
export type QadaSlot = (typeof QADA_SLOTS)[number];

export type QadaCounters = Record<QadaSlot, number>;

export interface QadaEntry {
  id: string;
  slot: QadaSlot;
  delta: number;
  at: number;
}

/** İbadet defteri günlük kaydı (§42). */
export interface WorshipDay {
  /** 'YYYY-MM-DD' */
  date: string;
  /** Kılınan farzlar. */
  prayers: Partial<Record<Exclude<QadaSlot, 'witr'>, 'alone' | 'jamaah' | 'qada'>>;
  quranMinutes: number;
  note?: string;
}

export type FastKind = 'ramadan' | 'qada' | 'nafile' | 'kaffara';

export interface FastDay {
  date: string;
  kind: FastKind;
  completed: boolean;
}

const bosSayac = (): QadaCounters => ({ fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 });

/** Depoya yazılan/okunan durum kesiti — kalıcılık katmanı bunu kullanır. */
export interface WorshipSnapshot {
  sessions?: DhikrSession[];
  qada?: Partial<QadaCounters>;
  qadaHistory?: QadaEntry[];
  days?: Record<string, WorshipDay>;
  fasts?: Record<string, FastDay>;
}

interface WorshipState {
  sessions: DhikrSession[];
  qada: QadaCounters;
  qadaHistory: QadaEntry[];
  days: Record<string, WorshipDay>;
  fasts: Record<string, FastDay>;
  hydrated: boolean;

  hydrate: (data: WorshipSnapshot) => void;

  addSession: (session: Omit<DhikrSession, 'id' | 'createdAt'>) => DhikrSession;
  removeSession: (id: string) => void;

  /** Kaza sayacını değiştirir. Sayaç asla eksiye düşmez. */
  adjustQada: (slot: QadaSlot, delta: number) => number;
  setQada: (slot: QadaSlot, value: number) => void;
  /** Toplu giriş: N ay/gün karşılığı ekleme (§41). */
  bulkQada: (days: number) => void;
  undoLastQada: () => void;

  setPrayer: (date: string, slot: Exclude<QadaSlot, 'witr'>, value: 'alone' | 'jamaah' | 'qada' | null) => void;
  setQuranMinutes: (date: string, minutes: number) => void;
  setDayNote: (date: string, note: string) => void;

  setFast: (date: string, kind: FastKind, completed: boolean) => void;
  clearFast: (date: string) => void;
}

export const useWorshipStore = create<WorshipState>((set, get) => ({
  sessions: [],
  qada: bosSayac(),
  qadaHistory: [],
  days: {},
  fasts: {},
  hydrated: false,

  hydrate: (data) => set({
    sessions: data.sessions ?? [],
    qada: { ...bosSayac(), ...(data.qada ?? {}) },
    qadaHistory: data.qadaHistory ?? [],
    days: data.days ?? {},
    fasts: data.fasts ?? {},
    hydrated: true,
  }),

  addSession: (session) => {
    const kayit: DhikrSession = {
      ...session,
      count: Math.max(0, Math.round(session.count)),
      id: `${session.onDate}-${Date.now()}`,
      createdAt: Date.now(),
    };
    set({ sessions: [kayit, ...get().sessions] });
    return kayit;
  },

  removeSession: (id) => set({ sessions: get().sessions.filter((s) => s.id !== id) }),

  adjustQada: (slot, delta) => {
    const mevcut = get().qada[slot];
    const yeni = Math.max(0, mevcut + Math.round(delta));
    const gercekDelta = yeni - mevcut;
    if (gercekDelta === 0) return mevcut;
    set({
      qada: { ...get().qada, [slot]: yeni },
      qadaHistory: [{ id: `${slot}-${Date.now()}`, slot, delta: gercekDelta, at: Date.now() }, ...get().qadaHistory].slice(0, 200),
    });
    return yeni;
  },

  setQada: (slot, value) => set({
    qada: { ...get().qada, [slot]: Math.max(0, Math.round(value)) },
  }),

  bulkQada: (days) => {
    const n = Math.max(0, Math.round(days));
    if (n === 0) return;
    const sayac = { ...get().qada };
    for (const slot of QADA_SLOTS) sayac[slot] = Math.max(0, sayac[slot] + n);
    set({
      qada: sayac,
      qadaHistory: [
        ...QADA_SLOTS.map((slot) => ({ id: `${slot}-bulk-${Date.now()}`, slot, delta: n, at: Date.now() })),
        ...get().qadaHistory,
      ].slice(0, 200),
    });
  },

  undoLastQada: () => {
    const [son, ...kalan] = get().qadaHistory;
    if (!son) return;
    set({
      qada: { ...get().qada, [son.slot]: Math.max(0, get().qada[son.slot] - son.delta) },
      qadaHistory: kalan,
    });
  },

  setPrayer: (date, slot, value) => {
    const gun = get().days[date] ?? { date, prayers: {}, quranMinutes: 0 };
    const prayers = { ...gun.prayers };
    if (value === null) delete prayers[slot];
    else prayers[slot] = value;
    set({ days: { ...get().days, [date]: { ...gun, prayers } } });
  },

  setQuranMinutes: (date, minutes) => {
    const gun = get().days[date] ?? { date, prayers: {}, quranMinutes: 0 };
    set({ days: { ...get().days, [date]: { ...gun, quranMinutes: Math.max(0, Math.round(minutes)) } } });
  },

  setDayNote: (date, note) => {
    const gun = get().days[date] ?? { date, prayers: {}, quranMinutes: 0 };
    set({ days: { ...get().days, [date]: { ...gun, note } } });
  },

  setFast: (date, kind, completed) => set({
    fasts: { ...get().fasts, [date]: { date, kind, completed } },
  }),

  clearFast: (date) => {
    const kopya = { ...get().fasts };
    delete kopya[date];
    set({ fasts: kopya });
  },
}));
