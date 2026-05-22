---
title: Airtable Download and Parse
summary: Pipeline downloading Airtable data into the warehouse
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [data-product, airtable, pipeline, staging, build]
sources: [raw/issues/data-infra-5317-product-docs-epic.md]
confidence: low
---

# Airtable Download and Parse

## Owner
(TBD)

## Description
Pipeline that downloads data from the California Transit Database Airtable via API
and parses it into the data warehouse. This is the bridge between the manually
curated Airtable and the automated pipeline.

**Warehouse layer:** Raw / Bronze → Staging / Silver
**Lifecycle stage:** Build / Operate

## Intake
(TBD)

## Contract
(TBD)

## Consumers
- [[gtfs-schedule-download-parse]] — uses transit agency/feed catalog
- [[gtfs-rt-archiver]] — uses transit agency/feed catalog
- [[dbt-data-processing]]

## Dependencies
- [[california-transit-database]] — the Airtable itself (API source)

## SLA
(TBD)

## Quality
(TBD)

## Operations
(TBD)

## Lifecycle
(TBD)
**Last reviewed:** (TBD)
