import { Vector2 } from "../math/Vector";

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
    static mouseDelta = Vector2.zero;
    static #buttonStates = {};
    static #isButtonDown = {};

    // Touch
    static touchPosition = Vector2.zero;

    static #isTouching;
    static #isTapping;
    static #touchStartTime = performance.now();
    static #touchStartPos = Vector2.zero;
    static #touchCurrentPos = Vector2.zero;
    static #isProperTap;

    static TAP_MAX_DURATION = 200;
    static TAP_MAX_MOVE = 10;

    // Gamepad
    static #numOfGamepads = 0;

    static init() {
        this.#canvas = document.getElementById('banana-canvas');

        this.#canvas.addEventListener('keydown', (event) => {
            event.preventDefault();
            this.#keyStates[event.key.toLowerCase()] = true;
        });
        
        this.#canvas.addEventListener('keyup', (event) => {
            event.preventDefault();
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

        this.#canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            this.mouseDelta.set(event.deltaX, event.deltaY);
        });

        // Touch events
        this.#canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.#isTouching = true;
            const touch = event.touches[0];

            this.#touchStartTime = performance.now();
            this.#touchStartPos.set(touch.clientX, touch.clientY);
            this.#isTapping = true;
        });

        this.#canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touch = event.touches[0];

            if (!this.#isTapping) {
                this.touchPosition.set(touch.clientX, touch.clientY);
            }

            this.#touchCurrentPos.set(touch.clientX, touch.clientY);
            
            const moveDistance = this.#touchStartPos.distance(this.#touchCurrentPos);
            if (moveDistance > this.TAP_MAX_MOVE) {
                this.#isTapping = false;
            }
        });

        this.#canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.#isTouching = false;

            const touchDuration = performance.now() - this.#touchStartTime;
            if (this.#isTapping && touchDuration <= this.TAP_MAX_DURATION) {
                this.#onTap();
            }
        });

        // toggle every key state off
        this.#canvas.addEventListener('blur', () => {
            for (const key in this.#keyStates) {
                this.#keyStates[key] = false;
                this.#isKeyDown[key] = false;
            }
        });

        this.#canvas.addEventListener('mouseleave', () => {
            for (const button in this.#buttonStates) {
                this.#buttonStates[button] = false;
                this.#isButtonDown[button] = false;
            }
        });
    }    

    /**
     * 
     * @param {string} key 
     * @returns if a key is being held down
     */
    static getKey(key) {
        key = key.toLowerCase();
        if (!this.#keyStates[key]) {
            return false;
        }

        return this.#keyStates[key];
    }

    /**
     * 
     * @param {string} key 
     * @returns if a key is just pressed
     */
    static getKeyDown(key) {
        key = key.toLowerCase();
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

    static getTap() {
        const result = this.#isProperTap;
        this.#isProperTap = false;
        return result;
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

    static #onTap() {
        this.#isProperTap = true;
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