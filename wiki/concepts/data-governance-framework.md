---
title: Data Governance Framework
created: 2026-05-20
updated: 2026-05-20
type: concept
subtype: framework
tags: [data-governance]
sources: [raw/presentations/data-governance-fundamentals-2026-05-01.md]
confidence: high
---

# Data Governance Framework

The framework presented by Jarvus Innovations (Session 1, May 2026) establishing
the "what" of data governance for Caltrans DDS.

## Definition
Data governance is the exercise of authority, control, and shared decision-making
over the management of data assets.

## Federal Mandates
- **FTA Data Requirements:** Financial, asset management (TAM Rule, 49 CFR 625),
  and safety (PTASP, 49 CFR 673) reporting
- **National Transit Database (NTD):** 49 USC 5335 — annual reporting on finances,
  operations, fleet, safety, assets
- **Title VI:** Demographic data for service equity and fare equity analyses
- **ADA Compliance:** Paratransit, accessibility, complaint tracking
- **OPEN Government Data Act (2019):** Open, machine-readable, standardized data
- **PCI DSS v4.0:** Payment card security — encryption, access controls, audit logging
- **OMB Circular A-130:** Information resource management policy

## Critical Data Domains (for Caltrans)
1. GTFS Data — handled by products like [[gtfs-schedule-download-parse]] and [[gtfs-rt-archiver]]
2. Payment Data
3. Ridership Data — collected by [[ridership-data-collection]]
4. Financial Data

Each domain has different governance requirements and compliance obligations.

## 4-Phase Roadmap
1. **Foundation:** Sponsor, Council, inventory, classification, critical domains
2. **Implementation:** Owners & stewards, metadata tools, quality dashboards, PCI DSS controls
3. **Maturation:** Data catalog, automated compliance reporting, lifecycle/retention policies, DCAM assessment
4. **Optimization:** Continuous monitoring, advanced analytics, cross-agency sharing, annual reassessment

## Relationship to Product Lifecycle
Session 1 defines the governance *goals* (what should be). Session 2 defines the
[[data-product-lifecycle]] — the operating practice (how we work) that achieves those
goals as a byproduct. Governance asks: "Who decides, what rules apply, and how do we
prove it?" The lifecycle answers through everyday artifacts: specs, contracts, tests,
and incident logs.
