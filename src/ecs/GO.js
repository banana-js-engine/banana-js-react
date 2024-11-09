import { ComponentType } from "../core/Types";
import { ComponentMap, TransformComponent } from "./Component";
import { SceneECS } from "./SceneECS";

export class GO {

    #scene;
    #handle;
    #gl

    #transform;
    active;
    
    /**
     * 
     * @param {SceneECS} scene 
     * @param {string} handle 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(scene, handle, gl, active) {
        this.#scene = scene;
        this.#handle = handle;
        this.#gl = gl;
        
        this.active = true;
        if (typeof active != 'undefined') {
            this.active = active;
        }
    }

    get scene() {
        return this.#scene;
    }

    get handle() {
        return this.#handle;
    }

    get gl() {
        return this.#gl;
    }

    /**
     * @returns {TransformComponent}
     */
    get transform() {
        if (this.#transform) {
            return this.#transform;
        }

        this.#transform = this.getComponent(ComponentType.Transform);
        return this.#transform;
    }

    createPrefab(prefab) {
        this.#scene.createPrefab(prefab);
    }

    createGameObject(name) {
        const newHandle = this.#scene.createGameObject();
        const newGameObject = new GO(this.#scene, newHandle, this.#gl);
        
        const nameComponent = newGameObject.addEmptyComponent(ComponentType.Name);
        nameComponent.name = name;

        newGameObject.addEmptyComponent(ComponentType.Transform);

        return newGameObject;
    }

    /**
     * 
     * @param {GO} gameObject
     */
    destroyGameObject(gameObject) {
        if (!gameObject instanceof GO) {
            console.warn('provide the gameObject property of the component');
            return;
        }

        this.#scene.destroyGameObject(gameObject);
    }

    getComponent(type) {
        return this.#scene.getComponent(this.#handle, type);
    }

    getComponents(type) {
        return this.#scene.getComponents(type);
    }

    hasComponent(type) {
        return this.#scene.hasComponent(this.#handle, type);
    }

    addComponent(component) {
        return this.#scene.addComponent(this.#handle, component);
    }

    addEmptyComponent(type) {
        return this.#scene.addEmptyComponent(this, type);
    }
}