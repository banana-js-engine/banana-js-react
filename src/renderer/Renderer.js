import { CameraComponent, MeshComponent, SpriteComponent, TransformComponent, LightComponent, ParticleComponent, TilemapComponent } from "../ecs/Component";
import { Matrix4 } from "../math/Matrix";
import { Vector2, Vector3, Vector4 } from "../math/Vector";
import { IndexBuffer, VertexBuffer } from "./Buffer";
import { Color } from "./Color";
import { Shader } from "./Shader";
import { Texture } from "./Texture";
import { VertexArray } from "./VertexArray";

class QuadVertex {
    position = null;
    color = null;
    texCoords = null;
    texIndex = -1;

    get flat() {
        if (!this.position || !this.color || !this.texCoords || this.texIndex === -1) {
            return [];
        }

        return [
            this.position.x,
            this.position.y,
            this.position.z,
            this.color.x,
            this.color.y,
            this.color.z,
            this.color.w,
            this.texCoords.x,
            this.texCoords.y,
            this.texIndex
        ];
    }

    static vertexSize = 11;
}

class LineVertex {
    position = Vector3.zero;
    color = Vector4.zero;

    get flat() {
        return [
            this.position.x,
            this.position.y,
            this.position.z,
            this.color.x,
            this.color.y,
            this.color.z,
            this.color.w
        ];
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
        return [
            this.position.x,
            this.position.y,
            this.position.z,
            this.color.x,
            this.color.y,
            this.color.z,
            this.texCoord.x,
            this.texCoord.y,
            this.texIndex,
            this.normal.x,
            this.normal.y,
            this.normal.z,
            this.ambientColor.x,
            this.ambientColor.y,
            this.ambientColor.z,
            this.diffuseColor.x,
            this.diffuseColor.y,
            this.diffuseColor.z,
            this.specularColor.x,
            this.specularColor.y,
            this.specularColor.z,
            this.shininess
        ];
    }

    static vertexSize = 22;
}

/**
 * Class that does the rendering by using the encapsulated WebGL objects
 */
export class Renderer {

    #gl;

    #renderData = {

        // immutable data
        maxVertices: 40_000,
        maxIndices: 60_000,

        initialVertexPositions: [
            new Vector3(-0.5, -0.5, 0),
            new Vector3(0.5, -0.5, 0),
            new Vector3(-0.5, 0.5, 0),
            new Vector3(0.5, 0.5, 0),
        ],

        textureCoords: [
            Vector2.zero,
            Vector2.right,
            Vector2.up,
            Vector2.one,
        ],

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

        /**
         * @type {VertexArray}
         */
        quadVAO: null,

        lineVertexCount: 0,

        /**
         * @type {Shader}
         */
        lineShader: null,

        /**
         * @type {VertexBuffer}
         */
        lineVB: null,

        /**
         * @type {VertexArray}
         */
        lineVAO: null,

        meshVertexCount: 0,

        /**
         * @type {Shader}
         */
        meshShader: null,

        /**
         * @type {Shader}
         */
        largeMeshShader: null,

        /**
         * @type {VertexBuffer}
         */
        meshVB: null,

        /**
         * @type {VertexArray}
         */
        meshVAO: null,

        // particles
        /**
         * @type {Shader}
         */
        particleUpdateShader: null,

        /**
         * @type {Shader}
         */
        particleRenderShader: null,

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
        noiseTexture: null,
    };

    #sceneData = {
        /**
         * @type {Matrix4}
         */
        projection: Matrix4.zero,

        /**
         * @type {Matrix4}
         */
        view: Matrix4.zero,

        /**
         * @type {Vector3}
         */
        cameraPos: Vector3.zero,

        /**
         * @type {LightComponent[]}
         */
        lights: [],
    }

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
        this.#renderData.whiteTexture = new Texture(this.#gl); // without src, we'll get the default 1x1 white texture
        this.#renderData.noiseTexture = Texture.createNoiseTexture(this.#gl);

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
        this.#renderData.quadShader = new Shader(this.#gl, Shader.quadShader16Path);
        this.#renderData.quadVB = new VertexBuffer(this.#gl, this.#renderData.maxVertices * QuadVertex.vertexSize);
        this.#renderData.quadIB = new IndexBuffer(this.#gl, indices);

        const quadPosition = this.#renderData.quadShader.getAttributeLocation('a_Position');
        const quadColor = this.#renderData.quadShader.getAttributeLocation('a_Color');
        const quadCoords = this.#renderData.quadShader.getAttributeLocation('a_TexCoord');
        const quadIndex = this.#renderData.quadShader.getAttributeLocation('a_TexIndex');
        this.#renderData.quadVB.pushAttribute(quadPosition, 3);
        this.#renderData.quadVB.pushAttribute(quadColor, 4);
        this.#renderData.quadVB.pushAttribute(quadCoords, 2);
        this.#renderData.quadVB.pushAttribute(quadIndex, 1);

        this.#renderData.quadVAO = new VertexArray(this.#gl);
        this.#renderData.quadVAO.VB = this.#renderData.quadVB;
        this.#renderData.quadVAO.IB = this.#renderData.quadIB;

        // textures
        const samplers = [];
        for (let i = 0; i < this.#renderData.maxTextureSlotCount; i++) {
            samplers[i] = i;
        }

        this.#renderData.quadShader.setUniform1iv('u_Textures', samplers);

        this.#renderData.textureSlots[0] = this.#renderData.whiteTexture;

        this.#renderData.lineShader = new Shader(this.#gl, Shader.lineShaderPath);
        this.#renderData.lineVB = new VertexBuffer(this.#gl, this.#renderData.maxVertices * LineVertex.vertexSize);

        const linePosition = this.#renderData.lineShader.getAttributeLocation('a_Position');
        const lineColor = this.#renderData.lineShader.getAttributeLocation('a_Color');

        this.#renderData.lineVB.pushAttribute(linePosition, 3);
        this.#renderData.lineVB.pushAttribute(lineColor, 4);

        this.#renderData.lineVAO = new VertexArray(this.#gl);
        this.#renderData.lineVAO.VB = this.#renderData.lineVB;

        // 3D
        this.#renderData.meshShader = new Shader(this.#gl, Shader.smallMeshShaderPath);
        this.#renderData.meshVB = new VertexBuffer(this.#gl, this.#renderData.maxVertices * MeshVertex.vertexSize);

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

        this.#renderData.meshVAO = new VertexArray(this.#gl);
        this.#renderData.meshVAO.VB = this.#renderData.meshVB;

        this.#renderData.meshShader.setUniform1iv('u_Textures', samplers);

        // particles
        this.#renderData.particleUpdateShader = new Shader(this.#gl, Shader.particleUpdateShaderPath, 
            [
                'v_Position',
                'v_Age',
                'v_Life',
                'v_Velocity'
            ]
        );
        this.#renderData.particleRenderShader = new Shader(this.#gl, Shader.particleRenderShaderPath);

        this.#renderData.textureSlots[1] = this.#renderData.noiseTexture;

        this.#renderData.largeMeshShader = new Shader(this.#gl, Shader.largeMeshShaderPath);
        this.#renderData.largeMeshShader.setUniform1iv('u_Textures', samplers);
    }

    /**
     * 
     * @param {ParticleComponent[]} particles 
     */
    particlesInit(particles) {
        for (let i = 0; i < particles.length; i++) {
            const vaos = particles[i].vaos;
            const readBuffer = particles[i].readBuffer;
            const writeBuffer = particles[i].writeBuffer;

            const particleUpdatePosition = this.#renderData.particleUpdateShader.getAttributeLocation('a_Position');
            const particleUpdateAge = this.#renderData.particleUpdateShader.getAttributeLocation('a_Age');
            const particleUpdateLife = this.#renderData.particleUpdateShader.getAttributeLocation('a_Life');
            const particleUpdateVelocity = this.#renderData.particleUpdateShader.getAttributeLocation('a_Velocity');

            readBuffer.pushAttribute(particleUpdatePosition, 3);
            readBuffer.pushAttribute(particleUpdateAge, 1);
            readBuffer.pushAttribute(particleUpdateLife, 1);
            readBuffer.pushAttribute(particleUpdateVelocity, 3);
            vaos[0].VB = readBuffer;

            writeBuffer.pushAttribute(particleUpdatePosition, 3);
            writeBuffer.pushAttribute(particleUpdateAge, 1);
            writeBuffer.pushAttribute(particleUpdateLife, 1);
            writeBuffer.pushAttribute(particleUpdateVelocity, 3);
            vaos[1].VB = writeBuffer;

            readBuffer.clearAttributes();
            writeBuffer.clearAttributes();

            const particleRenderPosition = this.#renderData.particleRenderShader.getAttributeLocation('a_Position');
            const particleRenderAge = this.#renderData.particleRenderShader.getAttributeLocation('a_Age');
            const particleRenderLife = this.#renderData.particleRenderShader.getAttributeLocation('a_Life');
            const particleRenderVelocity = this.#renderData.particleRenderShader.getAttributeLocation('a_Velocity');

            readBuffer.pushAttribute(particleRenderPosition, 3);
            readBuffer.pushAttribute(particleRenderAge, 1);
            readBuffer.pushAttribute(particleRenderLife, 1);
            readBuffer.pushAttribute(particleRenderVelocity, 3);
            vaos[2].VB = readBuffer;

            writeBuffer.pushAttribute(particleRenderPosition, 3);
            writeBuffer.pushAttribute(particleRenderAge, 1);
            writeBuffer.pushAttribute(particleRenderLife, 1);
            writeBuffer.pushAttribute(particleRenderVelocity, 3);
            vaos[3].VB = writeBuffer;

            readBuffer.unbind();
            writeBuffer.unbind();
        }
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

    endScene() {
        this.#flush();
    }

    /**
     * draws a quad (filled rectangular shape)
     * @param {SpriteComponent} sprite 
     */
    drawQuad(sprite) {

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

        const t = sprite.transform.transformMatrix;

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
        const p0 = Vector3.zero;
        const p1 = Vector3.zero;
        
        p0.set(pos.x - size.x * 0.5, pos.y - size.y * 0.5, pos.z);
        p1.set(pos.x + size.x * 0.5, pos.y - size.y * 0.5, pos.z)

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
     * @param {MeshComponent} mesh 
     */
    drawMesh(mesh) {
        if (mesh.vertices.length < 1000) {
            this.#drawSmallMesh(mesh);
        } else {
            this.#drawLargeMesh(mesh);
        }
    }

    #drawSmallMesh(mesh) {
        if (this.#renderData.meshVertexCount >= this.#renderData.maxVertices) {
            this.#flush();
        }

        const t = mesh.transform.transformMatrix;
        const parsedObj = mesh.vertices;
        const parsedMtl = mesh.material;

        for (let i = 0; i < parsedObj.length; i++) {

            const material = parsedMtl[parsedObj[i].material];

            let useTextureSlot = -1;

            if (material.diffuseMapSrc) {
                const diffuseMap = mesh.getMap(material.diffuseMapSrc);
            
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

            this.#meshVertex.ambientColor = (material && material.ambientColor) ? material.ambientColor : Vector3.one;
            this.#meshVertex.diffuseColor = (material && material.diffuseColor) ? material.diffuseColor : Vector3.one;

            this.#meshVertex.specularColor = (material && material.specularColor) ? material.specularColor : Vector3.zero;
            this.#meshVertex.shininess = (material && material.shininess) ? material.shininess : 1.0;

            this.#renderData.meshVB.addVertex(this.#renderData.meshVertexCount, this.#meshVertex.flat);

            this.#renderData.meshVertexCount++;
        }
    }

    #drawLargeMesh(mesh) {
        this.#settings3d();
        const t = mesh.transform.transformMatrix;

        this.#renderData.largeMeshShader.bind();
        this.#renderData.largeMeshShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
        this.#renderData.largeMeshShader.setUniformMatrix4fv('u_ModelMatrix', t.flat);
        this.#renderData.largeMeshShader.setUniform3fv('u_CameraPosition', this.#sceneData.cameraPos.data);
        this.#renderData.largeMeshShader.setUniform1i('u_LightCount', this.#sceneData.lights.length);
        for (let i = 0; i < this.#sceneData.lights.length; i++) {
            this.#renderData.largeMeshShader.setUniform3fv(`u_Lights[${i}].position`, this.#sceneData.lights[i].position.data);
            this.#renderData.largeMeshShader.setUniform3fv(`u_Lights[${i}].color`, this.#sceneData.lights[i].color.data);
            this.#renderData.largeMeshShader.setUniform1f(`u_Lights[${i}].intensity`, this.#sceneData.lights[i].intensity);
        }

        if (mesh.VAO) {
            mesh.VAO.bind();
            this.#gl.drawArrays(this.#gl.TRIANGLES, 0, mesh.vertexCount);
            return;
        }

        mesh.VB = new VertexBuffer(this.#gl, mesh.vertices.length * MeshVertex.vertexSize);

        const meshPosition = this.#renderData.largeMeshShader.getAttributeLocation('a_Position');
        const meshColor = this.#renderData.largeMeshShader.getAttributeLocation('a_Color');
        const meshTexCoord = this.#renderData.largeMeshShader.getAttributeLocation('a_TexCoord');
        const meshTexIndex = this.#renderData.largeMeshShader.getAttributeLocation('a_TexIndex');
        const meshNormal = this.#renderData.largeMeshShader.getAttributeLocation('a_Normal');
        const meshAmbient = this.#renderData.largeMeshShader.getAttributeLocation('a_Ambient');
        const meshDiffuse = this.#renderData.largeMeshShader.getAttributeLocation('a_Diffuse');
        const meshSpecular = this.#renderData.largeMeshShader.getAttributeLocation('a_Specular');
        const meshShininess = this.#renderData.largeMeshShader.getAttributeLocation('a_Shininess');
        mesh.VB.pushAttribute(meshPosition, 3);
        mesh.VB.pushAttribute(meshColor, 3);
        mesh.VB.pushAttribute(meshTexCoord, 2);
        mesh.VB.pushAttribute(meshTexIndex, 1);
        mesh.VB.pushAttribute(meshNormal, 3);
        mesh.VB.pushAttribute(meshAmbient, 3);
        mesh.VB.pushAttribute(meshDiffuse, 3);
        mesh.VB.pushAttribute(meshSpecular, 3);
        mesh.VB.pushAttribute(meshShininess, 1);

        mesh.VAO = new VertexArray(this.#gl);
        mesh.VAO.VB = mesh.VB;

        const parsedObj = mesh.vertices;
        const parsedMtl = mesh.material;

        for (let i = 0; i < parsedObj.length; i++) {

            const material = parsedMtl[parsedObj[i].material];

            let useTextureSlot = -1;

            if (material.diffuseMapSrc) {
                const diffuseMap = mesh.getMap(material.diffuseMapSrc);
            
                for (let i = 2; i < this.#renderData.textureSlotIndex; i++) {
                    if (this.#renderData.textureSlots[i] == diffuseMap) {
                        useTextureSlot = i;
                        break;
                    }
                }
                
                if (useTextureSlot === -1) {
                    useTextureSlot = this.#renderData.textureSlotIndex;
                    this.#renderData.textureSlots[this.#renderData.textureSlotIndex++] = diffuseMap;
                }
            } else {
                useTextureSlot = 0;
            }

            this.#meshVertex.position = parsedObj[i].position;
            this.#meshVertex.color = parsedObj[i].color ? parsedObj[i].color : mesh.color;
            this.#meshVertex.texCoord = parsedObj[i].texCoord;
            this.#meshVertex.texIndex = useTextureSlot;
            this.#meshVertex.normal = parsedObj[i].normal;

            this.#meshVertex.ambientColor = (material && material.ambientColor) ? material.ambientColor : Vector3.one;
            this.#meshVertex.diffuseColor = (material && material.diffuseColor) ? material.diffuseColor : Vector3.one;

            this.#meshVertex.specularColor = (material && material.specularColor) ? material.specularColor : Vector3.zero;
            this.#meshVertex.shininess = (material && material.shininess) ? material.shininess : 1.0;
            mesh.VB.addVertex(mesh.vertexCount, this.#meshVertex.flat);

            mesh.vertexCount++;
        }

        
        mesh.VAO.bind();
        mesh.VAO.VB.setData();
        this.#gl.drawArrays(this.#gl.TRIANGLES, 0, mesh.VB.count);
    }

    /**
     * 
     * @param {ParticleComponent} particle 
     */
    drawParticle(particle, dt) {
        this.#settings2d();

        if (particle.bornParticleCount < particle.maxCount) {
            particle.bornParticleCount = Math.min(
                particle.maxCount,
                Math.floor(particle.bornParticleCount + particle.birthRate * dt)
            );
        }

        this.#renderData.particleUpdateShader.bind();
        this.#renderData.particleUpdateShader.setUniform1f('u_TimeDelta', dt);
        this.#renderData.particleUpdateShader.setUniform3fv('u_Gravity', particle.gravity.data);
        this.#renderData.particleUpdateShader.setUniform3fv('u_Origin', particle.transform.position.data);
        this.#renderData.particleUpdateShader.setUniform1f('u_MinTheta', particle.minTheta);
        this.#renderData.particleUpdateShader.setUniform1f('u_MaxTheta', particle.maxTheta);
        this.#renderData.particleUpdateShader.setUniform1f('u_MinSpeed', particle.minSpeed);
        this.#renderData.particleUpdateShader.setUniform1f('u_MaxSpeed', particle.maxSpeed);
        this.#renderData.particleUpdateShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
        this.#renderData.particleUpdateShader.setUniform1i('u_Playing', particle.playing ? 1 : 0);

        this.#renderData.noiseTexture.bind(1);
        this.#renderData.particleUpdateShader.setUniform1i('u_RgNoise', 1);

        particle.vaos[particle.read].bind();
        particle.writeBuffer.bindBase();

        this.#gl.enable(this.#gl.RASTERIZER_DISCARD);

        this.#gl.beginTransformFeedback(this.#gl.POINTS);
        this.#gl.drawArrays(this.#gl.POINTS, 0, particle.bornParticleCount);
        this.#gl.endTransformFeedback();

        this.#gl.disable(this.#gl.RASTERIZER_DISCARD);

        particle.writeBuffer.unbindBase();
        
        this.#renderData.particleRenderShader.bind();
        this.#renderData.particleRenderShader.setUniform3fv('u_Color', particle.color.data);
        particle.vaos[particle.read + 2].bind();
        this.#gl.drawArrays(this.#gl.POINTS, 0, particle.bornParticleCount);
        particle.swapReadWrite();
    }

    /**
     * 
     * @param {TilemapComponent} tilemapComponent 
     */
    drawTilemap(tilemapComponent) {
        const tilemap = tilemapComponent.tilemap;
        const texCoordMap = tilemapComponent.texCoordsMap;
        const spriteSheet = tilemapComponent.spriteSheet;

        let useTextureSlot = -1;

        if (spriteSheet.texture) {
            
            for (let i = 2; i < this.#renderData.textureSlotIndex; i++) {
                if (this.#renderData.textureSlots[i] == spriteSheet.texture) {
                    useTextureSlot = i;
                    break;
                }
            }
    
            if (this.#renderData.textureSlotIndex >= this.#renderData.maxTextureSlotCount) {
                this.#flush();
            }
    
            if (useTextureSlot === -1) {
                useTextureSlot = this.#renderData.textureSlotIndex;
                this.#renderData.textureSlots[this.#renderData.textureSlotIndex++] = spriteSheet.texture;
            }
        } else {
            useTextureSlot = 0;
        }
        
        const t = tilemapComponent.transform.transformMatrix;
        const currentPosition = Vector3.zero;
        const white = Color.white;

        for (let i = 0; i < tilemap.length; i++) {
            for (let j = 0; j < tilemap[i].length; j++) {
                if (tilemap[i][j] != ' ') {
                    const tile = tilemap[i][j];
                    const texCoords = texCoordMap.get(tile);

                    for (let k = 0; k < 4; k++) {
                        currentPosition.x = this.#renderData.initialVertexPositions[k].x + j;
                        currentPosition.y = this.#renderData.initialVertexPositions[k].y + i;

                        this.#quadVertex.position = t.multiplyVector3(currentPosition);
                        this.#quadVertex.color = white;
                        this.#quadVertex.texCoords = texCoords[k];
                        this.#quadVertex.texIndex = useTextureSlot;

                        this.#renderData.quadVB.addVertex(this.#renderData.quadVertexCount, this.#quadVertex.flat);

                        this.#renderData.quadVertexCount++;
                    }

                    this.#renderData.quadIndexCount += 6;
                }
            }
        }
    }
    
    #flush() {
        for (let i = 0; i < this.#renderData.textureSlotIndex; i++) {
            this.#renderData.textureSlots[i].bind(i);
        }

        if (this.#renderData.quadIndexCount > 0) {  
            this.#settings2d();
    
            this.#renderData.quadVAO.bind();
            this.#renderData.quadVAO.VB.setData();
            this.#renderData.quadShader.bind();
            this.#renderData.quadShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
            this.#renderData.quadShader.setUniform1i('u_LightCount', this.#sceneData.lights.length);
            for (let i = 0; i < this.#sceneData.lights.length; i++) {
                this.#renderData.quadShader.setUniform3fv(`u_Lights[${i}].position`, this.#sceneData.lights[i].position.data);
                this.#renderData.quadShader.setUniform3fv(`u_Lights[${i}].color`, this.#sceneData.lights[i].color.data);
                this.#renderData.quadShader.setUniform1f(`u_Lights[${i}].intensity`, this.#sceneData.lights[i].intensity);
            }
            this.#gl.drawElements(this.#gl.TRIANGLES, this.#renderData.quadIndexCount, this.#gl.UNSIGNED_SHORT, 0);
        }
        if (this.#renderData.lineVertexCount > 0) {
            this.#settings2d();

            this.#renderData.lineVAO.bind();
            this.#renderData.lineVAO.VB.setData();
            this.#renderData.lineShader.bind();
            this.#renderData.lineShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
            this.#gl.drawArrays(this.#gl.LINES, 0, this.#renderData.lineVertexCount);
        }
        if (this.#renderData.meshVertexCount > 0) {
            this.#settings3d();
    
            this.#renderData.meshVAO.bind();
            this.#renderData.meshVAO.VB.setData();
            this.#renderData.meshShader.bind();
            this.#renderData.meshShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
            this.#renderData.meshShader.setUniform3fv('u_CameraPosition', this.#sceneData.cameraPos.data);


            this.#renderData.meshShader.setUniform1i('u_LightCount', this.#sceneData.lights.length);
            for (let i = 0; i < this.#sceneData.lights.length; i++) {
                this.#renderData.meshShader.setUniform3fv(`u_Lights[${i}].position`, this.#sceneData.lights[i].position.data);
                this.#renderData.meshShader.setUniform3fv(`u_Lights[${i}].color`, this.#sceneData.lights[i].color.data);
                this.#renderData.meshShader.setUniform1f(`u_Lights[${i}].intensity`, this.#sceneData.lights[i].intensity);
            }
            this.#gl.drawArrays(this.#gl.TRIANGLES, 0, this.#renderData.meshVertexCount);
        }

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
        // this.#gl.disable(this.#gl.CULL_FACE);
        this.#gl.enable(this.#gl.DEPTH_TEST);
    }

    #settings3d() {
        // this.#gl.enable(this.#gl.CULL_FACE);
        this.#gl.enable(this.#gl.DEPTH_TEST);
    }
}