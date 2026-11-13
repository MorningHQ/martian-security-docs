# Score saved outputs and define judges

> Apply code criteria or versioned model rubrics to completed outputs with explicit cost and provenance controls.

Source: [Web version](https://docs.martiansecurity.ai/evals/judging/)

> **Page qualification:** Current beta console · member+ applies; owner/admin defines native judges · Verified 2026-11-13 · Isolated local QA (code + Boolean model rubrics). [Verification details](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

Add supplementary assessments to a completed evaluation without sending its prompts to the target again. Use code criteria for deterministic checks or a versioned model judge for an explicitly defined rubric. The original canonical exact-match results remain intact.

## Before you start

Use a **Completed** run in a writable project in the current beta console. **Members**, **admins** and **owners** can apply scorers. Creating or versioning a custom judge requires **owner** or **admin** access.

Model judging additionally must be enabled in your organization’s environment and requires your explicit acknowledgement of provider charges. A disabled criterion labelled **Requires operator setup** cannot be enabled by acknowledging cost. Ask your administrator about availability. Reading or editing a judge definition does not itself invoke the model.

## 1\. Apply a code criterion

1.  Open **Evals → Runs** and select a completed run.
2.  Click **Score saved outputs**.
3.  Leave **Suite version** at **Ad hoc criteria**.
4.  Select the code criteria you need: **Exact match**, **Contains expected text**, **Valid JSON** or **Response length (characters)**.
5.  Click **Apply scorers** once and wait for the saved-output job to finish.

![Three saved-output code criteria selected, with model criteria unavailable.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-judging-code.png)

Contains expected text, Valid JSON and Response length score retained answers. Model options require operator setup in this QA environment.

Only the saved outputs are scored. **Valid JSON** is a syntax check, not your business schema. **Contains expected text** is a substring check, not semantic correctness. Response length counts Unicode characters. Choose criteria that actually measure the property you care about.

Inspect a result’s **Assessments** after the job completes. The teaching response `READY` contains its expected text and has five characters, while failing JSON syntax. Its original exact-match result still passes. The recorded native persistence state tells you whether the additional feedback has been retained.

![Persisted native code feedback for the saved READY response.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-code-feedback.png)

READY contains the expected text and has five characters, but is not valid JSON. All three code feedback entries show MLflow persisted; the original exact-match result still passes.

## 2\. Add built-in model opinions

1.  Open **Score saved outputs** on the completed run and leave **Suite version** at **Ad hoc criteria**.
2.  Clear criteria you do not want, then select **Correctness judge** and **Safety judge** when they are available.
3.  Read and select **I acknowledge that model judging can incur provider charges.**
4.  Click **Apply scorers** once. Reopen **Score saved outputs** to follow the job, then wait for its terminal state.
5.  Select the corresponding **Assessment job** and inspect a result’s **Assessments**. Read the value, explanation and **Model opinion** persistence state together.

![Available correctness and safety judges selected with provider-cost acknowledgement.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-model-judges-selection.png)

The real local QA environment exposes both model judges. Only correctness and safety are selected, and the owner has acknowledged provider charges before admission.

The local teaching example produced six values across three saved responses, with zero judgment errors. Correctness and safety were both rated true for these benign examples. **Assessment identity** retained the model/judge revision; the original exact-match outcomes stayed unchanged. These ratings describe this small sample, not the target’s general security.

![Real correctness and safety model opinions with retained feedback and source identity.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-model-judges-feedback.png)

The saved READY result has true safety and correctness opinions, explanations and persisted MLflow feedback. Assessment identity records the Bedrock GLM-5 judge revision. One pending feedback delivery was reconciled without requesting another judgment.

If a saved value and explanation exist but their MLflow state is pending, use **Sync saved feedback** to reconcile that assessment’s delivery. Wait, refresh and reselect the original job. This does not request another model judgment. One assessment in the recorded example needed this action before all six native feedback records were retained.

## 3\. Define a custom model rubric

1.  As an owner/admin, open **Evals → Judges** and click **New judge**.
2.  Enter a stable **Judge name**, such as `answer_quality`, and a useful **Description**.
3.  Write **Instructions** describing what to judge from the saved input/output and expected value. For example:

```text
Assess whether {{ outputs }} answers {{ inputs }} with the required factual
content from {{ expectations }}. Return true only when the required answer is
present and the response does not contradict it. Explain the decision using
the saved text; do not assume external actions or unrecorded facts.
```

4.  Choose **Output type**: `boolean`, `numeric`, `categorical` or `text`. For numeric output, set **Minimum** and **Maximum**; for categorical output, enter one category per line in **Category options**.
5.  Click **Save version 1**. Reopen the judge and confirm the saved immutable version.

![Real Boolean custom-judge definition with a stable name and saved-text instructions.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-judging-definition.png)

Owner enters the docs\_answer\_present Boolean rubric before Save version 1. Saving the definition invokes no judging model.

A judge name begins with a lowercase letter and uses lowercase letters, digits or underscores. Keep the rubric specific and review it against examples before relying on its ratings. Saving a rubric does not establish judge accuracy.

## 4\. Apply a particular judge version

1.  Return to the completed run and open **Score saved outputs**.
2.  Under **Ad hoc criteria**, select the custom judge. Use the version selector beside it to choose the intended version, including a historical version if needed.
3.  If you choose **Policy compliance judge**, fill **Policy guidelines**.
4.  Read and select **I acknowledge that model judging can incur provider charges.**
5.  Click **Apply scorers** and wait for the job’s terminal state.
6.  Select that **Assessment job**, inspect a result’s **Assessments**, and check its typed value, rationale and persistence state. Refresh and verify the same job and feedback remain recorded.

### Create and apply v2

For the pictured differences, use the completed [comparison-variant run](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/compare.md) with the saved outputs `ready`, `hello` and `4.`. Your own responses can receive identical opinions when both rubrics accept them.

1.  Open **Evals → Judges**, find the same judge, and choose **Create next version**.
2.  Edit **Description** and **Instructions**. In this example, v2 requires the expected letter case and punctuation; v1 accepts the required answer despite those differences.
3.  Click **Save version 2**. Reopen the judge to read **Version history** and confirm that both definitions remain available. Saving v2 does not apply it to a run.

![Create version 2 preserves the judge name while allowing stricter instructions.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-judging-next-version.png)

The immutable judge name remains disabled. Owner prepares a stricter Boolean v2 rubric requiring expected case and punctuation, then saves it as a new version.

![Read-back version history retaining the stricter v2 and original v1 definitions.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-judging-version-history.png)

The real Version history panel retains both Boolean definitions, their original instructions and capture-time creation dates. Saving v2 did not replace v1.

4.  Return to the same completed run and open **Score saved outputs**. Under **Ad hoc criteria**, select the custom judge and choose **v2** in its adjacent version selector.
5.  Read and select **I acknowledge that model judging can incur provider charges.** Then click **Apply scorers** once.
6.  Wait for the new job to finish, select its **Assessment job**, and inspect the retained **Assessments**. Refresh and reselect that job to verify persistence.

![Two persisted opinions on the same punctuation response with different retained definition identities.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-judging-feedback.png)

V2 rejects the extra period while the earlier v1 accepts the required answer. Both native feedback records, rationales, jobs and definition digests remain visible. The identical engine-v2 source suffix is separate from each rubric version.

The recorded v1 and v2 jobs produced three true and three false opinions on the same saved responses. Those ratings reflect different instructions. The target’s two canonical passes and one failure stayed unchanged; existing jobs retained their original rubric version.

### Use a historical version

The catalogue checkbox label names the latest version. Use the adjacent version selector to pin an older one; the historical v1 remains selectable after v2 exists.

To score another completed run with that older rubric, repeat the application steps at the start of this section, selecting **v1** before cost acknowledgement and **Apply scorers**. To inspect an existing v1 result, reselect its saved **Assessment job**.

![Latest catalogue label v2 with historical v1 selected for execution.](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/media/screenshots/evals-judging-historical-version.png)

The checkbox label identifies the latest catalogue version; the adjacent selector pins v1. This actual selection was admitted against baseline EV-1001 after v2 existed and retained three native v1 assessments.

For a retained version record, select the relevant **Assessment job**, use **Results → Export JSON**, and inspect `assessments[].provenance["martian.native_scorer_version"]`. **Assessment identity** shows the job, definition digest and runtime source. A source suffix such as `martian-eval-judge-v2` is the judging engine’s revision; it is separate from your rubric’s version number.

## Interpret and recover

Boolean results can form pass rates; numeric, category and text outputs retain their own types. Coverage and errors matter alongside scores. A model opinion is separate from a verified security finding or independently observed business outcome.

Ad hoc judgments do not automatically define a passing gate. **Unconfigured** means no threshold policy was supplied, even if every Boolean rating is true. For built-in criteria, a [scoring suite](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/suites-and-monitoring.md) can supply a threshold and minimum coverage. Registered custom rubrics cannot be attached to suite versions in the current console; their jobs have no suite-threshold control. Review their typed values and coverage directly.

A scoring request supports one to seven unique criteria. One active scoring job is allowed per organization. Completed runs are required. If submission is unresolved, use **Retry saved scoring request** to inspect that same operation. Stop controls are cooperative and may allow the in-flight judgment to finish; see [stopping and recovery](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/stopping-and-recovery.md).

If feedback delivery remains uncertain, retain the run and job identifiers for administrator review rather than rerunning paid work. Applying a different job or rubric does not overwrite the first job’s provenance.

Next, [apply a reusable suite](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/suites-and-monitoring.md) or [collect human reviews](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/human-reviews.md).
