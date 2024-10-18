/**
 * Class that represents WebGL shaders
 */
export class Shader {

    static get quadShader16Path() {
        return 'shader/quad_shader_16.glsl';
    }

    static get quadShader48Path() {
        return 'shader/quad_shader_48.glsl';
    }

    static get lineShaderPath() {
        return 'shader/line_shader.glsl';
    }

    #gl
    #shaderId;
    #uniformLookupTable;

    /**
     * Create a shader
     * @param {WebGL2RenderingContext} gl the WebGL context
     * @param {string} source source to the shader
     */
    constructor(gl, source) {
        this.#gl = gl;

        this.#shaderId = this.#compile(source);
        this.#uniformLookupTable = {};
        
        this.bind();
    }

    /**
     * Compile vertex and fragment shader and then link them
     * @param {string} source source to the shader 
     * @returns the program (or the shader) id
     */
    #compile(source) {
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
        this.#gl.linkProgram(program);

        if (!this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS)) {
            alert(this.#gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    bind() {
        this.#gl.useProgram(this.#shaderId);
    }

    unbind() {
        this.#gl.useProgram(null);
    }

    getAttributeLocation(name) {
        return this.#gl.getAttribLocation(this.#shaderId, name);
    }

    #getUniformLocation(name) {
        if (this.#uniformLookupTable[name]) {
            return this.#uniformLookupTable[name];
        }

        const uniformLocation = this.#gl.getUniformLocation(this.#shaderId, name);
        this.#uniformLookupTable[name] = uniformLocation;
        return uniformLocation;
    }

    setUniformMatrix4fv(name, value, transpose = false) {
        const uniformLocation = this.#getUniformLocation(name);
        this.#gl.uniformMatrix4fv(uniformLocation, transpose, value);
    }

    setUniform1iv(name, value) {
        const uniformLocation = this.#getUniformLocation(name);
        this.#gl.uniform1iv(uniformLocation, value);
    }
}