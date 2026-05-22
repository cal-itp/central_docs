---
title: Analyst Development Environment
summary: Analytics environment for DDS analysts
created: 2026-05-20
updated: 2026-05-20
type: entity
subtype: data-product
tags: [environment, intake]
sources: [raw/issues/data-infra-5317-product-docs-epic.md]
confidence: low
---

## Owner
(TBD)

## Description
The development environment used by DDS analysts to query data, build analyses,
and prototype new data products. Likely includes Jupyter, Metabase, or similar
analytics tooling with access to the data warehouse. New analyses here often
become candidates for the [[data-product-lifecycle]] intake queue.

**Warehouse layer:** Consumption / Semantic
**Lifecycle stage:** Operate

## Intake
(TBD)

## Contract
(TBD)

## Consumers
- DDS analysts
- (TBD: other teams?)

## Dependencies
- [[dbt-data-processing]] — for curated mart data
- Data warehouse infrastructure

## SLA
(TBD)

## Quality
(TBD)

## Operations
(TBD)

## Lifecycle
(TBD)
**Last reviewed:** (TBD)
