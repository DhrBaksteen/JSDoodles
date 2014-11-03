var KEY_UP = 0;
var KEY_DOWN = 1;
var KEY_LEFT = 2;
var KEY_RIGHT = 3;
var KEY_JUMP = 4;
var KEY_SHOOT = 5;
var keys = [false, false, false, false, false, false];
var dummyTile = null;
var gameCanvas = null;
var mapTable = null;
var debug = null;
var player = null;

var tileZoom = 3;
var tileSize = 16 * tileZoom;


/**
 * Create the game.
 */
function createGame () {
	gameCanvas = document.getElementById ("gameCanvas");
	mapTable   = document.getElementById ("mapTable");
	debug      = document.getElementById ("debug");
	
	dummyTile = document.createElement ("img");
	dummyTile.style.zIndex = 2;
	
	// Create the map table.
	for (var y = 0; y < 12; y ++) {
		var row = document.createElement ("tr");
		
		for (var x = 0; x < 20; x ++) {
			var col = document.createElement ("td");
			col.className = "mapCell";
			col.style.width  = tileSize + "px";
			col.style.height = tileSize + "px";
			
			row.appendChild (col);
		}
		
		mapTable.appendChild (row);
	}
	
	for (var y = 0; y < 12; y ++) {
		for (var x = 0; x < 20; x ++) {
			setTile (x, y, mapBg[y * 20 + x], map[y * 20 + x], mapFlags[y * 20 + x]);
		}
	}
	
	setTile (18, 3, null, 650, 128);
	gameObjects[gameObjects.length] = new Chest (18, 3, mapTable.rows[3].cells[18]);
	setTile (18, 5, null, 650, 128);
	gameObjects[gameObjects.length] = new Chest (18, 5, mapTable.rows[5].cells[18]);
	setTile (18, 9, null, 644, 128);
	gameObjects[gameObjects.length] = new Key (18, 9, mapTable.rows[9].cells[18], 2000);
	//enemies[enemies.length] = new Snake (5, 1, false);
	//enemies[enemies.length] = new Eye (7, 1, true);
	//enemies[enemies.length] = new Spider (5, 3, false);
	//enemies[enemies.length] = new Bird (12, 0, false);
	enemies[enemies.length] = new Hammer (6, 4, true);
	enemies[enemies.length] = new Hammer (8, 5, true);
	enemies[enemies.length] = new Hammer (10, 6, true);
	//enemies[enemies.length] = new Monster (6, 6, true);
	//enemies[enemies.length] = new Fire (4, 6, false);
	//enemies[enemies.length] = new Fire (13, 6, false);
	enemies[enemies.length] = new FlyingEyes (6, 7, false);
	
	
	player = new Player ();
	
	var nn = (document.layers) ? true : false; 
	var ie = (document.all) ? true : false; 
	document.onkeydown = keyDownHandler; 
	document.onkeyup   = keyUpHandler; 
	if (nn) {
		document.captureEvents (Event.KEYDOWN);
		document.captureEvents (Event.KEYUP);
	}
	
	mainLoop ();
}


/**
 * Game main loop.
 */
function mainLoop () {
	player.update ();
	
	for (var i = 0; i < gameObjects.length; i ++) {
		var gameObject = gameObjects[i];
		
		if (gameObject != null && gameObject.collidesWith (player.getAABB ())) {
			gameObject.grab ();
		}
	}
	
	for (var i = 0; i < scoreSprites.length; i ++) {
		if (scoreSprites[i] != null) scoreSprites[i].update ();
	}
	
	for (var i = 0; i < enemies.length; i ++) {
		var enemy = enemies[i];
		
		if (enemy != null) {
			if (enemy.isAlive) enemy.update ();
			if (enemy.collidesWith (player.getAABB ())) player.hurt ();
			if (player.bullet != null && !player.bullet.hitWall && enemy.isAlive && enemy.collidesWith (player.bullet.AABB)) enemy.shot ();
		}
	}
	
	for (var i = 0; i < explosions.length; i ++) {
		if (explosions[i] != null) explosions[i].update ();
	}
	
	setTimeout ("mainLoop ()", 40);
}


/**
 * Get the tile image located at the given position in the map table. Return a solid tile 
 * if the requested location is outside the map.
 */
function getTile (cellX, cellY) {
	if (cellY < 0 || cellY >= mapTable.rows.length || cellX < 0 || cellX >= mapTable.rows[0].cells.length) return dummyTile;
	return mapTable.rows[cellY].cells[cellX].getElementsByTagName ("img")[0];
}


/**
 * Check whether the requested tile is solid (walkable). I fallowPlatforms == true 
 * then a platform is also considdered solid.
 */
function isSolid (cellX, cellY, allowPlatforms) {
	var tile = getTile (cellX, cellY);
	
	if (allowPlatforms) {
		return tile != null && (tile.style.zIndex == 2 || tile.name == "platform");
	} else {
		return tile != null && tile.style.zIndex == 2;
	}
}


function isSolidPx (x, y, w, h) {
	var result = 0;
	var tile = null;
	
	tile = getTile (Math.floor (x / tileSize), Math.floor (y / tileSize));
	result += tile.style.zIndex == 2 ? 1 : 0;
	result += tile.name == "platform" ? 2 : 0;
	result <<= 2;
	
	tile = getTile (Math.floor ((x + h) / tileSize), Math.floor (y / tileSize));
	result += tile.style.zIndex == 2 ? 1 : 0;
	result += tile.name == "platform" ? 2 : 0;
	result <<= 2;
	
	tile = getTile (Math.floor ((x + h) / tileSize), Math.floor ((y + v) / tileSize));
	result += tile.style.zIndex == 2 ? 1 : 0;
	result += tile.name == "platform" ? 2 : 0;
	result <<= 2;
	
	tile = getTile (Math.floor (x / tileSize), Math.floor ((y + v) / tileSize));
	result += tile.style.zIndex == 2 ? 1 : 0;
	result += tile.name == "platform" ? 2 : 0;
	
	return result;
}


/**
 * Chnge a tile in the map table. 
 * bgIndex sets the background tile index.
 * tIndex sets the tile index.
 * flags sets tile flags:
 *		bit 7 - Background tile
 *		bit 6 - Foreground tile
 *		bit 5 - Platform
 * Any of these arguments can be set to null if they
 * should not be changed.
 */
function setTile (cellX, cellY, bgIndex, tIndex, flags) {
	var cell = mapTable.rows[cellY].cells[cellX];
	var tile = cell.getElementsByTagName ("img")[0];
	
	if (bgIndex != null) {
		cell.style.backgroundImage = "url(tiles/" + (bgIndex - 1) + ".gif)";
	} 
	
	if (tIndex != null && tIndex > 0) {
		if (tile == null) {
			tile = document.createElement ("img");
			tile.className = "tile";
			cell.appendChild (tile);
		}
		
		tile.src = "tiles/" + (tIndex - 1) + ".gif";
	}
	
	if (flags != null && tile != null) {
		tile.style.zIndex = (flags & 128) > 0 ? 1 : (flags & 64) > 0 ? 4 : 2;
		tile.name = (flags & 32) > 0 ? "platform" : "";
		if ((flags & 16) > 0) tile.name = "hidden";
	}
}





/**
 * Handle key down events.
 */ 
function keyDownHandler (e) {
	switch (e.keyCode) {
		case 38:
			keys[KEY_UP] = true;
			break;
		case 40:
			keys[KEY_DOWN] = true;
			break;
		case 37:
			keys[KEY_LEFT] = true;
			break;
		case 39:
			keys[KEY_RIGHT] = true;
			break;
		case 17:
			keys[KEY_JUMP] = true;
			break;
		case 18:
			keys[KEY_SHOOT] = true;
			break;
	}
}


/**
 * Handle key up events.
 */
function keyUpHandler (e) {
	switch (e.keyCode) {
		case 38:
			keys[KEY_UP] = false;
			break;
		case 40:
			keys[KEY_DOWN] = false;
			break;
		case 37:
			keys[KEY_LEFT] = false;
			break;
		case 39:
			keys[KEY_RIGHT] = false;
			break;
		case 17:
			keys[KEY_JUMP] = false;
			break;
		case 18:
			keys[KEY_SHOOT] = false;
			break;
	}
}