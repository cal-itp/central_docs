---
title: GTFS Realtime Data Quality
summary: Quality monitoring for GTFS Realtime data
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [quality-check, gtfs-rt, operate]
sources: [raw/specs/gtfs-realtime-data-quality-original.md, raw/issues/data-infra-5317-product-docs-epic.md]
confidence: medium
contested: true
---

## Owner
[[evan-siroky]]

## Description
Quality monitoring product for GTFS Realtime data (vehicle positions, trip updates,
service alerts) across California transit agencies. Ensures the recording of a
historically accurate representation of performed transit operations.

**Warehouse layer:** Quality (sits alongside data)
**Lifecycle stage:** Operate

> **⚠ Note:** The original spec contains several sections that appear to be copy-pasted
> from the GTFS Schedule Data Quality spec (references to "Schedule" where "Realtime"
> is expected). These have been noted. Realtime-specific SLA and contract details need
> independent definition.

## Intake
(TBD: formal intake process not yet defined.)

## Contract
GTFS Realtime Data Quality is critical towards ensuring the recording of a historically
accurate representation of performed transit operations in California.

(TBD: The following commitments appear to be Schedule-specific copy. Realtime-specific
commitments need to be defined independently.)
- SOPs are maintained and up-to-date
- SOP automation documentation is maintained and up-to-date

## Consumers
Downstream products:
- Reports website
- [[gtfs-digest-reports-website]]

## Dependencies
- [[california-transit-database]] — source of truth for which agencies/feeds exist
- [[gtfs-rt-parser]] — produces the parsed and validated RT data this monitoring is built on
- [[gtfs-rt-archiver]] — upstream pipeline that captures the raw realtime data
- [[gtfs-schedule-data-quality]] — baseline schedule data that realtime refers to

## SLA
(TBD: The original spec lists the same weekly checks as Schedule Data Quality. This
needs to be replaced with realtime-specific checks, such as:)
- (TBD) Vehicle position feed completeness and latency
- (TBD) Trip update accuracy against observed operations
- (TBD) Service alert coverage and timeliness

## Quality
(TBD: Realtime-specific quality tests not yet defined.)

## Operations
(TBD: runbook, incident log, and alert routing not yet defined.)

## Lifecycle
So long as detailed data about transit operations is desired, GTFS Realtime Data
Quality checking will occur.
**Last reviewed:** (TBD)
