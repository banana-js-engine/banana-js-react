import { ScriptComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

export class RotateScript extends ScriptComponent {
    ready() {
        this.speed = 50;
        this.transform = this.getComponent(ComponentType.Transform);
    }

    step(dt) {
        const s = this.speed * dt;
        this.transform.rotateBy(0, s, 0);
    }
}