# Wiki Log

> Chronological record of all wiki actions. Append-only.
> Format: `## [YYYY-MM-DD] action | subject`

## [2026-05-20] create | Wiki Initialized
- Domain: Caltrans DDS Data Products
- Structure created with SCHEMA.md, index.md, log.md
- Wiki path: /Users/vivek/w_projects/central_docs/wiki

## [2026-05-20] ingest | Batch initial ingestion
- Ingested presentations:
  - raw/presentations/data-governance-fundamentals-2026-05-01.md
  - raw/presentations/data-product-lifecycle-2026-05-07.md
- Ingested transcripts:
  - raw/transcripts/governance-fundamentals-meeting-2026-05-01.md
  - raw/transcripts/product-lifecycle-meeting-2026-05-07.md
- Ingested GitHub issues:
  - raw/issues/data-infra-5317-product-docs-epic.md
  - raw/issues/data-infra-5109-archiver-sla.md
- Archived original product specs:
  - raw/specs/california-transit-database-original.md
  - raw/specs/gtfs-schedule-data-quality-original.md
  - raw/specs/gtfs-realtime-data-quality-original.md

## [2026-05-20] create | Entity pages for all data products
- Created: california-transit-database, gtfs-schedule-data-quality,
  gtfs-realtime-data-quality, gtfs-rt-archiver, gtfs-schedule-download-parse,
  airtable-download-parse, dbt-data-processing, ridership-data-collection,
  analyst-development-environment, gtfs-digest-reports-website
- Created person entity: evan-siroky
- Created concept pages: data-product-lifecycle, data-governance-framework

## [2026-05-20] note | Product spec canvas evolved
- Original 5-section template (Owner/Contract/Consumers/SLA/Lifecycle) expanded to
  10-section Product Spec Canvas: added Description, Intake, Dependencies, Quality,
  and Operations. Based on the Data Product Lifecycle presentation framework.
- Canvas maps to the 8-stage lifecycle: Intake → Discover → Design → Build →
  Quality → Publish → Defend → Evolve/Retire.

## [2026-05-20] lint | Cross-reference fix
- Added [[data-governance-framework]] link from data-product-lifecycle
- Added [[ridership-data-collection]] and [[gtfs-schedule-download-parse]] / [[gtfs-rt-archiver]] links from data-governance-framework critical domains section
- Added [[analyst-development-environment]] link from dbt-data-processing consumers section
- All 13 wiki pages now have at least one inbound link (0 orphans)

## [2026-05-20] setup | Quartz static site configured
- Quartz v4.5.2 installed in quartz/ directory
- Build configured with `-d ../wiki` to read wiki content
- Output goes to public/ directory
- local build test: 54 files emitted from 16 markdown pages (229ms)
- GitHub Actions workflow at .github/workflows/deploy.yml: builds on push to main, deploys to GitHub Pages
- .gitignore excludes node_modules, public/, binary reference files, and build scripts

## [2026-05-20] update | Expanded scope beyond data products
- Wiki domain broadened from "data products only" to "everything DDS owns"
- SCHEMA.md updated: added subtype field, defined 5 entity templates (Data Product,
  Service, Process, Team Resource, Person)
- All 13 existing pages updated with subtype frontmatter
- index.md restructured with sections for Services, Processes, Team Resources
  (empty for now)
- README.md written (two versions: detailed then slimmed down for broader scope)
