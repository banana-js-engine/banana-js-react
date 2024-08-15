import { Vector3 } from "../math/Vector";
import { IndexBuffer, VertexBuffer } from "./Buffer";
import { Shader } from "./Shader";

class QuadVertex {
    position = null;
    color = null;

    flat() {
        if (!this.position || !this.color) {
            console.error('assign all properties before calling flat()!');
            return;
        }

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

    static vertexSize = 3;
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
        quadIB: null
    };

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
        this.#renderData.quadVB = new VertexBuffer(this.#gl, this.#renderData.maxVertices * 3);
        this.#renderData.quadIB = new IndexBuffer(this.#gl, indices);

        const quadPosition = this.#renderData.quadShader.getAttributeLocation('a_Position');
        const quadColor = this.#renderData.quadShader.getAttributeLocation('a_Color');
        this.#renderData.quadVB.pushAttribute(quadPosition, 3);
        this.#renderData.quadVB.pushAttribute(quadColor, 4);
        this.#renderData.quadVB.linkAttributes();        
    }

    drawQuad(transform, sprite) {

        const t = transform.transformMatrix;

        for (let i = 0; i < 4; i++) {
            this.#quadVertex.position = t.multiplyVector3(this.#renderData.initialVertexPositions[i]);
            this.#quadVertex.color = sprite.color;

            this.#renderData.quadVB.addVertex(this.#renderData.quadVertexCount, this.#quadVertex.flat());

            this.#renderData.quadVertexCount++;
        }

        this.#renderData.quadIndexCount += 6;
    }

    flush() {
        this.#renderData.quadVB.bind();
        this.#gl.drawElements(this.#gl.TRIANGLES, this.#renderData.quadIndexCount, this.#gl.UNSIGNED_SHORT, 0);
    }

    clear() {
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
    }

    setClearColor(r, g, b, a) {
        this.#gl.clearColor(r, g, b, a);
    }
}