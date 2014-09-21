///////////////
// GameObject
///////////////
class GameObject {

  PVector position;
  String name;
  ArrayList<String> tags;
  HashMap<String, Component> components;
  boolean requiresRemoval;
  int id;

  GameObject() {
    position = new PVector();
    name = "";
    components = new HashMap<String, Component>();
    tags = new ArrayList<String>();
    requiresRemoval = false;
    id = Utils.getNextID();
  }

  void addComponent(Component component) {
    component.setGameObject(this);
    components.put(component.componentName, component);
  }

  Component getComponent(String s) {
    return components.get(s);
  }

  void addTag(String t) {
    tags.add(t);
  }

  boolean hasTag(String s) {
    for (int i = 0; i < tags.size(); i++) {
      if (tags.get(i) == s) {
        return true;
      }
    }
    return false;
  }

  void removeComponent(String name) {
    components.remove(name);
  }

  void awake() {
    Component c;
    for (String key : components.keySet()) {
      c = components.get(key);
      c.awake();
    }
  }

  void update(float dt) {
    Component c;
    for (String key : components.keySet()) {
      c = components.get(key);
      if (c.isEnabled()) {
        c.update(dt);
      }
    }
  }

  boolean haTag(String tag) {
    for (int i = 0; i < tags.size(); i++) {
      if (tags.get(i) == tag) {
        return true;
      }
    }
    return false;
  }

  PVector getPosition() {
    return position;
  }

  void setPosition(float x, float y) {
    position.x = x;
    position.y = y;
  }

  void render() {
    Component c;
    for (String key : components.keySet()) {
      c = components.get(key);
      if (c.isEnabled()) {
        c.render();
      }
    }
  }

  void slateForRemoval() {
    requiresRemoval = true;
  }
}

