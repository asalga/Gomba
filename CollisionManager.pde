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

      if(bb0 == null || bb1 == null){
        continue;
      }

      if (testCollisionWithTouch(bb0, bb1) == false) {
        bb0.onCollisionExit(pair[1]);
        bb1.onCollisionExit(pair[0]);
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

        // turn to iterator
        ArrayList<Component> bbList1 = obj1.getComponentList("BoundingBoxComponent");
        ArrayList<Component> bbList2 = obj2.getComponentList("BoundingBoxComponent");

        if(bbList1 == null || bbList2 == null){
          continue;
        }

        for(int bbList1Index = 0; bbList1Index < bbList1.size(); bbList1Index++){
          BoundingBoxComponent bb1 = (BoundingBoxComponent)bbList1.get(bbList1Index);
   
          for(int bbList2Index = 0; bbList2Index < bbList2.size(); bbList2Index++){
            BoundingBoxComponent bb2 = (BoundingBoxComponent)bbList2.get(bbList2Index);

            if(bb1 == null || bb2 == null){
              continue;
            }

            if(bb1.isCollisable() == false || bb2.isCollisable() == false){
              continue;
            }

            // Check the masks
            if ((bb1.type & bb2.mask) == 0) {
              numCollisionTestsSkipped++;
              continue;
            }

            numCollisionTests++;
            if (testCollisionWithTouch(bb1, bb2)) {

              String hash = hashObjectPair(obj1, obj2);

              // First time these two are colliding
              if (collisions.containsKey(hash) == false) {
                bb1.onCollisionEnter(obj2);
                bb2.onCollisionEnter(obj1);
                
                collisions.put(hash, new GameObject[] { 
                  obj1, obj2
                }
                );
              }
              else {
                bb1.onCollision(obj2);
                bb2.onCollision(obj1);
              }
            }
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
