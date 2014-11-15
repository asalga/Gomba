/////////////////////
// PhysicsComponent
/////////////////////
class PhysicsComponent extends Component {

  final int GRAVITY_Y = -1500;

  // Properties?
  PVector gravity;
  PVector position;
  PVector velocity;
  PVector acceleration;
  PVector drag;

  float maxXSpeed;
  float mass;
  //

  // Purpose of this components is to take care of low-level physics things.

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
    gravity = new PVector(0, GRAVITY_Y);

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

    boundingBox = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");

    if (boundingBox == null) {
      println("Could not find boundingBox component");
    }
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

    position.x = gameObject.position.x;
    position.y = gameObject.position.y;

    // if the player is in the air, we apply gravity
    if (isTouchingFloor() == false) {
      velocity.y += gravity.y * dt;
    }

    velocity.add(acceleration);

    // max running speed
    if (velocity.x > maxXSpeed) {
      velocity.x = maxXSpeed;
    }
    else if(velocity.x < -maxXSpeed) {
      velocity.x = -maxXSpeed;
    }

    // TODO: fix
    // Only apply drag if touching floor
    if (hasFriction) {
      if (isTouchingFloor()) {

        drag.set(-velocity.x*0.11, 0);      //applyForce(drag);
        velocity.x += drag.x;
      }
      else {
        drag.set(-velocity.x*0.005, 0);      //applyForce(drag);
        velocity.x += drag.x;
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

