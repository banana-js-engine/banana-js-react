import { Input } from "../core/Input";
import { ComponentType, MouseButtonCode } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";

export class ParticleScript extends ScriptComponent {

    #particle;

    ready() {
        this.#particle = this.getComponent(ComponentType.Particle);
    }

    step(dt) {
        if (Input.getButtonDown(MouseButtonCode.Left)) {
            if (this.#particle.playing) {
                this.#particle.stop();
            } else {
                this.#particle.play();
            }
        }

        this.transform.position.set(this.mainCamera.screenToWorldSpace(Input.mousePosition));
    }

}