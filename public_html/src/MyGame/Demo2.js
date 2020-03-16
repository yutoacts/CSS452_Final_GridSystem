/*
 * File: Demo2.js
 * This is the logic of our game.
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject, Grid */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Demo2()
{
    this.kMinionSprite = "assets/SpriteSheet.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mGrid = null;
    this.mMsg = null;
    this.mHero = null;
    this.mPatrol = null;
}

gEngine.Core.inheritPrototype(Demo2, Scene);

Demo2.prototype.loadScene = function ()
{
    gEngine.Textures.loadTexture(this.kMinionSprite);
};

Demo2.prototype.unloadScene = function ()
{
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    
    var nextLevel = new Demo1();  // load the next level
    gEngine.Core.startScene(nextLevel);
};

Demo2.prototype.initialize = function ()
{
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        200,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(-96, -70);
    this.mMsg.setTextHeight(4);

    this.mGrid = new Grid(5, 5, 25, 25);
    this.mGrid.setDraw(true);

    this.mHero = new Hero(this.kMinionSprite, 35, 50);
    this.mHero = new GridObject(this.mHero, this.mGrid,
                                0, 0,
                                2, 2, true);
    this.mHero.getGameObject().getXform().incSizeBy(10);

    this.mPatrol = new Patrol(this.kMinionSprite, 30, 30);
    this.mPatrol = new GridObject(this.mPatrol, this.mGrid,
                            3, 3,
                            1, 1, true);
                            
    this.mGrid.addObj(this.mHero);
    this.mGrid.addObj(this.mPatrol);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Demo2.prototype.draw = function ()
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    this.mGrid.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Demo2.prototype.update = function ()
{
    var msg = "Status: ";
    var echo = "";

    if(this.mHero.getIsLocked())
    {
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.W))
        {
            if(this.mHero.getPos()[1] + 1 < this.mGrid.getNumRows()){
                this.mHero.gridMovement(this.mHero.getPos()[0],this.mHero.getPos()[1] + 1);
            }
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.A))
        {
            if(this.mHero.getPos()[0] - 1 >= 0){
                this.mHero.gridMovement(this.mHero.getPos()[0] - 1,this.mHero.getPos()[1]);
            }
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S))
        {
            if(this.mHero.getPos()[1] - 1 >= 0){
                this.mHero.gridMovement(this.mHero.getPos()[0],this.mHero.getPos()[1] - 1);
            }
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D))
        {
            if(this.mHero.getPos()[0] + 1 < this.mGrid.getNumCols()){
                this.mHero.gridMovement(this.mHero.getPos()[0] + 1,this.mHero.getPos()[1]);
            }
        }
    }
    else
    {
        var xform = this.mHero.getXform();
        
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up))
        {
            xform.setPosition(xform.getPosition()[0],xform.getPosition()[1] + 1.0);
            this.mHero.gridMovement(this.mHero.getClosestCell()[0],this.mHero.getClosestCell()[1]);
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left))
        {
            xform.setPosition(xform.getPosition()[0] - 1.0,xform.getPosition()[1]);
            this.mHero.gridMovement(this.mHero.getClosestCell()[0],this.mHero.getClosestCell()[1]);
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down))
        {
            xform.setPosition(xform.getPosition()[0],xform.getPosition()[1] - 1.0);
            this.mHero.gridMovement(this.mHero.getClosestCell()[0],this.mHero.getClosestCell()[1]);
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right))
        {
            xform.setPosition(xform.getPosition()[0] + 1.0,xform.getPosition()[1]);
            this.mHero.gridMovement(this.mHero.getClosestCell()[0],this.mHero.getClosestCell()[1]);
        }
    }
    

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        this.mHero.gridMovement(this.mHero.getClosestCell()[0],this.mHero.getClosestCell()[1]);
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) 
    {
        if(this.mHero.getIsLocked()){
            this.mHero.unlockObject();
        }else{
            this.mHero.lockObject();
        }
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        this.mHero.setSize(3, 3);
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.E))
    {
        this.mHero.setSize(2, 2);
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R))
    {
        this.mHero.setSize(1, 1);
    }
    
    // Scene Transition
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) 
    {
        gEngine.GameLoop.stop();
    }

    this.mGrid.update();

    echo += "Grid Size: " + this.mGrid.getNumCols() + "x" + this.mGrid.getNumRows() + " with ";
    echo += "Cell Size: " + this.mGrid.getCellWidth() + "x" + this.mGrid.getCellHeight() + " ";
    echo += "Hero: " + this.mHero.getPos() + " ";
    echo += "Patrol: " + this.mPatrol.getPos() + " ";
    echo += "Objects: " + this.mGrid.getNumObjects() + " ";

    msg += echo;
    this.mMsg.setText(msg);
};
