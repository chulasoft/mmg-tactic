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

const preamble =
`/* Magic Maidens Tactic — compiled bundle. Do not edit directly.
   Source of truth: src/magic-maidens-tactic.jsx  |  Rebuild: node src/build.js */
const { useState, useReducer, useEffect, useCallback, useRef, useMemo } = React;
`;

const icons = fs.readFileSync(path.join(ROOT, 'src', 'icons.js'), 'utf8');

const mount = `
// ── Mount ──
const __root = ReactDOM.createRoot(document.getElementById('root'));
__root.render(React.createElement(App));
`;

const out = babel.transformSync(preamble + icons + '\n' + jsx + mount, {
  presets: [
    ['@babel/preset-react', { runtime: 'classic' }],
    ['@babel/preset-env',   { targets: { esmodules: true }, modules: false }],
  ],
  filename: 'app.jsx',
  compact: false,
});

fs.writeFileSync(OUT, out.code);
console.log('✅ app.js built — ' + (out.code.length / 1024).toFixed(0) + 'KB');
