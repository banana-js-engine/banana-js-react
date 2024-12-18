import { ComponentType } from "../core/Types";
import { TransformComponent } from "./Component";
import { SceneECS } from "./SceneECS";

export class GO {

    #scene;
    #handle;
    #gl

    #transform;
    #active;

    /**
     * @type {GO}
     */
    parent;

    /**
     * @type {GO[]}
     */
    children;
    
    /**
     * 
     * @param {SceneECS} scene 
     * @param {string} handle 
     * @param {WebGL2RenderingContext} gl 
     * @param {GO} parent 
     */
    constructor(scene, handle, gl, active, parent) {
        this.#scene = scene;
        this.#handle = handle;
        this.#gl = gl;
        
        this.#active = true;
        if (typeof active != 'undefined') {
            this.#active = active;
        }

        this.children = [];

        if (parent) {
            parent.addChild(this);
        } else {
            this.parent = null;
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

    get active() {
        if (this.parent != null) {
            return this.#active && this.parent.active;
        }

        return this.#active;
    }

    set active(value) {
        this.#active = value;
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

    /**
     * 
     * @param {GO} child 
     */
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    /**
     * 
     * @param {GO} child 
     */
    removeChild(child) {
        this.children = this.children.filter(c => c !== child);
        child.parent = null;
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