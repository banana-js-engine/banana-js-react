import { Vector2 } from "../math/Vector";
import { Texture } from "./Texture";

export class SpriteSheet {

    #texture;
    #cellWidth;
    #cellHeight;

    /**
     * @type {Vector2[]} #texCoords
     */
    #texCoords;

    /**
     * 
     * @param {Texture} texture 
     * @param {Vector2} cellSize 
     */
    constructor(texture, cellWidth, cellHeight) {
        this.#texture = texture;
        this.#cellWidth = cellWidth;
        this.#cellHeight = cellHeight;

        this.#texCoords = [
            Vector2.zero,
            Vector2.right,
            Vector2.up,
            Vector2.one,
        ];
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

        this.#texCoords[0].set(minX, minY);
        this.#texCoords[1].set(maxX, minY);
        this.#texCoords[2].set(minX, maxY);
        this.#texCoords[3].set(maxX, maxY);

        return this.#texCoords;
    }
}