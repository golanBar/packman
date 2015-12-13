/**
 * Created by Golan Bar on 22-Jun-15.
 */
/**
 * Created by Golan Bar on 17-Jun-15.
 */
var Ghost = Entity.extend({
    init: function() {
        this._super();
        this.loadImages();
    },
    loadImages: function() {
        this.ghostImgs = [];
        this.ghostKilledImgs = [];
        this.ghostEscapeImgs = [];
        this.ghostStopEscapeImgs = [];
        for(var i=0; i<2; i++) {
            this.ghostImgs[i] = new Image();
            this.ghostImgs[i].src = 'images/ghost' + i + '.png';
        }
        for(var i=0; i<2; i++) {
            this.ghostKilledImgs[i] = new Image();
            this.ghostKilledImgs[i].src = 'images/ghost_killed' + i + '.png';
        }
        for(var i=0; i<2; i++) {
            this.ghostEscapeImgs[i] = new Image();
            this.ghostEscapeImgs[i].src = 'images/ghost_escape' + i + '.png';
        }
        for(var i=0; i<2; i++) {
            this.ghostStopEscapeImgs[i] = new Image();
            this.ghostStopEscapeImgs[i].src = 'images/ghost_stop_escape' + i + '.png';
        }
    },
    reset: function(speed) {
        this.state = GhostState.GHOST_STAY_AT_HOME;
        this.resetSprite(speed, true);
        this.setImgIndex(0);
    },
    draw: function(context) {
        var pos = this.getNewPos();
        var imgIndex = this.getImgIndex();
        var i = imgIndex < Properties.CHANGE_IMG_DURATION ? 0:1;
        switch(this.state) {
            case GhostState.GHOST_ESCAPE:
                context.drawImage(this.ghostEscapeImgs[i],  pos.x, pos.y);
                break;
            case GhostState.GHOST_STOP_ESCAPE:
                context.drawImage(this.ghostStopEscapeImgs[i],  pos.x, pos.y);
                break;
            case GhostState.GHOST_DEAD:
                context.drawImage(this.ghostKilledImgs[i],  pos.x, pos.y);
                break;
            default:
                context.drawImage(this.ghostImgs[i],  pos.x, pos.y);
                break;
        }
        this.setImgIndex(this.getImgIndex()+1);
        if(this.getImgIndex() >= Properties.CHANGE_IMG_DURATION * 2)
            this.setImgIndex(0);
    },
    /*draw: function(context) {
        var imgIndexStr = this.getImgIndex() < Properties.CHANGE_IMG_DURATION ? '0' : '1';
        switch(this.state) {
            case GhostState.GHOST_ESCAPE:
                this.setImgSrc('images/ghost_escape' + imgIndexStr + '.png');
                break;
            case GhostState.GHOST_STOP_ESCAPE:
                this.setImgSrc('images/ghost_stop_escape' + imgIndexStr + '.png');
                break;
            case GhostState.GHOST_DEAD:
                this.setImgSrc('images/ghost_killed' + imgIndexStr + '.png');
                break;
            default:
                this.setImgSrc('images/ghost' + imgIndexStr + '.png');
                break;
        }
        this.setImgIndex(this.getImgIndex()+1);
        if(this.getImgIndex() >= Properties.CHANGE_IMG_DURATION * 2)
            this.setImgIndex(0);

        this._super(context);
    },*/
    setStartPos: function(x, y) {
        //randomize the start position to make sure not all ghost objects start from the same exact position
        var rand = Math.random();
        x += rand < 0.33 ? -1 : rand < 0.66 ? 0 : 1;
        this._super(x, y);
    },
    updatePosition: function() {
        if(this.getCurrSpeed() == 1) {
            //one frame before the sprite update
            this.calcNextMove();
            this.isReachHome();
        }
        this._super(true);
    },
    calcNextMove: function() {
        switch (this.state) {
            case GhostState.GHOST_CHASE:
                this.calcChaseMove();
                break;
            case GhostState.GHOST_ESCAPE:
            case GhostState.GHOST_STOP_ESCAPE:
                this.calcEscapeMove();
                break;
            case GhostState.GHOST_STRAY:
                this.calcRandomMove();
                break;
            case GhostState.GHOST_DEAD:
            case GhostState.GHOST_GO_BACK_HOME:
                this.calcGoHomeMove();
                break;
            case GhostState.GHOST_STAY_AT_HOME:
                this.calcStayHomeMove();
                break;
            default:
                console.log("Undefined ghost state");
                break;
        }
    },
    isReachHome: function() {
        //console.log("isReachHome:==state=="  + this.state + " pos.x==" + this.sprite.getPos().x + " pos.y==" + this.sprite.getPos().y);
        if (this.state != GhostState.GHOST_DEAD && this.state != GhostState.GHOST_GO_BACK_HOME) return;
        var startPos = this.getStartPos();
        if ((this.getPos().y == startPos.y || this.getPos().y == startPos.y - 1) &&
            (this.getPos().x == startPos.x || this.getPos().x == this.startPos.x - 1 ||
            this.getPos().x == this.startPos.x + 1)) {
            //console.log("reached home:==" + this.state + " game state==" + gameModel.getState());
            if(this.state == GhostState.GHOST_DEAD) {
                if(gameModel.getState() == GameState.GAME_RUN) {
                    if (isGhostStray(this))
                        this.updateState(GhostState.GHOST_STRAY);
                    else
                        this.updateState(GhostState.GHOST_CHASE);
                }
                else
                    this.updateState(GhostState.GHOST_STAY_AT_HOME);
            }
            else
                this.updateState(GhostState.GHOST_STAY_AT_HOME);
        }
    },
    calcChaseMove: function() {
        var destPos = getPackmanPos();
        var directions = this.getPrioritisedMoves(destPos);
        this.makePrioritisedMove(directions);
    },
    calcEscapeMove: function() {
        var destPos = getPackmanPos();
        var directions = this.getPrioritisedMoves(destPos);

        /* swap */
        var tmpDir = directions[0];
        directions[0] = directions[2];
        directions[2] = tmpDir;

        tmpDir = directions[1];
        directions[1] = directions[3];
        directions[3] = tmpDir;

        this.makePrioritisedMove(directions);
    },
    calcRandomMove: function() {
        var directions = this.getNotPrioritisedMoves();
        this.makePrioritisedMove(directions);
    },
    calcGoHomeMove: function() {
        var gatePos = getMazeGateTile();
        var directions = this.getPrioritisedMoves(gatePos);
        this.makePrioritisedMove(directions);
    },
    calcStayHomeMove: function() {
        var indexY1 = 0, indexY2 = 1;
        if(Math.random() > 0.5) {
            indexY1 = 1;
            indexY2 = 0;
        }
        var directions = [];
        for (var i = 0; i < Direction.DIR_MAX; i++)
            directions.push(Direction.DIR_NONE);
        directions[indexY1] = Direction.DIR_RIGHT;
        directions[indexY2] = Direction.DIR_LEFT;
        this.makePrioritisedMove(directions);
    },
    updateState: function(newState) {
        switch(newState) {
            case GhostState.GHOST_STRAY:
            case GhostState.GHOST_CHASE:
                // the chase speed is the only speed that changes according to the game level
                this.sprite.changeSpeed(getghostChaseSpeed(getCurrLevel()));
                break;
            case GhostState.GHOST_ESCAPE:
                this.sprite.changeSpeed(Properties.GHOST_SPEED.escape);
                break;
            case GhostState.GHOST_DEAD:
            case GhostState.GHOST_STAY_AT_HOME:
            case GhostState.GHOST_GO_BACK_HOME:
                this.sprite.changeSpeed(Properties.GHOST_SPEED.dead);
                break;
            default:
                return;
        }
        this.state = newState;
    },
    getPrioritisedMoves: function(destPos) {
        var indexX = 0, indexY = 1;
        var dx = this.sprite.getPos().x - destPos.x, dy = this.sprite.getPos().y - destPos.y;

        if(dx == 0) {
            indexX = 0;
            indexY = 1;
        }
        else if(dy == 0) {
            indexX = 1;
            indexY = 0;
        }
        else {
            if(Math.random() > 0.5) {
                indexX = 1;
                indexY = 0;
            }
        }

        var directions = [];
        for(var i = 0; i < Direction.DIR_MAX; i++)
            directions.push(Direction.DIR_NONE);
        if(dx > 0) {
            directions[indexY] = Direction.DIR_LEFT;
            directions[indexY + 2] = Direction.DIR_RIGHT;
        }
        else {
            directions[indexY] = Direction.DIR_RIGHT;
            directions[indexY + 2] = Direction.DIR_LEFT;
        }
        if(dy > 0) {
            directions[indexX] = Direction.DIR_UP;
            directions[indexX + 2] = Direction.DIR_DOWN;
        }
        else {
            directions[indexX] = Direction.DIR_DOWN;
            directions[indexX + 2] = Direction.DIR_UP;
        }
        return(directions);
    },
    getNotPrioritisedMoves: function() {
        var randDirs = [Direction.DIR_UP, Direction.DIR_DOWN, Direction.DIR_LEFT, Direction.DIR_RIGHT];
        var directions = [];
        for (var i=0; i<Direction.DIR_MAX-1; i++)
            directions.push(Direction.DIR_NONE);

        for(i=0; i<Direction.DIR_MAX-1; i++) {
            while(1) {
                var k = Math.floor(Math.random() * (Direction.DIR_MAX-1));
                for(var j=0; j<i; j++) {
                    if(directions[j] == randDirs[k])
                        break;
                }
                if(j==i)	break;
            }
            directions[i] = randDirs[k];
        }
        return(directions);
    },
    makePrioritisedMove: function(directions) {
        var allowChangeDirection = Math.random() < 0.1 ? true:false;
        for(var i=0; i<Direction.DIR_MAX-1; i++) {
            if(this.sprite.isMoveAllowed(directions[i], true)) {
                if(allowChangeDirection || !this.sprite.getRequestedPos().isEqual(this.sprite.getPrevPos())) {
                    this.sprite.changeDirection(directions[i]);
                    return;
                }
            }
        }
    },
    changeState: function(state, speed) {
        this.sprite.changeSpeed(speed);
        this.state = state;
    },
    getState: function() {
        return(this.state);
    }

});