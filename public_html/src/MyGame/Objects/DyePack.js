/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function DyePack(spriteTexture, pos) {
    this.kDelta = 2;
    this.kDecRate = 0.1;
    this.kAmplitude = [4, 0.2];
    this.kFreq = 20;
    this.kDuration = 300;
    
    this.mHitPatrol = false;
    
    this.flame = 1/60;
    
    this.terminate = false;
    this.timer = 0;

    this.mDyePack = new SpriteRenderable(spriteTexture);
    this.mDyePack.setColor([1, 1, 1, 0]);
    this.mDyePack.getXform().setPosition(pos[0], pos[1]);
    this.mDyePack.getXform().setSize(2, 3.25);
    this.mDyePack.setElementPixelPositions(510, 595, 23, 153);
    
    GameObject.call(this, this.mDyePack);
    
    this.mOrgCenter = null;
    this.mShake = null;

    this.setSpeed(this.kDelta);
    this.setCurrentFrontDir([1,0]);
    
    this.mBbox = null;
    
    this.mBbox = this.getBBox();
}
gEngine.Core.inheritPrototype(DyePack, GameObject);

DyePack.prototype.update = function (DPressed) {
    
    GameObject.prototype.update.call(this);
    
    if(this.mHitPatrol){
        if(this.mShake === null){
            this.mShake = new ShakePosition(this.kAmplitude[0],this.kAmplitude[1],this.kFreq, this.kDuration);
        }
    }
    
    if (this.mShake !== null) {
        if(this.mOrgCenter === null){
            this.mOrgCenter = vec2.clone(this.mDyePack.getXform().getPosition());
        }
        if (this.mShake.shakeDone()) {
            this.mShake = null;
            this.mOrgCenter = null;
            this.terminate = true;
            this.setVisibility(false);
        } else {
            this.mDyePack.getXform().setPosition(this.mOrgCenter[0] + this.mShake.getShakeResults()[0],this.mOrgCenter[1] + this.mShake.getShakeResults()[1]);
        }
    }
    
    if(DPressed)
    {
        if(this.getSpeed() > 0)
        {
            this.setSpeed(this.getSpeed() - this.kDecRate);
        }       
    }
    
    this.timer += this.flame;
    
    if(this.timer >= 5 || this.getSpeed() <= 0){
        this.terminate = true;
        this.setVisibility(false);
    }
    
    this.mBbox = this.getBBox();
};

DyePack.prototype.getTerminate = function() {
    return this.terminate;
};

DyePack.prototype.setTerminate = function(terminate) {
    this.terminate = terminate;
};

DyePack.prototype.getBbox = function() { return this.mBbox; };

DyePack.prototype.hitPatrol = function() { this.mHitPatrol = true;};
DyePack.prototype.getHit = function() { return this.mHitPatrol; };