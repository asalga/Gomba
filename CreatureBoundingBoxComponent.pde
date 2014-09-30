/////////////////////////////
// SpineyCollisionComponent
/////////////////////////////
class CreatureBoundingBoxComponent extends BoundingBoxComponent {

  // Spiney can't be squashed
  boolean killsMarioOnSquash = true;
  public boolean _fallsOffLedge;
  PhysicsComponent phy;

  CreatureBoundingBoxComponent() {
    super();
    componentName = "BoundingBoxComponent";
        //super();
    _fallsOffLedge = false;
  }

  void onCollision(GameObject other) {
    //If (mario is invinsible){
    //  kick sprite
    //}
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

    if(other.hasTag("mario")) {
      MarioControllerComponent mario = (MarioControllerComponent)other.getComponent("MarioControllerComponent");
    //  mario.hurt();

      // mario game controller 
      // if dead,
      //scene.load();
    }

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

  void awake() {
    super.awake();
    phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
  }

    boolean doesFallsOffLedge() {
    return _fallsOffLedge;
  }
}
