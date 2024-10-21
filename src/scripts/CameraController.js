import { Input } from "../core/Input";
import { ComponentType } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";
import { Vector3 } from "../math/Vector";

export class CameraController extends ScriptComponent {

    #direction;
    #previousMousePosition;
    #speed;

    ready() {
        this.transform = this.getComponent(ComponentType.Transform);
        this.camera = this.getComponent(ComponentType.Camera);

        this.#direction = Vector3.zero;
        this.#previousMousePosition = Vector3.zero;
        this.#speed = 10;
    }

    step(dt) {
        const currentMousePosition = this.camera.screenToWorldSpace(Input.mousePosition);
        if (Input.getButton(1)) {
            this.#direction.set(0, 0, 0);

            this.#direction.x = this.#previousMousePosition.x - currentMousePosition.x;
            this.#direction.y = this.#previousMousePosition.y - currentMousePosition.y;

            this.transform.rotateBy(this.#direction.y * this.#speed, this.#direction.x * this.#speed, 0);

        }
        this.#previousMousePosition.set(currentMousePosition);

        if (Input.getButton(2)) {
            if (Input.getKey('a')) {
                this.transform.moveBy(-this.#speed * dt, 0, 0);
            }

            if (Input.getKey('w')) {
                this.transform.moveBy(0, 0, -this.#speed * dt);
            }

            if (Input.getKey('d')) {
                this.transform.moveBy(this.#speed * dt, 0, 0);
            }

            if (Input.getKey('s')) {
                this.transform.moveBy(0, 0, this.#speed * dt);
            }

            if (Input.getKey('q')) {
                this.transform.moveBy(0, this.#speed * dt, 0);
            }

            if (Input.getKey('e')) {
                this.transform.moveBy(0, -this.#speed * dt, 0);
            }
        }
    }

}