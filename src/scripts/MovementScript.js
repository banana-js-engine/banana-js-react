import { Input } from "../core/Input";
import { ComponentType } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";
import { Vector2 } from "../math/Vector";

export class MovementScript extends ScriptComponent {

    ready() {
        this.transform = this.getComponent(ComponentType.Transform);
        this.body = this.getComponent(ComponentType.Body2D);
        this.text = this.getComponent(ComponentType.Text);
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
            const transform = this.create('TEST');
            transform.addComponent(ComponentType.Sprite);
            transform.addComponent(ComponentType.Body2D);
        }
    }

    onExitViewport() {
        console.log('exit');
        this.test();
    }
    
    onEnterViewport() {
        console.log('enter');
    }
}
