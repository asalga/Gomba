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

