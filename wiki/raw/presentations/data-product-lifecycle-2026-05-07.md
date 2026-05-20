---
source_url: file://central_docs/20260507 Data Product Lifecycle.pptx
ingested: 2026-05-20
description: "Session 2: The Data Product Lifecycle — achieving governance through operating practice. 8-stage lifecycle for data products at Caltrans DDS. Presented by Jarvus Innovations."
---

# The Data Product Lifecycle
## Achieving Governance Through Operating Practice
California Department of Transportation | 2026

### Stage 3: Design for Reuse
Analytics product patterns across the full development lifecycle:

**INGESTION & TRANSFORMATION**
- Batch ELT: Scheduled extracts into raw/bronze, then dbt-style transforms through staging to marts
- Streaming: Event-driven pipelines for real-time aggregation and alerting
- CDC: Change data capture for incremental loads and audit trails
- Reverse ETL: Push curated data back into operational systems and CRMs

**MODELING & SERVING**
- Semantic Layer: Single metric definitions shared across all consumers and dashboards
- Feature Store: Reusable ML features with versioning and point-in-time correctness
- Data APIs: Contracted endpoints exposing curated datasets to apps and partners
- Domain Marts: Star/snowflake tables shaped for specific business domains

**CONSUMPTION & FEEDBACK**
- Dashboards: Self-serve BI with governed metrics and role-based access
- Embedded Analytics: Insights surfaced directly inside operational applications
- ML Pipelines: Training, scoring, and monitoring loops
- Usage Telemetry: Track adoption and data quality signals to drive product iteration

**Design Gate:** For each pattern, define the owner, consumer contract, SLA, and data classification before building.

### Stage 4: Build Through the Warehouse/Lakehouse
- **SEMANTIC / SERVING:** Source of truth. Dashboards point here.
- **MARTS / GOLD:** Business logic. Consumer-shaped and contracted.
- **STAGING / SILVER:** Cleaned, typed, deduped, and schema-enforced.
- **RAW / BRONZE:** Land as-is. Schema-on-read. Append-only.

### Stage 5: Quality as Build-Time Evidence
Validation catches failures before consumers see them:
- SCHEMA: Types, nulls, uniqueness
- VOLUME: Row counts in expected range
- FRESHNESS: Max updated_at within SLA
- BUSINESS: Logic checks (e.g. fare > 0)
- RECON: Warehouse total = Source total
- ANOMALY: Change vs. trailing average

### Stages 6-7: Publish and Defend the Contract
**PUBLISH CHECKLIST:**
- Catalog entry registered
- Contract (schema/SLA) published
- Role-based access configured
- Runbook written for on-call
- Deprecation policy stated

**OPERATIONS CHECKLIST:**
- Freshness & Volume alerts — immediate signal when the contract breaks
- Incident log maintained — audit trail of what broke and why
- Quarterly review — re-validating the consumer set and SLA

### Stage 8: Evolve Deliberately, Retire Cleanly
DETECT → DECIDE → NOTIFY → MIGRATE → ARCHIVE
A product can be deleted only after consumers know the replacement path and the catalog preserves the trail.

### The Governance Payoff
| Lifecycle Action | Governance Evidence |
|------------------|---------------------|
| Intake Log Triage | Visibility into demand, roles, and resource equity |
| Product Spec Canvas | Metadata standards, semantic definitions, and sensitivity |
| Warehouse Layers | Architecture standards and access control evidence |
| Contracts & SLAs | Stewardship proof and compliance-by-design |
| Tests as Code | The automated Data Quality dashboard |
| Incident Logs | The audit trail for lifecycle management |

### Case Study: Ad-Hoc vs Lifecycle Mode
**BEFORE:** Director DMs urgent ask → one-off SQL → numbers disagree → schema break → budget meeting exposes breakage → 2 weeks of cleanup
**AFTER:** Request lands in intake queue → existing products identified → analyst pulls contracted metric → schema alert fires internally → regression test added & fixed → answered in 1 hour

### Scenarios
1. **Reports Site Migration:** Two products, overlapping consumers — should they merge?
2. **New Payment Processor:** MVP built, consumers asking for more integration — intake should have happened before design
3. **dbt Tests Off Since October:** Alert fatigue without specs — anchor every test to a named Product Spec, tier (P1 vs P3), route accordingly

### Phased Approach
**Phase 1 — Foundational:** Stand up central intake queue. Inventory current top 5 outputs. Score against 5-Attribute Test.
**Phase 2 — Productize the Core:** Write Specs for top 5 outputs. Add schema, freshness, and volume tests. Register in catalog.
**Phase 3 — Operationalize:** Publish SLAs and runbooks for top 5. Start incident log. Present quality metrics to Council.
