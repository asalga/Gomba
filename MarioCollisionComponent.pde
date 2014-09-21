////////////////////////////
// MarioCollisionComponent
////////////////////////////
class MarioCollisionComponent extends CollisionComponent {

  MarioCollisionComponent() {
    super();
    componentName = "CollisionComponent";
  }

  void onCollision(GameObject other) {
    // For right now, just reload the scene
    if (other.hasTag("enemy")) {
      scene.load();
    }
  }

  void onCollisionExit(GameObject other) {
  }
  void onCollisionEnter(GameObject other) {
  }
}

