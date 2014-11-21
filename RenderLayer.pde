////////////////
// RenderLayer
////////////////
class RenderLayer {
  ArrayList<GameObject> gameObjects;
  int index;

  RenderLayer(int i) {
    gameObjects = new ArrayList<GameObject>();
    index = i;
  }

  void render() {
    for (int i = 0; i < gameObjects.size(); i++) {
      GameObject go = gameObjects.get(i);

      // already did camera's render in preRender
      if (go.hasTag("camera")) {
        continue;
      }

      go.render();
    }
  }

  void add(GameObject go) {
    gameObjects.add(go);
  }

  void remove(GameObject go) {
    gameObjects.remove(go);
  }
  
  ArrayList<GameObject> getList(){
    return gameObjects;
  }

  int getIndex(){
    return index;
  }
}

////////////////
// RenderOrder
////////////////
class RenderOrder implements Comparable {
  int index;

  RenderOrder(int i){
    index = i;
  }

  int compareTo(Object obj){
    return index - (int) ((RenderOrder)obj).index;
  }
}
