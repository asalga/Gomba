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
  soundManager.addSound("smb_stomp", 1);
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
