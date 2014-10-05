/////////////////////////////
// SpriteControllerComponent
/////////////////////////////
class SpriteControllerComponent extends Component {

  // SpriteController component manages behvaviour of sprites

  boolean isAlive;
  boolean squashable;
  boolean _doesHurtPlayerOnSquash;

  SpriteControllerComponent() {
    super();
    componentName = "SpriteControllerComponent";
    squashable = true;
    _doesHurtPlayerOnSquash = false;
  }

  boolean isFalling() {
    // do stuff here
    return false;
  }

  boolean canBeSquashed() {
    return squashable;
  }

  // they can be hurt in different ways..
  void hurt() {
  }

  void update(float dt){
    // TODO: fix
    if(gameObject.position.y < -500){
      gameObject.slateForRemoval();
    }
  }

  // 
  void squash() {
   if(squashable){

      gameObject.slateForRemoval();
    }
  }

  void bump() {
  }

  void walk() {
  }

  void kick(){
    gameObject.slateForRemoval();
  }

  boolean doesHurtPlayerOnSquash(){
    return _doesHurtPlayerOnSquash;
  }

  void setDoesHurtPlayerOnSquash(boolean b){
    _doesHurtPlayerOnSquash = b;
  }

  void setSquashable(boolean b){
    squashable = b;
  }

  // If hit by invinsible mario, any sprite is immediately killed
  void kill() {
    // play animation
    // set physics component
    // remove boundingbox?
  }
}
