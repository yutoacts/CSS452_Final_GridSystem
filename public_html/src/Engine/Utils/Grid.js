/* 
 * File: Grid.js
 * Grid API System
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false, vec2: false, Math: false */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";


function Grid(gridSizeX, gridSizeY, cellSizeX, cellSizeY) 
{
    this.mGridSizeX = gridSizeX;    // size of Grid horizontally - cols
    this.mGridSizeY = gridSizeY;    // size of Grid vertically - rows
    this.mCellSizeX = cellSizeX;    // size of each Cell horizontally - width
    this.mCellSizeY = cellSizeY;    // size of each Cell vertically - height
    this.mGridObjects = [];         // 2D array of GridObjects
    this.mXform = new Transform();  // Grid Xform for manipulation/position
    
    this.mShowGrid = false;         // boolean for drawing Grid
    this.mGridXLines = [];          // array for Grid horizontal lines
    this.mGridYLines = [];          // array for Grid vertical lines
    
    this.initialize();
}

Grid.prototype.initialize = function()
{
    // Initialize 2D Array
    for(var i = 0; i < this.mRow; i++)
    {
        var objectsY = [];
        this.mGridObjects.push(objectsY);
    }
};

Grid.prototype.update = function()
{
    
};

Grid.prototype.draw = function(aCamera)
{
    if(this.mShowGrid)
    {
        this._drawGrid(aCamera);
    }
};

// <editor-fold desc="Public Methods">
Grid.prototype.getXform = function() { return this.mXform; };
Grid.prototype.getWidth = function () { return this.mGridSizeX; };
Grid.prototype.getHeight = function () { return this.mGridSizeY; };
Grid.prototype.getCellWidth = function () { return this.mCellSizeX; };
Grid.prototype.getCellHeight = function () { return this.mCellSizeY; };
Grid.prototype.getObjCell = function(cellX, cellY)
{
    if(this.mGridObjects[cellX][cellY] !== null)
    {
        return this.mGridObjects[cellX][cellY];
    }
    return null;
};
// </editor-fold>

Grid.prototype._drawGrid = function()
{
    
};