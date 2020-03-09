/* File: GridObject.js 
 *
 * Abstracts a grid object's behavior and apparance
 */

/*jslint node: true, vars: true */
/*global vec2, vec3, BoundingBox */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function GridObject(renderableObj, grid, cellX, cellY, width, height, isLocked) {
    this.mRenderComponent = renderableObj;
    this.mVisible = true;
//    this.mCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
//    this.mSpeed = 0;

    this.mCellX = cellX;
    this.mCellY = cellY;
    this.mGridWidth = width;
    this.mGridHeight = height;
    
    this.mGrid = grid;
    
    this.mGridObj = new SpriteRenderable(renderableObj);
    
    this.mGridObj.setColor([1, 1, 1, 0]);
    
    this.mGridObj.getXform().setPosition(this.mGrid.getWCFromCell(cellX, cellY)[0]
                                    ,this.mGrid.getWCFromCell(cellX, cellY)[1]);
                                    
    this.mGridObj.getXform().setSize(this.mGrid.getCellWidth() * width
                                    ,this.mGrid.getCellHeight() * height);
    
    this.mIsLocked = isLocked;
}

GridObject.prototype.getPos = function () { return this.mGridPos; };

GridObject.prototype.setPos = function (cellX, cellY) {
    this.mPosition = new vec2.fromValues(cellX, cellY);
};

GridObject.prototype.getSize = function () { return vec2.fromValues(this.mWidth, this.mHeight); };

GridObject.prototype.setSize = function(width, height) {
    this.mWidth = width;
    this.mHeight = height;
    this.mRenderComponent.getXform().setSize(this.mGrid.getCellWidth() * width, this.mGrid.getCellHeight() * height);
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

