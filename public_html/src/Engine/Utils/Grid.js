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
    this.mXform = new Transform();  // Grid Xform for manipulation/position
    
    this.mShowGrid = false;         // boolean for drawing Grid
    this.mGridXLines = [];          // array for Grid horizontal lines
    this.mGridYLines = [];          // array for Grid vertical lines
    this.mGridColor = [0, 0, 0, 1]; // color for Grid lines
    
    this.mGridObjects = [];         // 2D array of GridObjects
    
    // Initialize 2D Array
    for(var i = 0; i < this.mGridSizeX; i++)
    {
        var GridObjectsY = [];
        this.mGridObjects.push(GridObjectsY);
    }
}

Grid.prototype.update = function()
{
    this._setGridLines();
};

Grid.prototype.draw = function(aCamera)
{
    // Draw Grid lines
    if(this.mShowGrid)
    {
        this._drawGrid(aCamera);
    }
    
    // Draw all GridObjects
    for(var i = 0; i < this.mGridSizeX; i++)
    {
        for(var j = 0; j < this.mGridSizeY; j++)
        {
            var obj = this.getObjFromCell(i, j);
            if(obj !== undefined)
            {
                obj.draw(aCamera);
            }
        }
    }
};

// <editor-fold desc="Public Methods">
Grid.prototype.getObjFromCell = function(cellX, cellY) { return this.mGridObjects[cellX][cellY]; };
Grid.prototype.getWCFromCell = function(cellX, cellY)
{
    // Check valid cell values
    if(cellX >= 0 && cellY >= 0 && cellX < this.mGridSizeX && cellY < this.mGridSizeY)
    {
        // Get origin of Grid (lower left)
        var originX = this.mXform.getXPos() - (this.getTotalWidth() / 2);
        var originY = this.mXform.getYPos() - (this.getTotalHeight() / 2);

        // Calculate WC based on origin, cell position, and cell size
        var objX = (originX + (cellX * this.mCellSizeX)) + (this.mCellSizeX / 2);
        var objY = (originY + (cellY * this.mCellSizeY)) + (this.mCellSizeY / 2);

        return vec2.fromValues(objX, objY);
    }
    
    return vec2.fromValues(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
};

Grid.prototype.addObj = function (obj) 
{
    if(obj !== undefined)
    {
        var objectPos = obj.getPos();
        this.mGridObjects[objectPos[0]][objectPos[1]] = obj;
    }
};

Grid.prototype.removeObj = function (obj) 
{
    // Remove object from GridObjects with position
    if(obj !== undefined)
    {
        var x = obj.getPos()[0];
        var y = obj.getPos()[1];

        this.mGridObjects[x].splice(y, 1);
    }
};

Grid.prototype.getXform = function() { return this.mXform; };
Grid.prototype.getNumRows = function () { return this.mGridSizeY; };    // get Y size
Grid.prototype.getNumCols = function () { return this.mGridSizeX; };    // get X size
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
    this.mGridXLines = [];
    this.mGridYLines = [];
    
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