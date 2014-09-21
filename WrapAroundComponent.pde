////////////////////////
// WrapAroundComponent
////////////////////////
class WrapAroundComponent extends Component {

  PImage img;
  String imgPath;
  PVector position;
  float extraBuffer;

  WrapAroundComponent() {
    super();
    componentName = "WrapAroundComponent";
    img = null;
    imgPath = "";
    position = new PVector();
    extraBuffer = 0;
  }

  void awake() {
    super.awake();
    img = artManager.getImage(imgPath);
  }

  void update(float dt) {
    PVector camPos = scene.getCamPos();

    scene.getActiveCamera();
    PVector dir = scene.getActiveCamera().getVelocity();

    if (dir.x > 0 && gameObject.position.x + img.width < camPos.x) {
      gameObject.position.x += width + img.width + extraBuffer;
    }
    // player walks left
    else if (dir.x < 0 && gameObject.position.x > camPos.x + width) {
      gameObject.position.x -= width + img.width + extraBuffer;
    }
  }

  void render() {
    image(img, gameObject.position.x, -gameObject.position.y);
  }
}

