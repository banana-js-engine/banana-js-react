import { ECS } from "./ECS";
import { GO } from "./GO";
import { ComponentType } from "../core/Types";
import { ComponentMap } from "./Component";
import React from "react";

export class SceneECS {

    #ecs;

    prefabs;

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.#ecs = ecs;

        this.prefabs = [];
    }

    createPrefab(prefab) {
        const len = this.prefabs.length;
        this.prefabs.push(<React.Fragment key={len}>{prefab}</React.Fragment>);
        this.onPrefabCreated();
    }

    createGameObject() {
        return this.#ecs.create();
    }

    /**
     * @param {GO} gameObject 
     */
    destroyGameObject(gameObject) {
        this.#ecs.release(gameObject.handle);
    }

    addComponent(handle, component) {
        return this.#ecs.emplace(handle, component);
    }

    addEmptyComponent(go, type) {
        if (type == ComponentType.Body2D) {
            return this.#ecs.emplace(go.handle, (ComponentMap[type])(go));
        }

        return this.#ecs.emplace(go.handle, new (ComponentMap[type])(go));
    }

    getComponent(handle, type) {
        return this.#ecs.get(handle, type);
    }

    getComponents(type) {
        return this.#ecs.getAll(type);
    }

    hasComponent(handle, type) {
        return this.#ecs.has(handle, type);
    }

    getComponentsWithIds(type) {
        return this.#ecs.getAllWithEntity(type);
    }

    groupComponents(...types) {
        return this.#ecs.group(...types);
    }
}