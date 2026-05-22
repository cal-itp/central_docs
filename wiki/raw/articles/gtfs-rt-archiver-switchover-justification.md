---
source_url: https://caltrans.sharepoint.com/:w:/s/DOTPMPHQ-DDSContractors/IQAypQTgsLxIRafp-Nnm_euIASUqrB8RYI9xToJEphGdIy0
ingested: 2026-05-22
sha256: 737858aaa2ae11b0b1e7c8f7d9b2bbea4401aa81f7af4b754dc5fdd7f8a2034d
description: 2026-04-29 justification and staging validation for transitioning the GTFS-RT archiver from Kubernetes to Cloud Run
---

# GTFS-RT Archiver Monitoring and Upgrades

April 29, 2026

Summary
Caltrans DDS processes GTFS and GTFS-RT for transit agencies across California. As part of this processing, the DDS Airflow data pipeline downloads GTFS schedule files on a daily basis. GTFS-RT files are fetched and stored once every 20 seconds by the GTFS-RT Archiver service. The Airflow data pipeline does not support running operations on a 20 second interval. As a result, this fetch and storage operation must be performed outside the data pipeline.
Background
The first GTFS-RT Archiver ran inside the Airflow data pipeline. Starting in 2022, Slalom and Jarvus rewrote the GTFS-RT archiver to run in a Kubernetes cluster. In 2023, contractors again rewrote the archiver to run using a Redis-backed job queue called Huey. Each of these rewrites were accompanied by data validation and cost projection phases. Slalom and Jarvus also introduced Grafana, Prometheus, and Sentry to monitor the GTFS-RT archiver’s runtime properties and report on errors. In 2024, Caltrans hired Ministry of Velocity and Jarvus to migrate the data pipeline and associated services into Caltrans supported IT infrastructure, control costs, and improve monitoring.
GTFS-RT Archiver Transition
The goal of transitioning support to Caltrans involved an across-the-board review of services and data pipeline components. Caltrans, working with Ministry of Velocity and Jarvus, decided that the best way to support this transition was to transition services previously running in Kubernetes to running in Cloud Run. Cloud Run monitoring is built into Google Cloud’s dashboards.

Production GTFS-RT archiver costs, including managed Prometheus/Grafana on April 23

Staging GTFS-RT archiver costs, including increased debug logging on April 23

GTFS-RT Archiver Validation
During the transition to Cloud Run, Ministry of Velocity and Jarvus collaborated to develop the archiver informed by prior work. The archiver now includes a full suite of automated tests, written in a test driven development style, covering end-to-end functionality of the archiver’s fetch and storage functionality. Validating each type of data depends on its properties: service alert JSONL files were compared 1:1, trip updates were compared in BigQuery by querying the fct_observed_trips table, and vehicle positions have been compared by Transit Data Quality team members.

Maintenance and Operations
Caltrans Application Development and Support Division (ADSD) will be supporting DDS’s existing Cloud Run services, such as Metabase. Migrating the GTFS-RT archiver to Cloud Run means that ADSD will only need to monitor two types of environment, Airflow and Cloud Run, rather than adding Kubernetes, Grafana, Prometheus, and Sentry into the mix. Ministry of Velocity has also included error runbooks in the GTFS-RT archiver’s documentation, based on the foundation Jarvus provided.
Rollout Plan
The Cloud Run GTFS-RT archiver will be deployed simultaneously with the Kubernetes GTFS-RT archiver. First, the Cloud Run archiver will be deployed, then the team will verify that the Cloud Run archiver is running, and finally the Kubernetes archiver will be shut down.

Verification of the GTFS-RT Archiver in Staging
To verify that the Cloud Run GTFS-RT archiver works as expected, it’s been running in our data-infra-staging environment.  We’ve also turned on the Airflow parse_and_validate_rt job on the data it produces to simulate what we’d see in production.
There have been a few minor configuration issues to scale up the memory in airflow to match the power of our production instance.  There is also a parse bug around 4/19 but this is likely due to the transition.  Overall it’s been working as expected since 4/19.
We copied over some GTFS-RT validation dashboards into Metabase Staging which are running on data in the staging environment.  These results look consistent with the GTFS-RT production validation dashboards (Figures 1, 2)
These two dashboards: full counts, mismatches, do a direct comparison of fct_observed_trips counts and seems to show more data for a few of our agencies (AC Transit, TritonTransit, lax flyaway) in staging than which appear in production.   For some agencies this is expected but for others we aren’t sure why at the moment.  Metrolink RT was only showing up in production and not in staging but that has been fixed in a recent PR.  This dashboard does something similar but omits where the counts are the same.
A visual verification of vehicle positions data from `fct_vehicle_positions_messages` for SBMTD at noon on 2026-04-25 looks exactly the same (898 points each, Figure 3).
Service Alerts (dashboard) seem to show similar or more results for staging then for prod.  There appear to be alerts for some agencies in staging not appears in prod but likely due to processing times.  Looking at this again today (4/30) 
I think there is high confidence that the new archiver is producing acceptable data.
Figure 1 (metabase-staging):
Figure 2 (metabase prod):

Figure 3
Figure 4

------------- ------------- ------------- ------------- ------------- -------------
Final checks on 4/30 of the most recent data:

https://metabase.dds.dot.ca.gov/question/5362-how-do-service-alerts-compare-between-staging-and-prod
Service alerts counts seem to be very similar between staging and production for the days leading to the rollover.

These two files by count are very similar but not exactly the same for 4/29
https://metabase.dds.dot.ca.gov/dashboard/98-v2-pipeline-gtfs-rt-files-hourly-view-by-day?date_filter=past1days
https://metabase-staging.dds.dot.ca.gov/dashboard/12-v2-pipeline-gtfs-rt-files-hourly-view-by-day?date_filter=past1days

fct_observed_trips counts are sort of the same for 04-29-2026 except for Metrolink, which was fixed on 4-29 in a PR.
https://metabase.dds.dot.ca.gov/question/5357-which-trip-updates-feeds-have-a-different-observed-trip-count-between-staging-and-production

https://metabase.dds.dot.ca.gov/question/5356-how-do-fct-observed-trips-counts-compare-between-staging-and-prod
Seeing slightly different but acceptable results with this dashboard for 4-29.
