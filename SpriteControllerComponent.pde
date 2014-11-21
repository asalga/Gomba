/////////////////////////////
// SpriteControllerComponent
/////////////////////////////
class SpriteControllerComponent extends Component {

  // SpriteController component manages behvaviour of sprites

  // Properties
  boolean squashable;
  boolean hurtsPlayerOnSquash;
  //

  boolean alive;
  boolean wasKicked;

  SpriteControllerComponent() {
    super();
    componentName = "SpriteControllerComponent";
    alive = true;
    wasKicked = false;

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
    // TODO: remove??
    if(squashable) {
      alive = false;
      gameObject.slateForRemoval();
    }
  }

  void bump() {
  }

  void walk() {
  }

  void kick() {
    
    if(wasKicked == false){
      wasKicked = true;


      // TODO: comment
      BoundingBoxComponent bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
      bounds.setEnableCollisions(false);
      
      PhysicsComponent physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
      if(physics != null){
        
        physics.setGroundY(0);
        physics.setGravity(0, -200);
        physics.applyForce(0, 450);
        physics.setTouchingFloor(false);
        
        soundManager.playSound("smb_stomp");

        gameObject.renderLayer = 15;

        /*
        // disconnect?
        // 1) invalidate object?
        // 2) disable object?
        // 3) update components to tell them which ones are valid?
        // 4) nullify objects?
        // 5) make component get component continusouly.?
        //gameObject.removeComponent("BoundingBoxComponent");
    
        alive = false;*/
        
        // It would look strange if the animation kept playing, so pause it.
        AnimationComponent ani = (AnimationComponent)gameObject.getComponent("AnimationComponent");
        ani.pause();
        ani.setFlipY(true);
      }
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

  boolean isAlive(){
    return alive;
  }

  void render(){
    PhysicsComponent physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    if(physics != null && debugPrint == true){
      text(""+ physics._isTouchingFloor, gameObject.position.x, -gameObject.position.y);
    }
  }
}
