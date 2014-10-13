///////////
// Utils
//////////

static float EPSILON = 0.00001;
boolean isPJSMode = true;
boolean debugPrint = false;

String PVectorToString(PVector vec) {
  return "" + vec.x + ", " + vec.y;
}

// ArtManager needs this in order to determine which
// parser to use.
String getFileExtension(String path) {
  String[] tokens = split(path, '.');
  return tokens[tokens.length - 1];
}

void dprintln(String s){
  if(debugPrint){
    println(s);
  }
}


public static class Utils {
  private static int id = -1;

  public static int getNextID() {
    return ++id;
  }
}

// TODO: add NAABB test

//
boolean isPointInBox(float px, float py, BoundingBoxComponent b) {
  if (px >= b.x && px <= b.x + b.w && py <= b.y && py >= b.y - b.h) {
    return true;
  }
  return false;
}

// Determine if for sure one box isn't touching the other, then negate that.
boolean testCollisionWithTouch(BoundingBoxComponent a, BoundingBoxComponent b) {
  return !( (a.x       > b.x + b.w) || 
    (a.x + a.w < b.x )      ||
    (a.y       > b.y + b.h) ||
    (a.y + a.h < b.y));
}

