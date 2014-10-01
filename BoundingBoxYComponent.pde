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

    SpriteControllerComponent sprite = (SpriteControllerComponent)other.getComponent("SpriteControllerComponent");
    MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");

    // If the Y bounding box hits an enemy, it either fell on 
    // the player or the player jumped on it.
    if (other.hasTag("enemy")) {

      if(mario.isInvinsible()){
        sprite.kick();
        return;
      }

      // Player jumped on enemy
      if(gameObject.position.y > other.position.y){
        if(sprite.doesHurtPlayerOnSquash()){
          mario.hurt();
        }
        else{
          mario.jumpOffEnemy();
        }
      }
      // enemy fell on the player
      else{
        mario.hurt();
      }
    }
  }
}
