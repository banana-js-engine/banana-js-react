"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Shader = void 0;
/**
 * Class that represents WebGL shaders
 */
class Shader {
  static get quadShader16Path() {
    return 'shader/quad_shader_16.glsl';
  }
  static get quadShader48Path() {
    return 'shader/quad_shader_48.glsl';
  }
  static get lineShaderPath() {
    return 'shader/line_shader.glsl';
  }
  static get smallMeshShaderPath() {
    return 'shader/small_mesh_shader.glsl';
  }
  static get largeMeshShaderPath() {
    return 'shader/large_mesh_shader.glsl';
  }
  static get particleUpdateShaderPath() {
    return 'shader/particle_update_shader.glsl';
  }
  static get particleRenderShaderPath() {
    return 'shader/particle_render_shader.glsl';
  }
  #gl;
  #shaderId;
  #uniformLookupTable;

  /**
   * Create a shader
   * @param {WebGL2RenderingContext} gl the WebGL context
   * @param {string} source source to the shader
   */
  constructor(gl, source, tfv) {
    this.#gl = gl;
    this.#shaderId = this.#compile(source, tfv);
    this.#uniformLookupTable = {};
    this.bind();
  }

  /**
   * Compile vertex and fragment shader and then link them
   * @param {string} source source to the shader 
   * @returns the program (or the shader) id
   */
  #compile(source, tfv) {
    // load the source file
    const xhr = new XMLHttpRequest();
    xhr.open('GET', source, false);
    xhr.send(null);
    const shaderScript = xhr.responseText;
    const vertexScript = shaderScript.slice(0, shaderScript.indexOf('#', 1));
    const fragmentScript = shaderScript.slice(shaderScript.indexOf('#', 1));

    // compile the vertex shader
    const vertexShader = this.#gl.createShader(this.#gl.VERTEX_SHADER);
    this.#gl.shaderSource(vertexShader, vertexScript);
    this.#gl.compileShader(vertexShader);
    if (!this.#gl.getShaderParameter(vertexShader, this.#gl.COMPILE_STATUS)) {
      alert(this.#gl.getShaderInfoLog(vertexShader));
      return null;
    }

    // compile the fragment shader
    const fragmentShader = this.#gl.createShader(this.#gl.FRAGMENT_SHADER);
    this.#gl.shaderSource(fragmentShader, fragmentScript);
    this.#gl.compileShader(fragmentShader);
    if (!this.#gl.getShaderParameter(fragmentShader, this.#gl.COMPILE_STATUS)) {
      alert(this.#gl.getShaderInfoLog(fragmentShader));
      return null;
    }

    // link the two shaders
    const program = this.#gl.createProgram();
    this.#gl.attachShader(program, vertexShader);
    this.#gl.attachShader(program, fragmentShader);
    if (tfv) {
      this.#gl.transformFeedbackVaryings(program, tfv, this.#gl.INTERLEAVED_ATTRIBS);
    }
    this.#gl.linkProgram(program);
    if (!this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS)) {
      alert(this.#gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  /**
   * Binds the shader
   */
  bind() {
    this.#gl.useProgram(this.#shaderId);
  }

  /**
   * Unbinds the shader
   */
  unbind() {
    this.#gl.useProgram(null);
  }

  /**
   * @param {string} name name of the attribute (starting with a_) 
   * @returns the location of the attribute
   */
  getAttributeLocation(name) {
    return this.#gl.getAttribLocation(this.#shaderId, name);
  }

  /**
   * @param {string} name name of the uniform (starting with u_) 
   * @returns the location of the uniform
   */
  #getUniformLocation(name) {
    if (this.#uniformLookupTable[name]) {
      return this.#uniformLookupTable[name];
    }
    const uniformLocation = this.#gl.getUniformLocation(this.#shaderId, name);
    this.#uniformLookupTable[name] = uniformLocation;
    return uniformLocation;
  }
  setUniformMatrix4fv(name, value) {
    let transpose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const uniformLocation = this.#getUniformLocation(name);
    this.#gl.uniformMatrix4fv(uniformLocation, transpose, value);
  }
  setUniform1f(name, value) {
    const uniformLocation = this.#getUniformLocation(name);
    this.#gl.uniform1f(uniformLocation, value);
  }
  setUniform1i(name, value) {
    const uniformLocation = this.#getUniformLocation(name);
    this.#gl.uniform1i(uniformLocation, value);
  }
  setUniform1iv(name, value) {
    const uniformLocation = this.#getUniformLocation(name);
    this.#gl.uniform1iv(uniformLocation, value);
  }
  setUniform3fv(name, value) {
    const uniformLocation = this.#getUniformLocation(name);
    this.#gl.uniform3fv(uniformLocation, value);
  }
  setUniform4fv(name, value) {
    const uniformLocation = this.#getUniformLocation(name);
    this.#gl.uniform4fv(uniformLocation, value);
  }
}
exports.Shader = Shader;