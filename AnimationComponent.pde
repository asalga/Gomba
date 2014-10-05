///////////////////////
// AnimationComponent
///////////////////////
class AnimationComponent extends Component {

  HashMap<String, AnimationClip> clips;
  AnimationClip currentClip;
  protected boolean flipX;
  protected boolean flipY;

  AnimationComponent() {
    componentName = "AnimationComponent";
    clips = new HashMap<String, AnimationClip>();
    currentClip = null;
    flipX = false;
    flipY = false;
  }

  void addClip(String clipName, AnimationClip clip) {
    clips.put(clipName, clip);
  }

  void update(float dt) {
    if (currentClip != null) {
      currentClip.update(dt);
    }
  }

  void render() {
    if (currentClip != null) {
      pushMatrix();

      translate(gameObject.position.x, -gameObject.position.y);

      if (flipX) {
        translate(TILE_SIZE, 0);
        scale(-1, 1);
      }

      if(flipY){
        translate(0, TILE_SIZE);
        scale(1, -1);
      }

      image(currentClip.getCurrFrame(), 0, 0);
      popMatrix();
    }
  }

  void play(String clipName) {
    currentClip = clips.get(clipName);
  }

  void setFlipX(boolean b) {
    flipX = b;
  }

  void setFlipY(boolean b){
    flipY = b;
  }
}

