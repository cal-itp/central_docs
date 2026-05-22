---
source_url: https://docs.google.com/document/d/1IGQ3Vd6s99iKKGFMOhKhHbSvVZmZuesCn22aAzhQbFc/edit
ingested: 2026-05-22
sha256: 9ab86e09811bf0af3522af8b214ac0d6e26760771fee67eaf8057caf086fb02d
description: 2022-06-29 status update on GTFS-RT archiver performance issues and immediate mitigation options
---

# GTFS Archiver Issue

Jun 29, 2022
TL;DR
On Jun 27, 2022 we started seeing unusual memory consumption patterns in the RT archiver, which historically have been associated with decreased data availability. We have been experimenting and investigating since then (details in Appendix) and have come to the conclusion that the existing archiver could no longer consistently download the current number of GTFS-RT feeds. We would like guidance on what immediate-term mitigation strategies are preferred by Cal-ITP; options are outlined in the following section. We are working on design options for medium- and long-term mitigations, which will involve actually updating the archiver code. Once those options are ready, we will present them as well. 

Please be advised that our team took immediate action by increasing hardware resources. This change can be reverted if there are concerns with it as a short-term solution. 
Proposed Immediate Action
- Increase hardware resources

The crux of the performance constraints the RT archiver is experiencing is that of compute resources. While the scale of URLs scraped by the system has increased both in terms of quantity and feed size, the allocation of corresponding compute resources has not. Ideally, this will ultimately be addressed by scaling compute resources horizontally - such that multiple instances of the RT archiver service could operate simultaneously to stratify the throughput experienced by the system. This capability will require considerable redesign and development of the core software. In lieu of this undertaking, we have scaled compute resources vertically by upgrading the number and speed of CPU cores. This change took effect at 11:55 AM PST on June 29, and we are closely monitoring the impact. It is forecasted that this change will result in an increase of $450/month of the total Google Cloud Platform infrastructure expense.

If it is determined that the hardware upgrade yielded desirable results, we suggest persisting these changes as we develop a roadmap to incorporate horizontal scaling capabilities. In either case, the compute resources supporting the RT archiver will inevitably incur increased costs in order to support the expansion of the system. 

If the above is not effective or if the associated costs are deemed prohibitive, we could potentially explore one of the following in addition or instead: 

- Decrease the number of feeds being scraped

Consistent with the previously mentioned consideration of total URLs scaped and feed size, it may be beneficial to decrease the number of feeds being scraped. Our recommendation is to deduplicate the scraping behaviors resulting from MTC. Currently, ~30 instances of the same feed are scraped as a result of the source URL to agency mapping currently implemented. While there are efforts to address this mapping paradigm underway, we could immediately remove the duplicate instances and consolidate the impact downstream. This results in approximately 14% of all compute resources corresponding to redundant outputs. This duplication is in place to ensure that we have MTC data tagged with each relevant ITP ID. We could explore putting in some work downstream to pull out the relevant MTC data for each individual agency from the aggregated download, rather than downloading each feed separately. However, there is some risk that we cannot reconstruct everything; not all RT messages may be actually labeled by agency. 

Another consideration is to temporarily suspend the scraping of lower priority feeds. If there are sources that are not pertinent to the Cal-ITP project’s immediate interest or retrospective capabilities, such that permanent data loss (est. period of 1 week), we could pause the scraping of those sources and observe the impact it has on the performance of the remaining sources.

- Increase scraping interval 

As a means to reduce overall system throughput, an experimental approach is to simply scrape less. We currently scrape at 20 second intervals, and any increase in this interval would result in less samples of real-time positional data, but may result in increased reliability of the system’s ability to consistently retrieve the data. While in place, this option would prevent us from evaluating the data against the CA Minimum Guideline regarding data updates every 20 seconds.
Proposed Intermediate Action
- Prioritize RT Archiver development

Due to the decrease of the system’s reliability and increasing limitations around occasional tweaks of the existing service, our team has prioritized the development of this system component.

- Facilitate series of design meetings

Starting 6/29/2022, the Data Services Team will facilitate a series of internal, technical design meetings to develop a comprehensive assessment of the specific technical requirements to support the growing scale of the RT archiver.

- Produce technical specifications of proposed rewrite for review & approval by Cal-ITP stakeholders

The evaluation resulting from design meetings and root cause analyses will inform the design we propose to Cal-ITP stakeholders. This process is expected to last a few weeks as we iterate through feedback.

- Distill work into modular issues

The resulting planned work will be scoped into issues fulfilled by data and analytics engineers from the Data Services team, and iteratively prioritized against other work in an agile fashion.
Proposed Future Action
- Rewrite RT Archiver
The details of what exactly a rewrite will entail will be informed by a series of design meetings and iterative improvements. Ultimately, we will be aiming to develop a version of the archiver service that is horizontally scalable.


Appendix - Investigation 
June 27
Starting on Jun 27, 2022, we started seeing unusual memory consumption patterns in the RT archiver, which have historically been associated with decreased data availability:  
Grafana dashboard showing spike / valley patterns in memory use by the RT archiver on Jun 27, 2022; line color corresponds to pod; this data is available in real-time

Data availability on Jun 27, 2022 – note that this dashboard only populates on a day’s delay based on when our warehouse tables run, so this visibility is not available real-time; the large block of red corresponds to the new feeds added in PR #1591 (they were added in the 1400 UTC hour, so did not exist before); note that this hourly chart uses UTC time; this portion of the chart shows the feeds with the least files written – see the dashboard for the full view, including many feeds (especially smaller feeds) that did not lose data

Based on the timing of memory spike onset, we believed that they were associated with PR #1591 which added several new RT URLs (this timing alignment is well illustrated by the data availability Metabase chart above). 

The afternoon of the 27th, we tried a few amelioration tactics:

- Manually restarting the pod – did not help (this corresponds with the colors changing on the chart above)
- Reverting the PR with the new URLs (under the theory that perhaps one of the new feeds had unusual data that was overwhelming the archiver somehow) – also did not help 

We have encountered similar issues before, which we were able to fix by increasing the memory limit for the archiver. At the time that the issues began, the memory limit for the archiver was set to 640MB. We decided that on Jun 28, 2022 we would remove the memory limit and see if the archiver found a peak that seemed sustainable, and then we would reset the limit accordingly. We wanted to have two days’ worth of data to compare (one with the limit and one without) to assess the situation.
June 28

When we removed the limit, the issues simply persisted:

Grafana dashboard showing spike patterns in memory use by the RT archiver on Jun 28, 2022with memory limit removed; line color corresponds to pod

Data availability on Jun 28, 2022 when memory limit was removed– note that this dashboard only populates on a day’s delay based on when our warehouse tables run; note that this hourly chart uses UTC time; this portion of the chart shows the feeds with the least files written – see the dashboard for the full view, including many feeds (especially smaller feeds) that did not lose data

This pattern indicated to us that the issue is not the memory limit itself (i.e., it’s not that the archiver can’t hold all of one “tick”’s worth of data in memory) but that we are running into an issue with data throughput; the archiver is no longer able to write data quickly enough before the next round of data comes in. We have observed this manifesting itself through network socket behavior, in which the number of open sockets is growing faster than the number which can be processed & closed in the same period.

This understanding drives the options identified above; in the immediate term, while longer-term mitigations are implemented, we want to stabilize data collection as much as possible.  
Appendix - History & Considerations
Logging & visibility
One of the key issues with troubleshooting the current archiver is that we have very limited logging. We previously identified that verbose logging was taking so many resources that it was significantly impacting archiver performance, so we have set a very low level of logging. 

This same consideration (resource competition with the actual archiving functionality) has made us hesitant to implement Prometheus metrics under the current archiver architecture. Essentially, we think that implementing anything that would give us greater visibility into the performance of the current archiver carries too great a risk of negatively impacting performance. This is another issue that we think requires a substantial refactor to address. 

Data increases
The amount of data that the archiver is handling has steadily increased over time. 

URL count

Data from query:
SELECT date, COUNT(url) as url_count, COUNT(DISTINCT url) as distinct_url_count
FROM `cal-itp-data-infra.views.gtfs_rt_fact_daily_feeds`
GROUP BY date
ORDER BY date DESC

File count

Data from query:
WITH dt_format AS (
 SELECT *,
 EXTRACT(DATE from calitp_extracted_at) as date
 FROM `cal-itp-data-infra.views.gtfs_rt_fact_files`
)

SELECT date, COUNT(1) as files
FROM dt_format
GROUP BY date
ORDER BY date DESC

Data size

Data from query:
WITH dt_format AS (
 SELECT *,
 EXTRACT(DATE from calitp_extracted_at) as date
 FROM `cal-itp-data-infra.views.gtfs_rt_fact_files`
)

SELECT date, (SUM(size) / POWER(10,9)) as total_file_size_gb
FROM dt_format
GROUP BY date
ORDER BY date DESC
