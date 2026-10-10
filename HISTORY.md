# wander — what changed, in plain words

Newest first. Entries before the first one here are still to be written (the backfill).

## October 2026

**wander #20: security updates for the borrowed building blocks, in one go** · [PR #20](https://github.com/travis-horton/wander/pull/20) · merged 26.1010.1150 · v1.0.0
- Behind the scenes: brought 17 borrowed building blocks (the web server, the live-connection library, the test runner and 14 smaller pieces they rely on) up to their makers' patched versions, replacing 15 separate automatic update requests. Known security warnings drop from 75 to 61; the game page and its live connection load the same as before.
  Behind the scenes: the project now keeps a plain-language history that adds an entry by itself each time a change is merged.
