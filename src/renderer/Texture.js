export class Texture {

    /**
     * @type {Map<string, Texture>}
     */
    static #textureCache = new Map();

    #gl;
    
    #textureId;
    #image;

    /**
     * 
     * @param {WebGL2RenderingContext} gl the WebGL context 
     * @param {string} src path to the texture (png, jpeg, whatever)
     */
    constructor(gl, src) {
        if (Texture.#textureCache.get(src)) {
            return Texture.#textureCache.get(src);
        }

        this.#gl = gl;

        this.#textureId = this.#gl.createTexture();
        this.bind();

        // Fill the texture with a 1x1 white pixel.
        this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, this.#gl.RGBA, 1, 1, 0, this.#gl.RGBA, this.#gl.UNSIGNED_BYTE,
            new Uint8Array([255, 255, 255, 255]));

        if (!src) {
            return;
        }
        
        this.#image = new Image();
        this.#image.src = src;
        this.#image.addEventListener('load', this.#onImageLoaded);

        Texture.#textureCache.set(src, this);
    }

    static createNoiseTexture(gl) {
        const noiseTexture = new Texture(gl);
        
        noiseTexture.bind(1);
    
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG8, 512, 512, 0, gl.RG, gl.UNSIGNED_BYTE, this.#randomRGData(512, 512));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        noiseTexture.unbind();

        return noiseTexture;
    }

    static #randomRGData(size_x, size_y) {
        var d = [];
        for (var i = 0; i < size_x * size_y; ++i) {
            d.push(Math.random() * 255.0);
            d.push(Math.random() * 255.0);
        }
        return new Uint8Array(d);
    }

    get width() {
        return this.#image.width;
    }

    get height() {
        return this.#image.height;
    }

    get src() {
        return this.#image.src;
    }

    get image() {
        return this.#image;
    }

    bind(unit = 0) {
        this.#gl.activeTexture(this.#gl.TEXTURE0 + unit);
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#textureId);
    }

    unbind() {
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, null);
    }

    #onImageLoaded = () => {
        this.bind();
        
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, this.#gl.CLAMP_TO_EDGE);
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, this.#gl.CLAMP_TO_EDGE);
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#gl.NEAREST);
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MAG_FILTER, this.#gl.NEAREST);

        this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, this.#gl.RGBA, this.#gl.RGBA, this.#gl.UNSIGNED_BYTE, this.#image);

        this.unbind();

        this.#image.removeEventListener('load', this.#onImageLoaded);
        this.onTextureCreated();
    }

    onTextureCreated = () => {}
}