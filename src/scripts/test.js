import { Input } from "../core/Input";
import { ComponentType, ScriptComponent } from "../ecs/Component";

export class TestClass extends ScriptComponent {
    ready() {
        this.speed = 5;
        this.transform = this.getComponent(ComponentType.Transform);
        
    }

    step(dt) {
        this.audio = this.getComponent(ComponentType.Audio);

        const s = this.speed * dt;

        if (Input.getKey('w')) {
            this.transform.moveBy(0, -s, 0);
        }

        if (Input.getKey('a')) {
            this.transform.moveBy(-s, 0, 0);
        }

        if (Input.getKey('s')) {
            this.transform.moveBy(0, s, 0);
        }

        if (Input.getKey('d')) {
            this.transform.moveBy(s, 0, 0);
        }

        if (Input.getKeyDown('p')) {
            this.audio.playOnce();
        }
    }
}