import base from './tailwind.config.mjs';

/** Tailwind do painel (/admin): mesmo tema do site, varrendo o projeto inteiro.
 *  É o padrão da integração em astro.config.mjs (vale para admin.css); o site
 *  público usa tailwind.config.mjs via @config em global.css. */
export default {
  ...base,
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
};
