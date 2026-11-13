# Follow progress and stop a run

> Track an admitted assessment, distinguish execution from security outcome and handle cancellation or uncertain submission.

Source: [Web version](https://docs.martiansecurity.ai/assessments/progress-and-cancellation/)

> **Page qualification:** Current beta console · member, admin, owner · Walkthrough partly verified. [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

> **Walkthrough limits:** MR-1002 was followed from running to retained completion. The original MR-1003 HTTP530 action remains uncertain and untouched. A separate MCP campaign executed despite an initial HTTP503; public refresh200 left the error unchanged, and one operator-assisted reconciliation restored its original completed/inconclusive evidence. Positive cooperative cancellation remains unverified.

Partly verified guide

Run progress and completion have been checked. Successful cancellation and recovery from an uncertain target action are not yet verified.

Follow the run Martian actually admitted and stop further work when appropriate. Success means you can identify the retained run, its final execution state, available evidence and any unresolved action requiring attention.

## Before you start

Any tenant user can inspect an accessible run. **Member**, **Admin** or **Owner** is required to request a stop. Start with an authorized bounded assessment from the [configuration guide](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/configure.md). Keep the run code; do not assume a lost browser response means nothing was submitted.

## Follow the admitted run

1.  On **Run**, record the run code and status. Review **Requested techniques**, **Seed** and **Requested scope**.
2.  Click **Open trace**. The live run view refreshes every five seconds and retains separate **Security outcome** and **Assessment execution** summaries.

![MR-1002 running with Open trace and Stop run controls](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-running.png)

The acknowledged MR-1002 run shows its five requested techniques. Open trace follows execution; the header Cancel leaves the wizard.

3.  Inspect agent requests, model calls and execution limits. A queued/submitted state is not proof that the downstream target or model executed. Missing or incomplete evidence must remain visible.
4.  Use **Refresh evidence** when you need the current projection from the existing runtime campaign. This does not start another assessment. After a submission error, an unchanged result can still require operator inspection; refresh is not proof that no work was admitted.
5.  When execution ends, reopen the run from **Assessments** or **Replay**, refresh the browser and confirm the same run code, state and retained results. The wizard advances to **Report** for terminal completed, failed, incomplete or stopped runs.

## Request cancellation

1.  In the wizard’s Run step, click **Stop run**. In an eligible live trace, the corresponding action is **Request stop**.
2.  Confirm the visible cancellation-request state. Martian must reconcile the runtime before a final stopped state is known; an acknowledgment alone is not proof that all work stopped.
3.  Wait for the retained execution state and inspect any in-flight result that completed before cancellation took effect. A stop cannot undo an already issued target request or business action.
4.  Refresh and reopen the same run. Check final execution, retained findings/evidence and any recovery notice. Do not count an unfinished or inconclusive run as a security pass.

The local QA cancellation attempt did not establish a successful stop: **MR-1003** reached **Needs attention** before its stop control could be used, after its teaching tunnel returned HTTP 530. The retained target action remained uncertain. No replacement execution or invented response was used to resolve it; positive cooperative cancellation remains unverified for this walkthrough.

![MR-1003 Needs attention with an uncertain teaching-tunnel action](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-needs-attention.png)

An HTTP 530 left one action uncertain before cancellation could be requested. The recovery panel requires evidence; no response was invented and no replacement execution resolved this action.

## Handle submission and execution failures

Needs attention can hide an admitted campaign

An admission error can appear even while the original campaign is executing. In a real MCP QA run, a downstream HTTP 503 left the console at **Needs attention** while the runtime made three target requests. **Refresh evidence** returned successfully without updating that record; an operator reconciled the same campaign afterward. Keep the run code and page URL, and ask for inspection before starting another assessment or cleaning up its target.

| Situation | Recovery |
| --- | --- |
| Starting the assessment / acknowledgment lost | Use **Retry saved assessment**. It confirms the saved request identity rather than creating a new intent. |
| Submission or scenario preparation in progress | Inspect and synchronize the original run first. Control can be refused while admission or scenario preparation is being committed. |
| Run failed or timed out | Read the recorded error and coverage. Fix the actual prerequisite, then explicitly configure a new bounded run when appropriate. |
| Run incomplete or needs attention | Preserve its ID and inspect the retained evidence/recovery notice. If refresh leaves the submission error unchanged, ask your operator to inspect the original campaign. The console’s ended message does not independently establish that downstream execution stopped. |
| Connection changed or was revoked | Have an Owner/Admin verify the intended target and approval. An old run may still require inspection against its original runtime identity. |
| Historical imported record | Inspect its retained original evidence. It has no new runtime campaign here to cancel. |

The wizard’s header **Cancel** leaves configuration; it is not the runtime **Stop run** action. Keep execution state separate from the security verdict and [review what the evidence establishes](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/reproduction-and-limits.md).

Next: [inspect results and evidence](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/evidence-and-results.md) or [find a retained run and export it](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md).
