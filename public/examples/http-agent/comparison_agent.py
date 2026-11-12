"""Optional deterministic comparison variant of the teaching callback.

On the same immutable three-record tutorial dataset, the deliberate whitespace
and case changes still pass canonical exact match, while the added punctuation
fails: two passed, one failed. Other baseline responses are unchanged. This
callback makes no model calls and performs no business-side actions.
"""

from demo_agent import answer as baseline_answer


def answer(message: str) -> str:
    baseline = baseline_answer(message)
    return {"READY": " ready ", "HELLO": "hello", "4": "4."}.get(baseline, baseline)
