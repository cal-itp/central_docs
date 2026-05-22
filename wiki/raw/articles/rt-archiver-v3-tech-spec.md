---
source_url: https://docs.google.com/document/d/1AEMe52McFtrBa-fwmoecMU_DBmJ6clSwjWNbgTQR8IQ/edit
ingested: 2026-05-22
sha256: a0dceb59765b98afc431d25adeda41b0c3276b1511901fd567d9085f85d61f99
description: 2022-07-11 technical specification for the V3 RT archiver rewrite (Redis + huey + Kubernetes)
---

# RT Archiver V3 Tech Spec

Status
Draft
Scope
Data services
Stakeholders
hunter@calitp.org
Tasks served
Data Services Deliverable 5 - RT Pipeline
Data Services Deliverable 6 - Performance Metrics and Data Archive
Author
Andrew Vaccaro and Laurie Merrell
Date
2022-07-11
Executive Summary
We’ve reached the limits of vertical scaling with the existing code and the next logical step is moving to many smaller consumers coordinated by a task queue framework. We plan to implement a horizontally-scalable system using Redis to coordinate a single ticker and multiple stateless consumers.
Background Context
As described in GTFS RT Archiver Update 6/29/22, the GTFS-RT archiver has been hitting performance constraints in late June and early July 2022. As we have added new RT URLs, the current archiver has not been able to maintain sufficient throughput. 

Even with the resource increases implemented on 6/29 (described in the linked document), the archiver has continued to have performance issues leading to degraded data availability. For example, on July 7 (UTC) we achieved only 4,301 “ticks” (99.5% of the desired 4,320), and more importantly we lost significant data during the 2300 hour UTC (red missing data in the upper left is due to a brand new URL that was added in the 1300 hour; red and yellow on right edge is genuinely missing):
 
We have reached a point where adding new URLs seems to lead to data loss, particularly for larger feeds.

Further, our ability to monitor and mitigate these issues is severely hampered by the limited visibility that we have with the current architecture. We turned off most logging in the archiver earlier this year when we discovered that the logging was competing for resources with the core scraping functionality. As a result, performance did temporarily improve, but we have limited ability to monitor core performance indicators, except through proxy measures. 

Additionally, we were planning to make at least limited updates to the archiver anyway, because updates are required to keep the RT pipeline in sync with the GTFS Schedule Pipeline Proposal - May 2022. (Specifically, the archiver needs to be reworked to consume Airtable instead of agencies.yml.)

This confluence of factors has led us to the conclusion that a fundamental rewrite of the RT archiver is a necessity at this stage. It is not viable to keep trying to throw more resources at the current architecture; we need to shift to a more sustainable, horizontally-scalable framework to unblock the Schedule Pipeline work already underway. 
Goals
- Consume Airtable as input configuration, replacing agencies.yml
- Facilitate horizontal scaling of the fetch/write workers
- Stateless, generic consumers of tick events
- Facilitate collection of telemetry data (metrics, logs, and traces)
- Pin the ticks to wall clock
- Save data using partitioned keys, improving consumer performance
Non-Goals/Out of Scope
- Substantial business logic changes
Guiding Principles
- Generic, stateless consumers
- Leveraging Kubernetes for worker scaling and orchestration
- Utilize libraries/frameworks to the fullest extent possible

Proposed Solution
Current Architecture
Ticker
GCS
Python
queue
sleep(20) in between ticks
Worker
Worker
Worker
Worker
Worker
Stateful workers, 1 per N URLs.
Thread manager
agencies.yml

Proposed Design Diagram

Ticker
GCS
Redis
Every 20 seconds on the XX:00, XX:20, and XX:40
Consumer

Worker
Worker
Worker
Consumer

Worker
Worker
Worker
Consumer

Worker
Worker
Worker
Airtable JSONL
Implementation
The new implementation will rely on huey, a lightweight task queue that can use Redis as a storage medium which allows us to distribute huey consumers in a Kubernetes environment.

The new logic is roughly as follows.
- Every 20 seconds, the ticker creates N tasks, one per N configured URLs to fetch.
- These N URLs will be sourced from the latest extract of the Airtable gtfs_datasets table rather than from agencies.yml
- These tasks are serialized into a Redis LIST
- Consumers (aka fetchers) check the LIST and pop off tasks to complete
- Each consumer can run an arbitrary number of processes/threads/greenlets to parallelize
- Individual workers process one fetch at a time
- They download an RT feed file from one URL
- Then, they write that one feed file to a hive-partitioned key in GCS

I’ve been testing an MVP implementation that hits the same vehicle positions URL 1000 times per tick, with 8 consumer pods each running 32 worker greenlets. Throughput is satisfactory, as we’re able to process all 1000 fetches within 20 seconds. Latency is a bit fuzzier; running locally will differ drastically from a deployed application so I’m hesitant to make performance claims for latency.

This architecture also has positive cost implications; we can rely on smaller, cheaper nodes as well as scale down during periods of lower volume, such as overnight and weekends.

Airtable-based configuration
Part of this refactor includes sourcing URLs from Airtable rather than agencies.yml, similar to the v2 schedule downloader. We plan to have the v2 archiver automatically restart nightly (based on Pacific time) to re-load the Airtable URLs, which has a few benefits.
- It simplifies the application logic; the application just needs to load its configuration at start vs separate thread(s) to load changing data
- It syncs up Schedule and RT data to use the same Airtable config over the course of a business day; this will lessen cases where new RT data is scraped before its associated schedule data (which occasionally happens under the current architecture and causes issues for validation and general data labeling and joins)
- It provides a buffer for fixing/finalizing Airtable data entries during the day
- Currently, we don’t have a problem since agencies.yml is versioned and managed via PR reviews; Airtable has fewer guardrails
Task time estimates
- Turn MVP ticker and consumer into production-ready code - 1 week
- Deploy ticker, consumers, and Redis into k8s cluster - 1 week
- Adjust metrics and logging as necessary - 2-3 days
Alternatives/Tradeoffs
Continuing to vertically scale/optimize the existing code
The existing code was developed as part of a pilot data pipeline, and as such the scale of the inputs were much smaller. The considerations that were used to inform the existing code’s design have since evolved, along with the scale of the inputs themselves. We’ve gone through a couple rounds of performance tuning,  (i.e. disabling logs, vertical scaling); we’re now running on 16-core instances which should be entirely unnecessary for this application. Spreading work across many small nodes will substantially reduce the actual complexity and difficulty of the application code. In our opinion, this approach is not sustainable and will likely result in us revisiting rewrite discussions in the intermediate future. We risk falling victim to the sunk-cost fallacy as such. 
Rewrite in a similar architecture (i.e. single pod)
We could also perform a rewrite of the same architecture but using a language like Go which would allow us to write efficient networking/multi-processing code much more easily. This was an early consideration, but as we’ve gone through other rewrites (RT parsing/validation, schedule), we are increasingly confident that we can leverage similar patterns and keep ourselves in the Python ecosystem as much as possible. 
Success criteria
We will aim to optimize the V2 archiver such that all distinct URLs are considered equally important (regardless of physical size, Cal-ITP relevance/interest, agency context), and RT files are archived at least 99% of the time across all of the distinct URLs. 

SLO

For the SLO, we recommend measuring the following (and potential implementation mechanisms): 
- Requests issued per expected ticks * url - 99%
- Structured logs
- Outcomes per request - 99%
- Structured logs
- Of status=200 outcomes, files exist - 99%
- Checking GCS files
- Question: what is our expected actual RT file availability overall?
- Question: Are we OK with nightly restarts to reload Airtable-based URL configs?
- RT file availability
- We propose measuring this by calculating the proportion of non-empty RT files per tick, to all ticks that occurred within a period minus the number of 5xx error requests encountered per url-tick tuple within the same period.
- The recommended period is 24 hours.
- Our SLO can be assessed by taking rolling 1 - 3 days of the daily proportion defined in a. Infractions to be counted on an hourly basis.
- Or SLO assessed by taking monthly averages of the proportion defined in a.
- The assessment methodology depends on how often Cal-ITP wants to evaluate system performance.
Technical (internal) success
- Ability to monitor the following performance metrics
- Latency i.e. the time between a tick and successful fetch of a feed
- Gap between canonical tick time and request issued
- Gap between request issued and response received
- Gap between 200 response received and file written 
- Variability i.e. the standard deviation of latency
- Throughput i.e. how many feeds/bytes per second we can handle
References
- https://huey.readthedocs.io/en/latest/
- https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7
- https://opentelemetry.io/

Feedback:
Investigate managed Redis vs. Kubernetes pod
- Document Redis use case accordingly. Explicitly label its purpose as a component to archiver V3 to prevent utilization within other pipeline services.
