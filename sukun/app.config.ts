/**
 * Expo yapılandırması — şartname §7, §96.
 * Marka bilgisi tek noktadan (`src/config/brand.ts`) okunur; burada
 * kopyalanmaz. Ortam ayrımı `APP_VARIANT` ile yapılır.
 */
import type { ExpoConfig } from 'expo/config';
import Brand from './src/config/brand.json';

type Variant = 'development' | 'staging' | 'production';
const variant = (process.env.APP_VARIANT as Variant) ?? 'development';

const suffix: Record<Variant, string> = {
  development: '.dev',
  staging: '.staging',
  production: '',
};

const nameSuffix: Record<Variant, string> = {
  development: ' (dev)',
  staging: ' (staging)',
  production: '',
};

const config: ExpoConfig = {
  name: Brand.appName + nameSuffix[variant],
  slug: 'sukun',
  version: Brand.version,
  orientation: 'portrait',
  scheme: 'sukun',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: Brand.bundleId.ios + suffix[variant],
    supportsTablet: true,
    infoPlist: {
      // Kıraat arka planda sürsün ve kilit ekranından yönetilebilsin (§32).
      UIBackgroundModes: ['audio'],
      // İzin metinleri App Review'da okunur: ne için istendiği açıkça yazılır.
      NSLocationWhenInUseUsageDescription:
        'Namaz vakitleri ve kıble yönü bulunduğun konuma göre hesaplanır. İzin vermezsen şehri elle seçebilirsin.',
      NSMotionUsageDescription:
        'Kıble pusulası, telefonun yönünü okumak için hareket algılayıcısını kullanır.',
    },
  },
  android: {
    package: Brand.bundleId.android + suffix[variant],
    adaptiveIcon: { backgroundColor: '#04211B' },
    permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
  },
  plugins: [
    'expo-router',
    'expo-localization',
    ['expo-audio', { microphonePermission: false }],
    ['expo-font', { fonts: ['./assets/fonts/Amiri-Regular.ttf', './assets/fonts/AmiriQuran-Regular.ttf'] }],
  ],
  experiments: { typedRoutes: true },
  extra: { variant },
};

export default config;
