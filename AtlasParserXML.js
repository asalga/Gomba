///////////////////
// AtlasParserXML
///////////////////
class AtlasParserXML implements AtlasParser {

  HashMap<String, PImage> images;

  AtlasParserXML() {
    images = null;
  }

  void load(String metaFile) {

    XMLElement root = new XMLElement(this, metaFile);

    String atlasPath = root.getString("imagePath");

    PImage atlas = loadImage(atlasPath);

    int numFrames = root.getChildCount();
    images = new HashMap<String, PImage>(numFrames);

    for (int i = 0; i < numFrames; ++i) {
      XMLElement frame = root.getChild(i);

      String imgName = frame.getString("n");

      // casting necessary here
      int x = (int)frame.getInt("x");
      int y = (int)frame.getInt("y");
      int w = (int)frame.getInt("w");
      int h = (int)frame.getInt("h");

      PImage img = atlas.get(x, y, w, h);
      images.put(imgName, img);
    }
  }

  HashMap<String, PImage> getImages() {
    return images;
  }
}
