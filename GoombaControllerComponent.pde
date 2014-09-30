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

  void squash() {
    animationComponent.play("squashed");
    deathTimer = new Timer();
    isAlive = false;
    //gameObject.velocity.set(0,0);
    gameObject.removeComponent("PhysicsComponent");
    gameObject.removeComponent("BoundingBoxComponent");
  }

  void update(float dt) {
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
