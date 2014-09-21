import ddf.minim.*;

/*
  @pjs globalKeyEvents="true"; preload="data/atlas_2x.png";
 */

/* 
 - fix jumping audio
 */

final int SCALE = 2;
final int TILE_SIZE = 16 * SCALE;
final int NUM_TILES_FOR_WIDTH = 15;
final int NUM_TILES_FOR_HEIGHT = 12;

Timer frameTimer = new Timer();
float lastFrameRenderTime = 0;

SoundManager soundManager;
ArtManager artManager;

// some debugging
int numCollisionTests = 0;
int numCollisionTestsSkipped = 0;

Scene scene;
Debugger debug;
boolean debugOn;

void setup() {
  size(TILE_SIZE * NUM_TILES_FOR_WIDTH, TILE_SIZE * NUM_TILES_FOR_HEIGHT);

  // We want a pixelated look
  noSmooth();

  artManager = new ArtManager();

  // PJS can read xml but not json. P5 reads json, but not xml
  // Makes sense right?
  String atlasMetafile = "data/atlas_2x" + (isPJSMode ? ".xml" : ".json");
  artManager.load(atlasMetafile);

  scene = new Scene();
  debug = new Debugger();
  debug.setOn(false);
  soundManager = new SoundManager(this);

  // TODO: fix
  soundManager.addSound("smb_jumpsmall");
  soundManager.addSound("coin_pickup");
  soundManager.addSound("pause");
  soundManager.addSound("bump");
  // soundManager.setMute(true);

  debugOn = false;

  Keyboard.lockKeys(new int[] {
    KEY_P, 
    KEY_M
  }
  );
}

void draw() {
  scene.update();

  frameTimer.tick();
  debug.addString("lastFrameRenderTime: " + lastFrameRenderTime + " ms");
  scene.render();

  frameTimer.tick();
  lastFrameRenderTime = 1000 * frameTimer.getDeltaSec();

  debug.render();
  debug.clear();
}

void keyReleased() {
  Keyboard.setKeyDown(keyCode, false);

  if (Keyboard.isKeyDown(KEY_P) == false) {
    scene.resume();
  }

  if (Keyboard.isKeyDown(KEY_M) == false) {
    soundManager.setMute(false);
  }
}

void keyPressed() {
  Keyboard.setKeyDown(keyCode, true);

  if (Keyboard.isKeyDown(KEY_P)) {
    scene.pause();
  }

  if (Keyboard.isKeyDown(KEY_C)) {
  }

  if (Keyboard.isKeyDown(KEY_M)) {
    soundManager.setMute(true);
  }

  if (Keyboard.isKeyDown(KEY_D)) {
    debug.toggle();
    debugOn = !debugOn;
  }
}

//////////////////
// AnimationClip
//////////////////
class AnimationClip {

  float frameTime;
  ArrayList<PImage> frames;
  Timer timer;
  int currFrame;

  AnimationClip() {
    frames = new ArrayList<PImage>();
    timer = new Timer();
    frameTime = 1;
    currFrame = 0;
  }

  void addFrame(String frameName) {
    frames.add(artManager.getImage(frameName));
  }

  void update(float dt) {
    timer.add(dt);

    if (timer.getTotalTime() > frameTime) {
      float diff = frameTime - timer.getTotalTime();
      timer.reset();
      timer.add(diff);

      currFrame++;

      if (currFrame > frames.size()-1) {
        currFrame = 0;
      }
    }
  }

  void setFrameTime(float t) {
    frameTime = t;
  }

  PImage getCurrFrame() {
    return frames.get(currFrame);
  }
}

///////////////////////
// AnimationComponent
///////////////////////
class AnimationComponent extends Component {

  HashMap<String, AnimationClip> clips;
  AnimationClip currentClip;
  protected boolean flipX;

  AnimationComponent() {
    componentName = "AnimationComponent";
    clips = new HashMap<String, AnimationClip>();
    currentClip = null;
    flipX = false;
  }

  void addClip(String clipName, AnimationClip clip) {
    clips.put(clipName, clip);
  }

  void update(float dt) {
    if (currentClip != null) {
      currentClip.update(dt);
    }
  }

  void render() {
    if (currentClip != null) {
      pushMatrix();

      translate(gameObject.position.x, -gameObject.position.y);

      if (flipX) {
        translate(TILE_SIZE, 0);
        scale(-1, 1);
      }

      image(currentClip.getCurrFrame(), 0, 0);
      popMatrix();
    }
  }

  void play(String clipName) {
    currentClip = clips.get(clipName);
  }

  void setFlipX(boolean b) {
    flipX = b;
  }
}

///////////////
// ArtManager
///////////////
class ArtManager {

  HashMap<String, PImage> images;

  ArtManager() {
  }

  void load(String filePath) {
    AtlasParser atlasParser = null;

    String extension = getFileExtension(filePath);

    if (extension.equals("xml")) {
      atlasParser = new AtlasParserXML();
    }
    else if (extension.equals("json")) {
      atlasParser = new AtlasParserJSON();
    }

    atlasParser.load(filePath);
    images = atlasParser.getImages();
  }

  PImage getImage(String img) {
    return images.get(img);
  }
}

////////////////
// AtlasParser
////////////////
interface AtlasParser {
  void load(String metaFile);
  HashMap<String, PImage> getImages();
}
////////////////////////////
// BrickCollisionComponent
////////////////////////////
class BrickCollisionComponent extends CollisionComponent {
  boolean c;

  BrickCollisionComponent() {
    super();
    c = false;
    //componentName = "BrickCollisionComponent";
  }

  void onCollision(GameObject other) {
    super.onCollision(other);
  }

  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);		

    // Get controller
    if (other.name == "player") {
    }
  }

  void onCollisionExit(GameObject other) {
  }

  void render() {
    if (c) {
      pushStyle();
      fill(0, 255, 100, 100);
      strokeWeight(9);
      stroke(233, 0, 0, 120);
      rect(gameObject.position.x, -gameObject.position.y, TILE_SIZE, TILE_SIZE);
      popStyle();
    }
  }
}

////////////////////
// AtlasParserJSON
////////////////////
function AtlasParserJSON() {
  this.load = function(metaFile) {
  };
  this.getImages = function() {
  };
  this.getImageFromAtlas = function() {
  };
}

///////////////////
// AtlasParserXML
///////////////////
class AtlasParserXML implements AtlasParser {

  HashMap<String, PImage> images;

  AtlasParserXML() {
    images = null;
  }

  void load(String metaFile) {

    XMLElement root = new XMLElement(this, metaFile);

    String atlasPath = root.getString("imagePath");

    PImage atlas = loadImage(atlasPath);

    int numFrames = root.getChildCount();
    images = new HashMap<String, PImage>(numFrames);

    for (int i = 0; i < numFrames; ++i) {
      XMLElement frame = root.getChild(i);

      String imgName = frame.getString("n");

      // casting necessary here
      int x = (int)frame.getInt("x");
      int y = (int)frame.getInt("y");
      int w = (int)frame.getInt("w");
      int h = (int)frame.getInt("h");

      PImage img = atlas.get(x, y, w, h);
      images.put(imgName, img);
    }
  }

  HashMap<String, PImage> getImages() {
    return images;
  }
}
////////////////////////
// WrapAroundComponent
////////////////////////
class BoundingBoxComponent extends Component {

  float x, y, w, h;
  float xOffest, yOffset;
  int mask;
  int type;

  BoundingBoxComponent() {
    super();
    componentName = "BoundingBoxComponent";
    x = y = 0;
    w = h = TILE_SIZE;
    xOffest = yOffset = 0;
    mask = 0;
  }

  void awake() {
  }

  void update(float dt) {
    setPosition(gameObject.position.x + xOffest, gameObject.position.y + yOffset);
  }

  void setPosition(float px, float py) {
    x = px;
    y = py;
  }

  void setDimensions(float pw, float ph) {
    w = pw;
    h = ph;
  }

  void setOffsets(float x, float y) {
    xOffest = x;
    yOffset = -y;
  }

  void render() {
    if (debugOn) {
      pushStyle();
      strokeWeight(1);
      noFill();
      stroke(255, 0, 0);
      rect(x + 0, -y + yOffset*2, w, h);
      popStyle();
    }
  }

  String toString() {
    return "(" + x + "," + y + ")  " + "(" + w + "," + h + ")";
  }
}
////////////////////
// CameraComponent
////////////////////
class CameraComponent extends Component {

  GameObject gameObjectToFollow;
  PhysicsComponent physics;
  float xOffset;
  float yOffset;
  boolean lockAxisY;

  CameraComponent() {
    super();
    componentName = "CameraComponent";
    lockAxisY = false;
  }

  void preRender() {
    pushMatrix();
    translate(-gameObject.position.x, gameObject.position.y);
    render();
  }

  void postRender() {
    popMatrix();
  }

  void render() {
    int x = (int)(gameObject.position.x-xOffset);
    int y = (int)gameObject.position.y;
    debug.addString("Camera: " + x + ", " + y + "[" + xOffset + "]");
  }

  void update(float dt) {
    // TODO: check gameObjectToFollow
    gameObject.position.x = gameObjectToFollow.position.x - xOffset;
    if (lockAxisY == false) {
      //  gameObject.position.y = gameObjectToFollow.position.y;
    }
  }

  void setOffset(float x, float y) {
    xOffset = x;
    yOffset = y;
  }

  // TODO: fix
  PVector getVelocity() {
    return  physics.velocity;
  }

  void awake() {
    super.awake();
    physics = (PhysicsComponent)gameObjectToFollow.getComponent("PhysicsComponent");
  }

  void setLockAxisY(boolean lock) {
    lockAxisY = lock;
  }

  void follow(GameObject go) {
    gameObjectToFollow = go;
  }
}

///////////////////////////
// CoinCollisionComponent
///////////////////////////
class CoinCollisionComponent extends CollisionComponent {

  CoinCollisionComponent() {
    // TODO: fix
    componentName = "CollisionComponent";
  }

  void onCollision(GameObject other) {    
    if (other.name == "player") {
      soundManager.playSound("coin_pickup");
      gameObject.slateForRemoval();
    }
  }

  void onCollisionExit(GameObject other) {
  }
  void onCollisionEnter(GameObject other) {
  }
}

/////////////////////////////
// GroundCollisionComponent
/////////////////////////////
class GroundCollisionComponent extends CollisionComponent {
  boolean collision = false;

  GroundCollisionComponent() {
    super();
    //componentName = "BrickCollisionComponent";
  }

  void onCollision(GameObject other) {
    collision = true;
  }

  void render() {
    float x = gameObject.position.x;
    float y = gameObject.position.y;

    if (collision && debugOn) {
      pushStyle();
      strokeWeight(1);

      fill(0, 20, 150, 150);
      stroke(255, 0, 0);


      rect(x, -y, TILE_SIZE, TILE_SIZE);
      popStyle();

      collision = false;
    }
  }
  void onCollisionEnter(GameObject other) {
  }

  void onCollisionExit(GameObject other) {
  }
}

//////////////////////////
// MarioControllerComponent
//////////////////////////
class MarioControllerComponent extends Component {

  final float walkForce = 20;//550
  final float jumpForce = 550;//350
  //BoundingBoxComponent boundingBox;

  PhysicsComponent physics;
  AnimationComponent animation;

  boolean canWalk;

  boolean _isJumping;
  boolean _isIdle;
  boolean isRunning;

  MarioControllerComponent() {
    super();
    componentName = "MarioControllerComponent";
    _isJumping = false;
    _isIdle = true;
    isRunning = false;
  }

  void awake() {
    super.awake();
    animation = (AnimationComponent)gameObject.getComponent("AnimationComponent");
    physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    physics.setHasFriction(true);
  }

  void update(float dt) {
    // TODO: fix
    super.update(dt);

    // We don't want the player to be able to walk after
    // just jumping after being idle. Looks odd.
    if (Keyboard.isKeyDown(KEY_RIGHT)) {
      if (canJump()) {
        walkRight();
      }
    }
    else if (Keyboard.isKeyDown(KEY_LEFT)) {
      if (canJump()) {
        walkLeft();
      }
    }

    if (Keyboard.isKeyDown(KEY_UP)) {
      if (canJump()) {
        jump();
      }
    }

    if (gameObject.position.y >= height) {
      _isJumping = false;
    }

    if (isIdle()) {
      idle();
    }
  }

  void idle() {
    animation.play("idle");
  }

  void walkRight() {
    physics.applyForce(walkForce, 0);
    animation.setFlipX(false);
    animation.play("walk");
  }

  void walkLeft() {
    physics.applyForce(-walkForce, 0);
    animation.setFlipX(true);
    animation.play("walk");
  }

  void jump() {
    if (canJump()) {
      physics.applyForce(0, jumpForce);
      soundManager.playSound("smb_jumpsmall");
      animation.play("jump");
      _isJumping = true;
    }
  }

  void render() {
    debug.addString(">>>" + gameObject.position);
  }

  // Not moving in either x or y direction
  boolean isIdle() {
    return  Keyboard.isKeyDown(KEY_LEFT) == false &&
      Keyboard.isKeyDown(KEY_RIGHT) == false &&
      canJump();
  }

  boolean isWalking() {
    return abs(physics.velocity.x) > 0.1;
  }

  boolean isJumping() {
    return physics.isTouchingFloor();
  }

  // player can only jump if they are touching the floor.
  // TODO: later add if touching platform
  boolean canJump() {
    return physics.isTouchingFloor();
  }
}

/////////////////////
// PhysicsComponent
/////////////////////
class PhysicsComponent extends Component {

  // Purpose of this components is to take care of low-level physics things.
  PVector gravity;
  PVector position;
  PVector velocity;
  PVector acceleration;
  PVector drag;

  float maxXSpeed;
  float mass;

  boolean isDynamic;
  boolean atRest;

  boolean _isTouchingFloor;

  // Properties
  float groundY;
  BoundingBoxComponent boundingBox;
  boolean hasFriction;

  PhysicsComponent() {
    super();
    componentName = "PhysicsComponent";

    position = new PVector();
    velocity = new PVector();
    acceleration = new PVector();
    drag = new PVector();
    gravity = new PVector(0, -1800);

    maxXSpeed = 1;
    mass = 1;
    isDynamic = true;
    atRest = false;
    _isTouchingFloor = false;
    hasFriction = false;

    groundY = TILE_SIZE;
  }

  void awake() {
    super.awake();
    // fix cast
    boundingBox = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");

    if (boundingBox == null) {
      println("Could not find boundingBox component");
    }
  }

  boolean isTouchingFloor() {
    return _isTouchingFloor;
  }

  void setTouhcingFloor(boolean b) {
    _isTouchingFloor = b;
    if (b) {
      gravity.y = 0;
    }
    else {
      gravity.y = -100;
    }
  }

  void setGravity(float x, float y) {
    gravity.x = x;
    gravity.y = y;
  }

  void update(float dt) {
    if (isTouchingFloor() == false) {
      velocity.y += gravity.y * dt;
    }

    velocity.add(acceleration);
    //velocity.x += acceleration.x * dt;
    //velocity.y += acceleration.y * 1;

    // max running speed
    if (velocity.x > maxXSpeed) {
      velocity.x = maxXSpeed;
    }
    else if (velocity.x < 0.001) {
      //velocity.x = 0;
    }

    // TODO: fix
    // Only apply drag if touching floor
    if (hasFriction) {
      if (isTouchingFloor()) {

        drag.set(-velocity.x*0.11, 0);      //applyForce(drag);
        velocity.x += drag.x;
      }
      else {
        //if(velocity.x < 40){
        drag.set(-velocity.x*0.005, 0);      //applyForce(drag);
        velocity.x += drag.x;
        //}
      }
    }

    position.x += velocity.x * dt;
    position.y += velocity.y * dt;

    acceleration.mult(0);

    // If we went past the floor after jumping
    // place us at the floor level
    if (isTouchingFloor() == false && position.y - boundingBox.h < groundY) {
      position.y = groundY + boundingBox.h;
      _isTouchingFloor = true;
      velocity.y = 0;
      //velocity.set(0, 0);
    }
    else if (isTouchingFloor()) {
      position.y = groundY + boundingBox.h;
    }

    gameObject.position.set(position.x, position.y);
  }

  void setGroundY(float y) {
    groundY = y;
  }

  void render() {
    /* debug.addString("");
     debug.addString("PhysicsComponent");
     debug.addString("----------------------");
     debug.addString("position: " + position.x + " , " + position.y);
     debug.addString("velocity: " + velocity.x + " , " + velocity.y);
     debug.addString("grounded: " + isTouchingFloor);
     debug.addString("at rest: " + isAtRest());
     debug.addString("----------------------");*/
  }

  //
  void setMaxXSpeed(float m) {
    maxXSpeed = m;
  }

  void applyForce(float x, float y) {
    acceleration.x += x;
    acceleration.y += y;
    checkIfGrounded();
  }

  void checkIfGrounded() {
    if (acceleration.y != 0) {
      _isTouchingFloor = false;
    }
  }

  void applyForce(PVector force) {
    acceleration.add(force);
    checkIfGrounded();
  }

  PVector getVelocity() {
    return velocity;
  }

  void setVelocity(float x, float y) {
    velocity.x = x;
    velocity.y = y;
  }

  boolean isAtRest() {
    return velocity.x == 0 && position.y == groundY;
    //return velocity.x == 0 && velocity.y == 0;
  }

  void setHasFriction(boolean b) {
    hasFriction = b;
  }
}

///////////////////////
// CollisionComponent  
///////////////////////
class CollisionComponent extends Component {

  HashMap<String, GameObject> colliders;

  CollisionComponent() {
    super();
    componentName = "CollisionComponent";
    colliders = new HashMap<String, GameObject>();
  }

  void onCollision(GameObject other) {
  }

  void onCollisionEnter(GameObject other) {
    colliders.put(""+other.id, other);
  }

  void onCollisionExit(GameObject other) {
    colliders.remove(""+other.id);
  }
}

/////////////////////
// CollisionManager
/////////////////////
class CollisionManager {

  static final int NONE       = 0;
  static final int PLAYER     = 1;
  static final int STRUCTURE  = 2;
  static final int ENEMY      = 4;
  static final int PICKUP     = 8;

  HashMap<String, GameObject[]> collisions;
  ArrayList<GameObject> gameObjects;
  ArrayList<String> toRemove;

  CollisionManager() {
    gameObjects = new ArrayList<GameObject>();
    collisions = new HashMap<String, GameObject[]> ();
    toRemove = new ArrayList<String>();
  }

  void add(GameObject go) {
    gameObjects.add(go);
  }

  void removeDeadObjects() {
    for (int i = gameObjects.size()-1; i >= 0; i--) {
      GameObject go = gameObjects.get(i);
      if (go.requiresRemoval) {
        gameObjects.remove(i);
      }
    }
  }

  // 
  void checkForCollisionExits() {

    for (String key : collisions.keySet()) {

      GameObject[] pair = collisions.get(key);

      BoundingBoxComponent bb0 = (BoundingBoxComponent)pair[0].getComponent("BoundingBoxComponent");
      BoundingBoxComponent bb1 = (BoundingBoxComponent)pair[1].getComponent("BoundingBoxComponent");

      if (testCollisionWithTouch(bb0, bb1) == false) {
        CollisionComponent cc0 = (CollisionComponent)pair[0].getComponent("CollisionComponent");
        CollisionComponent cc1 = (CollisionComponent)pair[1].getComponent("CollisionComponent");

        cc0.onCollisionExit(pair[1]);
        cc1.onCollisionExit(pair[0]);

        toRemove.add(hashObjectPair(pair[0], pair[1]));
      }
    }

    for (int i = 0; i < toRemove.size(); i++) {
      collisions.remove(toRemove.get(i));
    }
    toRemove.clear();
  }

  void checkForCollisions() {
    debug.addString("num collision objects: " + gameObjects.size());

    if (gameObjects.size() < 2) {
      return;
    }

    numCollisionTests = 0;
    numCollisionTestsSkipped = 0;

    int numObjects = gameObjects.size();

    // If any collisions no longer collide
    checkForCollisionExits();

    // Now, check for new collisions.
    for (int i = 0; i < numObjects-1; i++) {
      for (int j = i+1; j < numObjects; j++) {

        GameObject obj1 = gameObjects.get(i);
        GameObject obj2 = gameObjects.get(j);

        BoundingBoxComponent bb1 = (BoundingBoxComponent)obj1.getComponent("BoundingBoxComponent");
        BoundingBoxComponent bb2 = (BoundingBoxComponent)obj2.getComponent("BoundingBoxComponent");

        // Check the masks
        if ((bb1.type & bb2.mask) == 0) {
          numCollisionTestsSkipped++;
          continue;
        }

        numCollisionTests++;
        if (testCollisionWithTouch(bb1, bb2)) {

          CollisionComponent cc1 = (CollisionComponent)obj1.getComponent("CollisionComponent");
          CollisionComponent cc2 = (CollisionComponent)obj2.getComponent("CollisionComponent");

          String hash = hashObjectPair(obj1, obj2);

          // First time these two are colliding
          if (collisions.containsKey(hash) == false) {
            cc1.onCollisionEnter(obj2);
            cc2.onCollisionEnter(obj1);
            collisions.put(hash, new GameObject[] { 
              obj1, obj2
            }
            );
          }
          else {
            cc1.onCollision(obj2);
            cc2.onCollision(obj1);
          }
        }
      }
    }
  }

  String hashObjectPair(GameObject g0, GameObject g1) {
    String hash = "";

    if (g0.id < g1.id) {
      hash = ("" + g0.id) + ("" + g1.id);
    }
    else {
      hash = ("" + g1.id) + ("" + g0.id);
    }

    return hash;
  }
}

////////////////////////////////
// PatrolEnemyPhysicsComponent
////////////////////////////////
class PatrolEnemyPhysicsComponent extends PhysicsComponent {

  PatrolEnemyPhysicsComponent() {
    super();
    //componentName = "PatrolEnemyPhysicsComponent";		

    setVelocity(-32, 0);
    setMaxXSpeed(32);
    setHasFriction(false);
  }

  void awake() {
    super.awake();
    position = new PVector(gameObject.position.x, gameObject.position.y);
  }

  void update(float dt) {
    super.update(dt);
  }

  void render() {
  }
}

//////////////
// Component
//////////////
class Component {

  protected String componentName;
  protected GameObject gameObject;
  protected String name;
  protected boolean enabled;

  Component() {
    componentName = "Component";
    gameObject = null;
    name = "";
    enabled = true;
  }

  void update(float dt) {
  }

  void render() {
  }

  void awake() {
  }

  GameObject getGameObject() {
    return gameObject;
  }

  void setGameObject(GameObject go) {
    gameObject = go;
  }

  String getComponentName() {
    return componentName;
  }

  void setName(String n) {
    name = n;
  }

  String getname() {
    return name;
  }

  boolean isEnabled() {
    return enabled;
  }
}

/////////////
// Debugger
/////////////
class Debugger {
  private ArrayList strings;
  private PFont font;
  private int fontSize;
  private boolean isOn;

  public Debugger() {
    isOn = true;
    strings = new ArrayList();
    fontSize = 15;
    font = createFont("Arial", fontSize);
  }

  public void addString(String s) {
    if (isOn) {
      strings.add(s);
    }
  }

  /*
   * Should be called after every frame
   */
  public void clear() {
    strings.clear();
  }

  /**
   If the debugger is off, it will ignore calls to addString and draw saving
   some processing time.
   */
  public void toggle() {
    isOn = !isOn;
  }

  public void setOn(boolean on) {
    isOn = on;
  }

  public void render() {
    if (isOn) {
      int y = 20;
      fill(255);
      for (int i = 0; i < strings.size(); i++, y+=fontSize) {
        textFont(font);
        text((String)strings.get(i), 0, y);
      }
    }
  }
}
/////////////////////////////
// SpineyCollisionComponent
/////////////////////////////
class SpineyCollisionComponent extends CollisionComponent {

  SpineyCollisionComponent() {
    // TODO: fix
    super();
    componentName = "CollisionComponent";
  }

  void onCollision(GameObject other) {
    // If mario is invinsible
    // kick spiney
  }

  void onCollisionExit(GameObject other) {
  }
  void onCollisionEnter(GameObject other) {
  }
}

///////////////////////////////
// CreatureCollisionComponent
///////////////////////////////
class CreatureCollisionComponent extends CollisionComponent {

  public boolean _fallsOffLedge;
  PhysicsComponent phy;

  CreatureCollisionComponent() {
    super();
    _fallsOffLedge = false;
  }

  void awake() {
    super.awake();
    phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
  }

  void onCollisionExit(GameObject other) {
    super.onCollisionExit(other);

    // if we are no longer colliding with anything, then fall
    if (colliders.isEmpty()) {
      phy.setGroundY(TILE_SIZE);
      phy.setTouhcingFloor(false);
    }
  }

  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);

    // TODO: get collision Type

    //
    if (other.position.y + TILE_SIZE >= gameObject.position.y && phy.isTouchingFloor() == false ) {
      phy.setGroundY(other.position.y);
      phy.setTouhcingFloor(true);
    }

    // If hit side of something, reversedirection
    // gameObject.slateForRemoval();

    // If hit the top of something, land()
  }

  void onCollision(GameObject other) {
  }

  boolean doesFallsOffLedge() {
    return _fallsOffLedge;
  }
}

/////////////
// Keyboard
/////////////
public static class Keyboard {

  private static final int NUM_KEYS = 128;

  // Locking keys are good for toggling things.
  // After locking a key, when a user presses and releases a key, it will register and
  // being 'down' (even though it has been released). Once the user presses it again,
  // it will register as 'up'.
  private static boolean[] lockableKeys = new boolean[NUM_KEYS];

  // Use char since we only need to store 2 states (0, 1)
  private static char[] lockedKeyPresses = new char[NUM_KEYS];

  // The key states, true if key is down, false if key is up.
  private static boolean[] keys = new boolean[NUM_KEYS];

  /*
   * The specified keys will stay down even after user releases the key.
   * Once they press that key again, only then will the key state be changed to up(false).
   */
  public static void lockKeys(int[] keys) {
    for (int k : keys) {
      if (isValidKey(k)) {
        lockableKeys[k] = true;
      }
    }
  }

  /*
   * TODO: if the key was locked and is down, then we unlock it, it needs to 'pop' back up.
   */
  public static void unlockKeys(int[] keys) {
    for (int k : keys) {
      if (isValidKey(k)) {
        lockableKeys[k] = false;
      }
    }
  }

  /* This is for the case when we want to start off the game
   * assuming a key is already down.
   */
  public static void setVirtualKeyDown(int key, boolean state) {
    setKeyDown(key, true);
    setKeyDown(key, false);
  }

  /**
   */
  private static boolean isValidKey(int key) {
    return (key > -1 && key < NUM_KEYS);
  }

  /*
   * Set the state of a key to either down (true) or up (false)
   */
  public static void setKeyDown(int key, boolean state) {

    if (isValidKey(key)) {

      // If the key is lockable, as soon as we tell the class the key is down, we lock it.
      if ( lockableKeys[key] ) {
        // First time pressed
        if (state == true && lockedKeyPresses[key] == 0) {
          lockedKeyPresses[key]++;
          keys[key] = true;
        }
        // First time released
        else if (state == false && lockedKeyPresses[key] == 1) {
          lockedKeyPresses[key]++;
        }
        // Second time pressed
        else if (state == true && lockedKeyPresses[key] == 2) {
          lockedKeyPresses[key]++;
        }
        // Second time released
        else if (state == false && lockedKeyPresses[key] == 3) {
          lockedKeyPresses[key] = 0;
          keys[key] = false;
        }
      }
      else {
        keys[key] = state;
      }
    }
  }

  /* 
   * Returns true if the specified key is down.
   */
  public static boolean isKeyDown(int key) {
    return keys[key];
  }
}

// These are outside of keyboard simply because I don't want to keep
// typing Keyboard.KEY_* in the main Tetrissing.pde file
final int KEY_BACKSPACE = 8;
final int KEY_TAB       = 9;
final int KEY_ENTER     = 10;

final int KEY_SHIFT     = 16;
final int KEY_CTRL      = 17;
final int KEY_ALT       = 18;

final int KEY_CAPS      = 20;
final int KEY_ESC = 27;

final int KEY_SPACE  = 32;
final int KEY_PGUP   = 33;
final int KEY_PGDN   = 34;
final int KEY_END    = 35;
final int KEY_HOME   = 36;

final int KEY_LEFT   = 37;
final int KEY_UP     = 38;
final int KEY_RIGHT  = 39;
final int KEY_DOWN   = 40;

final int KEY_0 = 48;
final int KEY_1 = 49;
final int KEY_2 = 50;
final int KEY_3 = 51;
final int KEY_4 = 52;
final int KEY_5 = 53;
final int KEY_6 = 54;
final int KEY_7 = 55;
final int KEY_8 = 56;
final int KEY_9 = 57;

final int KEY_A = 65;
final int KEY_B = 66;
final int KEY_C = 67;
final int KEY_D = 68;
final int KEY_E = 69;
final int KEY_F = 70;
final int KEY_G = 71;
final int KEY_H = 72;
final int KEY_I = 73;
final int KEY_J = 74;
final int KEY_K = 75;
final int KEY_L = 76;
final int KEY_M = 77;
final int KEY_N = 78;
final int KEY_O = 79;
final int KEY_P = 80;
final int KEY_Q = 81;
final int KEY_R = 82;
final int KEY_S = 83;
final int KEY_T = 84;
final int KEY_U = 85;
final int KEY_V = 86;
final int KEY_W = 87;
final int KEY_X = 88;
final int KEY_Y = 89;
final int KEY_Z = 90;

// Function keys
final int KEY_F1  = 112;
final int KEY_F2  = 113;
final int KEY_F3  = 114;
final int KEY_F4  = 115;
final int KEY_F5  = 116;
final int KEY_F6  = 117;
final int KEY_F7  = 118;
final int KEY_F8  = 119;
final int KEY_F9  = 120;
final int KEY_F10 = 121;
final int KEY_F12 = 122;

//final int KEY_INSERT = 155;

////////////////////////////
// BrickCollisionComponent
////////////////////////////
class BrickCollisionComponent extends CollisionComponent {
  boolean c;

  BrickCollisionComponent() {
    super();
    c = false;
    //componentName = "BrickCollisionComponent";
  }

  void onCollision(GameObject other) {
    super.onCollision(other);
  }

  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);		

    // Get controller
    if (other.name == "player") {
    }
  }

  void onCollisionExit(GameObject other) {
  }

  void render() {
    if (c) {
      pushStyle();
      fill(0, 255, 100, 100);
      strokeWeight(9);
      stroke(233, 0, 0, 120);
      rect(gameObject.position.x, -gameObject.position.y, TILE_SIZE, TILE_SIZE);
      popStyle();
    }
  }
}

////////////////////////////
// GoombaCollisionComponent
////////////////////////////
class GoombaCollisionComponent extends CollisionComponent {

  GoombaCollisionComponent() {
    // TODO: fix
    super();
    componentName = "CollisionComponent";
  }

  void onCollision(GameObject other) {
    if (other.name == "mario" ||  other.name == "player") {
      //EnemyControllerComponent e = (EnemyControllerComponent)gameObject.findComponent("EnemyControllerComponent");
      //GoombaControllerComponent s = (GoombaControllerComponent)gameObject.findComponent("SpriteControllerComponent");
      //e.squash();
    }
  }

  void onCollisionExit(GameObject other) {
  }
  void onCollisionEnter(GameObject other) {
  }
}

///////////////////
// GoombaControllerComponent
///////////////////
class GoombaControllerComponent extends SpriteControllerComponent {

  AnimationComponent animationComponent;

  GoombaControllerComponent() {
    // TODO: fix
    super();
    componentName = "EnemyControllerComponent";
  }

  void awake() {
    super.awake();
    animationComponent = (AnimationComponent)gameObject.getComponent("AnimationComponent");
  }

  void squash() {
    animationComponent.play("squashed");
    isAlive = false;
    //gameObject.velocity.set(0,0);
    gameObject.removeComponent("PhysicsComponent");
  }

  void update(float dt) {
  }

  void render() {
  }
}

////////////////////////////
// MarioCollisionComponent
////////////////////////////
class MarioCollisionComponent extends CollisionComponent {

  MarioCollisionComponent() {
    super();
    componentName = "CollisionComponent";
  }

  void onCollision(GameObject other) {
    // For right now, just reload the scene
    if (other.hasTag("enemy")) {
      scene.load();
    }
  }

  void onCollisionExit(GameObject other) {
  }
  void onCollisionEnter(GameObject other) {
  }
}

/////////////////
// SoundManager
/////////////////
function SoundManager() {

  var muted;

  var BASE_PATH = "data/audio/";

  var sounds = [];
  var soundNames = [];

  /*
  *
   */
  this.setMute = function(mute) {
    muted = mute;
  };

  /*
  */
  this.isMuted = function() {
    return muted;
  };

  /*
  */
  this.stop = function() {
  }

  this.addSound = function(soundName) {
    var i = sounds.push(document.createElement('audio')) - 1;
    console.log(i);
    sounds[i].setAttribute('src', BASE_PATH + soundName + ".ogg");
    console.log(sounds[i]);
    sounds[i].preload = 'auto';
    sounds[i].load();
    //sounds[i].setAttribute('autoplay', 'autoplay');
    soundNames[i] = soundName;
  }

  /*
  */
  this.playSound = function(soundName) {
    console.log("play audio");
    var soundID = -1;

    if (muted) {
      return;
    }

    for (var i = 0; i < sounds.length; i++) {
      if (soundNames[i] === soundName) {
        soundID = i;
        break;
      }
    }

    // return early if the soundName wasn't found to prevent AOOB
    if (soundID === -1) {
      return;
    }

    sounds[soundID].volume = 1.0;

    // Safari does not want to play sounds...??
    try {
      console.log(sounds[soundID]);
      sounds[soundID].volume = 1.0;
      sounds[soundID].play();
      sounds[soundID].currentTime = 0;
    }
    catch(e) {
      console.log("Could not play audio file: " + e);
    }
  };
}

///////////////
// GameObject
///////////////
class GameObject {

  PVector position;
  String name;
  ArrayList<String> tags;
  HashMap<String, Component> components;
  boolean requiresRemoval;
  int id;

  GameObject() {
    position = new PVector();
    name = "";
    components = new HashMap<String, Component>();
    tags = new ArrayList<String>();
    requiresRemoval = false;
    id = Utils.getNextID();
  }

  void addComponent(Component component) {
    component.setGameObject(this);
    components.put(component.componentName, component);
  }

  Component getComponent(String s) {
    return components.get(s);
  }

  void addTag(String t) {
    tags.add(t);
  }

  boolean hasTag(String s) {
    for (int i = 0; i < tags.size(); i++) {
      if (tags.get(i) == s) {
        return true;
      }
    }
    return false;
  }

  void removeComponent(String name) {
    components.remove(name);
  }

  void awake() {
    Component c;
    for (String key : components.keySet()) {
      c = components.get(key);
      c.awake();
    }
  }

  void update(float dt) {
    Component c;
    for (String key : components.keySet()) {
      c = components.get(key);
      if (c.isEnabled()) {
        c.update(dt);
      }
    }
  }

  boolean haTag(String tag) {
    for (int i = 0; i < tags.size(); i++) {
      if (tags.get(i) == tag) {
        return true;
      }
    }
    return false;
  }

  PVector getPosition() {
    return position;
  }

  void setPosition(float x, float y) {
    position.x = x;
    position.y = y;
  }

  void render() {
    Component c;
    for (String key : components.keySet()) {
      c = components.get(key);
      if (c.isEnabled()) {
        c.render();
      }
    }
  }

  void slateForRemoval() {
    requiresRemoval = true;
  }
}

/////////////////////////////
// SpriteControllerComponent
/////////////////////////////
class SpriteControllerComponent extends Component {

  // SpriteController component manages behvaviour of sprites

  boolean isAlive;
  boolean squashable;

  SpriteControllerComponent() {
    super();
    componentName = "SpriteControllerComponent";
    squashable = true;
  }

  boolean isFalling() {
    // do stuff here
    return false;
  }

  boolean canBeSquashed() {
    return squashable;
  }

  // they can be hurt in different ways..
  void hurt() {
  }

  // 
  void squash() {
  }

  void bump() {
  }

  void walk() {
  }

  // If hit by invinsible mario, any sprite is immediately killed
  void kill() {
    // play animation
    // set physics component
    // remove boundingbox?
  }
}

//////////////////////
// GameObjectFactory
//////////////////////
class GameObjectFactory {

  public GameObject create(String id) {

    // PLAYER
    if (id == "player") {
      GameObject player = new GameObject();
      player.name = "player";

      PhysicsComponent physicsComp = new PhysicsComponent();
      physicsComp.setMaxXSpeed(300);
      // physicsComp.setVelocity(30, 0);

      AnimationComponent aniComp = new AnimationComponent();

      AnimationClip jumpClip = new AnimationClip();
      jumpClip.addFrame("chars/mario/jump.png");
      aniComp.addClip("jump", jumpClip);

      AnimationClip idleClip = new AnimationClip();
      idleClip.addFrame("chars/mario/idle.png");  
      aniComp.addClip("idle", idleClip);
      aniComp.play("idle");

      AnimationClip walkClip = new AnimationClip();
      walkClip.setFrameTime(0.1);
      for (int i = 0; i < 3; ++i) {
        walkClip.addFrame("chars/mario/walk" + i + ".png");
      }
      aniComp.addClip("walk", walkClip);

      MarioControllerComponent controller = new MarioControllerComponent();
      player.addComponent(controller);

      BoundingBoxComponent bbComp = new BoundingBoxComponent();
      bbComp.w = TILE_SIZE;
      bbComp.h = TILE_SIZE;

      bbComp.mask = CollisionManager.PICKUP | CollisionManager.STRUCTURE;
      bbComp.type = CollisionManager.PLAYER;

      MarioCollisionComponent collisionComp = new MarioCollisionComponent();

      player.addComponent(bbComp);
      player.addComponent(physicsComp);
      player.addComponent(aniComp);
      player.addComponent(collisionComp);

      return player;
    }

    //
    // COIN
    //
    else if (id == "coin") {
      GameObject coin = new GameObject();
      coin.name = "coin";

      AnimationClip idleClip = new AnimationClip();
      for (int i = 0; i < 4; i++) {
        idleClip.addFrame("props/coin/" + "coin" + i + ".png");
      }
      idleClip.setFrameTime(0.25);

      AnimationComponent aniComp = new AnimationComponent();
      aniComp.addClip("idle", idleClip);
      aniComp.play("idle");

      CoinCollisionComponent collisionComp = new CoinCollisionComponent();

      BoundingBoxComponent bbComp = new BoundingBoxComponent();
      bbComp.w = 10;
      bbComp.h = 20;
      bbComp.setOffsets(11, -6);
      bbComp.mask = CollisionManager.PLAYER;
      bbComp.type = CollisionManager.PICKUP;

      coin.addComponent(aniComp);
      coin.addComponent(collisionComp);
      coin.addComponent(bbComp);

      return coin;
    }

    //
    // GROUND
    //
    else if (id == "ground") {
      GameObject ground = new GameObject();
      WrapAroundComponent c = new WrapAroundComponent();
      c.imgPath = "props/structure/ground.png";
      ground.addComponent(c);

      // For now reduce collision checks and use a 'fake' ground
      /*BoundingBoxComponent boxComp = new BoundingBoxComponent();
       boxComp.w = TILE_SIZE;
       boxComp.h = TILE_SIZE;
       ground.addComponent(boxComp);
       boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;
       boxComp.type = CollisionManager.STRUCTURE;
       GroundCollisionComponent collisionComp = new GroundCollisionComponent();
       ground.addComponent(collisionComp);*/

      return ground;
    }

    //
    // CLOUD
    //
    else if (id == "cloud") {
      GameObject cloud = new GameObject();
      WrapAroundComponent c = new WrapAroundComponent();
      c.imgPath = "props/clouds/cloud1.png";
      c.extraBuffer = TILE_SIZE * 9;
      cloud.position.y = height - TILE_SIZE;
      cloud.addComponent(c);
      return cloud;
    }

    //
    // BRICK
    //
    else if ( id == "brick") {
      GameObject brick = new GameObject();
      WrapAroundComponent c = new WrapAroundComponent();
      c.imgPath = "props/structure/bricks.png";

      BrickCollisionComponent collisionComp = new BrickCollisionComponent();
      brick.addComponent(collisionComp);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.STRUCTURE;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;

      brick.addComponent(boxComp);
      brick.addComponent(c);
      return brick;
    }

    //
    // GOOMBA
    //
    else if (id == "goomba") {
      GameObject goomba = new GameObject();
      goomba.addTag("enemy");
      goomba.name = "goomba";

      AnimationComponent aniComp = new AnimationComponent();
      goomba.addComponent(aniComp);

      AnimationClip walkClip = new AnimationClip();
      walkClip.setFrameTime(0.25);
      walkClip.addFrame("chars/goomba/walk0.png");
      walkClip.addFrame("chars/goomba/walk1.png");
      aniComp.addClip("walk", walkClip);
      aniComp.play("walk");

      AnimationClip squashed = new AnimationClip();
      squashed.addFrame("chars/goomba/dead.png");
      aniComp.addClip("squashed", squashed);

      //GoombaControllerComponent controlComp = new GoombaControllerComponent();
      //controlComp.walk();
      //goomba.addComponent(controlComp);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      goomba.addComponent(boxComp);

      /*PatrolEnemyPhysicsComponent physics = new PatrolEnemyPhysicsComponent();
       physics.setMaxXSpeed(32);
       physics.setVelocity(32, 0);
       goomba.addComponent(physics);*/

      GoombaCollisionComponent collisionComp = new GoombaCollisionComponent();
      goomba.addComponent(collisionComp);

      return goomba;
    }

    //
    // SPINEY
    //
    else if (id == "spiney") {
      GameObject spiney = new GameObject();
      spiney.addTag("enemy");
      spiney.name = "spiney";

      AnimationComponent aniComp = new AnimationComponent();
      spiney.addComponent(aniComp);

      AnimationClip walkClip = new AnimationClip();
      walkClip.setFrameTime(0.25);
      walkClip.addFrame("chars/spiney/walk0.png");
      walkClip.addFrame("chars/spiney/walk1.png");
      aniComp.addClip("walk", walkClip);
      aniComp.play("walk");

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.ENEMY;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY | CollisionManager.STRUCTURE;
      spiney.addComponent(boxComp);

      //SpineyCollisionComponent collisionComp = new SpineyCollisionComponent();
      CreatureCollisionComponent collisionComp = new CreatureCollisionComponent();
      spiney.addComponent(collisionComp);

      // CreatureControllerComponent..

      PatrolEnemyPhysicsComponent physics = new PatrolEnemyPhysicsComponent();
      //physics.setMaxXSpeed(32);
      //physics.setVelocity(-32, 0);
      physics.setGravity(0, -100);
      spiney.addComponent(physics);

      return spiney;
    }

    return null;
  }
}

//////////
// Scene  
//////////
class Scene {
  ArrayList<GameObject> gameObjects;
  GameObject player;
  GameObject gameCamera;
  CameraComponent camComp;
  GameObjectFactory gameObjectFactory;
  Timer timer;
  CollisionManager collisionManager;
  float collisionCheckTime;
  boolean isPaused;
  boolean collisionsEnabled;
  Timer collisionTimer;
  Timer renderTimer;

  void load() {
    isPaused = false;
    gameObjects = new ArrayList<GameObject>();

    timer = new Timer();
    gameObjectFactory = new GameObjectFactory();
    player = gameObjectFactory.create("player");
    collisionManager = new CollisionManager();

    collisionsEnabled = true;

    // Move to factory?
    gameCamera = new GameObject();
    gameCamera.addTag("camera");
    gameCamera.position = new PVector(0, height);
    camComp = new CameraComponent();
    camComp.setLockAxisY(true);
    camComp.follow(player);
    camComp.setOffset(TILE_SIZE * 4, 0);
    gameCamera.addComponent(camComp);

    collisionTimer = new Timer();
    renderTimer = new Timer();

    collisionManager.add(player);

    gameObjects.add(gameCamera);


    generateGroundTiles();
    generateCoins();
    //generateBrickTiles(5);
    //generateBrickTiles(6);
    generateStaircase();
    //generateGoombas();
    generateSpineys();
    generateClouds();

    gameObjects.add(player);

    awake();
  }

  Scene() {
    load();
  }

  PVector getCamPos() {
    return gameCamera.position;
  }

  CameraComponent getActiveCamera() {
    return camComp;
  }

  void awake() {
    for (int i = 0; i < gameObjects.size(); i++) {
      gameObjects.get(i).awake();
    }
  }

  void keyPressed() {
  }

  void pause() {
    // prevent the sound from playing more than once
    // TODO: fix in SoundManager?
    // addMaxPlayers for audio.
    if (isPaused) {
      return;
    }
    soundManager.playSound("pause");
    timer.pause();
    isPaused = true;
  }

  void resume() {
    timer.resume();
    isPaused = false;
  }

  void update() {

    if (collisionsEnabled) {
      collisionManager.removeDeadObjects();
    }

    timer.tick();
    for (int i = 0; i < gameObjects.size(); i++) {
      gameObjects.get(i).update(timer.getDeltaSec());
    }

    collisionTimer.reset();
    collisionTimer.tick();
    if (collisionsEnabled) {
      collisionManager.checkForCollisions();
    }
    collisionTimer.tick();
    collisionCheckTime = collisionTimer.getTotalTime() * 1000;
  }

  void render() {
    background(96, 160, 255);
    //background(0, 0, 0);

    debug.addString("(" + width + "," + height + ")");
    debug.addString("" + int(frameRate));
    debug.addString("collision check time: " + collisionCheckTime);

    renderTimer.reset();
    renderTimer.tick();

    camComp.preRender();
    for (int i = 0; i < gameObjects.size(); i++) {
      GameObject go = gameObjects.get(i);

      // already did camera's render in preRender
      if (go.hasTag("camera")) {
        continue;
      }

      go.render();
    }
    camComp.postRender();
    renderTimer.tick();

    debug.addString("render time: " + renderTimer.getTotalTime());

    // Find any objects that need to be removed from the scene
    for (int i = gameObjects.size()-1; i >= 0; i--) {
      if (gameObjects.get(i).requiresRemoval) {
        gameObjects.remove(i);
      }
    }

    debug.addString("Collision Tests: " + numCollisionTests);
    debug.addString("Collision Tests Skipped: " + numCollisionTestsSkipped);

    pushStyle();
    strokeWeight(1);
    stroke(0, 0, 255);

    if (debugOn) {
      // Draw debug lines
      for (int y = -1; y < height; y += TILE_SIZE) {
        line(0, y, width, y);
      }

      for (int x = 0; x < width; x += TILE_SIZE) {
        line(x, 0, x, height);
      }
    }
    popStyle();
  }

  void generateCoins() {
    for (int numGroups = 0; numGroups < 5; numGroups++) {
      for (int x = 0; x < 3; x++) {
        for (int y = 0; y < 3; y++) {
          GameObject coin = gameObjectFactory.create("coin");
          coin.position = new PVector((96) + (numGroups*25*TILE_SIZE) + x * TILE_SIZE, TILE_SIZE + y * TILE_SIZE + TILE_SIZE);
          gameObjects.add(coin);
          collisionManager.add(coin);
        }
      }
    }
  }

  void generateGoombas() {
    for (int i = 0; i < 2; i++) {
      GameObject goomba = gameObjectFactory.create("goomba");
      goomba.position = new PVector(96 + i * 32, 164 + i * 32);
      gameObjects.add(goomba);
      collisionManager.add(goomba);
    }
  }

  void generateSpineys() {
    for (int i = 0; i < 8; i++) {
      GameObject spiney = gameObjectFactory.create("spiney");
      spiney.position = new PVector(TILE_SIZE * 10 + (i * width), height);
      gameObjects.add(spiney);
      collisionManager.add(spiney);
    }
  }

  // TODO: find where to move this....
  void generateGroundTiles() {
    // +1 so the last tile doesn't just jump into view.
    for (int x = -TILE_SIZE * 4; x < TILE_SIZE * (NUM_TILES_FOR_WIDTH + 1); x += TILE_SIZE) {
      GameObject ground = gameObjectFactory.create("ground");
      ground.setPosition(x, TILE_SIZE);
      gameObjects.add(ground);
      //collisionManager.add(ground);
    }
  }

  void setEnableCollisions(boolean b) {
    collisionsEnabled = b;
  }

  void generateClouds() {
    GameObject cloud = gameObjectFactory.create("cloud");
    gameObjects.add(cloud);
  }

  void generateStaircase() {
    int x = 0;
    for (int y = 0; y < 4; y++) {
      for (x=y; x < 4; x++) {
        GameObject brick = gameObjectFactory.create("brick");
        brick.setPosition((TILE_SIZE* 6) +  x * TILE_SIZE, TILE_SIZE * y + (TILE_SIZE* 7));
        gameObjects.add(brick);
        collisionManager.add(brick);
      }
    }
  }

  void generateBrickTiles(int y) {
    // +1 so the last tile doesn't just jump into view.
    for (int x = -TILE_SIZE; x < TILE_SIZE * (NUM_TILES_FOR_WIDTH + 1); x += TILE_SIZE) {
      GameObject brick = gameObjectFactory.create("brick");
      brick.setPosition(x, TILE_SIZE * y);
      gameObjects.add(brick);
      collisionManager.add(brick);
    }
  }
}

//////////
// Timer
//////////
public class Timer {

  private int lastTime;
  private float deltaTime;
  private boolean paused;
  private float totalTime;
  private boolean countingUp; 

  public Timer() {
    reset();
  }

  public boolean isPaused() {
    return paused;
  }

  public void subtract(float t) {
    totalTime -= t;
  }

  public void add(float t) {
    totalTime += t;
  }

  public void setDirection(int d) {
    countingUp = false;
  }

  public void reset() {
    deltaTime = 0.0f;
    lastTime = -1;
    paused = false;
    totalTime = 0.0f;
    countingUp = true;
  }

  public void togglePause() {
    if (paused) {
      resume();
    }
    else {
      pause();
    }
  }

  public void pause() {
    paused = true;
  }

  public void resume() {
    deltaTime = 0.0f;
    lastTime = -1;
    paused = false;
  }

  public void setTime(int min, int sec) {    
    totalTime = (min * 60) + sec;
  }

  /*
      Format: 5.5 = 5 minutes 30 seconds
   */
  public void setTime(float minutes) {
    int int_min = (int)minutes;
    int sec = (int)((minutes - (float)int_min) * 60.0f);
    setTime( int_min, sec);
  }

  public float getTotalTime() {
    return totalTime;
  }

  /*
  */
  public float getDeltaSec() {
    if (paused) {
      return 0.0f;
    }
    return deltaTime;
  }

  /*
  * Calculates how many seconds passed since the last call to this method.
   *
   */
  public void tick() {
    if (lastTime == -1) {
      lastTime = millis();
    }

    int delta = millis() - lastTime;
    lastTime = millis();
    deltaTime = delta/1000.0f;

    if (countingUp) {
      totalTime += deltaTime;
    }
    else {
      totalTime -= deltaTime;
    }
  }
}

///////////
// Utils
//////////

static float EPSILON = 0.00001;
boolean isPJSMode = true;

String PVectorToString(PVector vec) {
  return "" + vec.x + ", " + vec.y;
}

// ArtManager needs this in order to determine which
// parser to use.
String getFileExtension(String path) {
  String[] tokens = split(path, '.');
  return tokens[tokens.length - 1];
}



public static class Utils {
  private static int id = -1;

  public static int getNextID() {
    return ++id;
  }
}

// TODO: add NAABB test

//
boolean isPointInBox(float px, float py, BoundingBoxComponent b) {
  if (px >= b.x && px <= b.x + b.w && py <= b.y && py >= b.y - b.h) {
    return true;
  }
  return false;
}

// Determine if for sure one box isn't touching the other, then negate that.
boolean testCollisionWithTouch(BoundingBoxComponent a, BoundingBoxComponent b) {
  return !( (a.x       > b.x + b.w) || 
    (a.x + a.w < b.x )      ||
    (a.y       > b.y + b.h) ||
    (a.y + a.h < b.y));
}

////////////////////////
// WrapAroundComponent
////////////////////////
class WrapAroundComponent extends Component {

  PImage img;
  String imgPath;
  PVector position;
  float extraBuffer;

  WrapAroundComponent() {
    super();
    componentName = "WrapAroundComponent";
    img = null;
    imgPath = "";
    position = new PVector();
    extraBuffer = 0;
  }

  void awake() {
    super.awake();
    img = artManager.getImage(imgPath);
  }

  void update(float dt) {
    PVector camPos = scene.getCamPos();

    scene.getActiveCamera();
    PVector dir = scene.getActiveCamera().getVelocity();

    if (dir.x > 0 && gameObject.position.x + img.width < camPos.x) {
      gameObject.position.x += width + img.width + extraBuffer;
    }
    // player walks left
    else if (dir.x < 0 && gameObject.position.x > camPos.x + width) {
      gameObject.position.x -= width + img.width + extraBuffer;
    }
  }

  void render() {
    image(img, gameObject.position.x, -gameObject.position.y);
  }
}

