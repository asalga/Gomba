/////////////////////////////
// StructureBounceComponent
/////////////////////////////
class StructureBounceComponent extends StructureControllerComponent{
	
	// Properties
	float heightBounce;
	float speed;


	float yPos;
	boolean bouncing;
	float original;
	BoundingBoxComponent bounds;
	AnimationComponent animation;

	StructureBounceComponent(){
		super();
		componentName = "StructureBounceComponent";
		yPos = 0;
		bouncing = false;

		// Properties
		heightBounce = 16;
		speed = 10;
	}

	void awake(){
		super.awake();
		bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
		animation = (AnimationComponent)gameObject.getComponent("AnimationComponent");
	}

	void bounce(){
		if(bouncing){
			return;
		}
		bouncing = true;
		original = gameObject.position.y;
	}

	void hit(GameObject other){

		
		// TODO: tell any sprites walking on this structure to get kicked()
		/*for(int i = 0; i < bounds.colliders.size(); i++ ){
	      	for(String key: bounds.colliders.keySet()){
	      		GameObject go = bounds.colliders.get(key);
	      		SpriteControllerComponent sprite = (SpriteControllerComponent)go.getComponent("SpriteControllerComponent");
	      		if(sprite != null){
	      			sprite.kick();
	      		}
	      	}
	    }*/
	}

	void update(float dt){
		if(bouncing == true){
			yPos += dt * speed;

			if(animation != null){
				animation.setPosition(0, heightBounce * sin(yPos));
			}
		}
		if(yPos >= PI){
			yPos = 0;
			bouncing = false;
			animation.setPosition(0, 0);
		}
	}

	boolean isBouncing() {
		return bouncing;
	}
}
