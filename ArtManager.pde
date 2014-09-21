///////////////
// ArtManager
///////////////
class ArtManager {

  HashMap<String, PImage> images;

  ArtManager() {
  }

  void load(String filePath) {
    AtlasParser atlasParser = null;

    String extension = getFileExtension(filePath);

    if (extension.equals("xml")) {
      atlasParser = new AtlasParserXML();
    }
    else if (extension.equals("json")) {
      atlasParser = new AtlasParserJSON();
    }

    atlasParser.load(filePath);
    images = atlasParser.getImages();
  }

  PImage getImage(String img) {
    return images.get(img);
  }
}

