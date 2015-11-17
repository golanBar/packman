<%--
  Created by IntelliJ IDEA.
  User: Golan Bar
  Date: 09-Jun-15
  Time: 14:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Java Web Application JavaScriptPackman</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel='stylesheet' type='text/css' href='css/stylesheet.css'/>
    <link rel="stylesheet" type="text/css" href="css/fireworks.css">
  </head>
  <body>
    <canvas id="myCanvas" width="720" height="576">This text is displayed if your browser does not support HTML5 Canvas.</canvas>

    <div class="gameOverAnim" style="display:none">
      <svg class="svg-packman"  viewBox="0 0 50 52" xmlns="http://www.w3.org/2000/svg">
        <path class="body"
              d="M15 0c-8.284 0-15 6.715-15 14.996v8h.005c-.002 2.505-.005 8.888.005 9.004l4.99-3 5 3 5-3 5 3c2.48 0 2.518-3 5-3 2.48 0 2.488 3 4.971 3-.014-.005.014-6.498.025-9.004h.004v-8c0-8.281-6.716-14.996-15-14.996z">
        </path>
        <path class="eyewhite"
              d="M20.5 13.001c-1.934 0-3.5 1.566-3.5 3.5 0 1.933 1.566 3.499 3.5 3.499s3.5-1.566 3.5-3.499c0-1.934-1.566-3.5-3.5-3.5zm-11 0c-1.933 0-3.5 1.566-3.5 3.5 0 1.933 1.567 3.499 3.5 3.499s3.5-1.566 3.5-3.499c0-1.934-1.567-3.5-3.5-3.5z">
        </path>
        <path class="eye"
              d="M20.5 15c-.828 0-1.5.672-1.5 1.501 0 .828.672 1.499 1.5 1.499s1.5-.671 1.5-1.499c0-.829-.672-1.501-1.5-1.501zm-11 0c-.828 0-1.5.672-1.5 1.501 0 .828.672 1.499 1.5 1.499s1.5-.671 1.5-1.499c0-.829-.672-1.501-1.5-1.501z">
        </path>
        <path class="shade"
              d="M2.003 14.996c0-7.945 6.184-14.429 13.997-14.946-.332-.022-.662-.05-1-.05-8.282 0-14.997 6.714-14.997 14.996 0 0-.003 16.857.01 17.004.923 0 1.503-.404 1.995-.912-.004-1.749-.005-16.092-.005-16.092z">
        </path>
      </svg>
    </div>

    <script type='text/javascript' src='defs/Properties.js'></script>
    <script type='text/javascript' src='defs/Enums.js'></script>
    <script type='text/javascript' src='defs/Levels.js'></script>
    <script type='text/javascript' src='model/Utils.js'></script>
    <script type='text/javascript' src='model/Packman.js'></script>
    <script type='text/javascript' src='model/Ghost.js'></script>
    <script type='text/javascript' src='model/GameModel.js'></script>
    <script type='text/javascript' src='model/Maze.js'></script>
    <script type='text/javascript' src='animation/Sprite.js'></script>
    <script type='text/javascript' src='animation/Fireworks.js'></script>
    <script type='text/javascript' src='Controller.js' charset="utf-8"></script>

    <%--winning animation--%>
    <div id="winning_stage" style="display:none"></div>
    <script type="text/javascript" src="animation/Fireworks.js"></script>


  </body>
</html>
