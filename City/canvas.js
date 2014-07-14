function Graphics (canvas) {
    var ctx = canvas.getContext ("2d");
    
    this.width  = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    
    
    /**
     * Clear the canvas and reset all transformations.
     */
    ctx.clear = function () {
        ctx.setTransform (1, 0, 0, 1, 0, 0);
        ctx.clearRect    (0, 0, this.width, this.height);
    };
    
    
    /**
     * Add a glow effect to elements in the paintCallback function.
     *
     * color         - String to represent the glow color.
     * size          - Blur size.
     * strength      - Strength of the effect (higher strength requires more paintCallbacks!).
     * paintCallback - Function that renders the elements that receive glow.
     */
    ctx.glow = function (color, size, strength, paintCallback) {
        this.save ();
        
        this.shadowColor   = color;
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
        this.shadowBlur    = size;

        for (var i = 0; i < strength; i ++) {
            paintCallback (this);
        }
        
        this.restore ();
    };
    
    
    /**
     * Save the contents of the current graphics context to the feedback buffer.
     */
    ctx.saveFeedbackBuffer = function () {
        this.feedbackBuffer     = new Image ();
        this.feedbackBuffer.src = canvas.toDataURL ("image/png");
    }
    
    
    /**
     * Draw the feedback buffer if it is available with a given amount of opacity.
     *
     * opacity - Opacity of the feedback buffer [0, 1]
     */
    ctx.feedback = function (opacity) {
        if (!this.feedbackBuffer) return;
    
        this.save ();
        
        this.globalAlpha = opacity;
        this.drawImage (this.feedbackBuffer, 0, 0);
        
        this.restore ();
    }
    
    
    /**
     * Draw a line on the canvas.
     *
     * x1 - Start X coordinate.
     * y1 - Start Y coordinate.
     * x2 - End X coordinate.
     * y2 - End Y coordinate.
     */
    ctx.drawLine = function (x1, y1, x2, y2) {
        this.beginPath ();
        this.moveTo (x1, y1);
        this.lineTo (x2, y2);
        this.stroke ();
    }
    

    this.paint = function (renderCallback) {
        renderCallback (ctx);
    }
};


var renderToBuffer = function (width, height, renderCallback) {
    var buffer = document.createElement ("canvas");
    buffer.width  = width;
    buffer.height = height;

    var g = new Graphics (buffer);
    g.paint (renderCallback)    ;
    
    return buffer;
};