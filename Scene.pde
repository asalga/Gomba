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

  RenderLayer renderLayer;

  class RenderLayer {
    int layer;
    ArrayList<GameObject> gameObjects;

    RenderLayer(int layer){
      this.layer = layer;
      gameObjects = new ArrayList<GameObject>();
    }

    void render(){
      for (int i = 0; i < gameObjects.size(); i++) {
        GameObject go = gameObjects.get(i);

        // already did camera's render in preRender
        if (go.hasTag("camera")) {
          continue;
        }

        go.render();
      }
    }

    void add(GameObject go){
      gameObjects.add(go);
    }

    void remove(GameObject go){
      gameObjects.remove(go);
    }
  }
  // End of RenderLayer


  void load() {
    isPaused = false;
    gameObjects = new ArrayList<GameObject>();

    timer = new Timer();
    gameObjectFactory = new GameObjectFactory();
    player = gameObjectFactory.create("player");
    player.position.set(TILE_SIZE * 0,  height);

    collisionManager = new CollisionManager();

    collisionsEnabled = true;

    renderLayer = new RenderLayer(0);

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
    
    addGameObject(player);
    addGameObject(gameCamera);

    // TODO fix: hack to render goomba behind mario
    // after squash.
    generateClouds();
    generateGroundTiles();
    
    generateCoins();
    //generateBrickTiles(5);
    //generateBrickTiles(6);
    generateStaircase();
    generatePlatform();
    generateCoinBox();

    generateGoombas();
    generateSpineys();
    
    awake();
  }

  Scene() {
    load();
  }

  void addGameObject(GameObject gameObject){
    renderLayer.add(gameObject);
    gameObjects.add(gameObject);
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

    debug.addString("");
    debug.addString("KEYS");
    debug.addString("--------");
    debug.addString(" D - Debugging toggle");
    debug.addString(" I - Invincibility toggle");
    debug.addString(" R - Restart scene");
    debug.addString("");

    debug.addString("Dimensions: [" + width + "," + height + "]");
    debug.addString("FPS: " + int(frameRate));
    debug.addString("collision check time: " + collisionCheckTime);

    renderTimer.reset();
    renderTimer.tick();

    camComp.preRender();
    
    // Render all the layers
    renderLayer.render();

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
        for (int y = 1; y < 2; y++) {
          GameObject coin = gameObjectFactory.create("coin");
          coin.position = new PVector((TILE_SIZE * 8) + (numGroups*25*TILE_SIZE) + x * TILE_SIZE, TILE_SIZE + y * TILE_SIZE + TILE_SIZE);
          gameObjects.add(coin);
          collisionManager.add(coin);
        }
      }
    }
  }

  void generateGoombas() {
    for (int i = 1; i < 8; i++) {
      GameObject goomba = gameObjectFactory.create("goomba");
      goomba.position = new PVector(0 + (i * TILE_SIZE) * 10, TILE_SIZE * 20);
      addGameObject(goomba);
      collisionManager.add(goomba);
    }
  }

  void generateSpineys() {
    for (int i = 0; i < 8; i++) {
      GameObject spiney = gameObjectFactory.create("spiney");
      //spiney.position = new PVector(TILE_SIZE * 10 + (i * width), height);
      spiney.position = new PVector( width + (TILE_SIZE * 3) + (i * TILE_SIZE) * 20 , TILE_SIZE * 2);
      addGameObject(spiney);
      collisionManager.add(spiney);
    }
  }

  // TODO: find where to move this....
  void generateGroundTiles() {
    // +1 so the last tile doesn't just jump into view.
    for (int x = -TILE_SIZE * 4; x < TILE_SIZE * (NUM_TILES_FOR_WIDTH + 1); x += TILE_SIZE) {
      GameObject ground = gameObjectFactory.create("ground");
      ground.setPosition(x, TILE_SIZE);
      addGameObject(ground);
      collisionManager.add(ground);
    }
  }

  void setEnableCollisions(boolean b) {
    collisionsEnabled = b;
  }

  void generateClouds() {
    GameObject cloud = gameObjectFactory.create("cloud");
    addGameObject(cloud);
  }

  void generateStaircase() {
    int x = 0;
    for (int y = 0; y < 4; y++) {
      for (x=y; x < 4; x++) {
        GameObject brick = gameObjectFactory.create("brick");
        brick.setPosition((TILE_SIZE* 6) +  x * TILE_SIZE, TILE_SIZE * y + (TILE_SIZE* 7));
        addGameObject(brick);
        collisionManager.add(brick);
      }
    }
  }

  void generatePlatform() {
    GameObject brick;
    for(int i = 0; i < 3; ++i) {
      brick = gameObjectFactory.create("brick");
      brick.setPosition(i * TILE_SIZE + TILE_SIZE * 2, TILE_SIZE * 4);
      addGameObject(brick);
      collisionManager.add(brick);
    }
  }

  void generateCoinBox(){
    GameObject coinBox;
    coinBox = gameObjectFactory.create("coinbox");
    coinBox.setPosition(TILE_SIZE * 5, TILE_SIZE * 4);
    addGameObject(coinBox);
    collisionManager.add(coinBox);
  }

  void generateBrickTiles(int y) {
    // +1 so the last tile doesn't just jump into view.
    for (int x = -TILE_SIZE; x < TILE_SIZE * (NUM_TILES_FOR_WIDTH + 1); x += TILE_SIZE) {
      GameObject brick = gameObjectFactory.create("brick");
      brick.setPosition(x, TILE_SIZE * y);
      addGameObject(brick);
      collisionManager.add(brick);
    }
  }
}
