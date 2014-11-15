////////////////////////////////
// PatrolEnemyPhysicsComponent
////////////////////////////////
class PatrolEnemyPhysicsComponent extends PhysicsComponent {

  // Properties
  // TODO: implement
  public float pixelsPerSecond;
  //

  PatrolEnemyPhysicsComponent() {
    super();
    componentName = "PhysicsComponent";

    setVelocity(-32, 0);
    setMaxXSpeed(32);
    setHasFriction(false);
  }

  void awake() {
    super.awake();
    position = new PVector(gameObject.position.x, gameObject.position.y);
  }

  void update(float dt) {
    super.update(dt);
  }

  void render() {
  }
}

