# central_docs

The DDS team knowledge base — products, services, processes, people, and
frameworks. A linked wiki, rendered as a searchable website with [Quartz].

[Quartz]: https://quartz.jzhao.xyz

## What this is

A compounding wiki the team maintains together. Contributors curate sources and
direct the analysis; the wiki's job is to summarize, cross-reference, file, and
keep everything current — the bookkeeping that otherwise gets abandoned.

Pages are interlinked with `[[wikilinks]]`. Dependencies, ownership, and
relationships are always one click away. The graph view shows how everything
connects.

## What's in it

- Data products — pipelines, quality checks, dashboards
- Services and tools
- Processes and workflows
- People, roles, and ownership
- Frameworks and concepts — data governance, product lifecycle
- Comparisons — side-by-side analysis across entities

New entity types can be added as the team's needs grow.

Pages are organized by kind: entities in `wiki/entities/`, concepts in
`wiki/concepts/`, comparisons in `wiki/comparisons/`, and immutable source
material in `wiki/raw/`.

## Contributing

The same protocol applies to every contributor. Every change goes through the
same path: source → wiki pages → commit. The index is regenerated for you on
push (see below) — you never have to touch it.

### Protocol

1. **Read first.** Before adding anything, read `wiki/SCHEMA.md` (conventions and
   templates) and `wiki/index.md` (what already exists). This prevents duplicates
   and missed cross-references.
2. **Pick the right template.** Entities use the canvas for their subtype
   (Data Product, Service, Process, Team Resource, Person) and live in
   `wiki/entities/`. Concepts are free-form but need frontmatter and live in
   `wiki/concepts/` (e.g. frameworks like data governance). Cross-entity
   comparisons go in `wiki/comparisons/`.
3. **Cross-reference.** Every new or updated page must link to at least 1 other
   page via `[[wikilinks]]` (2+ is better — the graph is the point). Update
   existing pages that should link to the new one too, so it isn't an orphan.
4. **Commit.** One commit per logical change, with a message describing what
   changed and why — git history is the wiki's changelog. Push triggers a site
   rebuild, and CI regenerates `wiki/index.md` from page frontmatter and commits
   it back — never edit the index by hand. (To preview it locally, `npm run
   index`; the one-line entry comes from each page's `summary:` field.)

### Adding a new entity

```
1. Choose the right template from wiki/SCHEMA.md
2. Create the page in wiki/entities/ (lowercase, hyphens, .md)
3. Fill in the template sections — use (TBD) for unknowns
4. Add [[wikilinks]] from any related pages
5. Verify — npm run check
6. Commit (CI regenerates the index; the commit message is the changelog entry)
```

### Ingesting a source

When new information arrives — a meeting transcript, a GitHub issue, a document:

```
1. Save the raw source in wiki/raw/ by type — articles/, issues/,
   presentations/, specs/, or transcripts/ (immutable — never edit sources)
2. Identify which existing pages are affected
3. Update each affected page with new facts
4. Add new pages if the source introduces new entities
5. If new info contradicts existing content, note both claims
   and flag the contradiction in frontmatter
6. Verify — npm run check
7. Commit (CI regenerates the index; the commit message is the changelog entry)
```

### Ingestion brief

A reusable brief that captures the whole ingestion task in one place — hand it,
plus the source, to whoever (or whatever) is doing the write-up:

> Read `wiki/SCHEMA.md` and `wiki/index.md`. Ingest the following source into
> the wiki. Extract entities, ownership, dependencies, SLAs, and lifecycle info.
> Update every affected page with `[[wikilinks]]`. Add new pages if needed.
> Run `npm run check` to verify (CI regenerates the index on push).
> Do not commit — I'll review first.

### Quality checks

Run `npm run check` before committing. It lints every page — the same check CI
enforces on push:
- Required frontmatter present (`title`, `summary`, `created`, `updated`,
  `type`, `sources`) — keys must exist; `sources: []` is allowed. `confidence`
  is optional (defaults to `low`)
- Every page links to at least 1 other, with no broken `[[wikilinks]]`
- No orphan pages (every page has at least one inbound link)

`wiki/index.md` is regenerated and committed by CI on push, so it's not part of
the local check — you never edit or regenerate it by hand.

## How to use

**Browse:** https://cal-itp.github.io/central_docs/ — search, graph view, tags.

**Edit:** Open in [Obsidian] as a vault, or edit markdown directly. Follow the
conventions in `wiki/SCHEMA.md`. See [Contributing](#contributing) for the full
protocol.

Starter templates for every page type live in `wiki/templates/` and are wired to
Obsidian's built-in **Templates** plugin. To add a page by hand: create the note
in the right folder (`wiki/entities/`, `wiki/concepts/`, or `wiki/comparisons/`),
then run the command palette's **Templates: Insert template** and pick the canvas
that fits (data product, service, process, team resource, person, concept, or
comparison). The template fills in the required frontmatter and section headings.
Example links in the templates are shown as inline `` `[[code]]` `` so inserting a
template never creates stray empty pages — replace them with real `[[wikilinks]]`
(no backticks). Then delete the `%% ... %%` hints and run `npm run check`. CI
regenerates the index on push, so there's no index step.

[Obsidian]: https://obsidian.md

**Check your changes** (no dependencies — needs only Node):

```bash
npm run check    # lint every page (frontmatter, wikilinks, orphans)
npm run index    # optional — preview wiki/index.md locally (CI does this on push)
```

**Preview locally:**

```bash
scripts/build-site.sh --serve
```

Quartz is not vendored into this repo — `scripts/build-site.sh` clones it
(pinned version) into a gitignored `quartz/` directory on first run, overlays
`quartz.config.ts`, then builds and serves. To upgrade Quartz, bump the version
in that script and delete the local `quartz/`.

## How it deploys

Push to `main` → GitHub Actions lints the wiki → regenerates `wiki/index.md` and
commits it back if it changed → builds the site (Quartz cloned fresh) → deploys
to GitHub Pages. A lint failure (bad frontmatter, broken link, orphan page)
blocks the deploy. No manual build or index step needed.

## Related

- [Quartz](https://quartz.jzhao.xyz) — the static-site generator that renders the wiki
- [Obsidian](https://obsidian.md) — recommended editor; opens this repo as a vault
