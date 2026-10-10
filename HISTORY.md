# wander — what changed, in plain words

Newest first, back to the project's first day.

## October 2026

**wander #20: security updates for the borrowed building blocks, in one go** · [PR #20](https://github.com/travis-horton/wander/pull/20) · merged 26.1010.1150 · v1.0.0
- Behind the scenes: brought 17 borrowed building blocks (the web server, the live-connection library, the test runner and 14 smaller pieces they rely on) up to their makers' patched versions, replacing 15 separate automatic update requests. Known security warnings drop from 75 to 61; the game page and its live connection load the same as before.
  Behind the scenes: the project now keeps a plain-language history that adds an entry by itself each time a change is merged.

## April 2021

**Automatic security update: y18n** · [PR #4](https://github.com/travis-horton/wander/pull/4) · merged 21.0401.0935 · v0.1.9
- Behind the scenes: accepted an automatic update of y18n, a small piece the test tool relies on, from 4.0.0 to 4.0.1, which fixes a known security problem.

**Automatic security update: socket.io** · [PR #3](https://github.com/travis-horton/wander/pull/3) · merged 21.0401.0935 · v0.1.8
- Behind the scenes: accepted an automatic update of socket.io, the live-connection library meant to link players' browsers to the server (not yet wired into the game), from 2.3.0 to 2.4.0, which fixes a known security problem.

**Automatic security update: lodash** · [PR #2](https://github.com/travis-horton/wander/pull/2) · merged 21.0401.0934 · v0.1.7
- Behind the scenes: accepted an automatic update of lodash, a helper library several of the tools rely on, from 4.17.15 to 4.17.19, which fixes a known security problem.

**Automatic security update: acorn** · [PR #1](https://github.com/travis-horton/wander/pull/1) · merged 21.0401.0934 · v0.1.6
- Behind the scenes: accepted an automatic update of acorn, a code reader the test and style tools rely on, from 6.4.0 to 6.4.1, which fixes a known security problem.

## November 2020

**Runs in a Docker container** · [commit](https://github.com/travis-horton/wander/commit/c614825) · merged 20.1112.2210 · v0.1.5
- New: instructions for Docker, so the game's server can run inside a sealed container with its own copy of Node (version 13.12) and answer on the standard web port.
  Behind the scenes: brought back the test file removed on 20.0223, with its two checks (that the test tool runs at all, and that adding two arrows of movement gives the right result).

## April 2020

**Building blocks updated** · [commit](https://github.com/travis-horton/wander/commit/96f2cce) · merged 20.0427.0840 · v0.1.4
- Behind the scenes: moved the web server library (Express), the live-connection library (socket.io), and the test and code-style tools to their newest minor versions. Nothing in the game changed.

## February 2020

**Test notes** · [commit](https://github.com/travis-horton/wander/commit/f69789f) · merged 20.0223.1721 · v0.1.3
- Behind the scenes: the README gained a reminder to use jest-babel to get the test tool working, the test tool was told to look at the newer kind of code file too, and the test file was removed while you looked for a setup that worked. (Later restored on 20.1112.)

**Getting the tests to run** · [commit](https://github.com/travis-horton/wander/commit/f58be9f) · merged 20.0216.1020 · v0.1.2
- Behind the scenes: renamed the game's code files to the older, more common kind so the test tool could read them (the page loads them under their new names and plays the same), and added a test file with two checks: that the test tool runs at all, and that adding two arrows of movement gives the right result.

**Housekeeping and a first try at tests** · [commits](https://github.com/travis-horton/wander/commits/master?since=2020-02-14&until=2020-02-14) · merged 20.0214.2019 · v0.1.1
- **[Test tool setup](https://github.com/travis-horton/wander/commit/dfff9bc)** · merged 20.0214.2019
  Behind the scenes: moved the test tool (Jest) to a newer version, added a second test tool (Mocha) to try, created Jest's default settings file, and removed the first test file, which couldn't run yet.
- **[Files git leaves out](https://github.com/travis-horton/wander/commit/c266c96)** · merged 20.0214.1508
  Behind the scenes: the list of files git ignores grew to cover logs, npm's cache, the test tool's settings, and private settings files.

**The game begins** · [commits](https://github.com/travis-horton/wander/commits/master?since=2020-02-07&until=2020-02-07) · merged 20.0207.1844 · v0.1.0
- **[The first playable sketch](https://github.com/travis-horton/wander/commit/b92435b)** · merged 20.0207.1843
  New: Wander, your RPG idea, described in the README as "you and a group roam the internet and fight html elements", starts with a basic RPG. A small web server shows a square play area; you choose warrior, wizard or healer, then move with the arrow keys or W, A, S, D (Q and E step sideways). Space and 1 use your class's two abilities (sword swing and shield, fireball and teleport, or heal and drain), walking off an edge takes you to the next screen, and a side panel shows your health, abilities, screen and cooldown.
  Behind the scenes: the first test, which checks that adding two arrows of movement gives the right result, and a code-style checker.
- **[Old versions archived, then removed](https://github.com/travis-horton/wander/commit/09dbac5)** · merged 20.0207.1844
  Behind the scenes: the first commit also carried three older versions of the game from before you used git (a first version with its own live-connection server, a canvas version, and an attempt to rebuild it with React), kept in an archive folder. A minute later the folder was removed, since git now keeps the history; the old versions can still be found in that first commit ([b92435b](https://github.com/travis-horton/wander/commit/b92435b)).
