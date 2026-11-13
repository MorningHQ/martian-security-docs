"""Observe one explicitly authorized customer callable; never retry its business action."""
import argparse
import asyncio
import importlib.util
import inspect
import json
import os
from pathlib import Path
from time import monotonic
from uuid import UUID

from martian_redteam.runtime import RuntimeReporter


async def run(args, state):
    # Validate configuration/credential-file shape before loading customer code.
    reporter = RuntimeReporter(
        os.environ["MARTIAN_API_URL"],
        UUID(os.environ["MARTIAN_RUNTIME_BINDING_ID"]),
        Path(os.environ["MARTIAN_RUNTIME_TOKEN_FILE"]),
    )
    inputs = json.loads(Path(args.input_file).read_text(encoding="utf-8"))
    if not isinstance(inputs, dict):
        raise ValueError("Input must be a JSON object of callable keyword arguments")
    spec = importlib.util.spec_from_file_location("customer_runtime_target", args.callback_file)
    if spec is None or spec.loader is None:
        raise ValueError("Callback file cannot be loaded")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    callback = getattr(module, args.callback_function)
    if not callable(callback):
        raise ValueError("Callback must be callable")

    await reporter.start()
    trace = reporter.trace()
    failure = None
    try:
        try:
            with trace.call(kind=args.kind, system=args.system, name=args.name) as span:
                state.update(phase="call", call_state="running")
                if inspect.iscoroutinefunction(callback):
                    await callback(**inputs)
                else:
                    result = await asyncio.to_thread(callback, **inputs)
                    if inspect.isawaitable(result):
                        await result
                span.outcome = "success"
        except Exception as error:
            if state["call_state"] == "not_started":
                raise
            failure = type(error).__name__
        state.update(phase="delivery", call_state="error" if failure else "completed")
        # One delivery attempt happens in the reporter. Closing is not a flush.
        deadline = monotonic() + 8
        while reporter.sent + reporter.delivery_failed + reporter.dropped == 0 and monotonic() < deadline:
            await asyncio.sleep(0.1)
    finally:
        await reporter.close()

    print(json.dumps({
        "trace_id": str(trace.id),
        "call_state": "error" if failure else "completed",
        "error_type": failure,
        "sent": reporter.sent,
        "delivery_failed": reporter.delivery_failed,
        "dropped": reporter.dropped,
    }))
    if failure:
        return 1
    return 0 if reporter.sent == 1 and not reporter.delivery_failed and not reporter.dropped else 3


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--callback-file", required=True)
    parser.add_argument("--callback-function", required=True)
    parser.add_argument("--input-file", required=True)
    parser.add_argument("--kind", choices=["model", "tool"], required=True)
    parser.add_argument("--system", required=True)
    parser.add_argument("--name", required=True)
    args = parser.parse_args()
    state = {"phase": "setup", "call_state": "not_started"}
    try:
        return asyncio.run(run(args, state))
    except Exception as error:
        # Do not print private paths, credentials, inputs or callback exception bodies.
        print(json.dumps({**state, "error_type": type(error).__name__}))
        if state["call_state"] == "not_started":
            return 2
        return 1 if state["call_state"] == "error" else 3


if __name__ == "__main__":
    raise SystemExit(main())
