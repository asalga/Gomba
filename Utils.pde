///////////
// Utils
//////////

static float EPSILON = 0.00001;
boolean isPJSMode = false;
boolean debugPrint = false;

String PVectorToString(PVector vec) {
  return "" + vec.x + ", " + vec.y;
}

void dprintln(String s){
  if(debugPrint){
    println(s);
  }
}

// ArtManager needs this in order to determine which
// parser to use.
String getFileExtension(String path) {
  String[] tokens = split(path, '.');
  return tokens[tokens.length - 1];
}

boolean isPointInBox(float px, float py, BoundingBoxComponent b) {
  if (px >= b.x && px <= b.x + b.w && py <= b.y && py >= b.y - b.h) {
    return true;
  }
  return false;
}

public static class Utils {
  private static int id = -1;

  public static int getNextID() {
    return ++id;
  }
}

// Determine if for sure one box isn't touching the other, then negate that.
boolean testCollisionWithTouch(BoundingBoxComponent a, BoundingBoxComponent b) {
  return !( (a.x       > b.x + b.w) || 
            (a.x + a.w < b.x )      ||
            (a.y       > b.y + b.h) ||
            (a.y + a.h < b.y));
}
