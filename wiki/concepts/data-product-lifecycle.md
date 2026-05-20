---
title: Data Product Lifecycle
created: 2026-05-20
updated: 2026-05-20
type: concept
subtype: framework
tags: [product-lifecycle, data-governance]
sources: [raw/presentations/data-product-lifecycle-2026-05-07.md]
confidence: high
---

# Data Product Lifecycle

The framework presented by Jarvus Innovations (Session 2, May 2026) for
operationalizing data governance through product management. The core insight:
design the workflow so the proof of governance is produced as the work happens.

## The 8 Stages

1. **Intake** — Requests land in a queue. Visibility into demand, roles, and resource equity.
2. **Discover** — Write specs for what exists. Understand the consumer set.
3. **Design for Reuse** — Choose patterns (batch ELT, streaming, reverse ETL).
   Define owner, consumer contract, SLA, and data classification BEFORE building.
4. **Build Through the Warehouse** — Layer: Raw/Bronze → Staging/Silver → Marts/Gold → Semantic/Serving.
   Layer determines rules, owners, and access.
5. **Quality as Build-Time Evidence** — Schema, volume, freshness, business,
   reconciliation, and anomaly tests. Tests as code = automated quality dashboard.
6. **Publish** — Catalog entry, published contract, role-based access, runbook, deprecation policy.
7. **Defend (Operate)** — Freshness & volume alerts, incident log, quarterly review.
   Operating the product produces the audit trail automatically.
8. **Evolve/Retire** — DETECT → DECIDE → NOTIFY → MIGRATE → ARCHIVE.
   RETIREMENT IS A STAGE — a product can be deleted only after consumers know the replacement path.

## Governance Payoff
Every lifecycle action produces governance evidence:
- Intake log → demand visibility
- Product spec → metadata standards, data classification
- Warehouse layers → architecture standards, access controls
- Contracts & SLAs → stewardship proof, compliance-by-design
- Tests as code → automated quality dashboard
- Incident logs → audit trail

## Phased Adoption (for Caltrans DDS)
**Phase 1 — Foundational:** Stand up central intake queue. Inventory top 5 outputs.
Score against 5-Attribute Test.
**Phase 2 — Productize:** Write specs for top 5. Add schema/freshness/volume tests.
Register in data catalog.
**Phase 3 — Operationalize:** Publish SLAs and runbooks. Start incident log.
Present quality metrics to Council.

## Key Insight (from Case Study)
The same team in lifecycle mode can answer a request in 1 hour that took 2 weeks in ad-hoc mode.
The difference: intake queue → existing products identified → contracted metric → internal alert → regression test.

## Relationship to Governance
This lifecycle operationalizes the [[data-governance-framework]] defined in Session 1.
Governance asks: "Who decides, what rules apply, and how do we prove it?" The lifecycle
answers through everyday artifacts — specs, contracts, tests, and incident logs. Each
stage produces the evidence the governance council needs as a natural byproduct of
doing the work.
