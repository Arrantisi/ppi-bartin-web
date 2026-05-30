import fs from 'fs';
import path from 'path';

const root = process.cwd();
const ignoreDirs = ['node_modules', '.next', 'dist', 'out', 'public', 'pnpm-lock.yaml'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    if (ignoreDirs.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(full));
    else if (/\.tsx?$/.test(e.name)) files.push(full);
  }
  return files;
}

const allFiles = walk(root);
const filesByRel = allFiles.map(f => path.relative(root, f));
const fileContents = Object.fromEntries(filesByRel.map(r => [r, fs.readFileSync(path.join(root, r), 'utf8')]));

function checkUsage(relPath) {
  const noExt = relPath.replace(/\.(ts|tsx)$/, '');
  const parts = noExt.split(path.sep);
  // generate possible import tokens
  const tokens = [];
  tokens.push(`@/${noExt}`);
  tokens.push(`/${noExt}`);
  tokens.push(parts[parts.length-1]); // basename
  // also add path after components/ if present
  const idx = parts.indexOf('components');
  if (idx !== -1) {
    const sub = parts.slice(idx).join('/');
    tokens.push(`@/${sub}`);
    tokens.push(sub);
  }

  // scan all other files for tokens inside import/require lines or JSX usage
  for (const [other, content] of Object.entries(fileContents)) {
    if (other === relPath) continue;
    // quick filter: look only in files where tokens appear
    for (const t of tokens) {
      if (content.includes(t)) return true;
    }
  }
  return false;
}

const candidates = [];
for (const rel of filesByRel) {
  // skip the scanner itself and node/next build artifacts
  if (rel.startsWith('scripts/') || rel.includes('.next') || rel.includes('node_modules')) continue;
  const used = checkUsage(rel);
  if (!used) candidates.push(rel);
}

console.log(JSON.stringify({ candidates, count: candidates.length }, null, 2));
