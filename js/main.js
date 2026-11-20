//"use strict"


window.addEventListener('load', newBoard);
window.addEventListener('load', displayPoints);
window.addEventListener('load', displayHighScores);



var memory_array = [];
var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;
var board_layout = ''; //the layout ('mobile', 'tablet' or 'desktop') the current board was built for
var game_started = false; //true once a tile on the current board has been turned over

// Keep these breakpoints in sync with the media queries in css/style.css,
// which also only use min-width, so every width maps to exactly one layout.
var mq_tablet = window.matchMedia( "(min-width: 669px)" );
var mq_desktop = window.matchMedia( "(min-width: 1025px)" );

function currentLayout() {
	if (mq_desktop.matches) {
		return 'desktop';
	} else if (mq_tablet.matches) {
		return 'tablet';
	}
	return 'mobile';
}

//When the window is resized or the device rotated into another layout, build a
//board with the right number of tiles. A game in progress is left alone so no
//progress is lost; the next board will use the new layout.
function onLayoutChange() {
	if (currentLayout() != board_layout && !game_started) {
		newBoard();
	}
}
mq_tablet.addEventListener('change', onLayoutChange);
mq_desktop.addEventListener('change', onLayoutChange);

//High scores are kept between visits as a JSON array of numbers, highest first
var HIGH_SCORE_KEY = 'highscores';

//Remove the keys used by older versions, which were reset on every page load
localStorage.removeItem('score1');
localStorage.removeItem('score2');
localStorage.removeItem('score3');

function newBoard() {

	//Reset the points counter
	localStorage.setItem('points', 0);
	displayPoints();

	//Create a new board sized for the current layout
	tiles_flipped = 0;
	game_started = false;
	board_layout = currentLayout();
	memory_array = shuffle(tilesForLayout(board_layout));
	var output = '';
	for (var i = 0; i < memory_array.length; i++) {
		
		output += '<div id="tile_' + i +'" onclick="memoryFlipTile(this, \'' + memory_array[i] + '\')"></div>';

		}
	document.getElementById('memory_board').innerHTML = output;
}

function memoryFlipTile (tile, val) {

	//create the points variable
	var points = localStorage.getItem('points');
	points = parseInt(points, 10);

	//Check the number of tiles that are flipped, 1 or 2
	if (tile.innerHTML == "" && memory_values.length < 2) {
		game_started = true;
		tile.style.background = '#FFF';
		tile.innerHTML = val;
		if (memory_values.length == 0) {
			memory_values.push(val);
			memory_tile_ids.push(tile.id);
		}else if (memory_values.length == 1) {
			console.log('Memory values: ', memory_values);
			memory_values.push(val);
			memory_tile_ids.push(tile.id);

			//Compare values of the flipped tiles and change the points accordingly
			if (memory_values[0] == memory_values[1]) {
				tiles_flipped += 2;
				points = pointsAfterMatch(points);
				localStorage.setItem('points', points);
				displayPoints();

				//check to see if the board is completed
				if (tiles_flipped == memory_array.length) {
					console.log('Board complete');
					//displayPoints();
					highScore ();
					document.getElementById('memory_board').innerHTML = "";
					newBoard();
				}

				//clear both arrays
				memory_values = [];
				memory_tile_ids = [];

			}else { //if tiles do not match
				function flip2back () {
					
					//flip the two tiles
					var tile_1 = document.getElementById(memory_tile_ids[0]);
					var tile_2 = document.getElementById(memory_tile_ids[1]);
					tile_1.style.background = 'url(sand.jpg) no-repeat';
					tile_1.innerHTML = "";
					tile_2.style.background = 'url(sand.jpg) no-repeat';
					tile_2.innerHTML = "";

					points = pointsAfterMismatch(points);
					localStorage.setItem('points', points);
					displayPoints();
					//clear both arrays
					memory_values = [];
					memory_tile_ids = [];
				}
				setTimeout(flip2back, 700);
			}
		}
	}
}

function displayPoints() {

	var points = localStorage.getItem("points");

	document.getElementById("points").innerHTML = "<h2>Points: " + points + "</h2>";
}

function loadHighScores() {
	return parseHighScores(localStorage.getItem(HIGH_SCORE_KEY));
}

//Returns the place (0 = first) the score got on the list, or -1 if it didn't make it
function addHighScore(points) {
	var result = insertHighScore(loadHighScores(), points);
	if (result.place != -1) {
		localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(result.scores));
	}
	return result.place;
}

function displayHighScores() {
	var scores = loadHighScores();
	var container = document.getElementById('highscores');
	var heading = document.createElement('h2');
	heading.textContent = 'High scores';
	container.innerHTML = '';
	container.appendChild(heading);

	if (scores.length == 0) {
		var empty = document.createElement('p');
		empty.textContent = 'No high scores yet.';
		container.appendChild(empty);
		return;
	}

	var list = document.createElement('ol');
	for (var i = 0; i < scores.length; i++) {
		var item = document.createElement('li');
		item.textContent = scores[i] + ' points';
		list.appendChild(item);
	}
	container.appendChild(list);
}

function highScore () {
	var points = parseInt(localStorage.getItem('points'), 10) || 0;
	var place = addHighScore(points);

	displayHighScores();
	alert(highScoreMessage(points, place));
}