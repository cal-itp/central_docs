---
title: GTFS-RT Archiver
summary: Pipeline archiving raw GTFS Realtime data to cloud storage; needs a formal SLA (#5109)
created: 2026-05-20
updated: 2026-05-22
type: entity
subtype: data-product
tags: [data-product, gtfs-rt, pipeline, raw, operations, dependency]
sources: [raw/issues/data-infra-5317-product-docs-epic.md, raw/issues/data-infra-5109-archiver-sla.md, raw/articles/gtfs-rt-archiver-update-2022-06-29.md, raw/articles/rt-archiver-v3-tech-spec.md, raw/articles/gtfs-rt-archiver-switchover-justification.md, https://github.com/cal-itp/data-infra/tree/main/services/gtfs-rt-archiver]
confidence: medium
---

# GTFS-RT Archiver

## Owner
[[vevetron]], [[tihuang02]]

## Description
Pipeline that archives GTFS Realtime data (vehicle positions, trip updates, service
alerts) from California transit agencies. Downloads raw protobuf responses from agency
GTFS-RT endpoints and stores them in Google Cloud Storage (`gs://calitp-gtfs-rt-raw-v2`).

**Warehouse layer:** Raw / Bronze (lands data as-is)
**Lifecycle stage:** Operate

Runs on Google Cloud Functions (Gen2 on Cloud Run), us-west2. A Cloud Scheduler job
fires every minute, triggering a Google Workflow that dispatches 3 heartbeat events
per minute at 20-second intervals. Each heartbeat reads the download configuration
from GCS and enqueues fetch tasks via Pub/Sub. Worker Cloud Functions download each
feed and save the raw response.

**History:** The current archiver — informally **version 4** — runs on Google
Cloud Run, adopted in the 2026 transition onto Caltrans-supported infrastructure.
It replaced **version 3**, which ran on Kubernetes with a Redis-backed job queue;
earlier versions ran inside the Airflow pipeline. (The "v4" label is informal —
it is not named that in the repo.) The Cloud Run move consolidated monitoring
into Google Cloud's dashboards and simplified support handoff to ADSD. See
Sources for the switchover justification and earlier design docs.

For full technical details (deployment, runbooks, certificate pinning, autoscaling),
see the [repo README](https://github.com/cal-itp/data-infra/tree/main/services/gtfs-rt-archiver).

## Intake
- Download configurations sourced from the [GTFS Dataset table in Airtable
  California Transit base](https://airtable.com/appPnJWrQ7ui4UmIl/tbl5V6Vjs4mNQgYbc).
- Configs downloaded daily by the `airtable_loader_v2` Airflow DAG, written to GCS.
- URL/auth changes made in Airtable; manual DAG execution can speed up propagation.
- Authentication secrets in Google Secret Manager (tagged `gtfs_rt: true`), refreshed
  every 5 minutes.
- (TBD — no formal intake/triage process for upkeep issues yet. Related: #5109.)

## Contract
Consumers of archived GTFS-RT data are the Transit Data Quality (TDQ) and Data
Science (DS) teams, the reports product, and the speed maps product (see
Consumers). They rely on raw RT feeds being captured at 20-second intervals and
archived completely enough to support historical analysis.

A formal, published consumer contract is still being defined alongside the SLA
(#5109).

## Consumers
Downstream teams and products that rely on archived RT data (consumed via the
[[gtfs-rt-parser]]):
- Transit Data Quality (TDQ) team
- Data Science (DS) team — [analysis.dds.dot.ca.gov](https://analysis.dds.dot.ca.gov/)
- [[gtfs-digest-reports-website]] — the reports product, [reports.dds.dot.ca.gov](https://reports.dds.dot.ca.gov/)
- Speed maps product — [analysis.dds.dot.ca.gov/rt](https://analysis.dds.dot.ca.gov/rt/)

Pipeline consumers:
- [[gtfs-rt-parser]] — direct consumer; parses and validates the archived raw protobuf
- [[gtfs-realtime-data-quality]] — RT quality monitoring (via the parser)

## Dependencies
- [[california-transit-database]] — source of truth for agency/feed catalog (Airtable)
- GTFS-RT feed endpoints from California transit agencies
- Google Cloud: Cloud Functions, Pub/Sub, Cloud Scheduler, Workflows, GCS, Secret Manager
- `airtable_loader_v2` Airflow DAG — generates download configurations
- Terraform: `iac/cal-itp-data-infra/gtfs-rt-archiver/us/`

## SLA
**Provisional SLA (draft — being formalized under #5109):**
- *Response:* archiver outages acknowledged within **48 hours** of detection.
- *Resolution:* outages fixed within **72 hours** of detection.
- *Time to recovery:* an outage of 1–2 days is acceptable; longer than a week is
  serious.
- *Uptime:* roughly a week of lost data per year is tolerable.
- *Frequency:* feeds archived at 20-second intervals.

Stated as provisional so consumers and ADSD have a concrete target to react to
while #5109 ratifies it. Still open: the escalation path when the SLA can't be
met, and coordination with ADSD's existing processes.

**Recent actions (from #5109 comments):**
- 2026-05-13: vevetron proposed bringing to Monday meeting to pass to ADSD
- 2026-05-18: vevetron: "Make a product sheet, set up thresholds, and get it back to ADSD"

## Quality
- (TBD — quality monitoring for the current Cloud Functions implementation not
  documented in repo.)
- The older v3 implementation had Prometheus metrics and Grafana alerts (minimum task
  successes, expiring tasks) plus Sentry error reporting.

## Operations
- **Monitoring:** Built into Google Cloud — the archiver is observed through
  Cloud Run's dashboards and Cloud Monitoring, with the monitoring setup defined
  in Terraform. (Sentry and Grafana were removed in the move to Cloud Run.)
- **Alerting:** (TBD — alert routing not yet defined.)
- **Runbooks:** Operational runbooks (restarts, certificate pinning, autoscaling)
  live in the archiver's repo documentation — see Sources.

## Lifecycle
Currently in **Operate** stage. Immediate next steps per #5109: product spec,
thresholds, ownership formalization, handoff to ADSD.
**Last reviewed:** 2026-05-22

## Future Plans
- **Per-feed frequency configuration** — allow some feeds to be pulled at a
  higher frequency than the default 20-second interval, since some agencies
  (e.g. via Swiftly) publish higher-frequency data.
- **Reduce service alert frequency** — archive service alerts about once every
  5 minutes rather than every 20 seconds; they change far less often than vehicle
  positions or trip updates.

## Sources
- [gtfs-rt-archiver service](https://github.com/cal-itp/data-infra/tree/main/services/gtfs-rt-archiver) — `cal-itp/data-infra`
- [GTFS-RT Archiver switchover justification](../raw/articles/gtfs-rt-archiver-switchover-justification.md) — 2026 Cloud Run transition
- [RT Archiver V3 Tech Spec](../raw/articles/rt-archiver-v3-tech-spec.md) — 2022 horizontal-scaling rewrite
- [GTFS RT Archiver Update 6/29/22](../raw/articles/gtfs-rt-archiver-update-2022-06-29.md) — 2022 performance-issue update
