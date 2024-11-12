"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = void 0;
var _Component = require("../ecs/Component");
var _Matrix = require("../math/Matrix");
var _Vector = require("../math/Vector");
var _Buffer = require("./Buffer");
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
class MeshVertex {
  position;
  color;
  texCoord;
  texIndex;
  normal;
  ambientColor;
  diffuseColor;
  specularColor;
  shininess;
  get flat() {
    return [this.position.x, this.position.y, this.position.z, this.color.x, this.color.y, this.color.z, this.texCoord.x, this.texCoord.y, this.texIndex, this.normal.x, this.normal.y, this.normal.z, this.ambientColor.x, this.ambientColor.y, this.ambientColor.z, this.diffuseColor.x, this.diffuseColor.y, this.diffuseColor.z, this.specularColor.x, this.specularColor.y, this.specularColor.z, this.shininess];
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
    meshVertexCount: 0,
    /**
     * @type {Shader}
     */
    meshShader: null,
    /**
     * @type {VertexBuffer}
     */
    meshVB: null,
    // particles
    /**
     * @type {Shader}
     */
    particleUpdateShader: null,
    /**
     * @type {Shader}
     */
    particleRenderShader: null,
    /**
     * @type {VertexBuffer}
     */
    particleVB_1: null,
    /**
     * @type {VertexBuffer}
     */
    particleVB_2: null,
    particleCount: 2000,
    minAge: 1.01,
    maxAge: 1.15,
    bornParticles: 0,
    birthRate: 100,
    totalTime: 0,
    minTheta: Math.PI / 2.0 - 0.5,
    maxTheta: Math.PI / 2.0 + 0.5,
    minSpeed: 0.5,
    maxSpeed: 1.0,
    gravity: _Vector.Vector3.down,
    origin: _Vector.Vector3.zero,
    readIndex: 0,
    writeIndex: 1,
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
    whiteTexture: null,
    /**
     * @type {Texture}
     */
    noiseTexture: null
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
    cameraPos: _Vector.Vector3.zero,
    /**
     * @type {LightComponent[]}
     */
    lights: []
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
   * @type {MeshVertex} vertex of type mesh (used for caching reasons)
   */
  #meshVertex;

  /**
   * 
   * @param {WebGL2RenderingContext} gl the WebGL context 
   */
  constructor(gl) {
    this.#gl = gl;
    this.#gl.enable(this.#gl.BLEND);
    this.#gl.blendEquation(this.#gl.FUNC_ADD);
    this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);
    this.#renderData.maxTextureSlotCount = this.#gl.getParameter(this.#gl.MAX_TEXTURE_IMAGE_UNITS);
    this.#renderData.whiteTexture = new _Texture.Texture(this.#gl); // without src, we'll get the default 1x1 white texture
    this.#renderData.noiseTexture = _Texture.Texture.createNoiseTexture(this.#gl);

    // initialize vertices of each type
    this.#quadVertex = new QuadVertex();
    this.#lineVertex = new LineVertex();
    this.#meshVertex = new MeshVertex();

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
    this.#renderData.meshShader = new _Shader.Shader(this.#gl, _Shader.Shader.meshShaderPath);
    this.#renderData.meshVB = new _Buffer.VertexBuffer(this.#gl, this.#renderData.maxVertices * MeshVertex.vertexSize);
    const meshPosition = this.#renderData.meshShader.getAttributeLocation('a_Position');
    const meshColor = this.#renderData.meshShader.getAttributeLocation('a_Color');
    const meshTexCoord = this.#renderData.meshShader.getAttributeLocation('a_TexCoord');
    const meshTexIndex = this.#renderData.meshShader.getAttributeLocation('a_TexIndex');
    const meshNormal = this.#renderData.meshShader.getAttributeLocation('a_Normal');
    const meshAmbient = this.#renderData.meshShader.getAttributeLocation('a_Ambient');
    const meshDiffuse = this.#renderData.meshShader.getAttributeLocation('a_Diffuse');
    const meshSpecular = this.#renderData.meshShader.getAttributeLocation('a_Specular');
    const meshShininess = this.#renderData.meshShader.getAttributeLocation('a_Shininess');
    this.#renderData.meshVB.pushAttribute(meshPosition, 3);
    this.#renderData.meshVB.pushAttribute(meshColor, 3);
    this.#renderData.meshVB.pushAttribute(meshTexCoord, 2);
    this.#renderData.meshVB.pushAttribute(meshTexIndex, 1);
    this.#renderData.meshVB.pushAttribute(meshNormal, 3);
    this.#renderData.meshVB.pushAttribute(meshAmbient, 3);
    this.#renderData.meshVB.pushAttribute(meshDiffuse, 3);
    this.#renderData.meshVB.pushAttribute(meshSpecular, 3);
    this.#renderData.meshVB.pushAttribute(meshShininess, 1);
    this.#renderData.meshShader.setUniform1iv('u_Textures', samplers);

    // particles
    this.#renderData.particleUpdateShader = new _Shader.Shader(this.#gl, _Shader.Shader.particleUpdateShaderPath, ['v_Position', 'v_Age', 'v_Life', 'v_Velocity']);
    this.#renderData.particleRenderShader = new _Shader.Shader(this.#gl, _Shader.Shader.particleRenderShaderPath);
    const initialParticleData = new Float32Array(this.#initialParticleData());
    this.#renderData.particleVB_1 = new _Buffer.VertexBuffer(this.#gl, initialParticleData);
    this.#renderData.particleVB_2 = new _Buffer.VertexBuffer(this.#gl, initialParticleData);
    this.#renderData.textureSlots[1] = this.#renderData.noiseTexture;
  }

  /**
   * 
   * @param {TransformComponent} transform 
   * @param {CameraComponent} camera 
   * @param {LightComponent} light 
   */
  beginScene(transform, camera, lights) {
    this.#sceneData.view.identity();
    this.#sceneData.view.multiply(transform.transformMatrix);
    this.#sceneData.view.invert();
    this.#sceneData.view.transpose();

    // setup the (view-)projection matrix
    this.#sceneData.projection.identity();
    this.#sceneData.projection.multiply(camera.projection);
    this.#sceneData.projection.multiply(this.#sceneData.view);
    this.#sceneData.cameraPos.set(transform.position);
    this.#sceneData.lights = [];
    for (let i = 0; i < lights.length; i++) {
      this.#sceneData.lights.push(lights[i]);
    }
  }
  endScene(dt) {
    this.#flush(dt);
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
      for (let i = 2; i < this.#renderData.textureSlotIndex; i++) {
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
    if (this.#renderData.meshVertexCount >= this.#renderData.maxVertices) {
      this.#flush();
    }
    const t = transform.transformMatrix;
    const parsedObj = mesh.vertices;
    const parsedMtl = mesh.material;
    for (let i = 0; i < parsedObj.length; i++) {
      const material = parsedMtl[parsedObj[i].material];
      let useTextureSlot = -1;
      if (material.diffuseMapSrc) {
        const diffuseMap = new _Texture.Texture(this.#gl, material.diffuseMapSrc);
        for (let i = 2; i < this.#renderData.textureSlotIndex; i++) {
          if (this.#renderData.textureSlots[i] == diffuseMap) {
            useTextureSlot = i;
            break;
          }
        }
        if (this.#renderData.textureSlotIndex >= this.#renderData.maxTextureSlotCount) {
          this.#flush();
        }
        if (useTextureSlot === -1) {
          useTextureSlot = this.#renderData.textureSlotIndex;
          this.#renderData.textureSlots[this.#renderData.textureSlotIndex++] = diffuseMap;
        }
      } else {
        useTextureSlot = 0;
      }
      this.#meshVertex.position = t.multiplyVector3(parsedObj[i].position);
      this.#meshVertex.color = parsedObj[i].color ? parsedObj[i].color : mesh.color;
      this.#meshVertex.texCoord = parsedObj[i].texCoord;
      this.#meshVertex.texIndex = useTextureSlot;
      this.#meshVertex.normal = t.multiplyVector3(parsedObj[i].normal);
      this.#meshVertex.ambientColor = material && material.ambientColor ? material.ambientColor : _Vector.Vector3.one;
      this.#meshVertex.diffuseColor = material && material.diffuseColor ? material.diffuseColor : _Vector.Vector3.one;
      this.#meshVertex.specularColor = material && material.specularColor ? material.specularColor : _Vector.Vector3.zero;
      this.#meshVertex.shininess = material && material.shininess ? material.shininess : 1.0;
      this.#renderData.meshVB.addVertex(this.#renderData.meshVertexCount, this.#meshVertex.flat);
      this.#renderData.meshVertexCount++;
    }
  }
  #flush(dt) {
    if (this.#renderData.quadIndexCount > 0) {
      for (let i = 0; i < this.#renderData.textureSlotIndex; i++) {
        this.#renderData.textureSlots[i].bind(i);
      }
      this.#settings2d();
      this.#renderData.quadIB.bind();
      this.#renderData.quadVB.bind();
      this.#renderData.quadShader.bind();
      this.#renderData.quadShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
      this.#gl.drawElements(this.#gl.TRIANGLES, this.#renderData.quadIndexCount, this.#gl.UNSIGNED_SHORT, 0);
    }
    if (this.#renderData.lineVertexCount > 0) {
      this.#settings2d();
      this.#renderData.lineVB.bind();
      this.#renderData.lineShader.bind();
      this.#renderData.lineShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
      this.#gl.drawArrays(this.#gl.LINES, 0, this.#renderData.lineVertexCount);
    }
    if (this.#renderData.meshVertexCount > 0) {
      for (let i = 0; i < this.#renderData.textureSlotIndex; i++) {
        this.#renderData.textureSlots[i].bind(i);
      }
      this.#settings3d();
      this.#renderData.meshVB.bind();
      this.#renderData.meshShader.bind();
      this.#renderData.meshShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
      this.#renderData.meshShader.setUniform3fv('u_CameraPosition', this.#sceneData.cameraPos.data);
      this.#renderData.meshShader.setUniform1i('u_LightCount', this.#sceneData.lights.length);
      for (let i = 0; i < this.#sceneData.lights.length; i++) {
        this.#renderData.meshShader.setUniform3fv(`u_Lights[${i}].position`, this.#sceneData.lights[i].direction.data);
        this.#renderData.meshShader.setUniform3fv(`u_Lights[${i}].color`, this.#sceneData.lights[i].color.data);
      }
      this.#gl.drawArrays(this.#gl.TRIANGLES, 0, this.#renderData.meshVertexCount);
    }
    this.#settings2d();
    if (this.#renderData.bornParticles < this.#renderData.particleCount) {
      this.#renderData.bornParticles = Math.min(this.#renderData.particleCount, Math.floor(this.#renderData.bornParticles + this.#renderData.birthRate * dt));
    }
    this.#renderData.particleUpdateShader.bind();
    this.#renderData.particleUpdateShader.setUniform1f('u_TimeDelta', dt);
    this.#renderData.particleUpdateShader.setUniform3fv('u_Gravity', this.#renderData.gravity.data);
    this.#renderData.particleUpdateShader.setUniform3fv('u_Origin', this.#renderData.origin.data);
    this.#renderData.particleUpdateShader.setUniform1f('u_MinTheta', this.#renderData.minTheta);
    this.#renderData.particleUpdateShader.setUniform1f('u_MaxTheta', this.#renderData.maxTheta);
    this.#renderData.particleUpdateShader.setUniform1f('u_MinSpeed', this.#renderData.minSpeed);
    this.#renderData.particleUpdateShader.setUniform1f('u_MaxSpeed', this.#renderData.maxSpeed);
    this.#renderData.totalTime += dt;
    this.#renderData.noiseTexture.bind(1);
    this.#renderData.particleUpdateShader.setUniform1i('u_RgNoise', 1);
    this.#renderData.particleVB_1.clearAttributes();
    this.#renderData.particleVB_2.clearAttributes();
    const particleUpdatePosition = this.#renderData.particleUpdateShader.getAttributeLocation('a_Position');
    const particleUpdateAge = this.#renderData.particleUpdateShader.getAttributeLocation('a_Age');
    const particleUpdateLife = this.#renderData.particleUpdateShader.getAttributeLocation('a_Life');
    const particleUpdateVelocity = this.#renderData.particleUpdateShader.getAttributeLocation('a_Velocity');
    this.#renderData.particleVB_1.pushAttribute(particleUpdatePosition, 3);
    this.#renderData.particleVB_1.pushAttribute(particleUpdateAge, 1);
    this.#renderData.particleVB_1.pushAttribute(particleUpdateLife, 1);
    this.#renderData.particleVB_1.pushAttribute(particleUpdateVelocity, 3);
    this.#renderData.particleVB_2.pushAttribute(particleUpdatePosition, 3);
    this.#renderData.particleVB_2.pushAttribute(particleUpdateAge, 1);
    this.#renderData.particleVB_2.pushAttribute(particleUpdateLife, 1);
    this.#renderData.particleVB_2.pushAttribute(particleUpdateVelocity, 3);
    const buffers = [this.#renderData.particleVB_1, this.#renderData.particleVB_2];
    buffers[this.#renderData.readIndex].bind(false);
    buffers[this.#renderData.writeIndex].bindBase();
    this.#gl.enable(this.#gl.RASTERIZER_DISCARD);
    this.#gl.beginTransformFeedback(this.#gl.POINTS);
    this.#gl.drawArrays(this.#gl.POINTS, 0, this.#renderData.bornParticles);
    this.#gl.endTransformFeedback();
    this.#gl.disable(this.#gl.RASTERIZER_DISCARD);
    buffers[this.#renderData.writeIndex].unbindBase();
    buffers[this.#renderData.readIndex].clearAttributes();
    this.#renderData.particleRenderShader.bind();
    const particleRenderPosition = this.#renderData.particleRenderShader.getAttributeLocation('a_Position');
    const particleRenderAge = this.#renderData.particleRenderShader.getAttributeLocation('a_Age');
    const particleRenderLife = this.#renderData.particleRenderShader.getAttributeLocation('a_Life');
    const particleRenderVelocity = this.#renderData.particleRenderShader.getAttributeLocation('a_Velocity');
    buffers[this.#renderData.readIndex].pushAttribute(particleRenderPosition, 3);
    buffers[this.#renderData.readIndex].pushAttribute(particleRenderAge, 1);
    buffers[this.#renderData.readIndex].pushAttribute(particleRenderLife, 1);
    buffers[this.#renderData.readIndex].pushAttribute(particleRenderVelocity, 3);
    buffers[this.#renderData.readIndex].bind(false);
    this.#gl.drawArrays(this.#gl.POINTS, 0, this.#renderData.bornParticles);
    this.#renderData.readIndex = 1 - this.#renderData.readIndex;
    this.#renderData.writeIndex = 1 - this.#renderData.writeIndex;

    // reset batch
    this.#renderData.quadVertexCount = 0;
    this.#renderData.quadIndexCount = 0;
    this.#renderData.textureSlotIndex = 2;
    this.#renderData.lineVertexCount = 0;
    this.#renderData.meshVertexCount = 0;
  }
  clear() {
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
  }
  setClearColor(r, g, b, a) {
    this.#gl.clearColor(r, g, b, a);
  }
  #settings2d() {
    this.#gl.disable(this.#gl.CULL_FACE);
    this.#gl.disable(this.#gl.DEPTH_TEST);
  }
  #settings3d() {
    this.#gl.enable(this.#gl.CULL_FACE);
    this.#gl.enable(this.#gl.DEPTH_TEST);
  }
  #initialParticleData() {
    var data = [];
    for (var i = 0; i < this.#renderData.particleCount; ++i) {
      // position
      data.push(0.0);
      data.push(0.0);
      data.push(0.0);
      var life = this.#renderData.minAge + Math.random() * (this.#renderData.maxAge - this.#renderData.minAge);
      // set age to max. life + 1 to ensure the particle gets initialized
      // on first invocation of particle update shader
      data.push(life + 1);
      data.push(life);

      // velocity
      data.push(0.0);
      data.push(0.0);
      data.push(0.0);
    }
    return data;
  }
}
exports.Renderer = Renderer;