///////////////////////////
// CoinCollisionComponent
///////////////////////////
class CoinCollisionComponent extends CollisionComponent {

  CoinCollisionComponent() {
    // TODO: fix
    componentName = "CollisionComponent";
  }

  void onCollision(GameObject other) {    
    if (other.name == "player") {
      //soundManager.playSound("coin_pickup");
      gameObject.slateForRemoval();
    }
  }

  void onCollisionExit(GameObject other) {
  }
  void onCollisionEnter(GameObject other) {
  }
}

