"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = void 0;
var _Component = require("../ecs/Component");
var _Matrix = require("../math/Matrix");
var _Vector = require("../math/Vector");
var _Buffer = require("./Buffer");
var _Color = require("./Color");
var _Shader = require("./Shader");
var _Texture = require("./Texture");
class QuadVertex {
  position = null;
  color = null;
  texCoords = null;
  texIndex = (() => -1)();
  get flat() {
    if (!this.position || !this.color || !this.texCoords || this.texIndex === -1) {
      console.error('assign all properties before calling flat()!');
      return [];
    }
    return [this.position.x, this.position.y, this.position.z, this.color.x, this.color.y, this.color.z, this.color.w, this.texCoords.x, this.texCoords.y, this.texIndex];
  }
  static vertexSize = 11;
}
class LineVertex {
  position = (() => _Vector.Vector3.zero)();
  color = (() => _Vector.Vector4.zero)();
  get flat() {
    return [this.position.x, this.position.y, this.position.z, this.color.x, this.color.y, this.color.z, this.color.w];
  }
  static vertexSize = 7;
}
class CubeVertex {
  position;
  color;
  texCoord;
  normal;
  ambientColor;
  diffuseColor;
  specularColor;
  shininess;
  get flat() {
    return [this.position.x, this.position.y, this.position.z, this.color.x, this.color.y, this.color.z, this.texCoord.x, this.texCoord.y, this.normal.x, this.normal.y, this.normal.z, this.ambientColor.x, this.ambientColor.y, this.ambientColor.z, this.diffuseColor.x, this.diffuseColor.y, this.diffuseColor.z, this.specularColor.x, this.specularColor.y, this.specularColor.z, this.shininess];
  }
  static vertexSize = 21;
}

/**
 * Class that does the rendering by using the encapsulated WebGL objects
 */
class Renderer {
  #gl;
  #renderData = (() => ({
    // immutable data
    maxVertices: 40_000,
    maxIndices: 60_000,
    initialVertexPositions: [new _Vector.Vector3(-0.5, -0.5, 0), new _Vector.Vector3(0.5, -0.5, 0), new _Vector.Vector3(-0.5, 0.5, 0), new _Vector.Vector3(0.5, 0.5, 0)],
    textureCoords: [_Vector.Vector2.zero, _Vector.Vector2.right, _Vector.Vector2.up, _Vector.Vector2.one],
    // mutable data (these will be changed by the renderer)
    quadVertexCount: 0,
    quadIndexCount: 0,
    /**
     * @type {Shader}
     */
    quadShader: null,
    /**
     * @type {VertexBuffer}
     */
    quadVB: null,
    /**
     * @type {IndexBuffer}
     */
    quadIB: null,
    lineVertexCount: 0,
    /**
     * @type {Shader}
     */
    lineShader: null,
    /**
     * @type {VertexBuffer}
     */
    lineVB: null,
    cubeVertexCount: 0,
    /**
     * @type {Shader}
     */
    cubeShader: null,
    /**
     * @type {VertexBuffer}
     */
    cubeVB: null,
    // texture data
    maxTextureSlotCount: -1,
    textureSlotIndex: 1,
    /**
     * @type {Texture[]}
     */
    textureSlots: [],
    /**
     * @type {Texture}
     */
    whiteTexture: null
  }))();
  #sceneData = (() => ({
    /**
     * @type {Matrix4}
     */
    projection: _Matrix.Matrix4.zero,
    /**
     * @type {Matrix4}
     */
    view: _Matrix.Matrix4.zero,
    /**
     * @type {Vector3}
     */
    cameraPos: _Vector.Vector3.zero
  }))();

  /**
   * @type {QuadVertex} vertex of type quad (used for caching reasons)
   */
  #quadVertex;

  /**
   * @type {LineVertex} vertex of type line (used for caching reasons)
   */
  #lineVertex;

  /**
   * @type {CubeVertex} vertex of type line (used for caching reasons)
   */
  #cubeVertex;

  /**
   * 
   * @param {WebGL2RenderingContext} gl the WebGL context 
   */
  constructor(gl) {
    this.#gl = gl;
    this.#gl.enable(this.#gl.BLEND);
    this.#gl.blendEquation(this.#gl.FUNC_ADD);
    this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);
    this.#gl.disable(this.#gl.CULL_FACE);
    this.#gl.enable(this.#gl.DEPTH_TEST);
    this.#renderData.maxTextureSlotCount = this.#gl.getParameter(this.#gl.MAX_TEXTURE_IMAGE_UNITS);
    this.#renderData.whiteTexture = new _Texture.Texture(this.#gl); // without src, we'll get the default 1x1 white texture

    // initialize vertices of each type
    this.#quadVertex = new QuadVertex();
    this.#lineVertex = new LineVertex();
    this.#cubeVertex = new CubeVertex();

    // prepare indices for index buffer creation
    let indices = new Uint16Array(this.#renderData.maxIndices);
    let offset = 0;
    for (let i = 0; i < this.#renderData.maxIndices; i += 6) {
      indices[i + 0] = offset + 0;
      indices[i + 1] = offset + 1;
      indices[i + 2] = offset + 2;
      indices[i + 3] = offset + 1;
      indices[i + 4] = offset + 2;
      indices[i + 5] = offset + 3;
      offset += 4;
    }

    // quads
    this.#renderData.quadShader = new _Shader.Shader(this.#gl, _Shader.Shader.quadShader16Path);
    this.#renderData.quadVB = new _Buffer.VertexBuffer(this.#gl, this.#renderData.maxVertices * QuadVertex.vertexSize);
    this.#renderData.quadIB = new _Buffer.IndexBuffer(this.#gl, indices);
    const quadPosition = this.#renderData.quadShader.getAttributeLocation('a_Position');
    const quadColor = this.#renderData.quadShader.getAttributeLocation('a_Color');
    const quadCoords = this.#renderData.quadShader.getAttributeLocation('a_TexCoord');
    const quadIndex = this.#renderData.quadShader.getAttributeLocation('a_TexIndex');
    this.#renderData.quadVB.pushAttribute(quadPosition, 3);
    this.#renderData.quadVB.pushAttribute(quadColor, 4);
    this.#renderData.quadVB.pushAttribute(quadCoords, 2);
    this.#renderData.quadVB.pushAttribute(quadIndex, 1);

    // textures
    const samplers = [];
    for (let i = 0; i < this.#renderData.maxTextureSlotCount; i++) {
      samplers[i] = i;
    }
    this.#renderData.quadShader.setUniform1iv('u_Textures', samplers);
    this.#renderData.textureSlots[0] = this.#renderData.whiteTexture;
    this.#renderData.lineShader = new _Shader.Shader(this.#gl, _Shader.Shader.lineShaderPath);
    this.#renderData.lineVB = new _Buffer.VertexBuffer(this.#gl, this.#renderData.maxVertices * LineVertex.vertexSize);
    const linePosition = this.#renderData.lineShader.getAttributeLocation('a_Position');
    const lineColor = this.#renderData.lineShader.getAttributeLocation('a_Color');
    this.#renderData.lineVB.pushAttribute(linePosition, 3);
    this.#renderData.lineVB.pushAttribute(lineColor, 4);

    // 3D
    this.#renderData.cubeShader = new _Shader.Shader(this.#gl, _Shader.Shader.cubeShaderPath);
    this.#renderData.cubeVB = new _Buffer.VertexBuffer(this.#gl, this.#renderData.maxVertices * CubeVertex.vertexSize);
    const cubePosition = this.#renderData.cubeShader.getAttributeLocation('a_Position');
    const cubeColor = this.#renderData.cubeShader.getAttributeLocation('a_Color');
    const cubeTexCoord = this.#renderData.cubeShader.getAttributeLocation('a_TexCoord');
    const cubeNormal = this.#renderData.cubeShader.getAttributeLocation('a_Normal');
    const cubeAmbient = this.#renderData.cubeShader.getAttributeLocation('a_Ambient');
    const cubeDiffuse = this.#renderData.cubeShader.getAttributeLocation('a_Diffuse');
    const cubeSpecular = this.#renderData.cubeShader.getAttributeLocation('a_Specular');
    const cubeShininess = this.#renderData.cubeShader.getAttributeLocation('a_Shininess');
    this.#renderData.cubeVB.pushAttribute(cubePosition, 3);
    this.#renderData.cubeVB.pushAttribute(cubeColor, 3);
    this.#renderData.cubeVB.pushAttribute(cubeTexCoord, 2);
    this.#renderData.cubeVB.pushAttribute(cubeNormal, 3);
    this.#renderData.cubeVB.pushAttribute(cubeAmbient, 3);
    this.#renderData.cubeVB.pushAttribute(cubeDiffuse, 3);
    this.#renderData.cubeVB.pushAttribute(cubeSpecular, 3);
    this.#renderData.cubeVB.pushAttribute(cubeShininess, 1);
  }

  /**
   * 
   * @param {TransformComponent} transform 
   * @param {CameraComponent} camera 
   */
  beginScene(transform, camera) {
    if (!camera.isOrtho) {
      transform.scale.set(transform.scale.x, -1, transform.scale.z);
    }
    this.#sceneData.view.identity();
    this.#sceneData.view.multiply(transform.transformMatrix);
    this.#sceneData.view.invert();
    this.#sceneData.view.transpose();

    // setup the (view-)projection matrix
    this.#sceneData.projection.identity();
    this.#sceneData.projection.multiply(camera.projection);
    this.#sceneData.projection.multiply(this.#sceneData.view);
    this.#sceneData.cameraPos.set(transform.position);
  }
  endScene() {
    this.#flush();
  }

  /**
   * draws a quad (filled rectangular shape)
   * @param {TransformComponent} transform 
   * @param {SpriteComponent} sprite 
   */
  drawQuad(transform, sprite) {
    if (this.#renderData.quadIndexCount >= this.#renderData.maxIndices) {
      this.#flush();
    }
    let useTextureSlot = -1;
    if (sprite.texture) {
      for (let i = 1; i < this.#renderData.textureSlotIndex; i++) {
        if (this.#renderData.textureSlots[i] == sprite.texture) {
          useTextureSlot = i;
          break;
        }
      }
      if (this.#renderData.textureSlotIndex >= this.#renderData.maxTextureSlotCount) {
        this.#flush();
      }
      if (useTextureSlot === -1) {
        useTextureSlot = this.#renderData.textureSlotIndex;
        this.#renderData.textureSlots[this.#renderData.textureSlotIndex++] = sprite.texture;
      }
    } else {
      useTextureSlot = 0;
    }
    const t = transform.transformMatrix;
    for (let i = 0; i < 4; i++) {
      this.#quadVertex.position = t.multiplyVector3(this.#renderData.initialVertexPositions[i]);
      this.#quadVertex.color = sprite.color;
      this.#quadVertex.texCoords = sprite.texCoords[i];
      this.#quadVertex.texIndex = useTextureSlot;
      this.#renderData.quadVB.addVertex(this.#renderData.quadVertexCount, this.#quadVertex.flat);
      this.#renderData.quadVertexCount++;
    }
    this.#renderData.quadIndexCount += 6;
  }

  /**
   * draws a line
   * @param {Vector3} p0 beginning position of the line 
   * @param {Vector3} p1 ending position of the line
   * @param {Vector4} color color of the line
   */
  drawLine(p0, p1, color) {
    this.#lineVertex.position.set(p0);
    this.#lineVertex.color.set(color);
    this.#renderData.lineVB.addVertex(this.#renderData.lineVertexCount, this.#lineVertex.flat);
    this.#renderData.lineVertexCount++;
    this.#lineVertex.position.set(p1);
    this.#renderData.lineVB.addVertex(this.#renderData.lineVertexCount, this.#lineVertex.flat);
    this.#renderData.lineVertexCount++;
  }

  /**
   * draws a (non-)filled rect.
   * @param {Vector3} pos rect is centered at this position
   * @param {Vector2} size rect's size in terms of scale
   * @param {Vector4} color rect's color
   */
  drawRect(pos, size, color) {
    const p0 = _Vector.Vector3.zero;
    const p1 = _Vector.Vector3.zero;
    p0.set(pos.x - size.x * 0.5, pos.y - size.y * 0.5, pos.z);
    p1.set(pos.x + size.x * 0.5, pos.y - size.y * 0.5, pos.z);
    this.drawLine(p0, p1, color);
    p0.set(p1);
    p1.y += size.y;
    this.drawLine(p0, p1, color);
    p0.set(p1);
    p1.x -= size.x;
    this.drawLine(p0, p1, color);
    p0.set(p1);
    p1.y -= size.y;
    this.drawLine(p0, p1, color);
  }

  /**
   * 
   * @param {TransformComponent} transform 
   * @param {MeshComponent} mesh 
   */
  drawMesh(transform, mesh) {
    if (this.#renderData.cubeVertexCount >= this.#renderData.maxVertices) {
      this.#flush();
    }
    const t = transform.transformMatrix;
    const parsedObj = mesh.vertices;
    const parsedMtl = mesh.material;
    for (let i = 0; i < parsedObj.length; i++) {
      const material = parsedMtl[parsedObj[i].material];
      this.#cubeVertex.position = t.multiplyVector3(parsedObj[i].position);
      this.#cubeVertex.color = parsedObj[i].color;
      this.#cubeVertex.texCoord = parsedObj[i].texCoord;
      this.#cubeVertex.normal = t.multiplyVector3(parsedObj[i].normal);
      this.#cubeVertex.ambientColor = material && material.ambientColor ? material.ambientColor : _Vector.Vector3.one;
      this.#cubeVertex.diffuseColor = material && material.diffuseColor ? material.diffuseColor : _Vector.Vector3.one;
      this.#cubeVertex.specularColor = material && material.specularColor ? material.specularColor : _Vector.Vector3.zero;
      this.#cubeVertex.shininess = material && material.shininess ? material.shininess : 1.0;
      this.#renderData.cubeVB.addVertex(this.#renderData.cubeVertexCount, this.#cubeVertex.flat);
      this.#renderData.cubeVertexCount++;
    }
  }
  #flush() {
    if (this.#renderData.quadIndexCount > 0) {
      for (let i = 0; i < this.#renderData.textureSlotIndex; i++) {
        this.#renderData.textureSlots[i].bind(i);
      }
      this.#renderData.quadIB.bind();
      this.#renderData.quadVB.bind();
      this.#renderData.quadVB.linkAttributes();
      this.#renderData.quadShader.bind();
      this.#renderData.quadShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
      this.#gl.drawElements(this.#gl.TRIANGLES, this.#renderData.quadIndexCount, this.#gl.UNSIGNED_SHORT, 0);
    }
    if (this.#renderData.lineVertexCount > 0) {
      this.#renderData.lineVB.bind();
      this.#renderData.lineVB.linkAttributes();
      this.#renderData.lineShader.bind();
      this.#renderData.lineShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
      this.#gl.drawArrays(this.#gl.LINES, 0, this.#renderData.lineVertexCount);
    }
    if (this.#renderData.cubeVertexCount > 0) {
      for (let i = 0; i < this.#renderData.textureSlotIndex; i++) {
        this.#renderData.textureSlots[i].bind(i);
      }
      this.#renderData.cubeVB.bind();
      this.#renderData.cubeVB.linkAttributes();
      this.#renderData.cubeShader.bind();
      this.#renderData.cubeShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
      this.#renderData.cubeShader.setUniform3fv('u_CameraPosition', this.#sceneData.cameraPos.data);
      this.#gl.drawArrays(this.#gl.TRIANGLES, 0, this.#renderData.cubeVertexCount);
    }

    // reset batch
    this.#renderData.quadVertexCount = 0;
    this.#renderData.quadIndexCount = 0;
    this.#renderData.textureSlotIndex = 1;
    this.#renderData.lineVertexCount = 0;
    this.#renderData.cubeVertexCount = 0;
  }
  clear() {
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
  }
  setClearColor(r, g, b, a) {
    this.#gl.clearColor(r, g, b, a);
  }
  settings2d() {
    this.#gl.disable(this.#gl.DEPTH_TEST);
  }
  settings3d() {
    this.#gl.enable(this.#gl.DEPTH_TEST);
  }
}
exports.Renderer = Renderer;