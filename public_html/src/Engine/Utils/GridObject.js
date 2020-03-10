/* File: GridObject.js 
 *
 * Abstracts a grid object's behavior and apparance
 */

/*jslint node: true, vars: true */
/*global vec2, vec3, BoundingBox */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function GridObject(obj, grid, cellX, cellY, width, height, isLocked) {
    this.mVisible = true;

    this.mCellX = cellX;
    this.mCellY = cellY;
    this.mGridWidth = width;
    this.mGridHeight = height;
    
    this.mGrid = grid;
    
    this.mGridObj = obj;
    
    //this.mGridObj.setColor([1, 1, 1, 0]);
    
    this.mGridObj.getXform().setPosition(this.mGrid.getWCFromCell(cellX, cellY)[0]
                                    ,this.mGrid.getWCFromCell(cellX, cellY)[1]);
                                    
    //this.mGridObj.getXform().setSize(this.mGrid.getCellWidth() * width
                                    //,this.mGrid.getCellHeight() * height);
    
    this.mIsLocked = isLocked;
    
    this.mGrid.addObj(this);
}

GridObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        this.mGridObj.draw(aCamera);
    }
};

GridObject.prototype.getPos = function () { return [this.mCellX, this.mCellY]; };

GridObject.prototype.setPos = function (cellX, cellY) {
    this.mCellX = cellX;
    this.mCellY = cellY;
    this.mGridObj.getXform().setPosition(this.mGrid.getWCFromCell(cellX, cellY)[0]
                                    ,this.mGrid.getWCFromCell(cellX, cellY)[1]);
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

