var sinTable = new Array ();
var cosTable = new Array ();
var tanTable = new Array ();

var width   = 320;
var height  = 400;
var top     = 50;
var left    = 0;
var baseURL = "";

var showTextures = true;
var fov         = 60;
var playerY     = 352;
var playerX     = 352;
var playerAngle = 0;

/*
var map = [[1 ,1 ,2 ,1 ,2 ,1 ,2 ,1 ,1 ,1 ,8 ,8, 5 ,8 ,5 ,8],
		   [1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,11,0 ,0 ,0 ,0 ,8],
		   [1 ,0 ,3 ,0 ,3 ,0 ,0 ,0 ,0 ,1 ,8 ,8 ,8 ,8 ,0 ,5],
		   [1 ,0 ,3 ,0 ,3 ,0 ,0 ,0 ,0 ,1 ,4 ,0 ,0 ,8 ,0 ,8],
		   [1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,4 ,4 ,0 ,0 ,0 ,5],
		   [1 ,1 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,1 ,4 ,0 ,0 ,0 ,0 ,8],
		   [6 ,6 ,1 ,0 ,1 ,6 ,6 ,0 ,0 ,0 ,4 ,0 ,0 ,0 ,0 ,5],
		   [6 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,12,0 ,0 ,0 ,0 ,8],
		   [6 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,5],
		   [6 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,12,0 ,0 ,0 ,0 ,8],
		   [6 ,0 ,0 ,6 ,6 ,6 ,6 ,0 ,0 ,0 ,4 ,4 ,4 ,4 ,4 ,4],
		   [6 ,0 ,0 ,6 ,0 ,0 ,6 ,0 ,0 ,9 ,0 ,0 ,0 ,0 ,0 ,9],
		   [6 ,0 ,0 ,6 ,0 ,0 ,9 ,9 ,9 ,9 ,0 ,12,0 ,12,0 ,9],
		   [6 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,9],
		   [6 ,0 ,0 ,6 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,9],
		   [9 ,9 ,9 ,9 ,9 ,9 ,5 ,9 ,9 ,5 ,9 ,9 ,5 ,9 ,9 ,9]];
/*
		
/**
 * Initialize the renderer.
 */
function init () {
	left    = document.body.clientWidth / 2 - width / 2;
	baseURL = (document.URL).substring (0, (document.URL).lastIndexOf ("/") + 1);

	// Create sin, cos and tan tables
	for (var i = 0; i < 360; i ++) {
		sinTable[i] = Math.sin (i * (Math.PI / 180));
		cosTable[i] = Math.cos (i * (Math.PI / 180));
		tanTable[i] = Math.tan (i * (Math.PI / 180));
	}
	
	// Place debug field
	document.getElementById ("debug").style.position = "absolute";
	document.getElementById ("debug").style.top      = (top + 1) + "px";
	document.getElementById ("debug").style.left     = (left + 2) + "px";
	
	// Place screen div
	document.getElementById ("screen").style.width  = width  + "px";
	document.getElementById ("screen").style.height = height + "px";
	document.getElementById ("screen").style.top    = top    + "px";
	document.getElementById ("screen").style.left   = left   + "px";
	//document.getElementById ("screen").innerHTML    = "<div class=\"ceiling\"></div><div class=\"floor\"></div>";
	
	for (var i = 0; i < width; i ++) {
		// Create wall elements
		var strip = document.createElement ("div");
		strip.style.backgroundColor = "#000000";
		strip.style.position = "absolute";
		strip.style.left     = i + "px";
		strip.style.width    = "1px";
		strip.style.overflow = "hidden";
		document.getElementById ("screen").appendChild (strip);
		
		// Create texture elements
		var texture = document.createElement ("img");
		texture.style.position = "relative";
		texture.style.width    = "64px";
		texture.style.height   = "100%";
		strip.appendChild (texture);
	}
	
	// Setup key events
	var moz = (document.layers) ? true : false; 
	var ie = (document.all) ? true : false; 
	document.onkeypress = keyDown; 
	document.onkeydown  = keyDown; 
	if (moz) document.captureEvents (Event.KEYDOWN);
	
	render ();
}


/**
 * Render a frame.
 */
function render () {
	var castAngle     = playerAngle - fov / 2;
	var castAngleStep = fov / width;
	var planeD        = (width / 2) / tan (fov / 2);
	var start         = new Date ().getTime ();
	var tUpdate = 0;
	
	for (var i = 0; i < width; i ++) {
		var ray = getColumn (castAngle, i);
		
		var strip = document.getElementById ("screen").childNodes[i + 2];
		strip.style.top    = Math.floor (height / 2 - ray[0] / 2) + "px";
		strip.style.height = ray[0] + "px";
		if (showTextures) {
			// Set wall texture if texture differs from current texture.
			if (baseURL + ray[2] + ".gif" != strip.firstChild.src) {
				strip.firstChild.src = ray[2] + ".gif";
				tUpdate ++;
			}
			strip.firstChild.style.left   = -Math.floor (ray[1] % 64) + "px";
		} else {
			// If no texture change wall color according to depth
			strip.style.backgroundColor   = "rgb(" + ray[0] + "," + ray[0] + "," + ray[0] + ")";
		}
		
		castAngle += castAngleStep;
	}
	
	//document.getElementById ("debug").innerHTML = (Math.floor (1000 / (new Date ().valueOf () - start))) + " FPS<br/>" + tUpdate + " Texture updates<br/>X= " + playerX + ", Y= " + playerY + ", A= " + playerAngle;
	
	var oX = 352;
	var oY = 656;
	
	var dist =  Math.sqrt ((oX - playerX) * (oX - playerX) + (oY - playerY) * (oY - playerY));
	var ho =   (Math.atan (Math.abs (oX - playerX) / Math.abs (oY - playerY))) * (180 / Math.PI);
	var he =    Math.ceil (16384 / dist);
	var wi =    Math.ceil (he >> 1);

	/*
	document.getElementById ("debug").innerHTML = (ho >= playerAngle - 30) && (ho < playerAngle + 30);
	document.getElementById ("debug").innerHTML += " -> " + (320 - Math.floor ((playerAngle + fov / 2 - ho) / castAngleStep) - wi / 2) + ", " + ho + ", " + playerAngle;
	document.getElementById ("debug").innerHTML = playerX + ", " + playerY + " - " + ho + ", " +playerAngle;
	*/

	if (ho >= playerAngle - fov / 2 && ho <= playerAngle + fov / 2) {
		document.getElementById ("obj").style.left   = (160 - ((ho + playerAngle) / castAngleStep - (wi / 2))) + "px";
		document.getElementById ("obj").style.width  = wi + "px";
		document.getElementById ("obj").style.top    = Math.floor (height / 2 - wi) + "px";
		document.getElementById ("obj").style.height = he + "px";
		document.getElementById ("obj").style.display = "block";
	} else {
		document.getElementById ("obj").style.display = "none";
	}
}


/**
 * Get one column of wall data. This function returns an array holding the
 * segment height, texture coordinate and texture file index.
 */
function getColumn (castAngle, strip) {
	var rayX, rayY, blockStep, distH, distV, texH, texV, textureH, textureV;

	// Perform horizontal intersection test
	var rayUp    = cos (castAngle) < 0;
	var tanAngle = tan (90 - castAngle);
	blockStep    = 64 / tanAngle;

	if (rayUp) {
		rayY = (playerY >> 6) * 64 - 1;
	} else {
		rayY = (playerY >> 6) * 64 + 64;
	}
	rayX = Math.floor (playerX + (playerY - rayY) / tanAngle);
	
	while ((textureH = getWall (rayX, rayY)) == 0) {
		if (rayUp) {
			rayY -= 64;
			rayX += blockStep;
		} else {
			rayY += 64;
			rayX -= blockStep;
		}
	}

	texH = (rayX % 64);
	if (!rayUp) texH = 64 - texH;
	distH = Math.sqrt ((playerX - rayX) * (playerX - rayX) + (playerY - rayY) * (playerY - rayY));
	
	// Perform vertical intersection test
	rayUp     = sin (castAngle) >= 0;		// Note: this is now ray going left!
	tanAngle  = tan (castAngle);
	blockStep = 64 / tanAngle;

	if (rayUp) {
		rayX = (playerX >> 6) * 64 - 1;
	} else {
		rayX = (playerX >> 6) * 64 + 64;
	}
	rayY = Math.floor (playerY + (playerX - rayX) / tanAngle);  

	while ((textureV = getWall (rayX, rayY)) == 0) {
		if (rayUp) { 
			rayX -= 64;
			rayY += blockStep;
		} else {
			rayX += 64;
			rayY -= blockStep;
		}
	}

	distV = Math.sqrt ((playerX - rayX) * (playerX - rayX) + (playerY - rayY) * (playerY - rayY));
	texV  = (rayY % 64);
	if (rayUp) texV = 64 - texV;
	
	// Find the best ray and perform fish-eye correction
	var fishEye = cos ((strip * (fov / width)) - (fov / 2));

	if (distH <= distV) { //16384
		return [Math.ceil ((20480 / distH) / fishEye) , texH, textureH];
	} else {
		return [Math.ceil ((20480 / distV) / fishEye), texV, textureV]; 
	}
}


/**
 * Handle key input.
 */
function keyDown (e) {
	var evt = (e) ? e : (window.event) ? window.event : null; 
	if (evt) { 
		var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0)); 
		if (key == "39") {
			playerAngle = (playerAngle + 4) % 360;
			render ();
		} else if (key == "37") {
			playerAngle = (playerAngle - 4) % 360;
			render ();
		} else if (key == "38") {
			var oldX = playerX;
			var oldY = playerY;
			
			playerX -= Math.floor (sin (playerAngle) * 8);
			playerY += Math.floor (cos (playerAngle) * 8);
			
			if (getWall (playerX, playerY) != 0) {
				playerX = oldX;
				playerY = oldY;
			}
			
			render ();
		} else if (key == "40") {
			var oldX = playerX;
			var oldY = playerY;
			
			playerX += Math.floor (sin (playerAngle)* 8);
			playerY -= Math.floor (cos (playerAngle) * 8);
			
			if (getWall (playerX, playerY) != 0) {
				playerX = oldX;
				playerY = oldY;
			}
			
			render ();
		} else if (key == "84"){
			showTextures = !showTextures;
			
			if (!showTextures) {
				// Remove all textures
				for (var i = 0; i < width; i ++) {
					document.getElementById ("screen").childNodes[i + 2].innerHTML = "";
				}
			} else {
				// Reset all textures
				for (var i = 0; i < width; i ++) {
					var texture = document.createElement ("img");
					texture.style.position = "relative";
					texture.style.width    = "64px";
					texture.style.height   = "100%";
					document.getElementById ("screen").childNodes[i + 2].appendChild (texture);
				}
			}
			
			render ();
			document.getElementById ("debug").innerHTML = "Textures: " + showTextures;
		}
	} 
}


/**
 * Get wall texture index at position (x, y).
 */
function getWall (x, y) {
	if (x < 0 || x >= map.length * 64 || y < 0 || y >= map[0].length * 64) return 1;
		
	return map[x >> 6][y >> 6];
}


/**
 * Get sine from sine table.
 */
function sin (degree) {
	while (degree < 0) degree += 360;
	
	return sinTable[Math.floor (degree % 359)];
}


/**
 * Get cosine from cosine table.
 */
function cos (degree) {
	while (degree < 0) degree += 360;
	
	return cosTable[Math.floor (degree % 359)];
}


/**
 * Get tangent from tangent table.
 */
function tan (degree) {
	while (degree < 0) degree += 360;
	
	return tanTable[Math.floor (degree % 359)];
}