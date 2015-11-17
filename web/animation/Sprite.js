/**
 * Created by Golan Bar on 19-Jun-15.
 */
var Sprite = function() {
    this.direction;
    this.requestedDirection;
    this.pos;
    this.prevPos;
    this.requestedPos;
    this.speed;
    this.initialSpeed;

    this.init = function(pos, speed, useRandomSpeed) {
        this.direction = Direction.DIR_NONE;
        this.requestedDirection = Direction.DIR_NONE;
        this.pos = new Point(pos.x, pos.y);
        this.prevPos = new Point(pos.x, pos.y);
        /* this is to make the ghosts not alligned */
        if(Boolean(useRandomSpeed)) {
            var rand = Math.random();
            speed += rand < 0.33 ? -1 : rand < 0.66 ? 0 : 1;
        }
        this.speed = this.initialSpeed = speed;
    };
    this.updatePosition = function(passGate) {
        if(--this.speed > 0) return;

        if(this.requestedDirection == Direction.DIR_NONE) {
            this.speed = 1/*this.initialSpeed*/;
            return;
        }

        var prevDirection = this.direction;
        this.direction = this.requestedDirection;
        this.requestedPos = this.calcRequestedPos(this.direction);
        this.updateReachLimits();
        var tileState = getMazeTileState(this.requestedPos);
        if(tileState == TileState.TILE_FREE || (tileState == TileState.TILE_GATE && passGate)) {
            this.speed = this.initialSpeed;
            this.prevPos = this.pos;
            this.pos = this.requestedPos;
        }
        else {
            this.speed = 0;
            this.prevPos = this.pos;
            if(prevDirection != this.direction)
                this.direction = this.requestedDirection = prevDirection;
            else
                this.direction = this.requestedDirection = Direction.DIR_NONE;
        }
    };
    this.calcRequestedPos = function(direction) {
        var deltas = [{x:-1, y:0},{x:1, y:0},{x:0, y:-1},{x:0, y:1},{x:0, y:0}];
        var newPos = new Point(this.pos.x + deltas[direction].x, this.pos.y + deltas[direction].y);
        return(newPos);
    };
    this.updateReachLimits = function() {
        if(this.requestedPos.x < 0)
            this.requestedPos.x = Properties.COLS - 1;
        else if(this.requestedPos.x >= Properties.COLS)
            this.requestedPos.x = 0;
    };
    this.getDeltaPos = function() {
        var factor = (this.initialSpeed - this.speed) / this.initialSpeed;
        var dx = (this.pos.x - this.prevPos.x) * factor;
        var dy = (this.pos.y - this.prevPos.y) * factor;
        if(Math.abs(dx) > 1.0 || Math.abs(dy) > 1.0) {
            this.prevPos = this.pos;
            dx = 0.0;
            dy = 0.0;
        }
        var deltaPos = new Point(this.prevPos.x + dx, this.prevPos.y + dy);
        return(deltaPos);
    };
    this.getPos = function() {
        return(this.pos);
    };
    this.getPrevPos = function() {
        return(this.prevPos);
    };
    this.getRequestedPos = function() {
        return(this.requestedPos);
    };
    this.getCurrSpeed = function() {
        return(this.speed);
    };
    this.changeDirection = function(newDirection) {
        if(this.direction == newDirection && this.direction != Direction.DIR_NONE)
            return;
        this.requestedDirection = newDirection;
    };
    this.changeSpeed = function(newSpeed) {
        var speed = (this.speed / this.initialSpeed) * newSpeed;
        this.speed =  speed;
        this.initialSpeed = newSpeed;
    };
    this.isMoveAllowed = function(direction, passGate) {
        this.requestedPos = this.calcRequestedPos(direction);
        var tileState = getMazeTileState(this.requestedPos);
        if(tileState == TileState.TILE_FREE || (tileState == TileState.TILE_GATE && passGate))
            return(true);
        return(false);
    }

};