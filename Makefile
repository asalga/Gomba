# Can't rely on Processing's export since it
# uses an old version of Processing.js which has bugs

build: minify

minify:
	cat Gomba.pde                  \
		AnimationClip.pde               \
		AnimationComponent.pde          \
		ArtManager.pde                  \
		AtlasParser.pde                 \
		AtlasParserJSON.js              \
		AtlasParserXML.js               \
		BoundingBoxComponent.pde        \
		BrickControllerComponent.pde	\
		BoundingBoxXComponent.pde       \
		BoundingBoxYComponent.pde       \
		CameraComponent.pde             \
		CollisionManager.pde           	\
		Component.pde                  	\
		CreatureBoundingBoxComponent.pde\
		Debugger.pde                    \
		GameObject.pde                  \
		GameObjectFactory.pde           \
		GoombaControllerComponent.pde   \
		Keyboard.pde                    \
		MarioControllerComponent.pde    \
		PatrolEnemyPhysicsComponent.pde \
		PhysicsComponent.pde            \
		Scene.pde                       \
		SpriteControllerComponent.pde   \
		StructureControllerComponent.pde\
		Timer.pde                       \
		Utils.js                        \
		WrapAroundComponent.pde	> build/build.js
