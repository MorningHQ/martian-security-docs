# Roles and permissions

> Check the minimum role for each customer task.

Source: [Web version](https://docs.martiansecurity.ai/reference/permissions/)

Permissions apply within your organization. Your console session and a machine API key are separate forms of access. This table summarizes the current source contract; the live interface can additionally withhold an action when setup, target approval or environment policy is not ready.

| Task | Viewer | Member | Admin / owner |
| --- | --- | --- | --- |
| Browse authorized assessments, results, datasets and Evals history | Yes | Yes | Yes |
| Launch/stop assessments and Evals | No | Yes | Yes |
| Create/configure environments and manage their sandbox lifecycle | No | Yes | Yes |
| Register, validate, approve, rotate or disable agent connections | No | No | Yes |
| Import/edit dataset drafts | No | Yes | Yes |
| Publish an organization dataset | No | No | Yes |
| Create/archive Evals projects; register custom model judges | No | No | Yes |
| Score saved outputs, create suites/questions, complete assigned reviews | No | Yes | Yes |
| Triage quality issues | No | Yes | Yes |
| Assign another eligible reviewer; manage organization API keys and team invitations | No | No | Yes |

Platform-admin organization and global-dataset administration are separate operator capabilities. These customer guides do not grant them.

## Machine credentials

A scoped API key authorizes only its granted capabilities and resource restrictions. It does not sign a person in to the console, enable a hosted feature or provide a target model’s credentials. Existing Evals keys do not automatically gain hosted redteam rights.

[Create and configure an SDK key](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/sdk/install-and-configure.md) and [read team management](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/workspace/team-and-roles.md) for the actual controls.

## If a control is missing or disabled

1.  Confirm the organization and your current role.
2.  Read the page’s setup/readiness message.
3.  Check target approval and the selected project’s state.
4.  Ask an admin for the specific missing role or capability. Do not share an owner’s password or API token.
