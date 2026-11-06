// Gera -480.webp e -960.webp das fotos de public/images (sem sobrescrever nem ampliar)
// e grava src/lib/imagensVariantes.json com a largura real de cada original e as variantes existentes.
const path = require('path'), fs = require('fs');
// Uso: node scripts/gerar-variantes-imagens.cjs  (rodar de novo ao trocar ou incluir foto em public/images)
const proj = process.argv[2] || path.join(__dirname, '..');
const sharp = require(path.join(proj, 'node_modules', 'sharp'));
const dir = path.join(proj, 'public', 'images');
(async () => {
  const mapa = {};
  for (const f of fs.readdirSync(dir).sort()) {
    if (!/\.(jpe?g|webp)$/i.test(f) || /-(480|960)\.webp$|-copia\.|^logo|^corp-/i.test(f)) continue;
    const base = f.replace(/\.\w+$/, '');
    const meta = await sharp(path.join(dir, f)).metadata();
    const variantes = [];
    for (const w of [480, 960]) {
      const out = path.join(dir, `${base}-${w}.webp`);
      if (meta.width <= w) continue;
      if (!fs.existsSync(out)) await sharp(path.join(dir, f)).resize({ width: w }).webp({ quality: 72 }).toFile(out);
      variantes.push(w);
    }
    if (variantes.length) mapa[`/images/${f}`] = { w: meta.width, variantes };
  }
  fs.writeFileSync(path.join(proj, 'src', 'lib', 'imagensVariantes.json'), JSON.stringify(mapa, null, 2) + '\n');
  console.log(Object.keys(mapa).length, 'fotos no mapa');
})().catch((e) => { console.error(e); process.exit(1); });
