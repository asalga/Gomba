////////////////////
// JsonAtlasParser
////////////////////
class AtlasParserJSON implements AtlasParser {
  PImage atlasImage;
  HashMap<String, PImage> images;

  AtlasParserJSON() {
    images = new HashMap<String, PImage>();
  }

  HashMap<String, PImage> getImages() {
    return images;
  }

  void load(String jsonFile) {

    JSONObject json = loadJSONObject(jsonFile);
    JSONObject meta = json.getJSONObject("meta");
    String atlasFilename = meta.getString("image");

    atlasImage = loadImage(atlasFilename);

    JSONArray frames = json.getJSONArray("frames");

    int numImages = frames.size();

    images = new HashMap<String, PImage>(numImages);

    for (int i = 0; i < numImages; ++i) {
      JSONObject element = frames.getJSONObject(i);
      JSONObject frame = element.getJSONObject("frame");

      int x = frame.getInt("x");
      int y = frame.getInt("y");
      int w = frame.getInt("w");
      int h = frame.getInt("h");

      String filename = element.getString("filename");
      PImage img = getImageFromAtlas(x, y, w, h);
      images.put(filename, img);
    }
  }

  PImage getImage(String imgName) {
    return images.get(imgName);
  }

  PImage getImageFromAtlas(int x, int y, int w, int h) {
    PImage img = new PImage(w, h, ARGB);
    img.copy(atlasImage, x, y, w, h, 0, 0, w, h);
    return img;
  }
}

