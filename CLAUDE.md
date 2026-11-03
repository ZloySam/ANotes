# ANotes public site — rules for Claude

This repository is **public** and served as a website. Everything in it —
files, code comments, HTML comments, commit messages, branch names, PR text —
can be read by anyone. Treat every line as published.

## Rule: publish the minimum about the backend

Only what the browser strictly needs to work may appear here. For the signup
form that is the endpoint URL, the Turnstile **site** key and the CSP entry
that allows the endpoint. Nothing else about the backend.

Never put in this repo (files, comments or commit messages):

- Secrets of any kind: API keys, secret keys, tokens, passwords, credentials,
  private URLs with embedded tokens other than the one public form endpoint.
- Names of backend tools, hosting, servers, workflows, databases or vendors
  beyond what the page itself must load.
- Names or paths of private repos, internal docs, handoff notes, tickets or
  chats (e.g. "see <private repo> HANDOFF.md").
- Server behaviour details: validation rules, rate limits, retention jobs,
  error-handling logic, how spam filtering works, why a request shape is
  required. Keep code comments to what the code on this page does.
- Infrastructure details: IPs, ports, internal hostnames, environment
  variable names, file paths on servers, backup setup.
- Personal data: emails, phone numbers, chat IDs, user lists.

Exceptions: the privacy and terms pages must describe what happens to
visitors' data in plain, honest language. Describe it at the level a visitor
needs (what is stored, where in general terms, for how long, which third
party processes it) — not how it is built.

If a change needs backend detail to make sense, keep that detail in the
owner's private notes, not here, and don't name where they live.

## Commits and PRs

- Commit messages describe the visible change only ("Signup form: clearer
  error text"), never backend reasons or internal references.
- Do not add a `Claude-Session:` link or `Co-Authored-By:` trailer
  (also disabled in `.claude/settings.json`).
- Before every commit, check the diff for anything in the list above:
  `git diff --cached | grep -niE "secret|token|password|key|api|server|webhook|handoff|internal|@"`
  and review each hit. If something slipped into an earlier commit, tell the
  owner — removing it means rewriting history and force-pushing, which only
  the owner approves.
