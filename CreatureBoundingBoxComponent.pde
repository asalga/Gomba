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
