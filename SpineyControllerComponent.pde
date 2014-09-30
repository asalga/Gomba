//////////////////////////////
// SpineyControllerComponent
//////////////////////////////
class SpineyControllerComponent extends SpriteControllerComponent {

  SpineyControllerComponent() {
    // TODO: fix
    super();
    componentName = "SpriteControllerComponent";
  }

  void awake() {
    super.awake();
    //animationComponent = (AnimationComponent)gameObject.getComponent("AnimationComponent");
  }

  void squash() {
    // kill player
  }

  void update(float dt) {
  }

  void render() {
  }
}
