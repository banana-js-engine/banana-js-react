"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextRenderer = void 0;
var _Component = require("../ecs/Component");
class TextRenderer {
  #ctx;

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.#ctx = ctx;
  }

  /**
   * @param {TextComponent} textComponent
   */
  drawText(textComponent) {
    this.#ctx.font = `${textComponent.fontSize}px ${textComponent.fontFamily}`;
    this.#ctx.fillStyle = textComponent.color.hex;
    const position = textComponent.position;
    this.#ctx.fillText(textComponent.text, position.x, position.y);
  }
  clear() {
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
  }
}
exports.TextRenderer = TextRenderer;