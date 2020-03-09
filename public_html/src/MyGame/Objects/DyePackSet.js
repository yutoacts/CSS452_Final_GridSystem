/*
 * File: DyePackSet.js 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObjectSet: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function DyePackSet() 
{
    this.mSet = [];
    
    this.mSClicked = false;
}

gEngine.Core.inheritPrototype(DyePackSet, GameObjectSet);

DyePackSet.prototype.update = function(DPressed)
{
    var i;
    for (i = this.mSet.length - 1; i >= 0; i--) {
        if(this.mSet[i].getTerminate()){
            this.removeFromSet(this.mSet[i]);
        }else{
            if(this.mSClicked){
                this.mSet[i].hitPatrol();
            }
            this.mSet[i].update(DPressed);
        }
    }
    this.mSClicked = false;
};

DyePackSet.prototype.SClicked = function()
{
    this.mSClicked = true;
}