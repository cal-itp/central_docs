---
source_url: file://central_docs/California Transit Database
ingested: 2026-05-20
description: "Original product spec for California Transit Database. Owner: Evan Siroky."
---

Owner: Evan Siroky
Responsibilities: Managing user accounts, annual Airtable license renewal, ensuring data stewards maintain quality.

Contract: The California Transit Database serves as a critical component of the DDS Data Pipeline and Warehouse that catalogs all transit agencies, the services they manage, and the GTFS data they publish.

Consumers: Downloaded nightly via API from Airflow DAGs. Downstream: GTFS Schedule Downloader, GTFS-RT Archiver, dbt and data pipeline.

SLA: Available for viewing and edit access during business hours. Data updated in realtime for transit agencies, services, and GTFS data. Annual NTD ID review.

Lifecycle: Exists since Cal-ITP inception. May eventually map to Salesforce data.
