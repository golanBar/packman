/**
 * Created by Golan Bar on 10-Dec-15.
 */
var Entity = Class.extend({
    init: function(){
        this.imgIndex = 0;
        this.sprite = new Sprite();
        this.startPos = new Point(0, 0);
    },
    getImgIndex: function(){
      return(this.imgIndex);
    },
    setImgIndex: function(index){
        this.imgIndex = index;
    },
    setStartPos: function(x, y){
        this.startPos.x = x;
        this.startPos.y = y;
    },
    getStartPos: function(){
        return(this.startPos);
    },
    resetSprite: function(speed, useRandomSpeed){
        this.sprite.init(this.startPos, speed, useRandomSpeed);
    },
    updatePosition: function(passGate) {
        this.sprite.updatePosition(passGate);
    },
    changeDirection: function(newDirection) {
        this.sprite.changeDirection(newDirection);
    },
    changeSpeed: function(newSpeed) {
        this.sprite.changeSpeed(newSpeed);
    },
    getPos: function() {
        return(this.sprite.getPos());
    },
    getPrevPos: function() {
        return(this.sprite.getPrevPos());
    },
    getRequestedPos: function() {
        return(this.sprite.getRequestedPos());
    },
    getDeltaPos: function() {
       return(this.sprite.getDeltaPos());
    },
    getNewPos: function() {
        var pos = this.sprite.getDeltaPos();
        pos.x = pos.x * Properties.TILE_HEIGHT + Properties.MAZE_RECT.x;
        pos.y = pos.y * Properties.TILE_WIDTH + Properties.MAZE_RECT.y;
        return(pos);
    },
    getCurrSpeed: function() {
        return(this.sprite.getCurrSpeed());
    }

});
