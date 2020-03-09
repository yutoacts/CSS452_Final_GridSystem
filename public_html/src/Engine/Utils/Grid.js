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
    this.mGridColor = [0, 0, 0, 1]; // color for Grid lines
    
    this.initialize();
}

Grid.prototype.initialize = function()
{
    // Initialize 2D Array
    for(var i = 0; i < this.mGridSizeX; i++)
    {
        var GridObjectsY = [];
        this.mGridObjects.push(GridObjectsY);
    }
};

Grid.prototype.update = function()
{
    this._setGridLines();
};

Grid.prototype.draw = function(aCamera)
{
    if(this.mShowGrid)
    {
        this._drawGrid(aCamera);
    }
};

// <editor-fold desc="Public Methods">
Grid.prototype.getObjCell = function(cellX, cellY)
{
    // Get object if exists at [cellX, cellY], otherwise return null
    if(this.mGridObjects[cellX][cellY] !== null || this.mGridObjects[cellX][cellY] !== undefined)
    {
        return this.mGridObjects[cellX][cellY];
    }
    return null;
};

Grid.prototype.getObjWC = function(cellX, cellY)
{
    // Get origin of Grid (lower left)
    var originX = this.mXform.getXPos() - (this.getTotalWidth() / 2);
    var originY = this.mXform.getYPos() - (this.getTotalHeight() / 2);
    
    var objX = (originX + (cellX * this.mCellSizeX)) + (this.mCellSizeX / 2);
    var objY = (originY + (cellY * this.mCellSizeY)) + (this.mCellSizeY / 2);
    
    return [objX, objY];
};

Grid.prototype.getXform = function() { return this.mXform; };
Grid.prototype.getNumRows = function () { return this.mGridSizeY; };
Grid.prototype.getNumCols = function () { return this.mGridSizeX; };
Grid.prototype.getTotalWidth = function () { return (this.mGridSizeX * this.mCellSizeX); };
Grid.prototype.getTotalHeight = function () { return (this.mGridSizeY * this.mCellSizeY); };
Grid.prototype.getCellWidth = function () { return this.mCellSizeX; };
Grid.prototype.getCellHeight = function () { return this.mCellSizeY; };
Grid.prototype.setColor = function (color)
{
    this.mGridColor = color;
};
Grid.prototype.getColor = function() { return this.mGridColor; };
Grid.prototype.setDraw = function(bool)
{
    this.mShowGrid = bool;
};
// </editor-fold>

// Helper function for setting vertices of Grid lines
Grid.prototype._setGridLines = function()
{
    // Get origin of Grid (lower left)
    var originX = this.mXform.getXPos() - (this.getTotalWidth() / 2);
    var originY = this.mXform.getYPos() - (this.getTotalHeight() / 2);
    
    // Set vertical lines based on Grid width
    for(var i = 0; i <= this.mGridSizeX; i++)
    {
        var lineY = new LineRenderable();
        lineY.setColor(this.mGridColor);
        lineY.setVertices(originX + (i * this.mCellSizeX), originY, originX + (i * this.mCellSizeX), originY + this.getTotalHeight());
        this.mGridYLines.push(lineY);
    }
    
    // Set horizontal lines based on Grid height
    for(var j = 0; j <= this.mGridSizeY; j++)
    {
        var lineX = new LineRenderable();
        lineX.setColor(this.mGridColor);
        lineX.setVertices(originX, originY + (j * this.mCellSizeY), originX + this.getTotalWidth(), originY + (j * this.mCellSizeY));
        this.mGridXLines.push(lineX);
    }
};

// Helper function for drawing Grid lines
Grid.prototype._drawGrid = function(aCamera)
{
    // Draw horizontal lines
    for(var i = 0; i < this.mGridXLines.length; i++)
    {
        this.mGridXLines[i].draw(aCamera);
    }
    
    // Draw vertical lines
    for(var j = 0; j < this.mGridYLines.length; j++)
    {
        this.mGridYLines[j].draw(aCamera);
    }
};