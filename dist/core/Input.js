"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;
var _Vector = require("../math/Vector");
class Input {
  /**
   * @type {HTMLCanvasElement} canvas
   */
  static #canvas;

  // Keyboard
  static #keyStates = {};
  static #isKeyDown = {};

  // Mouse
  static mousePosition = (() => _Vector.Vector2.zero)();
  static mouseDelta = (() => _Vector.Vector2.zero)();
  static #buttonStates = {};
  static #isButtonDown = {};

  // Touch
  static touchPosition = (() => _Vector.Vector2.zero)();
  static #isTapping;
  static #touchStartTime = (() => performance.now())();
  static #touchStartPos = (() => _Vector.Vector2.zero)();
  static #touchCurrentPos = (() => _Vector.Vector2.zero)();
  static #isProperTap;
  static TAP_MAX_DURATION = 200;
  static TAP_MAX_MOVE = 10;

  // Gamepad
  static #numOfGamepads = 0;
  static init() {
    this.#canvas = document.getElementById('banana-canvas');
    this.#canvas.addEventListener('keydown', event => {
      event.preventDefault();
      this.#keyStates[event.key.toLowerCase()] = true;
    });
    this.#canvas.addEventListener('keyup', event => {
      event.preventDefault();
      this.#keyStates[event.key.toLowerCase()] = false;
      this.#isKeyDown[event.key.toLowerCase()] = false;
    });
    this.#canvas.addEventListener('mousedown', event => {
      this.#buttonStates[event.button] = true;
    });
    this.#canvas.addEventListener('mouseup', event => {
      this.#buttonStates[event.button] = false;
      this.#isButtonDown[event.button] = false;
    });
    this.#canvas.addEventListener('mousemove', event => {
      this.mousePosition.x = event.x;
      this.mousePosition.y = event.y;
    });
    this.#canvas.addEventListener('wheel', event => {
      event.preventDefault();
      this.mouseDelta.set(event.deltaX, event.deltaY);
    });

    // Touch events
    this.#canvas.addEventListener('touchstart', event => {
      event.preventDefault();
      const touch = event.touches[0];
      this.#touchStartTime = performance.now();
      this.#touchStartPos.set(touch.clientX, touch.clientY);
      this.#isTapping = true;
    });
    this.#canvas.addEventListener('touchmove', event => {
      event.preventDefault();
      const touch = event.touches[0];
      if (!this.#isTapping) {
        this.touchPosition.set(touch.clientX, touch.clientY);
      }
      this.#touchCurrentPos.set(touch.clientX, touch.clientY);
      const moveDistanceSquared = this.#touchStartPos.distanceSquared(this.#touchCurrentPos);
      if (moveDistanceSquared > this.TAP_MAX_MOVE * this.TAP_MAX_MOVE) {
        this.#isTapping = false;
      }
    });
    this.#canvas.addEventListener('touchend', event => {
      event.preventDefault();
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
    return !!this.#keyStates[key.toLowerCase()];
  }

  /**
   * 
   * @param {string} key 
   * @returns if a key is just pressed
   */
  static getKeyDown(key) {
    key = key.toLowerCase();
    if (!this.#keyStates[key] || this.#isKeyDown[key]) return false;
    this.#isKeyDown[key] = true;
    return true;
  }
  static getButton(button) {
    return !!this.#buttonStates[button];
  }
  static getButtonDown(button) {
    if (!this.#buttonStates[button] || this.#isButtonDown[button]) return false;
    this.#isButtonDown[button] = true;
    return true;
  }
  static getTap() {
    const result = this.#isProperTap;
    this.#isProperTap = false;
    return result;
  }
  static getGamepadButton(button) {
    let gamepad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    const gamepads = navigator.getGamepads();
    return this.isGamepadConnected(gamepad) && gamepads[gamepad].buttons[button].pressed;
  }
  static isGamepadConnected() {
    let gamepad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return navigator.getGamepads()[gamepad] != null;
  }
  static #onTap() {
    this.#isProperTap = true;
  }
}
exports.Input = Input;