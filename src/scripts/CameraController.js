import { Input } from "../core/Input";
import { ComponentType } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";

export class CameraController extends ScriptComponent {

    ready() {
        this.transform = this.getComponent(ComponentType.Transform);
    }

    step(dt) {
        if (Input.getButton(1)) {
            console.log('a');
        }
    }

}