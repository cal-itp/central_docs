---
title: GTFS Schedule Data Quality
summary: Quality monitoring for GTFS Schedule data
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [quality-check, gtfs, operate]
sources: [raw/specs/gtfs-schedule-data-quality-original.md, raw/issues/data-infra-5317-product-docs-epic.md]
confidence: high
---

## Owner
[[evan-siroky]]

## Description
Quality monitoring product for GTFS Schedule (static) data across all California
transit agencies. Provides dashboards, SOPs, and automation for ensuring schedule
data completeness, accuracy, and freshness.

**Warehouse layer:** Quality (sits alongside data, not in the warehouse layers directly)
**Lifecycle stage:** Operate

## Intake
Quality issues are surfaced through dashboard monitoring and automated checks.
(TBD: formal intake for new quality checks or threshold changes not yet defined.)

## Contract
- SOPs are maintained and up-to-date
- SOP automation documentation is maintained and up-to-date
- Every transit agency meeting "Public Currently Operating Fixed-Route" definition will be encouraged to have GTFS Schedule data for all services
- If data does not exist, staff will partner with agencies to create and maintain it
- Each GTFS Schedule feed expected to be valid for upcoming 30 days
- Outreach for agencies with expired or about-to-expire feeds
- Each GTFS Schedule feed expected to have zero validation errors (MobilityData GTFS Schedule Validator)
- Each GTFS Schedule feed should be downloadable nightly
- Gaps in GTFS Schedule data in the warehouse will be identified and attempted to be filled

## Consumers
Downstream products:
- Reports website
- [[gtfs-digest-reports-website]]

## Dependencies
- [[california-transit-database]] — source of truth for which agencies/feeds exist
- [[gtfs-schedule-download-parse]] — the pipeline that actually downloads feeds (quality checks what it downloads)

## SLA
**Weekly checks of:**
- GTFS Schedule Download Errors
- GTFS Schedule Validation Errors
- GTFS Schedule Expiring and About-to-Expire Warnings and Errors

**Annual checks:**
- Holiday service accuracy for Thanksgiving, Christmas, and New Year's Day

## Quality
(TBD: the quality checks ARE the product — but meta-quality (are the quality checks themselves running?) has not been defined.)

## Operations
(TBD: runbook, incident log, and alert routing not yet defined.)

## Lifecycle
So long as detailed data about transit operations is desired, GTFS Schedule Data Quality
checking will occur. If team capacity allows, more types of checks can be added.
**Last reviewed:** (TBD)
