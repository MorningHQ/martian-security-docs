# Review and activate an SDK call block

> Enroll a customer-operated gate, review one exact target, activate a timed block and resume calls without confusing it with network isolation.

Source: [Web version](https://docs.martiansecurity.ai/discovery/call-gates/)

> **Page qualification:** Current beta console · owner, admin · Walkthrough verification in progress. [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

> **Walkthrough limits:** Source reviewed; live walkthrough and required screenshots pending.

Guide in progress

Local setup checks have passed. Live enrollment, gate decisions, blocking and resuming calls still need a complete walkthrough.

Block entry to one explicitly enrolled model or tool call in an instrumented customer application. Success requires an activated control, a real denied decision and the SDK’s acknowledgment that it stopped before calling the target. This is separate from the CI release gate and from network-containment previews.

## Before you start

Use an **Owner** or **Admin** account, an enabled [runtime binding](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/discovery/runtime-and-blast-radius.md), a compatible deployed gate API and an SDK-integrated customer application. Use a synthetic test workload for your first block. Enrollment does not install instrumentation or prove every replica uses it.

Selected calls require a live allow decision even when no block is active. A decision outage, stale process or revoked gate credential stops them. Other calls and calls already admitted or in flight remain outside this control.

## Enroll exact call targets

1.  Open **Discovery → Kill switch** and select **Deployment / environment / version**.
2.  Under **Block model or tool calls**, choose **Add a reported target**, or enter **Kind**, **System**, **Name** and click **Add target**. Enroll 1–32 distinct exact targets. Names must come from trusted application configuration, not a model-generated argument.
3.  Click **Create customer assignment**. Privately save **Download assignment** and **Download gate credential**, then **Clear credential from screen**. The credential is shown once and is separate from the runtime reporting credential.

4.  Install the assignment and gate credential in the intended customer application. Its SDK must consult the gate before each selected call. Wait for **SDK reporting** and a recent process under **Processes seen within 90s**. **Awaiting SDK** means enrollment alone has not established a live caller.

## Run a bounded synthetic gate client

After installing the verified SDK release described in the SDK guide, save the downloaded assignment and both private credentials outside source control. This example calls a local synthetic tool and uses the real Backend for decisions; it makes no model-provider request. Enroll **Tool**, system `docs_demo`, name `lookup` for this test, and configure:

```sh
export MARTIAN_API_URL='https://your-approved-backend.example.com'
export MARTIAN_GATE_ASSIGNMENT_FILE='/absolute/private/martian-call-gate.json'
export MARTIAN_GATE_TOKEN_FILE='/absolute/private/gate-credential'
export MARTIAN_RUNTIME_TOKEN_FILE='/absolute/private/runtime-credential'
```

Save as `call_gate_demo.py`:

```python
import asyncio
import os
from pathlib import Path

from martian_redteam.call_gate import CallBlocked, GateUnavailable, RuntimeCallGate
from martian_redteam.call_gate_schema import CallTarget, GateAssignment
from martian_redteam.runtime import RuntimeReporter


async def synthetic_lookup():
    return {"order": "synthetic-order", "status": "ready"}


async def main():
    origin = os.environ["MARTIAN_API_URL"]
    assignment = GateAssignment.model_validate_json(
        Path(os.environ["MARTIAN_GATE_ASSIGNMENT_FILE"]).read_bytes()
    )
    expected_target = CallTarget(kind="tool", system="docs_demo", name="lookup")
    if expected_target not in assignment.targets:
        raise SystemExit("Assignment does not enroll the docs_demo/lookup tool")
    gate = RuntimeCallGate(origin, assignment, Path(os.environ["MARTIAN_GATE_TOKEN_FILE"]))
    reporter = RuntimeReporter(
        origin,
        assignment.binding_id,
        Path(os.environ["MARTIAN_RUNTIME_TOKEN_FILE"]),
        call_gate=gate,
    )
    await reporter.start()
    try:
        for attempt in range(36):
            trace = reporter.trace()
            try:
                async with trace.guarded_call(
                    kind="tool", system="docs_demo", name="lookup"
                ) as span:
                    result = await synthetic_lookup()
                    span.outcome = "success"
                    print(attempt + 1, "allowed", result)
            except CallBlocked:
                print(attempt + 1, "blocked before the synthetic tool")
            except GateUnavailable:
                print(attempt + 1, "stopped: no usable live decision")
            await asyncio.sleep(5)
    finally:
        await reporter.close()


if __name__ == "__main__":
    asyncio.run(main())
```

Run `python call_gate_demo.py` while completing the review below. It performs at most 36 local tool attempts over about three minutes. The membership check stops a mismatched assignment before any callable runs: targets outside an assignment are intentionally outside its gate. When adapting the example, keep enrollment, this check and the guarded target identical. A customer integration substitutes its normal authorized callable inside the guarded block. Never call that provider/tool in the blocked or unavailable exception handlers. SDK-bound MCP tools use the same gate when given the corresponding runtime trace.

## Review and activate a timed block

1.  Select the exact enrolled **Call target**, choose **Duration** (1, 5, 15, 30 or 60 minutes), and enter a clear **Reason** of 3–240 characters.
2.  Click **Review control**. Read the deployment, exact target, availability impact, expiry and five-minute review deadline. No call is blocked yet.
3.  Select **I reviewed this deployment, target, availability impact and expiry.**, then click **Activate call block**. Activation needs a recently reporting SDK process with this exact assignment.

4.  Confirm the active control and server-timed expiry. Trigger the same synthetic tool and inspect **Decisions and operator actions**. **SDK reported stopped** acknowledges refusal before call entry; **SDK acknowledgement not received** needs investigation and is not the same evidence.
5.  Refresh the console and confirm the same persisted active control and audit record. Check the customer’s local output/state to establish that its callable did not run during a block.

## Resume and verify recovery

1.  Click **Resume calls** on the active control, or let its server-timed expiry pass.
2.  Trigger another selected synthetic call. It can proceed only when the Backend is reachable, the process is registered and the gate credential is valid.
3.  Refresh the console. Inspect **Control history and customer assignment**, then verify the customer’s real callable resumed and its expected result was retained.

Revoking the gate credential is not Resume: configured SDK calls fail closed. **Rotate credential** invalidates the old credential immediately and requires the replacement to be installed; the process must register again. Rotating/revoking the runtime reporting credential affects uploads, not this separate gate’s authority.

## Keep containment previews separate

1.  Expand **Explore containment intent and future network isolation**.
2.  Select a deployment, reported target or egress intent and requested duration, then **Generate preview**.
3.  Read **NOT EXECUTABLE** and **Activation unavailable**. **Download intent JSON** saves proposed scope and evidence; it does not activate this SDK gate or install a network policy/controller.

## Failure and boundary checklist

-   Expired review: create a new review; its fingerprint/deadline cannot be reused.
-   No live matching process: fix assignment, credentials and instrumentation before activation.
-   Blocked/unavailable decision: do not execute the selected callable through a fallback path.
-   Active block after a mistaken credential revoke: restore the valid decision path and explicitly resume; revocation does not remove the control.
-   Direct SDK-bypassing calls, other targets, replicas without instrumentation and already admitted calls remain outside scope. The gate cannot reverse completed effects or stop network connectivity.

Continue with [runtime evidence](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/discovery/runtime-and-blast-radius.md) and [permissions](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/permissions.md).
