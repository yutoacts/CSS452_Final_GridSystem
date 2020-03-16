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
    // Cell position
    this.mCellX = cellX;
    this.mCellY = cellY;
    // Amount of cells GridObject takes up
    this.mCellSizeX = cellSizeX;
    this.mCellSizeY = cellSizeY;
    
    this.mGrid = grid;
    this.mObj = obj;
    
    // For GridObjects with a size larger than 1x1
    this.mParent = undefined;
    this.mChildren = [];
    
    // Set position of object
    if(this.mObj !== undefined)
    {
        var objPos = this.mGrid.getWCFromCell(cellX + ((cellSizeX - 1) * 0.5), cellY + ((cellSizeY - 1) * 0.5));
        this.mObj.getXform().setPosition(objPos[0], objPos[1]);
    }
    
    this.mIsLocked = isLocked;
    this.mVisible = true;
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
    if(cellX + (this.mCellSizeX - 1) >= 0 && cellY + (this.mCellSizeY - 1) >= 0 && cellX + (this.mCellSizeX - 1) < this.mGrid.getNumCols() && cellY + (this.mCellSizeY - 1) < this.mGrid.getNumRows())
    {
        // For larger GridObjects, check every slot to ensure it is not occupied
        for(var i = cellX; i < cellX + this.mCellSizeX; i++)
        {
            for(var j = cellY; j < cellY + this.mCellSizeY; j++)
            {
                // Check if slot is occupied or is itself
                if(!(this.mGrid.getObjFromCell(i, j) === undefined || this.mGrid.getObjFromCell(i, j) === this))
                {
                    return false;
                }
            }
        }
        
        // Safe to set position
        this.mGrid.removeObj(this);

        this.mCellX = cellX;
        this.mCellY = cellY;
        var objPos = this.mGrid.getWCFromCell(cellX + ((this.mCellSizeX - 1) * 0.5), cellY + ((this.mCellSizeY - 1) * 0.5));
        this.mObj.getXform().setPosition(objPos[0], objPos[1]);

        this.mGrid.addObj(this);

        return true;
    }
    return false;
};

GridObject.prototype.getSize = function () { return vec2.fromValues(this.mCellSizeX, this.mCellSizeY); };
GridObject.prototype.setSize = function(cellSizeX, cellSizeY) 
{
    // Save current size as temp
    var tempX = this.mCellSizeX;
    var tempY = this.mCellSizeY;
    // Set new size
    this.mCellSizeX = cellSizeX;
    this.mCellSizeY = cellSizeY;
    // Check if able to resize
    if(!(this.gridMovement(this.mCellX, this.mCellY)))
    {
        // Unable to resize, return to previous values
        this.mCellSizeX = tempX;
        this.mCellSizeY = tempY;
    }
};

GridObject.prototype.lockObject = function() { this.mIsLocked = true; };
GridObject.prototype.unlockObject = function() { this.mIsLocked = false; };

GridObject.prototype.getParent = function () { return this.mParent; };
GridObject.prototype.getChildren = function () { return this.mChildren; };
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
            
            var distance = Math.pow((objectPos[0] - cellPos[0]), 2)
                         + Math.pow((objectPos[1] - cellPos[1]), 2);
            
            
            if(distance < minDist)
            {
                minDist = distance;
                closestCell = vec2.fromValues(i, j);
            }
        }
    }
    
    return closestCell;
};

GridObject.prototype.addChildren = function()
{
    if(this.mParent === undefined)
    {
        this.mChildren = [];
        // Adding dummy objects that return a reference to this current GridObject in cell sizes larger than 1
        for(var i = this.mCellX; i < this.mCellX + this.mCellSizeX; i++)
        {
            for(var j = this.mCellY; j < this.mCellY + this.mCellSizeY; j++)
            {
                // If not origin
                if(!(i === this.mCellX && j === this.mCellY))
                {
                    // Create new child with same information apart from object and position
                    var child = new GridObject(undefined, this.mGrid, i, j, this.mCellSizeX, this.mCellSizeY, this.mIsLocked);
                    // Assign parent
                    child.mParent = this;

                    // Add to Grid and parent's child array
                    this.mGrid.addObj(child);
                    this.mChildren.push(child);
                }
            }
        }
    }
};

GridObject.prototype.removeChildren = function()
{
    // Remove children from Grid and parent GridObject
    for(var i = 0; i < this.mChildren.length; i++)
    {
        var child = this.mChildren[i];
        
        // Remove from Grid and parent's child array
        this.mGrid.removeObj(child);
        this.mChildren[i] = undefined;
    }
};

GridObject.prototype.setVisibility = function (f) { this.mVisible = f; };
GridObject.prototype.isVisible = function () { return this.mVisible; };

