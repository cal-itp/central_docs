---
source_url: file://central_docs/20260501 Data Governance Fundamentals.pptx
ingested: 2026-05-20
description: "Session 1: Data Governance Fundamentals — payments, GTFS data & governance best practices. Presented by Jarvus Innovations (Lori & Nathan Manzotti) for Caltrans."
---

# Data Governance Fundamentals
## Payments, GTFS Data & Governance Best Practices
California Department of Transportation | Jarvus Innovations

### What is Data Governance?
Data governance is the exercise of authority, control, and shared decision-making over the management of data assets.

**Why Data Governance Matters for Transit:**
1. Riders depend on accurate schedule and payment data every day
2. Federal funding (FTA) requires auditable, validated data reporting
3. GTFS data feeds power Google Maps, Apple Maps, and Transit App for millions
4. Payment systems process sensitive financial data subject to PCI DSS
5. Title VI equity analyses require consistent demographic and service data

### Federal Requirements & Mandates
- **FTA Data Requirements:** Grant recipients must maintain data systems supporting financial, asset management (TAM Rule, 49 CFR 625), and safety (PTASP, 49 CFR 673) reporting
- **National Transit Database (NTD):** Mandated by 49 USC 5335. Annual reporting on finances, operations, fleet, safety, and assets
- **Title VI (Civil Rights 1964):** FTA Circular 4702.1B — collect and analyze demographic data for service equity and fare equity
- **ADA Compliance:** 49 CFR Parts 37-38 — data on paratransit, accessibility, complaint tracking
- **OPEN Government Data Act (2019):** Federal agencies must publish data as open, machine-readable, standardized
- **PCI DSS v4.0:** Payment card industry security standards — encryption, access controls, network segmentation
- **OMB Circular A-130:** Federal policy for information resource management, data governance, privacy, security

### Compliance Landscape
| Requirement | GTFS Data | Payment Data | Ridership Data |
|-------------|-----------|--------------|----------------|
| CCPA/CPRA | NA | High | ? |
| PCI DSS v4.0 | NA | Critical | NA |
| FTA/NTD Reporting | ? | ? | ? |
| Title VI | ? | ? | ? |
| ADA Compliance | ? | ? | ? |
| OPEN Data Act | Medium | ? | ? |

(Impact Levels: Critical = mandatory compliance risk, High = significant governance need, Medium = relevant, Low = limited, NA = not applicable)

### Data Governance Roadmap (4 Phases)
**Phase 1 — Foundation:** Identify executive sponsor/CDO, establish Data Governance Council, conduct data asset inventory, define data classification policy, identify critical data domains (GTFS, payments, ridership, financial)

**Phase 2 — Implementation:** Assign data owners & stewards per domain, deploy/update metadata management tools, develop/refine data quality metrics & dashboards, establish PCI DSS controls for payment data

**Phase 3 — Maturation:** Build data catalog across all domains, automate compliance reporting (NTD, Title VI), establish data lifecycle & retention policies, conduct DCAM maturity assessment

**Phase 4 — Optimization:** Continuous quality monitoring & improvement, advanced analytics on governed data, cross-agency data sharing frameworks, regular policy reviews & updates, annual maturity reassessment

### Key Takeaways
1. Data governance is foundational in mature organizations & regulated industries. Funding, rider safety, and public trust depend on governed data
2. Governance requirements vary by data domain — GTFS and Payments have different governance requirements
3. Frameworks provide a blueprint & baseline — DAMA-DMBOK, DCAM, and NIST give proven structures
4. Start small, build iteratively — phase your governance program: foundation first, then implementation, maturation, and optimization
