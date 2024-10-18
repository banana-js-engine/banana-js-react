import { Input, KeyCode } from "../core/Input";
import { ScriptComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

export class TestClass extends ScriptComponent {
    ready() {
        this.speed = 5;
        this.transform = this.getComponent(ComponentType.Transform);
        this.audio = this.getComponent(ComponentType.Audio);
        this.animator = this.getComponent(ComponentType.Animator);
        this.sprite = this.getComponent(ComponentType.Sprite);
    }

    step(dt) {
        const s = this.speed * dt;
        let isMoving = false;

        if (Input.getKey('w') || Input.getGamepadButton(KeyCode.DpadUp)) {
            this.transform.moveBy(0, -s, 0);
            isMoving = true;
        }

        if (Input.getKey('a') || Input.getGamepadButton(KeyCode.DpadLeft)) {
            this.transform.moveBy(-s, 0, 0);
            isMoving = true;
            this.sprite.flipX = true;
        }

        if (Input.getKey('s') || Input.getGamepadButton(KeyCode.DpadDown)) {
            this.transform.moveBy(0, s, 0);
            isMoving = true;
        }

        if (Input.getKey('d') || Input.getGamepadButton(KeyCode.DpadRight)) {
            this.transform.moveBy(s, 0, 0);
            isMoving = true;
            this.sprite.flipX = false;
        }

        if (isMoving) {
            this.animator.playAnimation('DinoRun');
        }
        else {
            this.animator.playAnimation('DinoIdle');
        }
    }
}