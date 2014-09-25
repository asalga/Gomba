/////////////////
// SoundManager
/////////////////
/*
 This class uses Minim. When using Processing.js, we don't have 
 access to Minim so we have an equivalent class, SoundManager.js
 that handles audio.
 */
public class SoundManager {
  boolean muted = false;
  Minim minim;
  HashMap <String, Player> players;

  /*
   */
  private class Player {
    private ArrayList <AudioPlayer> channels;
    private String path;

    public Player(String audioPath) {
      path = audioPath;
      channels = new ArrayList<AudioPlayer>();
      addChannel();
    }

    public void close() {
      for (int i = 0; i < channels.size(); i++) {
        channels.get(i).close();
      }
    }

    public void play() {
      int freeChannelIndex = -1;
      for (int i = 0; i < channels.size(); i++) {
        if (channels.get(i).isPlaying() == false) {
          freeChannelIndex = i;
          break;
        }
      }

      if (freeChannelIndex == -1) {
        addChannel();
        freeChannelIndex = channels.size()-1;
      }

      channels.get(freeChannelIndex).play();
      channels.get(freeChannelIndex).rewind();
    }

    private void addChannel() {
      AudioPlayer player = minim.loadFile(path);
      channels.add(player);
    }

    public void setMute(boolean m) {
      for (int i = 0; i < channels.size(); i++) {
        if (m) {
          channels.get(i).mute();
        }
        else {
          channels.get(i).unmute();
        }
      }
    }
  }

  /*
  */
  public SoundManager(PApplet applet) {
    minim = new Minim(applet);
    players = new HashMap<String, Player>();
  }

  /*
  */
  public void setMute(boolean isMuted) {
    muted = isMuted;

    for(String key : players.keySet()){
      players.get(key).setMute(muted);
    }
  }

  /*
  */
  public boolean isMuted() {
    return muted;
  }

  /*
    We handle multiple audio channels in js via
    and extra argument, which we don't need here
  */
  public void addSound(String soundName, int dummy) {
    players.put(soundName, new Player("audio/" + soundName + ".wav"));
  }

  /*
  */
  public void playSound(String soundName) {
    if (muted) {
      return;
    }

    if(players.containsKey(soundName)){
      players.get(soundName).play();
    }  
  }

  /*
  */
  public void stop() {
    for(String key : players.keySet()){
      players.get(key).close();
    }

    minim.stop();
  }
}
