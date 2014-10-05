/////////////////////////////
// BrickControllerComponent
/////////////////////////////
class BrickControllerComponent extends StructureControllerComponent{
	
	float y;
	boolean bouncing;
	float original;
	BoundingBoxComponent bounds;

	BrickControllerComponent(){
		super();
		y = 0;
		bouncing = false;
	}

	void awake(){
		super.awake();
		bounds = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
	}

	void hit(GameObject other){
		if(bouncing){
			return;
		}

		bouncing = true;
		original = gameObject.position.y;
		
		// TODO: tell any sprites walking on this structure to get kicked()
		for(int i = 0; i < bounds.colliders.size(); i++ ){
	      	for(String key: bounds.colliders.keySet()){
	      		GameObject go = bounds.colliders.get(key);
	      		SpriteControllerComponent sprite = (SpriteControllerComponent)go.getComponent("SpriteControllerComponent");
	      		if(sprite != null){
	      			sprite.kick();
	      		}
	      	}
	    }
	}

	void update(float dt){
		if(bouncing == true){
			y += dt * 15.0;
			gameObject.position.y = original + 15 * sin(y);
		}
		if(y >= PI){
			y = 0;
			bouncing = false;
			gameObject.position.y = original;
		}
	}
}

