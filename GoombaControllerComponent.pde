///////////////////
// GoombaControllerComponent
///////////////////
class GoombaControllerComponent extends SpriteControllerComponent {

  AnimationComponent animationComponent;

  GoombaControllerComponent() {
    // TODO: fix
    super();
    componentName = "EnemyControllerComponent";
  }

  void awake() {
    super.awake();
    animationComponent = (AnimationComponent)gameObject.getComponent("AnimationComponent");
  }

  void squash() {
    animationComponent.play("squashed");
    isAlive = false;
    //gameObject.velocity.set(0,0);
    gameObject.removeComponent("PhysicsComponent");
  }

  void update(float dt) {
  }

  void render() {
  }
}

