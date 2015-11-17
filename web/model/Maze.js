/**
 * Created by Golan Bar on 17-Jun-15.
 */
var Tile = function(left, top) {
    this.coinsLeft;
    this.tileType = TileType.EMPTY;
    this.left = left;
    this.top = top;
    this.img = new Image();
    this.draw = function(context) {
        if(this.tileType != TileType.EMPTY && this.tileType != TileType.PASSAGE)
            context.drawImage(this.img, this.left, this.top);
    };
};

var Maze = function() {
    this.tiles = [];
    this.speedPillTileIndex;
    this.antiSpeedPillTileIndex;
    this.surpriseTileIndex;

    this.init = function(rect) {
        this.rect = rect;
        var numCoins = 0;
        for(var i=0; i<Properties.ROWS; i++) {
            for(j=0; j<Properties.COLS; j++) {
                var tileIndex = i*Properties.COLS + j;
                this.tiles.push(new Tile(this.rect.left+(j*Properties.TILE_WIDTH), this.rect.top+(i*Properties.TILE_HEIGHT)));
                this.tiles[tileIndex].tileType = getInitialTileType(getCurrLevel(), i, j);

                switch(this.tiles[tileIndex].tileType) {
                    case TileType.COIN:
                        numCoins++;
                        break;
                    case TileType.GHOST_START:
                        setGhostStartPos(j, i);
                        this.tiles[tileIndex].tileType = TileType.EMPTY;
                        break;
                    case TileType.PACMAN_START:
                        setPackmanStartPos(j, i);
                        this.tiles[tileIndex].tileType = TileType.EMPTY;
                        break;
                    case TileType.SURPRISE:
                        this.surpriseTileIndex = tileIndex;
                        this.tiles[tileIndex].tileType = TileType.EMPTY;
                        break;
                    case TileType.SPEED:
                        this.speedPillTileIndex= tileIndex;
                        this.tiles[tileIndex].tileType = TileType.EMPTY;
                        break;
                    case TileType.ANTI_SPEED:
                        this.antiSpeedPillTileIndex = tileIndex;
                        this.tiles[tileIndex].tileType = TileType.EMPTY;
                        break;
                    default:
                        break;
                }
            }
        }
        this.coinsLeft = numCoins;
    };
    this.setTilesImages = function() {
       for(var i=0; i<Properties.ROWS; i++) {
            for(var j=0; j<Properties.COLS; j++) {
                var tileIndex = i*Properties.COLS + j;
                var imgSrc;

                switch(this.tiles[tileIndex].tileType) {
                    case TileType.GATE:
                        imgSrc = 'images/gate.png';
                        break;
                    case TileType.COIN:
                        imgSrc = 'images/coin.png';
                        break;
                    case TileType.POWER:
                        imgSrc = 'images/power.png';
                        break;
                    case TileType.SPEED:
                        imgSrc = 'images/speed_pill.png';
                        break;
                    case TileType.ANTI_SPEED:
                        imgSrc = 'images/anti_speed_pill.png';
                        break;
                    case TileType.SURPRISE:
                        var imgIndexStr = Math.floor(Math.random() * 15);
                        imgSrc = 'images/surprise' + imgIndexStr + '.png';
                        break;
                    case TileType.WALL_VER:
                        imgSrc = 'images/wall_vertical.png';
                        break;
                    case TileType.WALL_HOR:
                        imgSrc = 'images/wall_horizentall.png';
                        break;
                    case TileType.WALL_CORNER_BL:
                        imgSrc = 'images/wall_corner_bottom_left.png';
                        break;
                    case TileType.WALL_CORNER_BR:
                        imgSrc = 'images/wall_corner_bottom_right.png';
                        break;
                    case TileType.WALL_CORNER_TL:
                        imgSrc = 'images/wall_corner_top_left.png';
                        break;
                    case TileType.WALL_CORNER_TR:
                        imgSrc = 'images/wall_corner_top_right.png';
                        break;
                    case TileType.WALL_END_UP:
                        imgSrc = 'images/wall_end_up.png';
                        break;
                    case TileType.WALL_END_DOWN:
                        imgSrc = 'images/wall_end_down.png';
                        break;
                    case TileType.WALL_END_RIGHT:
                        imgSrc = 'images/wall_end_right.png';
                        break;
                    case TileType.WALL_END_LEFT:
                        imgSrc = 'images/wall_end_left.png';
                        break;

                    default:
                        break;
                }
                this.tiles[tileIndex].img.src = imgSrc;
            }
        }
    };
    this.draw = function(context) {
        for(var i=0; i<this.tiles.length; i++)
            this.tiles[i].draw(context);
    };
    this.getTileState = function(pos) {
        if(pos.x<0 || pos.x>=Properties.COLS || pos.y<0 || pos.y>=Properties.ROWS)
            return(TileState.TILE_NOT_FREE);

        var tileIndex = pos.y*Properties.COLS + pos.x;
        if(this.tiles[tileIndex].tileType == TileType.GATE)
            return(TileState.TILE_GATE);

        if(this.tiles[tileIndex].tileType != TileType.WALL_VER && this.tiles[tileIndex].tileType != TileType.WALL_HOR && this.tiles[tileIndex].tileType != TileType.WALL_CORNER_BL &&
            this.tiles[tileIndex].tileType != TileType.WALL_CORNER_BR && this.tiles[tileIndex].tileType != TileType.WALL_CORNER_TL && this.tiles[tileIndex].tileType != TileType.WALL_CORNER_TR &&
            this.tiles[tileIndex].tileType != TileType.WALL_END_UP && this.tiles[tileIndex].tileType != TileType.WALL_END_DOWN &&
            this.tiles[tileIndex].tileType != TileType.WALL_END_RIGHT && this.tiles[tileIndex].tileType != TileType.WALL_END_LEFT)
            return(TileState.TILE_FREE);

        return(TileState.TILE_NOT_FREE);
    };
    this.updateTile = function(pos) {
        var tileType = TileType.EMPTY;
        var tileIndex = pos.y*Properties.COLS + pos.x;
        switch(this.tiles[tileIndex].tileType) {
            case TileType.COIN:
                this.coinsLeft--;
                tileType = this.tiles[tileIndex].tileType;
                break;
            case TileType.SURPRISE:
            case TileType.SPEED:
            case TileType.ANTI_SPEED:
                tileType = this.tiles[tileIndex].tileType;
                break;
            case TileType.POWER:
                tileType = TileType.POWER;
                break;
            default:
                break;
        }
        this.tiles[tileIndex].tileType = TileType.EMPTY;
        return(tileType);
    };
    this.addItem = function(tileType) {
        var index;
        switch(tileType) {
            case TileType.SPEED:
                var index = this.speedPillTileIndex;
                break;
            case TileType.ANTI_SPEED:
                index = this.antiSpeedPillTileIndex;
                break;
            case TileType.SURPRISE:
                index = this.surpriseTileIndex;
                break;
            default:
                return;
        }
        if(this.tiles[index].tileType == tileType)
            return;
        this.tiles[index].tileType = tileType;
        this.setTilesImages();
    }
    this.getGatePos = function() {
        var gatePos = new Point(0,0);
        for(var i=0; i<this.tiles.length; i++) {
            if(this.tiles[i].tileType == TileType.GATE) {
                gatePos.x = i%Properties.COLS;
                gatePos.y = Math.floor(i/Properties.COLS);
            }
        }
        return(gatePos);
    };
    this.getCoinsLeft = function() {
        return(this.coinsLeft);
    };
};



