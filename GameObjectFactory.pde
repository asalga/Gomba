//////////////////////
// GameObjectFactory
//////////////////////
class GameObjectFactory {

  public GameObject create(String id) {

    // PLAYER
    if (id == "player") {
      GameObject player = new GameObject();
      player.name = "player";
      player.addTag("player");

      PhysicsComponent physicsComp = new PhysicsComponent();
      physicsComp.setMaxXSpeed(300);
      // physicsComp.setVelocity(30, 0);

      AnimationComponent aniComp = new AnimationComponent();

      AnimationClip jumpClip = new AnimationClip();
      jumpClip.addFrame("chars/mario/jump.png");
      aniComp.addClip("jump", jumpClip);

      AnimationClip idleClip = new AnimationClip();
      idleClip.addFrame("chars/mario/idle.png");
      aniComp.addClip("idle", idleClip);
      aniComp.play("idle");

      AnimationClip walkClip = new AnimationClip();
      walkClip.setFrameTime(0.1);
      for (int i = 0; i < 3; ++i) {
        walkClip.addFrame("chars/mario/walk" + i + ".png");
      }
      aniComp.addClip("walk", walkClip);

      MarioControllerComponent controller = new MarioControllerComponent();
      player.addComponent(controller);

      BoundingBoxYComponent yBoundingBox = new BoundingBoxYComponent();
      yBoundingBox.w = TILE_SIZE - TILE_SIZE/2;
      yBoundingBox.h = TILE_SIZE;
      yBoundingBox.setOffsets(8, 0);

      BoundingBoxXComponent xBoundingBox = new BoundingBoxXComponent();
      xBoundingBox.w = TILE_SIZE;
      xBoundingBox.h = TILE_SIZE - TILE_SIZE/2;
      xBoundingBox.setOffsets(0, - 8);

      yBoundingBox.mask = CollisionManager.PICKUP | 
                          CollisionManager.STRUCTURE |
                          CollisionManager.ENEMY;
      yBoundingBox.type = CollisionManager.PLAYER;

      xBoundingBox.mask = CollisionManager.PICKUP |
                          CollisionManager.STRUCTURE |
                          CollisionManager.ENEMY;
      xBoundingBox.type = CollisionManager.PLAYER;

      // 
      player.addComponent(physicsComp);
      player.addComponent(aniComp);
      //player.addComponent(collisionComp);
      
      player.addComponent(yBoundingBox);
      player.addComponent(xBoundingBox);
      
      return player;
    }

    //
    // COIN
    //
    else if (id == "coin") {
      GameObject coin = new GameObject();
      coin.name = "coin";

      AnimationClip idleClip = new AnimationClip();
      for (int i = 0; i < 4; i++) {
        idleClip.addFrame("props/coin/" + "coin" + i + ".png");
      }
      idleClip.setFrameTime(0.25);

      AnimationComponent aniComp = new AnimationComponent();
      aniComp.addClip("idle", idleClip);
      aniComp.play("idle");

      BoundingBoxComponent bbComp = new BoundingBoxComponent();
      bbComp.w = 10;
      bbComp.h = 20;
      bbComp.setOffsets(11, -6);
      bbComp.mask = CollisionManager.PLAYER;
      bbComp.type = CollisionManager.PICKUP;

      coin.addComponent(aniComp);
      coin.addComponent(bbComp);

      return coin;
    }

    //
    // GROUND
    //
    else if (id == "ground") {
      GameObject ground = new GameObject();
      ground.addTag("structure");

      WrapAroundComponent c = new WrapAroundComponent();
      ground.addComponent(c);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.STRUCTURE;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;
      ground.addComponent(boxComp);

      AnimationClip idleClip = new AnimationClip();
      idleClip.addFrame("props/structure/ground.png");
      AnimationComponent animation = new AnimationComponent();
      animation.addClip("idle", idleClip);
      animation.play("idle");
      ground.addComponent(animation);

      BrickControllerComponent controller = new BrickControllerComponent();
      ground.addComponent(controller);

      return ground;
    }

    //
    // CLOUD
    //
    else if (id == "cloud") {
      GameObject cloud = new GameObject();
      
      WrapAroundComponent wrapAround = new WrapAroundComponent();
      wrapAround.extraBuffer = TILE_SIZE * 9;
      cloud.position.y = height - TILE_SIZE;
      cloud.addComponent(wrapAround);

      AnimationClip idleClip = new AnimationClip();
      idleClip.addFrame("props/clouds/cloud1.png");
      AnimationComponent animation = new AnimationComponent();
      animation.addClip("idle", idleClip);
      animation.play("idle");
      cloud.addComponent(animation);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE * 2;
      boxComp.h = TILE_SIZE * 2;
      cloud.addComponent(boxComp);

      return cloud;
    }

    //
    // BRICK
    //
    else if ( id == "brick") {
      GameObject brick = new GameObject();
      brick.addTag("structure");

      WrapAroundComponent wrapAround = new WrapAroundComponent();
      brick.addComponent(wrapAround);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.STRUCTURE;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;
      brick.addComponent(boxComp);

      AnimationClip idleClip = new AnimationClip();
      idleClip.addFrame("props/structure/bricks.png");
      AnimationComponent animation = new AnimationComponent();
      animation.addClip("idle", idleClip);
      animation.play("idle");
      brick.addComponent(animation);

      BrickControllerComponent controller = new BrickControllerComponent();
      brick.addComponent(controller);

      return brick;
    }

    //
    // GOOMBA
    //
    else if (id == "goomba") {
      GameObject goomba = new GameObject();
      goomba.addTag("enemy");
      goomba.name = "goomba";

      AnimationComponent aniComp = new AnimationComponent();
      goomba.addComponent(aniComp);

      AnimationClip walkClip = new AnimationClip();
      walkClip.setFrameTime(0.25);
      walkClip.addFrame("chars/goomba/walk0.png");
      walkClip.addFrame("chars/goomba/walk1.png");
      aniComp.addClip("walk", walkClip);
      aniComp.play("walk");

      AnimationClip squashed = new AnimationClip();
      squashed.addFrame("chars/goomba/dead.png");
      aniComp.addClip("squashed", squashed);

      GoombaControllerComponent controllerComp = new GoombaControllerComponent();
      goomba.addComponent(controllerComp);

      PatrolEnemyPhysicsComponent physics = new PatrolEnemyPhysicsComponent();
      //physics.setMaxXSpeed(32);
      //physics.setVelocity(-32, 0);
      physics.setGravity(0, -100);
      goomba.addComponent(physics);

      //SpriteControllerComponent sprite = new SpriteControllerComponent();
      // set properties....
      // ....
      // ....
      //goomba.addComponent(sprite);
      
      /*PatrolEnemyPhysicsComponent physics = new PatrolEnemyPhysicsComponent();
       physics.setMaxXSpeed(32);
       physics.setVelocity(32, 0);
       goomba.addComponent(physics);*/

      CreatureBoundingBoxComponent boxComp = new CreatureBoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.ENEMY;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY | CollisionManager.STRUCTURE;
      goomba.addComponent(boxComp);

      return goomba;
    }

    else if(id == "coinbox"){
      GameObject coinBox = new GameObject();
      coinBox.addTag("coinbox");

      AnimationComponent aniComp = new AnimationComponent();
      coinBox.addComponent(aniComp);

      AnimationClip dead = new AnimationClip();
      dead.addFrame("props/coinbox/dead.png");

      AnimationClip idle = new AnimationClip();
      idle.addFrame("props/coinbox/idle1.png");
      idle.addFrame("props/coinbox/idle2.png");
      idle.addFrame("props/coinbox/idle3.png");

      /*CoinBoxBoundingBoxComponent boxComp = new CoinBoxBoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;
      boxComp.type = CollisionManager.STRUCTURE;
      boxComp.addComponent(boxComp);

      CoinBoxControllerComponent controller = new CoinBoxControllerComponent();
      controller.setNumCoins(10);*/
      // Add list?

      return coinBox;
    }

    //
    // SPINEY
    //
    else if (id == "spiney") {
      GameObject spiney = new GameObject();
      spiney.addTag("enemy");
      spiney.name = "spiney";

      AnimationComponent aniComp = new AnimationComponent();
      spiney.addComponent(aniComp);

      AnimationClip walkClip = new AnimationClip();
      walkClip.setFrameTime(0.25);
      walkClip.addFrame("chars/spiney/walk0.png");
      walkClip.addFrame("chars/spiney/walk1.png");
      aniComp.addClip("walk", walkClip);
      aniComp.play("walk");

      CreatureBoundingBoxComponent boxComp = new CreatureBoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.ENEMY;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY | CollisionManager.STRUCTURE;
      spiney.addComponent(boxComp);

      SpriteControllerComponent sprite = new SpriteControllerComponent();
      sprite.setSquashable(false);
      sprite.setDoesHurtPlayerOnSquash(true);
      spiney.addComponent(sprite);

      PatrolEnemyPhysicsComponent physics = new PatrolEnemyPhysicsComponent();
      //physics.setMaxXSpeed(32);
      //physics.setVelocity(-32, 0);
      physics.setGravity(0, -100);
      spiney.addComponent(physics);

      return spiney;
    }
    return null;
  }
}
