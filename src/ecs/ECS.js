export class ECS {
    #nextGameObjectId = 0;
    #gameObjects = new Set();
    #component = {};

    #generateId() {
        return `entity-${this.#nextGameObjectId++}`;
    }

    create() {
        const id = this.#generateId();
        this.#gameObjects.add(id);
        return id;
    }

    createWithId(id) {
        this.#gameObjects.add(id);
        return id;
    }

    release(entity) {
        if (!this.#gameObjects.has(entity)) return;

        this.#gameObjects.delete(entity);

        // Efficiently remove all components associated with the entity
        for (const componentMap of Object.values(this.#component)) {
            delete componentMap[entity];
        }
    }

    valid(entity) {
        return this.#gameObjects.has(entity);
    }

    getAllEntities() {
        return Array.from(this.#gameObjects);
    }

    emplace(entity, component) {
        if (!this.valid(entity)) return;

        const { type } = component;
        (this.#component[type] ??= {})[entity] = component;

        return component;
    }

    remove(entity, componentType) {
        if (!this.valid(entity)) return;

        const componentMap = this.#component[componentType];
        if (componentMap) delete componentMap[entity];
    }

    clear() {
        this.#gameObjects.clear();
        this.#component = {};
    }

    has(entity, componentType) {
        return !!this.#component[componentType]?.[entity];
    }

    get(entity, componentType) {
        return this.#component[componentType]?.[entity] ?? null;
    }

    getAll(componentType) {
        return this.#component[componentType] ? Object.values(this.#component[componentType]) : [];
    }

    getAllWithEntity(componentType) {
        return this.#component[componentType] ?? {};
    }

    group(...componentTypes) {
        const gameObjects = Array.from(this.#gameObjects).filter(entity =>
            componentTypes.every(type => this.#component[type]?.[entity])
        );

        return gameObjects.map(entity =>
            componentTypes.map(type => this.#component[type][entity])
        );
    }
}
