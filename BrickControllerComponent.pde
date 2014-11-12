/////////////////////////////////
// BrickControllerComponent
/////////////////////////////////
class BrickControllerComponent extends StructureControllerComponent {

  StructureBounceComponent bounceComponent;

  BrickControllerComponent() {
    super();
    // TODO: fix!!
    componentName = "StructureControllerComponent";
  }

  void awake() {
    super.awake();
    bounceComponent = (StructureBounceComponent)gameObject.getComponent("StructureBounceComponent");
  }

  void update(float dt) {
    super.update(dt);
  }

  void render() {
  }

  void hit(GameObject other) {
    super.hit(other);
    bounceComponent.bounce();
    soundManager.playSound("bump");
  }
}
