/**
 * Created by Golan Bar on 19-Jun-15.
 */
var W0 = TileType.WALL_VER;
var W1 = TileType.WALL_HOR;
var W2 = TileType.WALL_CORNER_BL;
var W3 = TileType.WALL_CORNER_BR;
var W4 = TileType.WALL_CORNER_TL;
var W5 = TileType.WALL_CORNER_TR;
var W6 = TileType.WALL_END_UP;
var W7 = TileType.WALL_END_DOWN;
var W8 = TileType.WALL_END_RIGHT;
var W9 = TileType.WALL_END_LEFT;
var GA = TileType.GATE;
var __ = TileType.COIN;
var PO = TileType.POWER;
var AS = TileType.ANTI_SPEED;
var SP = TileType.SPEED;
var SU = TileType.SURPRISE;
var PS = TileType.PACMAN_START;
var GS = TileType.GHOST_START;
var PA = TileType.PASSAGE;
var EM = TileType.EMPTY;

//GB: notice that the template defines the way I handle columns and rows: for example the cell at 1,2 is at the second row and the third column
// this means I will handle each point(x,y) as (row, column)



var mazeTemplate1 = [
    [W6,__,__,__,__,__,__,__,__,__,SP,__,__,__,__,__,__,__,__,__,W6],
    [W0,__,W9,W1,W8,__,W4,W1,W8,__,W6,__,W9,W1,W5,__,W9,W1,W8,__,W0],
    [W0,PO,__,__,__,__,W0,__,__,__,W0,__,__,__,W0,__,__,__,__,PO,W0],
    [W0,W1,W8,__,W6,__,W7,__,W9,W1,W1,W1,W8,__,W7,__,W6,__,W9,W1,W0],
    [W0,__,__,__,W0,__,__,__,__,__,SU,__,__,__,__,__,W0,__,__,__,W0],
    [W7,__,W9,W1,W3,__,W6,__,W4,W8,GA,W9,W5,__,W6,__,W2,W1,W8,__,W7],
    [PA,__,__,__,__,__,W0,__,W0,EM,GS,EM,W0,__,W0,__,__,__,__,__,PA],
    [W6,__,W9,W1,W5,__,W7,__,W2,W1,W1,W1,W3,__,W7,__,W4,W1,W8,__,W6],
    [W0,__,__,__,W0,__,__,__,__,__,PS,__,__,__,__,__,W0,__,__,__,W0],
    [W0,W1,W8,__,W7,__,W6,__,W9,W1,W1,W1,W8,__,W6,__,W7,__,W9,W1,W0],
    [W0,PO,__,__,__,__,W0,__,__,__,W0,__,__,__,W0,__,__,__,__,PO,W0],
    [W0,__,W9,W1,W8,__,W2,W1,W8,__,W7,__,W9,W1,W3,__,W9,W1,W8,__,W0],
    [W0,__,__,__,__,__,__,__,__,__,AS,__,__,__,__,__,__,__,__,__,W0],
    [W2,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W3]
];

var mazeTemplate2 = [
    [W6,__,__,__,__,__,__,__,__,__,AS,__,__,__,__,__,__,__,__,__,W6],
    [W0,__,W4,W1,W8,__,W6,__,W9,W1,W1,W1,W8,__,W6,__,W9,W1,W5,__,W0],
    [W0,PO,W0,__,__,__,W0,__,__,__,W0,__,__,__,W0,__,__,__,W0,PO,W0],
    [W0,__,W7,__,W9,W1,W1,W1,W8,__,W7,__,W9,W1,W1,W1,W8,__,W7,__,W0],
    [W0,__,__,__,__,__,__,__,__,__,SP,__,__,__,__,__,__,__,__,__,W0],
    [W7,__,W9,W8,__,W9,W8,__,W4,W8,GA,W9,W5,__,W9,W8,__,W9,W8,__,W7],
    [PA,__,__,__,__,__,__,__,W0,EM,GS,EM,W0,__,__,__,__,__,__,__,PA],
    [W6,__,W9,W1,W1,W1,W8,__,W2,W1,W1,W1,W3,__,W9,W1,W1,W1,W8,__,W6],
    [W0,__,__,__,__,__,__,__,__,__,PS,__,__,__,__,__,__,__,__,__,W0],
    [W0,__,W6,__,W9,W1,W1,W1,W8,__,W6,__,W9,W1,W1,W1,W8,__,W6,__,W0],
    [W0,PO,W0,__,__,__,W0,__,__,__,W0,__,__,__,W0,__,__,__,W0,PO,W0],
    [W0,__,W2,W1,W8,__,W7,__,W9,W1,W1,W1,W8,__,W7,__,W9,W1,W3,__,W0],
    [W0,__,__,__,__,__,__,__,__,__,SU,__,__,__,__,__,__,__,__,__,W0],
    [W2,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W3]
];

var mazeTemplate3 = [
    [W4,W1,W1,W5,__,__,__,__,__,W4,W1,W5,__,__,__,__,__,W4,W1,W1,W5],
    [W0,__,PO,W0,__,__,__,__,__,__,PS,__,__,__,__,__,__,W0,PO,__,W0],
    [W0,__,W9,W3,__,__,__,__,__,W2,W1,W3,__,__,__,__,__,W2,W8,__,W0],
    [W0,__,__,__,__,W4,W5,__,__,__,SU,__,__,__,W4,W5,__,__,__,__,W0],
    [W0,__,__,__,__,W2,W3,__,__,__,__,__,__,__,W2,W3,__,__,__,__,W0],
    [W7,__,__,__,__,__,__,__,W4,W1,GA,W1,W5,__,__,__,__,__,__,__,W7],
    [PA,__,__,__,__,__,__,__,EM,EM,GS,EM,EM,__,__,__,__,__,__,__,PA],
    [W6,__,W4,W8,EM,W9,W5,__,W2,W1,EM,W1,W3,__,W4,W8,EM,W9,W5,__,W6],
    [W0,__,W7,__,__,__,W7,__,__,__,__,__,__,__,W7,__,__,__,W7,__,W0],
    [W0,__,EM,__,PO,__,EM,__,__,__,__,__,__,__,EM,__,PO,__,EM,__,W0],
    [W0,__,W6,__,__,__,W6,__,__,W4,W1,W5,__,__,W6,__,__,__,W6,__,W0],
    [W0,__,W2,W8,EM,W9,W3,__,__,__,SP,__,__,__,W2,W8,EM,W9,W3,__,W0],
    [W0,__,__,__,__,__,__,__,__,W2,W1,W3,__,__,__,__,__,__,__,__,W0],
    [W2,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W3]
];


var mazeTemplate4 = [
    [W6,__,__,__,__,__,__,__,__,W9,W1,W8,__,__,__,__,__,__,__,__,W6],
    [W0,__,W4,W8,EM,W9,W1,W8,__,__,__,__,__,W9,W1,W8,EM,W9,W5,__,W0],
    [W0,__,W7,__,__,__,W7,__,__,W6,SU,W6,__,__,W7,__,__,__,W7,__,W0],
    [W0,__,EM,__,PO,__,EM,__,W9,W3,__,W2,W8,__,EM,__,PO,__,EM,__,W0],
    [W0,__,W6,__,__,__,W6,__,__,__,SP,__,__,__,W6,__,__,__,W6,__,W0],
    [W7,__,W2,W8,EM,W9,W3,__,W4,W8,GA,W9,W5,__,W2,W8,EM,W9,W3,__,W7],
    [PA,__,__,__,__,__,__,__,W0,EM,GS,EM,W0,__,__,__,__,__,__,__,PA],
    [W6,__,W4,W8,EM,W9,W5,__,W2,W1,W1,W1,W3,__,W4,W8,EM,W9,W5,__,W6],
    [W0,__,W7,__,__,__,W7,__,__,__,PS,__,__,__,W7,__,__,__,W7,__,W0],
    [W0,__,EM,__,PO,__,EM,__,W9,W5,__,W4,W8,__,EM,__,PO,__,EM,__,W0],
    [W0,__,W6,__,__,__,W6,__,__,W7,__,W7,__,__,W6,__,__,__,W6,__,W0],
    [W0,__,W2,W8,EM,W9,W1,W8,__,__,AS,__,__,W9,W1,W8,EM,W9,W3,__,W0],
    [W0,__,__,__,__,__,__,__,__,W9,W1,W8,__,__,__,__,__,__,__,__,W0],
    [W2,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W3]
];

var mazeTemplate5 = [
    [W6,PO,__,__,__,__,__,__,__,__,SP,__,__,__,__,__,__,__,__,PO,W6],
    [W0,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,W0],
    [W0,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,W0],
    [W0,__,__,__,__,__,__,__,__,W4,__,W5,__,__,__,__,__,__,__,__,W0],
    [W0,__,__,__,__,__,__,__,__,W0,SU,W0,__,__,__,__,__,__,__,__,W0],
    [W7,__,__,__,__,__,__,__,W4,W3,GA,W2,W5,__,__,__,__,__,__,__,W7],
    [PA,__,__,__,__,__,__,__,EM,EM,GS,EM,EM,__,__,__,__,__,__,__,PA],
    [W6,__,__,__,__,__,__,__,W2,W1,EM,W1,W3,__,__,__,__,__,__,__,W6],
    [W0,__,__,__,__,__,__,__,__,__,EM,__,__,__,__,__,__,__,__,__,W0],
    [W0,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,W0],
    [W0,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,W0],
    [W0,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,W0],
    [W0,PO,__,__,__,__,__,__,__,__,PS,__,__,__,__,__,__,__,__,PO,W0],
    [W2,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W3]
];

var bonusTemplate = [
    [W6,EM,EM,EM,EM,EM,EM,EM,EM,EM,PS,EM,EM,EM,EM,EM,EM,EM,EM,EM,W6],
    [W0,EM,EM,EM,EM,EM,EM,EM,EM,EM,SU,EM,EM,EM,EM,EM,EM,EM,EM,EM,W0],
    [W0,EM,EM,EM,PO,__,PO,__,PO,__,PO,__,PO,__,PO,__,PO,EM,EM,EM,W0],
    [EM,EM,EM,EM,EM,EM,EM,EM,EM,EM,PO,EM,EM,EM,EM,EM,EM,EM,EM,EM,W0],
    [W0,EM,EM,EM,EM,EM,EM,EM,EM,EM,PO,EM,EM,EM,EM,EM,EM,EM,EM,EM,W0],
    [W7,EM,EM,EM,EM,EM,EM,EM,EM,EM,PO,EM,EM,EM,EM,EM,EM,EM,EM,EM,W7],
    [PA,EM,EM,EM,EM,EM,EM,EM,EM,EM,PO,EM,EM,EM,EM,EM,EM,EM,EM,EM,PA],
    [W6,EM,EM,EM,PO,__,PO,__,PO,__,PO,__,PO,__,PO,__,PO,EM,EM,EM,W6],
    [W0,EM,EM,EM,EM,EM,EM,EM,EM,EM,PO,EM,EM,EM,EM,EM,EM,EM,EM,EM,W0],
    [W0,EM,EM,EM,EM,EM,EM,EM,EM,EM,PO,EM,EM,EM,EM,EM,EM,EM,EM,EM,W0],
    [W0,EM,EM,EM,EM,EM,EM,EM,EM,EM,PO,EM,EM,EM,EM,EM,EM,EM,EM,EM,W0],
    [W0,EM,EM,EM,PO,__,PO,__,PO,__,PO,__,PO,__,PO,__,PO,EM,EM,EM,W0],
    [W0,EM,EM,EM,EM,EM,EM,EM,EM,EM,AS,SP,EM,EM,EM,EM,EM,EM,EM,EM,W0],
    [W2,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W1,W3]
];

/////////////////////////////////////////////////////////////////////////////
var levels = [];
levels.push({mazeTemplate:mazeTemplate1, numGhosts:1, ghostChaseSpeed:12, ghostReleaseMS:[10000,-1,-1,-1], ghostStopStrayMS:[60000,-1,-1,-1]});
levels.push({mazeTemplate:mazeTemplate2, numGhosts:2, ghostChaseSpeed:12, ghostReleaseMS:[10000,12000,-1,-1], ghostStopStrayMS:[50000,80000,-1,-1]});
levels.push({mazeTemplate:mazeTemplate3, numGhosts:3, ghostChaseSpeed:12, ghostReleaseMS:[10000,10000,20000,-1], ghostStopStrayMS:[40000,60000,80000,-1]});
levels.push({mazeTemplate:mazeTemplate4, numGhosts:3, ghostChaseSpeed:11, ghostReleaseMS:[1,10000,12000,-1], ghostStopStrayMS:[1,40000,30000,-1]});
levels.push({mazeTemplate:mazeTemplate5, numGhosts:4, ghostChaseSpeed:10, ghostReleaseMS:[1,6000,10000,14000], ghostStopStrayMS:[1,50000,40000,40000]});
levels.push({mazeTemplate:mazeTemplate1, numGhosts:4, ghostChaseSpeed:8, ghostReleaseMS:[1,6000,10000,14000], ghostStopStrayMS:[1,20000,25000,30000]});
levels.push({mazeTemplate:mazeTemplate2, numGhosts:4, ghostChaseSpeed:8, ghostReleaseMS:[1,5000,9000,12000], ghostStopStrayMS:[1,15000,20000,25000]});
levels.push({mazeTemplate:mazeTemplate3, numGhosts:4, ghostChaseSpeed:7, ghostReleaseMS:[1,5000,9000,12000], ghostStopStrayMS:[1,10000,14000,15000]});
levels.push({mazeTemplate:mazeTemplate4, numGhosts:4, ghostChaseSpeed:7, ghostReleaseMS:[1,3000,9000,12000], ghostStopStrayMS:[1,10000,12000,14000]});
levels.push({mazeTemplate:mazeTemplate5, numGhosts:4, ghostChaseSpeed:7, ghostReleaseMS:[1,2000,7000,10000], ghostStopStrayMS:[1,8000,10000,12000]});
levels.push({mazeTemplate:mazeTemplate1, numGhosts:4, ghostChaseSpeed:6, ghostReleaseMS:[1,1000,7000,9000], ghostStopStrayMS:[1,6000,8000,10000]});
levels.push({mazeTemplate:mazeTemplate2, numGhosts:4, ghostChaseSpeed:6, ghostReleaseMS:[1,1,7000,10000], ghostStopStrayMS:[1,1,10000,15000]});
levels.push({mazeTemplate:mazeTemplate3, numGhosts:4, ghostChaseSpeed:6, ghostReleaseMS:[1,1,1,8000], ghostStopStrayMS:[1,1,1,10000]});
levels.push({mazeTemplate:mazeTemplate4, numGhosts:4, ghostChaseSpeed:5, ghostReleaseMS:[1,1,1,1], ghostStopStrayMS:[1,1,1,1]});
levels.push({mazeTemplate:mazeTemplate5, numGhosts:4, ghostChaseSpeed:5, ghostReleaseMS:[1,1,1,1], ghostStopStrayMS:[1,1,1,1]});
levels.push({mazeTemplate:bonusTemplate, numGhosts:0, ghostChaseSpeed:5, ghostReleaseMS:[-1,-1,-1,-1], ghostStopStrayMS:[-1,-1,-1,-1]});


function getNumLevels() {
    return(levels.length);
}

function getInitialTileType(i, row, col) {
    return(levels[i].mazeTemplate[row][col]);
}

function getGhostReleaseMS(i, ghostI) {
    return(levels[i].ghostReleaseMS[ghostI]);
}

function getGhostStopStrayMS(i, ghostI) {
    return(levels[i].ghostStopStrayMS[ghostI]);
}

function getNumGhosts(i) {
    return(levels[i].numGhosts);
}

function getghostChaseSpeed(i) {
    return(levels[i].ghostChaseSpeed);
}



