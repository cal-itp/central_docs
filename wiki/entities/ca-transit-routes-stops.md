---
title: California Transit Routes and Stops
summary: Publishes a stable reference of CA transit routes and stops on the Open Data Portal
created: 2026-06-04
updated: 2026-06-04
type: entity
subtype: data-product
tags:
  - data-product
sources: []
confidence: medium
---


## Owner
[[eric-dasmalchi]]

## Description

A stable and recent reference for transit across California. Not a data quality tool nor should it be used for specific trip planning.

**Lifecycle stage:** operate 

## Intake
How requests and bugs are triaged. (TBD)

## Contract

CA Transit Routes and CA Transit Stops include all routes and stops respectively from each agency without a confirmed gap of over 4 months in GTFS Schedule data.

## Consumers

Planners at Caltrans or partner agencies, interested general public, DDS staff making maps, Maintenance, Traffic Operations, Mobility Data Standards Engineer (Uriel), CARB policy analysts

## Dependencies

[[gtfs-schedule-download-parse]]

Data Warehouse ([fct_monthly_routes,](https://dbt-docs.dds.dot.ca.gov/#!/model/model.calitp_warehouse.fct_monthly_routes) [fct_monthly_scheduled_stops](https://dbt-docs.dds.dot.ca.gov/#!/model/model.calitp_warehouse.fct_monthly_scheduled_stops),[bridge_gtfs_analysis_name_x_ntd](https://dbt-docs.dds.dot.ca.gov/#!/model/model.calitp_warehouse.bridge_gtfs_analysis_name_x_ntd)
)

## SLA

### Freshness target 

Updated at least monthly. Update sent to DRISI Geospatial Enterprise Operations Branch by the 7th day of the month. Content will be based on previous month GTFS, except for agencies with a confirmed gap spanning the entire previous month. In that case, content for those agencies will be based on the most recent available month in the previous 4 months. 

If we learn that an agency has ceased operation permanently, we will suppress that agency’s data from publication even if 4 months have not yet elapsed. This happens automatically when feeds are deprecated and removed from the data quality pipeline, see [bridge_gtfs_analysis_name_x_ntd]([dbt Docs](https://dbt-docs.dds.dot.ca.gov/#!/model/model.calitp_warehouse.bridge_gtfs_analysis_name_x_ntd))

### Reliability target 

Data that is missing from CA Transit Routes or CA Transit Stops for agencies with > 50 VOMS are fixed and filled within 2 weeks of discovery so long as the agency did not have a confirmed data gap. If this data is also missing in the Data Warehouse ([fct_monthly_routes,](https://dbt-docs.dds.dot.ca.gov/#!/model/model.calitp_warehouse.fct_monthly_routes) [fct_monthly_scheduled_stops](https://dbt-docs.dds.dot.ca.gov/#!/model/model.calitp_warehouse.fct_monthly_scheduled_stops)), collaborate with Transit Data Quality on resolution. 

Agencies with a confirmed data gap spanning over 4 months may be dropped from CA Transit Routes or CA Transit Stops. The 4-month lookback period is intended to give time for Transit Data Quality to identify and work with agencies to fix gaps upstream, so this situation should be rare. 

In the extraordinary case that long-term gaps would result in a publication dropping more than 5% of stops/routes compared to the prior 6-month average, publication will be held until the cause is determined. This is approximately the size of AC Transit. 

Available continuously subject to Caltrans Geoportal, California Open Data Portal reliability.

## Quality
Check at least 95% of stops/routes are present compared to the prior 6-month average, hold publication and investigate if not.

## Operations
Runbook, incident log, alert routing. (TBD)

## Lifecycle

Only product on the Open Data Portal with this broad scope, maintain for the foreseeable future.

## Sources
- (link the raw/ source pages and external docs this is drawn from)
