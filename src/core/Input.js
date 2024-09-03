export class Input {

    /**
     * @type {HTMLCanvasElement} canvas
     */
    static #canvas;

    static #keyStates = {};
    static #isAnyKeyDown = false;

    static init() {
        this.#canvas = document.getElementById('banana-canvas');

        this.#canvas.addEventListener('keydown', (event) => {
            this.#keyStates[event.key] = true;
        });

        this.#canvas.addEventListener('keyup', (event) => {
            this.#keyStates[event.key] = false;
            this.#isAnyKeyDown = false;
        });

        // toggle every key state off
        this.#canvas.addEventListener('blur', () => {
            for (const key in this.#keyStates) {
                this.#keyStates[key] = false;
            }
        })
    }    

    static getKey(key) {
        if (!this.#keyStates[key]) {
            return false;
        }

        return this.#keyStates[key];
    }

    static getKeyDown(key) {
        if (!this.#keyStates[key]) {
            return false;
        }

        if (this.#isAnyKeyDown) {
            return false;
        }

        this.#isAnyKeyDown = true;
        return this.#keyStates[key];
    }

}