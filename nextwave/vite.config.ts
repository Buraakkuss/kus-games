import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync(new URL('./app.config.json', import.meta.url), 'utf8'));

export default {
  // Capacitor www/ klasorunu web kaynagi olarak bekler; cikti oraya yazilir.
  base: './',
  build: { outDir: 'www', emptyOutDir: true, target: 'es2020' },
  // Surum TEK kaynaktan gelir: app.config.json. Menude gosterilen numara budur.
  define: { __GAME_VERSION__: JSON.stringify(cfg.version) }
};
