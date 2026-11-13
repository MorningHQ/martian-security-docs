# Use the Attack Library and coverage views

> Explore catalogued techniques, distinguish runnable coverage from reference material and understand the current Threat Intel view.

Source: [Web version](https://docs.martiansecurity.ai/library/coverage/)

> **Page qualification:** Current beta console · viewer, member, admin, owner · Verified 2026-11-13 · Isolated local QA; named HTTP/catalogue walkthrough. [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

Find the techniques relevant to your agent and understand what Martian can execute in the current catalogue. The expected result is a clearly scoped assessment selection, with unsupported techniques and declared gaps kept visible.

## Before you start

Any signed-in tenant role can inspect **Attack Library** and **Threat Intel**. **Member** or above is required to launch an assessment from an approved agent. Catalogue entries, taxonomy mappings and prior findings do not by themselves authorize testing or certify compliance.

## Explore technique coverage

1.  Open **Attack Library**. Inspect its catalogue statistics and coverage matrix rather than treating every listed item as a runnable test.
2.  Use the available taxonomy view, such as **MITRE ATLAS** or **OWASP**, to inspect the published classification. Framework mappings organize material; they are not a compliance assessment or an exhaustive guarantee.
3.  Open a technique and read its supported surface, outcome and current coverage. A technique marked unavailable remains disabled for execution.

![MT-01 technique detail with In the library and enabled Add to assessment](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/library-coverage.png)

MT-01 is in the runnable library. Its illustrative payload and taxonomy labels describe a technique, not an observed finding or compliance verdict.

The observed catalogue offered **MT-01 Direct instruction override** as **In the library**, with **Add to assessment** enabled. **MT-20 Session hijack** was a **Declared gap**, with that action disabled. These are catalogue states, not findings about the teaching target.

The source-visible **Add to assessment** shortcut opens the wizard’s Tests step in **By technique** mode with that technique selected. Confirm the preselection, then review Environment, Agent and Goals before launching. This shortcut is separate from the manually selected path below and was not independently exercised in the recorded catalogue walkthrough.

![MT-20 Session hijack declared gap with Add to assessment disabled](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/library-gap.png)

MT-20 remains a Declared gap. Its disabled Add to assessment action keeps reference coverage separate from runnable tests.

4.  In **New assessment → Tests → By technique**, search by name, ID or surface and choose available techniques that match the authorized target. Confirm the final selected count and actual budget before **Start assessment**.
5.  After a run, compare requested scope with **Probe coverage** and actual target attempts. Catalogue membership and a selected checkbox do not prove execution or successful verification.

## Understand the source of the catalogue

The customer Attack Library reads the stored Backend technique and published-attack catalogue. It is not a live mirror of the researcher Wiki. A selected compatible scenario can use published Wiki material, while review/submission and customer execution remain separate workflows.

Do not treat a newly discussed or submitted Wiki case as automatically available in this customer catalogue. If expected content is missing, ask your operator which reviewed catalogue/scenario revision is available in your environment.

## Read Threat Intel accurately

1.  Open **Threat Intel**.
2.  Read **No live feed connected** when shown. Current catalogue statistics and declared gaps are reference/coverage context; this screen does not establish a running external threat-ingestion feed.
3.  Follow an actual assessment’s retained findings/evidence to investigate a fleet signal. Use [history and exports](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md) to locate the underlying run.

![Threat Intelligence explicitly says No live feed connected](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/library-threat-intel.png)

The workspace reports No live feed connected. Published-attack statistics provide catalogue context and do not establish live threat ingestion.

## Verify and recover

Refresh the catalogue, repeat the intended search and check that the displayed selection corresponds to the same available technique IDs. A missing catalogue/error state needs service or publication repair; do not substitute invented coverage. An uncovered technique, no findings or an empty feed is not evidence that the agent is secure or no relevant attack exists.

Continue with [configure an assessment](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/configure.md) and [interpret reproduction and coverage](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/reproduction-and-limits.md).
