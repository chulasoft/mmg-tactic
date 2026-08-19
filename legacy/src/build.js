/**
 * Build script — compiles src/magic-maidens-tactic.jsx into app.js
 *
 *   npm install --no-save @babel/core @babel/preset-react @babel/preset-env
 *   node src/build.js
 *
 * Run from the repository root.
 */
const babel = require('@babel/core');
const fs    = require('fs');
const path  = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC  = path.join(ROOT, 'src', 'magic-maidens-tactic.jsx');
const OUT  = path.join(ROOT, 'app.js');

let jsx = fs.readFileSync(SRC, 'utf8');

// The .jsx source targets the Claude artifact runtime (ESM + lucide-react).
// For the browser build we strip those imports and supply globals instead.
jsx = jsx.replace(/^import[\s\S]*?from\s+"react"\s*/m, '');
jsx = jsx.replace(/^import\s*\{[\s\S]*?\}\s*from\s+"lucide-react"\s*/m, '');
jsx = jsx.replace(/export default function App\(\)/, 'function App()');

// The .jsx source points hero artwork at an absolute CDN host so it works
// inside the Claude artifact viewer (no relative paths there). The deployed
// site ships the same portraits in ./asset-tactic/, so rewrite the base to a
// relative path — the bundled images load with no external dependency.
jsx = jsx.replace(/const GH = '[^']*'/, "const GH = 'asset-tactic/'");

const preamble =
`/* Magic Maidens Tactic — compiled bundle. Do not edit directly.
   Source of truth: src/magic-maidens-tactic.jsx  |  Rebuild: node src/build.js */
const { useState, useReducer, useEffect, useCallback, useRef, useMemo } = React;
`;

const icons = fs.readFileSync(path.join(ROOT, 'src', 'icons.js'), 'utf8');

// Pure ESM core modules, inlined in order. Each is authored as ESM (so
// `node --test` can import it directly); for the browser bundle we strip the
// module syntax and concatenate — the exported names become plain globals that
// the app source below can call.
const CORE = [
  'src/core/engine.mjs',
];
function inlineCore(rel) {
  let code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  code = code.replace(/^\s*import[\s\S]*?;?\s*$/mg, '');   // drop any import lines
  code = code.replace(/^export\s+/mg, '');                  // `export function/const` → global
  return `\n/* inlined: ${rel} */\n` + code + '\n';
}
const core = CORE.map(inlineCore).join('');

const mount = `
// ── Mount ──
const __root = ReactDOM.createRoot(document.getElementById('root'));
__root.render(React.createElement(App));
`;

const out = babel.transformSync(preamble + icons + '\n' + core + '\n' + jsx + mount, {
  presets: [
    ['@babel/preset-react', { runtime: 'classic' }],
    ['@babel/preset-env',   { targets: { esmodules: true }, modules: false }],
  ],
  filename: 'app.jsx',
  compact: false,
});

fs.writeFileSync(OUT, out.code);
console.log('✅ app.js built — ' + (out.code.length / 1024).toFixed(0) + 'KB');
