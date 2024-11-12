import { Input } from "../core/Input";
import { ComponentType, KeyCode } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";

export class ParticleScript extends ScriptComponent {

    #particle;

    ready() {
        this.#particle = this.getComponent(ComponentType.Particle);
    }

    step(dt) {
        if (Input.getKeyDown(KeyCode.Space)) {
            if (this.#particle.playing) {
                this.#particle.stop();
            } else {
                this.#particle.play();
            }
        }
    }

}