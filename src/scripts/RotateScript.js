import { ScriptComponent } from "../ecs/Component";

export class RotateScript extends ScriptComponent {

    step(dt) {

        this.transform.rotateBy(1, 2, 3);

    }

}