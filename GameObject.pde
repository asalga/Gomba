///////////////
// GameObject
///////////////
class GameObject {
  PVector position;
  String name;
  ArrayList<String> tags;
  HashMap<String, ArrayList<Component> > components;
  boolean requiresRemoval;
  int id;

  GameObject() {
    position = new PVector();
    name = "";
    components = new HashMap<String, ArrayList<Component>>();
    tags = new ArrayList<String>();
    requiresRemoval = false;
    id = Utils.getNextID();
  }

  void addComponent(Component component) {
    component.setGameObject(this);

    ArrayList<Component> list = components.get(component.getComponentName());
    if(list == null){
      list = new ArrayList<Component>();
      list.add(component);
      components.put(component.getComponentName(), list);
    }
    else{
      list.add(component);
    }
  }

  /*
    legacy
  */
  Component getComponent(String s) {
    ArrayList<Component> c = components.get(s);
    if(c != null){
      return c.get(0);  
    }
    return null;
  }

  ArrayList<Component> getComponentList(String s) {
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

  void removeComponent(String key) {
    components.remove(key);
  }
  
  void awake() {
    Component c;
    for (String key : components.keySet()) {
      ArrayList<Component> list = components.get(key);
      for(int i = 0; i < list.size(); i++){
        list.get(i).awake();  
      }
    }
  }

  void update(float dt) {
    Component c;
    ArrayList <Component> list;
    for (String key : components.keySet()) {
      list = components.get(key);
      if(list != null){
        for(int i = 0; i < list.size(); ++i){
          if(list.get(i).isEnabled()){
            list.get(i).update(dt);
          }
        }
      }
    }
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
    ArrayList <Component> list;
    for (String key : components.keySet()) {
      list = components.get(key);
      if(list != null){
        for(int i = 0; i < list.size(); ++i){
          if(list.get(i).isEnabled()){
            list.get(i).render();
          }
        }
      }
    }
  }

  void slateForRemoval() {
    requiresRemoval = true;
  }
}
