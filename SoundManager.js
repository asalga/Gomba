/////////////////
// SoundManager
/////////////////
function SoundManager() {

  var muted;

  var BASE_PATH = "data/audio/";

  var sounds = [];
  var soundNames = [];

  /*
  *
   */
  this.setMute = function(mute) {
    muted = mute;
  };

  /*
  */
  this.isMuted = function() {
    return muted;
  };

  /*
  */
  this.stop = function() {
  }

  this.addSound = function(soundName) {
    var i = sounds.push(document.createElement('audio')) - 1;
    console.log(i);
    sounds[i].setAttribute('src', BASE_PATH + soundName + ".ogg");
    console.log(sounds[i]);
    sounds[i].preload = 'auto';
    sounds[i].load();
    sounds[i].setAttribute('autoplay', 'autoplay');
    soundNames[i] = soundName;
    document.body.appendChild(sounds[i]);
  }

  /*
  */
  this.playSound = function(soundName) {
    console.log("play audio");
    var soundID = -1;

    if (muted) {
      return;
    }

    for (var i = 0; i < sounds.length; i++) {
      if (soundNames[i] === soundName) {
        soundID = i;
        break;
      }
    }

    // return early if the soundName wasn't found to prevent AOOB
    if (soundID === -1) {
      return;
    }

    sounds[soundID].volume = 1.0;

    // Safari does not want to play sounds...??
    try {
      console.log(sounds[soundID]);
      sounds[soundID].volume = 1.0;
      sounds[soundID].play();
      sounds[soundID].currentTime = 0;
    }
    catch(e) {
      console.log("Could not play audio file: " + e);
    }
  };
}
