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

    // Add check for when touching top of structure
    if (canJump() && _isJumping == false) {
      dprintln("jump()");

      physics.setTouchingFloor(false);
      physics.applyForce(0, jumpForce);
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
    PhysicsComponent phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    dprintln("fall()");

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
