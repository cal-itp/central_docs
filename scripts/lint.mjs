// Lints the wiki against the conventions in wiki/SCHEMA.md and README.md.
// Errors fail the build; warnings are reported but do not.
//
// Usage: node scripts/lint.mjs

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { listPages, WIKI_DIR, DATE_RE } from './wiki.mjs';

// `confidence` is optional — a soft judgment field, so we don't make
// contributors supply it. When present it's still validated against the list
// below; templates ship `confidence: low` so most pages set it anyway.
const REQUIRED_KEYS = ['title', 'created', 'updated', 'type', 'summary', 'sources'];
const TYPES = ['entity', 'concept', 'comparison', 'query', 'person'];
const SUBTYPES = ['data-product', 'service', 'process', 'team-resource', 'vendor', 'person', 'framework'];
const CONFIDENCE = ['high', 'medium', 'low'];
const MIN_OUTBOUND_LINKS = 1;

// Tag taxonomy from wiki/SCHEMA.md. Off-taxonomy tags are warnings, not errors.
const TAXONOMY = new Set([
  'data-product', 'service', 'process', 'team-resource', 'vendor', 'person',
  'gtfs', 'gtfs-rt', 'ridership', 'payment', 'airtable', 'dbt',
  'raw', 'staging', 'mart', 'semantic',
  'intake', 'design', 'build', 'publish', 'operate', 'retire',
  'owner', 'dependency', 'consumer', 'sla', 'contract', 'quality', 'operations',
  'data-governance', 'product-lifecycle',
  'pipeline', 'quality-check', 'website', 'dashboard', 'environment', 'framework',
]);

const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

const pages = listPages();
const slugs = new Set(pages.map((p) => p.slug));
const inbound = new Map(pages.map((p) => [p.slug, 0]));

// --- Per-page frontmatter validation ---
for (const page of pages) {
  const id = page.relPath;
  if (!page.hasFrontmatter) {
    err(id, 'no YAML frontmatter');
    continue;
  }
  const fm = page.data;

  // The key must be present, but an empty `sources: []` is allowed — sources is
  // often genuinely unknown, and forcing a value invites fabricated citations.
  // (The templates ship with `sources: []`, so requiring non-empty here would
  // fail every page created from a template.)
  for (const key of REQUIRED_KEYS) {
    const v = fm[key];
    if (v === undefined || v === '') {
      err(id, `missing required frontmatter key: ${key}`);
    }
  }

  if (fm.type !== undefined && !TYPES.includes(fm.type)) {
    err(id, `invalid type: ${fm.type} (expected ${TYPES.join(', ')})`);
  }
  if (fm.confidence !== undefined && !CONFIDENCE.includes(fm.confidence)) {
    err(id, `invalid confidence: ${fm.confidence} (expected ${CONFIDENCE.join(', ')})`);
  }
  for (const key of ['created', 'updated']) {
    if (fm[key] !== undefined && !DATE_RE.test(String(fm[key]))) {
      err(id, `${key} is not a YYYY-MM-DD date: ${fm[key]}`);
    }
  }
  if (DATE_RE.test(String(fm.created)) && DATE_RE.test(String(fm.updated))
      && String(fm.updated) < String(fm.created)) {
    err(id, `updated (${fm.updated}) is before created (${fm.created})`);
  }

  if (fm.subtype !== undefined && !SUBTYPES.includes(fm.subtype)) {
    warn(id, `unrecognized subtype: ${fm.subtype}`);
  }
  for (const tag of Array.isArray(fm.tags) ? fm.tags : []) {
    if (!TAXONOMY.has(tag)) warn(id, `tag not in SCHEMA taxonomy: ${tag}`);
  }
  for (const src of Array.isArray(fm.sources) ? fm.sources : []) {
    if (src.startsWith('raw/') && !existsSync(join(WIKI_DIR, src))) {
      warn(id, `source file not found: ${src}`);
    }
  }

  // --- No body H1 (Quartz renders the frontmatter title as the heading) ---
  const firstBodyLine = page.body.split('\n').find((l) => l.trim() !== '');
  if (firstBodyLine && /^#\s/.test(firstBodyLine)) {
    err(id, 'body starts with an H1 heading — Quartz already renders the '
      + 'frontmatter title; remove the `# ...` line');
  }

  // --- Wikilink validation ---
  const outbound = new Set();
  for (const target of page.links) {
    if (!slugs.has(target)) {
      err(id, `broken wikilink: [[${target}]]`);
    } else if (target !== page.slug) {
      outbound.add(target);
      inbound.set(target, inbound.get(target) + 1);
    }
  }
  if (outbound.size < MIN_OUTBOUND_LINKS) {
    err(id, `has ${outbound.size} outbound wikilink(s); needs at least ${MIN_OUTBOUND_LINKS}`);
  }
}

// --- Orphan check (no inbound links from other content pages) ---
for (const page of pages) {
  if (inbound.get(page.slug) === 0) {
    err(page.relPath, 'orphan page — no other page links to it');
  }
}

// NOTE: index freshness is not checked here. wiki/index.md is a derived file
// that CI regenerates and commits on push (see .github/workflows/deploy.yml),
// so contributors never have to run the generator or keep the index in sync.

// --- Report ---
for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  ERROR ${e}`);

console.log(
  `\n${pages.length} pages checked — ${errors.length} error(s), ${warnings.length} warning(s)`,
);
process.exit(errors.length > 0 ? 1 : 0);
