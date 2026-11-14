# Find recorded runs and export reports

> Use Assessments, Findings, Reports and Replay to inspect persisted history and choose the appropriate export.

Source: [Web version](https://docs.martiansecurity.ai/assessments/history-and-exports/)

> **Page qualification:** Current beta console · viewer, member, admin, owner · Walkthrough partly verified. [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

> **Walkthrough limits:** Actual retained Assessments/Replay filtering and refresh, Reports JSON, legacy finding-page JSON, modern domain JSON and a published revision with redacted turn/detail reads passed. Four redacted ZIP reads returned503 without an archive; ZIP download/inspection remain unverified.

Partly verified guide

Run/domain JSON downloads and on-screen redacted review are checked. The review ZIP download remains unverified.

Find a recorded assessment after leaving its wizard, inspect retained evidence and download the right report. These history and replay actions read existing work; **Replay** does not execute the assessment again.

## Before you start

Use any signed-in role with access to the organization and know a run code or agent name. Reports require a retained finished run. Some historical records can have terminal evidence without a recorded end timestamp; do not invent a completion time.

## Find and inspect a run

1.  Open **Assessments** to browse saved runs. Use the search/pagination controls and inspect the requested scope, security outcome and execution state.
2.  Open **Replay** to explore recorded assessments. **Filter displayed runs** filters the rows currently shown; use the supplied collection search and pages for broader history. The execution-state and sorting controls change the selection, not the run.

![Replay filtered to recorded MR-1002 with Completed and INCONCLUSIVE labels](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-replay.png)

Filter displayed runs narrowed this loaded page to MR-1002. Selecting its run code reads retained evidence; Replay does not execute it again.

3.  Select the intended **run code**, or its open-run arrow. Check the run code and agent before reviewing evidence. Open the appropriate trace/review section and retain its evidence revision when relevant.
4.  Open **Findings** for recorded security observations, then follow the associated assessment to inspect its evidence. A title/severity alone is insufficient for verification.
5.  Refresh the browser and reopen the run. Confirm the final execution state, recorded verdict and retained evidence are still available.

## Choose an export

1.  Open **Reports**, locate the finished run on the displayed assessment page and click **Download**. The file is JSON evidence, not a generated PDF. It includes safe run metadata, coverage summary and all retrieved findings for that run.

![Reports lists completed and failed synthetic assessment evidence](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-reports.png)

Download selects JSON evidence for the matching run code. MR-1002 retained INCONCLUSIVE; the earlier rejected MR-1001 has no verdict.

2.  From the wizard’s **Report** step, **Download report** also retrieves the run’s findings for a JSON report.
3.  In a legacy trace, **Download legacy JSON evidence** contains the currently displayed findings page plus `findings_page` and `findings_may_have_more`. Do not treat this narrower export as the full finding catalogue.
4.  In a modern run, **Download domain outcomes** retains the domain result summary. A published artifact-backed **Recorded review** can separately offer **Download redacted review** for a revision-pinned ZIP. A live source or unsupported snapshot selection can disable that download until a published revision is available.
5.  Inspect the downloaded file locally: confirm the run code, agent, state, verdict and evidence/coverage scope match the UI. Save it under your organization’s retention policy and keep any synthetic/private content within its approved audience.

| Export | Contains |
| --- | --- |
| **Reports → Download** | Run metadata, coverage summary and retrieved findings |
| **Download domain outcomes** | Domain result, runtime summary and finding-page flags |
| **Download redacted review** | Published review content under the selected policy |

**Native spans** are read separately from the review ZIP.

## Example: check a modern run and its downloads

This separate example uses **MR-1010** in **Documentation Browser Execution QA**, with a synthetic HTTP target built to check review capture and redaction. Follow the steps with your own retained run. The example’s **INCONCLUSIVE** result is not a production security assessment.

1.  Open **Assessments** and select your run code to see the full summary. Here, **MR-1010** shows **Completed** execution, **INCONCLUSIVE** security outcome, **12** agent requests, **44** model calls and **0** displayed findings. Open **Probe coverage** below the summary to inspect the tested scope.

![MR-1010 full assessment summary with Completed execution, INCONCLUSIVE security outcome, twelve agent requests, forty-four model calls and zero displayed findings.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-modern-result.png)

Open the run from Assessments for the full counters. Probe coverage is selected below the summary; completed execution and zero findings do not establish a security pass.

2.  Use **Download domain outcomes**, then find the same run in **Reports** and click its **Download**. Both actual JSON downloads in this example retained the same run, agent, execution state, verdict and start/end times. Neither file contained the Recorded review’s turn content.
3.  In **Recorded review**, check **Review revision**, open **Turns** (**Turns (12)** here) and select a turn. The first turn’s **target response** shows **redacted · credential\_scrubbed** and `[REDACTED]` in place of the fixture’s token-shaped test string. Check the exported-content status and byte counts when reading an excerpt.

![First retained turn with redacted target response, credential\_scrubbed status, exported byte counts and twelve loaded turn records.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-modern-redacted-turn.png)

The actual target response contains \[REDACTED\] instead of the fixture’s token-shaped test string. The critic rationale is model interpretation. This on-screen read does not establish a successful ZIP download.

4.  Keep the counts and coverage separate. This revision has **2 conversation records** and **12 turn records**; those are different retained record types. It also shows **Review delivery: persisted**, **Native delivery: complete** and **Native span coverage: pending**. Current delivery and the coverage frozen into a review revision answer different questions.

The JSON downloads and redacted turn reads passed in this example. **Download redacted review** returned `review_provider_wait_exceeded` without producing a ZIP, so archive download and inspection remain unverified. A published revision and a readable turn do not establish that its ZIP downloaded successfully.

## Failure and recovery

If **Refresh review** still offers no published revision, ask your workspace owner or Martian operator who manages review publication. Include the run code, displayed review revision/status and error, without credentials or private payloads. Refresh reads availability; it does not publish an artifact. Keep the available run/legacy JSON as its separately described evidence scope; it is not a substitute for a published redacted review ZIP.

-   **No finished reports on this page** may mean your current page/filter contains no terminal run. Search or page to the intended run; it does not establish that all organization history is empty.
-   A failed download should retain an error. Retry the read after checking service/evidence availability; downloading does not justify starting a new assessment.
-   `review_provider_wait_exceeded` can appear even when **Review delivery** says **persisted**. Preserve the displayed revision and retry the read after availability recovers. **0 loaded · 12 retained records** beside a read error means the page has not loaded those records; it does not mean the review is empty.
-   Missing retained content or expired artifact custody cannot be reconstructed by a screenshot of an old report. Keep the availability limitation visible.
-   Imported history reflects its original execution and evidence. It does not prove that the current deployment executed that run.
-   The modern redacted bundle, domain JSON and legacy JSON have different scopes. Redaction and an export filename are not substitutes for checking what the file actually contains.

Continue with [evidence and results](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/evidence-and-results.md) or [configure a new assessment](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/configure.md) when you intentionally need new execution.
