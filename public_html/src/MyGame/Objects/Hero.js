/*
 * File: Hero.js 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false, InterpolateVec2: false, vec2: false, Math: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture, posX, posY) 
{
    this.kRate = 0.05;
    this.kCycles = 120;
    this.kAmplitude = [4.5, 6];
    this.kFreq = 4;
    this.kDuration = 60;
    
    this.mMousePos = null;
   
    this.mHero = new SpriteRenderable(spriteTexture);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(posX, posY);
    this.mHero.getXform().setSize(9, 12);
    this.mHero.setElementPixelPositions(0, 120, 0, 180);
    
    this.mOrgCenter = null;
    this.mShake = null;
    
    this.mHeroPos = new InterpolateVec2(vec2.fromValues(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos()), this.kCycles, this.kRate);

    GameObject.call(this, this.mHero);  
}

gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function()
{
    GameObject.prototype.update.call(this);
    
    if (this.mShake !== null) {
        if(this.mOrgCenter === null){
            this.mOrgCenter = vec2.clone(this.mHero.getXform().getPosition());
        }
        if (this.mShake.shakeDone()) {
            this.mShake = null;
            this.mOrgCenter = null;
        } else {
            // Set position to interpolate
            this.mHeroPos.setFinalValue(this.mMousePos, this.kCycles, this.kRate);

            // Interpolate hero position
            this.mHeroPos.updateInterpolation();
            this.mHero.getXform().setPosition(this.mHeroPos.getValue()[0] + this.mShake.getShakeResults()[0],this.mHeroPos.getValue()[1] + this.mShake.getShakeResults()[1]);
        }
    }else{
        if(this.mMousePos != null){
            // Set position to interpolate
            this.mHeroPos.setFinalValue(this.mMousePos, this.kCycles, this.kRate);

            // Interpolate hero position
            this.mHeroPos.updateInterpolation();

            // Set position as interpolated position
            this.mHero.getXform().setPosition(this.mHeroPos.getValue()[0], this.mHeroPos.getValue()[1]);
        }
    }
    
    
};

Hero.prototype.setMousePos = function(pos){ this.mMousePos = pos;};

Hero.prototype.setShake = function(){
    if(this.mShake === null){
        this.mShake = new ShakePosition(this.kAmplitude[0],this.kAmplitude[1],this.kFreq, this.kDuration);
    }
};