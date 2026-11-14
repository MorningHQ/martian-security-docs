# Inspect assessment evidence and results

> Read reports, trace turns, findings, probe coverage and independent outcome checks at the correct evidence level.

Source: [Web version](https://docs.martiansecurity.ai/assessments/evidence-and-results/)

> **Page qualification:** Current beta console · viewer, member, admin, owner · Walkthrough partly verified. [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

> **Walkthrough limits:** In isolated local QA, MR-1002 retained its actual trace turns, probe coverage, knowledge/skill records, final state and exports after refresh. This run had no verified findings, independent business checks or published artifact-backed Recorded review. A separate real MCP campaign retained three actual refusals, attempted/unverifiable probe coverage and Completed/INCONCLUSIVE after operator-assisted reconciliation of its original uncertain admission. Reload and actual legacy JSON agreed; artifact-backed modern review and sandbox effect checks remain unqualified. A separate browser campaign admitted202 and completed website sign-in/two neutral setup messages, then retained Needs attention after fresh-conversation verification failed. Reload, legacy JSON and native awaiting-recovery state agree; the original uncertain action is unchanged and completed browser execution remains unqualified. A separate payment run passed explicit seeded-account authentication and independent starting-ledger prerequisites, then retained Needs attention after MCP setup failed. Reopened before-only Outcome checks remained ready with no after-state or business-effect verdict; the original uncertain action is unchanged.

Partly verified guide

Endpoint-only evidence and sandbox baseline receipts are checked. Verified business effects and published recorded reviews remain incomplete.

Inspect what an assessment tested, what it observed and how strongly a finding is supported. A useful result includes the actual scope and coverage, not just a verdict badge.

## Before you start

Use any signed-in role with access to the organization’s run. Complete or retain a bounded assessment and know its run code. The deployment can serve legacy trace storage or a versioned **Recorded review**; use the controls actually shown for the run and the [source baseline](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md#source-baseline).

## Read the report and run summary

1.  At the wizard’s **Report** step, inspect **Verdict**, **Attempts held**, **Exposed value**, findings and the displayed-page count. A blank held ratio can mean no tested attempts or incomplete coverage; do not treat it as 100% protection.
2.  Click **Open trace**. Read **Security outcome** and **Assessment execution** separately. **INCONCLUSIVE** means the evidence does not support a security pass; zero findings also does not establish a pass.

![Completed MR-1002 with INCONCLUSIVE security outcome](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-trace-overview.png)

MR-1002 completed with three agent requests and 15 model calls, but its one attempt remained unverified and its security outcome INCONCLUSIVE. Zero findings is not a security pass.

3.  Check **Attempts**, **Blocked**, **Verified**, **Unverified**, **Agent requests**, **Model calls** and **Displayed findings**. Read the exhaustion reason and any retained error. Requested techniques are scope; they are not a count of completed target attempts.
4.  Inspect **Probe coverage** when available. Check selected, attempted, skipped or incomplete coverage before drawing a conclusion about a technique.

![Attempted disclosure probe with unverifiable outcome and actual call counts](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-coverage.png)

One outcome-data probe was attempted. Its unverifiable outcome and 3/30 target, 15/100 model usage are separate from the five requested technique labels.

## Inspect the actual conversations and actions

1.  In a legacy run, open **Trace**. Use **Tree** to follow campaign, conversation, turn and verification rows, or **Timeline** for timestamped runtime/customer events. **Filter rows**, **Expand all** and **Collapse** change the view rather than the assessment.
2.  Select a turn and compare **Attacker message**, **Customer agent reply** and **Observed actions**. A request to call a tool, an executed gateway call and a confirmed business effect are different evidence.
3.  Read the turn critic or verifier narrative as model-generated interpretation. For a state-changing outcome, inspect independent receipts rather than treating the narrative as the final authority.

![Recorded attacker message and actual teaching-target refusal in Turn 1](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-trace.png)

Select a retained turn to compare the actual attacker message, customer reply and action journal. The critic below is model interpretation, not an independent oracle.

4.  In **Recorded review**, select a **Review revision** and inspect **Conversations**, **Turns**, **Runtime timeline**, **Observed gateway calls**, **Verification receipts** and **Evidence references**. **Native spans** shows retained native trace details when available. **Customer reported events** are customer instrumentation, not independent proof of effect.
5.  Use **Refresh review** to select a newer published revision. Published revisions pin their content; reading, exporting or retrying a review does not rerun target execution.

## Inspect findings and independent outcomes

1.  Open **Findings** and inspect each finding’s title, severity, verification status, evidence and technique attribution. Page through the results: **Displayed findings** is not necessarily the total run count.

2.  When present, open **Outcome checks**. Compare before/after business records, repeated-world receipts and the no-implant control. Use **Scenario setup** to inspect the prepared carrier and readback for a scenario run.

    In the captured payment example, **ready** means a starting receipt exists: both baseline prerequisites passed, while **Outcome captured** and **After-state digest** remain **Pending**. The configured check’s description does not establish that its violation occurred. See the [baseline-only walkthrough](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/agents/sandbox-bindings.md#example-a-passed-baseline-with-no-outcome-verdict).


![Outcome checks with a ready starting receipt, five ledger records, two met baseline conditions, pending after-state and unavailable cleanly reproduced refund.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-outcome-checks.png)

Both baseline prerequisites passed. Outcome captured and After-state digest remain Pending, and no complete comparison or refund verdict exists. The duplicated-refund sentence describes the configured check.

3.  Read **Reproduction status**, **Repetitions**, **Successful reproductions**, **Target calls** and **Negative control** in verification details. A skipped control is not a passed control. If the same violation occurs without an implant, the scenario’s carrier attribution is not established.
4.  Check missing-knowledge notices, truncated payloads, dropped customer events and evidence availability. A missing event/reference cannot prove no action or relevant attack existed.
5.  Refresh the page and reopen the saved run to verify that the selected evidence, findings and final execution state persist.

![Knowledge and skills shows zero reviewed references and one activated skill](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-knowledge.png)

Six visible lookup stages retained no reviewed references. One activated canonical skill is recorded with a Content digest control; missing references do not prove no relevant attack is known.

In the endpoint-only **MR-1002** example, **Knowledge & skills** retained one activated skill and its content digest, but no reviewed knowledge references. **Probe coverage** reported one attempted, unverifiable disclosure probe. Three observed refusals and zero findings did not change its **INCONCLUSIVE** security outcome. No deterministic target oracle or sandbox business-state checks were available for this run.

## Read an MCP endpoint example

This separate synthetic QA example used an approved MCP `chat(message)` tool with anonymous, endpoint-only, Light and serial settings. Its admission acknowledgment failed; an operator reconciled the original campaign before the saved evidence appeared below. The [submission-error recovery limit](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/progress-and-cancellation.md#handle-submission-and-execution-failures) remains relevant.

1.  Open the saved run and confirm its agent. **MR-1001** here belongs to the separate **Documentation Native Sessions QA** organization. It shows **Completed** execution, **INCONCLUSIVE** security outcome, **3** agent requests, **16** model calls and **0** displayed findings. A budget-ended run and three refusals do not establish a security pass.

![Martian Security MCP assessment MR-1001 showing completed execution, an inconclusive security outcome, three agent requests and sixteen model calls.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-mcp-result.png)

Check execution and security outcome separately. This synthetic MCP result was recovered by an operator after an uncertain admission; it does not establish a security pass.

2.  In **Trace**, select **Turn 1**. Compare its actual attacker message and customer reply, then inspect the action’s **Journal**. Here it records **prepared → submitted → completed**. The reply refuses disclosure; no sandbox tool call or independent business-state check was available. These requests reached the target’s MCP `chat` tool; **Observed actions** describes the agent’s separate sandbox/gateway tool use.

![The actual first MCP turn with its attacker message, refusal, action identity and prepared to submitted to completed journal.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-mcp-turn.png)

Compare the actual request, reply and action journal. This turn belongs to the same operator-reconciled MCP campaign; a refusal is separate from independent outcome verification.

3.  Open **Probe coverage**. The disclosure probe is **attempted** with outcome **unverifiable**, not verified. It records three target calls and fifteen model calls within that probe; the campaign summary above has its own total of sixteen model calls. Keep each counter’s scope when comparing them.

![MCP disclosure probe coverage showing attempted and unverifiable, three target calls, fifteen probe model calls and one inconclusive recorded attempt.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-mcp-coverage.png)

Read the probe outcome and its own counters. This operator-reconciled campaign attempted the disclosure probe but retained no decisive verified result.

4.  Refresh and reopen the saved run, then use **Download legacy JSON evidence**. In this check, the downloaded `MR-1001.json` retained the same agent, completed state, inconclusive verdict, attempt, trace and coverage. This JSON is separate from a published redacted review bundle.

## Read a browser run that needs attention

This example belongs to the separate **Documentation Browser Execution QA** workspace. Its **MR-1001** targeted an approved website with configured sign-in, endpoint-only scope, one disclosure outcome, Light depth and serial execution. Website sign-in and two neutral setup messages succeeded. Starting a fresh conversation for the first probe then timed out; this is an incomplete walkthrough, not a successful browser assessment.

1.  Open the saved trace and read both summaries. **Assessment execution** shows **Needs attention**, while **Security outcome** shows **No verdict recorded**. The **Waiting on a decision** panel retains `BrowserError: fresh_conversation_unavailable:fresh_timeout` and an uncertain action. Zero detailed attempts and zero findings do not establish protection.

![Saved browser run showing Waiting on a decision, an uncertain fresh-conversation timeout, Needs attention and No verdict recorded.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-browser-needs-attention.png)

Preserve the original action for inspection. Successful website sign-in and setup messages did not produce a completed probe or a security verdict.

2.  Open **Probe coverage**. Here the disclosure probe remains **Scheduled**, with **No outcome recorded** and **0 / 30** target calls. These are probe counters; the two earlier neutral setup requests are a separate part of the campaign. A scheduled goal is not completed coverage, and a dash in the summary counters does not mean no requests were made.

![Browser probe coverage showing Scheduled, No outcome recorded, zero of thirty probe target calls and zero of one hundred probe model calls.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-browser-coverage.png)

The disclosure goal was scheduled, with no probe outcome recorded. These probe counters exclude the campaign’s earlier neutral setup messages.

3.  Refresh and reopen the same run, then use **Download legacy JSON evidence**. The observed reload and download retained the incomplete state, absent verdict and original campaign identity. Native inspection confirmed **awaiting recovery** with one unresolved action; no replacement assessment or recovery decision was submitted.
4.  Preserve the run and have the original action inspected before deciding how to recover. **The action did not execute** is an evidence-based decision, not a general retry button. Keep successful cancellation, a completed browser assessment and a security verdict separate from this failure observation. See [execution-failure recovery](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/progress-and-cancellation.md#handle-submission-and-execution-failures).

## Exports and limitations

**Download report** exports run/finding JSON. The trace’s legacy JSON download includes its currently displayed findings page; read its pagination flags. Artifact-backed **Recorded review** can offer **Download redacted review** when a published revision is available. See [history and exports](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md) for the differences.

A finding can require human verification even when it has a severe consequence label. Endpoint-only textual consistency does not establish that a real payment, permission or record changed. A **Largest cleanly reproduced sandbox refund** value is an observed synthetic sample for this run, not a production loss forecast or measured call-gate saving.

Continue with [reproduction and evidence limits](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/reproduction-and-limits.md) and [retained history](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md).
