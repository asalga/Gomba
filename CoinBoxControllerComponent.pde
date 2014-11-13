///////////////////////////////
// CoinBoxControllerComponent
///////////////////////////////
class CoinBoxControllerComponent extends StructureControllerComponent{

	BoundingBoxComponent bounds;
	AnimationComponent animation;
	StructureBounceComponent bounceComponent;
	AnimationComponent aniComp;

	// Properties
	int numCoins;

	CoinBoxControllerComponent(){
		super();
		// TODO: fix!!
		componentName = "StructureControllerComponent";
		numCoins = 5;
	}

	void awake(){
		super.awake();
		bounceComponent = (StructureBounceComponent)gameObject.getComponent("StructureBounceComponent");
		aniComp = (AnimationComponent)gameObject.getComponent("AnimationComponent");
	}

	void hit(GameObject other) {
    	super.hit(other);

		if(numCoins > 1) {
    		bounceComponent.bounce();
    		soundManager.playSound("coin_pickup");
		}

		else if(numCoins == 1){
			aniComp.play("dead");
			bounceComponent.bounce();
    		soundManager.playSound("coin_pickup");

		}
		else{
			soundManager.playSound("bump");
		}

    	if(numCoins > 0){
    		numCoins--;
    	}
	}

	void update(float dt){
		super.update(dt);

		// TODO:
		// We only want the image to change to dead once has finished
		// the bounce animation....
	}
}
