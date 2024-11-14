import { Vector2 } from "../math/Vector";
import { Texture } from "./Texture";

export class SpriteSheet {

    #texture;
    #cellWidth;
    #cellHeight;

    /**
     * 
     * @param {Texture} texture 
     * @param {Vector2} cellSize 
     */
    constructor(texture, cellWidth, cellHeight) {
        this.#texture = texture;
        this.#cellWidth = cellWidth;
        this.#cellHeight = cellHeight;
    }

    get maxRow() {
        return this.#texture.height / this.#cellHeight;
    }

    get maxColumn() {
        return this.#texture.width / this.#cellWidth;
    }

    get texture() {
        return this.#texture;
    }

    getTexCoords(row, column) {
        const minX = (this.#cellWidth * column) / this.#texture.width;
        const minY = (this.#cellHeight * row) / this.#texture.height;
        const maxX = (this.#cellWidth * (column + 1)) / this.#texture.width;
        const maxY = (this.#cellHeight  * (row + 1)) / this.#texture.height;

        return [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: minX, y: maxY },
            { x: maxX, y: maxY }
        ];
    }
}