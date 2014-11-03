var gameObjects  = Array ();
var scoreSprites = Array ();


function GameObject (cellX, cellY, tileCell) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.tileCell = tileCell;
	this.AABB = [0, 0, 0, 0];
	this.objectId = gameObjects.length;

	this.collidesWith = function (otherAABB) {
		return !(this.AABB[2] < otherAABB[0] || this.AABB[0] > otherAABB[2] || this.AABB[3] < otherAABB[1] || this.AABB[1] > otherAABB[3]);
	}
	
	
	this.grab = function () {}
	
	
	this.remove = function (removeTile) {
		if (this.tileCell != null && removeTile) {
			while (this.tileCell.childNodes.length > 0) {
				this.tileCell.removeChild (this.tileCell.childNodes[0]);
			}
		}
		
		gameObjects[this.objectId] = null;
	}
}


function ScoreSprite (cellX, cellY, sprite) {
	this.x = cellX * tileSize;
	this.y = cellY * tileSize;
	this.counter = 32;
	
	this.sprite = document.createElement ("img");
	this.sprite.style.position = "absolute";
	this.sprite.style.left   = this.x + "px";
	this.sprite.style.top    = this.y + "px";
	this.sprite.style.width  = tileSize + "px";
	this.sprite.style.height = tileSize + "px";
	this.sprite.style.zIndex = 2;
	this.sprite.src = "tiles/" + sprite + ".gif";
	gameCanvas.appendChild (this.sprite);
	
	this.spriteId = scoreSprites.length;
	
	
	this.update = function () {
		this.y --;
		this.sprite.style.top    = this.y + "px";
		
		this.counter --;
		if (this.counter == 0) {
			gameCanvas.removeChild (this.sprite);
			scoreSprites[this.spriteId] = null;
		}
	}
}


Diamond.prototype = new GameObject ();
function Diamond (cellX, cellY, tileCell) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.tileCell = tileCell;
	this.AABB = [cellX * tileSize + tileSize / 4, cellY * tileSize + tileSize / 4, 0, 0];
	this.AABB[2] = this.AABB[0] + tileSize / 2;
	this.AABB[3] = this.AABB[1] + tileSize / 2;
	this.objectId = gameObjects.length;
	
	
	this.grab = function () {
		player.gems --;
		player.score += 50;
		debug.innerHTML += "Gems = " + player.gems + "<br/>";
		this.remove (true);
	}
}


Gun.prototype = new GameObject ();
function Gun (cellX, cellY, tileCell) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.tileCell = tileCell;
	this.AABB = [cellX * tileSize + tileSize / 4, cellY * tileSize + tileSize / 4, 0, 0];
	this.AABB[2] = this.AABB[0] + tileSize / 2;
	this.AABB[3] = this.AABB[1] + tileSize / 2;
	this.objectId = gameObjects.length;
	
	
	this.grab = function () {
		player.ammo += 5;
		debug.innerHTML += "Ammo = " + player.ammo + "<br/>";
		this.remove (true);
	}
}


Item.prototype = new GameObject ();
function Item (cellX, cellY, tileCell, points) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.tileCell = tileCell;
	this.points = points;
	this.AABB = [cellX * tileSize + tileSize / 4, cellY * tileSize + tileSize / 4, 0, 0];
	this.AABB[2] = this.AABB[0] + tileSize / 2;
	this.AABB[3] = this.AABB[1] + tileSize / 2;
	this.objectId = gameObjects.length;
	
	
	this.grab = function () {
		player.score += this.points;
		scoreSprites[scoreSprites.length] = new ScoreSprite (this.cellX, this.cellY - 1, this.points == 800 ? 872 : this.points == 1000 ? 873 : 877);
		this.remove (true);
	}
}


Key.prototype = new GameObject ();
function Key (cellX, cellY, tileCell) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.tileCell = tileCell;
	this.AABB = [cellX * tileSize + tileSize / 4, cellY * tileSize + tileSize / 4, 0, 0];
	this.AABB[2] = this.AABB[0] + tileSize / 2 - 1;
	this.AABB[3] = this.AABB[1] + tileSize / 2 - 1;
	this.objectId = gameObjects.length;
	
	
	this.grab = function () {
		player.key = true;
		debug.innerHTML += "You grab the key<br/>";
		this.remove (true);
	}
}


Chest.prototype = new GameObject ();
function Chest (cellX, cellY, tileCell) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.tileCell = tileCell;
	this.AABB = [cellX * tileSize + tileSize / 4, cellY * tileSize + tileSize / 4, 0, 0];
	this.AABB[2] = this.AABB[0] + tileSize / 2;
	this.AABB[3] = this.AABB[1] + tileSize / 2;
	this.objectId = gameObjects.length;


	this.grab = function () {
		if (player.key) {
			setTile (cellX, cellY, null, 648, null);
			var points = Math.random ();
			player.score += points < 0.1 ? 5000 : points < 0.4 ? 2000 : 1000;
			scoreSprites[scoreSprites.length] = new ScoreSprite (this.cellX, this.cellY - 1, points < 0.1 ? 877 : points < 0.4 ? 876 : 873);
			this.remove (false);
		}
	}
}


Mushroom.prototype = new GameObject ();
function Mushroom (cellX, cellY, tileCell, type) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.tileCell = tileCell;
	this.type = type;
	this.AABB = [cellX * tileSize + tileSize / 4, cellY * tileSize + tileSize / 4, 0, 0];
	this.AABB[2] = this.AABB[0] + tileSize / 2;
	this.AABB[3] = this.AABB[1] + tileSize / 2;
	this.objectId = gameObjects.length;


	this.grab = function () {
		if (this.type == 0) {
			player.score += 1000;
			debug.innerHTML += "Score = " + player.score + "<br/>";
		} else if (this.type == 1) {
			debug.innerHTML += "SHROOMPOWER!<br/>";
		} else if (this.type == 2) {
			debug.innerHTML += "Deadly mushroom eaten!<br/>";
		}
		this.remove (true);
	}
}


Letter.prototype = new GameObject ();
function Letter (cellX, cellY, tileCell) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.tileCell = tileCell;
	this.AABB = [cellX * tileSize + tileSize / 4, cellY * tileSize + tileSize / 4, 0, 0];
	this.AABB[2] = this.AABB[0] + tileSize / 2;
	this.AABB[3] = this.AABB[1] + tileSize / 2;
	this.objectId = gameObjects.length;


	this.grab = function () {
		player.score += 1000;
		
		player.letters ++;
		if (player.letters == 5) {
			player.score += 10000;
			scoreSprites[scoreSprites.length] = new ScoreSprite (this.cellX, this.cellY - 1, 880);
		} else {
			scoreSprites[scoreSprites.length] = new ScoreSprite (this.cellX, this.cellY - 1, 873);
		}
	}
}