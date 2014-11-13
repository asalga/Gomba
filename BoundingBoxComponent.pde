/////////////////////////
// BoundingBoxComponent
/////////////////////////
class BoundingBoxComponent extends Component {

  // Properties
  public float x, y, w, h;
  public float xOffest, yOffset;
  public int mask;
  public int type;
  //

  boolean collidable;
  HashMap<String, GameObject> colliders;

  BoundingBoxComponent() {
    super();
    componentName = "BoundingBoxComponent";
    x = y = 0;
    w = h = TILE_SIZE;
    xOffest = yOffset = 0;
    mask = 0;
    colliders = new HashMap<String, GameObject>();
    collidable = true;
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
      
      if(isCollisable()){
        stroke(255, 0, 0);
      }
      else{
       stroke(255, 255, 255); 
      }

      rect(x, -y + yOffset*2, w, h);
      popStyle();
    }
  }

  String toString() {
    return "(" + x + "," + y + ")  " + "(" + w + "," + h + ")";
  }

  void onCollision(GameObject other) {
  }

  void setEnableCollisions(boolean b){
    collidable = b;
  }

  boolean isCollisable(){
    return collidable;
  }

  void onCollisionEnter(GameObject other) {
    colliders.put("" + other.id, other);
  }

  void onCollisionExit(GameObject other) {
    colliders.remove("" + other.id);
  }
}
