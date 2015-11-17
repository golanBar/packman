/**
 * Created by Golan Bar on 20-Jun-15.
 */

var Rect = function(left, top, width, height) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
};

var Point = function(x, y) {
    this.x = x;
    this.y = y;

    this.isEqual = function(point) {
        return(this.x == point.x && this.y == point.y );
    };
};

