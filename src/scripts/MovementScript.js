import { Input } from "../core/Input";
import { ComponentType } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";
import { Vector2 } from "../math/Vector";
import { Test } from "../prefabs/Test";

export class MovementScript extends ScriptComponent {

    ready() {
        this.body = this.getComponent(ComponentType.Body2D);
        this.text = this.getComponent(ComponentType.Text);

        console.log('a')
    }

    step(dt) {
        if (Input.getKey('w')) {
            this.body.addForce(Vector2.down.mul(this.speed));
        }
        if (Input.getKey('a')) {
            this.body.addForce(Vector2.left.mul(this.speed));
        } 
        if (Input.getKey('s')) {
            this.body.addForce(Vector2.up.mul(this.speed));
        } 
        if (Input.getKey('d')) {
            this.body.addForce(Vector2.right.mul(this.speed));
        }

        if (Input.getKeyDown('c')) {
            // const gameObject = this.createGameObject('TEST');
            // gameObject.addEmptyComponent(ComponentType.Sprite);
            // gameObject.addEmptyComponent(ComponentType.Body2D);

            this.createPrefab(<Test/>);
        }
    }

    onExitViewport() {
        console.log('exit');
        this.test();
    }
    
    onEnterViewport() {
        console.log('enter');
    }

    onCollisionEnter2D(other) {
        console.log('collision enter');
    }

    onCollisionExit2D(other) {
        console.log('collision exit');
    }
}
