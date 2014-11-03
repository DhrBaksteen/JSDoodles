var enemies = Array ();
var explosions = Array ();

function Enemy (cellX, cellY, faceLeft) {
	this.cellX = cellX;
	this.cellY = cellY;
	this.AABB = [0, 0, 0, 0];
	this.sprite = null;
	this.x = 0;
	this.y = 0;
	this.health = 1;
	this.enemyId = -1;
	this.isAlive = true;
	this.faceLeft = faceLeft;
	
	
	this.collidesWith = function (otherAABB) {
		return !(this.AABB[2] < otherAABB[0] || this.AABB[0] > otherAABB[2] || this.AABB[3] < otherAABB[1] || this.AABB[1] > otherAABB[3]);
	}
	
	
	this.create = function (cellX, cellY, faceLeft, sprite) {
		this.cellX = cellX;
		this.cellY = cellY;
		this.faceLeft = faceLeft;
		this.x = cellX * tileSize;
		this.y = cellY * tileSize;
		this.AABB = [cellX * tileSize, cellY * tileSize, cellX * tileSize + tileSize - 1 * tileZoom, cellY * tileSize + tileSize - 1 * tileZoom];
		
		this.sprite = document.createElement ("img");
		this.sprite.style.position = "absolute";
		this.sprite.style.left   = this.x + "px";
		this.sprite.style.top    = this.y + "px";
		this.sprite.style.width  = tileSize + "px";
		this.sprite.style.height = tileSize + "px";
		this.sprite.style.zIndex = 2;
		this.sprite.src = "tiles/" + sprite + ".gif";
		gameCanvas.appendChild (this.sprite);
		
		this.enemyId = enemies.length;
	}
	
	
	this.repaint = function () {
		this.sprite.style.left   = this.x + "px";
		this.sprite.style.top    = this.y + "px";
	}
	
	
	this.remove = function () {
		gameCanvas.removeChild (this.sprite);
		enemies[this.enemyId] = null;
	}
	
	
	this.setSprite = function (sprite) {
		this.sprite.src = "tiles/" + sprite + ".gif";
	}
	
	
	this.shot = function () {
	}
	
	
	this.update = function () {
	}
}


function Explosion (x, y, bones, shotFromLeft) {
	this.x = x;
	this.y = y;
	this.counter = 0;
	this.explosionId = explosions.length;
	this.shotFromLeft = shotFromLeft;

	this.sprite = document.createElement ("img");
	this.sprite.style.position = "absolute";
	this.sprite.style.left   = this.x + "px";
	this.sprite.style.top    = this.y + "px";
	this.sprite.style.width  = tileSize + "px";
	this.sprite.style.height = tileSize + "px";
	this.sprite.style.zIndex = 2;
	this.sprite.src = "tiles/" + (bones ? 1173 : 1174) + ".gif";
	gameCanvas.appendChild (this.sprite);
	
	
	this.update = function () {
		this.counter ++;
		this.x += this.shotFromLeft ? tileZoom : -tileZoom;
		this.sprite.style.left   = this.x + "px";
		
		if (this.counter == 30) {
			explosions[this.explosionId] = null;
			gameCanvas.removeChild (this.sprite);
		}
	}
}


Snake.prototype = new Enemy ();
function Snake (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, faceLeft ? 1159 : 1161);
	this.AABB = [cellX * tileSize, cellY * tileSize, cellX * tileSize + tileSize, cellY * tileSize + tileSize];
	this.walking = true;
	this.counter = Math.round (Math.random () * 200) + 100;
	this.health = 2;
	
	this.update = function () {
			var oldCell = this.cellX;
	
		if (this.walking) {
			if (this.faceLeft) {
				this.x -= tileZoom;
			} else {
				this.x += tileZoom;
			}
			this.cellX = Math.floor (this.x / tileSize);
	
			if (this.cellX != oldCell) {
				if ((this.faceLeft && (isSolid (this.cellX, this.cellY, false) || !isSolid (this.cellX, this.cellY + 1, true))) ||
					(!this.faceLeft && (isSolid (this.cellX + 1, this.cellY, false) || !isSolid (this.cellX + 1, this.cellY + 1, true)))) {
					this.faceLeft = !this.faceLeft;
					this.setSprite (this.faceLeft ? 1159 : 1161);
				}
			}
		
			this.AABB[0] = this.x;
			this.AABB[2] = this.AABB[0] + tileSize;
		
			this.counter --;
			if (this.counter == 0) {
				this.counter = 75;
				this.setSprite (1160);
				this.walking = false;
			}
	
			this.repaint ();
		} else {
			this.counter --;
		
			if (this.counter == 0) {
				this.walking = true;
				this.counter = Math.round (Math.random () * 200) + 100;
				this.setSprite (this.faceLeft ? 1159 : 1161);
			}
		}
	}
	
	
	this.shot = function () {
		this.health --;
		
		if (this.health == 0) {
			this.isAlive = false;
			this.x = this.cellX * tileSize;
			this.AABB[0] = this.x;
			this.AABB[1] += 12 * tileZoom;
			this.AABB[2] = this.AABB[0] + tileSize;
			this.repaint ();
			this.setSprite (198);
			player.score += 100;
			explosions[explosions.length] = new Explosion (this.x, this.y, true, player.bullet.x < this.x);
		}
		
		player.bullet.remove ();
	}
}


Eye.prototype = new Enemy ();
function Eye (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, faceLeft ? 1162 : 1164);
	this.walking = true;
	this.counter = Math.round (Math.random () * 200) + 100;
	this.health = 2;
	
	this.update = function () {
		var oldCell = this.cellX;
	
		if (this.walking) {
			if (this.faceLeft) {
				this.x -= tileZoom;
			} else {
				this.x += tileZoom;
			}
			this.cellX = Math.floor (this.x / tileSize);
	
			if (this.cellX != oldCell) {
				if ((this.faceLeft && (isSolid (this.cellX, this.cellY, false) || !isSolid (this.cellX, this.cellY + 1, true))) ||
					(!this.faceLeft && (isSolid (this.cellX + 1, this.cellY, false) || !isSolid (this.cellX + 1, this.cellY + 1, true)))) {
					this.faceLeft = !this.faceLeft;
					this.setSprite (this.faceLeft ? 1162 : 1164);
				}
			}
		
			this.AABB[0] = this.x;
			this.AABB[2] = this.AABB[0] + tileSize;
		
			this.counter --;
			if (this.counter == 0) {
				this.counter = 75;
				this.setSprite (1163);
				this.walking = false;
			}
	
			this.repaint ();
		} else {
			this.counter --;
		
			if (this.counter == 0) {
				this.walking = true;
				this.counter = Math.round (Math.random () * 200) + 100;
				this.setSprite (this.faceLeft ? 1162 : 1164);
			}
		}
	}
	
	
	this.shot = function () {
		this.health --;
	
		if (this.health == 0) {
			this.isAlive = false;
			this.x = this.cellX * tileSize;
			this.AABB[0] = this.x;
			this.AABB[1] += 12 * tileZoom;
			this.AABB[2] = this.AABB[0] + tileSize;
			this.repaint ();
			this.setSprite (73);
			player.score += 100;
			explosions[explosions.length] = new Explosion (this.x, this.y, true, player.bullet.x < this.x);
		}
		
		player.bullet.remove ();
	}
}


Spider.prototype = new Enemy ();
function Spider (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, faceLeft ? 1166 : 1165);
	this.counter = 0;
	
	this.update = function () {
		var oldCell = this.cellY;
		if (this.faceLeft) {
			this.y -= tileZoom / 2;
		} else {
			this.y += tileZoom / 2;
		}
		this.cellY = Math.floor (this.y / tileSize);
	
		if (this.cellY != oldCell) {
			if (this.faceLeft) {
				var wallFront = mapTable.rows[this.cellY].cells[this.cellX].getElementsByTagName ("img")[0];

				if (isSolid (this.cellX, this.cellY, true)) {
					this.faceLeft = !this.faceLeft;	
					this.setSprite (1165);
				}
			} else {
				var wallFront = mapTable.rows[Math.min (this.cellY + 1, mapTable.rows.length - 1)].cells[this.cellX].getElementsByTagName ("img")[0];

				if (isSolid (this.cellX, this.cellY + 1, true)) {
					this.faceLeft = !this.faceLeft;	
					this.setSprite (1166);
				}
			}
		}
		
		this.AABB[1] = this.y;
		this.AABB[3] = this.AABB[1] + tileSize;
		this.repaint ();
		
		if (this.counter > 0) {
			this.counter --;
		} else {
			var otherAABB = player.getAABB ();
			if (!(this.AABB[2] < otherAABB[0] || this.AABB[0] > otherAABB[2]) && otherAABB[1] > this.AABB[1]) {
				enemies[enemies.length] = new Web (this.cellX, this.cellY, "146");
				this.counter = 5;
			}
		}
	}
	
	
	this.shot = function () {
		this.isAlive = false;
		this.x = this.cellX * tileSize;
		this.AABB[0] = this.x;
		this.AABB[1] += 12 * tileZoom;
		this.AABB[2] = this.AABB[0] + tileSize;
		this.repaint ();
		player.score += 100;
		explosions[explosions.length] = new Explosion (this.x, this.y, true, player.bullet.x < this.x);
		player.bullet.remove ();
		this.remove ();
	}
}


Web.prototype = new Enemy ();
function Web (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, false, 146);
	
	
	this.update = function () {
		var oldCell = this.cellY;
		this.y += tileZoom * 4;
		this.cellY = Math.floor (this.y / tileSize);
	
		if (this.cellY != oldCell) {
			var wallFront = mapTable.rows[Math.min (this.cellY + 1, mapTable.rows.length - 1)].cells[this.cellX].getElementsByTagName ("img")[0];

			if (isSolid (this.cellX, this.cellY + 1, true)) {
				this.remove ();
			}
		}
		
		this.AABB[1] = this.y;
		this.AABB[3] = this.AABB[1] + tileSize;
		this.repaint ();
	}
}


Bat.prototype = new Enemy ();
function Bat (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, 1167);
	this.counter = Math.round (Math.random () * 1000) + 50;
	
	this.update = function () {
		var oldCell = this.cellX;
		
		if (this.faceLeft) {
			this.x -= tileZoom / 2;
		} else {
			this.x += tileZoom / 2;
		}
		this.cellX = Math.floor (this.x / tileSize);
	
		if (this.cellX != oldCell && ((this.faceLeft && isSolid (this.cellX, this.cellY, false)) || (!this.faceLeft && isSolid (this.cellX + 1, this.cellY, false)))) {
			this.faceLeft = !this.faceLeft;
		}
		
		this.AABB[0] = this.x;
		this.AABB[2] = this.AABB[0] + tileSize;
		this.repaint ();
		
		this.counter --;
		if (this.counter == 0) {
			this.faceLeft = !this.faceLeft;
			this.counter = Math.round (Math.random () * 1000) + 50;
		}
	}
	
	
	this.shot = function () {
		this.isAlive = false;
		this.x = this.cellX * tileSize;
		this.AABB[0] = this.x;
		this.AABB[1] += 12 * tileZoom;
		this.AABB[2] = this.AABB[0] + tileSize;
		this.repaint ();
		player.score += 100;
		explosions[explosions.length] = new Explosion (this.x, this.y, true, player.bullet.x < this.x);
		player.bullet.remove ();
		this.remove ();
	}
}


Bird.prototype = new Enemy ();
function Bird (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, 1168);
	this.counter = 0;
	
	this.update = function () {
		var oldCell = this.cellX;
		
		if (this.faceLeft) {
			this.x -= tileZoom / 2;
		} else {
			this.x += tileZoom / 2;
		}
		this.cellX = Math.floor (this.x / tileSize);
	
		if (this.cellX != oldCell && ((this.faceLeft && isSolid (this.cellX, this.cellY, false)) || (!this.faceLeft && isSolid (this.cellX + 1, this.cellY, false)))) {
			this.faceLeft = !this.faceLeft;
		}
		
		this.AABB[0] = this.x;
		this.AABB[2] = this.AABB[0] + tileSize;
		this.repaint ();
		
		if (this.counter > 0) {
			this.counter --;
		} else {
			var otherAABB = player.getAABB ();
			if (!(this.AABB[2] < otherAABB[0] || this.AABB[0] > otherAABB[2]) && otherAABB[1] > this.AABB[1]) {
				enemies[enemies.length] = new Egg (this.cellX, this.cellY, false);
				this.counter = 200;
			}
		}
	}
	
	
	this.shot = function () {
		this.isAlive = false;
		this.x = this.cellX * tileSize;
		this.AABB[0] = this.x;
		this.AABB[1] += 12 * tileZoom;
		this.AABB[2] = this.AABB[0] + tileSize;
		this.repaint ();
		player.score += 100;
		explosions[explosions.length] = new Explosion (this.x, this.y, true, player.bullet.x < this.x);
		player.bullet.remove ();
		this.remove ();
	}
}


Egg.prototype = new Enemy ();
function Egg (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, false, 238);
	this.fallen = false;
	this.counter = 200;
	
	this.update = function () {
		if (!this.fallen) {
			var oldCell = this.cellY;
			this.y += tileZoom * 4;
			this.cellY = Math.floor (this.y / tileSize);
			
			this.AABB[1] = this.y;
			this.AABB[3] = this.AABB[1] + tileSize;
	
			if (this.cellY != oldCell && isSolid (this.cellX, this.cellY + 1, true)) {
				this.setSprite (200);
				this.fallen = true;
				this.AABB[3] -= tileZoom;
			}
		
			this.repaint ();
		} else {
			this.counter --;
			if (this.counter == 0) this.remove ();
		}
	}
}


Hammer.prototype = new Enemy ();
function Hammer (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, 1169);
	this.sprite.style.width  = tileSize * 2 + "px";
	this.sprite.style.height = tileSize * 2 + "px";
	this.AABB = [cellX * tileSize, cellY * tileSize, cellX * tileSize + tileSize * 2 - 1, cellY * tileSize + tileSize * 2 - 1];
	this.vel = 0;
	this.bounce = false;
	
	this.update = function () {
		var oldCell = this.cellY;
		if (this.faceLeft) {
			this.y -= tileZoom / 2;
		} else {
			if (!this.bounce) {
				this.vel = Math.max (this.vel + tileZoom, tileZoom * 6);
			} else {
				this.vel += tileZoom;
			}
			this.y += this.vel;
		}
		this.cellY = Math.floor (this.y / tileSize);
	
		if (this.cellY != oldCell) {
			if (this.faceLeft) {
				if (isSolid (this.cellX, this.cellY, true)) {
					this.faceLeft = !this.faceLeft;
					this.vel = 0;
				}
			} else {
				if (isSolid (this.cellX, this.cellY + 2, true)) {
					this.cellY = oldCell + 1;
					this.y = this.cellY * tileSize;
					if (!this.bounce) {
						this.bounce = true;
						this.vel = -this.vel / 2;
					} else {
						this.bounce = false;
						this.faceLeft = !this.faceLeft;	
					}
				}
			}
		}
		
		this.AABB[1] = this.y;
		this.AABB[3] = this.AABB[1] + tileSize * 2;
		this.repaint ();
	}
	
	
	this.shot = function () {
		player.bullet.hitWall = true;
		player.bullet.sprite.src = "tiles/1172.gif";
	}
}


Monster.prototype = new Enemy ();
function Monster (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, faceLeft ? 1176 : 1175);
	this.sprite.style.height = tileSize * 2 + "px";
	this.AABB = [cellX * tileSize, cellY * tileSize, cellX * tileSize + tileSize, cellY * tileSize + tileSize * 2];
	this.health = 5;
	
	this.update = function () {
		var oldCell = this.cellX;
	
		var playerAABB = player.getAABB ();
		if (((this.faceLeft && playerAABB[0] < this.AABB[0]) || (!this.faceLeft && playerAABB[0] > this.AABB[2])) && playerAABB[1] < this.AABB[3] && playerAABB[3] > this.AABB[1]) {
			this.x += this.faceLeft ? -tileZoom * 3 : tileZoom * 3;
		} else {
			this.x += this.faceLeft ? -tileZoom : tileZoom;
		}
		this.cellX = Math.floor (this.x / tileSize);

		if (this.cellX != oldCell) {
			if ((this.faceLeft && (isSolid (this.cellX, this.cellY, false) || isSolid (this.cellX, this.cellY + 1, false) || !isSolid (this.cellX, this.cellY + 2, true))) ||
				(!this.faceLeft && (isSolid (this.cellX + 1, this.cellY, false) || isSolid (this.cellX + 1, this.cellY + 1, false)  || !isSolid (this.cellX + 1, this.cellY + 2, true)))) {
				this.faceLeft = !this.faceLeft;
				this.setSprite (this.faceLeft ? 1176 : 1175);
			}
		}
	
		this.AABB[0] = this.x;
		this.AABB[2] = this.AABB[0] + tileSize;

		this.repaint ();
	}
	
	
	this.shot = function () {
		this.health --;
		
		if (this.health == 0) {
			this.isAlive = false;
			this.remove ();
			player.score += 100;
			explosions[explosions.length] = new Explosion (this.x, this.y, true, player.bullet.x < this.x);
		} else {
			this.faceLeft = !player.bullet.faceLeft;
			this.setSprite (this.faceLeft ? 1176 : 1175);
		}
		
		player.bullet.remove ();
	}
}


Fire.prototype = new Enemy ();
function Fire (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, faceLeft ? 1177 : 466);
	this.counter = 0;
	
	this.update = function () {
		this.counter ++;
		
		if (this.faceLeft && this.counter >= 80) {
			this.setSprite (466);
			this.counter = 0;
			this.AABB = [0, 0, 0, 0];
			this.faceLeft = false;
		} else if (!this.faceLeft && this.counter >= 50) {
			this.setSprite (1177);
			this.counter = 0;
			this.AABB = [cellX * tileSize, cellY * tileSize, cellX * tileSize + tileSize - 1 * tileZoom, cellY * tileSize + tileSize - 1 * tileZoom];
			this.faceLeft = true;
		}
	}
}


Droid.prototype = new Enemy ();
function Droid (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, faceLeft ? 1178 : 1179);
	this.counter = 0;
	
	this.update = function () {
		var oldCell = this.cellX;
		this.x += this.faceLeft ? -tileZoom : tileZoom;
		this.cellX = Math.floor (this.x / tileSize);

		if (this.cellX != oldCell) {
			if ((this.faceLeft && (isSolid (this.cellX, this.cellY, false) || !isSolid (this.cellX, this.cellY + 1, true))) ||
				(!this.faceLeft && (isSolid (this.cellX + 1, this.cellY, false) || !isSolid (this.cellX + 1, this.cellY + 1, true)))) {	
				this.faceLeft = !this.faceLeft;
				this.setSprite (this.faceLeft ? 1178 : 1179);
			}
		}
	
		this.AABB[0] = this.x;
		this.AABB[2] = this.AABB[0] + tileSize;

		this.repaint ();
		
		if (this.counter == 0) {
			var playerAABB = player.getAABB ();
			if (this.faceLeft && playerAABB[0] < this.AABB[0] && playerAABB[1] < this.AABB[3] && playerAABB[3] > this.AABB[1]) {
				enemies[enemies.length] = new EnemyBullet (this.cellX, this.cellY, true, 333);
				this.counter = 50;
			} else if (!this.faceLeft && playerAABB[0] > this.AABB[2] && playerAABB[1] < this.AABB[3] && playerAABB[3] > this.AABB[1]) {
				enemies[enemies.length] = new EnemyBullet (this.cellX, this.cellY, false, 333);
				this.counter = 50;
			}
		} else {
			this.counter --;
		}
	}
	
	
	this.shot = function () {
		player.bullet.remove ();
	}
}


EnemyBullet.prototype = new Enemy ();
function EnemyBullet (cellX, cellY, faceLeft, sprite) {
	this.create (cellX, cellY, faceLeft, sprite);
	
	this.update = function () {
		var oldCell = this.cellX;
		this.x += this.faceLeft ? -tileZoom * 4 : tileZoom * 4;
		this.cellX = Math.floor (this.x / tileSize);

		if (this.cellX != oldCell) {
			if ((this.faceLeft && (isSolid (this.cellX, this.cellY, false)) || (!this.faceLeft && (isSolid (this.cellX + 1, this.cellY, false))))) {	
				this.remove ();
			}
		}
	
		this.AABB[0] = this.x;
		this.AABB[2] = this.AABB[0] + tileSize;

		this.repaint ();
	}
}


MineCart.prototype = new Enemy ();
function MineCart (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, 1180);
	this.running = true;
	this.counter = 0;
	
	this.update = function () {
		var oldCell = this.cellX;
	
		if (this.running) {
			this.x += this.faceLeft ? -tileZoom * 4 : tileZoom * 4;
			this.cellX = Math.floor (this.x / tileSize);
	
			if (this.cellX != oldCell) {
				if ((this.faceLeft && (isSolid (this.cellX, this.cellY, false) || !isSolid (this.cellX, this.cellY + 1, true))) ||
					(!this.faceLeft && (isSolid (this.cellX + 1, this.cellY, false) || !isSolid (this.cellX + 1, this.cellY + 1, true)))) {
					if (this.faceLeft) {
						this.cellX = oldCell
						this.x = this.cellX * tileSize;
					} else {
						this.x = this.cellX * tileSize;
					}
					this.faceLeft = !this.faceLeft;
					this.running = false;
					this.counter = 38;
					this.setSprite (96);
				}
			}
		
			this.AABB[0] = this.x;
			this.AABB[2] = this.AABB[0] + tileSize;
			this.repaint ();
		} else {
			this.counter --;
			if (this.counter == 0) {
				this.running = true;
				this.setSprite (1180);
			}
 		}
	}
	
	
	this.shot = function () {
		this.health --;
		
		if (this.health == 0) {
		}
		
		player.bullet.remove ();
	}
}


FlyingEyes.prototype = new Enemy ();
function FlyingEyes (cellX, cellY, faceLeft) {
	this.create (cellX, cellY, faceLeft, 1181);
	
	this.update = function () {
		var oldCell = this.cellX;
		this.x += this.faceLeft ? -tileZoom * 3 : tileZoom * 3;
		this.cellX = Math.floor (this.x / tileSize);
	
		if (this.cellX != oldCell) {
			if ((this.faceLeft && (isSolid (this.cellX, this.cellY, false) || !isSolid (this.cellX, this.cellY + 1, true))) ||
				(!this.faceLeft && (isSolid (this.cellX + 1, this.cellY, false) || !isSolid (this.cellX + 1, this.cellY + 1, true)))) {
				if (this.faceLeft) {
					this.cellX = oldCell
					this.x = this.cellX * tileSize;
				} else {
					this.x = this.cellX * tileSize;
				}
				this.faceLeft = !this.faceLeft;
			}
		}
	
		this.AABB[0] = this.x;
		this.AABB[2] = this.AABB[0] + tileSize;
		this.repaint ();
	}
	
	
	this.shot = function () {
		this.health --;
		
		if (this.health == 0) {
			player.score += 100;
			this.remove ();
			explosions[explosions.length] = new Explosion (this.x, this.y, false, player.bullet.x < this.x);
		}
		
		player.bullet.remove ();
	}
}

