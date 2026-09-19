/**
 * Pusula — şartname §36, §81.
 *
 * Pil kuralı: manyetometre **yalnız kıble ekranı öndeyken** açılır. Bu kanca
 * sökülünce dinleyici kapanır; ekran arka plana geçince de kapanır. Pusulayı
 * açık unutmak, bu kategoride en sık görülen pil şikâyetinin sebebidir.
 */
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import { classifyAccuracy, type CompassAccuracy } from './calc';

export interface CompassState {
  /** Gerçek kuzeye göre yön (0–360). Okuma yoksa null. */
  heading: number | null;
  accuracy: CompassAccuracy;
  /** Manyetik girişim şüphesi: okuma çok oynak. */
  interference: boolean;
  available: boolean;
}

const BASLANGIC: CompassState = {
  heading: null, accuracy: 'unreliable', interference: false, available: true,
};

export function useCompass(enabled: boolean): CompassState {
  const [state, setState] = useState<CompassState>(BASLANGIC);
  const sonOkumalar = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled) { setState(BASLANGIC); return; }

    let abone: Location.LocationSubscription | null = null;
    let canli = true;

    const ac = async () => {
      try {
        abone = await Location.watchHeadingAsync((h) => {
          if (!canli) return;
          // `trueHeading` yalnız konum izni varken gelir; yoksa manyetik kuzey.
          const yon = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;

          // Girişim sezgisi: son okumaların yayılımı çok genişse pusula
          // güvenilmezdir. Eşik, elde tutulan telefonun doğal salınımının
          // üstünde seçildi.
          const gecmis = sonOkumalar.current;
          gecmis.push(yon);
          if (gecmis.length > 8) gecmis.shift();
          const yayilim = gecmis.length >= 4
            ? Math.max(...gecmis) - Math.min(...gecmis)
            : 0;

          setState({
            heading: yon,
            accuracy: classifyAccuracy(h.accuracy >= 0 ? h.accuracy * 15 : null),
            interference: yayilim > 45,
            available: true,
          });
        });
      } catch {
        // Manyetometresi olmayan cihaz ya da izin yok.
        if (canli) setState({ ...BASLANGIC, available: false });
      }
    };

    const kapat = () => { abone?.remove(); abone = null; };

    void ac();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') void ac(); else kapat();
    });

    return () => { canli = false; kapat(); sub.remove(); };
  }, [enabled]);

  return state;
}
