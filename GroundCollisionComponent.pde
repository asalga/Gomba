/////////////////////////////
// GroundCollisionComponent
/////////////////////////////
class GroundCollisionComponent extends CollisionComponent {
  boolean collision = false;

  GroundCollisionComponent() {
    super();
    //componentName = "BrickCollisionComponent";
  }

  void onCollision(GameObject other) {
    collision = true;
  }

  void render() {
    float x = gameObject.position.x;
    float y = gameObject.position.y;

    if (collision && debugOn) {
      pushStyle();
      strokeWeight(1);

      fill(0, 20, 150, 150);
      stroke(255, 0, 0);


      rect(x, -y, TILE_SIZE, TILE_SIZE);
      popStyle();

      collision = false;
    }
  }
  void onCollisionEnter(GameObject other) {
  }

  void onCollisionExit(GameObject other) {
  }
}

