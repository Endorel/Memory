// Unit tests for js/logic.js, using only Node's built-in test runner.
// Run from the repository root with: node --test

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// js/logic.js is a classic browser script, not a module, so run it the way a
// <script> tag would: its top-level functions and vars become globals.
const logicFile = path.join(__dirname, '..', 'js', 'logic.js');
vm.runInThisContext(fs.readFileSync(logicFile, 'utf8'), { filename: logicFile });

function countLetters(tiles) {
	const counts = {};
	for (const tile of tiles) {
		counts[tile] = (counts[tile] || 0) + 1;
	}
	return counts;
}

test('tilesForLayout', async (t) => {
	await t.test('gives 10, 18 and 20 pairs for mobile, tablet and desktop', () => {
		assert.equal(tilesForLayout('mobile').length, 20);
		assert.equal(tilesForLayout('tablet').length, 36);
		assert.equal(tilesForLayout('desktop').length, 40);
	});

	await t.test('contains every letter exactly twice', () => {
		for (const layout of ['mobile', 'tablet', 'desktop']) {
			const counts = countLetters(tilesForLayout(layout));
			for (const letter of Object.keys(counts)) {
				assert.equal(counts[letter], 2, layout + ': ' + letter);
			}
		}
	});

	await t.test('falls back to the mobile set for an unknown layout', () => {
		assert.deepEqual(tilesForLayout('watch'), tilesForLayout('mobile'));
	});

	await t.test('returns a new array each time, so shuffling one board does not affect the next', () => {
		const first = tilesForLayout('mobile');
		first.reverse();
		assert.equal(tilesForLayout('mobile')[0], 'A');
	});
});

test('shuffle', async (t) => {
	await t.test('shuffles in place and returns the same array', () => {
		const tiles = ['A', 'A', 'B', 'B'];
		assert.equal(shuffle(tiles), tiles);
	});

	await t.test('keeps exactly the same tiles', () => {
		const tiles = tilesForLayout('desktop');
		const shuffled = shuffle(tiles.slice());
		assert.deepEqual(shuffled.slice().sort(), tiles.slice().sort());
	});

	await t.test('is a Fisher-Yates shuffle driven by the random function', () => {
		// random() == 0 always swaps with the first element
		assert.deepEqual(shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1]);
		// random() just below 1 always swaps an element with itself
		assert.deepEqual(shuffle([1, 2, 3, 4], () => 0.999), [1, 2, 3, 4]);
	});

	await t.test('handles empty and one-element arrays', () => {
		assert.deepEqual(shuffle([]), []);
		assert.deepEqual(shuffle(['A']), ['A']);
	});

	await t.test('can produce every ordering', () => {
		const seen = new Set();
		for (let i = 0; i < 2000; i++) {
			seen.add(shuffle(['A', 'B', 'C']).join(''));
		}
		assert.equal(seen.size, 6);
	});
});

test('points', async (t) => {
	await t.test('a match adds 5', () => {
		assert.equal(pointsAfterMatch(0), 5);
		assert.equal(pointsAfterMatch(7), 12);
	});

	await t.test('a mismatch subtracts 2 but never goes below 0', () => {
		assert.equal(pointsAfterMismatch(10), 8);
		assert.equal(pointsAfterMismatch(2), 0);
		assert.equal(pointsAfterMismatch(1), 0);
		assert.equal(pointsAfterMismatch(0), 0);
	});
});

test('parseHighScores', async (t) => {
	await t.test('reads a stored list', () => {
		assert.deepEqual(parseHighScores('[40,20]'), [40, 20]);
	});

	await t.test('returns an empty list when nothing is stored', () => {
		assert.deepEqual(parseHighScores(null), []);
	});

	await t.test('ignores damaged values', () => {
		assert.deepEqual(parseHighScores('not json'), []);
		assert.deepEqual(parseHighScores('{"a":1}'), []);
		assert.deepEqual(parseHighScores('"10"'), []);
	});

	await t.test('drops entries that are not finite numbers', () => {
		assert.deepEqual(parseHighScores('[5,"x",null,3]'), [5, 3]);
		assert.deepEqual(parseHighScores('[1e999,4]'), [4]);
	});

	await t.test('keeps at most 3 scores', () => {
		assert.deepEqual(parseHighScores('[9,8,7,6]'), [9, 8, 7]);
	});
});

test('insertHighScore', async (t) => {
	await t.test('adds the first score as 1st place', () => {
		assert.deepEqual(insertHighScore([], 10), { scores: [10], place: 0 });
	});

	await t.test('compares scores as numbers (#1)', () => {
		assert.deepEqual(insertHighScore([10], 9), { scores: [10, 9], place: 1 });
		assert.deepEqual(insertHighScore([10, 9], 15), { scores: [15, 10, 9], place: 0 });
	});

	await t.test('moves lower scores down instead of overwriting them (#2)', () => {
		assert.deepEqual(insertHighScore([15, 10, 9], 12), { scores: [15, 12, 10], place: 1 });
		assert.deepEqual(insertHighScore([100, 15, 12], 200), { scores: [200, 100, 15], place: 0 });
	});

	await t.test('puts a tie below the existing score', () => {
		assert.deepEqual(insertHighScore([15], 15), { scores: [15, 15], place: 1 });
	});

	await t.test('a tie with 3rd place does not make a full list', () => {
		assert.deepEqual(insertHighScore([15, 12, 10], 10), { scores: [15, 12, 10], place: -1 });
	});

	await t.test('0 or fewer points never make the list', () => {
		assert.equal(insertHighScore([], 0).place, -1);
		assert.equal(insertHighScore([], -5).place, -1);
	});

	await t.test('does not change the list it was given', () => {
		const scores = [15, 10, 9];
		insertHighScore(scores, 12);
		assert.deepEqual(scores, [15, 10, 9]);
	});
});

test('highScoreMessage', () => {
	assert.equal(highScoreMessage(100, 0), 'Congratulations! You got the highest score! You got 100 points.');
	assert.equal(highScoreMessage(80, 1), 'Congratulations! You got 2nd place! You got 80 points.');
	assert.equal(highScoreMessage(60, 2), 'Congratulations! You got 3rd place! You got 60 points.');
	assert.equal(highScoreMessage(5, -1), 'You got 5 points. You did not make the high-score list.');
});
