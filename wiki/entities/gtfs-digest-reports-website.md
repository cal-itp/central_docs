---
title: GTFS Digest / Reports Website
summary: Reports website / GTFS Digest; potential merger with reports.dds
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [website, dashboard, gtfs, gtfs-rt, semantic, publish]
sources: [raw/issues/data-infra-5317-product-docs-epic.md, raw/presentations/data-product-lifecycle-2026-05-07.md]
confidence: low
---

## Owner
(TBD)

## Description
Public-facing (or internal) website that surfaces GTFS data quality reports,
digest summaries, and analytics to consumers. Referenced as a consumer of both
[[gtfs-schedule-data-quality]] and [[gtfs-realtime-data-quality]].

The lifecycle presentation Scenario 1 discusses a Reports Site Migration —
whether reports.dds.dot.ca.gov (custom, high-maintenance) should merge with
the analyst-owned GTFS Digest. These may be two products with overlapping
consumers, or one converged product.

**Warehouse layer:** Semantic / Serving (dashboards point here)
**Lifecycle stage:** Publish → potentially merging/evolving

## Intake
(TBD)

## Contract
(TBD)

## Consumers
- Caltrans staff
- Transit agencies
- Public (TBD)

## Dependencies
- [[gtfs-schedule-data-quality]]
- [[gtfs-realtime-data-quality]]
- [[dbt-data-processing]] — for curated mart data
- [[gtfs-schedule-download-parse]]
- [[gtfs-rt-archiver]]

## SLA
(TBD)

## Quality
(TBD)

## Operations
(TBD)

## Lifecycle
Active product. Scenario 1 from the lifecycle presentation raises the question of
whether this should merge with reports.dds.dot.ca.gov. Consumer inventory and
product specs for both should be written before deciding.
**Last reviewed:** (TBD)
