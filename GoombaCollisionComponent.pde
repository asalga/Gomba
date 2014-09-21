////////////////////////////
// GoombaCollisionComponent
////////////////////////////
class GoombaCollisionComponent extends CollisionComponent {

  GoombaCollisionComponent() {
    // TODO: fix
    super();
    componentName = "CollisionComponent";
  }

  void onCollision(GameObject other) {
    if (other.name == "mario" ||  other.name == "player") {
      //EnemyControllerComponent e = (EnemyControllerComponent)gameObject.findComponent("EnemyControllerComponent");
      //GoombaControllerComponent s = (GoombaControllerComponent)gameObject.findComponent("SpriteControllerComponent");
      //e.squash();
    }
  }

  void onCollisionExit(GameObject other) {
  }
  void onCollisionEnter(GameObject other) {
  }
}

