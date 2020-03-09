/* File: GridObject.js 
 *
 * Abstracts a grid object's behavior and apparance
 */

/*jslint node: true, vars: true */
/*global vec2, vec3, BoundingBox */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function GridObject(renderableObj, grid, positionX, positionY, width, height, isLocked) {
    this.mRenderComponent = renderableObj;
    this.mVisible = true;
//    this.mCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
//    this.mSpeed = 0;
    
    this.mGrid = grid;
    this.mPosition = new vec2.fromValues(positionX, positionY);
    this.mWidth = width;
    this.mHeight = height;
    this.mIsLocked = isLocked;
}

GridObject.prototype.getPos = function () { return this.mPosition; };

GridObject.prototype.setPos = function (cellX, cellY) {
    this.mPosition = new vec2.fromValues(cellX, cellY);
};

GridObject.prototype.getSize = function () { return vec2.fromValues(this.mWidth, this.mHeight); };

GridObject.prototype.setSize = function(width, height) {
    this.mWidth = width;
    this.mHeight = height;
};

GridObject.prototype.lockObject = function() { this.mIsLocked = true; };

GridObject.prototype.unlockObject = function() { this.mIsLocked = false; };



GridObject.prototype.getXform = function () { return this.mRenderComponent.getXform(); };
GridObject.prototype.getBBox = function () {
    var xform = this.getXform();
    var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    return b;
};

GridObject.prototype.setVisibility = function (f) { this.mVisible = f; };
GridObject.prototype.isVisible = function () { return this.mVisible; };

