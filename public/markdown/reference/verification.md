# Guide verification record

> Review source revisions, real captures, completed checks and remaining gaps.

Source: [Web version](https://docs.martiansecurity.ai/reference/verification/)

These guides are being qualified against actual running application/backend states with synthetic data. A source review, an observed screen and a completed end-to-end run are recorded separately. A pending walkthrough is not a passed walkthrough.

## Current publication status

The site is being published iteratively. Each task guide shows its current walkthrough status above the instructions. The initial public build includes source-reviewed instructions; authenticated captures and complete execution checks are added as they pass.

Of **37 task guides**, **22 are verified**, **9 are partly verified** and **6 await walkthrough verification**. The screenshot record contains **116 captured references** across **104 unique PNGs**. These counts come from the current coverage and screenshot manifests.

The application supports desktop workflows. The documentation itself is also checked on narrow layouts. Screenshots are direct application captures; no functionality is invented with DOM edits or mocked API responses.

The latest completeness audit added the missing project dashboard, native annotation and network-observer instructions and a [console map](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/console-navigation.md). Those three new task guides are source reviewed and await runtime qualification. A fresh synthetic QA sign-in succeeded, but Evals Overview returned a read failure and its supported refresh timed out; no annotation was submitted. The existing Discovery authorization/collector and privileged-sensor prerequisites were not bypassed. Earlier successful walkthroughs below remain historical evidence for their named paths.

## Observed walkthroughs — 13 November 2026

The isolated QA application uses the source baseline below, real Backend/Agents release images and MLflow 3.16.1. The organization, accounts, target and dataset contain synthetic data. These checks do not attest to a hosted customer workspace.

-   An invited organization owner created a workspace, signed in, opened the Default Evals project and retained access after refresh.
-   The downloadable HTTP adapter passed trusted HTTPS health/chat checks and rejected missing or incorrect bearer credentials. The owner saved, validated and approved its actual connection; active readiness survived refresh.
-   The owner imported three JSONL records, published them and reopened their immutable content after refresh.
-   **EV-1001** executed the three actual HTTP requests and retained **3 passed, 0 failed, 0 errors, 0 skipped**. Native provenance reported **FINISHED**, with the same dataset content hash. The first record’s native trace contains exact-match and target-chat spans with the observed input/output.
-   The actual result controls downloaded one filtered READY record as JSON and all three records as CSV. The terminal run and answers survived a full page refresh.
-   Invited members and viewers joined through the actual UI and retained their roles after refresh. Viewer launch/write requests and member publication/reassignment requests were denied. Anonymous, wrong-password, consumed/replaced/revoked invitation and cross-organization checks returned the expected rejections. Manual invitation delivery was tested; configured email delivery and natural expiry were not.
-   Three saved-output code criteria produced **nine natively persisted assessments**. `READY` passed exact match and containment, failed JSON syntax, and measured five characters. The real target-request counter stayed at **14** before and after supplementary scoring.
-   A one-record review queue reached **Complete** with **four verified answers**: Boolean, numeric, categorical and text. Refresh retained member attribution and history. A reusable question’s new version left its earlier queue unchanged. These are AI-operated synthetic accounts, with no independent human reviewer.
-   Released **SDK 0.1.2** authenticated with an owner-created scoped key, resolved its exact bound agent, and rejected the key after revocation. The downloadable SDK dataset was corrected after a real console import rejected its earlier field names; both corrected records were imported and published.
-   The SDK’s two Evals tests passed and retained **EV-1004** plus its CI session. The original `--require-export` command exited **1** because native export had not completed. Supported recovery later confirmed the stored session export and dataset finalization without running the callbacks again. The original failed receipt is preserved.
-   A distinct Evals-only SDK session retained **EV-1009** and passed its original `--require-export` command with exit **0**, **2 of 2 tests passed**, **persisted** upload and **exported** evidence. Its saved receipt and server readback agreed. These were local callbacks, separate from remote-target Evals and the earlier failure/recovery.
-   The SDK’s Python and CLI redteam entry points were each executed once with one planned probe. Both exited **0**, with one score of **1**, no execution errors and four succeeded, settled native generation/judging operations. A separate combined attempt saved **2 of 4 tests passed**, **Failed**, and **Exported to MLflow**. Generation was uncertain to its runner; a later read of that same operation confirmed success. No target/judging stage followed, and the original failed CI verdict was retained.
-   An earlier published SDK tutorial snapshot passed a distinct combined CLI qualification on a GitHub-hosted Ubuntu runner: original **exit 0**, **3 of 3 test groups passed**, **persisted** upload and **exported** evidence. Independent readback confirmed three **FINISHED** native runs, exactly two settled model calls, tutorial files unchanged within that qualification, safe metadata artifacts and own-resource cleanup. The [public receipt](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/examples/validation/sdk-ci-0.1.2-2026-11-13.json) records those original SDK/wheel/ZIP/source hashes and the run/attempt. The current download has a refreshed unpinned installation; it is not the historical hashed ZIP. The extracted customer workflow was not itself dispatched; its installation and CLI path ran in a reviewed disposable qualification wrapper.
-   Released **SDK 0.1.3** was installed from public PyPI and every command in the [local suite-file guide](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/sdk/local-evals.md) was run: the example’s failing first run, the resumed and fresh reruns, the result files, one run with a real LLM judge through an OpenAI-compatible endpoint, and one run logging to a temporary local MLflow server. The existing tutorial’s account-free steps were also repeated on 0.1.3. Persisted Evals, hosted red teaming and combined CI were **not** re-run on 0.1.3; their qualification remains on 0.1.2.
-   An independent macOS check of **SDK 0.1.3** passed **235 Evals tests and six subtests**, compared **59 installed runtime source files** with the release, and exercised the local CLI, complete example ZIP and saved results. Real Bedrock rubric, guidelines and conditions checks, a rejected-token error and the Python judge example also passed. The [local Evals guide](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/sdk/local-evals.md) uses copyable CLI output and a clearly separate Martian Security console example. Native `bedrock:/...` judge routing failed; the guide gives the verified OpenAI-compatible route and records the limitation. This does not extend the earlier hosted-platform qualification to 0.1.3.
-   **MR-1002** completed a real anonymous, serial, endpoint-only disclosure assessment in **1 minute 56 seconds**, using **3 agent requests** and **15 model calls**. It retained three refusal turns, one unverified attempt, an attempted/unverifiable probe and zero findings; its security outcome remained **INCONCLUSIVE**. Trace refresh and two actual JSON exports agreed with its state and scope. No deterministic oracle, sandbox actions or reviewed knowledge references were available. Member/viewer reads passed; viewer launch/stop and foreign-organization reads/writes were denied.
-   An earlier assessment was rejected before native campaign creation because the own QA worker’s three-round ceiling was smaller than the console’s five-round Light profile. Supported local ceilings were aligned without changing the shipped model profile. A later cancellation trial, **MR-1003**, ended **Needs attention** after an HTTP 530 teaching-tunnel failure before its stop control could be used. Its uncertain action remains recorded; no invented response or replacement execution resolved it. Positive cooperative cancellation remains unverified.
-   Attack Library inspection distinguished an enabled **MT-01** from the disabled **MT-20 Declared gap**. Taxonomy selection and catalogue refresh passed. Threat Intelligence explicitly reported **No live feed connected**. Catalogue membership remained separate from executed assessment coverage.
-   A named project retained **EV-1005**, with three real target requests and two passes/one failure. Switching projects and refreshing preserved scope. Archiving retained its results and three native traces while rejecting new target admission. Member/viewer project writes were denied.
-   A code suite’s **v1** passed both gates with six persisted assessments. **v2** tightened the mean-length ceiling and correctly failed while the canonical results stayed passed. The earlier policy and monitoring history remained unchanged. Saved-output scoring made no additional teaching-target requests.
-   Same-dataset comparisons paired three records under the same saved-output policy. Different policy versions were marked incompatible; a different dataset produced five unpaired, not-comparable rows. Filtered exports were checked, and the same comparison was reproduced after refresh and explicit reselection. The custom Boolean rubric also compared compatible v1 jobs after v2 had been saved.
-   Stopping **EV-1007** retained **2 passed, 0 errors, 1 skipped** and native **KILLED** provenance after refresh. Its two requests used a configured 90-second request budget. Stopping supplementary code scoring retained **8 of 12** assessments, with explicit partial coverage; the completed source run stayed unchanged. An earlier target-stop attempt retained its timeout errors and was reconciled without new target calls.
-   Working Bedrock access and the shipped worker completed six built-in and nine custom/historical Boolean model assessments. All **15 distinct native assessments** were confirmed persisted. Three delayed delivery acknowledgements were resolved through **Sync saved feedback**, without rerunning paid judging or calling the teaching target. Custom rubric v1 passed the three candidate answers; stricter v2 failed all three. Applying historical v1 after saving v2 retained its original definition. Native rubric versions remain distinct from the judge engine’s revision label.
-   Model judging rejected a missing cost acknowledgement, stale judge-version updates, unauthorized role writes and cross-organization run access. Numeric, categorical and text model-rubric execution remains unverified.
-   Trace filters, native inspection, bounded CSV/JSON exports and private/shared view lifecycle passed. A view-save timeout was preserved; a fresh save followed an explicit absence check. The SDK does not forward conversation-session metadata in these uploads: its tested selection showed **0 sessions / 1 ungrouped trace**.
-   A separate fresh QA workspace qualified native conversation viewing. An actual HTTP memory application, instrumented with MLflow 3.16.1 and a dedicated operator-provisioned non-admin writer, stored `BLUE` and then recalled it in two real requests. Independent native and Backend reads retained two completed root traces, each with a real memory span. Session filtering, **Group by session**, **View turns**, both trace inspectors and refresh showed one session, **2 turns**, **0 errors** and no ungrouped traces. Initial trace/view read timeouts were preserved; normal read refresh recovered without repeating either HTTP turn. Native token/cost/model fields remained unavailable. This is a separately provisioned native integration, not an SDK 0.1.2/API-key trace-ingestion feature.
-   Real Boolean failure groups supported owner investigation and member dismissal. Refresh retained their rationale, account and timestamp. Viewer triage was denied. After a separate organization had a ready native context, it received **404** for the same trace its owning customer read with **200**. These quality signals are separate from verified security findings.
-   Additional dataset authoring verified real CSV/JSON imports, edit/archive/delete and retained draft counts. Viewer draft access/creation and member publication returned **403**; a foreign owner received **404**. A genuine read-only Martian teaching pack copied into an editable three-record organization draft. Its publication stalled after an evaluation-service timeout, and one supported Resume did not establish completion. That copy is not a second successfully published version.
-   A saved canonical failure from **EV-1003** became one editable regression case with the original expected answer `4`. Direct copying returned **201/200**; a separate cleaned-export import returned **200**. Both drafts retained revision 2, one usable record and source metadata after refresh. The complete export wrapper was rejected **422**; extracting its unchanged `items` array resolved the format error. [The regression-case guide](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/regression-cases.md) keeps these different-ID paths separate. Neither draft was published or rerun in this qualification.

### Observed beta environment

An own synthetic Gmail environment in an existing provisioned beta organization saved revision 1 and launched with **built-in** fixtures. Real seeded Gmail sign-in and refresh, **Extend 30 min**, and **Stop sandbox** passed. The stop first returned **Terminating**; the specific instance later left the ordinary instance list, while an older expired instance remained. This is not independent proof of provider-resource deletion or an assessment business outcome.

The separate shared-generation attempt failed before QA. No generated or personal world was qualified; failed generation can still incur model usage. A new QA organization’s missing Evals readiness and authorized clusters were not bypassed. Relevant deployed Backend environment/data/sandbox files matched the recorded source baseline; these checks do not attest whole Frontend/Agents deployment parity. The data-drawer image hides only unrelated environment names behind it with native screenshot privacy masks.

The new beta QA Owner also inspected **Connect source → Add a read-only source**. The Kubernetes list had no authorized alias and **Create source** stayed disabled. Read-only checks of the deployed Discovery schema, API and configuration files matched the Backend baseline below. That schema rejects a Kubernetes observation field emitted by the available collector snapshot. Compatible collection and operator-approved scope remain prerequisites; no source, collector credential or inventory was created for this check.

The teaching callbacks are deterministic. These checks verify wiring and retained evidence; they do not establish production model quality or security. Other interfaces, sandbox-backed assessments, positive cooperative cancellation and the remaining screenshot-dependent journeys are still being qualified. Verified labels name the local or GitHub-runner QA scope; they do not imply hosted-beta parity. Partly verified guides identify their remaining limits above the steps.

A second three-record member run initially retained canonical passes while some telemetry acknowledgements were uncertain. Administrator reconciliation later confirmed the saved evidence with **zero target calls**. A stalled, never-submitted SDK dataset publication was safely aborted and its restored draft published after that recovery. A manually repeated numeric review save after a delayed acknowledgement also produced an additional history entry; queue completion was checked against its four latest verified answers.

The local QA stack has no sandbox orchestrator: its connector request returns 503 and the sidebar may report stale data. Sandbox-backed workflows remain unverified in this environment. No substituted catalog or invented results are used.

The beginner and visual review is an **AI-simulated novice review**, with no human participant. Desktop and narrow navigation, search, themes, image viewing and keyboard checks passed. Follow-up light/dark checks at 1440 × 1000 and 390 × 844 verified the revised comparison layout and explicit source-baseline links without overflow or documentation console errors.

## SDK compatibility

The task guides install the latest SDK and keep release announcements in [PyPI release history](https://pypi.org/project/martian-sdk/#history). Verification remains tied to the releases actually exercised:

-   **SDK 0.1.2:** API-key management, persisted Evals, red teaming and combined CI were qualified against the recorded isolated services. The [combined CI receipt](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/examples/validation/sdk-ci-0.1.2-2026-11-13.json) identifies the original tutorial snapshot and package hashes. Its original ZIP is historical; the current download uses an unpinned install.
-   **SDK 0.1.3:** installation, the account-free local preview, YAML validation, suite-file evaluations, deterministic checks, rubric/guidelines/conditions judges through one provider route, rejected-token handling and local evaluation storage were exercised. API-key management, persisted CI and hosted red teaming were not requalified on this release.

Installing a newer release does not extend those recorded results automatically. Validate your workflow before upgrading production CI, and record its selected dependency version in your lockfile.

## Source baseline

| Component | Reviewed source revision |
| --- | --- |
| Frontend | 06d0d0c96a9627c383b85670929dfe8bdc33aa30 |
| Backend | 01343fa93feb518f6c7cd1928b63a01d2ec5ee0b |
| Agents | f7de3e068d66fe478f642d43a658ed9b3ed321f5 |
| Evals service | 60c25994958105db4baa91f377ba46c24fdf253d |
| SDK release | martian-sdk 0.1.2 |
| SDK release for the local suite-file guide | martian-sdk 0.1.3 |
| Hermes styling foundation | 3593a4bae03e96cf6c7597ececf99fbfc32997ae |

## Inspectable records

The public repository retains the guide coverage matrix, screenshot provenance and validation results under quality/. Source revision records describe the inspected implementation; they do not by themselves prove which image is deployed in a particular workspace.

-   [Guide coverage](https://github.com/MorningHQ/martian-security-docs/blob/main/quality/coverage.json)
-   [Screenshot provenance](https://github.com/MorningHQ/martian-security-docs/blob/main/quality/screenshots.json)
-   [Validation results](https://github.com/MorningHQ/martian-security-docs/blob/main/quality/validation.json)
-   [Observed application walkthroughs](https://github.com/MorningHQ/martian-security-docs/blob/main/quality/walkthroughs.json)

## Availability distinctions

**Verified** means the recorded guide walkthrough passed against its named environment. **Source reviewed** means implementation was inspected but its live walkthrough remains pending. **Preview** describes a visible non-enforcing or otherwise limited capability. **Unsupported** means the current contract does not provide that operation. The guides preserve these boundaries.

Product gaps already identified include the Pipeline view’s illustrative martian scan text, unsupported target interfaces for dataset Evals, a Threat Intel view without a live feed, and network containment that remains a preview. Use the actual supported SDK CLI and controls documented here.
