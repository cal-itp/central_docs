---
title: GTFS-RT Parser
summary: Airflow pipeline that parses and validates archived GTFS-RT protobuf into queryable warehouse data
created: 2026-05-22
updated: 2026-05-22
type: entity
subtype: data-product
tags: [data-product, gtfs-rt, pipeline, staging, mart, operate]
sources: [raw/articles/v2-warehouse-architecture-rt-data.md, raw/articles/gtfs-rt-archiver-switchover-justification.md, https://github.com/cal-itp/data-infra/blob/main/airflow/dags/parse_and_validate_rt.py]
confidence: medium
---

# GTFS-RT Parser

## Owner
(TBD — built and operated through the Caltrans contractor transition by Ministry
of Velocity and Jarvus; no named DDS steward yet. Related: [[gtfs-rt-archiver]] #5109.)

## Description
Turns the raw GTFS-RT protobuf captured by the [[gtfs-rt-archiver]] into
validated, queryable warehouse data. The archiver only lands raw feed files in
cloud storage; the parser is what makes that data usable.

It runs hourly as the Airflow `parse_and_validate_rt` DAG, which **parses** the
binary feeds into JSON and **validates** them against the GTFS-RT spec, for all
three feed types (service alerts, trip updates, vehicle positions). From there
[[dbt-data-processing]] builds the warehouse models that consumers query.

**Warehouse layer:** Raw → Parsed → Staging / Marts
**Lifecycle stage:** Operate

Implementation details (DAG code, buckets, validator) live in the repo — see Sources.

## Intake
(TBD — no formal intake process. Feed configuration is inherited upstream from the
[[gtfs-rt-archiver]], which sources its feed list from the [[california-transit-database]].)

## Contract
(TBD — no published consumer contract.) Consumers rely on each hour's RT data
being parsed and validated into the warehouse on the hourly cadence.

## Consumers
- [[gtfs-realtime-data-quality]] — RT quality monitoring is built on this
  pipeline's validation output
- [[gtfs-digest-reports-website]] — reports site consumes parsed RT data
- [[dbt-data-processing]] — builds warehouse marts on the parsed data
- [[analyst-development-environment]] — analysts query parsed RT data

## Dependencies
- [[gtfs-rt-archiver]] — upstream source of raw RT protobuf
- [[california-transit-database]] — feed catalog (inherited via the archiver)
- Airflow data pipeline — hosts the `parse_and_validate_rt` DAG
- BigQuery + dbt — warehouse modeling of parsed data

## SLA
(TBD.) Known constraint: RT volume is large (trip updates ≈ 150 GB/day), which
shapes how much can be materialized in the warehouse vs. served as views.

## Quality
- The pipeline validates every feed against the GTFS-RT spec as part of each run.
- During the 2026 Cloud Run transition, parsed output was verified by comparing
  staging vs. production data for all three feed types.

## Operations
- Runs as the Airflow `parse_and_validate_rt` DAG, monitored with the rest of the
  data pipeline. A staging environment runs the same DAG for verification.
- (TBD — incident log and alert routing not documented here.)

## Lifecycle
Currently in **Operate**. Validated through the 2026 archiver Cloud Run transition
and confirmed to produce acceptable data.
**Last reviewed:** 2026-05-22

## Sources
- [parse_and_validate_rt DAG](https://github.com/cal-itp/data-infra/blob/main/airflow/dags/parse_and_validate_rt.py) — `cal-itp/data-infra`
- [v2 Warehouse Architecture & RT data](../raw/articles/v2-warehouse-architecture-rt-data.md) — warehouse architecture & RT data availability
- [GTFS-RT Archiver switchover justification](../raw/articles/gtfs-rt-archiver-switchover-justification.md) — 2026 Cloud Run transition
