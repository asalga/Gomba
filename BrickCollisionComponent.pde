////////////////////////////
// BrickCollisionComponent
////////////////////////////
class BrickCollisionComponent extends CollisionComponent {
  boolean c;

  BrickCollisionComponent() {
    super();
    c = false;
    //componentName = "BrickCollisionComponent";
  }

  void onCollision(GameObject other) {
    super.onCollision(other);
  }

  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);		

    // Get controller
    if (other.name == "player") {
    }
  }

  void onCollisionExit(GameObject other) {
  }

  void render() {
    if (c) {
      pushStyle();
      fill(0, 255, 100, 100);
      strokeWeight(9);
      stroke(233, 0, 0, 120);
      rect(gameObject.position.x, -gameObject.position.y, TILE_SIZE, TILE_SIZE);
      popStyle();
    }
  }
}

