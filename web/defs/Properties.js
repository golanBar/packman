/**
 * Created by Golan Bar on 20-Jun-15.
 */
var Properties = {
    /* display */
    COLS: 21,
    ROWS: 14,
    TILE_WIDTH: 30,
    TILE_HEIGHT: 30,
    MAZE_RECT: {x:40, y:120, width:670, height:550},

    /* packMan */
    PACKMAN_LIVES: 3,
    PACKMAN_SPEED: {normal:7, speedPill:4, antiSpeedPill:7},

    /* ghosts */
    MAX_GHOSTS: 4,
    GHOST_SPEED: {dead:3, escape:5},

    /* intervals */
    INTERVALS: {gameLoopMS:50, ghostsEscapeMS:12000, ghostsStopEscapeMS:3000, packmanPillMS:20000, mazeItemMS:30000},

    /* scores */
    SCORE: {coin:5, killGhost:150, surprise:100, power:25},

    /* Miscellaneous */
    NUM_POINTS_FOR_EXTRA_LIFE: 3000,
    COLLISION_FACTOR: 0.75,
    CHANGE_IMG_DURATION: 3

}
