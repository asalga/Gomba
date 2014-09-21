//////////////
// Component
//////////////
class Component {

  protected String componentName;
  protected GameObject gameObject;
  protected String name;
  protected boolean enabled;

  Component() {
    componentName = "Component";
    gameObject = null;
    name = "";
    enabled = true;
  }

  void update(float dt) {
  }

  void render() {
  }

  void awake() {
  }

  GameObject getGameObject() {
    return gameObject;
  }

  void setGameObject(GameObject go) {
    gameObject = go;
  }

  String getComponentName() {
    return componentName;
  }

  void setName(String n) {
    name = n;
  }

  String getname() {
    return name;
  }

  boolean isEnabled() {
    return enabled;
  }
}

