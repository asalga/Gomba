//////////////////////////
// BoundingBoxYComponent
//////////////////////////
class BoundingBoxYComponent extends BoundingBoxComponent {

  BoundingBoxYComponent() {
    super();
    componentName = "BoundingBoxComponent";
  }

  void onCollision(GameObject other) {
    super.onCollision(other);
  }

  void onCollisionExit(GameObject other) {
    super.onCollisionExit(other);

    if (colliders.isEmpty()) {
      MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");
      if(mario.getJumpState() == false){
        mario.fall();
      }
      else{
        dprintln("On Collisionexit()");
      }
    }
  }
  
  void onCollisionEnter(GameObject other) {
    super.onCollisionEnter(other);

    if(other.name == "coin"){
      soundManager.playSound("coin_pickup");
      other.slateForRemoval();
    }

    MarioControllerComponent mario = (MarioControllerComponent)gameObject.getComponent("MarioControllerComponent");

    // If the Y bounding box hits an enemy, it either fell on 
    // the player or the player jumped on it.
    if (other.hasTag("enemy")) {
      SpriteControllerComponent sprite = (SpriteControllerComponent)other.getComponent("SpriteControllerComponent");

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
          sprite.squash();
          mario.jumpOffEnemy();
        }
      }
      // enemy fell on the player
      else{
        mario.hurt();
      }
    }

    // STRUCTURE
    else if(other.hasTag("structure")){
      mario.hitStructureY(other);

      PhysicsComponent phy = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");

       // LANDING but only if player was actually in the air
      if (gameObject.position.y > other.position.y && phy.isTouchingFloor() == false ) {
        
        phy.landed();

        phy.setGroundY(other.position.y);
        phy.setTouhcingFloor(true);

        mario._isJumping = false;
      }
    }
  } 
}
