# Understand reproduction and coverage limits

> Distinguish observed replies, independently verified effects, clean reproduction, negative controls and incomplete coverage.

Source: [Web version](https://docs.martiansecurity.ai/assessments/reproduction-and-limits/)

> **Page qualification:** Current beta console · viewer, member, admin, owner · Walkthrough partly verified. [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

> **Walkthrough limits:** In isolated local QA, MR-1002 had unverifiable disclosure coverage and no deterministic oracle. Model opinions and requested-versus-used budgets were inspected. Clean-world reproduction and negative controls remain unverified. A separate payment run passed explicit seeded-account authentication and independent starting-ledger prerequisites, then retained Needs attention after MCP setup failed. Reopened before-only Outcome checks remained ready with no after-state or business-effect verdict; the original uncertain action is unchanged.

Partly verified guide

Endpoint-only evidence and a sandbox baseline are checked. Clean-world reproduction and negative controls remain incomplete.

Use the strongest retained evidence for the question you are answering. A reproducible reply, an executed tool call and a reproducible change in a restored business world support different conclusions.

## Before you start

Any tenant role can inspect a retained run it can access. You need an actual run with its recorded scope, verification receipts and coverage. Independent business verification additionally requires a sandbox-backed target with approved checks; an endpoint-only run cannot create missing world-state evidence after the fact.

## Review the reproduction claim

The [glossary](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/glossary.md) defines oracle, world epoch, carrier/implant and no-implant control. These terms identify different evidence checks; they are not interchangeable labels for a passed run.

1.  Open the run and read **Security outcome** separately from **Assessment execution**. A completed bounded search may have findings, no findings or inconclusive coverage; completion does not certify the agent.
2.  Open a verification row or the versioned **Verification receipts** section. Inspect **Reproduction status**, repetitions, successful reproductions, target calls, evidence and the control result.

3.  For a business effect, open **Outcome checks** and compare independently read baseline/after values. Check that repeated worlds were restored to an equivalent baseline and used distinct observed world epochs. Reusing a mutated world cannot establish clean reproduction.
4.  Inspect the no-implant control when required. A passing control supports the claim that the prepared attack caused the observed difference. A violation without the implant means carrier attribution is not established.
5.  Check the finding’s actual verification status after refresh. Martian only presents cleanly reproduced findings as verified when the recorded reproduction conditions are satisfied.

## Interpret the states

| Recorded result | Interpretation |
| --- | --- |
| Verified / cleanly reproduced | The recorded successful repetitions, trusted evidence and required controls met the admitted reproduction boundary. Read the specific scope and receipts. |
| Consistent / state dependent | Similar behavior or a positive observation exists, but the required evidence tier or clean-world boundary was not established. It needs further verification. |
| Unverifiable / untested | No trusted oracle or required evidence source could establish reproduction. This is uncertainty, not a pass. |
| Not reproducible | The recorded repetitions did not meet the reproduction threshold within this run’s scope. It does not prove the behavior is impossible. |
| Negative control skipped after negative repeats | Trusted repetitions were negative, so the runtime omitted a control that could not turn them positive. A skipped control is not a passed one. |

The normal profiles request two verification repetitions and two successful reproductions. The run’s admitted profile and receipts remain authoritative. Exact regression replay can require its control even after negative repeats.

## Separate evidence from interpretation

1.  Read the **Verifier narrative (model-generated)** as an interpretation. It may disagree with independent world receipts.
2.  For tool use, distinguish a catalogue advertisement, an attempted call, a gateway refusal, an error and an executed call. Execution alone still does not establish the intended downstream effect.
3.  For state-changing objectives, use independent before/after records rather than the target’s statement that it completed an action. A strong text match can establish disclosure in a reply, but not an unobserved payment or permission change.
4.  For imported history, retain its original provenance. It does not represent a fresh execution in the current deployment.

The captured sandbox run passed its starting-ledger prerequisites, then retained **Needs attention** after a target setup error. Its **ready** baseline, pending after-state and unavailable cleanly reproduced refund support no business-effect or reproduction claim. [Read the complete example](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/agents/sandbox-bindings.md#example-a-passed-baseline-with-no-outcome-verdict).

![Outcome checks with a ready starting receipt, five ledger records, two met baseline conditions, pending after-state and unavailable cleanly reproduced refund.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/assessment-outcome-checks.png)

Both baseline prerequisites passed. Outcome captured and After-state digest remain Pending, and no complete comparison or refund verdict exists. The duplicated-refund sentence describes the configured check.

## Check coverage before deciding what to do

Review selected versus executed techniques, budget exhaustion, skipped work, missing records, failed knowledge lookups, dropped customer events and any pending evidence delivery. **Attempts held** needs a complete attempt count and blocked classification; a run with no tested attempts has no meaningful held ratio.

The depth selector reports ceilings, not a promise that every allowance will be used. Default Light/Normal/Deep profiles allow at most 30/90/180 target requests and 100/300/700 model calls respectively, subject to workspace/server caps. Prepared scenarios use one search trigger and their admitted verification budget; browser setup also consumes requests.

**Largest cleanly reproduced sandbox refund** is the largest independently observed sample among this run’s retained clean repetitions. It is not an expected production loss, loss ceiling, incident probability or proof of savings from a call gate.

If evidence is insufficient, keep the result inconclusive, fix the missing prerequisite and explicitly schedule an appropriate new bounded assessment. Reading, comparing or exporting saved evidence does not fill missing execution coverage.

Next: [inspect evidence](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/evidence-and-results.md), [find and export retained runs](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md), or [review platform limits](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/limits.md).
