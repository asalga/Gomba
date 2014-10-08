/////////////////////////////
// SpriteControllerComponent
/////////////////////////////
class SpriteControllerComponent extends Component {

  // SpriteController component manages behvaviour of sprites

  boolean isAlive;
  boolean squashable;
  boolean hurtsPlayerOnSquash;

  SpriteControllerComponent() {
    super();
    componentName = "SpriteControllerComponent";
    squashable = true;
    hurtsPlayerOnSquash = false;
  }

  boolean isFalling() {
    // do stuff here
    return false;
  }

  boolean canBeSquashed() {
    return squashable;
  }

  // TODO: fix
  // they can be hurt in different ways..
  void hurt() {
  }

  void update(float dt){
    // TODO: fix
    if(gameObject.position.y < -500){
      gameObject.slateForRemoval();
    }
  }

  // 
  void squash() {
   if(squashable){
      gameObject.slateForRemoval();
    }
  }

  void bump() {
  }

  void walk() {
  }

  void kick() {
    //BoundingBoxComponent bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
    //gameObject.removeComponent("BoundingBoxComponent");
    
    PhysicsComponent physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    if(physics != null){
      //physics.setHasFriction(true);//?
      physics.setGroundY(-600);
      //physics.setGravity(0, -150);
      physics.applyForce(0, 10);
      physics.setTouhcingFloor(false);
      // disconnect?

      // 1) invalidate object?
      // 2) disable object?
      // 3) update components to tell them which ones are valid?
      // 4) nullify objects?
      // 5) make component get component continusouly.?
      // ????
      gameObject.removeComponent("BoundingBoxComponent");

      // It would look strange if the animation kept playing, so pause it.
      AnimationComponent ani = (AnimationComponent)gameObject.getComponent("AnimationComponent");
      ani.pause();
      ani.setFlipY(true);
    }
  }

  boolean doesHurtPlayerOnSquash(){
    return hurtsPlayerOnSquash;
  }

  void setDoesHurtPlayerOnSquash(boolean b){
    hurtsPlayerOnSquash = b;
  }

  void setSquashable(boolean b){
    squashable = b;
  }

  // If hit by invinsible mario, sprites are immediately killed
  void kill() {
    kick();
  }
}
