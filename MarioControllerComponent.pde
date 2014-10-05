//////////////////////////
// MarioControllerComponent
//////////////////////////
class MarioControllerComponent extends Component {

  final float walkForce = 20; //550
  final float jumpForce = 550; //350
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
      soundManager.playSound("jump");
      animation.play("jump");
      _isJumping = true;
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

  void hitStructureY(GameObject structure){
    // landed on top
    if(gameObject.position.y > structure.position.y){
      println("FIX hitStructureY()");
    }
    else{
      physics.setVelocityY(0);
      StructureControllerComponent controller = (StructureControllerComponent)structure.getComponent("StructureControllerComponent");
      controller.hit(gameObject);
    }
  }

  // player can only jump if they are touching the floor.
  // TODO: later add if touching platform
  boolean canJump() {
    return physics.isTouchingFloor();
  }
}
