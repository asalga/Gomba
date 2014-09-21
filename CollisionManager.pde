/////////////////////
// CollisionManager
/////////////////////
class CollisionManager {

  static final int NONE       = 0;
  static final int PLAYER     = 1;
  static final int STRUCTURE  = 2;
  static final int ENEMY      = 4;
  static final int PICKUP     = 8;

  HashMap<String, GameObject[]> collisions;
  ArrayList<GameObject> gameObjects;
  ArrayList<String> toRemove;

  CollisionManager() {
    gameObjects = new ArrayList<GameObject>();
    collisions = new HashMap<String, GameObject[]> ();
    toRemove = new ArrayList<String>();
  }

  void add(GameObject go) {
    gameObjects.add(go);
  }

  void removeDeadObjects() {
    for (int i = gameObjects.size()-1; i >= 0; i--) {
      GameObject go = gameObjects.get(i);
      if (go.requiresRemoval) {
        gameObjects.remove(i);
      }
    }
  }

  // 
  void checkForCollisionExits() {

    for (String key : collisions.keySet()) {

      GameObject[] pair = collisions.get(key);

      BoundingBoxComponent bb0 = (BoundingBoxComponent)pair[0].getComponent("BoundingBoxComponent");
      BoundingBoxComponent bb1 = (BoundingBoxComponent)pair[1].getComponent("BoundingBoxComponent");

      if (testCollisionWithTouch(bb0, bb1) == false) {
        CollisionComponent cc0 = (CollisionComponent)pair[0].getComponent("CollisionComponent");
        CollisionComponent cc1 = (CollisionComponent)pair[1].getComponent("CollisionComponent");

        cc0.onCollisionExit(pair[1]);
        cc1.onCollisionExit(pair[0]);

        toRemove.add(hashObjectPair(pair[0], pair[1]));
      }
    }

    for (int i = 0; i < toRemove.size(); i++) {
      collisions.remove(toRemove.get(i));
    }
    toRemove.clear();
  }

  void checkForCollisions() {
    debug.addString("num collision objects: " + gameObjects.size());

    if (gameObjects.size() < 2) {
      return;
    }

    numCollisionTests = 0;
    numCollisionTestsSkipped = 0;

    int numObjects = gameObjects.size();

    // If any collisions no longer collide
    checkForCollisionExits();

    // Now, check for new collisions.
    for (int i = 0; i < numObjects-1; i++) {
      for (int j = i+1; j < numObjects; j++) {

        GameObject obj1 = gameObjects.get(i);
        GameObject obj2 = gameObjects.get(j);

        BoundingBoxComponent bb1 = (BoundingBoxComponent)obj1.getComponent("BoundingBoxComponent");
        BoundingBoxComponent bb2 = (BoundingBoxComponent)obj2.getComponent("BoundingBoxComponent");

        // Check the masks
        if ((bb1.type & bb2.mask) == 0) {
          numCollisionTestsSkipped++;
          continue;
        }

        numCollisionTests++;
        if (testCollisionWithTouch(bb1, bb2)) {

          CollisionComponent cc1 = (CollisionComponent)obj1.getComponent("CollisionComponent");
          CollisionComponent cc2 = (CollisionComponent)obj2.getComponent("CollisionComponent");

          String hash = hashObjectPair(obj1, obj2);

          // First time these two are colliding
          if (collisions.containsKey(hash) == false) {
            cc1.onCollisionEnter(obj2);
            cc2.onCollisionEnter(obj1);
            collisions.put(hash, new GameObject[] { 
              obj1, obj2
            }
            );
          }
          else {
            cc1.onCollision(obj2);
            cc2.onCollision(obj1);
          }
        }
      }
    }
  }

  String hashObjectPair(GameObject g0, GameObject g1) {
    String hash = "";

    if (g0.id < g1.id) {
      hash = ("" + g0.id) + ("" + g1.id);
    }
    else {
      hash = ("" + g1.id) + ("" + g0.id);
    }

    return hash;
  }
}

