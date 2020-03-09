/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject, Grid */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() 
{
    // The camera to view the scene
    this.mCamera = null;
    this.mGrid = null;
    this.mMsg = null;
}

gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () 
{
    
};

MyGame.prototype.unloadScene = function () 
{
    
};

MyGame.prototype.initialize = function () 
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
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () 
{
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    this.mGrid.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () 
{
    var msg = "Status: ";
    var echo = "";
    
    this.mGrid.update();
    
    echo += "Grid Size: " + this.mGrid.getWidth() + "x" + this.mGrid.getHeight() + " with ";
    echo += "Cell Size: " + this.mGrid.getCellWidth() + "x" + this.mGrid.getCellHeight() + " ";
    
    msg += echo;
    this.mMsg.setText(msg);
};