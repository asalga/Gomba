//////////////////////////
// BoundingBoxXComponent
//////////////////////////
class BoundingBoxXComponent extends BoundingBoxComponent {

  BoundingBoxXComponent() {
    super();
    componentName = "BoundingBoxComponent";
  }

  void onCollision(GameObject other) {
  }

  void onCollisionExit(GameObject other) {
    super.onCollisionExit(other);
  }
  
  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);
    
    if (other.hasTag("enemy")) {
      scene.load();
    }
    if(other.name == "coin"){
      soundManager.playSound("coin_pickup");
      other.slateForRemoval();
    }
  }
}
