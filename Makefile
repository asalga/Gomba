# Can't rely on Processing's export since it
# uses an old version of Processing.js which has bugs

build: minify

minify:
	cat Gomba.pde                  \
		AnimationClip.pde               \
		AnimationComponent.pde          \
		ArtManager.pde                  \
		AtlasParser.pde                 \
		BrickCollisionComponent.pde     \
		AtlasParserJSON.js              \
		AtlasParserXML.js               \
		BoundingBoxComponent.pde        \
		CameraComponent.pde             \
		CoinCollisionComponent.pde      \
		GroundCollisionComponent.pde    \
		MarioControllerComponent.pde    \
		PhysicsComponent.pde            \
		CollisionComponent.pde          \
		CollisionManager.pde           	\
		PatrolEnemyPhysicsComponent.pde \
		Component.pde                  	\
		Debugger.pde                    \
		SpineyCollisionComponent.pde    \
		CreatureCollisionComponent.pde  \
		Keyboard.pde                    \
		BrickCollisionComponent.pde     \
		GoombaCollisionComponent.pde    \
		GoombaControllerComponent.pde   \
		MarioCollisionComponent.pde     \
		SoundManager.js                 \
		GameObject.pde                  \
		SpriteControllerComponent.pde   \
		GameObjectFactory.pde           \
		Scene.pde                       \
		Timer.pde                       \
		Utils.js                        \
		WrapAroundComponent.pde	> build/build.js
