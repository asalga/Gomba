/////////////////////////////////
// StructureControllerComponent
/////////////////////////////////
class StructureControllerComponent extends Component {
    
    // Properties
    // TODO: add this?
    // boolean doesHitKickSprite;

    BoundingBoxComponent boundsComponent;
    
    StructureControllerComponent() {
        super();
        componentName = "StructureControllerComponent";
    }
    
    void awake() {
        super.awake();
        boundsComponent = (BoundingBoxComponent)gameObject.getComponent("BoundingBoxComponent");
    }
    
    void update(float dt) {
        super.update(dt);
    }
    
    void render() {
    }
    
    void hit(GameObject other) {
        // Tell any sprites that are touching this structure that they just got kicked.
        for(int i = 0; i < boundsComponent.colliders.size(); i++) {
            for(String key: boundsComponent.colliders.keySet()) {
                GameObject go = boundsComponent.colliders.get(key);
                SpriteControllerComponent sprite = (SpriteControllerComponent)go.getComponent("SpriteControllerComponent");
                if(sprite != null) {
                    sprite.kick();
                }
            }
        }
    }
}