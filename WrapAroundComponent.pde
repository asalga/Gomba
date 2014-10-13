////////////////////////
// WrapAroundComponent
////////////////////////
class WrapAroundComponent extends Component {

  PVector position;
  float extraBuffer;
  BoundingBoxComponent bounds;

  WrapAroundComponent() {
    super();
    componentName = "WrapAroundComponent";
    position = new PVector();
    extraBuffer = 0;
  }

  void awake() {
    super.awake();
    bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
  }

  void update(float dt) {
    PVector camPos = scene.getCamPos();

    scene.getActiveCamera();
    PVector dir = scene.getActiveCamera().getVelocity();

    if (dir.x > 0 && gameObject.position.x + bounds.w < camPos.x) {
      gameObject.position.x += width + bounds.w + extraBuffer;
    }
    // player walks left
    else if (dir.x < 0 && gameObject.position.x > camPos.x + width) {
      gameObject.position.x -= width + bounds.w + extraBuffer;
    }
  }
}

