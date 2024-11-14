import { Input } from "../core/Input";
import { ComponentType, MouseButtonCode } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";

export class ParticleScript extends ScriptComponent {

    #particle;
    #light;

    ready() {
        this.#particle = this.getComponent(ComponentType.Particle);
        this.#light = this.getComponent(ComponentType.Light);
    }

    step(dt) {
        if (Input.getButtonDown(MouseButtonCode.Left)) {
            this.#light.toggle();
            if (this.#particle.playing) {
                this.#particle.stop();
            } else {
                this.#particle.play();
            }
        }
    }

}