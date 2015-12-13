/**
 * Created by Golan Bar on 21-Jun-15.
 */
var GameModel = function() {
    this.state;
    this.score = 0;
    this.level = 0;
    this.killedGhosts = [];
    this.numReleasedGhosts;
    this.numStopStrayGhosts;
    this.numConsecutiveKilledGhosts;
    this.scoreForExtraLife;
    this.audioObjs = [];
    this.varTimeoutRelease;
    this.varTimeoutStopStray;
    this.varTimeoutAddMazeItem;
    this.varTimeoutStopGhostEscape;
    this.varTimeoutRestartGhostChase;




    this.initLevel = function(level) {
        this.level = level;
        this.state = GameState.GAME_RUN;
        maze.init(new Rect(Properties.MAZE_RECT.x, Properties.MAZE_RECT.y, Properties.MAZE_RECT.width, Properties.MAZE_RECT.height));
        maze.setTilesImages();
        packman.reset();
        for(var i=0; i<getNumGhosts(this.level); i++) {
            ghosts[i].reset(getghostChaseSpeed(this.level));
            this.killedGhosts[i] = false;
        }
        if(this.level==0) {
            this.score = 0;
            packman.setLives(Properties.PACKMAN_LIVES)
        }
        this.numReleasedGhosts = 0;
        this.numStopStrayGhosts = 0;
        this.numConsecutiveKilledGhosts = 0;
        this.ispillActivated = false;
        this.scoreForExtraLife = Properties.NUM_POINTS_FOR_EXTRA_LIFE;
        this.audioObjs[AudioType.AUDIO_START_LEVEL].play();
        var self = this; //When setInterval() fires, the context is the global context (e.g. window), not the GameModel object.
        this.varTimeoutRelease = setTimeout(function(){self.releaseGhosts()}, getGhostReleaseMS(self.level, self.numReleasedGhosts));
        this.varTimeoutStopStray = setTimeout(function(){self.stopGhostsStray()}, getGhostStopStrayMS(self.level, self.numReleasedGhosts));
        this.varTimeoutAddMazeItem = setTimeout(function(){self.addMazeItem()}, Properties.INTERVALS.mazeItemMS);
    };
    this.initAudioObjs = function() {
        // pre load all sounds due to browser slowness of playing them on demand
        for(var i=0; i<AudioType.AUDIO_MAX; i++)
            this.audioObjs.push(new Audio());

        this.audioObjs[AudioType.AUDIO_COIN].src = 'sounds/coin.mp3';
        this.audioObjs[AudioType.AUDIO_POWER].src = 'sounds/power.mp3';
        this.audioObjs[AudioType.AUDIO_SURPRISE].src = 'sounds/surprise.mp3';
        this.audioObjs[AudioType.AUDIO_SPEED].src = 'sounds/speedPill.mp3';
        this.audioObjs[AudioType.AUDIO_ANTI_SPEED].src = 'sounds/antiSpeedPill.mp3';
        this.audioObjs[AudioType.AUDIO_EXTRA_LIFE].src = 'sounds/extraLife.mp3';
        this.audioObjs[AudioType.AUDIO_GAME_OVER].src = 'sounds/gameOver.mp3';
        this.audioObjs[AudioType.AUDIO_GAME_COMPLETE].src = 'sounds/fireworks.mp3';
        this.audioObjs[AudioType.AUDIO_START_LEVEL].src = 'sounds/startLevel.mp3';
        this.audioObjs[AudioType.AUDIO_LEVEL_OVER].src = 'sounds/levelOver.mp3';
        this.audioObjs[AudioType.AUDIO_KILL_GHOST].src = 'sounds/killGhost.mp3';
        this.audioObjs[AudioType.AUDIO_PACKMAN_KILLED].src = 'sounds/packmanKilled.mp3';

    };
    this.releaseGhosts = function() {
        if(this.numReleasedGhosts >= getNumGhosts(this.level)) {
            clearTimeout(this.varTimeoutRelease);
            return;
        }
        if(this.state == GameState.GAME_PACKMAN_POWER || this.state == GameState.GAME_PACKMAN_CHASE) {
            ghosts[this.numReleasedGhosts].changeState(GhostState.GHOST_ESCAPE, Properties.GHOST_SPEED.escape);
        }
        else if(this.state == GameState.GAME_RUN) //when packman is killed all ghosts must return home before game flow continues
                ghosts[this.numReleasedGhosts].changeState(GhostState.GHOST_STRAY, getghostChaseSpeed(this.level));
        if(++this.numReleasedGhosts < getNumGhosts(this.level)) {
            var self = this;
            this.varTimeoutRelease = setTimeout(function () {self.releaseGhosts()}, getGhostReleaseMS(self.level, self.numReleasedGhosts));
        }
    };
    this.stopGhostsStray = function() {
        if(this.numStopStrayGhosts >= getNumGhosts(this.level)) {
            clearTimeout(this.varTimeoutStopStray);
            return;
        }
        if(this.state != GameState.GAME_PACKMAN_POWER && this.state != GameState.GAME_PACKMAN_CHASE) {
            if(getGhostState(this.numStopStrayGhosts) == GhostState.GHOST_STRAY) {
                ghosts[this.numStopStrayGhosts].changeState(GhostState.GHOST_CHASE, getghostChaseSpeed(this.level));
                ++this.numStopStrayGhosts;
            }
        }
        if(this.numStopStrayGhosts < getNumGhosts(this.level)) {
            var self = this;
            this.varTimeoutStopStray = setTimeout(function () {self.stopGhostsStray()}, getGhostStopStrayMS(self.level, self.numReleasedGhosts));
        }
    };
    this.handleMove = function(tileType) {
        switch (tileType) {
            case TileType.COIN:
                this.audioObjs[AudioType.AUDIO_COIN].play();
                this.updateScore(tileType);
                this.checkLevelOver();
                break;
            case TileType.POWER:
                this.audioObjs[AudioType.AUDIO_POWER].play();
                this.updateScore(tileType);
                this.state = GameState.GAME_PACKMAN_POWER;
                break;
            case TileType.SURPRISE:
                this.audioObjs[AudioType.AUDIO_SURPRISE].play();
                this.updateScore(tileType);
                break;
            case TileType.SPEED:
                this.audioObjs[AudioType.AUDIO_SPEED].play();
                var self = this;
                setTimeout(function () {self.resetPackmanSpeed()}, Properties.INTERVALS.packmanPillMS);
                packman.changeSpeed(Properties.PACKMAN_SPEED.speedPill);
                break;
            case TileType.ANTI_SPEED:
                this.audioObjs[AudioType.AUDIO_ANTI_SPEED].play();
                //set_ticker_text(me,took_speed_pill);
                var self = this;
                setTimeout(function () {self.resetPackmanSpeed()}, Properties.INTERVALS.packmanPillMS);
                packman.changeSpeed(Properties.PACKMAN_SPEED.antiSpeedPill);
                break;
            default:
                break;
        }
    };
    this.checkCollisions = function() {
        if(!Boolean(packman.isAlive)) return;

        var packmanDeltaPos = getPackmanDeltaPos();
        for(i=0; i<getNumGhosts(this.level); i++) {
            var ghostDeltaPos = getGhostDeltaPos(i);
            var dx = Math.abs(packmanDeltaPos.x - ghostDeltaPos.x), dy = Math.abs(packmanDeltaPos.y - ghostDeltaPos.y);
            if(dx <= Properties.COLLISION_FACTOR && dy <= Properties.COLLISION_FACTOR) {
                var ghostState = ghosts[i].getState();

                if(ghostState == GhostState.GHOST_CHASE || ghostState == GhostState.GHOST_STRAY || ghostState == GhostState.GHOST_STAY_AT_HOME) {
                    this.state = GameState.GAME_PACKMAN_KILLED;
                    this.audioObjs[AudioType.AUDIO_PACKMAN_KILLED].play();
                    packman.kill();
                    this.packmanKilled();
                }
                else if(ghostState == GhostState.GHOST_ESCAPE || ghostState == GhostState.GHOST_STOP_ESCAPE) {
                    ghosts[i].changeState(GhostState.GHOST_DEAD, Properties.GHOST_SPEED.dead);
                    if(!this.killedGhosts[i]) {
                        this.audioObjs[AudioType.AUDIO_KILL_GHOST].play();
                        this.numConsecutiveKilledGhosts++;
                        this.score += Properties.SCORE.killGhost * this.numConsecutiveKilledGhosts;
                        this.checkPackmanGetExtraLife();
                        this.killedGhosts[i] = true;
                    }
                }
            }
        }
    };
    this.updateScore = function(tileType) {
        switch(tileType) {
            case TileType.COIN:
                this.score += Properties.SCORE.coin;
                break;
            case TileType.SURPRISE:
                this.score += Properties.SCORE.surprise * (this.level + 1);
                break;
            case TileType.POWER:
                this.score += Properties.SCORE.power;
                break;
            default:
                break;
        }
        this.checkPackmanGetExtraLife();
    };
    this.checkPackmanGetExtraLife = function() {
        if(this.score >= this.scoreForExtraLife) {
            this.audioObjs[AudioType.AUDIO_EXTRA_LIFE].play();
            packman.setLives(packman.getLives() + 1);
            this.scoreForExtraLife += Properties.NUM_POINTS_FOR_EXTRA_LIFE;
        }
    };
    this.checkGameOver = function() {
        if(packman.getLives() == 0) {
            this.state = GameState.GAME_OVER;
            this.audioObjs[AudioType.AUDIO_GAME_OVER].play();
            this.clearTimeouts();
            return(true);
        }
        return(false);
    };
    this.checkLevelOver = function() {
        if(maze.getCoinsLeft() == 0) {
            this.clearTimeouts();
            if(this.level >= getNumLevels()-1) {
                this.state = GameState.GAME_COMPLETED;
                this.audioObjs[AudioType.AUDIO_GAME_COMPLETE].play();
            }
            else {
                this.state = GameState.GAME_LEVEL_COMPLETED;
                this.audioObjs[AudioType.AUDIO_LEVEL_OVER].play();
            }
        }
    };
    this.clearTimeouts = function() {
        clearTimeout(this.varTimeoutStopStray);
        clearTimeout(this.varTimeoutRelease);
        clearTimeout(this.varTimeoutAddMazeItem);
        clearTimeout(this.varTimeoutStopGhostEscape);
        clearTimeout(this.varTimeoutRestartGhostChase);
    };
    this.packmanKilled = function() {
        // return ghosts to their starting position
        for(i=0; i<getNumGhosts(this.level); i++) {
            if(ghosts[i].getState() != GhostState.GHOST_GO_BACK_HOME && ghosts[i].getState() != GhostState.GHOST_STAY_AT_HOME)
                ghosts[i].changeState(GhostState.GHOST_GO_BACK_HOME, Properties.GHOST_SPEED.dead);
        }
    };
    this.packmanPower = function() {
        clearTimeout(this.varTimeoutStopGhostEscape);
        clearTimeout(this.varTimeoutRestartGhostChase);
        for(i=0; i<getNumGhosts(this.level); i++) {
            if(ghosts[i].getState() != GhostState.GHOST_DEAD && ghosts[i].getState() != GhostState.GHOST_STAY_AT_HOME &&
                ghosts[i].getState() != GhostState.GHOST_GO_BACK_HOME)
                ghosts[i].changeState(GhostState.GHOST_ESCAPE, Properties.GHOST_SPEED.escape);
        }
        this.state = GameState.GAME_PACKMAN_CHASE;
        var self = this;
        this.varTimeoutStopGhostEscape = setTimeout(function(){self.stopGhostsEscape()}, Properties.INTERVALS.ghostsEscapeMS);
    };
    this.resetPackmanSpeed = function() {
        packman.changeSpeed(Properties.PACKMAN_SPEED.normal);
    };
    this.stopGhostsEscape = function() {
        for(i=0; i<getNumGhosts(this.level); i++) {
            if(ghosts[i].getState() == GhostState.GHOST_ESCAPE)
                ghosts[i].changeState(GhostState.GHOST_STOP_ESCAPE, Properties.GHOST_SPEED.escape);
        }
        var self = this;
        this.varTimeoutRestartGhostChase = setTimeout(function(){self.restartGhostsChase()}, Properties.INTERVALS.ghostsStopEscapeMS);
    };
    this.restartGhostsChase = function() {
        //console.log("restartGhostsChase:==" + ghosts[0].getState() + " " + ghosts[1].getState() + " " + ghosts[2].getState() + " " + ghosts[3].getState() + " this.state==" + this.state);
        for(i=0; i<getNumGhosts(this.level); i++) {
            if(ghosts[i].getState() == GhostState.GHOST_STOP_ESCAPE) {
                if (i < this.numStopStrayGhosts)
                    ghosts[i].changeState(GhostState.GHOST_CHASE, getghostChaseSpeed(this.level));
                else
                    ghosts[i].changeState(GhostState.GHOST_STRAY, getghostChaseSpeed(this.level));
            }
            else if(ghosts[i].getState() == GhostState.GHOST_STAY_AT_HOME && this.state != GameState.GAME_PACKMAN_KILLED) {
                //console.log("let " + i + "chase" + this.numStopStrayGhosts + " " + this.numReleasedGhosts);
                if (i < this.numStopStrayGhosts)
                    ghosts[i].changeState(GhostState.GHOST_CHASE, getghostChaseSpeed(this.level));
                else if (i < this.numReleasedGhosts)
                    ghosts[i].changeState(GhostState.GHOST_STRAY, getghostChaseSpeed(this.level));
            }
        }
        this.numConsecutiveKilledGhosts = 0;
        if(this.state == GameState.GAME_PACKMAN_CHASE)
            this.state = GameState.GAME_RUN;
    };
    this.checkContinueAfterPackmanKilled = function() {
        if(this.state != GameState.GAME_PACKMAN_KILLED)     return;

        // when all ghosts are back home, start again
        if(this.checkAllGhostsReachedHome()) {
            if(this.checkGameOver()) {
                return;
            }
            //console.log("checkContinueAfterPackmanKilled gamerun");
            this.state = GameState.GAME_RUN;
            this.numConsecutiveKilledGhosts = 0;
            this.ispillActivated = false;
            clearTimeout(this.varTimeoutStopGhostEscape);
            clearTimeout(this.varTimeoutRestartGhostChase);
            packman.reset();
            for(var i=0; i<getNumGhosts(this.level); i++) {
                this.killedGhosts[i] = false;
                if(i<this.numStopStrayGhosts)
                    ghosts[i].changeState(GhostState.GHOST_CHASE, getghostChaseSpeed(this.level));
                else if(i<this.numReleasedGhosts)
                    ghosts[i].changeState(GhostState.GHOST_STRAY, getghostChaseSpeed(this.level));
                //console.log("checkContinueAfterPackmanKilled: i=" + i + " state==" + ghosts[i].getState());
            }

        }
    };
    this.checkAllGhostsReachedHome = function() {
        var numGhostsAtHome = 0;
        for(i=0; i<getNumGhosts(this.level); i++) {
            //console.log("checkAllGhostsReachedHome: i=" + i + " state==" + ghosts[i].getState() + " numghosts==" + getNumGhosts(this.level));
            if(ghosts[i].getState() == GhostState.GHOST_STAY_AT_HOME)
                numGhostsAtHome++;
        }
        if(numGhostsAtHome == getNumGhosts(this.level)) {
            return (true);
        }
        return(false);
    };
    this.addMazeItem = function() {
        var rand = Math.random();
        if(rand < 0.33)
            maze.addItem(TileType.SPEED);
        else if(rand < 0.66)
            maze.addItem(TileType.ANTI_SPEED);
        else
            maze.addItem(TileType.SURPRISE);

        var multFactor = 1-((this.level+1)/getNumLevels());
        var self = this;
        this.varTimeoutAddMazeItem = setTimeout(function(){self.addMazeItem()}, Properties.INTERVALS.mazeItemMS*multFactor);
    };
    this.getScore = function() {
        return(this.score);
    };
    this.getLevel = function() {
        return(this.level);
    };
    this.getState = function() {
        return(this.state);
    };
    this.backdoor = function() {
        this.state = GameState.GAME_LEVEL_COMPLETED;
        this.audioObjs[AudioType.AUDIO_LEVEL_OVER].play();
    };

};


// Getters and Setters
function setPackmanStartPos(x, y) {
    packman.setStartPos(x, y);
}

function getPackmanPos() {
    return(packman.getPos());
}

function getPackmanDeltaPos() {
    return(packman.getDeltaPos());
}

function setGhostStartPos(x, y) {
    for(var i=0; i<Properties.MAX_GHOSTS; i++)
        ghosts[i].setStartPos(x, y);
}

function getGhostState(i) {
    return(ghosts[i].state);
}

function getGhostDeltaPos(i) {
    return(ghosts[i].getDeltaPos());
}

function isGhostStray(ghost) {
    for(i=0; i<Properties.MAX_GHOSTS; i++) {
        if(ghosts[i] === ghost) {
            break;
        }
    }
    return( i < this.numStopStrayGhosts);
}

function getMazeTileState(pos) {
    return maze.getTileState(pos);
}

function updateMazeTile(pos) {
    return maze.updateTile(pos);
}

function getMazeGateTile() {
    return(maze.getGatePos());
}

function getCurrLevel() {
    return(gameModel.getLevel());
}
