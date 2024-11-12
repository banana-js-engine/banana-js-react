import { ScriptComponent } from '@mfkucuk/banana-js';

export class RotateScript extends ScriptComponent {

    step(dt) {
        this.transform.rotateBy(0, this.speed * dt, 0);
    }
}