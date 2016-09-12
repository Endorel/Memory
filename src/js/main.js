//"use strict"


window.addEventListener('load', newBoard);
window.addEventListener('load', displayPoints);



var memory_array = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 
			'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'M', 'M', 'N', 'N'];
var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;

var mq_mobile = window.matchMedia( "(max-width: 668px)" );
var mq_tablet = window.matchMedia( "(min-width: 669px)" );
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
			 'R', 'R', 'S', 'S', 'T', 'T', 'U', 'U', 'V', 'V', 'W', 'W', 'X', 'X', 'Y', 'Y', 'Z', 'Z'];
};

localStorage.setItem('score1', 0);
localStorage.setItem('score2', 0);
localStorage.setItem('score3', 0);
localStorage.setItem('score4', 0);
localStorage.setItem('score5', 0);
localStorage.setItem('score6', 0);
localStorage.setItem('score7', 0);
localStorage.setItem('score8', 0);
localStorage.setItem('score9', 0);
localStorage.setItem('score10', 0);


Array.prototype.memory_tile_shuffle = function() { //lägg till en shuffle method till array objektet via prototype
	var i = this.length, j, temp;
	while (--i > 0) {
		j = Math.floor(Math.random() * (i+1) );
		temp = this[j];
		this[j] = this[i];
		this[i] = temp;
	}
};

function newBoard() {

	//Återställ poängräknaren
	localStorage.setItem('points', 0);
	displayPoints();

	//Skapa nytt bräde
	tiles_flipped = 0;
	var output = '';
	memory_array.memory_tile_shuffle();
	for (var i = 0; i < memory_array.length; i++) {
		
		output += '<div id="tile_' + i +'" onclick="memoryFlipTile(this, \'' + memory_array[i] + '\')"></div>';

		}
	document.getElementById('memory_board').innerHTML = output;
}

function memoryFlipTile (tile, val) {

	//skapa en variabel för poängen
	var points = localStorage.getItem('points');
	points = parseInt(points, 10);

	//Kontrollera hur många brickor som är vända, 1 eller 2
	if (tile.innerHTML == "" && memory_values.length < 2) {
		tile.style.background = '#FFF';
		tile.innerHTML = val;
		if (memory_values.length == 0) {
			memory_values.push(val);
			memory_tile_ids.push(tile.id);
		}else if (memory_values.length == 1) {
			memory_values.push(val);
			memory_tile_ids.push(tile.id);

			//Kolla om brickorna har samma värde och räkna upp poängen
			if (memory_values[0] == memory_values[1]) {
				tiles_flipped += 2;
				points += 5;
				localStorage.setItem('points', points);
				displayPoints();

				//rensa båda arrayer
				memory_values = [];
				memory_tile_ids = [];

				//Kolla om hela brädet är avklarat
				if (tiles_flipped == memory_array.length) {
					highScore ();
					document.getElementById('memory_board').innerHTML = "";
					newBoard();
				}
			}else { //Om brickornas värde inte stämde
				function flip2back () {
					
					//Vänd tillbaka de två korten
					var tile_1 = document.getElementById(memory_tile_ids[0]);
					var tile_2 = document.getElementById(memory_tile_ids[1]);
					tile_1.style.background = 'url(sand.jpg) no-repeat';
					tile_1.innerHTML = "";
					tile_2.style.background = 'url(sand.jpg) no-repeat';
					tile_2.innerHTML = "";

					if (points > 0) { //om poängen redan är på 0 kan man inte förlora poäng.
					points -= 2;
					localStorage.setItem('points', points);
					}
					displayPoints();
					//rensa båda arrayer
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

	document.getElementById("points").innerHTML = "<h2>Poäng: " + points + "</h2>";
}

function highScore () {
	var score1 = localStorage.getItem("score1");
	var score2 = localStorage.getItem("score2");
	var score3 = localStorage.getItem("score3");
	var score4 = localStorage.getItem("score4");
	var score5 = localStorage.getItem("score5");
	var score6 = localStorage.getItem("score6");
	var score7 = localStorage.getItem("score7");
	var score8 = localStorage.getItem("score8");
	var score9 = localStorage.getItem("score9");
	var score10 = localStorage.getItem("score10");

	var points = localStorage.getItem("points");

	if (points > score1) {
		localStorage.setItem('score1', points);
		alert("Grattis du toppade highscore-listan! Du fick " + points + " poäng.");
		return;
	}else if (points > score2) {
		localStorage.setItem('score2', points);
		alert("Grattis du kom 2:a på highscore-listan! Du fick " + points + " poäng.");
		return;		
	} else if (points > score3) {
		localStorage.setItem('score3', points);
		alert("Grattis du kom 3:a på highscore-listan! Du fick " + points + " poäng.");
		return;
	}else if (points > score4) {
		localStorage.setItem('score4', points);
		alert("Grattis du kom 4:a på highscore-listan! Du fick " + points + " poäng.");
		return;
	}else if (points > score5) {
		localStorage.setItem('score5', points);
		alert("Grattis du kom 5:a på highscore-listan! Du fick " + points + " poäng.");
		return;
	}else if (points > score6) {
		localStorage.setItem('score6', points);
		alert("Grattis du kom 6:a på highscore-listan! Du fick " + points + " poäng.");
		return;
	}else if (points > score7) {
		localStorage.setItem('score7', points);
		alert("Grattis du kom 7:a på highscore-listan! Du fick " + points + " poäng.");
		return;
	}else if (points > score8) {
		localStorage.setItem('score8', points);
		alert("Grattis du kom 8:a på highscore-listan! Du fick " + points + " poäng.");
		return;
	}else if (points > score9) {
		localStorage.setItem('score9', points);
		alert("Grattis du kom 9:a på highscore-listan! Du fick " + points + " poäng.");
		return;
	}else if (points > score10) {
		localStorage.setItem('score10', points);
		alert("Grattis du kom 10:a på highscore-listan! Du fick " + points + " poäng.");
		return;
	}else{
		alert(" Du fick " + points + " poäng. Tyvärr kom du inte in på highscore-listan.");
	}

}//funktionen