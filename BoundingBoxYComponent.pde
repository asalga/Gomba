//////////////////////////
// BoundingBoxYComponent
//////////////////////////
class BoundingBoxYComponent extends BoundingBoxComponent {

  BoundingBoxYComponent() {
    super();
    componentName = "BoundingBoxComponent";
  }

  void onCollision(GameObject other) {
  }

  void onCollisionExit(GameObject other) {
  }
  
  void onCollisionEnter(GameObject other) {

    if(other.name == "coin"){
      soundManager.playSound("coin_pickup");
      other.slateForRemoval();
    }

    // If the Y bounding box hits an enemy, it either fell on 
    // the player or the player jumped on it.
    if (other.hasTag("enemy")) {
      if(other.position.y < gameObject.position.y){

        // tell the sprite it got squashed

        // we 'bounce' the player off of the enemy

        // 
        SpriteControllerComponent sprite = (SpriteControllerComponent)other.getComponent("SpriteControllerComponent");
        //CreatureControllerComponent creature = (CreatureControllerComponent)other.getComponent("CreatureControllerComponent");
        sprite.squash();

        MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");
        mario.jumpOffEnemy();
      }
      // enemy fell on the player
      else{
        scene.load();
      }

    }
  }
}
