//////////////////////
// GameObjectFactory
//////////////////////
class GameObjectFactory {

  public GameObject create(String id) {

    // PLAYER
    if (id == "player") {
      GameObject player = new GameObject();
      player.name = "player";

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

      BoundingBoxComponent bbComp = new BoundingBoxComponent();
      bbComp.w = TILE_SIZE;
      bbComp.h = TILE_SIZE;

      bbComp.mask = CollisionManager.PICKUP | CollisionManager.STRUCTURE;
      bbComp.type = CollisionManager.PLAYER;

      MarioCollisionComponent collisionComp = new MarioCollisionComponent();

      player.addComponent(bbComp);
      player.addComponent(physicsComp);
      player.addComponent(aniComp);
      player.addComponent(collisionComp);

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

      CoinCollisionComponent collisionComp = new CoinCollisionComponent();

      BoundingBoxComponent bbComp = new BoundingBoxComponent();
      bbComp.w = 10;
      bbComp.h = 20;
      bbComp.setOffsets(11, -6);
      bbComp.mask = CollisionManager.PLAYER;
      bbComp.type = CollisionManager.PICKUP;

      coin.addComponent(aniComp);
      coin.addComponent(collisionComp);
      coin.addComponent(bbComp);

      return coin;
    }

    //
    // GROUND
    //
    else if (id == "ground") {
      GameObject ground = new GameObject();
      WrapAroundComponent c = new WrapAroundComponent();
      c.imgPath = "props/structure/ground.png";
      ground.addComponent(c);

      // For now reduce collision checks and use a 'fake' ground
      /*BoundingBoxComponent boxComp = new BoundingBoxComponent();
       boxComp.w = TILE_SIZE;
       boxComp.h = TILE_SIZE;
       ground.addComponent(boxComp);
       boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;
       boxComp.type = CollisionManager.STRUCTURE;
       GroundCollisionComponent collisionComp = new GroundCollisionComponent();
       ground.addComponent(collisionComp);*/

      return ground;
    }

    //
    // CLOUD
    //
    else if (id == "cloud") {
      GameObject cloud = new GameObject();
      WrapAroundComponent c = new WrapAroundComponent();
      c.imgPath = "props/clouds/cloud1.png";
      c.extraBuffer = TILE_SIZE * 9;
      cloud.position.y = height - TILE_SIZE;
      cloud.addComponent(c);
      return cloud;
    }

    //
    // BRICK
    //
    else if ( id == "brick") {
      GameObject brick = new GameObject();
      WrapAroundComponent c = new WrapAroundComponent();
      c.imgPath = "props/structure/bricks.png";

      BrickCollisionComponent collisionComp = new BrickCollisionComponent();
      brick.addComponent(collisionComp);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.STRUCTURE;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY;

      brick.addComponent(boxComp);
      brick.addComponent(c);
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

      //GoombaControllerComponent controlComp = new GoombaControllerComponent();
      //controlComp.walk();
      //goomba.addComponent(controlComp);

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      goomba.addComponent(boxComp);

      /*PatrolEnemyPhysicsComponent physics = new PatrolEnemyPhysicsComponent();
       physics.setMaxXSpeed(32);
       physics.setVelocity(32, 0);
       goomba.addComponent(physics);*/

      GoombaCollisionComponent collisionComp = new GoombaCollisionComponent();
      goomba.addComponent(collisionComp);

      return goomba;
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

      BoundingBoxComponent boxComp = new BoundingBoxComponent();
      boxComp.w = TILE_SIZE;
      boxComp.h = TILE_SIZE;
      boxComp.type = CollisionManager.ENEMY;
      boxComp.mask = CollisionManager.PLAYER | CollisionManager.ENEMY | CollisionManager.STRUCTURE;
      spiney.addComponent(boxComp);

      //SpineyCollisionComponent collisionComp = new SpineyCollisionComponent();
      CreatureCollisionComponent collisionComp = new CreatureCollisionComponent();
      spiney.addComponent(collisionComp);

      // CreatureControllerComponent..

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
