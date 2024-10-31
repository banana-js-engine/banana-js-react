import { Input } from "../core/Input";
import { ComponentType } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";
import { Vector2 } from "../math/Vector";

export class MovementScript extends ScriptComponent {

    ready() {
        this.speed = 0.1;
        this.transform = this.getComponent(ComponentType.Transform);
        this.body = this.getComponent(ComponentType.Body2D);
    }

    step(dt) {
        const s = this.speed * dt;

        if (Input.getKey('w')) {
            this.body.addForce(Vector2.down.mul(this.speed));
            // this.transform.moveBy(0, -s, 0);
        }
        if (Input.getKey('a')) {
            this.body.addForce(Vector2.left.mul(this.speed));
            // this.transform.moveBy(-s, 0, 0);
        } 
        if (Input.getKey('s')) {
            this.body.addForce(Vector2.up.mul(this.speed));
            // this.transform.moveBy(0, s, 0);
        } 
        if (Input.getKey('d')) {
            this.body.addForce(Vector2.right.mul(this.speed));
            // this.transform.moveBy(s, 0, 0);
        }
    }
}