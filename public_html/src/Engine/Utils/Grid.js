/* 
 * File: Grid.js
 * Grid API System
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false, vec2: false, Math: false */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";


function Grid(row, col) 
{
    this.mRow = row;
    this.mCol = col;
    this.mObjects = [];
    this.mXform = new Transform();
    
    this.mShowGrid = false;
    this.mGridRowLines = [];
    this.mGridColLines = [];
    
    this.initialize();
}

Grid.prototype.initialize = function()
{
    for(var i = 0; i < this.mRow; i++)
    {
        var objectsY = [];
        this.mObjects.push(objectsY);
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
Grid.prototype.getRows = function () { return this.mRow; };
Grid.prototype.getCols = function () { return this.mCol; };
Grid.prototype.getObjCell = function(cellX, cellY)
{
    if(this.mObjects[cellX][cellY] !== null)
    {
        return this.mObjects[cellX][cellY];
    }
    return null;
};
// </editor-fold>

Grid.prototype._drawGrid = function()
{
    
};