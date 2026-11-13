# Martian SDK 0.1.2 runnable tutorial

Use Python 3.12 or newer and Git. Run all commands from the extracted tutorial
folder. The ZIP has no Git history: create and commit this isolated demo repository
before taking a Git revision for persisted CI.

```sh
git init -b main
git add -- .gitignore README.md demo_agent.py pytest.ini \
  support-regressions.jsonl redteam.yaml redteam.py combined_ci.py \
  key_agent_id.py github-actions.yml tests/evals
git commit -m 'Add Martian SDK tutorial'
python3 -m venv .venv
.venv/bin/python -m pip install 'martian-sdk[evals]==0.1.2'
.venv/bin/martian --version
.venv/bin/martian redteam validate redteam.yaml
```

If Git requests an identity, set your own repository-local `git config user.name`
and `git config user.email`, then repeat the commit. Do not commit `.venv/`,
`.martian-local-mlflow/`, `results/`, `.env` or credentials. The supplied ignore
file covers these paths.

`pwd` and `git rev-parse --show-toplevel` should identify the same folder. The
complete working tree is:

```text
demo_agent.py
pytest.ini
support-regressions.jsonl
redteam.yaml
redteam.py
combined_ci.py
key_agent_id.py
github-actions.yml
tests/evals/test_quality.py
tests/evals/test_dataset.py
```

The sample `demo_agent.answer` is a real, deterministic local callback. It is not
an LLM or an assessment of a production agent. Replace that function with your
application when moving beyond this tutorial. Its return value must be a string
or a supported `Turn`; both synchronous and asynchronous callbacks are supported.

## Free local Evals preview

```sh
MARTIAN_EVALS_OFFLINE=1 \
MARTIAN_EVALS_STORE_DIR="$PWD/.martian-local-mlflow" \
.venv/bin/martian evals run tests/evals/test_quality.py -q
```

Expect one passing test with two evaluated records. This executes the real local
MLflow evaluator and exact-match scorer. It does not call Backend, upload results,
or establish a persisted CI pass. Its safe session receipt is
`.martian-local-mlflow/martian-session.json`, with `state: offline`,
`upload: offline`, and no Backend session ID. Keep that entire MLflow directory
private: its SQLite store contains the local inputs, expected values and outputs.

## Hosted prerequisites

1. Use an organization whose compatible SDK Backend/Agents services are enabled
   and whose machine readiness reports the capabilities you need.
2. An owner/admin creates an API key in the Evals Runs page's API keys section.
   Save its once-shown value in your secret manager. Dataset reads need
   `evals:read`; dataset uploads need `evals:write`; CI-session writes/reads need
   `ci:write` and `ci:read`; hosted red teaming additionally needs `redteam:run`.
   Respect any agent or dataset restrictions on the key.
3. For dataset/combined examples, import `support-regressions.jsonl` as
   `docs-support-regressions` in Evals Datasets, check automatic validation and publish it. Members
   may author drafts; publication requires owner/admin. Alternatively set
   `DEMO_DATASET_NAME` to a compatible published dataset name.
4. For persisted CI, select the intended existing registration by name in the
   key creation dialog's **Agent restriction** field. If no registration exists,
   complete the documented Agent connection onboarding or ask the workspace
   owner which existing demo registration to use. A local callback does not
   create a registration. An unrestricted key has no bound UUID for the lookup.
5. Inject these variables securely; the SDK does not load `.env` implicitly:

```sh
export MARTIAN_API_URL='https://YOUR-APPROVED-BACKEND-ORIGIN'
# Inject MARTIAN_API_TOKEN from the environment/secret manager; never paste it in docs or Git.
export MARTIAN_API_TOKEN
export MARTIAN_EVALS_STORE_DIR="$PWD/.martian-local-mlflow"
```

After loading the token, obtain the exact bound agent UUID through the supported,
read-only `GET /v1/sdk/capabilities` API:

```sh
MARTIAN_AGENT_ID="$(.venv/bin/python key_agent_id.py)" && export MARTIAN_AGENT_ID
git status --short
export MARTIAN_EVALS_GIT_SHA="$(git rev-parse HEAD)"
```

`key_agent_id.py` keeps the token in memory, prints only the returned UUID, and
executes no target/model. If the key is unrestricted, it exits with an instruction
to create a replacement bound key. Do not guess a UUID. Commit any intended local
code/test/config changes before using `git rev-parse HEAD`. The selected
registration labels and access-binds Backend records; the SDK still calls the
local `demo_agent.answer` function. It does not dial the registration's remote
connection or attest that the callback is the same deployed binary.

`MARTIAN_API_URL` is the approved origin without `/v1` or another path. HTTPS is
required except loopback development. A local callback's provider/target keys are
separate credentials. A Martian API key neither authorizes those providers nor
grants console administration. Do not set a remote `MLFLOW_TRACKING_URI`.

The import file uses the console contract: `id`, `input`, `expected_output` and
`status`. The inline SDK test instead uses nested `inputs.message` and
`expectations.expected_response` fields. In **Import records**, choose **File (up to 20 MiB)**, verify the
preview shows two new records, then import and publish. Automatic validation
should report two usable records; there is no separate Validate button.

## Dataset evaluation and persisted checks

```sh
.venv/bin/martian ci --evals-path tests/evals --require-export --output results/evals
```

The dataset test pulls the immutable pin, executes the callback locally for all
active rows, and sends outputs to Backend for canonical exact-match scoring. The
inline test is client-executed/client-scored. Both appear in one persisted session.
Inspect `results/evals/ci-session.json` and Evals Runs after refreshing the console.
Only claim hosted success after verifying the returned session and any required
exports. `exact_match` compares stripped, case-folded text. Additional scorer
checks must use `assert_checks`/`assert_gate`, not `assert result.passed`.

## One redteam probe

Validate first. This command does not execute a probe:

```sh
.venv/bin/martian redteam validate redteam.yaml
```

Then choose **one** entry point for the attempt. Running both executes two probes
and incurs generation/judging twice.

CLI:

```sh
.venv/bin/martian redteam run redteam.yaml -o results/redteam
```

Or the equivalent Python example:

```sh
.venv/bin/python redteam.py
```

The YAML suite plans one PromptLeakage/system_prompt probe with PromptInjection,
one local callback call, and hosted generation/judging. Validation is offline;
execution requires the enabled platform and can incur model costs. Each execution
entry point starts a separate assessment. Expect JSON and Markdown reports, then a strict gate
result. CLI `run` exits 0 for a complete pass, 1 for a failed gate and 2 for setup
or execution/usage failures. A score of 0 is a completed failing judgment, never a
reason to rerun until green. Standalone redteam writes local reports; it does not
create the combined Backend CI session.

## Combined CI

Choose **one** entry point for each CI attempt. Running both repeats the work.
You only need to prepare and validate the redteam configuration above; do not
execute a standalone probe as a prerequisite for combined CI.

CLI:

```sh
.venv/bin/martian ci --evals-path tests/evals --redteam-config redteam.yaml \
  --require-export --output results
```

Or the equivalent Python entry point:

```sh
.venv/bin/python combined_ci.py
```

Both commands run from this Git repository's root, with `redteam.yaml`,
`demo_agent.py`, `pytest.ini` and the two files under `tests/evals/` present there.

The runner executes one pytest session, adds the YAML redteam item to it,
then persists one Backend CI session. It is serial. Do not also call the same YAML
assessment from a pytest test. Exit 0 requires a complete acknowledged session;
missing credentials or execution failures cannot pass. A lowered declared
threshold is visible as a relaxed verdict rather than a strict all-pass result.

Safe files to retain as CI artifacts:

- `results/ci-session.json`
- `results/redteam/risk-assessment.json`
- `results/redteam/risk-assessment.md`
- `results/redteam/probes.jsonl`

Do not upload `.martian-local-mlflow/`, credentials, or raw in-memory target data.
Reports use digests by default. Keep content reporting disabled unless the data is
specifically approved. Use trusted workflow refs and secret scopes; never expose
the key to unreviewed pull-request code.

## Install the CI workflow with its required source

From the prepared tutorial Git repository's root:

```sh
mkdir -p .github/workflows
cp github-actions.yml .github/workflows/martian-checks.yml
git add -- .github/workflows/martian-checks.yml .gitignore \
  demo_agent.py pytest.ini redteam.yaml redteam.py combined_ci.py \
  key_agent_id.py support-regressions.jsonl tests/evals
git commit -m 'Run Martian tutorial checks in CI'
git status --short
export MARTIAN_EVALS_GIT_SHA="$(git rev-parse HEAD)"
```

Push the complete committed repository through your normal Git process. The
workflow expects `demo_agent.py`, `pytest.ini`, `redteam.yaml` and both tests under
`tests/evals/` at the checkout root; copying only the workflow will not work.
Configure the `agent-evals` GitHub environment with the approved origin, exact
bound agent UUID and secret token as described in the
[public CI guide](https://morninghq.github.io/martian-security-docs/sdk/ci/).

For an existing customer repository, follow the
[full copy/adaptation checklist](https://morninghq.github.io/martian-security-docs/sdk/ci/#use-an-existing-customer-repository).
Copy the callback, YAML, tests and helpers as well as the workflow; merge pytest
and ignore settings. Replace the demo callback/imports, dataset expectations,
YAML-relative callback path, dependencies and any changed runner/artifact paths
before committing. Take the revision from that customer repository, not the
original extracted tutorial. The SDK invokes your local callback; a registration
ID remains attribution and an access binding rather than proof of callback identity.

## Important failures and limits

- Missing/invalid values, skipped or deselected required tests, unasserted
  evaluations, target exceptions/timeouts and incomplete uploads fail the gate.
- Redteam execution POSTs are sent once. Preserve an operation UUID and recover
  it with `client.get_operation(id)` after an unknown outcome; do not resubmit.
- Async callbacks cancel cooperatively. Sync network callbacks need their own
  network timeout; Python cannot kill a worker thread, and cleanup is awaited.
- SDK dataset CI is bounded to 100 rows per test, 20 scorers per checks test,
  100 tests and 1,000 combined session rows/probes, with a bounded request body.
  These differ from the console's admitted Evals run budgets.
- `--require-export` waits for bounded export readback; it does not rerun the
  target or a judge. The local and Backend result must agree.
- There is no `martian scan` command in release 0.1.2.

The free preview and CLI validation can be checked without a platform account.
Hosted dataset/redteam/combined steps require independent live Backend validation.
