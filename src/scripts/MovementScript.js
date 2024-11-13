import { Input } from "../core/Input";
import { ComponentType, KeyCode } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";
import { Vector2 } from "../math/Vector";
import { Test } from "../prefabs/Test";

export class MovementScript extends ScriptComponent {

    ready() {
        this.body = this.getComponent(ComponentType.Body2D);
        this.text = this.getComponent(ComponentType.Text);
    }

    step(dt) {
        if (Input.getKey(KeyCode.W)) {
            //this.body.addForce(Vector2.down.mul(this.speed));
            this.transform.moveBy(0, -this.speed, 0);
        }
        if (Input.getKey(KeyCode.A)) {
            //this.body.addForce(Vector2.left.mul(this.speed));
            this.transform.moveBy(-this.speed, 0, 0);
        } 
        if (Input.getKey(KeyCode.S)) {
            //this.body.addForce(Vector2.up.mul(this.speed));
            this.transform.moveBy(0, this.speed, 0);
        } 
        if (Input.getKey(KeyCode.D)) {
            //this.body.addForce(Vector2.right.mul(this.speed));
            this.transform.moveBy(this.speed, 0, 0);
        }

        if (Input.getKeyDown(KeyCode.C)) {
            // const gameObject = this.createGameObject('TEST');
            // gameObject.addEmptyComponent(ComponentType.Sprite);
            // gameObject.addEmptyComponent(ComponentType.Body2D);

            this.createPrefab(<Test/>);
        }
    }

    onExitViewport() {
        console.log('viewport exit');
        this.test();
    }
    
    onEnterViewport() {
        console.log('viewport enter');
    }

    onCollisionEnter2D(other) {
        console.log('collision enter');
    }

    onCollisionExit2D(other) {
        console.log('collision exit');
    }
}
