//////////////////////////////
// GoombaControllerComponent
//////////////////////////////
class GoombaControllerComponent extends SpriteControllerComponent {

  AnimationComponent animationComponent;
  Timer deathTimer;

  GoombaControllerComponent() {
    // TODO: fix
    super();
    componentName = "SpriteControllerComponent";
    deathTimer = null;
  }

  void awake() {
    super.awake();
    animationComponent = (AnimationComponent)gameObject.getComponent("AnimationComponent");
  }

  void kick(){
    //BoundingBoxComponent bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
    //gameObject.removeComponent("BoundingBoxComponent");
    
    PhysicsComponent physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    if(physics != null){
      physics.setHasFriction(true);
      physics.applyForce(10, 150);
      physics.setGravity(0, -500);
      physics.setTouhcingFloor(false);

      // 1) invalidate object?
      // 2) disable object?
      // 3) update components to tell them which ones are valid?
      // 4) nullify objects?
      // 5) make component get component continusouly.?
      // ????
      gameObject.removeComponent("BoundingBoxComponent");

      AnimationComponent ani = (AnimationComponent)gameObject.getComponent("AnimationComponent");
      ani.setFlipY(true);
    }
  }

  void squash() {
    animationComponent.play("squashed");
    deathTimer = new Timer();
    isAlive = false;

    PhysicsComponent physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    physics.stop();

    //gameObject.velocity.set(0,0);
    //gameObject.removeComponent("PhysicsComponent");
    //gameObject.removeComponent("BoundingBoxComponent");
  }

  void update(float dt) {
    super.update(dt);
    if(deathTimer != null){
      deathTimer.tick();
      if(deathTimer.getTotalTime() > 0.5){
        gameObject.slateForRemoval();
      }
    }
  }

  void render() {
  }
}
