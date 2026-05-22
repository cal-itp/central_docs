---
title: California Transit Database
summary: Airtable catalog of California transit agencies, services, and GTFS feeds
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [data-product, airtable, mart, operate]
sources: [raw/specs/california-transit-database-original.md, raw/issues/data-infra-5317-product-docs-epic.md]
confidence: high
---

# California Transit Database

## Owner
[[evan-siroky]]

## Description
The California Transit Database is an Airtable-based catalog of all transit agencies
operating in California, the services they manage, and the GTFS data they publish.
It serves as the foundational reference database for the DDS data pipeline and warehouse.

**Warehouse layer:** External source / Mart
**Lifecycle stage:** Operate (mature, stable — exists since Cal-ITP inception)

## Intake
Data updates are performed by the Transit Data Quality Team on rotation.
New agency/service/feed additions follow established workflows.
(TBD: formal intake process not yet defined.)

## Contract
- Availability for view access for any Caltrans staff
- Edit access for select DDS staff
- Up-to-date documentation at Airtable: Data Documentation
- Comprehensive listing of all "Public Currently Operating" transit agencies in California
- Comprehensive listing of all services operating in California
- Comprehensive listing of all GTFS feeds associated with those services
- Comprehensive mapping of NTD IDs for all NTD reporters in California

## Consumers
Downloaded nightly via API from Airflow DAGs. Downstream products:
- [[gtfs-schedule-download-parse]]
- [[gtfs-rt-archiver]]
- [[dbt-data-processing]]

## Dependencies
- Airtable platform (license renewals managed by owner)
- Transit Data Quality Team for data currency

## SLA
- Available for viewing and edit access during business hours
- Data updated in realtime to the best of the team's knowledge for: agencies, services, GTFS feeds
- Annual review of NTD IDs following each annual NTD Data release

## Quality
(TBD: schema, volume, freshness, and business-rule tests not yet defined.)

## Operations
(TBD: runbook, incident log, and alert routing not yet defined.
The Transit Data Quality Team performs rotating updates.)

## Lifecycle
Exists since Cal-ITP inception. May eventually map to Salesforce data which may contain
a more authoritative catalog of transit agency entities.
**Last reviewed:** (TBD)
