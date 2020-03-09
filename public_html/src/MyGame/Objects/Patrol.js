/*
 * File: Patrol.js 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, SpriteAnimateRenderable: false, InterpolateVec2: false, vec2: false, Math: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Patrol(headTexture, headX, headY) 
{
    this.mHead          = new SpriteRenderable(headTexture);
    this.mTopWing       = new SpriteAnimateRenderable(headTexture);
    this.mBottomWing    = new SpriteAnimateRenderable(headTexture);
    
    // Set head texture element positions
    this.mHead.setElementPixelPositions(130, 310, 0, 180);
    
    // Set top wing animation
    this.mTopWing.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                204, 164,   // widthxheight in pixels
                                5,          // number of elements in this sequence
                                0);         // horizontal padding in between
    this.mTopWing.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mTopWing.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates
    
    // Set bottom wing animation
    this.mBottomWing.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                204, 164,   // widthxheight in pixels
                                5,          // number of elements in this sequence
                                0);         // horizontal padding in between
    this.mBottomWing.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mBottomWing.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates
    
    // Set head and wing sizes
    this.mHead.getXform().setSize(7.5, 7.5);
    this.mTopWing.getXform().setSize(10, 8);
    this.mBottomWing.getXform().setSize(10, 8);
    
    // Set head and wing positions
    this.mHead.getXform().setPosition(headX, headY);
    this.mTopWing.getXform().setPosition(headX, headY);
    this.mBottomWing.getXform().setPosition(headX, headY);
    
    this.kCycles = 120;  // number of cycles to complete the transition
    this.kRate = 0.05;  // rate of change for each cycle
    this.mTopWingPos = new InterpolateVec2(vec2.fromValues(this.mHead.getXform().getXPos(), this.mHead.getXform().getYPos()), this.kCycles, this.kRate);
    this.mBottomWingPos = new InterpolateVec2(vec2.fromValues(this.mHead.getXform().getXPos(), this.mHead.getXform().getYPos()), this.kCycles, this.kRate);
    
    // Set head and wing colors
    this.mHead.setColor([1, 1, 1, 0]);
    this.mTopWing.setColor([1, 1, 1, 0]);
    this.mBottomWing.setColor([1, 1, 1, 0]);
    
    GameObject.call(this, this.mHead);
    
    // Set head speed randomly between 5 to 10 units/sec
    this.setSpeed((Math.random() * 0.05) + 0.05);
    // Set direction
    this.setCurrentFrontDir([(Math.random() * 2) - 1, (Math.random() * 2) - 1]);
    
    // Bounding boxes
    this.mHeadBbox = null;
    this.mTopBbox = null;
    this.mBottomBbox = null;
    
    // Entire bounding box
    this.mPatrolBbox = null;
    
    // Patrol has been reflected in the last second
    this.mReflected = false;
    // Timer for reflection
    this.mTimer = 0;
    this.mTimerMax = 0;
    
    this.mLineSet = [];
    this.updateBounds();
    this.updateLines();
}

gEngine.Core.inheritPrototype(Patrol, GameObject);

Patrol.prototype.update = function()
{    
    GameObject.prototype.update.call(this);
    
    // Set position to interpolate
    this.mTopWingPos.setFinalValue(vec2.fromValues(this.mHead.getXform().getXPos() + 10, this.mHead.getXform().getYPos() + 6), this.kCycles, this.kRate);
    this.mBottomWingPos.setFinalValue(vec2.fromValues(this.mHead.getXform().getXPos() + 10, this.mHead.getXform().getYPos() - 6), this.kCycles, this.kRate);
    
    // Interpolate wing position
    this.mTopWingPos.updateInterpolation();
    this.mBottomWingPos.updateInterpolation();
    
    // Set position as interpolated position
    this.mTopWing.getXform().setPosition(this.mTopWingPos.getValue()[0], this.mTopWingPos.getValue()[1]);
    this.mBottomWing.getXform().setPosition(this.mBottomWingPos.getValue()[0], this.mBottomWingPos.getValue()[1]);
    
    // Update top and bottom wing animation
    this.mTopWing.updateAnimation();
    this.mBottomWing.updateAnimation();
    
    // Delay for reflection so infinite reflection does not occur
    if(this.mReflected)
    {
        this.mTimer++;
        if(this.mTimer >= this.mTimerMax)
        {
            this.mReflected = false;
            this.mTimer = 0;
        }
    }
    
    // Update bounds of entire Patrol
    this.updateBounds();
    this.updateLines();
};

Patrol.prototype.updateBounds = function()
{
    // Create bounding box of full patrol
    this.mHeadBbox = this.getBBox();
    this.mTopBbox = new BoundingBox(this.mTopWing.getXform().getPosition(), this.mTopWing.getXform().getWidth(), this.mTopWing.getXform().getHeight());
    this.mBottomBbox = new BoundingBox(this.mBottomWing.getXform().getPosition(), this.mBottomWing.getXform().getWidth(), this.mBottomWing.getXform().getHeight());
    
    // width is combined width of head and wing bounds
    var width = this.mTopBbox.maxX() - this.mHeadBbox.minX();
    // height is 150% of combined height of head and wing bounds
    var height = ((this.mTopBbox.maxX() - this.mTopBbox.minX()) + (this.mHeadBbox.maxX() - this.mHeadBbox.minX())) * 1.5;
    this.mPatrolBbox = new BoundingBox([this.mHeadBbox.minX() + width / 2, this.mBottomBbox.minY() + height / 2], width, height);
};

Patrol.prototype.updateLines = function()
{
    this.mLineSet = [];
    
    // Head bound
    var HlineL = new LineRenderable();
    HlineL.setVertices(this.mHeadBbox.minX(), this.mHeadBbox.minY(), this.mHeadBbox.minX(), this.mHeadBbox.maxY());
    HlineL.setColor([1, 1, 1, 1]);

    var HlineR = new LineRenderable();
    HlineR.setVertices(this.mHeadBbox.maxX(), this.mHeadBbox.minY(), this.mHeadBbox.maxX(), this.mHeadBbox.maxY());
    HlineR.setColor([1, 1, 1, 1]);

    var HlineU = new LineRenderable();
    HlineU.setVertices(this.mHeadBbox.minX(), this.mHeadBbox.minY(), this.mHeadBbox.maxX(), this.mHeadBbox.minY());
    HlineU.setColor([1, 1, 1, 1]);

    var HlineD = new LineRenderable();
    HlineD.setVertices(this.mHeadBbox.minX(), this.mHeadBbox.maxY(), this.mHeadBbox.maxX(), this.mHeadBbox.maxY());
    HlineD.setColor([1, 1, 1, 1]);

    this.mLineSet.push(HlineL);
    this.mLineSet.push(HlineR);
    this.mLineSet.push(HlineU);
    this.mLineSet.push(HlineD);
    
    // Top Wing bound
    var TWlineL = new LineRenderable();
    TWlineL.setVertices(this.mTopBbox.minX(), this.mTopBbox.minY(), this.mTopBbox.minX(), this.mTopBbox.maxY());
    TWlineL.setColor([1, 1, 1, 1]);

    var TWlineR = new LineRenderable();
    TWlineR.setVertices(this.mTopBbox.maxX(), this.mTopBbox.minY(), this.mTopBbox.maxX(), this.mTopBbox.maxY());
    TWlineR.setColor([1, 1, 1, 1]);

    var TWlineU = new LineRenderable();
    TWlineU.setVertices(this.mTopBbox.minX(), this.mTopBbox.minY(), this.mTopBbox.maxX(), this.mTopBbox.minY());
    TWlineU.setColor([1, 1, 1, 1]);

    var TWlineD = new LineRenderable();
    TWlineD.setVertices(this.mTopBbox.minX(), this.mTopBbox.maxY(), this.mTopBbox.maxX(), this.mTopBbox.maxY());
    TWlineD.setColor([1, 1, 1, 1]);

    this.mLineSet.push(TWlineL);
    this.mLineSet.push(TWlineR);
    this.mLineSet.push(TWlineU);
    this.mLineSet.push(TWlineD);
    
    // Bottom Wing bound
    var BWlineL = new LineRenderable();
    BWlineL.setVertices(this.mBottomBbox.minX(), this.mBottomBbox.minY(), this.mBottomBbox.minX(), this.mBottomBbox.maxY());
    BWlineL.setColor([1, 1, 1, 1]);

    var BWlineR = new LineRenderable();
    BWlineR.setVertices(this.mBottomBbox.maxX(), this.mBottomBbox.minY(), this.mBottomBbox.maxX(), this.mBottomBbox.maxY());
    BWlineR.setColor([1, 1, 1, 1]);

    var BWlineU = new LineRenderable();
    BWlineU.setVertices(this.mBottomBbox.minX(), this.mBottomBbox.minY(), this.mBottomBbox.maxX(), this.mBottomBbox.minY());
    BWlineU.setColor([1, 1, 1, 1]);

    var BWlineD = new LineRenderable();
    BWlineD.setVertices(this.mBottomBbox.minX(), this.mBottomBbox.maxY(), this.mBottomBbox.maxX(), this.mBottomBbox.maxY());
    BWlineD.setColor([1, 1, 1, 1]);

    this.mLineSet.push(BWlineL);
    this.mLineSet.push(BWlineR);
    this.mLineSet.push(BWlineU);
    this.mLineSet.push(BWlineD);
    
    // Entire Patrol bound
    var PlineL = new LineRenderable();
    PlineL.setVertices(this.getPatrolBbox().minX(), this.getPatrolBbox().minY(), this.getPatrolBbox().minX(), this.getPatrolBbox().maxY());
    PlineL.setColor([1, 1, 1, 1]);

    var PlineR = new LineRenderable();
    PlineR.setVertices(this.getPatrolBbox().maxX(), this.getPatrolBbox().minY(), this.getPatrolBbox().maxX(), this.getPatrolBbox().maxY());
    PlineR.setColor([1, 1, 1, 1]);

    var PlineU = new LineRenderable();
    PlineU.setVertices(this.getPatrolBbox().minX(), this.getPatrolBbox().minY(), this.getPatrolBbox().maxX(), this.getPatrolBbox().minY());
    PlineU.setColor([1, 1, 1, 1]);

    var PlineD = new LineRenderable();
    PlineD.setVertices(this.getPatrolBbox().minX(), this.getPatrolBbox().maxY(), this.getPatrolBbox().maxX(), this.getPatrolBbox().maxY());
    PlineD.setColor([1, 1, 1, 1]);

    this.mLineSet.push(PlineL);
    this.mLineSet.push(PlineR);
    this.mLineSet.push(PlineU);
    this.mLineSet.push(PlineD);
};

Patrol.prototype.reflect = function(timer)
{
    if(!this.mReflected)
    {
        this.mReflected = true;
        this.setCurrentFrontDir([(this.getCurrentFrontDir()[0] * -1), (this.getCurrentFrontDir()[1] * -1)]);
        this.mTimerMax = timer;
    }
};

Patrol.prototype.hit = function()
{
    var xform = this.getXform();
    xform.setPosition(xform.getXPos() + 5, xform.getYPos());
};

Patrol.prototype.hitTopWing = function()
{
    this.mTopWing.setColor([0, 0, 0, this.mTopWing.getColor()[3] + 0.2]);
};

Patrol.prototype.hitBottomWing = function()
{
    this.mBottomWing.setColor([0, 0, 0, this.mBottomWing.getColor()[3] + 0.2]);
};

Patrol.prototype.getTopWing = function() { return this.mTopWing; };
Patrol.prototype.getBottomWing = function() { return this.mBottomWing; };
Patrol.prototype.getHeadBbox = function() { return this.mHeadBbox; };
Patrol.prototype.getTopWingBbox = function() { return this.mTopBbox; };
Patrol.prototype.getBottomWingBbox = function() { return this.mBottomBbox; };
Patrol.prototype.getPatrolBbox = function() { return this.mPatrolBbox; };
Patrol.prototype.getLines = function() { return this.mLineSet; };