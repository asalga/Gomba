/*

*/
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

			    // Safari ignores both of these?
			    this.audio.preload = 'auto';
			    this.audio.load();

			    this.players = [];
			    this.playedOnce = [];
			    this.audio.ended = true;

			    this.players.push(this.audio);
			    this.playedOnce.push(false);

                this.audio.onended = function(){
                    this.ended = true;
                };

                this.play = function() {
                	var freeIndex = this.findFreeChannel();

                	if(freeIndex != -1){
                		try {
                			this.playedOnce[freeIndex] = true;
				    		this.players[freeIndex].volume = 1;
				    		this.players[freeIndex].play();
				    		this.players[freeIndex].currentTime = 0;
					    }
					    catch(e) {
					    	console.log("Could not play audio file: " + e);
					    }
                	}
                	else{
                		console.log("Not enough audio channels for: " + this.players[0].src)
                	}
                };

                this.findFreeChannel = function(){
                	for(var i = 0; i < this.playedOnce.length; i++){
                		if(this.playedOnce[i] === false ||
                			this.players[i].ended === true){
                			return i;
                		}
                	}
                	return -1;
                }

                this.setMute = function() {
                };

                this.addChannel = function() {
                	var newChannel = this.audio.cloneNode(true);
				    this.playedOnce.push(false);
                	this.players.push(newChannel);
                    
                    newChannel.onended = function(){
                        this.ended = true;
                    };
                };
            }
            return Player;
        }());

        this.setMute = function() {
        };

        this.isMuted = function() {
            return this.muted;
        };

        this.pause = function(){

        };

        this.addSound = function(soundName, numChannels) {
            this.players[soundName] = new this.Player(soundName);

            for(var i = 0; i < numChannels-1; ++i){
				this.players[soundName].addChannel();
            }
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