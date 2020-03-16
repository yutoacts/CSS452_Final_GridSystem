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
    this.mObj.getXform().setPosition(this.mGrid.getWCFromCell(cellX, cellY)[0]
                                    ,this.mGrid.getWCFromCell(cellX, cellY)[1]);
    
    // Set size           
    //this.mObj.getXform().setSize(this.mGrid.getCellWidth() * cellSizeX, 
    //                            ,this.mGrid.getCellHeight() * cellSizeY);
    
    this.mIsLocked = isLocked;
    this.mVisible = true;
    
    this.mGrid.addObj(this);
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
    this.mGrid.removeObj(this);
    this.mCellX = cellX;
    this.mCellY = cellY;
    this.mGrid.addObj(this);
};

GridObject.prototype.gridMovement = function (cellX, cellY) 
{ 
    // Check valid cell values
    if(cellX >= 0 && cellY >= 0 && cellX < this.mGrid.getNumCols() && cellY < this.mGrid.getNumRows())
    {
        // Check if slot is occupied
        if(this.mGrid.getObjFromCell(cellX, cellY) === undefined)
        {  
            this.mGrid.removeObj(this);
            
            this.mCellX = cellX;
            this.mCellY = cellY;
            this.mObj.getXform().setPosition(this.mGrid.getWCFromCell(cellX, cellY)[0] 
                                            ,this.mGrid.getWCFromCell(cellX, cellY)[1]);
                                            
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
    this.mCellSizeX = cellSizeX;
    this.mCellSizeY = cellSizeY;
    //this.mObj.getXform().setSize(this.mGrid.getCellWidth() * cellSizeX, this.mGrid.getCellHeight() * cellSizeY);
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
        this.gridMovement(this.getPos()[0], this.getPos()[1]);
        //this.setSize(this.getSize()[0], this.getSize()[1]);
    }
};

GridObject.prototype.getGameObject = function()
{
    return this.mObj;
};

GridObject.prototype.getClosestCell = function ()
{
    var objectPos = this.getXform().getPosition();
    var minDist = Number.MAX_SAFE_INTEGER;
    
    var closestCell = vec2.fromValues(0, 0);
    
    for(var i = 0; i < this.mGrid.getNumRows(); i++)
    {
        for(var j = 0; j < this.mGrid.getNumCols(); j++)
        {
            var cellPos = this.mGrid.getWCFromCell(i,j);
            
            var distance = (objectPos[0] - cellPos[0]) ^ 2
                         + (objectPos[1] - cellPos[1]) ^ 2;
            
            if(distance < minDist)
            {
                minDist = distance;
                closestCell = vec2.fromValues(i, j);
            }
        }
    }
    
    return closestCell;
}

GridObject.prototype.setVisibility = function (f) { this.mVisible = f; };
GridObject.prototype.isVisible = function () { return this.mVisible; };

