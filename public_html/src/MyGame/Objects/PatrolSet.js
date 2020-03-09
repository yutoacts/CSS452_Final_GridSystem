/*
 * File: PatrolSet.js 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObjectSet: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function PatrolSet() 
{
    this.mSet = [];
    this.mShowBounds = false;
}

gEngine.Core.inheritPrototype(PatrolSet, GameObjectSet);

PatrolSet.prototype.size = function () { return this.mSet.length; };

PatrolSet.prototype.getObjectAt = function (index) 
{
    return this.mSet[index];
};

PatrolSet.prototype.addToSet = function (obj) 
{
    this.mSet.push(obj);
};

PatrolSet.prototype.removeFromSet = function (obj) 
{
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};

PatrolSet.prototype.update = function()
{
    var i;
    for (i = 0; i < this.mSet.length; i++) 
    {
        // Update head, which updates wings
        this.mSet[i].update();
        // Terminate lifespan if alpha channel of either wing is greater or equal than 1.0
        if(this.mSet[i].getTopWing().getColor()[3] >= 1.0 || this.mSet[i].getBottomWing().getColor()[3] >= 1.0)
        {
            this.removeFromSet(this.mSet[i]);
        }
    }
};

PatrolSet.prototype.draw = function (aCamera) 
{
    var i;
    for (i = 0; i < this.mSet.length; i++) 
    {
        // Draw head and both wings
        this.mSet[i].draw(aCamera);
        this.mSet[i].getTopWing().draw(aCamera);
        this.mSet[i].getBottomWing().draw(aCamera);
        if(this.mShowBounds)
        {
            var lineSet = this.mSet[i].getLines();
            var j;
            for(j = 0; j < lineSet.length; j++)
            {
                lineSet[j].draw(aCamera);
            }
        }
    }
};

PatrolSet.prototype.showBounds = function(toggle)
{
    this.mShowBounds = toggle;
};