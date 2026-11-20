"use strict";

//Game rules with no DOM or storage access, so they can be unit tested in Node
//(see tests/). Loaded as a classic script before main.js, which uses these
//functions as globals. Use top-level `function` and `var` only: the tests read
//the file's globals, and `const`/`let` would not be visible to them.

var MATCH_POINTS = 5;
var MISMATCH_PENALTY = 2;
var HIGH_SCORE_COUNT = 3;

//The letter pairs for each layout: 10 pairs on mobile, 18 on tablet, 20 on desktop
function tilesForLayout(layout) {
	if (layout == 'desktop') {
		return ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H',
			'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'M', 'M', 'N', 'N', 'O', 'O', 'P', 'P', 'Q', 'Q',
			 'R', 'R', 'S', 'S', 'T', 'T'];
	} else if (layout == 'tablet') {
		return ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H',
			'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'M', 'M', 'N', 'N', 'O', 'O', 'P', 'P', 'Q', 'Q', 'R', 'R'];
	}
	return ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H',
		'I', 'I', 'J', 'J'];
}

//Fisher-Yates shuffle, in place. `random` defaults to Math.random; tests pass
//their own so the result is predictable. Returns the same array.
function shuffle(array, random) {
	random = random || Math.random;
	var i = array.length, j, temp;
	while (--i > 0) {
		j = Math.floor(random() * (i + 1));
		temp = array[j];
		array[j] = array[i];
		array[i] = temp;
	}
	return array;
}

function pointsAfterMatch(points) {
	return points + MATCH_POINTS;
}

//Points can't go below 0
function pointsAfterMismatch(points) {
	return Math.max(0, points - MISMATCH_PENALTY);
}

//Reads the stored high-score list. Anything that isn't a JSON array of numbers
//is ignored, so a damaged value can't break the game.
function parseHighScores(json) {
	var scores;
	try {
		scores = JSON.parse(json);
	} catch (e) {
		return [];
	}
	if (!Array.isArray(scores)) {
		return [];
	}
	return scores.filter(function (score) {
		return typeof score === 'number' && isFinite(score);
	}).slice(0, HIGH_SCORE_COUNT);
}

//Adds a score to a list sorted highest first, without changing the original.
//Returns the new list and the place the score got (0 = first), or -1 if it
//didn't make the list. A new score goes below any equal scores, so a tie never
//pushes an older score down, and 0 points never makes the list.
function insertHighScore(scores, points) {
	var place = 0;
	while (place < scores.length && scores[place] >= points) {
		place++;
	}
	if (points <= 0 || place >= HIGH_SCORE_COUNT) {
		return { scores: scores.slice(), place: -1 };
	}
	var updated = scores.slice();
	updated.splice(place, 0, points);
	return { scores: updated.slice(0, HIGH_SCORE_COUNT), place: place };
}

function highScoreMessage(points, place) {
	var placeNames = ['the highest score', '2nd place', '3rd place'];
	if (place == -1) {
		return "You got " + points + " points. You did not make the high-score list.";
	}
	return "Congratulations! You got " + placeNames[place] + "! You got " + points + " points.";
}
