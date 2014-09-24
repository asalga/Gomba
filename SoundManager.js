var SoundManager = (function() {

    function SoundManager() {
        this.muted = false;
        this.BASE_PATH = "data/audio/";
        this.players = {};

        this.Player = (function() {
            var audio;

            function Player(path) {
		        this.audio = document.createElement('audio');
			    this.audio.setAttribute('src', "data/audio/" + path + ".ogg");
			    this.audio.preload = 'auto';
			    this.audio.load();

                this.play = function() {
                    console.log("Player play called");
                    try {
				    	this.audio.volume = 1;
				    	this.audio.play();
				    	this.audio.currentTime = 0;
				    }
				    catch(e) {
				      console.log("Could not play audio file: " + e);
				    }
                };

                this.setMute = function() {
                };

                this.addChannel = function() {
                };
            }
            return Player;
        }());

        this.setMute = function() {
        };

        this.isMuted = function() {
            return this.muted;
        };

        this.addSound = function(soundName) {
            this.players[soundName] = new this.Player(soundName);
        };

        this.playSound = function(soundName) {
            if(this.players[soundName]){
            	this.players[soundName].play();
            }
        };

        this.stop = function() {
        };
    }
    return SoundManager;
}());