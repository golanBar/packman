/**
 * Created by Golan Bar on 17-Jun-15.
 */
var Packman = Entity.extend({
    init: function(){
        this._super();
        this.loadImages();
        this.lives = 0;
        this.reset();
    },
    loadImages: function() {
        this.packmanImgs = [];
        this.packmanKilledImgs = [];
        for(var i=0; i<2; i++) {
            this.packmanImgs[i] = new Image();
            this.packmanImgs[i].src = 'images/packman' + i + '.png';
        }
        for(var i=0; i<3; i++) {
            this.packmanKilledImgs[i] = new Image();
            this.packmanKilledImgs[i].src = 'images/packman_killed' + i + '.png';
        }
    },
    reset: function() {
        this.isAlive = true;
        this.resetSprite(Properties.PACKMAN_SPEED.normal, false);
        this.setImgIndex(0);
    },
    draw: function(context) {
        var pos = this.getNewPos();
        var imgIndex = this.getImgIndex();
        if(Boolean(this.isAlive)) {
            var i = imgIndex < Properties.CHANGE_IMG_DURATION ? 0:1;
            this.setImgIndex(imgIndex+1);
            if(imgIndex+1 >= Properties.CHANGE_IMG_DURATION*2)
                this.setImgIndex(0);
            context.drawImage(this.packmanImgs[i],  pos.x, pos.y);
        }
        else {
            var i = imgIndex<Properties.CHANGE_IMG_DURATION*3 ? 0:imgIndex<Properties.CHANGE_IMG_DURATION*6 ? 1:2;
            this.setImgIndex(imgIndex+1);
            if(imgIndex+1 >= Properties.CHANGE_IMG_DURATION*9)
                return;
            context.drawImage(this.packmanKilledImgs[i],  pos.x, pos.y);
        }
    },
    getLives: function() {
        return(this.lives);
    },
    setLives: function(numLives) {
        this.lives = numLives;
    },
    kill: function() {
        if(Boolean(this.isAlive)) {
            this.isAlive = false;
            this.lives--;
        }
    },
    updatePosition: function() {
        this._super(false);
        var prevPos = this.getPrevPos();
        return(updateMazeTile(prevPos));
    }
});