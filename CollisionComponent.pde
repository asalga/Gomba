///////////////////////
// CollisionComponent  
///////////////////////
class CollisionComponent extends Component {

  HashMap<String, GameObject> colliders;

  CollisionComponent() {
    super();
    componentName = "CollisionComponent";
    colliders = new HashMap<String, GameObject>();
  }

  void onCollision(GameObject other) {
  }

  void onCollisionEnter(GameObject other) {
    colliders.put(""+other.id, other);
  }

  void onCollisionExit(GameObject other) {
    colliders.remove(""+other.id);
  }
}

