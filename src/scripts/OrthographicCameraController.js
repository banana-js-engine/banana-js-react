import { Input } from "../core/Input";
import { ComponentType, KeyCode, MouseButtonCode } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";
import { Vector3 } from "../math/Vector";

export class OrthographicCameraController extends ScriptComponent {

    #direction;
    #previousMousePosition;
    #rotationSpeed;

    ready() {
        this.camera = this.getComponent(ComponentType.Camera);

        this.#direction = Vector3.zero;
        this.#previousMousePosition = Vector3.zero;
        this.#rotationSpeed = 20;
    }

    step(dt) {
        const currentMousePosition = this.camera.screenToWorldSpace(Input.mousePosition);
        
        if (Input.getButton(MouseButtonCode.Middle)) {

            // rotation
            this.#direction.set(0, 0, 0);

            this.#direction.x = this.#previousMousePosition.x - currentMousePosition.x;
            this.#direction.y = this.#previousMousePosition.y - currentMousePosition.y;

            this.transform.rotateBy(-this.#direction.y * this.#rotationSpeed, this.#direction.x * this.#rotationSpeed, 0);
        }

        this.#previousMousePosition.set(currentMousePosition);

        if (Input.mouseDelta.y > 0) {
            this.camera.size++;
            this.camera.setOrthographic();
        } else if (Input.mouseDelta.y < 0) {
            this.camera.size--;
            this.camera.setOrthographic();
        }
    }

}