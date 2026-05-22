---
source_url: https://docs.google.com/document/d/1AJYCKfFOZQEqPaOkxznQ7ePaXzt71xZu3AlBd9eA_F0/edit
ingested: 2026-05-22
sha256: 5c5bd4c6bee3d9d8ce0dec3281e8c8c795e31f43c33d13bc1eb273e505d11d21
description: 2023-01-17 analysis of v2 warehouse architecture and GTFS-RT data availability and cost
---

# v2 Architecture/Cost & RT data availability

Jan 17, 2023 / By Andrew Vaccaroand Laurie Merrell (mostly Laurie)
Data availability 
Data availability for our purposes is comprised of three distinct components: 

- Raw data – what has been backfilled in raw Google Cloud Storage format, in the correct file location with v2 metadata
- “Backfill” here means copying a file to a new location, adding metadata, etc.
- Costs here are incurred by a copy operation and duplicate storage 
- Processed data - what has been processed (validated/unzipped/converted from proto to JSONL) into a “final” Google Cloud storage format, suitable for querying via BigQuery
- “Backfill” here means running an Airflow job on newly-copied raw data files
- Costs here are incurred by the Airflow processing time and duplicate storage 
- Warehouse data - what is available in the warehouse / what has been processed in dbt. Two flavors: 
- Views (note that this is a generic warehouse/database term and has nothing to do with our v1 “GTFS/payments views” terminology): 
- Point directly at external tables (data is not materialized separately in BigQuery table)
- For GTFS, requires a filter (date) 
- ~ Expensive to query (and test in dbt) but cheap to build
- Views are generally appropriate for for “raw” data that is going to only be accessed infrequently and in specific (usually temporal) slices 
- For example, current implementation of speed maps where you need very granular data but for one day at a time
- “Backfill” for views are covered by the processed data backfill; no separate backfill needed
- Unique costs here are incurred when a query (either an ad-hoc, human-initiated query or a downstream dbt model) accesses the data
- Not very Metabase friendly, especially for things like full raw RT data 
- Tables: 
- Materialized in warehouse
- ~ Expensive to build but cheap to query
- Tables are generally appropriate for:
- Data where aggregation or additional modeling work has been done (for example fact daily trips) 
- Data that is going to be accessed very often
- Data that is accessed by different types of labels / temporal levels
- Small data that is cheap to materialize 
- “Backfill” here means re-generating the table with more history (reading more raw data and then re-materializing in BigQuery) 
- If this is required for RT data, we may have to push some of the processing out of BQ for performance & cost
- Unique costs are incurred here every time the table is built (i.e., daily dbt run, and higher costs for backfill full-refresh runs), and then lower cost for queries 
- More Metabase friendly
Implications:

- For data that is accessed infrequently, we can spin up views relatively cheaply & easily. They may be slow / relatively expensive to access but they will incur low ongoing costs.
- For specific use cases, we could potentially explore materializing specific slices of the data as an ad-hoc table once parameters are decided (ex. “All vehicle positions data for one single day.”) 
- For data that will be accessed regularly, we can try to figure out ways to efficiently materialize as a table, but for things like RT trip updates (~150 GB of data every day), generating long term history will always be expensive.  
- RT aggregations (ex. trip IDs observed) will likely need special handling and some things will need to be pushed upstream into Airflow; data services will need lead time and very specific schema requests. 
Current v2 availability by data type 

Data
Raw
Processed
Warehouse (views)
Warehouse (tables)
GTFS schedule data
2021-04-16
2021-04-16
2021-04-16
2021-04-16
GTFS schedule validations
2021-04-16
2021-04-16
2021-04-16
2021-04-16
Airtable data 
2022-06-29; could backfill, see below
2022-06-29; could backfill, see below
2022-06-29; could backfill, see below
2022-06-29; could backfill, see below
GTFS RT data 
2022-09-15; could backfill, see below
2022-09-15; could backfill, see below
2022-09-15; could backfill, see below
Variable, available from different points in December
GTFS RT validations
2022-09-15; could backfill, see below
2022-09-15; could backfill, see below
N/A
Mid December

Backfill options:
- Airtable: 
- Raw data starts 2022-01-27. 
- There’s little/almost no cost implications to backfill, but the data is also very likely less accurate. 
- GTFS RT: 
- We have some raw data starting in July 2021. 
- A bug present July-October 2021 had caused new agencies.yml feeds added during that time to not get picked up by the old archiver until October 2021, and archiver stability improved markedly in January of 2022, so if we want to backfill may want to consider only backfilling from Jan/Feb 2022. 
- If we backfill ~250 days of processed data using the most robust process, it should end up costing us around 250*($15+$5) = ~$5000.
- Each jobs pool node costs $0.17 per hour; a full hour of v2 RT processing costs approximately one hour of compute spread across a couple nodes (based on average task time multiplied by CPU requests). It’s hard to estimate network/storage costs but I assume a majority of daily spend (~$23) is from processing and not the archiver itself. 
- For warehouse tables, hard to estimate cost; for one trip updates table, it’s ~$5/week. 
Action items/questions
- What time period of RT data do we want to backfill?
- Processed (incl. warehouse views)
- Warehouse tables: What analyses do analysts anticipate doing over long historical windows? 

Appendix
General data ingest architecture

BigQuery cost model
There are two basic cost structures for BigQuery.
- On-demand pricing
- $5 per TB of data queried regardless of the slot time spent on queries; this means we can keep our costs low by refreshing data only as needed and processing as much as possible incrementally.
- Flat-rate pricing
- If we consistently spend $1500+ a month on BigQuery, we can switch to flat-rate pricing; the minimum purchase quantity is 100 slots which is $2000/month with a monthly commitment or $1700/month with a yearly commitment.

GTFS data materializations
- Schedule data (dim_*) and aggregations (fct_daily_* and similar)
- Mart models materialized as tables, data volume is relatively small and the data model is trivially incremental because of our feed versioning. Makes for efficient queries. Full refreshes (i.e. “backfills” in dbt) can be moderately expensive for stop_times and shapes, but it’s fine as long as we aren’t doing it regularly.
- RT data (fct_*_messages)
- Mart models must be built on top of partition-required external tables. We can probably materialize service alerts, but definitely not vehicle positions (~ 23 GB/day) or trip updates (~150 GB/day).
- RT aggregations & validations
- Aggregations on top of RT data are harder. Vehicle positions are probably OK to aggregate incrementally in dbt temporarily, but trip updates probably needs to be processed via Airflow. It’s substantially cheaper to do transforms pre-BigQuery, and our v2 keying means these aggregations can occur efficiently at the feed level for arbitrary joining and grouping in BigQuery.
- We’ll need to modelstorm some building blocks to support many analyses without a proliferation of analysis-specific transform DAGs.

Examples of possible analyses
- Historical speed data analysis
- Likely individual days, will utilize partition elimination
- RT vs. Schedule trips
- This could sit on top of an aggregation transformation we do via Airflow
- Trip updates statuses
- fct_daily_trip_update_status_counts was created for storm impact analysis and demonstrates the need for aggregation upstream
Architecture questions
- For data services to figure out: Do we need a more efficient storage format or structure for RT?
- Should we just go straight from protos to summarizations as a parallel DAG?
