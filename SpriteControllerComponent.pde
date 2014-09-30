/////////////////////////////
// SpriteControllerComponent
/////////////////////////////
class SpriteControllerComponent extends Component {

  // SpriteController component manages behvaviour of sprites

  boolean isAlive;
  boolean squashable;

  SpriteControllerComponent() {
    super();
    componentName = "SpriteControllerComponent";
    squashable = true;
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

  // If hit by invinsible mario, any sprite is immediately killed
  void kill() {
    // play animation
    // set physics component
    // remove boundingbox?
  }
}

