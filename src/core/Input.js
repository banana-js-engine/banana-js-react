import { Vector2 } from "../math/Vector";

export const KeyCode = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    DpadUp: 12 ,
    DpadDown: 13,
    DpadLeft: 14,
    DpadRight: 15,
};

export class Input {

    /**
     * @type {HTMLCanvasElement} canvas
     */
    static #canvas;

    // Keyboard
    static #keyStates = {};
    static #isKeyDown = {};

    // Mouse
    static mousePosition = Vector2.zero;
    static #buttonStates = {};
    static #isButtonDown = {};

    // Gamepad
    static #numOfGamepads = 0;

    static init() {
        this.#canvas = document.getElementById('banana-canvas');

        this.#canvas.addEventListener('keydown', (event) => {
            this.#keyStates[event.key.toLowerCase()] = true;
        });

        this.#canvas.addEventListener('keyup', (event) => {
            this.#keyStates[event.key.toLowerCase()] = false;
            this.#isKeyDown[event.key.toLowerCase()] = false;
        });

        this.#canvas.addEventListener('mousedown', (event) => {
            this.#buttonStates[event.button] = true;
        });

        this.#canvas.addEventListener('mouseup', (event) => {
            this.#buttonStates[event.button] = false;
            this.#isButtonDown[event.button] = false;
        });

        this.#canvas.addEventListener('mousemove', (event) => {
            this.mousePosition.x = event.x;
            this.mousePosition.y = event.y;
        });

        // toggle every key state off
        this.#canvas.addEventListener('blur', () => {
            for (const key in this.#keyStates) {
                this.#keyStates[key] = false;
                this.#isKeyDown[key] = false;
            }

            for (const button in this.#buttonStates) {
                this.#buttonStates[button] = false;
                this.#isButtonDown[button] = false;
            }
        });
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

        if (this.#isKeyDown[key]) {
            return false;
        }

        this.#isKeyDown[key] = true;
        return this.#keyStates[key];
    }

    static getButton(button) {
        if (!this.#buttonStates[button]) {
            return false;
        }

        return this.#buttonStates[button];
    }

    static getButtonDown(button) {
        if (!this.#buttonStates[button]) {
            return false;
        }

        if (this.#isButtonDown[button]) {
            return false;
        }

        this.#isButtonDown[button] = true;
        return this.#buttonStates[button];
    }

    static getGamepadButton(button, gamepad = 0) {
        if (gamepad > navigator.getGamepads().length) {
            return false;
        }

        if (this.isGamepadConnected()) {
            return navigator.getGamepads()[gamepad].buttons[button].pressed;
        }
        else {
            return false;
        }
    }

    static isGamepadConnected(gamepad = 0) {
        return navigator.getGamepads()[gamepad] != null;
    }

    /**
     * 
     * @param {GamepadEvent} event 
     */
    static #onGamepadConnected(event) {
        this.#numOfGamepads++;
    }

    /**
     * 
     * @param {GamepadEvent} event 
     */
    static #onGamepadDisconnected(event) {
        this.#numOfGamepads--;
    }
}