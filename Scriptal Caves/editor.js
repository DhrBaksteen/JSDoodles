var gameCanvas = null;
var mapTable = null;
var editTable = null;
var tileset = null;
var debug = null;

var tile = 1;
var map = null;
var mapBg = null;
var mapFlags = null;
var tp = 34;


function createGame () {
	gameCanvas = document.getElementById ("gameCanvas");
	mapTable   = document.getElementById ("mapTable");
	editTable  = document.getElementById ("editTable");
	tileset    = document.getElementById ("tileset");
	
	map = [[]];
	mapBg = [[]];
	mapFlag = [[]];
	
	for (var y = 0; y < 12; y ++) {
		var row  = document.createElement ("tr");
		var eRow = document.createElement ("tr");
		
		for (var x = 0; x < 20; x ++) {
			var col  = document.createElement ("td");
			var eCol = document.createElement ("td");
			
			eCol.className = "editCell";
			eCol.onclick = function () { editCell (this); }
			eCol.innerHTML = "<span></span>";
			col.className = "mapCell";
			
			row.appendChild (col);
			eRow.appendChild (eCol);
		}
		
		mapTable.appendChild (row);
		editTable.appendChild (eRow);
	}
	
	
	for (var y = 0; y < 115; y ++) {
		var row  = document.createElement ("tr");
		
		for (var x = 0; x < 10; x ++) {
			var col  = document.createElement ("td");
			
			col.className = "editCell";
			col.onclick = function () { pickTile (this); }
			col.innerHTML = "<img src=\"tiles/" + (y * 10 + x) + ".gif\" />";
			
			row.appendChild (col);
		}
		
		tileset.appendChild (row);
	}

}


function editCell (elm) {
	if (tile == 0) {
		elm.innerHTML = "<span></span>";
	} else {
		elm.innerHTML = "<img src=\"tiles/" + tile + ".gif\" />";
	}
}


function pickTile (elm) {
	var a = elm.getElementsByTagName ("img")[0].src.split ("/");
	tile = Number (a[a.length - 1].split (".")[0]);
	
	document.getElementById ("tilePrev").src = "tiles/" + tile + ".gif";
}