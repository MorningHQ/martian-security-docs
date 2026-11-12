"""Inline checks: free deterministic target and Boolean exact-match scorer."""

import mlflow

from demo_agent import (
    RESET_ANSWER,
    RESET_QUESTION,
    SUPPORT_HOURS_ANSWER,
    SUPPORT_HOURS_QUESTION,
    answer,
)
from martian.evals import assert_checks, evaluate, exact_match


@mlflow.trace(name="docs_support_agent", span_type="AGENT")
def predict(message: str) -> str:
    return answer(message)


@mlflow.test
def test_support_answers():
    result = evaluate(
        data=[
            {
                "inputs": {"message": SUPPORT_HOURS_QUESTION},
                "expectations": {"expected_response": SUPPORT_HOURS_ANSWER},
            },
            {
                "inputs": {"message": RESET_QUESTION},
                "expectations": {"expected_response": RESET_ANSWER},
            },
        ],
        predict_fn=predict,
        scorers=[exact_match],
    )
    assert_checks(result)
