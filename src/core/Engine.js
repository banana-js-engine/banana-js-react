import { ComponentType, ShapeType } from "./Types";
import { clamp } from "../math/bananaMath";
import { Input } from "./Input";
import { World2D } from "../physics/World2D";
import { Debug } from "./Debug";
import { SceneManager } from "../ecs/SceneManager";
import { Color } from "../renderer/Color";
import { Vector2, Vector3 } from "../math/Vector";
import { Renderer } from "../renderer/Renderer";
import { TextRenderer } from "../renderer/TextRenderer";
import { Collisions } from "../physics/Collisions";

/**
 * The class that controls the game-loop
 */
export class Engine {

    #running;
    #previousFrameTime;

    #renderer;
    #textRenderer;

    #world2d;

    #firstUpdate
    #iteration;

    /*
     *  Flags for warnings to be logged once in the loop
    */
    #zeroCameraFlag;
    #multipleCameraFlag;

    /**
     * 
     * @param {Renderer} renderer 
     * @param {TextRenderer} textRenderer 
     */
    constructor(renderer, textRenderer) {
        this.#running = true;
        this.#previousFrameTime = 0;

        this.#renderer = renderer;
        this.#textRenderer = textRenderer;

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

        deltaTimeS = clamp(deltaTimeS, 0.01, 0.1);

        if (this.#running) {
            requestAnimationFrame(this.#tick);
        }

        this.#update(deltaTimeS);
    }

    #update(dt) {
        const activeScene = SceneManager.activeScene;

        if (!activeScene) { 
            return;
        }

        if (this.#iteration < 10) {
            this.#iteration++;
            return;
        }

        if (this.#firstUpdate) {

            const goBodies = activeScene.getAll(ComponentType.Body2D);

            for (let i = 0; i < goBodies.length; i++) {
                if (goBodies[i].active) {
                    this.#world2d.addBody(goBodies[i]);
                }
            }

            const goAnimators = activeScene.getAll(ComponentType.Animator);

            for (let i = 0; i < goAnimators.length; i++) {
                if (goAnimators[i].startAnim) {
                    goAnimators[i].playAnimation(goAnimators[i].startAnim);
                }
            }

            const goScripts = activeScene.getAll(ComponentType.Script);

            for (let i = 0; i < goScripts.length; i++) {
                if (goScripts[i].active) {
                    goScripts[i].ready();
                }
            }
        }

        const goScripts = activeScene.getAll(ComponentType.Script);

        for (let i = 0; i < goScripts.length; i++) {
            if (goScripts[i].active) {
                goScripts[i].step(dt);
            }
        }

        const goBodies = activeScene.getAll(ComponentType.Body2D);

        for (let i = 0; i < goBodies.length; i++) {
            if (goBodies[i].active) {
                this.#world2d.tryAddBody(goBodies[i]);
            }
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
            this.#renderer.setClearColor(cc.x, cc.y, cc.z, cc.w);

        }

        this.#world2d.step(dt);

        const scriptBodyGroup = activeScene.group(ComponentType.Script, ComponentType.Body2D);

        for (let i = 0; i < scriptBodyGroup.length; i++) {
            if (this.#firstUpdate) {
                if (Collisions.checkAABBCollision(scriptBodyGroup[i][1].AABB, cameraComponent.AABB)) {
                    scriptBodyGroup[i][0].outOfViewport = false;
                } else {
                    scriptBodyGroup[i][0].outOfViewport = true;
                }
            } else {
                if (!scriptBodyGroup[i][0].active) {
                    continue;
                }

                if (Collisions.checkAABBCollision(scriptBodyGroup[i][1].AABB, cameraComponent.AABB) 
                    && scriptBodyGroup[i][0].outOfViewport) {
                    scriptBodyGroup[i][0].outOfViewport = false;
                    scriptBodyGroup[i][0].onEnterViewport();
                } else if (!Collisions.checkAABBCollision(scriptBodyGroup[i][1].AABB, cameraComponent.AABB)
                    && !scriptBodyGroup[i][0].outOfViewport) {
                    scriptBodyGroup[i][0].outOfViewport = true;
                    scriptBodyGroup[i][0].onExitViewport();
                }
            }
        }

        // no camera, no rendering
        if (!cameraComponent) {
            return;
        }

        const goAnimators = activeScene.getAll(ComponentType.Animator);

        for (let i = 0; i < goAnimators.length; i++) {
            if (goAnimators[i].active) {
                goAnimators[i].step(dt);
            }
        }
        
        this.#renderer.beginScene(cameraTransform, cameraComponent);

        this.#renderer.clear();
        
        const goSprites = activeScene.getAllWithEntity(ComponentType.Sprite);

        for (const id in goSprites) {
            if (!goSprites[id].active) {
                continue;
            }

            const transform = activeScene.get(id, ComponentType.Transform);
            
            if (activeScene.has(id, ComponentType.Body2D)) {
                const body = activeScene.get(id, ComponentType.Body2D);
                
                if (Collisions.checkAABBCollision(body.AABB, cameraComponent.AABB)) {
                    this.#renderer.drawQuad(transform, goSprites[id]);
                }
            } else {
                this.#renderer.drawQuad(transform, goSprites[id]);
            }
        }

        const goMeshes = activeScene.getAllWithEntity(ComponentType.Mesh);

        for (const id in goMeshes) {
            if (!goMeshes[id].active) {
                continue;
            }

            const transform = activeScene.get(id, ComponentType.Transform);

            this.#renderer.drawMesh(transform, goMeshes[id]);
        }

        if (Debug.showCollisionShapes) {
            const goBodies = activeScene.getAll(ComponentType.Body2D);

            for (let i = 0; i < goBodies.length; i++) {
                
                if (goBodies[i].shapeType == ShapeType.Box) {
                    const vertices = goBodies[i].vertices;

                    for (let j = 0; j < vertices.length; j++) {
                        this.#renderer.drawLine(vertices[j], vertices[(j + 1) % vertices.length], Color.green);
                    }
                }
            }
        }

        if (Debug.showContactPoints) {
            for (let i = 0; i < this.#world2d.contactPoints.length; i++) {
                const point = Vector3.zero;
                point.set(this.#world2d.contactPoints[i]);
                this.#renderer.drawRect(point, Vector2.one.mul(0.2), Color.orange);   
            }
        }
        
        this.#renderer.endScene();

        this.#textRenderer.clear();

        const goTexts = activeScene.getAll(ComponentType.Text);

        for (let i = 0; i < goTexts.length; i++) {
            if (goTexts[i].active) {
                this.#textRenderer.drawText(goTexts[i]);
            }
        }

        Input.mouseDelta.set(0, 0);

        this.#firstUpdate = false;
    }
}
