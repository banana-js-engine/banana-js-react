import { BananaMath } from "../math/BananaMath";

/**
 * The class that controls the game-loop
 */
export class Engine {

    #running;
    #previousFrameTime;

    constructor() {
        this.#running = true;
        this.#previousFrameTime = 0;

        this.#tick();
    }

    #tick = () => {
        const currentFrameTime = performance.now();
        const deltaTimeMs = currentFrameTime - this.#previousFrameTime;
        let deltaTimeS = deltaTimeMs / 1000;

        this.#previousFrameTime = currentFrameTime;

        deltaTimeS = BananaMath.clamp(deltaTimeS, 0.01, 0.1);

        requestAnimationFrame(this.#tick);

        console.log(deltaTimeS);
    }

}