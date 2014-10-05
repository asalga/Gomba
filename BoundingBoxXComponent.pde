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
  
    // ENEMY
    if (other.hasTag("enemy")) {
      MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");
      SpriteControllerComponent sprite = (SpriteControllerComponent)other.getComponent("SpriteControllerComponent");

      // TODO: fix
      if(mario.isInvinsible()){
        sprite.kick();
        return;
      }

      mario.hurt();
    }
    
    // COIN
    if(other.name == "coin"){
      soundManager.playSound("coin_pickup");
      other.slateForRemoval();
    }

    // STRUCTURE
    else if(other.hasTag("structure")){
      // BoundingBoxX -> controller.hitStructureSide(gameObject)
      // Controller ->  tell physics to stop moving x
      //                tell animation to stop?
      //                don't need to tell structure to do anything....
    }
  }
}
