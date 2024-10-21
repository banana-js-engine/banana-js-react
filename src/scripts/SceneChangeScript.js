import { Input } from "../core/Input";
import { ScriptComponent } from "../ecs/Component";
import { SceneManager } from "../ecs/SceneManager";

export class SceneChangeScript extends ScriptComponent {

    step(dt) {
        if (Input.getKeyDown('1')) {
            SceneManager.setActiveScene(0);
        }
        if (Input.getKeyDown('2')) {
            SceneManager.setActiveScene(1);
        }
        if (Input.getKeyDown('3')) {
            SceneManager.setActiveScene(2);
        }
    }

}