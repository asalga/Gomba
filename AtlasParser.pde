////////////////
// AtlasParser
////////////////
interface AtlasParser {
  void load(String metaFile);
  HashMap<String, PImage> getImages();
}
