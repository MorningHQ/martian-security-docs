# Use these docs with an AI assistant

> Copy a complete page or share a public Markdown link that an assistant can read without signing in.

Source: [Web version](https://docs.martiansecurity.ai/reference/using-with-agents/)

Every documentation page has **Copy page** above its title. It copies the article as Markdown, including code examples, prerequisites, verification notices and screenshot links.

## Share a page

1.  Open the guide you need.
2.  Select **Copy page** and paste it into your assistant’s chat.
3.  To share a link instead, open the arrow beside **Copy page** and select **Copy agent link**. Paste the link into your chat and ask the assistant to read it.

The agent link opens a public, plain-text Markdown copy on GitHub. It needs no account, JavaScript or product access. This separate HTTPS route also works while the documentation domain’s HTTPS certificate is being provisioned. The content includes a link back to the web version.

**View Markdown** opens the same plain-text page. Use it if your browser blocks clipboard access, or if JavaScript is disabled. Select and copy its text manually.

## Give an assistant more context

-   [Agent index](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/llms.txt): a list of pages with short descriptions and direct Markdown links. The page menu also links to this index.
-   [Complete documentation](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/llms-full.txt): every page in one text file. It is larger; start with a specific guide when possible.

The site publishes the same files at `/markdown/<page-path>.md`, `/llms.txt` and `/llms-full.txt`. Each HTML page advertises its Markdown alternatives in its document head, so tools that inspect page metadata can discover them.

## Keep the guide’s limits in context

A copied page retains its role requirements, walkthrough qualification and links to the tested-version record. Ask the assistant to check those before suggesting a step. A partly verified guide still has unverified steps; a Markdown copy does not change that status. See [Verification and limitations](https://raw.githubusercontent.com/MorningHQ/martian-security-docs/main/public/markdown/reference/verification.md).

These are public instructions. Sharing a page does not give an assistant access to your workspace, API keys or authenticated product. Supply only the context you intend to share.
