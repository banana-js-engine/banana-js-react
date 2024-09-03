import { Matrix4 } from "../math/Matrix";
import { Vector3, Vector4 } from "../math/Vector";
import { Texture } from "../renderer/Texture";

export const ComponentType = {
    None: -1,
    Transform: 0,
    Sprite: 1,
    Camera: 2,
    Script: 3,
    Audio: 4,
};

class Component {
    get type() {
        return ComponentType.None;
    }
}

/**
 * Represent a GameObject's orientation in the scene
 */
export class TransformComponent extends Component {
    #positionMat;
    #rotationXMat;
    #rotationYMat;
    #rotationZMat;
    #scaleMat;

    #position;
    #rotation;
    #scale;

    #transform;

    constructor(position, rotation, scale) {
        super();
        this.#positionMat = Matrix4.zero;
        this.#rotationXMat = Matrix4.zero;
        this.#rotationYMat = Matrix4.zero;
        this.#rotationZMat = Matrix4.zero;
        this.#scaleMat = Matrix4.zero;

        this.#position = Vector3.zero;
        this.#rotation = Vector3.zero;
        this.#scale = Vector3.one;

        this.#transform = new Matrix4();

        
        if (position) {
            const pos = this.#processParameterType(position);
            this.moveTo(pos.x, pos.y, pos.z);
        }
        if (rotation) {
            const rot = this.#processParameterType(rotation);
            this.rotateTo(rot.x, rot.y, rot.z);
        }
        if (scale) {
            const sc = this.#processParameterType(scale);
            this.scaleTo(sc.x, sc.y, sc.z);
        }
    }

    get type() {
        return ComponentType.Transform;
    }

    get transformMatrix() {
        this.#positionMat.setTranslation(this.#position);
        this.#rotationXMat.setRotationX(this.#rotation.x);
        this.#rotationYMat.setRotationY(this.#rotation.y);
        this.#rotationZMat.setRotationZ(this.#rotation.z);
        this.#scaleMat.setScale(this.#scale);

        this.#transform.identity();
        this.#transform.multiply(this.#scaleMat);
        this.#transform.multiply(this.#rotationXMat);
        this.#transform.multiply(this.#rotationYMat);
        this.#transform.multiply(this.#rotationZMat);
        this.#transform.multiply(this.#positionMat);

        return this.#transform;
    }

    get scale() {
        return this.#scale;
    }

    #processParameterType(param) {
        if (typeof param[0] === 'number') {
            return { x: param[0], y: param[1], z: param[2] };
        } else if (param instanceof Vector3) {
            return { x: param.x, y: param.y, z: param.z };
        }

        console.error('Invalid type for transform')
        return null;
    } 

    /**
     * Set the position to the given x, y, z values
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    moveTo(x, y, z) {
        this.#position.x = x;
        this.#position.y = y;
        this.#position.z = z;
    }

    /**
     * Increment the position by the given x, y, z values
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    moveBy(x, y, z) {
        this.#position.x += x;
        this.#position.y += y;
        this.#position.z += z;
    }

    /**
     * Set the rotation to the given x, y, z values
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    rotateTo(x, y, z) {
        this.#rotation.x = x;
        this.#rotation.y = y;
        this.#rotation.z = z;
    }

    /**
     * Increment the rotation by the given x, y, z values
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    rotateBy(x, y, z) {
        this.#rotation.x += x;
        this.#rotation.y += y;
        this.#rotation.z += z;
    }

    /**
     * Set the scale to the given x, y, z values
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    scaleTo(x, y, z) {
        this.#scale.x = x;
        this.#scale.y = y;
        this.#scale.z = z;
    }

    /**
     * Multiply the scale by the given x, y, z values
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    scaleBy(x, y, z) {
        this.#scale.x *= x;
        this.#scale.y *= y;
        this.#scale.z *= z;
    }
}

/**
 * Represents a GameObject's 2D render information
 */
export class SpriteComponent extends Component {
    #color;
    #texture;

    /**
     * @type {TransformComponent} transform 
     */
    #transform;

    constructor(gl, transform, color, textureSrc, flipX, flipY) {
        super();
        this.#color = Vector4.one;

        if (color) {
            const c = this.#processParameterType(color);
            this.setColor(c.r, c.g, c.b, c.a);
        }

        if (textureSrc) {
            this.#texture = new Texture(gl, textureSrc);
        }

        this.#transform = transform;

        if (flipX) {
            this.flipX = flipX;
        }
        else {
            this.flipX = false;
        }

        if (flipY) {
            this.flipY = flipY;
        }
        else {
            this.flipY = false;
        }
    }

    get type() {
        return ComponentType.Sprite;
    }

    #processParameterType(param) {
        if (typeof param[0] === 'number') {
            return { r: param[0], g: param[1], b: param[2], a: param[3] };
        } else if (param instanceof Vector4) {
            return { r: param.x, g: param.y, b: param.z, a: param.w };
        }

        console.error('Invalid type for sprite')
        return null;
    }
    
    get color() {
        return this.#color;
    }

    setColor(r, g, b, a) {
        this.#color.x = r;
        this.#color.y = g;
        this.#color.z = b;
        this.#color.w = a;
    }

    get texture() {
        return this.#texture;
    }

    get flipX() {
        return this.#transform.scale.y < 0;
    }

    get flipY() {
        return this.#transform.scale.x < 0;
    }

    set flipX(newValue) {
        if ((!newValue && this.flipX) || (newValue && !this.flipX)) {
            this.#transform.scaleTo(-this.#transform.scale.x, -this.#transform.scale.y, this.#transform.scale.z)
        }
    }

    set flipY(newValue) {
        if ((!newValue && this.flipY) || (newValue && !this.flipY)) {
            this.#transform.scaleTo(this.#transform.scale.x, -this.#transform.scale.y, this.#transform.scale.z)
        }
    }
}

/**
 * Represent a camera, how the scene is viewed
 */
export class CameraComponent extends Component {

    #projectionMatrix;
    #clearColor;
    #aspectRatio;

    #size;
    #near;
    #far;

    constructor(isOrtho, clearColor, size, near, far) {
        super();

        this.#projectionMatrix = Matrix4.zero;

        this.#clearColor = new Vector4(0.345, 0.588, 0.809, 1);
        if (clearColor) {
            const cc = this.#processParameterType(clearColor);
            this.setClearColor(cc.r, cc.g, cc.b, cc.a);
        }

        const canvas = document.getElementById('banana-canvas');
        this.#aspectRatio = canvas.clientWidth / canvas.clientHeight;

        this.#size = isOrtho ? 10 : 45;
        this.#near = isOrtho ? -1 : 10;
        this.#far =  isOrtho ? 1 : 1000;

        if (size) {
            this.#size = size;
        }

        if (near) {
            this.#near = near;
        }

        if (far)
            this.#far = far;

        if (isOrtho) {
            this.setOrthographic();
        } else {
            this.setPerspective();
        }
    }

    get type() {
        return ComponentType.Camera;
    }

    #processParameterType(param) {
        if (typeof param[0] === 'number') {
            return { r: param[0], g: param[1], b: param[2], a: param[3] };
        } else if (param instanceof Vector4) {
            return { r: param.x, g: param.y, b: param.z, a: param.w };
        }

        console.error('Invalid type for camera')
        return null;
    }

    get projection() {
        return this.#projectionMatrix;
    }

    get clearColor() {
        return this.#clearColor;
    }

    setOrthographic() {
        const left = -this.#size * this.#aspectRatio * 0.5;
        const right = this.#size * this.#aspectRatio * 0.5;
        const bottom = this.#size * 0.5;
        const top = -this.#size * 0.5;

        this.#projectionMatrix.setOrtho(left, right, bottom, top, this.#near, this.#far);
    }

    setClearColor(r, g, b, a) {
        this.#clearColor.x = r;
        this.#clearColor.y = g;
        this.#clearColor.z = b;
        this.#clearColor.w = a;
    }
}

export class ScriptComponent extends Component {

    #id;
    #ecs;

    isReadyCalled;

    constructor(id, ecs) {
        super();

        this.#id = id;
        this.#ecs = ecs;

        this.isReadyCalled = false;
    }

    get type() {
        return ComponentType.Script;
    }

    // this function is called once when the game starts
    ready() {}

    // this function is called every frame
    step(dt) {}

    // component related functions
    getComponent(type) {
        return this.#ecs.get(this.#id, type);
    }
}

export class AudioComponent extends Component {

    #audioContext;
    #buffer;
    #volume;
    #playOnStart;
    #loop;
    #startTime;
    #pauseTime;
    #playing;

    /**
     * @type {AudioBufferSourceNode}
     */
    #source;

    /**
     * @type {GainNode}
     */
    #gainNode;

    /**
     * Create a audio source
     * @param {AudioContext} audioContext 
     * @param {AudioBuffer} buffer 
     * @param {number} volume 
     * @param {boolean} playOnStart 
     * @param {boolean} loop 
     */
    constructor(audioContext, buffer, volume = 0.5, playOnStart = false, loop = false) {
        super();

        this.#audioContext = audioContext;
        this.#buffer = buffer;
        this.#volume = volume;
        this.#playOnStart = playOnStart;
        this.#loop = loop;
        this.#pauseTime = 0;
        this.#playing = false;

        this.#gainNode = this.#audioContext.createGain();
        this.#gainNode.connect(this.#audioContext.destination);

        if (this.#playOnStart) {
            this.play();
        }
    }

    get type() {
        return ComponentType.Audio;
    }

    /**
     * starts playing the selected audio
     */
    play() {
        const canvas = document.getElementById('banana-canvas');
        canvas.addEventListener('click', this.#resume);
        canvas.addEventListener('blur', this.#pause);

        this.#startTime = this.#audioContext.currentTime;
        this.#resume();   
    }

    /**
     * stops the audio
     */
    stop() {
        if (this.#source) {
            const canvas = document.getElementById('banana-canvas');
            canvas.removeEventListener('click', this.#resume);
            canvas.removeEventListener('blur', this.#pause);

            this.#source.stop(0);
            this.#source.disconnect();
            this.#source = null;
            this.#pauseTime = 0;
            this.#playing = false;
        }
    }

    /**
     * plays an audio once, (used typically for sfxs)
     */
    playOnce() {
        this.#source = this.#audioContext.createBufferSource();
        this.#source.buffer = this.#buffer;
        this.#source.connect(this.#gainNode);
        this.#source.start(0);
    } 

    /**
     * pause the audio
     */
    pause() {
        this.#source.stop(0);
        this.#source.disconnect();
        this.#playing = false;
    }

    /**
     * resumes audio, (private arrow function version)
     */
    #resume = () => {
        if (!this.#playing) {
            this.#source = this.#audioContext.createBufferSource();
            this.#source.buffer = this.#buffer;
            this.#source.loop = this.#loop;
            this.#source.connect(this.#gainNode);
            this.#source.start(0, this.#pauseTime);
            this.#playing = true;
        } 
    }

    /**
     * pause the audio, (private arrow function version)
     */
    #pause = () => {
        this.#pauseTime = this.#audioContext.currentTime - this.#startTime;
        this.#source.stop(0);
        this.#source.disconnect();
        this.#playing = false;
    }

    /**
     * sets the volume to @param volume
     */
    setVolume(volume) {
        this.#volume = volume;
        this.#gainNode.gain.volume = this.#volume;
    }
}