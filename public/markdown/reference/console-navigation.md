# Find your way around the console

> Locate every customer console area, its guide and the boundary between available workflows, templates and previews.

Source: [Web version](https://docs.martiansecurity.ai/reference/console-navigation/)

The console sidebar groups current work, adversary material, history and organization access. This map follows the inspected customer interface; controls can additionally depend on your role, project and readiness. Use [verification records](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md) to see which walkthroughs were actually exercised.

| Console area | What to do there | Guide |
| --- | --- | --- |
| Overview | Inspect the displayed agent page’s latest standing, declared reach and recorded coverage; a held result is not a general security guarantee | [Evidence and coverage](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/evidence-and-results.md) |
| New assessment | Configure one approved, bounded security test | [First assessment](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/get-started/first-assessment.md) and [wizard options](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/configure.md) |
| Evals | Work with datasets, runs, traces, summaries, judges and reviews | [First evaluation](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/first-run.md) and [Evals dashboard](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/overview.md) |
| Agents | Register, validate, approve and manage authorized connections | [Connections](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/agents/connections.md) |
| Discovery | Collect inventory; inspect runtime/network evidence and explicitly enrolled call controls | [Sources](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/discovery/inventory.md), [runtime](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/discovery/runtime-and-blast-radius.md), [network observation](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/discovery/network-observation.md) and [call gates](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/discovery/call-gates.md) |
| Replay | Read retained assessment evidence without executing it again | [History and exports](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md) |
| Environments | Prepare synthetic systems and manage their sandbox lifecycle | [Environments](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/environments/create-and-launch.md) |
| Pipeline | Download an illustrative policy template; its displayed `martian scan` command is not a supported SDK command | [Supported SDK/CI workflow](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/sdk/ci.md) |
| Attack Library | Inspect catalogue availability, taxonomy and declared gaps, then choose supported tests | [Library coverage](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/library/coverage.md) |
| Threat Intel | Inspect the feed state; the recorded interface has no live feed connected | [Library and feed limits](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/library/coverage.md) |
| Assessments / Findings / Reports | Find saved runs, inspect observations and download the appropriate retained evidence | [Reports and exports](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/assessments/history-and-exports.md) |
| Team | Invite teammates and inspect organization roles | [Team and roles](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/workspace/team-and-roles.md) |

## Inside Evals

-   **Overview** summarizes matching native traces; it is separate from a run’s Overview and from **Monitoring**.
-   **Traces** opens native evidence, conversations, saved views and [human annotations](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/trace-annotations.md).
-   **Runs** holds canonical evaluation results and the organization-wide CI sessions area; **Compare** pairs saved runs.
-   **Datasets** holds published versions and drafts. **Judges** manages saved-output criteria. **Reviews** holds assigned questions; **Quality issues** groups recorded error/failed-Boolean signals.
-   **Scoring suites** and **Monitoring** provide versioned criteria and gate history. [Choose a named project](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/evals/projects.md) deliberately; project selection changes the accessible scope.

## Account menu

The account control at the bottom of the sidebar opens **Profile**, **Theme** and **Sign out**. Profile shows your signed-in identity, role, organization and reported Agents-runtime provisioning status. It is not an account-editing or credential-issuance form. A provisioning label alone does not prove all target, model or sandbox services are ready.

**Master admin** appears only for platform operators. Organization creation/global catalogue administration and infrastructure installation remain separate from these customer tasks; ask the relevant operator when those prerequisites are absent.

Continue with [roles](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/permissions.md), [supported targets](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/supported-targets.md) or [troubleshooting](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/troubleshooting.md).
