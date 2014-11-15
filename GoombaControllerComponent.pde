//////////////////////////////
// GoombaControllerComponent
//////////////////////////////
class GoombaControllerComponent extends SpriteControllerComponent {

  // Properties
  public float delayBeforeRemoval;
  //

  BoundingBoxComponent boundsComponent;
  AnimationComponent animationComponent;
  Timer deathTimer;

  GoombaControllerComponent() {
    super();
    // TODO: fix
    componentName = "SpriteControllerComponent";
    deathTimer = null;
    delayBeforeRemoval = 0;
  }

  void awake() {
    super.awake();
    animationComponent = (AnimationComponent)gameObject.getComponent("AnimationComponent");
    boundsComponent = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
  }

  void kick(){
    super.kick();
  }

  void squash() {
    animationComponent.play("squashed");
    deathTimer = new Timer();
    alive = false;

    soundManager.playSound("smb_stomp");

    PhysicsComponent physics = (PhysicsComponent)gameObject.getComponent("PhysicsComponent");
    physics.stop();

    boundsComponent.setEnableCollisions(false);
  }

  void update(float dt) {
    super.update(dt);
    if(deathTimer != null){
      deathTimer.tick();
      if(deathTimer.getTotalTime() >= delayBeforeRemoval){
        gameObject.slateForRemoval();
      }
    }
  }

  void render() {
    super.render();
  }
}
