/* File: GridObject.js 
 *
 * Abstracts a grid object's behavior and apparance
 */

/*jslint node: true, vars: true */
/*global vec2, vec3, BoundingBox */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function GridObject(obj, grid, cellX, cellY, cellSizeX, cellSizeY, isLocked) 
{
    this.mCellX = cellX;
    this.mCellY = cellY;
    this.mCellSizeX = cellSizeX;
    this.mCellSizeY = cellSizeY;
    
    this.mGrid = grid;
    this.mObj = obj;
    
    // Set position
    var objPos = this.mGrid.getWCFromCell(cellX + ((cellSizeX - 1) * 0.5), cellY + ((cellSizeY - 1) * 0.5));
    this.mObj.getXform().setPosition(objPos[0], objPos[1]);
    
    // Set size           
    //this.mObj.getXform().setSize(this.mGrid.getCellWidth() * cellSizeX, 
    //                            ,this.mGrid.getCellHeight() * cellSizeY);
    
    this.mIsLocked = isLocked;
    this.mVisible = true;
    
    this.mGrid.addObj(this);
    // Adding dummy objects that return a reference to this current GridObject in cell sizes larger than 1
    /*for(var i = 0; i < cellSizeX; i++)
    {
        for(var i = 0; i < cellSizeX; i++)
        {
            var child = this;
        }
    }*/
}

GridObject.prototype.draw = function (aCamera) 
{
    if (this.isVisible()) 
    {
        this.mObj.draw(aCamera);
    }
};

GridObject.prototype.getPos = function () { return vec2.fromValues(this.mCellX, this.mCellY); };
GridObject.prototype.setPos = function (cellX, cellY) 
{ 
    // Check valid cell values
    if(cellX + (this.mCellSizeX - 1) >= 0 && cellY + (this.mCellSizeY - 1) >= 0 && cellX + (this.mCellSizeX - 1) < this.mGrid.getNumCols() && cellY + (this.mCellSizeY - 1) < this.mGrid.getNumRows())
    {
        // Check if slot is occupied or is itself (for resizing)
        if(this.mGrid.getObjFromCell(cellX, cellY) === undefined || this.mGrid.getObjFromCell(cellX, cellY) === this)
        {
            this.mGrid.removeObj(this);
            
            this.mCellX = cellX;
            this.mCellY = cellY;
            var objPos = this.mGrid.getWCFromCell(cellX + ((this.mCellSizeX - 1) * 0.5), cellY + ((this.mCellSizeX - 1) * 0.5));
            this.mObj.getXform().setPosition(objPos[0], objPos[1]);
                                            
            this.mGrid.addObj(this);
            
            return true;
        }
        return false;
    }
    return false;
};

GridObject.prototype.getSize = function () { return vec2.fromValues(this.mCellSizeX, this.mCellSizeY); };
GridObject.prototype.setSize = function(cellSizeX, cellSizeY) 
{
    var tempX = this.mCellSizeX;
    var tempY = this.mCellSizeY;
    this.mCellSizeX = cellSizeX;
    this.mCellSizeY = cellSizeY;
    if(!(this.setPos(this.mCellX, this.mCellY)))
    {
        this.mCellSizeX = tempX;
        this.mCellSizeY = tempY;
    }
};

GridObject.prototype.lockObject = function() { this.mIsLocked = true; };
GridObject.prototype.unlockObject = function() { this.mIsLocked = false; };

GridObject.prototype.getXform = function () { return this.mObj.getXform(); };

GridObject.prototype.getBBox = function () 
{
    var xform = this.getXform();
    var b = new BoundingBox(xform.getPosition(), this.mGrid.getCellWidth(), this.mGrid.getCellHeight());
    return b;
};

GridObject.prototype.setGameObject = function(obj)
{
    if(obj !== undefined)
    {
        this.mObj = obj;
        this.setPos(this.getPos()[0], this.getPos()[1]);
        //this.setSize(this.getSize()[0], this.getSize()[1]);
    }
};

GridObject.prototype.getGameObject = function()
{
    return this.mObj;
};

GridObject.prototype.setVisibility = function (f) { this.mVisible = f; };
GridObject.prototype.isVisible = function () { return this.mVisible; };

