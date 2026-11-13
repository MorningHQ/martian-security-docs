# Local Evals tutorial — SDK 0.1.3

Guide: http://docs.martiansecurity.ai/sdk/local-evals/

This example uses synthetic data and deterministic teaching agents. It needs Python 3.12+
and no Martian account. Run the commands from this extracted folder on macOS or Linux.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade 'martian-sdk[evals]'
.venv/bin/martian --version
.venv/bin/martian evals run evals.yaml
```

The first run intentionally exits 1: two cases pass, and `prompt-injection` fails because
`agent.py` prints a synthetic internal note. Results are written to `results/`.

```sh
.venv/bin/martian evals run evals-fixed.yaml --fresh
```

This suite uses `agent-fixed.py`. All three cases pass, exit 0. Its `results-fixed/`
folder preserves the first run for comparison. Edit these teaching agents to call your
own application. After changing an agent, a case or a check, use `--fresh` or a new output
folder: a normal rerun reuses completed verdicts, including failures.

`evals-with-judge.yaml` uses the original flawed `agent.py`. Replace `YOUR_JUDGE_MODEL`
and configure your provider key in the environment before running it. No provider key
belongs in this download. LLM judging sends synthetic inputs, replies and criteria to
that provider and can incur usage costs.

Read `summary.json` for totals and `results.jsonl` for each check's verdict and reason.
The result files and internal evaluation store can contain prompts and replies in clear
text; keep them private when using sensitive data. This local example creates no Martian
console run or persisted release gate. To view recorded results in Martian Security,
follow http://docs.martiansecurity.ai/sdk/ci/.
