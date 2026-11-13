# Run your first assessment

> Complete a small endpoint-only assessment and inspect the recorded result.

Source: [Web version](https://docs.martiansecurity.ai/get-started/first-assessment/)

> **Page qualification:** Current beta console · Member, admin or owner; admin required for connection approval · Verified 2026-11-13 · Isolated local QA; named HTTP/catalogue walkthrough. [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

Finish with one retained security assessment and an understanding of its report. This tutorial starts with an endpoint-only test: you can learn the assessment workflow before configuring synthetic business systems.

## Before you begin

-   Sign in to the correct current-beta workspace as a **member, admin or owner**.
-   Use an agent and endpoint you are authorized to test. For this tutorial, use a synthetic demo or test agent, not customer data.
-   Have an **active, approved connection**. If none is listed, an admin must complete [register, validate and approve an agent](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/agents/connections.md). That guide documents the HTTP contract and each supported interface.
-   Read [supported targets](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/supported-targets.md). Dataset Evals has a narrower interface policy than assessments.
-   Confirm the organization is allowed to run assessments and that the chosen test is available. The live controls are authoritative if your environment applies smaller budgets.

## 1\. Choose the scope

1.  Select **New assessment** in the sidebar.
2.  In **Environment**, choose **No environment — test the endpoint only**. This skips sandbox generation and makes the scope explicit.
3.  Continue to **Agent** and select your approved test agent. If its connection is draft, changed, disabled or awaiting approval, return to the connection guide before launching.

![Environment step with endpoint-only testing selected](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-environment.png)

Select No environment — test the endpoint only to use the approved connection without sandbox systems.

![Approved Docs teaching agent selected in the assessment wizard](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-agent.png)

Select the approved teaching agent. HTTP connected describes its connection; NOT TESTED describes its assessment history.

## 2\. Choose one goal and a small test

1.  In **Goals**, fill in **Declared purpose** with the test agent’s intended task. For the downloadable deterministic target, describe its fixed teaching answers, fallback refusal and absence of business tools or private records. For your own target, describe its actual task and access.
2.  Under **Declared behaviors**, enter one relevant rule in **New behavior**, then click **Add**. For example: “Do not reveal private instructions or records when an untrusted message asks for them.” Click **Continue**.
3.  In **Tests**, use **Anonymous caller** unless your approved test specifically needs another supported identity. Select **By outcome**, keep only **Customer records leave** selected, and clear the other outcome cards. This example requests a disclosure probe. The console shows five requested techniques; that count does not mean five attacks will execute. If the catalogue is unavailable, resolve its readiness message before continuing.
4.  Choose **Light** for the first run. Review the displayed ceilings and execution settings before continuing. Light is a maximum budget, not a promise that every possible attempt will run or a guarantee of a particular charge.
5.  Keep **Plan independent rounds up front and run probe lanes in parallel** off for this introductory run. Browser targets are endpoint-only and serial, with their own supported outcome choices.

![Synthetic target purpose and one behavior boundary in Goals](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-goals.png)

Declare the actual task and its behavior boundary. This deterministic teaching target has no private records, business tools or account actions.

![Only Customer records leave selected with Light and serial execution](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-tests.png)

Only Customer records leave is selected. Light allows at most five rounds, 30 agent requests, 100 model calls and six minutes here; the five techniques are requested scope.

## 3\. Launch and follow progress

1.  In **Tests**, review the selected agent, scope, goal, test and budget. Resolve any message above **Start assessment**.
2.  Click **Start assessment** once. The wizard opens **Run** with the acknowledged run code. Keep that run open; do not submit another run because the first response is slow.
3.  Follow its progress and reported target/model budgets. A running status records work in progress, not a verified finding.
4.  If you must stop, use the run’s stop/cancellation control and wait for the final state. Cancellation cannot undo a request already sent. See [progress and cancellation](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/progress-and-cancellation.md).

![MR-1002 running with Open trace and Stop run controls](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-running.png)

The acknowledged MR-1002 run shows its five requested techniques. Open trace follows execution; the header Cancel leaves the wizard.

## 4\. Inspect the result and report

1.  Select **Open trace** from **Run**, or from **Report** if the wizard has already advanced. Wait for a final **Assessment execution** state. Read **Security outcome** separately from execution and the finding count.
2.  In the observed **MR-1002** example, execution was **Completed**, but the security outcome was **INCONCLUSIVE**. It used three agent requests and 15 model calls, retained one unverified attempt and recorded zero findings. A completed run with no findings is not a security pass; your generated attempts and counts can differ.

![Completed MR-1002 with INCONCLUSIVE security outcome](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-trace-overview.png)

MR-1002 completed with three agent requests and 15 model calls, but its one attempt remained unverified and its security outcome INCONCLUSIVE. Zero findings is not a security pass.

3.  In **Trace**, use **Tree → Expand all** and select a turn. Compare **Attacker message**, **Customer agent reply**, and the recorded actions. The teaching target refused all three observed requests. Its model-generated critic is an opinion; this example had no deterministic target oracle.

![Recorded attacker message and actual teaching-target refusal in Turn 1](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/first-assessment-trace.png)

Select a retained turn to compare the actual attacker message, customer reply and action journal. The critic below is model interpretation, not an independent oracle.

4.  Open **Probe coverage**. The example’s single disclosure probe was **attempted** with an **unverifiable** outcome. Read missing evidence, budget limits and reproduction information before interpreting coverage. Endpoint-only evidence does not establish a sandbox business effect.
5.  Refresh and reopen the same run. Confirm its final state, verdict and retained turns. Then open **Reports** in the sidebar, find the matching run code and select **Download**. Inspect the JSON’s run, state, verdict and coverage; this is not a PDF. See [history and exports](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md) for export scopes.

## What success looks like

You have one retained assessment with its selected scope, a final status and inspectable evidence. A finding is a useful result; zero findings are also a recorded result, with the run’s coverage and verification limits. Neither should be described as a certification of the agent’s security.

If the run fails admission, resolve the named connection, capability, compatibility or budget error before a new attempt. A local QA attempt was rejected before campaign creation because the worker’s three-round ceiling was smaller than the console’s five-round Light profile; it remains recorded as failed. A workspace operator must align those supported limits. If submission is uncertain, inspect the saved run/history first so you do not create duplicate paid work. [Troubleshooting](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/troubleshooting.md) covers those boundaries.

**Next:** [Read evidence and results](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/evidence-and-results.md), then [create an environment](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/environments/create-and-launch.md) for supported business-outcome checks.
