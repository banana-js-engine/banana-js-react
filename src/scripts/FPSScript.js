import { ComponentType } from "../core/Types";
import { ScriptComponent } from "../ecs/Component";

export class FPSScript extends ScriptComponent {

    #text;

    ready() {
        this.#text = this.getComponent(ComponentType.Text);
    }

    step(dt) {
        const fps = 1 / dt;
        this.#text.text = `FPS: ${fps.toFixed(2)}`;
    }

}