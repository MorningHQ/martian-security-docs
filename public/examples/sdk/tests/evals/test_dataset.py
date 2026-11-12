"""A published Backend dataset, executed locally and server-scored on upload.

First import support-regressions.jsonl into your organization as the dataset
docs-support-regressions, validate and publish it, or set DEMO_DATASET_NAME to
the name of your compatible published dataset.
"""

import os

import mlflow

from demo_agent import answer
from martian.evals import assert_gate, evaluate, exact_match, load_dataset


@mlflow.trace(name="docs_dataset_agent", span_type="AGENT")
def predict(message: str) -> str:
    return answer(message)


@mlflow.test
def test_published_support_dataset():
    data = load_dataset(os.environ.get("DEMO_DATASET_NAME", "docs-support-regressions"))
    result = evaluate(data=data, predict_fn=predict, scorers=[exact_match])
    assert_gate(result, data)
