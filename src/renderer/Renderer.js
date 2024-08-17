import { Matrix4 } from "../math/Matrix";
import { Vector2, Vector3 } from "../math/Vector";
import { IndexBuffer, VertexBuffer } from "./Buffer";
import { Shader } from "./Shader";
import { Texture } from "./Texture";

class QuadVertex {
    position = null;
    color = null;
    texCoords = null;
    texIndex = -1;

    get flat() {
        if (!this.position || !this.color || !this.texCoords || this.texIndex === -1) {
            console.error('assign all properties before calling flat()!');
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
    };

    #sceneData = {
        /**
         * @type {Matrix4}
         */
        projection: Matrix4.zero,

        /**
         * @type {Matrix4}
         */
        view: Matrix4.zero
    }

    /**
     * @type {QuadVertex} vertex of type quad (used for caching reasons)
     */
    #quadVertex;

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
        this.#gl.disable(this.#gl.DEPTH_TEST);

        this.#renderData.maxTextureSlotCount = this.#gl.getParameter(this.#gl.MAX_TEXTURE_IMAGE_UNITS);
        this.#renderData.whiteTexture = new Texture(this.#gl); // without src, we'll get the default 1x1 white texture

        // initialize vertices of each type
        this.#quadVertex = new QuadVertex();

        // prepare indices for index buffer creation
        const indices = new Uint16Array(this.#renderData.maxIndices);

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
        this.#renderData.quadShader = new Shader(this.#gl, 'shader/quad_shader.glsl');
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
        this.#renderData.quadVB.linkAttributes();        

        // textures
        const samplers = [];
        for (let i = 0; i < this.#renderData.maxTextureSlotCount; i++) {
            samplers[i] = i;
        }

        this.#renderData.quadShader.setUniform1iv('u_Textures', samplers);

        this.#renderData.textureSlots[0] = this.#renderData.whiteTexture;
    }

    beginScene(transform, camera) {
        // setup the view matrix
        this.#sceneData.view.identity();
        this.#sceneData.view.multiply(transform.transformMatrix);
        this.#sceneData.view.invert();
        this.#sceneData.view.transpose();

        // setup the (view-)projection matrix
        this.#sceneData.projection.identity();
        this.#sceneData.projection.multiply(camera.projection);
        this.#sceneData.projection.multiply(this.#sceneData.view);

        this.#renderData.quadShader.setUniformMatrix4fv('u_ViewProjectionMatrix', this.#sceneData.projection.flat);
    }

    endScene() {
        this.#flush();
    }

    drawQuad(transform, sprite) {

        if (this.#renderData.quadIndexCount >= this.#renderData.maxIndices) {
            this.#flush();
        }

        let useTextureSlot = -1;
        
        if (sprite.texture) {
            for (let i = 0; i < this.#renderData.textureSlotIndex; i++) {
                if (this.#renderData.textureSlots[i] === sprite.texture) {
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
            this.#quadVertex.texCoords = this.#renderData.textureCoords[i];
            this.#quadVertex.texIndex = useTextureSlot;

            this.#renderData.quadVB.addVertex(this.#renderData.quadVertexCount, this.#quadVertex.flat);

            this.#renderData.quadVertexCount++;
        }

        this.#renderData.quadIndexCount += 6;
    }

    #flush() {
        for (let i = 0; i < this.#renderData.textureSlotIndex; i++) {
            this.#renderData.textureSlots[i].bind(i);
        }

        this.#renderData.quadVB.bind();
        this.#gl.drawElements(this.#gl.TRIANGLES, this.#renderData.quadIndexCount, this.#gl.UNSIGNED_SHORT, 0);

        // reset batch
        this.#renderData.quadVertexCount = 0;
        this.#renderData.quadIndexCount = 0;

        this.#renderData.textureSlotIndex = 1;
    }

    clear() {
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
    }

    setClearColor(r, g, b, a) {
        this.#gl.clearColor(r, g, b, a);
    }
}