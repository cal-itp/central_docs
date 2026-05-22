// Regenerates wiki/index.md from page frontmatter.
// The index is a derived view — never hand-edit it; run this script instead.
//
// Usage: node scripts/build-index.mjs        (writes wiki/index.md)
//        node scripts/build-index.mjs --check (exits 1 if out of date)

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';
import { pathToFileURL } from 'node:url';
import { listPages, WIKI_DIR } from './wiki.mjs';

// Entity subtypes, in display order, with placeholder text for empty sections.
const ENTITY_SECTIONS = [
  { subtype: 'data-product', heading: 'Data Products', hint: 'add data products, pipelines, dashboards here' },
  { subtype: 'person', heading: 'People', hint: 'add owners and stewards here' },
  { subtype: 'service', heading: 'Services', hint: 'add services, tools, platforms here' },
  { subtype: 'process', heading: 'Processes', hint: 'add workflows, intake queues, review processes here' },
  { subtype: 'team-resource', heading: 'Team Resources', hint: 'add environments, tooling, access groups here' },
  { subtype: 'vendor', heading: 'Vendors', hint: 'add vendors and contracts here' },
];

function pageLine(page) {
  const summary = page.data.summary || '(no summary — add a `summary:` field)';
  return `- [[${page.slug}]] — ${summary}`;
}

function section(pages, hint) {
  return pages.length ? pages.map(pageLine).join('\n') : `_None yet — ${hint}._`;
}

export function generateIndex() {
  const pages = listPages();
  const entities = pages.filter((p) => p.data.type === 'entity');
  const concepts = pages.filter((p) => p.data.type === 'concept');
  const comparisons = pages.filter((p) => p.data.type === 'comparison');

  const dates = pages.map((p) => p.data.updated).filter((d) => typeof d === 'string' && d);
  const lastUpdated = dates.length ? dates.sort().at(-1) : 'unknown';

  const out = [];
  out.push('# Wiki Index');
  out.push('');
  out.push('<!-- GENERATED FILE — do not edit by hand. Run: node scripts/build-index.mjs -->');
  out.push('');
  out.push('> Content catalog for Caltrans DDS.');
  out.push('> Every wiki page listed under its type with a one-line summary.');
  out.push(`> Last updated: ${lastUpdated} | Total pages: ${pages.length}`);
  out.push('');
  out.push('## Entities');
  for (const { subtype, heading, hint } of ENTITY_SECTIONS) {
    const inSection = entities.filter((p) => p.data.subtype === subtype);
    if (subtype === 'vendor' && inSection.length === 0) continue; // omit until used
    out.push('');
    out.push(`### ${heading}`);
    out.push(section(inSection, hint));
  }
  out.push('');
  out.push('## Concepts');
  out.push(section(concepts, 'add frameworks and cross-cutting concepts here'));
  out.push('');
  out.push('## Comparisons');
  out.push(section(comparisons, 'add cross-entity comparisons here'));
  out.push('');
  return out.join('\n');
}

// Run side effects only when invoked directly, not when imported by lint.mjs.
// (Version-portable equivalent of `import.meta.main`, which needs Node 24+.)
const isMain = argv[1] && import.meta.url === pathToFileURL(argv[1]).href;
if (isMain) {
  const indexPath = join(WIKI_DIR, 'index.md');
  const generated = generateIndex();

  if (process.argv.includes('--check')) {
    let current = '';
    try {
      current = readFileSync(indexPath, 'utf8');
    } catch {
      /* missing file — treated as out of date below */
    }
    if (current !== generated) {
      console.error('✗ wiki/index.md is out of date. Run: node scripts/build-index.mjs');
      process.exit(1);
    }
    console.log('✓ wiki/index.md is up to date');
  } else {
    writeFileSync(indexPath, generated);
    console.log(`✓ wrote wiki/index.md (${generated.split('\n').length} lines)`);
  }
}
