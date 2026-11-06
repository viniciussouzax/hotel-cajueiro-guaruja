import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let sitemap;
try { sitemap = require('@astrojs/sitemap').default; } catch {}

let siteUrl = 'https://example.com';
try {
    const cfg = JSON.parse(readFileSync('src/data/siteConfig.json', 'utf-8'));
    if (cfg.url) {
        let raw = String(cfg.url).trim().replace(/\/$/, '');
        if (raw && !/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
        if (raw) siteUrl = raw;
    }
} catch {}

export default defineConfig({
    site: siteUrl,
    output: 'static',
    adapter: vercel(),
    // CSS dentro do HTML: o arquivo de CSS (~19 KB gzip) bloqueava a renderização
    // por ~150 ms no 4G (Lighthouse). Custo: cada página traz o próprio CSS, sem cache entre páginas.
    build: { inlineStylesheets: 'always' },
    integrations: [
        react(),
        // Padrão = config do painel (varre tudo). O site público usa a própria via
        // @config em global.css, sem as classes do painel (CSS inline ~25% menor).
        tailwind({ applyBaseStyles: false, configFile: './tailwind.admin.config.mjs' }),
        // Fora do sitemap: o painel (não indexável) e a busca (página utilitária,
        // sem conteúdo próprio).
        ...(sitemap ? [sitemap({ filter: (page) => !/\/(admin|search|v2)\/?/.test(page) })] : []),
    ],
    vite: {
        optimizeDeps: {
            include: ['marked'],
        },
    },
});
