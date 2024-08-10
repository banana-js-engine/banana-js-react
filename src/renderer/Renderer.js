import { Vector3 } from "../math/Vector";
import { IndexBuffer, VertexBuffer } from "./Buffer";
import { Shader } from "./Shader";

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
     * 
     * @param {WebGL2RenderingContext} gl the WebGL context 
     */
    constructor(gl) {
        this.#gl = gl;

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
        this.#renderData.quadVB = new VertexBuffer(this.#gl, this.#renderData.maxVertices);
        this.#renderData.quadIB = new IndexBuffer(this.#gl, indices);

        const quadPosition = this.#renderData.quadShader.getAttributeLocation('a_Position');
        this.#renderData.quadVB.pushAttribute(quadPosition, 3);
        this.#renderData.quadVB.linkAttributes();        
    }
}