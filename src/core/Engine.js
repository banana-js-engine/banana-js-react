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

    /*
        Flags for warnings to be logged once in the loop
    */
    #zeroCameraFlag;
    #multipleCameraFlag;

    constructor(renderer) {
        this.#running = true;
        this.#previousFrameTime = 0;

        this.#rendererRef = renderer;

        this.#scenes = [];
        this.#activeScene = null;

        this.#zeroCameraFlag = false;
        this.#multipleCameraFlag = false;

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
        if (this.#activeScene) {
            const goCameras = this.#activeScene.get_all_with_entity(ComponentType.Camera);
            const size = Object.keys(goCameras).length;
            let cameraTransform; 
            let cameraComponent;

            if (size === 0 && !this.#zeroCameraFlag) {
                console.warn('there are no cameras in the scene!');
                this.#zeroCameraFlag = true;
            }
            
            if (size > 1 && !this.#multipleCameraFlag) {
                console.warn('there are more than one camera in the scene!');
                this.#multipleCameraFlag = true;
            }
            
            if (size === 1) {
                const id = Object.keys(goCameras)[0];
                cameraTransform = this.#activeScene.get(id, ComponentType.Transform);
                cameraComponent = goCameras[id];

                const cc = cameraComponent.clearColor;
                this.#rendererRef.setClearColor(cc.x, cc.y, cc.z, cc.w);

            }

            // no camera, no rendering
            if (!cameraComponent) {
                return;
            }
            
            this.#rendererRef.beginScene(cameraTransform, cameraComponent);

            this.#rendererRef.clear();

            const goSprites = this.#activeScene.get_all_with_entity(ComponentType.Sprite);

            for (const id in goSprites) {
                const transform = this.#activeScene.get(id, ComponentType.Transform);

                this.#rendererRef.drawQuad(transform, goSprites[id]);
            }
            
            this.#rendererRef.endScene();
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