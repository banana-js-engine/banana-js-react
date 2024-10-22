"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VertexBuffer = exports.IndexBuffer = void 0;
/**
 * Class that encapsulates WebGL vertex buffers (gl.ARRAY_BUFFER)
 */
class VertexBuffer {
  #gl;
  #bufferId;
  #data;
  #usage;
  #offset;
  #stride;
  #attributes;

  /**
   * Create a vertex buffer
   * @param {WebGL2RenderingContext} gl the WebGL context
   * @param {Float32Array | number} data the vertex data to be rendered
   */
  constructor(gl, data) {
    this.#gl = gl;
    this.#bufferId = this.#gl.createBuffer();

    /*
     * if the data supplied is a list that means the rendering will be static
     * if it's a number which only determines the size, the rendering will be dynamic  
     */
    if (data instanceof Float32Array) {
      this.#data = data;
      this.#usage = this.#gl.STATIC_DRAW;
    } else if (typeof data == 'number') {
      this.#data = new Float32Array(data);
      this.#usage = this.#gl.DYNAMIC_DRAW;
    } else {
      console.error(`${typeof data} is not supported for vertex buffers`);
      return;
    }
    this.#offset = 0;
    this.#stride = 0;
    this.#attributes = [];
    this.bind();
  }

  /**
   * Binds the vertex buffer
   */
  bind() {
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#bufferId);
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, this.#data, this.#usage);
    this.linkAttributes();
  }

  /**
   * Unbinds the vertex buffer
   */
  unbind() {
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, null);
  }

  /**
   * Adds attributes to the vertex buffer in a way the vertex shader can interpret
   * @param {number} location a number that represent the location of the attribute (obtained from the shader)
   * @param {number} count number of values this attribute has
   * @param {boolean} normalized 
   */
  pushAttribute(location, count) {
    let normalized = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    this.#attributes.push({
      location,
      count,
      normalized
    });
    this.#stride += 4 * count;
  }

  /**
   * Binds attributes
   */
  linkAttributes() {
    this.#attributes.forEach(attribute => {
      this.#gl.enableVertexAttribArray(attribute.location);
      this.#gl.vertexAttribPointer(attribute.location, attribute.count, this.#gl.FLOAT, attribute.normalized, this.#stride, this.#offset);
      this.#offset += 4 * attribute.count;
    });
    this.#offset = 0;
  }

  /**
   * add vertices to the vertex buffer with this function in case its dynamic draw
   * @param {number} index at which index to place the vertex
   * @param {Array} vertex to be added
   */
  addVertex(index, vertex) {
    for (let i = 0; i < vertex.length; i++) {
      this.#data[index * vertex.length + i] = vertex[i];
    }
  }
}

/**
 * Class that encapsulates WebGL index buffers (gl.ELEMENT_ARRAY_BUFFER)
 */
exports.VertexBuffer = VertexBuffer;
class IndexBuffer {
  #gl;
  #bufferId;
  #data;

  /**
   * Create a index buffer
   * @param {WebGL2RenderingContext} gl the WebGL context
   * @param {Uint16Array} data the index data to be mapped to the bound vertex buffer
   */
  constructor(gl, data) {
    this.#gl = gl;
    this.#bufferId = this.#gl.createBuffer();
    this.#data = data;
    this.bind();
  }
  bind() {
    this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, this.#bufferId);
    this.#gl.bufferData(this.#gl.ELEMENT_ARRAY_BUFFER, this.#data, this.#gl.STATIC_DRAW);
  }
  unbind() {
    this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, null);
  }
  getCount() {
    return this.#data.length;
  }
}
exports.IndexBuffer = IndexBuffer;