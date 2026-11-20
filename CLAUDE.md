# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A browser memory (pair-matching) game written in plain JavaScript and CSS. Code comments are a mix of Swedish and English.

**The project uses no libraries, frameworks, build step or npm.** Keep it that way: don't add dependencies, preprocessors (Sass, etc.), bundlers or transpilers. The only external resource is Google Fonts, which `css/style.css` loads.

## Running

Open `index.html` in a browser. The files the browser loads are the source files: `js/main.js` and `css/style.css`, so there is nothing to build. There are no tests and no linter.

## Architecture

All game logic is in `js/main.js`, written as global functions and global state:

- **Board size depends on the viewport.** At load time, `matchMedia` picks the `memory_array` of letter pairs: 10 pairs on mobile, 18 on tablet and 20 on desktop. `css/style.css` sizes the board and tiles for each layout with CSS custom properties that are overridden inside `min-width` media queries. The breakpoints are ≤668px, 669–1024px and ≥1025px. If you change the pair count or a breakpoint, update both files.
- **Tiles** are built as an HTML string with inline `onclick="memoryFlipTile(this, 'X')"` handlers, so `memoryFlipTile` must stay global.
- **Flip state** is kept in `memory_values` and `memory_tile_ids`, which hold at most two entries each. A mismatch flips both tiles back after 700 ms using `sand.jpg` as the face-down background. Because the arrays only clear after that timeout, clicks are blocked until then.
- **Scoring:** a match is +5 and a mismatch is −2, never going below 0. The current score is stored in `localStorage['points']`. The top three scores are stored in `score1`, `score2` and `score3`, but these are reset to 0 on every page load, so high scores only last for the session. When the board is complete, `highScore()` shows an alert and `newBoard()` starts a new game.

Known problems and planned improvements are tracked as GitHub issues on Endorel/Memory.
