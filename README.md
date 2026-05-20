# central_docs

The DDS team knowledge base — products, services, processes, people, and
frameworks. Built as an [LLM Wiki], rendered as a searchable website with [Quartz].

[LLM Wiki]: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
[Quartz]: https://quartz.jzhao.xyz

## What this is

A compounding wiki maintained by humans and LLMs together. Humans curate sources
and direct analysis. The LLM summarizes, cross-references, files, and keeps
everything current — the bookkeeping humans abandon.

Pages are interlinked with `[[wikilinks]]`. Dependencies, ownership, and
relationships are always one click away. The graph view shows how everything
connects.

## What's in it

- Data products — pipelines, quality checks, dashboards
- Services and tools
- Processes and workflows
- People, roles, and ownership
- Frameworks — data governance, product lifecycle

New entity types can be added as the team's needs grow.

## Contributing

The same protocol applies whether the contributor is a person or an AI agent.
Every change goes through the same path: source → wiki pages → index → log → commit.

### Protocol

1. **Read first.** Before adding anything, read `wiki/SCHEMA.md` (conventions and
   templates) and `wiki/index.md` (what already exists). This prevents duplicates
   and missed cross-references.
2. **Pick the right template.** Entities use the canvas for their subtype
   (Data Product, Service, Process, Team Resource, Person). Concepts are
   free-form but need frontmatter.
3. **Cross-reference.** Every new or updated page must link to at least 2 other
   pages via `[[wikilinks]]`. Existing pages that should link to the new one must
   be updated too.
4. **Update the index.** Every new page goes in `wiki/index.md` under the correct
   section. If a page was updated significantly, update its one-line summary.
5. **Log it.** Append to `wiki/log.md` with date, action, and what changed.
   Format: `## [YYYY-MM-DD] action | subject`.
6. **Commit.** One commit per logical change. Commit message describes what
   changed and why. Push triggers a site rebuild.

### Adding a new entity

```
1. Choose the right template from wiki/SCHEMA.md
2. Create the page in wiki/entities/ (lowercase, hyphens, .md)
3. Fill in the template sections — use (TBD) for unknowns
4. Add [[wikilinks]] from any related pages
5. Add the page to wiki/index.md under its subtype
6. Append to wiki/log.md
7. Commit
```

### Ingesting a source (human or AI)

When new information arrives — a meeting transcript, a GitHub issue, a document:

```
1. Save the raw source in wiki/raw/ (immutable — never edit sources)
2. Identify which existing pages are affected
3. Update each affected page with new facts
4. Add new pages if the source introduces new entities
5. If new info contradicts existing content, note both claims
   and flag the contradiction in frontmatter
6. Update wiki/index.md for any new pages
7. Log the ingestion in wiki/log.md
8. Commit
```

### AI agent prompt

To have an AI agent contribute, give it this prompt plus the source:

> Read `wiki/SCHEMA.md` and `wiki/index.md`. Ingest the following source into
> the wiki. Extract entities, ownership, dependencies, SLAs, and lifecycle info.
> Update every affected page with `[[wikilinks]]`. Add new pages if needed.
> Update `index.md` and `log.md`. Do not commit — I'll review first.

### Quality checks

Before committing, verify:
- [ ] Page has YAML frontmatter with `type`, `subtype`, `tags`, `sources`
- [ ] Page links to at least 2 other pages (no orphans)
- [ ] No broken `[[wikilinks]]` (links go to pages that exist or are being
      added in the same commit)
- [ ] Index entry exists with accurate summary
- [ ] Log entry appended

## How to use

**Browse:** https://cal-itp.github.io/central_docs/ — search, graph view, tags.

**Edit:** Open in [Obsidian] as a vault, or edit markdown directly. Follow the
conventions in `wiki/SCHEMA.md`. See [Contributing](#contributing) for the full
protocol.

[Obsidian]: https://obsidian.md

**Preview locally:**

```bash
cd quartz && npm install
node quartz/bootstrap-cli.mjs build -d ../wiki --serve
```

## How it deploys

Push to `main` → GitHub Actions builds Quartz → deploys to GitHub Pages.
No manual build step needed.

## Related

- [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [Quartz](https://quartz.jzhao.xyz)
