export class GameObject {
    #id;
    #scene;

    constructor(id, scene) {
        this.#id = id;
        this.#scene = scene;
    }
}