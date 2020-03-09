/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() 
{
    this.kMinionSprite = "assets/SpriteSheet.png";
    this.kBg = "assets/bg.png";
    // The camera to view the scene
    this.mCamera = null;
    this.mBg = null;
    
    // The hero and patrol objects
    this.mHero = null;
    this.mPatrolSet = new PatrolSet();
    this.mDyePackSet = new DyePackSet();

    this.mMsg = null;
    
    this.mTimer = 0;
    this.mTimerMax = 0;
    this.mAutoSpawn = false;
    this.mShowBounds = false;
}

gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () 
{
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBg);
};

MyGame.prototype.unloadScene = function () 
{
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kBg);
};

MyGame.prototype.initialize = function () 
{
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        200,                       // width of camera
        [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
            
    // Large background image
    var bgR = new SpriteRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1024, 0, 1024);
    bgR.getXform().setSize(200, 200);
    bgR.getXform().setPosition(0, 30);
    this.mBg = new GameObject(bgR);

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(-98, -72);
    this.mMsg.setTextHeight(3);
    
    this.mHero = new Hero(this.kMinionSprite,35, 50);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () 
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mBg.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    
    this.mHero.draw(this.mCamera);
    this.mPatrolSet.draw(this.mCamera);
    this.mDyePackSet.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () 
{
    var msg = "Status: ";
    var echo = "";
        
    // 'P' Key: Toggle auto-spawning
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) 
    {
        this.mAutoSpawn = !this.mAutoSpawn;
        this.mTimer = 0;
    }
    
    // 'B' Key: Toggle drawing of bounds
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) 
    {
        this.mShowBounds = !this.mShowBounds;
        this.mPatrolSet.showBounds(this.mShowBounds);
    }
    
    // 'C' Key: Spawn a new Patrol
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) 
    {
        var patrol = new Patrol(this.kMinionSprite, 0, 0);
        this.mPatrolSet.addToSet(patrol);
    }
    
    // 'J' Key: Trigger Head Patrol hit event
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) 
    {
        var i;
        for(i = 0; i < this.mPatrolSet.size(); i++)
        {
            var patrol = this.mPatrolSet.getObjectAt(i);
            patrol.hit();
        }
    }
    
    // Bounding box collisions
    this.mLineSet = [];
    var i;
    for(i = 0; i < this.mPatrolSet.size(); i++)
    {
        var patrol = this.mPatrolSet.getObjectAt(i);
        var status = this.mCamera.collideWCBbox(patrol.getPatrolBbox(), 1);
        // Left, right, top or bottom collision
        if(status === 1 || status === 2 || status === 4 || status === 8)
        {
            // Reflect velocity if entire bound touches bounds of WC, with a delay of 60 frames
            patrol.reflect(60);
        }
        // Terminate lifespan if entire bound is to the right of WC window
        if(status === 0)
        {
            this.mPatrolSet.removeFromSet(patrol);
        }
        
        // Shake when colliding with Hero
        if(this.mHero.getBBox().boundCollideStatus(patrol.getBBox()))
        {
            this.mHero.setShake();
        }
    }
    
    // Auto-Spawning
    if(this.mAutoSpawn)
    {
        // Spawn a new Patrol every 2-3 seconds in the right half of the world
        if(this.mTimer >= this.mTimerMax)
        {
            // Set new max time and reset timer
            this.mTimerMax = Math.random() * (180 - 120) + 120;
            this.mTimer = 0;
            
            // Spawn a new Patrol in the right half of the world
            var patrol = new Patrol(this.kMinionSprite, 
                Math.random() * (this.mCamera.getWCCenter()[0] - this.mCamera.getWCWidth() / 4) + this.mCamera.getWCWidth() / 4, 
                Math.random() * (this.mCamera.getWCCenter()[1] - this.mCamera.getWCHeight() / 4) + this.mCamera.getWCHeight() / 4);
            this.mPatrolSet.addToSet(patrol);
        }
        else
        {
            // Increment timer
            this.mTimer++;
        }
    }
    
    // Hero & DyePack
    
    // Spawn a new dyepack
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
            var mDyePack = new DyePack(this.kMinionSprite, vec2.fromValues(this.mHero.getXform().getXPos() + 2, this.mHero.getXform().getYPos() + 3));
            this.mDyePackSet.addToSet(mDyePack);
        }
    
    // 'Q' Key: Call damped harmonic function for hero
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) 
    {
        this.mHero.setShake();
        
        this.mDyePackSet.getObjectAt(0).hitPatrol();
    }
    
    if (this.mCamera.isMouseInViewport()) {
        this.mHero.setMousePos(vec2.fromValues(this.mCamera.mouseWCX(),this.mCamera.mouseWCY()));
    }
    
    this.mHero.update();
    
    var i;
    for(i = 0; i < this.mDyePackSet.size(); i++)
    {
        var dyePack = this.mDyePackSet.getObjectAt(i);
        var status = this.mCamera.collideWCBbox(dyePack.getBbox(), 1);
        // Left, right, top or bottom collision
        if(status === 1 || status === 2 || status === 4 || status === 8)
        {
            dyePack.setTerminate(true);
        }
        
        for(var j = 0; j < this.mPatrolSet.size(); j++)
        {
            var patrol = this.mPatrolSet.getObjectAt(j);
            var h = [];
            // Collide with head
            if (dyePack.pixelTouches(patrol, h) && dyePack.getHit() === false) {
                dyePack.hitPatrol();
                patrol.hit();
            }
            
            // Collide with top wing
            if(dyePack.getBbox().boundCollideStatus(patrol.getTopWingBbox()) && dyePack.getHit() === false)
            {
                patrol.hitTopWing();
                dyePack.setTerminate(true);
            }
            
            // Collide with bottom wing
            if(dyePack.getBbox().boundCollideStatus(patrol.getBottomWingBbox()) && dyePack.getHit() === false)
            {
                patrol.hitBottomWing();
                dyePack.setTerminate(true);
            }
        }
    }
    
    // 'D' Key: Trigger slow down of DyePack
    if(this.mDyePackSet.size() > 0)
    {
        var DPressed = gEngine.Input.isKeyPressed(gEngine.Input.keys.D);
        
        // 'S' Key: Trigger DyePack hit event
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) 
        {
            this.mDyePackSet.SClicked();
        }
        
        this.mDyePackSet.update(DPressed);
    }
    
    echo += "DyePacks[" + this.mDyePackSet.size() + "] ";
    echo += "Patrols[" + this.mPatrolSet.size() + "] ";
    echo += "AutoSpawn(" + this.mAutoSpawn + ") ";
    echo += "ShowBounds(" + this.mShowBounds + ") ";
    
    this.mPatrolSet.update();
    msg += echo;
    this.mMsg.setText(msg);
};