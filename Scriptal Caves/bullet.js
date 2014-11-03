function Bullet (x, y, faceLeft) {
	this.x = x;
	this.y = y;
	this.faceLeft = faceLeft;
	this.cellX = Math.floor (x / tileSize);
	this.cellY = Math.floor (y / tileSize);
	this.vel = tileZoom;
	this.AABB = [this.x, this.y + 3 * tileZoom, this.x + tileSize, this.y + tileSize - 3 * tileZoom];
	this.hitWall = false;
	this.counter = 0;
	this.isAlive = true;
	
	this.sprite = document.createElement ("img");
	this.sprite.style.position = "absolute";
	this.sprite.style.left   = this.x + "px";
	this.sprite.style.top    = this.y + "px";
	this.sprite.style.width  = tileSize + "px";
	this.sprite.style.height = tileSize + "px";
	this.sprite.style.zIndex = 3;
	this.sprite.src = "tiles/" + (this.faceLeft ? 1171 : 1170) + ".gif";
	gameCanvas.appendChild (this.sprite);
	
	
	this.remove = function () {
		player.bullet = null;
		gameCanvas.removeChild (this.sprite);
	}
	
	this.update = function () {
		if (!this.hitWall) {
			var oldCell = this.cellX;
		
			if (this.faceLeft) {
				this.vel = Math.min (this.vel + tileZoom / 4, tileZoom * 8);
				this.x -= this.vel;
			} else {
				this.vel = Math.min (this.vel + tileZoom / 4, tileZoom * 8);
				this.x += this.vel;
			}
			this.cellX = Math.floor (this.x / tileSize);
		
			if (this.cellX != oldCell) {
				var wallFront1 = getTile (this.faceLeft ? this.cellX : this.cellX + 1, this.cellY);
				var wallFront2 = getTile (this.faceLeft ? this.cellX : this.cellX + 1, this.cellY + 1);
			
				if (this.y % tileSize == 0) {
					if (wallFront1 != null && wallFront1.style.zIndex == 2) {
						this.hitWall = true;
						this.sprite.src = "tiles/1172.gif";
						//this.cellX = oldCell;
						//this.x = this.cellX * tileSize;
					}
				} else {
					if ((wallFront1 != null && wallFront1.style.zIndex == 2) || (wallFront2 != null && wallFront2.style.zIndex == 2)) {
						this.hitWall = true;
						this.sprite.src = "tiles/1172.gif";
						//this.cellX = oldCell;
						//this.x = this.cellX * tileSize;
					}
				}
			} else if (this.x < 0 || this.x > mapTable.rows[0].cells.length * tileSize) {
				this.hitWall = true;
				this.sprite.src = "tiles/1172.gif";
			}
		
			this.AABB[0] = this.x;
			this.AABB[2] = this.x + tileSize;
			this.sprite.style.left   = this.x + "px";
		} else {
			this.counter ++;
			if (this.counter == 11) {
				this.remove ();
			}
		}
	}
}