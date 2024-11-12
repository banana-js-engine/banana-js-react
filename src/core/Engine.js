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
import { SceneECS } from "../ecs/SceneECS";

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

    #tick = (timestamp) => {
        const deltaTimeS = clamp((timestamp - this.#previousFrameTime) / 1000, 0.01, 0.1);
        this.#previousFrameTime = timestamp;
        if (this.#running) {
            requestAnimationFrame(this.#tick);
        }
        this.#update(deltaTimeS);
    }

    #update(dt) {

        /**
         * @type {SceneECS} activeScene
         */
        const activeScene = SceneManager.activeScene;

        if (!activeScene) { 
            return;
        }

        if (this.#iteration < 60) {
            this.#iteration++;
            return;
        }

        const goAnimators = activeScene.getComponents(ComponentType.Animator);

        if (this.#firstUpdate) {
            for (let i = 0; i < goAnimators.length; i++) {
                if (goAnimators[i].startAnim) {
                    goAnimators[i].playAnimation(goAnimators[i].startAnim);
                }
            }
        }

        const goScripts = activeScene.getComponents(ComponentType.Script);

        for (let i = 0; i < goScripts.length; i++) {
            if (goScripts[i].active) {
                if (!goScripts[i].readyCalled) {
                    goScripts[i].readyCalled = true;
                    goScripts[i].ready();
                }

                goScripts[i].step(dt);
            }
        }

        this.#world2d.clear();

        const goBodies = activeScene.getComponents(ComponentType.Body2D);

        for (let i = 0; i < goBodies.length; i++) {
            if (goBodies[i].active) {
                this.#world2d.addBody(goBodies[i]);
            }
        }

        const goCameras = activeScene.getComponentsWithIds(ComponentType.Camera);
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
            cameraTransform = goCameras[id].getComponent(ComponentType.Transform);
            cameraComponent = goCameras[id];

            const cc = cameraComponent.clearColor;
            this.#renderer.setClearColor(cc.x, cc.y, cc.z, cc.w);

        }

        this.#world2d.step(dt);

        const scriptBodyGroup = activeScene.groupComponents(ComponentType.Script, ComponentType.Body2D);

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

        const goLights = activeScene.getComponents(ComponentType.Light);
        if (goLights.length == 0) {
            console.warn('No light in the scene');
        }

        for (let i = 0; i < goAnimators.length; i++) {
            if (goAnimators[i].active) {
                goAnimators[i].step(dt);
            }
        }
        
        this.#renderer.beginScene(cameraTransform, cameraComponent, goLights);

        this.#renderer.clear();
        
        const goSprites = activeScene.getComponents(ComponentType.Sprite);

        for (let i = 0; i < goSprites.length; i++) {
            if (!goSprites[i].active) {
                continue;
            }
            
            if (goSprites[i].hasComponent(ComponentType.Body2D)) {
                const body = goSprites[i].getComponent(ComponentType.Body2D);
                
                if (Collisions.checkAABBCollision(body.AABB, cameraComponent.AABB)) {
                    this.#renderer.drawQuad(goSprites[i]);
                }
            } else {
                this.#renderer.drawQuad(goSprites[i]);
            }
        }

        const goMeshes = activeScene.getComponents(ComponentType.Mesh);

        for (let i = 0; i < goMeshes.length; i++) {
            if (!goMeshes[i].active) {
                continue;
            }

            this.#renderer.drawMesh(goMeshes[i]);
        }

        const goParticles = activeScene.getComponents(ComponentType.Particle);

        for (let i = 0; i < goParticles.length; i++) {
            if (!goParticles[i].active) {
                continue;
            }

            this.#renderer.drawParticle(goParticles[i], dt);
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
        
        this.#renderer.endScene(dt);

        this.#textRenderer.clear();

        const goTexts = activeScene.getComponents(ComponentType.Text);

        for (let i = 0; i < goTexts.length; i++) {
            if (goTexts[i].active) {
                this.#textRenderer.drawText(goTexts[i]);
            }
        }

        const goUITexts = activeScene.getComponents(ComponentType.UIText);

        for (let i = 0; i < goUITexts.length; i++) {
            if (goUITexts[i].active) {
                this.#textRenderer.drawUIText(goUITexts[i]);
            }
        }

        Input.mouseDelta.set(0, 0);

        this.#firstUpdate = false;
    }
}
