/**
 * Marka yapılandırması — şartname §7.
 * Uygulama adı, renk karakteri, iletişim ve kimlik bilgileri YALNIZ buradan
 * yönetilir. Başka bir dosyada marka adı düz metin olarak geçmemelidir.
 */
export const Brand = {
  /** Kod adı ve arayüzde görünen kısa ad. */
  appName: 'Sükûn',
  /** Mağaza adı — arama kelimelerini taşır (§7). */
  storeName: 'Sükûn: Namaz Vakti ve Kur’an',
  tagline: 'Vaktinde, sade, huzurlu.',
  supportEmail: 'kusgrupgames@gmail.com',
  website: 'https://kusgrupgames.github.io/sukun',
  privacyUrl: 'https://kusgrupgames.github.io/sukun/privacy.html',
  termsUrl: 'https://kusgrupgames.github.io/sukun/terms.html',
  bundleId: { ios: 'com.kusgrup.sukun', android: 'com.kusgrup.sukun' },
  /** Semantic versioning (§98). Build numarası ayrı yönetilir. */
  version: '0.1.0',
} as const;

export type BrandConfig = typeof Brand;
