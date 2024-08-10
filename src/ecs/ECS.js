export class ECS {
    #count;
    #list;
    #component;

    constructor() {
        this.#count = 0;
        this.#list = [];
        this.#component = {};
    }

    create() {
        const id = GUID.generateGUID();
    
        this.#list[this.#count++] = id;

        return id;
    }

    create_with_id(id) {
        this.#list[this.#count++] = id;

        return id;
    }

    release(entity) {
        const index = this.#list.indexOf(entity);

        if (index == -1) {
            return;
        }

        this.#list.splice(index, 1);
        this.#count--;

        // Remove all components associated with the entity
        Object.values(this.#component).forEach(componentMap => {
            if (componentMap[entity]) {
                delete componentMap[entity];
            }
        });
    }

    valid(entity) {
        return this.#list.indexOf(entity) != -1;
    }

    get_all_entities() {
        return this.#list;
    }

    // component functions
    emplace(entity, component) {
        if (!this.valid(entity)) {
            return;
        }

        if (this.#component[component.type]) {
            this.#component[component.type] = {};
        }

        this.#component[component.type][entity] = component;

        return component;
    }

    remove(entity, componentType) {
        if (!this.valid(entity) || !this.#component[componentType]) {
            return;
        }

        delete this.#component[componentType][entity];
    }

    clear() {
        this.#list = [];
        this.#count = 0;
        this.#component = {};
    }

    has(entity, componentType) {
        if (typeof this.#component[componentType]) {
            this.#component[componentType] = {};
        }

        return this.#component[componentType][entity] != null;
    }

    get(entity, componentType) {
        if (!this.valid(entity) || !this.#component[componentType]) {
            return;
        }

        return this.#component[componentType][entity] || null;
    }

    get_all(componentType) {
        if (!this.#component[componentType]) {
            return [];
        }

        return Object.values(this.#component[componentType]);
    }

    get_all_with_entity(componentType) {
        if (!this.#component[componentType]) {
            return {};
        }

        return this.#component[componentType];
    }

    group(...componentType) {
        return this.#list.filter(entity =>
            componentType.every(componentType =>
                this.#component[componentType] && this.#component[componentType][entity]
            )
        );
    }
}