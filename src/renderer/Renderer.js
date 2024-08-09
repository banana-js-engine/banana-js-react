import { VertexBuffer } from "./Buffer";
import { Shader } from "./Shader";

/**
 * Class that does the rendering by using the encapsulated WebGL objects
 */
export default class Renderer {

    #gl;

    /**
     * 
     * @param {WebGL2RenderingContext} gl the WebGL context 
     */
    constructor(gl) {
        this.#gl = gl;

        const data = new Float32Array([-1, -1, 0, 1, 1, -1]);
        // const data = 'asdasda';

        const buffer = new VertexBuffer(this.#gl, data);
        const shader = new Shader(this.#gl, 'shader/basic_shader.glsl');

        const pos = shader.getAttributeLocation('a_Position');
        buffer.pushAttribute(pos, 2);
        buffer.linkAttributes();

        buffer.bind();
        shader.bind();
    }

    drawTriangle() {
        this.#gl.drawArrays(this.#gl.TRIANGLES, 0, 3);
    }
}