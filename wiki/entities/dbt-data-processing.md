---
title: dbt Data Processing
summary: dbt transformation pipeline (staging → marts); tests currently off
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [data-product, dbt, pipeline, staging, mart, build]
sources: [raw/issues/data-infra-5317-product-docs-epic.md, raw/presentations/data-product-lifecycle-2026-05-07.md]
confidence: low
---

## Owner
(TBD)

## Description
dbt-based transformation pipeline that processes raw/ingested data through staging
to marts. Implements business logic, data quality tests, and shapes data for
consumer-ready marts. Referenced in the Data Product Lifecycle presentation as
the standard pattern: "dbt-style transforms through staging to marts."

**Warehouse layer:** Staging / Silver → Marts / Gold
**Lifecycle stage:** Build / Operate

> **⚠ Note from lifecycle presentation (Scenario 3):** dbt tests have been off since
> October. Root cause: alert fatigue from tests without specs, no SLAs, no clear
> owners, no severity classification. The product-driven strategy is to anchor
> every test to a named Product Spec, tier (P1 vs P3), and route accordingly.

## Intake
(TBD)

## Contract
(TBD — no consumer contract defined.)

## Consumers
- [[analyst-development-environment]] — analysts query curated marts for analysis
- (TBD — additional consumers include analytics dashboards, reports, and downstream products.)

## Dependencies
- [[gtfs-schedule-download-parse]]
- [[airtable-download-parse]]
- [[california-transit-database]]

## SLA
(TBD)

## Quality
**Known issues:**
- dbt tests have been off since October (per lifecycle presentation Scenario 3)
- Alert fatigue from untiered, unowned test failures
- **Strategy (from lifecycle presentation):** Anchor every test to a named Product Spec,
  tier P1 (Contract break) vs P3 (Informational), route P1 alerts more aggressively,
  add next product only when alerts are quiet for 7 days

## Operations
(TBD)

## Lifecycle
Currently in Build. Moving toward Publish — re-enabling tests with proper ownership
and tiering is the immediate next step.
**Last reviewed:** (TBD)
