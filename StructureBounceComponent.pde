/////////////////////////////
// StructureBounceComponent
/////////////////////////////
class StructureBounceComponent extends StructureControllerComponent{
	
	// Properties
	public float bounceHeight;
	public float bounceSpeed;
	//


	float yPos;
	boolean bouncing;
	float original;
	
	AnimationComponent animation;

	StructureBounceComponent(){
		super();
		componentName = "StructureBounceComponent";
		yPos = 0;
		bouncing = false;

		// Properties
		bounceHeight = 32;
		bounceSpeed = 1;
	}

	void awake(){
		super.awake();
		
		animation = (AnimationComponent)gameObject.getComponent("AnimationComponent");
	}

	void bounce(){
		if(bouncing){
			return;
		}
		bouncing = true;
		original = gameObject.position.y;
	}

	//void hit(GameObject other){ }

	void update(float dt){
		if(bouncing == true){
			yPos += dt * bounceSpeed;

			if(animation != null){
				animation.setPosition(0, bounceHeight * sin(yPos));
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
