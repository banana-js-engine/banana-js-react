import { ComponentType } from "../ecs/Component";
import { BananaMath } from "../math/BananaMath";

/**
 * The class that controls the game-loop
 */
export class Engine {

    #running;
    #previousFrameTime;

    #rendererRef;

    #scenes;
    #activeScene;

    constructor(renderer) {
        this.#running = true;
        this.#previousFrameTime = 0;

        this.#rendererRef = renderer;

        this.#scenes = [];
        this.#activeScene = null;

        this.#rendererRef.setClearColor(0.345, 0.588, 0.809, 1);

        this.#tick();
    }

    #tick = () => {
        const currentFrameTime = performance.now();
        const deltaTimeMs = currentFrameTime - this.#previousFrameTime;
        let deltaTimeS = deltaTimeMs / 1000;

        this.#previousFrameTime = currentFrameTime;

        deltaTimeS = BananaMath.clamp(deltaTimeS, 0.01, 0.1);

        if (this.#running) {
            requestAnimationFrame(this.#tick);
        }

        this.#update(deltaTimeS);
    }

    #update(dt) {
        this.#rendererRef.clear();

        this.#rendererRef.flush();

        if (this.#activeScene) {
            const goSprites = this.#activeScene.get_all_with_entity(ComponentType.Sprite);

            for (const id in goSprites) {
                const transform = this.#activeScene.get(id, ComponentType.Transform);

                this.#rendererRef.drawQuad(transform, goSprites[id]);
            }
        }
    }

    addScene(scene) {
        this.#scenes.push(scene);
        if (this.#scenes.length === 1) {
            this.setActiveScene(0);
        }
    }

    setActiveScene(index) {
        if (index >= this.#scenes.length) {
            console.error('index cannot be bigger than number of scenes');
            return;
        } else if (index < 0) {
            console.error('negative index');
            return;
        }

        this.#activeScene = this.#scenes[index];
    }
}