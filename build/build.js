import ddf.minim.*;
/*
  @pjs globalKeyEvents="true"; preload="data/atlas_2x.png";
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
  soundManager.addSound("jump", 2);
  soundManager.addSound("coin_pickup", 7);
  soundManager.addSound("pause", 1);
  soundManager.addSound("bump", 1);
  // soundManager.setMute(true);

  debugOn = false;

  Keyboard.lockKeys(new int[] {
    KEY_P, 
    KEY_M,
    KEY_I
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

  if(Keyboard.isKeyDown(KEY_R)) {
    scene.load();
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
  protected boolean flipY;
  boolean paused;
  PVector pos;

  AnimationComponent() {
    componentName = "AnimationComponent";
    clips = new HashMap<String, AnimationClip>();
    currentClip = null;
    flipX = false;
    flipY = false;
    paused = false;
    pos = new PVector();
  }

  void addClip(String clipName, AnimationClip clip) {
    clips.put(clipName, clip);
  }

  void update(float dt) {
    if(paused){
      return;
    }
    
    if (currentClip != null) {
      currentClip.update(dt);
    }
  }

  void setPosition(float x, float y){
    pos.x = x;
    pos.y = y;
  }

  void render() {
    if (currentClip != null) {
      pushMatrix();

      translate(gameObject.position.x, -gameObject.position.y);
      translate(0, -pos.y);

      if (flipX) {
        translate(TILE_SIZE, 0);
        scale(-1, 1);
      }

      if(flipY){
        translate(0, TILE_SIZE);
        scale(1, -1);
      }

      

      image(currentClip.getCurrFrame(), 0, 0);
      popMatrix();
    }
  }

  void play(String clipName) {
    currentClip = clips.get(clipName);
  }

  /*

  */
  void pause(){
    paused = true;
  }

  void resume(){
    paused = false;
  }

  void setFlipX(boolean b) {
    flipX = b;
  }

  void setFlipY(boolean b){
    flipY = b;
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
  HashMap<String, GameObject> colliders;

  BoundingBoxComponent() {
    super();
    componentName = "BoundingBoxComponent";
    x = y = 0;
    w = h = TILE_SIZE;
    xOffest = yOffset = 0;
    mask = 0;
    colliders = new HashMap<String, GameObject>();
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
      rect(x, -y + yOffset*2, w, h);
      popStyle();
    }
  }

  String toString() {
    return "(" + x + "," + y + ")  " + "(" + w + "," + h + ")";
  }

  void onCollision(GameObject other) {
  }

  void onCollisionEnter(GameObject other) {
    colliders.put("" + other.id, other);
  }

  void onCollisionExit(GameObject other) {
    colliders.remove("" + other.id);
  }
}
/////////////////////////////
// BrickControllerComponent
/////////////////////////////
class BrickControllerComponent extends StructureControllerComponent{
	
	float y;
	boolean bouncing;
	float original;
	BoundingBoxComponent bounds;
	AnimationComponent animation;

	BrickControllerComponent(){
		super();
		y = 0;
		bouncing = false;
	}

	void awake(){
		super.awake();
		bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
		animation = (AnimationComponent)gameObject.getComponent("AnimationComponent");
	}

	void hit(GameObject other){
		if(bouncing){
			return;
		}

		bouncing = true;
		original = gameObject.position.y;
		
		// TODO: tell any sprites walking on this structure to get kicked()
		for(int i = 0; i < bounds.colliders.size(); i++ ){
	      	for(String key: bounds.colliders.keySet()){
	      		GameObject go = bounds.colliders.get(key);
	      		SpriteControllerComponent sprite = (SpriteControllerComponent)go.getComponent("SpriteControllerComponent");
	      		if(sprite != null){
	      			sprite.kick();
	      		}
	      	}
	    }
	}

	void update(float dt){
		if(bouncing == true){
			y += dt * 15.0;

			if(animation != null){
				// TODO: fix
				float ytemp = (15 * sin(y));
				animation.setPosition(0, ytemp);
			}
		}
		if(y >= PI){
			y = 0;
			bouncing = false;
			animation.setPosition(0, 0);
		}
	}
}

//////////////////////////
// BoundingBoxXComponent
//////////////////////////
class BoundingBoxXComponent extends BoundingBoxComponent {

  BoundingBoxXComponent() {
    super();
    componentName = "BoundingBoxComponent";
  }

  void onCollision(GameObject other) {
  }

  void onCollisionExit(GameObject other) {
    super.onCollisionExit(other);
  }
  
  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);
  
    // ENEMY
    if (other.hasTag("enemy")) {
      MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");
      SpriteControllerComponent sprite = (SpriteControllerComponent)other.getComponent("SpriteControllerComponent");

      // TODO: fix
      if(mario.isInvinsible()){
        sprite.kick();
        return;
      }

      //
      if(sprite.isAlive()){
        mario.hurt();
      }
    }
    
    // COIN
    if(other.name == "coin"){
      soundManager.playSound("coin_pickup");
      other.slateForRemoval();
    }

    // STRUCTURE
    else if(other.hasTag("structure")){
      // BoundingBoxX -> controller.hitStructureSide(gameObject)
      // Controller ->  tell physics to stop moving x
      //                tell animation to stop?
      //                don't need to tell structure to do anything....
    }
  }
}
//////////////////////////
// BoundingBoxYComponent
//////////////////////////
class BoundingBoxYComponent extends BoundingBoxComponent {

  BoundingBoxYComponent() {
    super();
    componentName = "BoundingBoxComponent";
  }

  void onCollision(GameObject other) {
    super.onCollision(other);
  }

  void onCollisionExit(GameObject other) {
    super.onCollisionExit(other);
    dprintln("OnCollisionExit() [" + other.id + ", " +  gameObject.id + "]");

    if (colliders.isEmpty()) {
      MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");
      if(mario.getJumpState() == false){
        mario.fall();
      }
    }
  }
  
  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);
    dprintln("OnCollisionEnter() [" + other.id + ", " +  gameObject.id + "]");

    if(other.name == "coin"){
      soundManager.playSound("coin_pickup");
      other.slateForRemoval();
    }

    MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");

    // If the Y bounding box hits an enemy, it either fell on 
    // the player or the player jumped on it.
    if (other.hasTag("enemy")) {
      SpriteControllerComponent sprite = (SpriteControllerComponent)other.getComponent("SpriteControllerComponent");

      if(mario.isInvinsible()){
        sprite.kick();
        return;
      }

      // Player jumped on enemy
      if(gameObject.position.y > other.position.y){
        if(sprite.doesHurtPlayerOnSquash()){
          mario.hurt();
        }
        else{
          sprite.squash();
          mario.jumpOffEnemy();
        }
      }
      // enemy fell on the player
      else{
        mario.hurt();
      }
    }

    // STRUCTURE
    else if(other.hasTag("structure")){
      mario.hitStructureY(other);

      PhysicsComponent phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");

       // LANDING but only if player was actually in the air
      if (gameObject.position.y > other.position.y && phy.isTouchingFloor() == false ) {
        dprintln("BBY - Landing");

        phy.landed();

        phy.setGroundY(other.position.y);
        phy.setTouchingFloor(true);

        mario._isJumping = false;
      }
    }
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

      if(bb0 == null || bb1 == null){
        continue;
      }

      if (testCollisionWithTouch(bb0, bb1) == false) {
        bb0.onCollisionExit(pair[1]);
        bb1.onCollisionExit(pair[0]);
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

        // turn to iterator
        ArrayList<Component> bbList1 = obj1.getComponentList("BoundingBoxComponent");
        ArrayList<Component> bbList2 = obj2.getComponentList("BoundingBoxComponent");

        if(bbList1 == null || bbList2 == null){
          continue;
        }

        for(int bbList1Index = 0; bbList1Index < bbList1.size(); bbList1Index++){
          BoundingBoxComponent bb1 = (BoundingBoxComponent)bbList1.get(bbList1Index);
   
          for(int bbList2Index = 0; bbList2Index < bbList2.size(); bbList2Index++){
            BoundingBoxComponent bb2 = (BoundingBoxComponent)bbList2.get(bbList2Index);

            if(bb1 == null || bb2 == null){
              continue;
            }

            // Check the masks
            if ((bb1.type & bb2.mask) == 0) {
              numCollisionTestsSkipped++;
              continue;
            }

            numCollisionTests++;
            if (testCollisionWithTouch(bb1, bb2)) {

              String hash = hashObjectPair(obj1, obj2);

              // First time these two are colliding
              if (collisions.containsKey(hash) == false) {
                bb1.onCollisionEnter(obj2);
                bb2.onCollisionEnter(obj1);
                
                collisions.put(hash, new GameObject[] { 
                  obj1, obj2
                }
                );
              }
              else {
                bb1.onCollision(obj2);
                bb2.onCollision(obj1);
              }
            }
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

/////////////////////////////
// CreatureBoundingBoxComponent
/////////////////////////////
class CreatureBoundingBoxComponent extends BoundingBoxComponent {

  public boolean _fallsOffLedge;
  PhysicsComponent phy;

  CreatureBoundingBoxComponent() {
    super();
    componentName = "BoundingBoxComponent";
    _fallsOffLedge = false;
  }

  void awake() {
    super.awake();
    phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
  }

  void onCollision(GameObject other) {
  }

  void onCollisionExit(GameObject other) {
    super.onCollisionExit(other);

    // if we are no longer colliding with anything, then fall
    if (colliders.isEmpty()) {
      phy.setGroundY(TILE_SIZE);
      phy.setTouchingFloor(false);
    }
  }

  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);

    if(other.hasTag("player")) {
      SpriteControllerComponent sprite = (SpriteControllerComponent)gameObject.getComponent("SpriteControllerComponent");
      MarioControllerComponent mario = (MarioControllerComponent)other.getComponent("MarioControllerComponent");
      // do what here? logic is already used for BoundingBoxYComponent/BoundingBoxXComponent
    }

    //
    if (other.position.y + TILE_SIZE >= gameObject.position.y && phy.isTouchingFloor() == false ) {
      phy.setGroundY(other.position.y);
      phy.setTouchingFloor(true);
    }

    // If hit side of something, reversedirection
    // If hit the top of something, land()
  }

  boolean doesFallsOffLedge() {
    return _fallsOffLedge;
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
///////////////
// GameObject
///////////////
class GameObject {
  PVector position;
  String name;
  ArrayList<String> tags;
  HashMap<String, ArrayList<Component> > components;
  boolean requiresRemoval;
  int id;

  GameObject() {
    position = new PVector();
    name = "";
    components = new HashMap<String, ArrayList<Component>>();
    tags = new ArrayList<String>();
    requiresRemoval = false;
    id = Utils.getNextID();
  }

  void addComponent(Component component) {
    component.setGameObject(this);

    ArrayList<Component> list = components.get(component.getComponentName());
    if(list == null){
      list = new ArrayList<Component>();
      list.add(component);
      components.put(component.getComponentName(), list);
    }
    else{
      list.add(component);
    }
  }

  /*
    legacy
  */
  Component getComponent(String s) {
    ArrayList<Component> c = components.get(s);
    if(c != null){
      return c.get(0);  
    }
    return null;
  }

  ArrayList<Component> getComponentList(String s) {
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

  void removeComponent(String key) {
    components.remove(key);
  }
  
  void awake() {
    Component c;
    for (String key : components.keySet()) {
      ArrayList<Component> list = components.get(key);
      for(int i = 0; i < list.size(); i++){
        list.get(i).awake();  
      }
    }
  }

  void update(float dt) {
    Component c;
    ArrayList <Component> list;
    for (String key : components.keySet()) {
      list = components.get(key);
      if(list != null){
        for(int i = 0; i < list.size(); ++i){
          if(list.get(i).isEnabled()){
            list.get(i).update(dt);
          }
        }
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
    ArrayList <Component> list;
    for (String key : components.keySet()) {
      list = components.get(key);
      if(list != null){
        for(int i = 0; i < list.size(); ++i){
          if(list.get(i).isEnabled()){
            list.get(i).render();
          }
        }
      }
    }
  }

  void slateForRemoval() {
    requiresRemoval = true;
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
      player.addTag("player");

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

      BoundingBoxYComponent yBoundingBox = new BoundingBoxYComponent();
      yBoundingBox.w = TILE_SIZE - TILE_SIZE/2;
      yBoundingBox.h = TILE_SIZE;
      yBoundingBox.setOffsets(8, 0);

      BoundingBoxXComponent xBoundingBox = new BoundingBoxXComponent();
      xBoundingBox.w = TILE_SIZE;
      xBoundingBox.h = TILE_SIZE - TILE_SIZE/2;
      xBoundingBox.setOffsets(0, - 8);

      yBoundingBox.mask = CollisionManager.PICKUP | 
                          CollisionManager.STRUCTURE |
                          CollisionManager.ENEMY;
      yBoundingBox.type = CollisionManager.PLAYER;

      xBoundingBox.mask = CollisionManager.PICKUP |
                          CollisionManager.STRUCTURE |
                          CollisionManager.ENEMY;
      xBoundingBox.type = CollisionManager.PLAYER;

      // 
      player.addComponent(physicsComp);
      player.addComponent(aniComp);
      //player.addComponent(collisionComp);
      
      player.addComponent(yBoundingBox);
      player.addComponent(xBoundingBox);
      
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

      BoundingBoxComponent bbComp = new BoundingBoxComponent();
      bbComp.w = 10;
      bbComp.h = 20;
      bbComp.setOffsets(11, -6);
      bbComp.mask = CollisionManager.PLAYER;
      bbComp.type = CollisionManager.PICKUP;

      coin.addComponent(aniComp);
      coin.addComponent(bbComp);

      return coin;
    }

    //
    // GROUND
    //
    else if (id == "ground") {
      GameObject ground = new GameObject();
      ground.addTag("structure");

      WrapAroundComponent c = new WrapAroundComponent();
      ground.addComponent(c);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.STRUCTURE;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;
      ground.addComponent(boxComp);

      AnimationClip idleClip = new AnimationClip();
      idleClip.addFrame("props/structure/ground.png");
      AnimationComponent animation = new AnimationComponent();
      animation.addClip("idle", idleClip);
      animation.play("idle");
      ground.addComponent(animation);

      BrickControllerComponent controller = new BrickControllerComponent();
      ground.addComponent(controller);

      return ground;
    }

    //
    // CLOUD
    //
    else if (id == "cloud") {
      GameObject cloud = new GameObject();
      
      WrapAroundComponent wrapAround = new WrapAroundComponent();
      wrapAround.extraBuffer = TILE_SIZE * 9;
      cloud.position.y = height - TILE_SIZE;
      cloud.addComponent(wrapAround);

      AnimationClip idleClip = new AnimationClip();
      idleClip.addFrame("props/clouds/cloud1.png");
      AnimationComponent animation = new AnimationComponent();
      animation.addClip("idle", idleClip);
      animation.play("idle");
      cloud.addComponent(animation);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE * 2;
      boxComp.h = TILE_SIZE * 2;
      cloud.addComponent(boxComp);

      return cloud;
    }

    //
    // BRICK
    //
    else if ( id == "brick") {
      GameObject brick = new GameObject();
      brick.addTag("structure");

      WrapAroundComponent wrapAround = new WrapAroundComponent();
      brick.addComponent(wrapAround);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.STRUCTURE;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;
      brick.addComponent(boxComp);

      AnimationClip idleClip = new AnimationClip();
      idleClip.addFrame("props/structure/bricks.png");
      AnimationComponent animation = new AnimationComponent();
      animation.addClip("idle", idleClip);
      animation.play("idle");
      brick.addComponent(animation);

      BrickControllerComponent controller = new BrickControllerComponent();
      brick.addComponent(controller);

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

      GoombaControllerComponent controllerComp = new GoombaControllerComponent();
      goomba.addComponent(controllerComp);

      PatrolEnemyPhysicsComponent physics = new PatrolEnemyPhysicsComponent();
      //physics.setMaxXSpeed(32);
      //physics.setVelocity(-32, 0);
      physics.setGravity(0, -100);
      goomba.addComponent(physics);

      //SpriteControllerComponent sprite = new SpriteControllerComponent();
      // set properties....
      // ....
      // ....
      //goomba.addComponent(sprite);
      
      /*PatrolEnemyPhysicsComponent physics = new PatrolEnemyPhysicsComponent();
       physics.setMaxXSpeed(32);
       physics.setVelocity(32, 0);
       goomba.addComponent(physics);*/

      CreatureBoundingBoxComponent boxComp = new CreatureBoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.ENEMY;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY | CollisionManager.STRUCTURE;
      goomba.addComponent(boxComp);

      return goomba;
    }

    else if(id == "coinbox"){
      GameObject coinBox = new GameObject();
      coinBox.addTag("coinbox");

      AnimationComponent aniComp = new AnimationComponent();
      coinBox.addComponent(aniComp);

      AnimationClip dead = new AnimationClip();
      dead.addFrame("props/coinbox/dead.png");

      AnimationClip idle = new AnimationClip();
      idle.addFrame("props/coinbox/idle1.png");
      idle.addFrame("props/coinbox/idle2.png");
      idle.addFrame("props/coinbox/idle3.png");

      /*CoinBoxBoundingBoxComponent boxComp = new CoinBoxBoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;
      boxComp.type = CollisionManager.STRUCTURE;
      boxComp.addComponent(boxComp);

      CoinBoxControllerComponent controller = new CoinBoxControllerComponent();
      controller.setNumCoins(10);*/
      // Add list?

      return coinBox;
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

      CreatureBoundingBoxComponent boxComp = new CreatureBoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.ENEMY;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY | CollisionManager.STRUCTURE;
      spiney.addComponent(boxComp);

      SpriteControllerComponent sprite = new SpriteControllerComponent();
      sprite.setSquashable(false);
      sprite.setDoesHurtPlayerOnSquash(true);
      spiney.addComponent(sprite);

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
//////////////////////////////
// GoombaControllerComponent
//////////////////////////////
class GoombaControllerComponent extends SpriteControllerComponent {

  AnimationComponent animationComponent;
  Timer deathTimer;

  GoombaControllerComponent() {
    // TODO: fix
    super();
    componentName = "SpriteControllerComponent";
    deathTimer = null;
  }

  void awake() {
    super.awake();
    animationComponent = (AnimationComponent)gameObject.getComponent("AnimationComponent");
  }

  void kick(){
    super.kick();
  }

  void squash() {
    animationComponent.play("squashed");
    deathTimer = new Timer();
    alive = false;

    PhysicsComponent physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    physics.stop();

    //gameObject.velocity.set(0,0);
    //gameObject.removeComponent("PhysicsComponent");
    //gameObject.removeComponent("BoundingBoxComponent");
  }

  void update(float dt) {
    super.update(dt);
    if(deathTimer != null){
      deathTimer.tick();
      if(deathTimer.getTotalTime() > 0.5){
        gameObject.slateForRemoval();
      }
    }
  }

  void render() {
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

//////////////////////////
// MarioControllerComponent
//////////////////////////
class MarioControllerComponent extends Component {

  final float walkForce = 20; //550
  final float jumpForce = 650; //350
  //BoundingBoxComponent boundingBox;

  PhysicsComponent physics;
  AnimationComponent animation;

  boolean canWalk;

  boolean _isJumping;
  boolean _isIdle;
  boolean isRunning;
  boolean _isInvinsible;

  MarioControllerComponent() {
    super();
    componentName = "MarioControllerComponent";
    _isJumping = false;
    _isIdle = true;
    isRunning = false;
    _isInvinsible = false;
  }

  void awake() {
    super.awake();
    animation = (AnimationComponent)gameObject.getComponent("AnimationComponent");
    physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    if(physics != null){
      physics.setHasFriction(true);
    }
  }

  void update(float dt) {
    // TODO: fix
    super.update(dt);

    _isInvinsible = Keyboard.isKeyDown(KEY_I);

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

    //if (gameObject.position.y >= height) {
      //_isJumping = false;
    //}

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
    // If the player is told to jump but they already are touching
    // a structure at the top, ignore the call.
    BoundingBoxComponent boundingBox = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
    HashMap<String, GameObject> colliders = boundingBox.colliders;
    for(String key : colliders.keySet()){
      GameObject go = colliders.get(key);
      BoundingBoxComponent bb = (BoundingBoxComponent)go.getComponent("BoundingBoxComponent");
      if(bb.y > boundingBox.y){

        StructureControllerComponent controller = (StructureControllerComponent)go.getComponent("StructureControllerComponent");
        if(controller != null){
          controller.hit(gameObject);

          soundManager.playSound("jump");
          animation.play("jump");
        }
        return;
      }
    }

    if(canJump() == false){
      println("MCC - canJump() returns false");
    }

    // Add check for when touching top of structure
    if (canJump() && _isJumping == false) {
      dprintln("MCC - jump()");

      physics.setTouchingFloor(false);
      physics.applyJumpForce(jumpForce);
      soundManager.playSound("jump");
      animation.play("jump");
      _isJumping = true;

      // assume we'll land on the floor.
      // PhysicsComponent phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
      // physics.setGroundY(32);
    }
  }

  void jumpOffEnemy(){
    physics.applyForce(0, jumpForce);
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

  boolean isInvinsible(){
    return _isInvinsible;
  }

  void hurt(){
    if(_isInvinsible){

    }
    else{
      scene.load();
    }
  }

  void fall(){
    dprintln("MCC - fall()");

    PhysicsComponent phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");

    phy.setGroundY(TILE_SIZE);
    phy.setTouchingFloor(false);
    phy.velocity.y = 0;

    animation.play("jump");
  }

  void hitStructureY(GameObject structure){
    // LANDED ON TOP
    if(gameObject.position.y > structure.position.y){
      dprintln("Landed on top");
      _isJumping = false;
    }
    // PUNCHED
    else{
      if(getJumpState()){
        dprintln("Punched strucure");
        physics.setVelocityY(0);

        StructureControllerComponent controller = (StructureControllerComponent)structure.getComponent("StructureControllerComponent");
        controller.hit(gameObject);
      }
    }
  }

  boolean getJumpState(){
    return _isJumping;
  }

  // player can only jump if they are touching the floor.
  // TODO: later add if touching platform
  boolean canJump() {
    return physics.isTouchingFloor();
  }
}
////////////////////////////////
// PatrolEnemyPhysicsComponent
////////////////////////////////
class PatrolEnemyPhysicsComponent extends PhysicsComponent {

  PatrolEnemyPhysicsComponent() {
    super();
    componentName = "PhysicsComponent";

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
    gravity = new PVector(0, -1500);

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
    // TODO: fix cast
    boundingBox = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");

    if (boundingBox == null) {
      println("Could not find boundingBox component");
    }
    landed();
  }

  boolean isTouchingFloor() {
    return _isTouchingFloor;
  }

  void setTouchingFloor(boolean b) {
    _isTouchingFloor = b;
  }

  void setGravity(float x, float y) {
    gravity.x = x;
    gravity.y = y;
  }

  void update(float dt) {

    // if the player is in the air, we apply gravity
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
    
    // TODO: FIX. Don't call getComponent per update()
    boundingBox = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
    if(boundingBox != null){

      // 
      if (isTouchingFloor() == false && position.y - boundingBox.h <= groundY) {
        /*
        position.y = groundY + boundingBox.h;
        _isTouchingFloor = true;
        velocity.y = 0;        
        MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");
        mario._isJumping = false;
        */
      }
      else if (isTouchingFloor()) {
        position.y = groundY + boundingBox.h;
      }
    }
    gameObject.position.set(position.x, position.y);
  }

  void setGroundY(float y) {
    groundY = y;
  }

  void landed(){
    dprintln("PCC - landed()");
    position.y = groundY + boundingBox.h;
    _isTouchingFloor = true;
    velocity.y = 0;
  }

  void setVelocityY(float y){
    velocity.y = y;
  }

  void setVelocityX(float x){
    velocity.x = x;
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

  void checkIfGrounded() {
    if (acceleration.y != 0) {
      _isTouchingFloor = false;
    }
  }

  void applyForce(PVector force) {
    applyForce(force.x, force.y);
  }

  void applyJumpForce(float y) {
    velocity.y = 0;
    applyForce(0, y);
  }

  void applyForce(float x, float y) {
    acceleration.x += x;
    acceleration.y += y;
    checkIfGrounded();
  }

  PVector getVelocity() {
    return velocity;
  }

  void setVelocity(float x, float y) {
    velocity.x = x;
    velocity.y = y;
  }

  void stop(){
    velocity.set(0,0);
    acceleration.set(0,0);
  }

  boolean isAtRest() {
    return velocity.x == 0 && position.y == groundY;
    //return velocity.x == 0 && velocity.y == 0;
  }

  void setHasFriction(boolean b) {
    hasFriction = b;
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
    gameObjects.add(player);
    gameObjects.add(gameCamera);

    // TODO fix: hack to render goomba behind mario
    // after squash.
    generateGroundTiles();
    
    generateCoins();
    //generateBrickTiles(5);
    //generateBrickTiles(6);
    generateStaircase();
    generateGoombas();
    
    generateSpineys();
    generateClouds();
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

    debug.addString("Dimensions: [" + width + "," + height + "]");
    debug.addString("FPS: " + int(frameRate));
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

    debug.addString("Render time: " + renderTimer.getTotalTime());

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
      goomba.position = new PVector(96 + i * (TILE_SIZE*10), 164 + i * (TILE_SIZE*10));
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
      collisionManager.add(ground);
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

    for(int i = 0; i < 10; i++){
      GameObject brick1 = gameObjectFactory.create("brick");
      brick1.setPosition(i *TILE_SIZE, TILE_SIZE * 4);
      gameObjects.add(brick1);
      collisionManager.add(brick1);
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
/////////////////////////////
// SpriteControllerComponent
/////////////////////////////
class SpriteControllerComponent extends Component {

  // SpriteController component manages behvaviour of sprites

  boolean alive;
  boolean squashable;
  boolean hurtsPlayerOnSquash;

  SpriteControllerComponent() {
    super();
    componentName = "SpriteControllerComponent";
    alive = true;
    squashable = true;
    hurtsPlayerOnSquash = false;
  }

  boolean isFalling() {
    // do stuff here
    return false;
  }

  boolean canBeSquashed() {
    return squashable;
  }

  // TODO: fix
  // they can be hurt in different ways..
  void hurt() {
  }

  void update(float dt){
    // TODO: fix
    if(gameObject.position.y < -500){
      gameObject.slateForRemoval();
    }
  }

  // 
  void squash() {
    // TODO: remove??
    if(squashable) {
      alive = false;
      gameObject.slateForRemoval();
    }
  }

  void bump() {
  }

  void walk() {
  }

  void kick() {
    //BoundingBoxComponent bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
    //gameObject.removeComponent("BoundingBoxComponent");
    
    PhysicsComponent physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    if(physics != null){
      //physics.setHasFriction(true);//?
      physics.setGroundY(-600);
      //physics.setGravity(0, -150);
      physics.applyForce(0, 10);
      physics.setTouchingFloor(false);
      // disconnect?

      // 1) invalidate object?
      // 2) disable object?
      // 3) update components to tell them which ones are valid?
      // 4) nullify objects?
      // 5) make component get component continusouly.?
      // ????
      gameObject.removeComponent("BoundingBoxComponent");
  
      alive = false;
      // It would look strange if the animation kept playing, so pause it.
      AnimationComponent ani = (AnimationComponent)gameObject.getComponent("AnimationComponent");
      ani.pause();
      ani.setFlipY(true);
    }
  }

  boolean doesHurtPlayerOnSquash(){
    return hurtsPlayerOnSquash;
  }

  void setDoesHurtPlayerOnSquash(boolean b){
    hurtsPlayerOnSquash = b;
  }

  void setSquashable(boolean b){
    squashable = b;
  }

  // If hit by invinsible mario, sprites are immediately killed
  void kill() {
    kick();
  }

  boolean isAlive(){
    return alive;
  }
}
/////////////////////////////////
// StructureControllerComponent
/////////////////////////////////
class StructureControllerComponent extends Component {

  StructureControllerComponent() {
    super();
    componentName = "StructureControllerComponent";
  }

  void awake() {
    super.awake();
  }

  void update(float dt) {
    super.update(dt);
  }

  void render() {
  }

  void hit(GameObject other){
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
boolean debugPrint = false;

String PVectorToString(PVector vec) {
  return "" + vec.x + ", " + vec.y;
}

// ArtManager needs this in order to determine which
// parser to use.
String getFileExtension(String path) {
  String[] tokens = split(path, '.');
  return tokens[tokens.length - 1];
}

void dprintln(String s){
  if(debugPrint){
    println(s);
  }
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

  PVector position;
  float extraBuffer;
  BoundingBoxComponent bounds;

  WrapAroundComponent() {
    super();
    componentName = "WrapAroundComponent";
    position = new PVector();
    extraBuffer = 0;
  }

  void awake() {
    super.awake();
    bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
  }

  void update(float dt) {
    PVector camPos = scene.getCamPos();

    scene.getActiveCamera();
    PVector dir = scene.getActiveCamera().getVelocity();

    if (dir.x > 0 && gameObject.position.x + bounds.w < camPos.x) {
      gameObject.position.x += width + bounds.w + extraBuffer;
    }
    // player walks left
    else if (dir.x < 0 && gameObject.position.x > camPos.x + width) {
      gameObject.position.x -= width + bounds.w + extraBuffer;
    }
  }
}

