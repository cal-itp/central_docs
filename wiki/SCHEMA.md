# Wiki Schema

## Domain
Caltrans DDS — catalog of everything the Data & Digital Services team owns and
operates within Cal-ITP. Covers data products, services, processes, people,
vendors, contracts, and the frameworks that govern them.

## Conventions
- File names: lowercase, hyphens, no spaces (e.g., `gtfs-rt-archiver.md`)
- Every wiki page starts with YAML frontmatter
- Do not add an H1 (`# Title`) to the page body — Quartz renders the frontmatter
  `title` as the page heading. Start the body with the first `##` section.
- Use `[[wikilinks]]` to link between pages (minimum 1 outbound link per page;
  2+ is better) — and avoid orphans: every page needs at least one inbound link
- When updating a page, always bump the `updated` date
- `index.md` is generated — never edit it by hand. CI regenerates it from page
  frontmatter and commits it back on push, so you don't run anything (use
  `npm run index` only to preview it locally)
- Run `npm run check` before committing — it lints every page (it does not touch
  the index)
- Git history is the changelog — every change is one commit with a message
  describing what changed and why
- Entity pages follow the template for their type (below)

## Frontmatter

```yaml
---
title: Page Title
summary: One-line summary — used verbatim in the generated index
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | person
subtype: data-product | service | process | team-resource | vendor | person | framework
tags: [from taxonomy below]
sources: [raw/presentations/source.md]
confidence: high | medium | low
contested: true  # optional
---
```

`title`, `summary`, `created`, `updated`, `type`, and `sources` are required —
the linter (`npm run lint`) fails the build if any are missing. The `sources`
key must be present but may be empty (`sources: []`) when a page isn't drawn
from a captured source yet. `confidence` is optional and defaults to `low`.
Quote any `summary` containing a colon (e.g. `summary: 'Stage 1: intake'`).

### raw/ Frontmatter

```yaml
---
source_url: https://...   # original URL, if applicable
ingested: YYYY-MM-DD
sha256: <hex digest of body below frontmatter>
description: Brief description
---
```

## Tag Taxonomy
- **Entity Type:** data-product, service, process, team-resource, vendor, person
- **Domain:** gtfs, gtfs-rt, ridership, payment, airtable, dbt
- **Warehouse Layer:** raw, staging, mart, semantic
- **Lifecycle Stage:** intake, design, build, publish, operate, retire
- **Meta:** owner, dependency, consumer, sla, contract, quality, operations, intake
- **Structural:** pipeline, quality-check, website, dashboard, environment, framework
- **Frameworks:** data-governance, product-lifecycle

## Entity Templates

Choose the template that fits the entity. Sections marked (TBD) can be left as
placeholders.

Ready-to-insert versions of every canvas below live in `wiki/templates/`, wired
to Obsidian's **Templates** plugin (command palette → *Insert template*). Each
already carries the required frontmatter and section headings — start there rather
than copying the outlines by hand.

### Data Product Canvas
For pipelines, quality checks, dashboards, and warehouse components.

1. **Owner** — Named person. Link to person page.
2. **Description** — What it is, warehouse layer, lifecycle stage.
3. **Intake** — How requests/bugs are triaged.
4. **Contract** — What consumers can rely on.
5. **Consumers** — Downstream products/dashboards/teams.
6. **Dependencies** — Upstream products/systems.
7. **SLA** — Freshness, volume, uptime, response time.
8. **Quality** — Tests: schema, volume, freshness, business rules.
9. **Operations** — Runbook, incident log, alert routing.
10. **Lifecycle** — Current stage, plans, retirement path.

### Service Canvas
For tools, platforms, support services.

1. **Owner** — Named person or team.
2. **Description** — What the service does, who uses it.
3. **Access** — How to get access. Who approves.
4. **Commitments** — Uptime, availability, support hours.
5. **Consumers** — Teams/people who rely on it.
6. **Dependencies** — Infrastructure/platforms it runs on.
7. **Operations** — Runbook, monitoring, alert routing.
8. **Lifecycle** — Plans, end-of-life, migration path.

### Process Canvas
For workflows, intake queues, review processes.

1. **Owner** — Named person or team.
2. **Description** — What the process is, what triggers it.
3. **Steps** — The workflow, decision points.
4. **Participants** — Who's involved, what role.
5. **Inputs/Outputs** — What goes in, what comes out.
6. **SLA** — Time commitments per step.
7. **Lifecycle** — When it's reviewed, sunset conditions.

### Team Resource Canvas
For environments, tooling, access groups.

1. **Owner** — Named person or team.
2. **Description** — What it is, who uses it.
3. **Access** — How to get it, who grants it.
4. **Dependencies** — What it depends on.
5. **Lifecycle** — Refresh cadence, retirement.

### Person Page
For people who appear as owners/stewards.

1. **Role** — What they do at DDS.
2. **Owns** — List of entities they own (with `[[wikilinks]]`).
3. **Contact** — (Optional) Email, Slack.

## Page Thresholds
- **Create a page** for any entity the team would ask "who owns this?" about
- **Create a person page** when someone appears as owner for 1+ entities
- **Create a concept page** for frameworks that span multiple entities
- **DON'T create a page** for one-off scripts, deprecated artifacts, or passing mentions
- **Split a page** when it exceeds ~200 lines
- **Archive a page** when its entity is retired — move to `_archive/`, remove from index

## Update Policy
When new information conflicts with existing content:
1. Check the dates — newer sources generally supersede older ones
2. If genuinely contradictory, note both positions with dates and sources
3. Mark in frontmatter: `contradictions: [page-name]`
4. Flag for review in lint reports
