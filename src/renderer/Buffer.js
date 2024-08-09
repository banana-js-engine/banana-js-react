/**
 * Class that encapsulates WebGL vertex buffers (gl.ARRAY_BUFFER)
 */
export class VertexBuffer {
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
     * @param {Float32Array} data the vertex data to be rendered
     */
    constructor(gl, data) {
        this.#gl = gl;

        this.#bufferId = this.#gl.createBuffer();

        if (data instanceof Float32Array) {
            this.#data = data;
        } else if (typeof data == 'number') {
            this.#data = new Float32Array(data);
        } else {
            console.error(`${typeof data} is not supported for vertex buffers`);
            return;
        }

        this.#data = data;

        this.#offset = 0;
        this.#stride = 0;
        this.#attributes = [];
    }

    /**
     * Binds the vertex buffer
     */
    bind() {
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#bufferId);
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, this.#data, this.#gl.DYNAMIC_DRAW);
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
    pushAttribute(location, count, normalized = false) {
        this.#attributes.push({ location, count, normalized });
        this.#stride += 4 * count;
    }

    /**
     * Binds attributes
     */
    linkAttributes() {
        this.#attributes.forEach(attribute => {   
            this.#gl.enableVertexAttribArray(attribute.location);
            this.#gl.vertexAttribPointer(attribute.location, attribute.count, this.#gl.FLOAT, attribute.normalized, this.stride, this.offset);

            this.#offset += 4 * attribute.count;
        });

        this.#offset = 0;
    }
}