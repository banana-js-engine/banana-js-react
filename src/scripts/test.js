import { Input, KeyCode } from "../core/Input";
import { ScriptComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

export class TestClass extends ScriptComponent {
    ready() {
        this.speed = 5;
        this.transform = this.getComponent(ComponentType.Transform);
        this.audio = this.getComponent(ComponentType.Audio);
    }

    step(dt) {
        const s = this.speed * dt;

        if (Input.getKey('w') || Input.getGamepadButton(KeyCode.DpadUp)) {
            this.transform.moveBy(0, -s, 0);
        }

        if (Input.getKey('a') || Input.getGamepadButton(KeyCode.DpadLeft)) {
            this.transform.moveBy(-s, 0, 0);
        }

        if (Input.getKey('s') || Input.getGamepadButton(KeyCode.DpadDown)) {
            this.transform.moveBy(0, s, 0);
        }

        if (Input.getKey('d') || Input.getGamepadButton(KeyCode.DpadRight)) {
            this.transform.moveBy(s, 0, 0);
        }

        if (Input.getKeyDown('p')) {
            this.audio.playOnce();
        }
    }
}