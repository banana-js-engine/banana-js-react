import { TextComponent, UITextComponent } from "../ecs/Component";

export class TextRenderer {

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

    /**
     * 
     * @param {UITextComponent} uiTextComponent 
     */
    drawUIText(uiTextComponent) {
        this.#ctx.font = `${uiTextComponent.fontSize}px ${uiTextComponent.fontFamily}`;
        this.#ctx.fillStyle = uiTextComponent.color.hex;

        const position = uiTextComponent.position;

        this.#ctx.fillText(uiTextComponent.text, position.x, position.y);
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
    }
}
