# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A browser memory (pair-matching) game in plain JavaScript and SCSS, with no framework and no runtime dependencies. `index.html` is opened directly in a browser; there is no dev server. Code comments are a mix of Swedish and English.

## Build

Grunt compiles the sources in `src/` into the committed output files `js/script.min.js` and `css/style.css`, which `index.html` loads. **Edit only the files in `src/`, then rebuild.** Never hand-edit the generated files.

```sh
npm install
npx grunt          # dev: beautified JS (uglify:dev) and expanded CSS (sass:dev)
npx grunt build    # production: minified JS, compressed CSS, then postcss (pixrem, autoprefixer, cssnano)
npx grunt watch    # rebuild JS and SCSS on change (dev targets only)
```

The build output is committed, so rebuild before committing source changes. Uglify concatenates every `src/js/*.js` file into a single script.

There are no tests and no linter (`npm test` is a placeholder that exits with an error). The toolchain is old (grunt-sass 2 / node-sass, autoprefixer 6), so `npm install` may fail on recent Node versions.

## Architecture

All game logic is in `src/js/main.js`, written as global functions and global state:

- **Board size depends on the viewport.** At load time, `matchMedia` picks the `memory_array` of letter pairs: 10 pairs on mobile, 18 on tablet and 20 on desktop. The SCSS partials `_mobile.scss`, `_tablet.scss` and `_desktop.scss`, imported inside media queries in `style.scss`, size the tiles so that each grid fits. The breakpoints are ≤668px, 669–1024px and ≥1025px. If you change the pair count or a breakpoint, update both the JS and the SCSS.
- **Tiles** are built as an HTML string with inline `onclick="memoryFlipTile(this, 'X')"` handlers, so `memoryFlipTile` must stay global.
- **Flip state** is kept in `memory_values` and `memory_tile_ids`, which hold at most two entries each. A mismatch flips both tiles back after 700 ms using `sand.jpg` as the face-down background. Because the arrays only clear after that timeout, clicks are blocked until then.
- **Scoring:** a match is +5 and a mismatch is −2, never going below 0. The current score is stored in `localStorage['points']`. The top three scores are stored in `score1`, `score2` and `score3`, but these are reset to 0 on every page load, so high scores only last for the session. When the board is complete, `highScore()` shows an alert and `newBoard()` starts a new game.

`_mixins.scss` holds the shared colors, fonts (Google Fonts imports) and variables.
