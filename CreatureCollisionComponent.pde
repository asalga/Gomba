///////////////////////////////
// CreatureCollisionComponent
///////////////////////////////
class CreatureCollisionComponent extends CollisionComponent {

  public boolean _fallsOffLedge;
  PhysicsComponent phy;

  CreatureCollisionComponent() {
    super();
    _fallsOffLedge = false;
  }

  void awake() {
    super.awake();
    phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
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

  void onCollision(GameObject other) {
  }

  boolean doesFallsOffLedge() {
    return _fallsOffLedge;
  }
}

