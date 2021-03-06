//"use strict"


window.addEventListener('load', newBoard);
window.addEventListener('load', displayPoints);



var memory_array = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 
			'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'M', 'M', 'N', 'N'];
var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;

var mq_mobile = window.matchMedia( "(max-width: 668px)" );
var mq_tablet = window.matchMedia( "(min-width: 669px) and (max-width: 1023px)" );
var mq_desktop = window.matchMedia( "(min-width: 1024px)" );

if (mq_mobile.matches) {
	console.log('mobile');
	memory_array = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 
			'I', 'I', 'J', 'J']
} else if (mq_tablet.matches) {
	console.log('tablet');
	memory_array = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 
			'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'M', 'M', 'N', 'N', 'O', 'O', 'P', 'P', 'Q', 'Q', 'R', 'R'];
} else if (mq_desktop.matches) {
	console.log('desktop');

	memory_array = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 
			'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'M', 'M', 'N', 'N', 'O', 'O', 'P', 'P', 'Q', 'Q',
			 'R', 'R', 'S', 'S', 'T', 'T'];
};

localStorage.setItem('score1', 0);
localStorage.setItem('score2', 0);
localStorage.setItem('score3', 0);


Array.prototype.memory_tile_shuffle = function() { //use prototype to add a shuffle method to the array object
	var i = this.length, j, temp;
	while (--i > 0) {
		j = Math.floor(Math.random() * (i+1) );
		temp = this[j];
		this[j] = this[i];
		this[i] = temp;
	}
};

function newBoard() {

	//Reset the points counter
	localStorage.setItem('points', 0);
	displayPoints();

	//Create a new board
	tiles_flipped = 0;
	var output = '';
	memory_array.memory_tile_shuffle();
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
				points += 5;
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

					if (points > 1) { 
					points -= 2;
					localStorage.setItem('points', points);
					}else if (points == 1) { //points can't go below 0
						points -= 1;
						localStorage.setItem('points', points);
					}
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

function highScore () {
	console.log('higscore');
	var score1 = localStorage.getItem("score1");
	var score2 = localStorage.getItem("score2");
	var score3 = localStorage.getItem("score3");

	var points = localStorage.getItem("points");

	if (points > score1) {
		localStorage.setItem('score1', points);
		alert("Congratulations! You got the highest score! You got " + points + " points.");
		return;
	}else if (points > score2) {
		localStorage.setItem('score2', points);
		alert("Congratulations! You got 2nd place! You got " + points + " points.");
		return;		
	} else if (points > score3) {
		localStorage.setItem('score3', points);
		alert("Congratulations! You got 3rd place! You got " + points + " points.");
		return;
	}else{
		alert("You got " + points + " points. You did not make the high-score list.");
		return;
	}

}