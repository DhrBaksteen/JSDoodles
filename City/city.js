var g;
var tileset;
var city = [];

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


$(document).ready (function () {
    var canvas = $("#canvas").get (0);
    g = new Graphics (canvas);
    
    tileset = new Image ();
    tileset.src = "tiles.png";
    tileset.onload = function () {
        for (var i = 0; i < 15; i ++) {
            city.push (new Building (
                Math.floor (Math.random () * 670), 
                445 , 
                Math.floor (Math.random () * 6), 
                Math.floor (Math.random () * 4) + 2, 
                Math.floor (Math.random () * 8) + 4
            ));
        }
    
        render ();
    };
});


var render = function () {
    requestAnimFrame (render);
    
    g.paint (function (ctx) {
        var grd = ctx.createLinearGradient (0, 0, 0, 480);
        grd.addColorStop (0.00, "#0000AA");
        grd.addColorStop (0.40, "#AA00AA");
        grd.addColorStop (0.94, "#5555FF");
        grd.addColorStop (0.95, "#AAAAAA");
        grd.addColorStop (1.00, "#555555");
    
        ctx.fillStyle = grd;
        ctx.fillRect (0, 0, 640, 480);

        for (var i = 0; i < 5; i ++) {
            for (var j = 0; j < city.length; j ++) {
                if (city[j].z === i) {
                    
                    var sx = ((city[j].x + city[j].width * 16) / 320) * 15 - 15;
                    var y = 464 - (city[j].height + 2) * 40 + i * 4;
                    ctx.fillStyle = sx > 0 ? "#000000" : "#000000";
                    ctx.fillRect (city[j].x - sx, y + 0, city[j].width * 32, (city[j].height + 2) * 40);
                    
                    ctx.drawImage (city[j].image, city[j].x, y);
                    city[j].x -= 0.25 * i + 1;
                
                    if (city[j].x + city[j].width * 32 < -30) {
                        var z;
                        var tries = 0;
                
                        do {
                            var loopIt = false;
                            z = Math.floor (Math.random () * 6);
                        
                            for (var k = 0; k < city.length; k ++) {
                                if (city[k].z === z && city[k].x + city[k].width * 32 >= 640) {
                                    loopIt = true;
                                    break;
                                }
                            }
                        
                            tries ++;
                        } while (loopIt && tries < 10);
                
                        if (tries < 10) {
                            city[j] = new Building (670, 445, z, 
                                Math.floor (Math.random () * 4) + 2,
                                Math.floor (Math.random () * 6) + 4
                            );
                        }
                    }
                }
            }
        }
    });
};

var Building = function (x, y, z, width, height) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width  = width;
    this.height = height;
    
    var type = Math.floor (Math.random () * 12); 
    var base = Math.floor (Math.random () * 13); 
    var door = Math.floor (Math.random () * 9);
    var top  = Math.floor (Math.random () * 10);

    // Render offscreen image of the building.
    this.image = renderToBuffer (width * 32, (height + 2) * 40, function (bufferCtx) {
        bufferCtx.fillStyle = "#000000";
        bufferCtx.fillRect (0, 0, width * 32, (height + 2) * 40);
        bufferCtx.globalAlpha = 0.75 + this.z * 0.05;

        var y = 0;
        
        for (var i = 0; i < width; i ++) {
            bufferCtx.drawImage (
                tileset, 
                top * 32, Math.random () > 0.75 ? 0 : 40,
                32,  40,
                i * 32, y,
                32, 40
            );
        }
        
        for (var i = 0; i < height; i ++) {
            y += 40;
            for (var j = 0; j < width; j ++) {
                bufferCtx.drawImage (
                    tileset, 
                    type * 32, Math.random () > 0.75 ? 80 : 120,
                    32,  40,
                    j * 32, y,
                    32, 40
                );
            }
        }
        
        y += 40;
        for (var i = 0; i < this.width; i ++) {
            var rnd = Math.random ();
    
            bufferCtx.drawImage (
                tileset, 
                (rnd > 0.67 ? door : base) * 32, rnd > 0.67 ? 200 : 160,
                32,  40,
                i * 32, y,
                32, 40
            );
        }
    }.bind (this));
}