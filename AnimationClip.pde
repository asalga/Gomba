//////////////////
// AnimationClip
//////////////////
class AnimationClip {

  float frameTime;
  ArrayList<PImage> frames;
  Timer timer;
  int currFrame;

  AnimationClip() {
    frames = new ArrayList<PImage>();
    timer = new Timer();
    frameTime = 1;
    currFrame = 0;
  }

  void addFrame(String frameName) {
    frames.add(artManager.getImage(frameName));
  }

  void update(float dt) {
    timer.add(dt);

    if (timer.getTotalTime() > frameTime) {
      float diff = frameTime - timer.getTotalTime();
      timer.reset();
      timer.add(diff);

      currFrame++;

      if (currFrame > frames.size()-1) {
        currFrame = 0;
      }
    }
  }

  void setFrameTime(float t) {
    frameTime = t;
  }

  PImage getCurrFrame() {
    return frames.get(currFrame);
  }
}

