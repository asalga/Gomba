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

  BinaryTree<RenderOrder, RenderLayer> renderLayers;

  void load() {
    isPaused = false;
    gameObjects = new ArrayList<GameObject>();

    timer = new Timer();
    gameObjectFactory = new GameObjectFactory();
    player = gameObjectFactory.create("player");
    
    player.position.set(TILE_SIZE, TILE_SIZE * 4);
    // fix tunnelling
    //player.position.set(TILE_SIZE, height);

    collisionManager = new CollisionManager();

    collisionsEnabled = true;

    renderLayers = new BinaryTree<RenderOrder, RenderLayer>();

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
    
    generateCoins();

    generateClouds();
    generateGroundTiles();
    
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
    int layerIndex = gameObject.renderLayer;

    // if tree is empty, add a 0 layer
    if(renderLayers.isEmpty()){      
      RenderLayer layer = new RenderLayer(layerIndex);
      renderLayers.put(new RenderOrder(layerIndex), layer);
      layer.add(gameObject);
    }
    else{
      RenderLayer layer = renderLayers.get(new RenderOrder(layerIndex));
      
      if(layer == null){
        layer = new RenderLayer(layerIndex);
        RenderOrder renderOrder = new RenderOrder(layerIndex);
        renderLayers.put(renderOrder, layer);
      }
      layer.add(gameObject);  
    }
    
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
    
    // 
    Iterator<RenderLayer> iter = renderLayers.iterator();
    while(iter.hasNext()){
      RenderLayer layer = (RenderLayer)iter.next();  

      ArrayList<GameObject> gameObjects = layer.getList();
      for(int i = gameObjects.size()-1; i >= 0; i--){
        if(gameObjects.get(i).requiresRemoval){
          gameObjects.remove(i);
        }
      }
      layer.render();
    }

    // Move any gameobjects between layers if necessary
    iter = renderLayers.iterator();
    while(iter.hasNext()){
      RenderLayer layer = (RenderLayer)iter.next();
      int layerIndex = layer.getIndex();

      // if layerIndex does not match the gameObjects layer.
      // get the layer and add the gameobject to it, then remove it from this layer
      ArrayList<GameObject> layeredGameObjects = layer.getList();
      for(int i = layeredGameObjects.size() - 1; i >= 0; i--){
        int goLayer = layeredGameObjects.get(i).renderLayer;

        if(layeredGameObjects.get(i).renderLayer != layerIndex){
          RenderLayer properLayer = renderLayers.get(new RenderOrder(goLayer));
          
          if(properLayer == null){
            properLayer = new RenderLayer(goLayer);
            renderLayers.put(new RenderOrder(goLayer), properLayer);
          }

          properLayer.getList().add(layeredGameObjects.get(i));
          layeredGameObjects.remove(i);
        }
      }
    }

    // Find any objects that need to be removed from the scene
    for (int i = gameObjects.size()-1; i >= 0; i--) {
      if (gameObjects.get(i).requiresRemoval) {
        gameObjects.remove(i);
      }
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
    
    Iterator<RenderLayer> iter = renderLayers.iterator();
    while(iter.hasNext()){
      RenderLayer layer = (RenderLayer)iter.next();
      layer.render();
    }

    camComp.postRender();
    renderTimer.tick();

    debug.addString("Render time: " + renderTimer.getTotalTime());
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
          coin.position = new PVector( (TILE_SIZE * 8) + (numGroups*25*TILE_SIZE) + x * TILE_SIZE, 
                                        TILE_SIZE + y * TILE_SIZE);
          addGameObject(coin);
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
      brick.setPosition(i * TILE_SIZE + TILE_SIZE * 3, TILE_SIZE * 4);
      addGameObject(brick);
      collisionManager.add(brick);
    }
  }

  void generateCoinBox(){
    GameObject coinBox;
    coinBox = gameObjectFactory.create("coinbox");
    coinBox.setPosition(TILE_SIZE * 6, TILE_SIZE * 4);
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
