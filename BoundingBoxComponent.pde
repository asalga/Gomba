////////////////////////
// WrapAroundComponent
////////////////////////
class BoundingBoxComponent extends Component {

  float x, y, w, h;
  float xOffest, yOffset;
  int mask;
  int type;

  BoundingBoxComponent() {
    super();
    componentName = "BoundingBoxComponent";
    x = y = 0;
    w = h = TILE_SIZE;
    xOffest = yOffset = 0;
    mask = 0;
  }

  void awake() {
  }

  void update(float dt) {
    setPosition(gameObject.position.x + xOffest, gameObject.position.y + yOffset);
  }

  void setPosition(float px, float py) {
    x = px;
    y = py;
  }

  void setDimensions(float pw, float ph) {
    w = pw;
    h = ph;
  }

  void setOffsets(float x, float y) {
    xOffest = x;
    yOffset = -y;
  }

  void render() {
    if (debugOn) {
      pushStyle();
      strokeWeight(1);
      noFill();
      stroke(255, 0, 0);
      rect(x + 0, -y + yOffset*2, w, h);
      popStyle();
    }
  }

  String toString() {
    return "(" + x + "," + y + ")  " + "(" + w + "," + h + ")";
  }
}
