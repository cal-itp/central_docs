// Shared helpers for wiki tooling (lint + index generation).
// Dependency-free: a small frontmatter parser tuned to this wiki's conventions.

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = dirname(SCRIPT_DIR);
export const WIKI_DIR = join(REPO_ROOT, 'wiki');

// Directories that hold linkable content pages.
export const CONTENT_DIRS = ['entities', 'concepts', 'comparisons'];

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Splits a document into its YAML frontmatter block and body.
// Returns { data: null } when no frontmatter is present.
export function parseFrontmatter(text) {
  if (!text.startsWith('---')) return { data: null, body: text };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { data: null, body: text };
  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, '');
  const data = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    data[m[1]] = parseValue(m[2]);
  }
  return { data, body };
}

// Parses a single frontmatter value: quoted scalars, inline arrays,
// booleans, or bare strings. Strips trailing ` # comment` annotations
// (space-hash, so URLs and `(#1234)` issue refs are safe).
function parseValue(raw) {
  const trimmed = raw.trim();
  // Quoted scalar — return contents verbatim (no comment stripping).
  if (trimmed.length >= 2
      && ((trimmed.startsWith("'") && trimmed.endsWith("'"))
        || (trimmed.startsWith('"') && trimmed.endsWith('"')))) {
    return trimmed.slice(1, -1);
  }
  const v = trimmed.replace(/\s+#.*$/, '').trim();
  if (v === '') return '';
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    return inner === '' ? [] : inner.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v;
}

// Extracts wikilink targets from a body, normalizing `[[slug|alias]]`
// and `[[slug#anchor]]` down to the bare slug.
export function extractWikilinks(body) {
  const links = [];
  const re = /\[\[([^\]]+)\]\]/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const target = m[1].split('|')[0].split('#')[0].trim();
    if (target) links.push(target);
  }
  return links;
}

// Loads every content page with its parsed frontmatter and outbound links.
export function listPages() {
  const pages = [];
  for (const dir of CONTENT_DIRS) {
    let files;
    try {
      files = readdirSync(join(WIKI_DIR, dir));
    } catch {
      continue; // directory may not exist yet
    }
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const text = readFileSync(join(WIKI_DIR, dir, file), 'utf8');
      const { data, body } = parseFrontmatter(text);
      pages.push({
        slug: basename(file, '.md'),
        dir,
        relPath: `wiki/${dir}/${file}`,
        hasFrontmatter: data !== null,
        data: data || {},
        body,
        links: data === null ? [] : extractWikilinks(body),
      });
    }
  }
  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}
