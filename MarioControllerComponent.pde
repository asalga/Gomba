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
    //position = new PVector(gameObject.position.x, gameObject.position.y);
    //32, height - 200);

    _isJumping = false;
    _isIdle = true;
    isRunning = false;
  }

  void awake() {
    super.awake();
    //position = new PVector(gameObject.position.x, gameObject.position.y);

    animation = (AnimationComponent)gameObject.getComponent("AnimationComponent");

    physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    physics.setHasFriction(true);
  }

  // 1) prevent moving mario while constantly jumping

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
      soundManager.playSound("fireball");
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

