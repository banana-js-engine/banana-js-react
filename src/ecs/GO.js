import { ComponentType } from "../core/Types";
import { ComponentMap } from "./Component";
import { ECS } from "./ECS";

export class GO {

    #scene;
    #handle;
    #gl

    active;
    
    /**
     * 
     * @param {ECS} scene 
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

    createGameObject(name) {
        const newHandle = this.#scene.create();
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

        this.#scene.release(gameObject.handle);
    }

    getComponent(type) {
        return this.#scene.get(this.#handle, type);
    }

    getComponents(type) {
        return this.#scene.getAll(type);
    }

    hasComponent(type) {
        return this.#scene.has(this.#handle, type);
    }

    addComponent(component) {
        return this.#scene.emplace(this.#handle, component);
    }

    addEmptyComponent(type) {
        if (type == ComponentType.Body2D) {
            return this.#scene.emplace(this.#handle, (ComponentMap[type])(this));
        }

        return this.#scene.emplace(this.#handle, new (ComponentMap[type])(this));
    }
}