/**
 * Created by Golan Bar on 16-Jun-15.
 */

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var gameModel = new GameModel();
var maze = new Maze();
var packman = new Packman();
var ghosts = [];
for(var i=0; i<Properties.MAX_GHOSTS; i++)
    ghosts.push(new Ghost());

var IntervalVar ;
var paused = false;
var gameOverImgIndex = 0;

var BGImg = new Image();
BGImg.src = 'images/game_bg.png';
var GameOverImg1 = new Image();
GameOverImg1.src = 'images/gameOver1.png';
var GameOverImg2 = new Image();
GameOverImg2.src = 'images/gameOver2.png';
var GameOverImg3 = new Image();
var GameOverImg4 = new Image();
var GameOverImg5 = new Image();

window.addEventListener("keydown", handleKeyboard, false);
window.onload = function() {
    gameModel.initAudioObjs();
    gameModel.initLevel(0);
    setInterval(function(){gameLoop()}, Properties.INTERVALS.gameLoopMS);
};

function gameLoop() {
    if(paused)    return;

    switch(gameModel.getState()) {
        case GameState.GAME_RUN:
        case GameState.GAME_PACKMAN_CHASE:
            var tileType = packman.updatePosition();
            if (tileType != TileType.EMPTY)
                gameModel.handleMove(tileType);
            for(var i=0; i<getNumGhosts(gameModel.getLevel()); i++) {
                ghosts[i].updatePosition();
            }
            gameModel.checkCollisions();
            break;
        case GameState.GAME_OVER:
            paused = true;
            gameOverImgIndex = 0;
            drawGameOver();
            persistScore();
            return;
        case GameState.GAME_COMPLETED:
            paused = true;
            gameOverImgIndex = 0;
            drawGameCompleted();
            persistScore();
            return;
        case GameState.GAME_PACKMAN_KILLED:
            for(i=0; i<getNumGhosts(gameModel.getLevel()); i++) {
                ghosts[i].updatePosition();
            }
            gameModel.checkContinueAfterPackmanKilled();
            break;
        case GameState.GAME_PACKMAN_POWER:
            gameModel.packmanPower();
            break;
        case GameState.GAME_LEVEL_COMPLETED:
            paused = true;
            drawLevelCompleted();
            return;
        default:
            break;
    }
    draw();

}

function draw() {
    context.clearRect(0, 0, 720, 576);
    context.drawImage(BGImg, 0, 0);
    maze.draw(context);
    packman.draw(context);
    for(var i=0; i<getNumGhosts(gameModel.getLevel()); i++)
        ghosts[i].draw(context);

    context.font="25px Times New Roman";
    context.fillStyle = "white"; // move to css!!!!!!!!!!!!!!!!!!!!!
    context.fillText("ניקוד: " + gameModel.getScore(), 500, 80);
    context.fillText("רמה: " + (gameModel.getLevel()+1), 300, 113);
    context.fillText("חיים: " + packman.getLives(), 100, 80);
}

function drawGameOver() {
    context.clearRect(0, 0, 720, 576);
    context.fillStyle="#FFA500";
    context.fillRect(0, 0, 720, 610);

    document.getElementsByClassName('gameOverAnim')[0].style.display = 'inline-block';

    context.drawImage(GameOverImg1, 100, 200);
    context.drawImage(GameOverImg2, 380, 200);

    context.font="30px Times New Roman";
    context.fillStyle = "white"; // move to css!!!!!!!!!!!!!!!!!!!!!
    context.fillText("!!!המשחק נגמר", 300, 140);
    context.fillText("!!!ליה ודניאל - נסו שוב, לחצו על מקש הרווח כדי להמשיך", 80, 180);

    IntervalVar = setInterval(function(){redrawGameOverImages() }, 100);
}

function redrawGameOverImages() {
    GameOverImg3.src = ++gameOverImgIndex<3 ? 'images/ghost0.png':'images/ghost1.png';
    GameOverImg4.src = gameOverImgIndex<3 ? 'images/ghost_escape0.png':'images/ghost_escape1.png';
    GameOverImg5.src = gameOverImgIndex<3 ? 'images/ghost_killed0.png':'images/ghost_killed1.png';
    context.drawImage(GameOverImg3, 120, 500);
    context.drawImage(GameOverImg4, 340, 500);
    context.drawImage(GameOverImg5, 540, 500);

    if(gameOverImgIndex >= 6) gameOverImgIndex = 0;
}

function drawLevelCompleted() {
    // every 5 levels, display a different end level animation
    if(((gameModel.getLevel()+1) % 5) == 0) {
        context.clearRect(0, 0, 720, 576);
        context.drawImage(BGImg, 0, 0);
        context.fillStyle="#FFA500";
        context.fillRect(0, 0, 720, 610);

        document.getElementById('winning_stage').style.display = 'inline-block';
        context.drawImage(GameOverImg1, 100, 200);
        context.drawImage(GameOverImg2, 380, 200);

        context.font="30px Times New Roman";
        context.fillStyle = "white"; // move to css!!!!!!!!!!!!!!!!!!!!!
        context.fillText("כל הכבוד ליה ודניאל!!! סיימתם את שלב "+ (gameModel.getLevel()+1), 140, 100);
        context.fillText("לחצו על מקש הרווח להמשך", 210, 150);
        return;
    }

    context.clearRect(0, 0, 720, 576);
    context.drawImage(BGImg, 0, 0);

    context.font="25px Times New Roman";
    context.fillStyle = "white"; // move to css!!!!!!!!!!!!!!!!!!!!!
    context.fillText("ניקוד: " + gameModel.getScore(), 500, 80);
    context.fillText("חיים: " + packman.getLives(), 100, 80);

    context.font="30px Times New Roman";
    context.fillStyle = "yellow"; // move to css!!!!!!!!!!!!!!!!!!!!!
    context.fillText("כל הכבוד ליה ודניאל!!! סיימתם את שלב "+ (gameModel.getLevel()+1), 140, 200);
    context.fillText("לחצו על מקש הרווח להמשך", 210, 250);
}

function drawGameCompleted() {
    context.clearRect(0, 0, 720, 576);
    context.fillStyle="#FFA500";
    context.fillRect(0, 0, 720, 610);

    document.getElementById('winning_stage').style.display = 'inline-block';
    context.drawImage(GameOverImg1, 100, 200);
    context.drawImage(GameOverImg2, 380, 200);

    context.font="30px Times New Roman";
    context.fillStyle = "white"; // move to css!!!!!!!!!!!!!!!!!!!!!
    context.fillText("!!!כל הכבוד!!! ניצחתם את כל הרוחות", 150, 140);
    context.fillText("!!!ליה ודניאל -  לחצו על מקש הרווח כדי להתחיל משחק חדש", 60, 180);
}


function handleKeyboard(e) {
    switch(e.keyCode) {
        case 37: // left key pressed
            packman.changeDirection(Direction.DIR_LEFT);
            break;
        case 38: // up key pressed
            packman.changeDirection(Direction.DIR_UP);
            break;
        case 39: // right key pressed
            packman.changeDirection(Direction.DIR_RIGHT);
            break;
        case 40: // down key pressed
            packman.changeDirection(Direction.DIR_DOWN);
            break;
        case 13: // Enter
        case 32: // space
            if(gameModel.getState() == GameState.GAME_OVER) {
                clearInterval(IntervalVar);
                document.getElementsByClassName('gameOverAnim')[0].style.display = 'none';
                gameModel.initLevel(0);
                paused = false;
            }
            else if(gameModel.getState() == GameState.GAME_COMPLETED) {
                document.getElementById('winning_stage').style.display = 'none';
                gameModel.initLevel(0);
                paused = false;
            }
            else if(gameModel.getState() == GameState.GAME_LEVEL_COMPLETED) {
                document.getElementById('winning_stage').style.display = 'none';
                gameModel.initLevel(gameModel.getLevel()+1);
                paused = false;
            }
            break;
        case 27: // esc backdoor
            gameModel.backdoor();
            break;
        default :
            break;
    }
}

function persistScore(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "//packmanapp-golanbar.rhcloud.com/persistScore/", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    /*xmlHttp.onreadystatechange = handleReadyStateChange;*/
    xmlHttp.send("score=" + gameModel.getScore() + "&username=" + currUserName);
}

