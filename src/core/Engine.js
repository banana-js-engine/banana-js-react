import { ComponentType, ShapeType } from "./Types";
import { BananaMath } from "../math/BananaMath";
import { Input } from "./Input";
import { World2D } from "../physics/World2D";
import { Debug } from "./Debug";
import { SceneManager } from "../ecs/SceneManager";
import { Color } from "../renderer/Color";
import { Vector2, Vector3 } from "../math/Vector";

/**
 * The class that controls the game-loop
 */
export class Engine {

    #running;
    #previousFrameTime;

    #rendererRef;

    #world2d;

    #firstUpdate
    #iteration;

    /*
     *  Flags for warnings to be logged once in the loop
    */
    #zeroCameraFlag;
    #multipleCameraFlag;

    constructor(renderer) {
        this.#running = true;
        this.#previousFrameTime = 0;

        this.#rendererRef = renderer;

        this.#world2d = new World2D();

        this.#firstUpdate = true;
        this.#iteration = 0;

        this.#zeroCameraFlag = false;
        this.#multipleCameraFlag = false;

        Input.init();

        SceneManager.onSceneChanged = () => {
            this.#world2d.clear();
            this.#firstUpdate = true;
            this.#iteration = 0;
        }

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
        const activeScene = SceneManager.activeScene;

        if (activeScene) {

            if (this.#iteration < 10) {
                this.#iteration++;
                return;
            }

            if (this.#firstUpdate) {
                this.#firstUpdate = false;

                const goBodies = activeScene.getAll(ComponentType.Body2D);

                for (let i = 0; i < goBodies.length; i++) {
                    this.#world2d.addBody(goBodies[i]);
                }

                const goAnimators = activeScene.getAll(ComponentType.Animator);

                for (let i = 0; i < goAnimators.length; i++) {
                    if (goAnimators[i].startAnim) {
                        goAnimators[i].playAnimation(goAnimators[i].startAnim);
                    }
                }

                const goScripts = activeScene.getAll(ComponentType.Script);

                for (let i = 0; i < goScripts.length; i++) {
                    goScripts[i].ready();
                }
            }

            const goScripts = activeScene.getAll(ComponentType.Script);

            for (let i = 0; i < goScripts.length; i++) {
                goScripts[i].step(dt);
            }

            const goCameras = activeScene.getAllWithEntity(ComponentType.Camera);
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
                cameraTransform = activeScene.get(id, ComponentType.Transform);
                cameraComponent = goCameras[id];

                const cc = cameraComponent.clearColor;
                this.#rendererRef.setClearColor(cc.x, cc.y, cc.z, cc.w);

            }

            this.#world2d.step(dt);

            // no camera, no rendering
            if (!cameraComponent) {
                return;
            }

            const goAnimators = activeScene.getAll(ComponentType.Animator);

            for (let i = 0; i < goAnimators.length; i++) {
                goAnimators[i].step(dt);
            }
            
            this.#rendererRef.beginScene(cameraTransform, cameraComponent);

            this.#rendererRef.clear(1);
            
            const goSprites = activeScene.getAllWithEntity(ComponentType.Sprite);

            for (const id in goSprites) {
                const transform = activeScene.get(id, ComponentType.Transform);

                this.#rendererRef.drawQuad(transform, goSprites[id]);
            }

            const goMeshes = activeScene.getAllWithEntity(ComponentType.Mesh);

            for (const id in goMeshes) {
                const transform = activeScene.get(id, ComponentType.Transform);

                this.#rendererRef.drawMesh(transform, goMeshes[id]);
            }

            if (Debug.showCollisionShapes) {
                const goBodies = activeScene.getAll(ComponentType.Body2D);

                for (let i = 0; i < goBodies.length; i++) {
                    
                    if (goBodies[i].shapeType == ShapeType.Box) {
                        const vertices = goBodies[i].vertices;
    
                        for (let j = 0; j < vertices.length; j++) {
                            this.#rendererRef.drawLine(vertices[j], vertices[(j + 1) % vertices.length], Color.green);
                        }
                    }
                }
            }

            if (Debug.showContactPoints) {
                for (let i = 0; i < this.#world2d.contactPoints.length; i++) {
                    const point = Vector3.zero;
                    point.set(this.#world2d.contactPoints[i]);
                    this.#rendererRef.drawRect(point, Vector2.one.mul(0.2), Color.orange);   
                }
            }
            
            this.#rendererRef.endScene();


            // Debug
            if (Input.getKey('control') && Input.getKey('alt') && Input.getKeyDown('s')) {
                console.log(Debug.snapshot(activeScene));
            }
        }

        Input.mouseDelta.set(0, 0);
    }   
}