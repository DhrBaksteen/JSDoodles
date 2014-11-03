function Player () {
	this.x = 0;
	this.y = 0;
	this.v = 2;
	this.cellX = -1;
	this.cellY = -1;
	this.faceLeft = false;
	this.walking = false;
	this.falling = false;
	this.jumping = false;
	this.aniFrame = 0;
	this.fall = 0;
	
	this.ammo    = 0;
	this.gems    = 0;
	this.health  = 3;
	this.score   = 0;
	this.key     = false;
	this.letters = 0;
	this.bullet  = null;
	this.walkRight = [250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261];
	this.walkLeft  = [262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273];
	
	this.sprite = document.createElement ("img");
	this.sprite.style.position = "absolute";
	this.sprite.style.left   = this.x + "px";
	this.sprite.style.top    = this.y + "px";
	this.sprite.style.width  = tileSize + "px";
	this.sprite.style.height = tileSize + "px";
	this.sprite.style.zIndex = 3;
	this.sprite.src = "tiles/251.gif";
	gameCanvas.appendChild (this.sprite);
	
	
	
	this.update = function () {
		var oldCellX = this.cellX;
		this.cellX = Math.floor (this.x / tileSize);
		this.cellY = Math.floor (this.y / tileSize);
			
		// Handle left and riht keys.
		if (keys[KEY_LEFT] || keys[KEY_RIGHT]) {
			if (keys[KEY_LEFT]) {
				this.walking = true;
				this.faceLeft = true;
			}
		
			if (keys[KEY_RIGHT]) {
				this.walking = true;
				this.faceLeft = false;
			}
		} else {
			this.walking = false;
		}
		
		
		if (keys[KEY_JUMP] && !this.jumping && !this.falling) {
			if (!(isSolid (this.cellX, this.cellY - 1, false) || (this.x % tileSize != 0 && isSolid (this.cellX + 1, this.cellY - 1, false)))) {
				this.jumping = true;
				this.fall = tileZoom * 6.5;
			}
		}
		
		if (keys[KEY_SHOOT] && this.bullet == null) {
			this.bullet = new Bullet (this.faceLeft ? this.x - tileSize : this.x + tileSize, this.y, this.faceLeft);
			this.sprite.src = "tiles/" + (this.faceLeft ? 277 : 276) + ".gif";
		} else if (this.bullet != null) {
			this.bullet.update ();
		}
		
		
		// Handle walking to the left or right.
		if (this.walking) {
			var oldX = this.x;
			
			if (this.faceLeft) {
				this.x = Math.max (0, this.x - 3 * tileZoom);
				this.cellX = Math.floor (this.x / tileSize);
			
				// If a tile border is crossed check if the player hits a wall.
				if (this.falling || this.jumping) {
					if (isSolid (this.cellX, this.cellY, false) || isSolid (this.cellX, this.cellY + 1, false)) {
						this.walking = false;
						this.cellX = oldCellX;
						this.x = this.cellX * tileSize;
						this.sprite.src = "tiles/" + (this.faceLeft ? 262 : 250) + ".gif";
						this.aniFrame = 0;
					}
				} else {
					if (isSolid (this.cellX, this.cellY, false)) {
						this.walking = false;
						this.cellX = oldCellX;
						this.x = this.cellX * tileSize;
						this.sprite.src = "tiles/" + (this.faceLeft ? 262 : 250) + ".gif";
						this.aniFrame = 0;
					}
					
					if (this.x % tileSize == 0) {
						this.falling = !isSolid (this.cellX, this.cellY + 1, true);
					}
				}
			} else {
				this.x += 3 * tileZoom;
				this.cellX = Math.floor (this.x / tileSize);
			
				// If a tile border is crossed check if the player hits a wall.
				if (this.falling || this.jumping) {
					if (isSolid (this.cellX + 1, this.cellY, false) || isSolid (this.cellX + 1, this.cellY + 1, false)) {
						this.walking = false;
						this.x = this.cellX * tileSize;
						this.sprite.src = "tiles/" + (this.faceLeft ? 262 : 250) + ".gif";
						this.aniFrame = 0;
					}
				} else {
					if (isSolid (this.cellX + 1, this.cellY, false)) {
						this.walking = false;
						this.x = this.cellX * tileSize;
						this.sprite.src = "tiles/" + (this.faceLeft ? 262 : 250) + ".gif";
						this.aniFrame = 0;
					}
				}
			}
		}
		
		
		if (this.falling) {	
			var oldCellY = this.cellY;

			this.fall = Math.min (this.fall + tileZoom / 2, tileZoom * 4);
			this.y += this.fall;
			this.cellY = Math.floor (this.y / tileSize);
			
			if (this.cellY != oldCellY) {
				if (isSolid (this.cellX, this.cellY + 1, true) || (this.x % tileSize != 0 && isSolid (this.cellX + 1, this.cellY + 1, true))) {
					this.y = this.cellY * tileSize;
					this.falling = false;
					this.fall = 0;
					this.sprite.src = "tiles/" + (this.faceLeft ? 262 : 250) + ".gif";
					this.aniFrame = 0;
				}
			} 
		} else if (this.jumping){
			var oldCellY = this.cellY;
			var oldY = this.y

			this.fall = Math.max (this.fall - tileZoom / 2, 0);
			this.y -= this.fall;
			this.cellY = Math.floor (this.y / tileSize);
			
			if (this.cellY != oldCellY) {
				if (isSolid (this.cellX, this.cellY, false) || (this.x % tileSize != 0 && isSolid (this.cellX + 1, this.cellY, false))) {
					this.cellY = oldCellY;
					this.y = this.cellY * tileSize;
					this.jumping = false;
					this.falling = true;
					this.fall = 0;
				}
			} else if (this.fall == 0) {
				this.jumping = false;
				this.falling = true;
			}
		} else {
			if (oldCellX != this.cellX) {
				if (this.faceLeft) {
					this.falling = !isSolid (this.cellX + 1, this.cellY + 1, true);
					if (this.falling) {
						this.cellX = this.cellX + 1;
						this.x = this.cellX * tileSize;
					}
				} else {
					this.falling = !isSolid (this.cellX, this.cellY + 1, true);
				}
			}
		}
		
		
		if (this.falling || this.jumping) {
			this.sprite.src = "tiles/" + (this.faceLeft ? 275 : 274) + ".gif";
		} else if (this.walking) {
			this.aniFrame ++;
			this.sprite.src = "tiles/" + (this.faceLeft ? this.walkLeft[this.aniFrame % 12] : this.walkRight[this.aniFrame % 12]) + ".gif";
		}
		
		this.sprite.style.left = this.x + "px";
		this.sprite.style.top  = this.y + "px";
	}
	
	
	this.getAABB = function () {
		return [this.x + 3, this.y, this.x + 10 * tileZoom, this.y + 15 * tileZoom];
	}
	
	
	this.hurt = function () {
		debug.innerHTML += "Player gets hurt<br/>";
	}
} 


