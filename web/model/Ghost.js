/**
 * Created by Golan Bar on 22-Jun-15.
 */
/**
 * Created by Golan Bar on 17-Jun-15.
 */
var Ghost = function() {
    this.img = new Image();
    this.imgIndex = 0;
    this.sprite = new Sprite();
    this.startPos;
    this.state;

    this.init = function(speed) {
        this.sprite.init(this.startPos, speed, true);
        this.state = GhostState.GHOST_STAY_AT_HOME;
    };
    this.draw = function(context) {
        var deltaPos = this.sprite.getDeltaPos();
        deltaPos.x = deltaPos.x * Properties.TILE_HEIGHT + Properties.MAZE_RECT.x;
        deltaPos.y = deltaPos.y * Properties.TILE_WIDTH + Properties.MAZE_RECT.y;

        var imgIndexStr = this.imgIndex < Properties.CHANGE_IMG_DURATION ? '0' : '1';
        switch(this.state) {
            case GhostState.GHOST_ESCAPE:
                this.img.src = 'images/ghost_escape' + imgIndexStr + '.png';
                break;
            case GhostState.GHOST_STOP_ESCAPE:
                this.img.src = 'images/ghost_stop_escape' + imgIndexStr + '.png';
                break;
            case GhostState.GHOST_DEAD:
                this.img.src = 'images/ghost_killed' + imgIndexStr + '.png';
                break;
            default:
                this.img.src = 'images/ghost' + imgIndexStr + '.png';
                break;
        }
        if(++this.imgIndex >= Properties.CHANGE_IMG_DURATION * 2)
            this.imgIndex = 0;

        context.drawImage(this.img, deltaPos.x, deltaPos.y);
    };
    this.setStartPos = function(x, y) {
        this.startPos = new Point(x, y);
        //randomize the start position to make sure not all ghost objects start from the same exact position
        var rand = Math.random();
        this.startPos.x += rand < 0.33 ? -1 : rand < 0.66 ? 0 : 1;
    };
    this.updatePosition = function() {
        if(this.sprite.getCurrSpeed() == 1) {
            //one frame before the sprite update
            this.calcNextMove();
            this.isReachHome();
        }
        this.sprite.updatePosition(true);
    };
    this.calcNextMove = function() {
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
    };
    this.isReachHome = function() {
        //console.log("isReachHome:==state=="  + this.state + " pos.x==" + this.sprite.getPos().x + " pos.y==" + this.sprite.getPos().y);
        if (this.state != GhostState.GHOST_DEAD && this.state != GhostState.GHOST_GO_BACK_HOME) return;

        if ((this.sprite.getPos().y == this.startPos.y || this.sprite.getPos().y == this.startPos.y - 1) &&
            (this.sprite.getPos().x == this.startPos.x || this.sprite.getPos().x == this.startPos.x - 1 ||
            this.sprite.getPos().x == this.startPos.x + 1)) {
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
    };
    this.calcChaseMove = function() {
        var destPos = getPackmanPos();
        var directions = this.getPrioritisedMoves(destPos);
        this.makePrioritisedMove(directions);
    };
    this.calcEscapeMove = function() {
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
    };
    this.calcRandomMove = function() {
        var directions = this.getNotPrioritisedMoves();
        this.makePrioritisedMove(directions);
    };
    this.calcGoHomeMove = function() {
        var gatePos = getMazeGateTile();
        var directions = this.getPrioritisedMoves(gatePos);
        this.makePrioritisedMove(directions);
    };
    this.calcStayHomeMove = function() {
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
    };
    this.updateState = function(newState) {
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
    };
    this.getPrioritisedMoves = function(destPos) {
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
    };
    this.getNotPrioritisedMoves = function() {
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
    };
    this.makePrioritisedMove = function(directions) {
        var allowChangeDirection = Math.random() < 0.1 ? true:false;
        for(var i=0; i<Direction.DIR_MAX-1; i++) {
            if(this.sprite.isMoveAllowed(directions[i], true)) {
                if(allowChangeDirection || !this.sprite.getRequestedPos().isEqual(this.sprite.getPrevPos())) {
                    this.sprite.changeDirection(directions[i]);
                    return;
                }
            }
        }
    };
    this.changeState = function(state, speed) {
        this.sprite.changeSpeed(speed);
        this.state = state;
    };
    this.getState = function() {
        return(this.state);
    };
    this.getDeltaPos = function() {
        return(this.sprite.getDeltaPos());
    };

};