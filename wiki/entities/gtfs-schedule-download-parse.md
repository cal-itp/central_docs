---
title: GTFS Schedule Download and Parse
summary: Pipeline downloading and parsing GTFS Schedule feeds
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [data-product, gtfs, pipeline, raw, staging, build]
sources: [raw/issues/data-infra-5317-product-docs-epic.md]
confidence: low
---

## Owner
(TBD)

## Description
Pipeline that downloads GTFS Schedule (static) data from all California transit agency
feeds and parses it into the data warehouse. The foundational ingestion pipeline for
all GTFS-based analysis.

**Warehouse layer:** Raw / Bronze → Staging / Silver
**Lifecycle stage:** Build / Operate (likely operational but without formal spec)

## Intake
(TBD)

## Contract
(TBD)

## Consumers
- [[gtfs-schedule-data-quality]]
- [[dbt-data-processing]]
- [[gtfs-digest-reports-website]]

## Dependencies
- [[california-transit-database]] — source of truth for which agencies/feeds to download

## SLA
(TBD)

## Quality
(TBD)

## Operations
(TBD)

## Lifecycle
Likely operational but without formal product documentation.
**Last reviewed:** (TBD)
