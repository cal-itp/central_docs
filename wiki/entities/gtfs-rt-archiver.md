---
title: GTFS-RT Archiver
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [data-product, gtfs-rt, pipeline, raw, design]
sources: [raw/issues/data-infra-5317-product-docs-epic.md, raw/issues/data-infra-5109-archiver-sla.md]
confidence: low
---

# GTFS-RT Archiver

## Owner
(TBD — currently unassigned. Issue #5109 seeks to define owner and SLA.)

## Description
Pipeline that archives GTFS Realtime data (vehicle positions, trip updates, service
alerts) from California transit agencies. Currently sends upkeep notification emails
but has no defined owner, SLA, or escalation path.

**Warehouse layer:** Raw / Bronze (lands data as-is)
**Lifecycle stage:** Build → moving toward Publish

## Intake
(TBD — ad-hoc currently. Upkeep notifications are emailed but have no defined recipient
or triage process. Related issues: #4852, #4362.)

## Contract
(TBD — no consumer contract defined.)

## Consumers
(TBD — likely consumers include:)
- [[gtfs-realtime-data-quality]]
- [[gtfs-digest-reports-website]]

## Dependencies
- [[california-transit-database]] — source of truth for agency/feed catalog
- GTFS-RT feed endpoints from California transit agencies

## SLA
(TBD — Issue #5109 is actively working on this. Needs:)
- Response/resolution SLA for upkeep notifications
- Escalation path if SLA cannot be met
- Coordination with ADSD on existing processes

**Recent actions (from #5109 comments):**
- 2026-05-13: vevetron proposed bringing to Monday meeting to pass to ADSD
- 2026-05-18: vevetron: "Make a product sheet, set up thresholds, and get it back to ADSD"

## Quality
(TBD)

## Operations
(TBD — currently, upkeep notification emails are sent but no one is routed to respond.)

## Lifecycle
Moving from Build toward Publish. Product spec, thresholds, and ownership are the
immediate next steps per #5109.
**Last reviewed:** (TBD)
