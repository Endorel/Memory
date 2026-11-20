# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A browser memory (pair-matching) game written in plain JavaScript and CSS. Code comments are a mix of Swedish and English.

**The project uses no libraries, frameworks, build step or npm.** Keep it that way: don't add dependencies, preprocessors (Sass, etc.), bundlers or transpilers. The only external resource is Google Fonts, which `css/style.css` loads.

## Git workflow

The default branch is `main`. A GitHub ruleset blocks direct pushes, force pushes and deletion of `main`, so every change goes through a pull request: work on a branch, push it, and open a PR. No approvals are required, so the owner merges their own PRs. The ruleset only works because the repo is public; the owner is on GitHub's free plan, which doesn't enforce rulesets on private repos.

## Running

Open `index.html` in a browser. The files the browser loads are the source files (`js/logic.js`, `js/main.js` and `css/style.css`), so there is nothing to build. There is no linter.

## Tests

```sh
node --test                                              # run all tests
node --test --test-name-pattern="insertHighScore"        # run one group
```

Tests use only Node's built-in `node:test` and `node:assert`; there is no `package.json` and nothing to install. They live in `tests/*.test.js` and cover `js/logic.js` only; the DOM code in `js/main.js` has no automated tests, so check UI changes in a browser.

## Architecture

The JavaScript is split into two classic scripts (not ES modules, which don't load when `index.html` is opened from disk). `index.html` loads them in order, and they share globals:

- **`js/logic.js`:** the game rules as pure functions with no DOM or `localStorage` access: tile sets per layout, `shuffle`, points for a match or mismatch, and parsing and updating the high-score list. The tests load it into Node with `vm.runInThisContext`, so declare its globals with top-level `function` and `var` only (`const`/`let` wouldn't be visible to the tests), and put new game rules here so they can be tested.
- **`js/main.js`:** global state, DOM rendering, event handling and `localStorage`. It calls the functions in `logic.js`.

How the game works:

- **Board size depends on the viewport.** `newBoard()` asks `currentLayout()` which layout applies and builds 10 pairs on mobile, 18 on tablet and 20 on desktop (`tilesForLayout()`). `css/style.css` sizes the board and tiles for each layout with CSS custom properties that are overridden inside `min-width` media queries. The breakpoints are ≤668px, 669–1024px and ≥1025px; the JS also uses only `min-width` queries so it always agrees with the CSS. If you change the pair count or a breakpoint, update both files.
- **Layout changes:** when a resize or rotation crosses a breakpoint, `onLayoutChange()` rebuilds the board for the new layout, but only if no tile has been turned over yet (`game_started`). A game in progress keeps its board, and the next board uses the new layout.
- **Tiles** are built as an HTML string with inline `onclick="memoryFlipTile(this, 'X')"` handlers, so `memoryFlipTile` must stay global.
- **Flip state** is kept in `memory_values` and `memory_tile_ids`, which hold at most two entries each. A mismatch flips both tiles back after 700 ms using `sand.jpg` as the face-down background. Because the arrays only clear after that timeout, clicks are blocked until then.
- **Scoring:** a match is +5 and a mismatch is −2, never going below 0. The current score is stored in `localStorage['points']`. The top three scores persist between visits in `localStorage['highscores']` as a JSON array of numbers, highest first; `insertHighScore()` in `logic.js` works out the new list, `addHighScore()` saves it and `displayHighScores()` renders the list in `#highscores` below the board. When the board is complete, `highScore()` records the score, shows an alert and `newBoard()` starts a new game.

Known problems and planned improvements are tracked as GitHub issues on Endorel/Memory.
