# Follow progress and stop a run

> Track an admitted assessment, distinguish execution from security outcome and handle cancellation or uncertain submission.

Source: [Web version](https://docs.martiansecurity.ai/assessments/progress-and-cancellation/)

> **Page qualification:** Current beta console · member, admin, owner · Walkthrough partly verified. [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

> **Walkthrough limits:** Run progress and completion were checked. In a separate QA workspace, queued MR-1003 admitted202 and Stop run200 on the same campaign; native cancellation finalized with no target/model work or unresolved recovery. Evidence sync200, full-page refresh and JSON export retained Stopped/INCONCLUSIVE and original identities. Cancellation after execution begins and resolution of the earlier HTTP530 uncertain action remain unverified. The separate MCP original admission/reconciliation and browser fresh-conversation failure records remain unchanged.

Partly verified guide

Queued cancellation and retained results have been checked. Stopping work already in progress and resolving an uncertain target action are still being verified.

Follow the run Martian actually admitted and stop further work when appropriate. Success means you can identify the retained run, its final execution state, available evidence and any unresolved action requiring attention.

## Before you start

Any tenant user can inspect an accessible run. **Member**, **Admin** or **Owner** is required to request a stop. Start with an authorized bounded assessment from the [configuration guide](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/configure.md). Keep the run code; do not assume a lost browser response means nothing was submitted.

## Follow the admitted run

1.  On **Run**, record the run code and status. Review **Requested techniques**, **Seed** and **Requested scope**.
2.  Click **Open trace**. The live run view refreshes every five seconds and retains separate **Security outcome** and **Assessment execution** summaries.

![MR-1002 running with Open trace and Stop run controls](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-running.png)

The acknowledged MR-1002 run shows its five requested techniques. Open trace follows execution; the header Cancel leaves the wizard.

Browser example: Running precedes the execution result

An approved browser target also passes through the real **Run** step. This separate example reached **Running** after admission, with its five requested techniques visible. The later [browser failure example](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/evidence-and-results.md#read-a-browser-run-that-needs-attention) explains why it did not become a completed assessment.

![The admitted browser assessment MR-1001 showing Running, five requested techniques, Open trace and Stop run.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-browser-run.png)

Running confirms admission to the runtime. This browser example later needed attention; the selected techniques do not establish completed coverage.

3.  Inspect agent requests, model calls and execution limits. A queued/submitted state is not proof that the downstream target or model executed. Missing or incomplete evidence must remain visible.
4.  Use **Refresh evidence** when you need the current projection from the existing runtime campaign. This does not start another assessment. After a submission error, an unchanged result can still require operator inspection; refresh is not proof that no work was admitted.
5.  When execution ends, reopen the run from **Assessments** or **Replay**, refresh the browser and confirm the same run code, state and retained results. The wizard advances to **Report** for terminal completed, failed, incomplete or stopped runs.

## Request cancellation

1.  In the wizard’s Run step, click **Stop run**. In an eligible live trace, the corresponding action is **Request stop**.
2.  Look for **cancellation requested** or **Stop requested**. The run may still show **Queued** or **Running** while Martian reconciles the runtime. Keep following the same run while that request is reconciled.

![The queued MR-1003 showing cancellation requested after the Stop run action.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-stop-requested.png)

Stop requested acknowledges the intent. The run still shows Queued while cancellation is reconciled; wait for its final saved state.

3.  Check the final **Assessment execution** state. A successful stop shows **Stopped**; **Needs attention** requires inspection. Review any result retained before the stop took effect. A stop cannot undo an already issued target request or business action.
4.  Refresh and reopen the same run. Check its run code, execution state, evidence and any recovery notice. **Download legacy JSON evidence** preserves the displayed legacy run; the [export guide](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md) explains the other formats. **INCONCLUSIVE** is not a security pass.

### Example: stop while queued

In a separate synthetic QA workspace, **MR-1003** was stopped immediately after admission. Its saved trace, full-page refresh and JSON export retained **Stopped** and **INCONCLUSIVE**. The runtime confirmed cancellation had finished, with no target actions, model calls or unresolved recovery. This checks the queued-stop path; it does not establish how an already issued request will finish. The trace also displayed **Runtime error** because the interrupted native worker ended in that state; **Assessment execution** was **Stopped**.

![The saved MR-1003 trace showing Stopped execution and an INCONCLUSIVE security outcome after refresh.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-stopped.png)

This separate queued-stop example retained Stopped and INCONCLUSIVE after refresh and export. Runtime error describes the interrupted native worker; it is not a security verdict.

### When a run needs attention instead

An earlier **MR-1003** in a different QA workspace failed before its stop control could be used: the teaching tunnel returned HTTP 530 and left one target action uncertain. That record remains unresolved. No replacement execution or invented response was used to repair it.

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

For a browser failure, **Waiting on a decision** can retain an uncertain action even after sign-in and neutral setup messages succeeded. In the observed `fresh_conversation_unavailable:fresh_timeout` case, the first probe could not establish a fresh conversation. Keep the same run and inspect its evidence before making a recovery decision; the presence of **The action did not execute** does not establish that assertion for you.

The wizard’s header **Cancel** leaves configuration; it is not the runtime **Stop run** action. Keep execution state separate from the security verdict and [review what the evidence establishes](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/reproduction-and-limits.md).

Next: [inspect results and evidence](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/evidence-and-results.md) or [find a retained run and export it](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md).
