"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VertexArray = void 0;
var _Buffer = require("./Buffer");
class VertexArray {
  #gl;

  /**
   * @type {VertexBuffer}
   */
  #vertexBuffer;

  /**
   * @type {IndexBuffer}
   */
  #indexBuffer;
  #vertexArrayId;

  /**
   * 
   * @param {WebGL2RenderingContext} gl 
   */
  constructor(gl) {
    this.#gl = gl;
    this.#vertexArrayId = this.#gl.createVertexArray();
  }
  get VB() {
    return this.#vertexBuffer;
  }
  get IB() {
    return this.#indexBuffer;
  }
  set VB(vertexBuffer) {
    this.#vertexBuffer = vertexBuffer;
    this.bind();
    this.#vertexBuffer.bind();
    this.#vertexBuffer.linkAttributes();
  }
  set IB(indexBuffer) {
    this.#indexBuffer = indexBuffer;
    this.bind();
    this.#indexBuffer.bind();
  }
  bind() {
    this.#gl.bindVertexArray(this.#vertexArrayId);
  }
  unbind() {
    this.#gl.bindVertexArray(null);
  }
}
exports.VertexArray = VertexArray;