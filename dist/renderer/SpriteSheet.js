"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpriteSheet = void 0;
var _Vector = require("../math/Vector");
var _Texture = require("./Texture");
class SpriteSheet {
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
    this.#texCoords = [_Vector.Vector2.zero, _Vector.Vector2.right, _Vector.Vector2.up, _Vector.Vector2.one];
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
    const minX = this.#cellWidth * column / this.#texture.width;
    const minY = this.#cellHeight * row / this.#texture.height;
    const maxX = this.#cellWidth * (column + 1) / this.#texture.width;
    const maxY = this.#cellHeight * (row + 1) / this.#texture.height;
    this.#texCoords[0].set(minX, minY);
    this.#texCoords[1].set(maxX, minY);
    this.#texCoords[2].set(minX, maxY);
    this.#texCoords[3].set(maxX, maxY);
    return this.#texCoords;
  }
}
exports.SpriteSheet = SpriteSheet;