import { ScriptComponent } from "../ecs/Component";

export class RotateScript extends ScriptComponent {

    step(dt) {
        this.transform.rotateBy(0, this.speed * dt, 0);
    }
}