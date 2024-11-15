"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextRenderer = void 0;
var _Input = require("../core/Input");
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
    this.#ctx.textAlign = 'start';
    const position = textComponent.position;
    this.#ctx.fillText(textComponent.text, position.x, position.y);
  }

  /**
   * 
   * @param {UITextComponent} uiTextComponent 
   */
  drawUIText(uiTextComponent) {
    this.#ctx.font = `${uiTextComponent.fontSize}px ${uiTextComponent.fontFamily}`;
    this.#ctx.fillStyle = uiTextComponent.color.hex;
    this.#ctx.textAlign = 'start';
    this.#ctx.fillText(uiTextComponent.text, uiTextComponent.left, uiTextComponent.top);
  }

  /**
   * 
   * @param {DialogueComponent} dialogueComponent 
   * @param {number} dt
   */
  drawDialogue(dialogueComponent, dt) {
    this.#ctx.font = `${dialogueComponent.fontSize}px ${dialogueComponent.fontFamily}`;
    this.#ctx.fillStyle = dialogueComponent.color.hex;
    this.#ctx.textAlign = 'center';
    const position = dialogueComponent.position;
    this.#ctx.fillText(dialogueComponent.currentText, position.x, position.y);
    dialogueComponent.currentTime += dt;
    if (dialogueComponent.currentChar == dialogueComponent.currentDialogue.length) {
      dialogueComponent.skipToNext = true;
    }
    if (dialogueComponent.currentTime > dialogueComponent.textRollDuration && !dialogueComponent.skipToNext) {
      dialogueComponent.currentText += dialogueComponent.currentDialogue[dialogueComponent.currentChar];
      dialogueComponent.currentChar++;
      dialogueComponent.currentTime = 0;
    }
    if (_Input.Input.getKeyDown(dialogueComponent.skipKey) && dialogueComponent.skipToNext) {
      dialogueComponent.currentIndex++;
      dialogueComponent.currentChar = 0;
      dialogueComponent.currentText = '';
      dialogueComponent.skipToNext = false;
      if (!dialogueComponent.currentDialogue) {
        dialogueComponent.stopDialogue();
      }
    }
  }
  clear() {
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
  }
}
exports.TextRenderer = TextRenderer;