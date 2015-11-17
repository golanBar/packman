/**
 * Created by Golan Bar on 17-Jun-15.
 */
var Packman = function() {
    this.img = new Image();
    this.imgIndex;
    this.sprite = new Sprite();
    this.lives;
    this.startPos;
    this.isAlive;

    this.init = function() {
        this.isAlive = true;
        this.sprite.init(this.startPos, Properties.PACKMAN_SPEED.normal, false);
        this.imgIndex = 0;
    };
    this.draw = function(context) {
        var deltaPos = this.sprite.getDeltaPos();
        deltaPos.x = deltaPos.x*Properties.TILE_HEIGHT+ Properties.MAZE_RECT.x;
        deltaPos.y = deltaPos.y*Properties.TILE_WIDTH + Properties.MAZE_RECT.y;
        if(Boolean(this.isAlive)) {
            var imgIndexStr = this.imgIndex < Properties.CHANGE_IMG_DURATION ? '0':'1';
            this.img.src = 'images/packman' + imgIndexStr + '.png';
            if(++this.imgIndex >= Properties.CHANGE_IMG_DURATION*2)
                this.imgIndex = 0;
        }
        else {
            imgIndexStr = this.imgIndex<Properties.CHANGE_IMG_DURATION*3 ? '0':this.imgIndex<Properties.CHANGE_IMG_DURATION*6 ? '1':'2';
            this.img.src = 'images/packman_killed' + imgIndexStr + '.png';
            if(++this.imgIndex >= Properties.CHANGE_IMG_DURATION*9)
                return;
        }
        context.drawImage(this.img,  deltaPos.x, deltaPos.y);
    };
    this.updatePosition = function() {
        this.sprite.updatePosition(false);
        var prevPos = this.sprite.getPrevPos();
        return(updateMazeTile(prevPos));

    };
    this.changeDirection = function(newDirection) {
        this.sprite.changeDirection(newDirection);
    };
    this.changeSpeed = function(newSpeed) {
        this.sprite.changeSpeed(newSpeed);
    };
    this.kill = function() {
        if(Boolean(this.isAlive)) {
            this.isAlive = false;
            this.lives--;
        }
    };
    this.setStartPos = function(x, y) {
        this.startPos = new Point(x, y);
    };
    this.getPos = function() {
        return(this.sprite.getPos());
    };
    this.getDeltaPos = function() {
        return(this.sprite.getDeltaPos());
    };
    this.getLives = function() {
        return(this.lives);
    };
    this.setLives = function(numLives) {
        this.lives = numLives;
    };

};