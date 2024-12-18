import { Matrix4 } from "../math/Matrix";
import { Vector2, Vector3, Vector4 } from "../math/Vector";
import { AABB } from "../physics/AABB";
import { Texture } from "../renderer/Texture";
import { Color } from "../renderer/Color";
import { VertexBuffer } from "../renderer/Buffer";
import { ComponentType, KeyCode, MouseButtonCode, ShapeType } from "../core/Types";
import { clamp01, toDegrees } from "../math/bananaMath";
import { AnimationClip } from "../renderer/AnimationClip";
import { WavefrontParser } from "../renderer/WavefrontParser";
import { GO } from "./GO";
import { VertexArray } from "../renderer/VertexArray";
import { SpriteSheet } from "../renderer/SpriteSheet";
import { readFileAsText } from "../utils/file";
import { Input } from "../core/Input";


export class BaseComponent {

    gameObject;

    /**
     * @param {GO} gameObject 
     */
    constructor(gameObject) {
        this.gameObject = gameObject;
    }

    get type() {
        return ComponentType.None;
    }

    get active() {
        return this.gameObject.active;
    }

    set active(value) {
        this.gameObject.active = value;
    }

    get transform() {
        return this.gameObject.transform;
    }

    /**
     * @returns {CameraComponent}
     */
    get mainCamera() {
        const cameras = this.gameObject.getComponents(ComponentType.Camera);

        if (cameras.length == 0) {
            return null;
        }

        return cameras[0];
    }

    // component related functions
    getComponent(type) {
        return this.gameObject.getComponent(type);
    }
    
    hasComponent(type) {
        return this.gameObject.hasComponent(type);
    }

    addComponent(component) {
        return this.gameObject.addComponent(component);
    }

    _processParameterVector3(param) {
        if (typeof param[0] === 'number') {
            return { x: param[0], y: param[1], z: param[2] };
        } else if (param instanceof Vector3) {
            return { x: param.x, y: param.y, z: param.z };
        }

        console.error('Invalid type for vector 3')
        return null;
    } 

    _processParameterVector4(param) {
        if (typeof param[0] === 'number') {
            return { r: param[0], g: param[1], b: param[2], a: param[3] };
        } else if (param instanceof Vector4) {
            return { r: param.x, g: param.y, b: param.z, a: param.w };
        }

        console.error('Invalid type for color')
        return null;
    }
}

export class UIComponent extends BaseComponent {
    left;
    top;

    constructor(gameObject, left, top) {
        super(gameObject);

        this.left = left ? left : 0;
        this.top = top ? top : 0;
    }
}

export class NameComponent extends BaseComponent {
    #name;

    constructor(gameObject, name) {
        super(gameObject);

        if (name) {
            this.#name = name;
        }
        else {
            this.#name = 'GameObject';
        }

    }

    get type() {
        return ComponentType.Name;
    }

    get name() {
        return this.#name;
    }

    set name(newName) {
        this.#name = newName;
    }
}

/**
 * Represent a GameObject's orientation in the scene
 */
export class TransformComponent extends BaseComponent {
    #positionMat;
    #rotationXMat;
    #rotationYMat;
    #rotationZMat;
    #scaleMat;

    #position;
    #rotation;
    #scale;

    #transform;

    #lastMovedTimestamp

    constructor(gameObject, position, rotation, scale) {
        super(gameObject);

        this.#positionMat = Matrix4.zero;
        this.#rotationXMat = Matrix4.zero;
        this.#rotationYMat = Matrix4.zero;
        this.#rotationZMat = Matrix4.zero;
        this.#scaleMat = Matrix4.zero;

        this.#position = Vector3.zero;
        this.#rotation = Vector3.zero;
        this.#scale = Vector3.one;

        if (position) {
            this.position = position;
        }

        if (rotation) {
            this.rotation = rotation;
        }

        if (scale) {
            this.scale = scale;
        }

        this.#transform = new Matrix4();

        this.#lastMovedTimestamp = 0;
    }

    get type() {
        return ComponentType.Transform;
    }

    get position() {
        return this.#position;
    }

    get rotation() {
        return this.#rotation;
    }

    get scale() {
        return this.#scale;
    }

    set position(newPosition) {
        const pos = this._processParameterVector3(newPosition);
        this.moveTo(pos.x, pos.y, pos.z);
    }

    set rotation(newRotation) {
        const rot = this._processParameterVector3(newRotation);
        this.rotateTo(rot.x, rot.y, rot.z);
    }

    set scale(newScale) {
        const sc = this._processParameterVector3(newScale);
        this.scaleTo(sc.x, sc.y, sc.z);
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

        if (this.gameObject.parent) {
            this.#transform.multiply(this.gameObject.parent.transform.transformMatrix);
        }

        return this.#transform;
    }

    get lastMovedTimestamp() {
        return this.#lastMovedTimestamp;
    }

    /**
     * Set the position to the given x, y, z values
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    moveTo(x, y, z) {

        if (x instanceof Vector3) {
            this.#position.x = x.x;
            this.#position.y = x.y;
            this.#position.z = x.z;
            return;
        }

        if (x instanceof Vector2) {
            this.#position.x = x.x;
            this.#position.y = x.y;
            return;
        }

        this.#position.x = x;
        this.#position.y = y;
        this.#position.z = z;

        this.#lastMovedTimestamp = performance.now();
    }

    /**
     * Increment the position by the given x, y, z values
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    moveBy(x, y, z) {

        if (x instanceof Vector3) {
            this.#position.x += x.x;
            this.#position.y += x.y;
            this.#position.z += x.z;
            return;
        }

        if (x instanceof Vector2) {
            this.#position.x += x.x;
            this.#position.y += x.y;
            return;
        }

        this.#position.x += x;
        this.#position.y += y;
        this.#position.z += z;

        this.#lastMovedTimestamp = performance.now();
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
export class SpriteComponent extends BaseComponent {

    /**
     * @type {Vector4}
     */
    #color;

    /**
     * @type {Texture}
     */
    #texture;

    /**
     * @type {Texture}
     */
    #originalTexture;

    /**
     * @type {Vector2[]} #texCoords
     */
    #texCoords;

    constructor(gameObject, textureSrc, color, flipX, flipY) {
        super(gameObject);
        this.#color = Vector4.one;

        if (textureSrc) {
            this.#texture = new Texture(this.gameObject.gl, textureSrc);
            this.#originalTexture = this.#texture;
        }

        this.#texCoords = [
            Vector2.zero,
            Vector2.right,
            Vector2.up,
            Vector2.one,
        ];

        if (color) {
            this.color = color;
        }

        if (typeof flipX != 'undefined') {
            this.flipX = flipX;
        }

        if (typeof flipY != 'undefined') {
            this.flipY = flipY;
        }
    }

    get type() {
        return ComponentType.Sprite;
    }

    set texture(newTexture) {
        this.#texture = newTexture;
    }

    get texCoords() {
        return this.#texCoords;
    }

    /**
     * @param {Vector2[]} newCoords 
     */
    set texCoords(newCoords) {
        if (this.#texCoords.length != newCoords.length) {
            return;
        }

        for (let i = 0; i < this.#texCoords.length; i++) {
            this.#texCoords[i].set(newCoords[i]);
        }
    }

    default() {
        this.texture = this.#originalTexture;

        this.#texCoords[0].set(0, 0);
        this.#texCoords[1].set(1, 0);
        this.#texCoords[2].set(0, 1);
        this.#texCoords[3].set(1, 1);
    }
    
    get color() {
        return this.#color;
    }

    set color(newColor) {
        const c = this._processParameterVector4(newColor);
        this.#color.set(c.r, c.g, c.b, c.a);  
    }

    get texture() {
        return this.#texture;
    }

    get flipX() {
        return this.transform.scale.x < 0;
    }

    get flipY() {
        return this.transform.scale.y < 0;
    }

    set flipX(newValue) {
        if ((!newValue && this.flipX) || (newValue && !this.flipX)) {
            this.transform.scaleTo(-this.transform.scale.x, this.transform.scale.y, this.transform.scale.z)
        }
    }

    set flipY(newValue) {
        if ((!newValue && this.flipY) || (newValue && !this.flipY)) {
            this.transform.scaleTo(this.transform.scale.x, -this.transform.scale.y, this.transform.scale.z)
        }
    }
}

/**
 * Represent a camera, how the scene is viewed
 */
export class CameraComponent extends BaseComponent {

    /**
     * @type {HTMLCanvasElement}
     */
    #canvas;

    #projectionMatrix;
    #clearColor;
    #aspectRatio;

    #size;
    #near;
    #far;

    #isOrtho;

    /**
     * @type {AABB} AABB
     */
    #AABB;

    constructor(gameObject, clearColor, isOrtho, size, near, far) {
        super(gameObject);

        this.#projectionMatrix = Matrix4.zero;

        this.#clearColor = new Vector4(0.345, 0.588, 0.809, 1);

        this.#canvas = document.getElementById('banana-canvas');
        this.#aspectRatio = this.#canvas.clientWidth / this.#canvas.clientHeight;

        if (clearColor) {
            this.clearColor = clearColor;
        }

        this.#size = isOrtho ? 10 : 45;
        this.#near = isOrtho ? -100 : 0.1;
        this.#far =  isOrtho ? 100 : 1000;

        if (near) {
            this.#near = near;
        }

        if (far) {
            this.#far = far;
        }

        this.#isOrtho = isOrtho;
        this.#AABB = new AABB();

        if (isOrtho) {
            this.setOrthographic();
        } else {
            this.setPerspective();
        }
    }

    get type() {
        return ComponentType.Camera;
    }

    get projection() {
        return this.#projectionMatrix;
    }

    get clearColor() {
        return this.#clearColor;
    }

    get size() {
        return this.#size;
    }

    set size(newSize) {
        this.#size = newSize;
    }

    get isOrtho() {
        return this.#isOrtho;
    }

    get AABB() {
        return this.#AABB;
    }

    setOrthographic() {
        const left = -this.#size * this.#aspectRatio * 0.5;
        const right = this.#size * this.#aspectRatio * 0.5;
        const bottom = this.#size * 0.5;
        const top = -this.#size * 0.5;

        this.#AABB.set(left, top, right, bottom);

        this.#projectionMatrix.setOrtho(left, right, bottom, top, this.#near, this.#far);
    }

    setPerspective() {
        this.#projectionMatrix.setPerspective(this.#size, this.#aspectRatio, this.#near, this.#far);
    }

    set clearColor(newClearColor) {
        const cc = this._processParameterVector4(newClearColor);
        this.#clearColor.set(cc.r, cc.g, cc.b, cc.a);
    }

    /**
     * 
     * @param {Vector2} vector 
     * @returns {Vector3}
     */
    screenToWorldSpace(vector) {
        return new Vector3(
            (vector.x - this.#canvas.clientWidth / 2) / (this.#canvas.clientHeight / this.#size),
            (vector.y - this.#canvas.clientHeight / 2) / (this.#canvas.clientHeight / this.#size),
            0,
        );
    }
    
    /**
     * 
     * @param {Vector3} vector 
     * @returns {Vector2}
     */
    worldToScreenSpace(vector) {
        return new Vector2(
            (vector.x * this.#canvas.clientHeight / this.#size) + this.#canvas.clientWidth / 2, 
            (vector.y * this.#canvas.clientHeight / this.#size) + this.#canvas.clientHeight / 2 
        );
    }
}

export class ScriptComponent extends BaseComponent {

    #outOfViewport;
    readyCalled = false;

    get type() {
        return ComponentType.Script;
    }

    get outOfViewport() {
        return this.#outOfViewport;
    }

    set outOfViewport(newValue) {
        this.#outOfViewport = newValue;
    }

    ///////////// EVENTS ////////////////////
    // this function is called once when the game starts
    ready() {}

    // this function is called every frame
    step(dt) {}

    // camera related functions
    onEnterViewport() {}

    onExitViewport() {}

    // physics events
    onCollisionEnter2D(other) {}
    onCollisionExit2D(other) {}
    ////////////////////////////////////////

    createPrefab(prefab) {
        this.gameObject.createPrefab(prefab);
    }

    // game object related functions
    createGameObject(name) {
        return this.gameObject.createGameObject(name);
    }

    /**
     * @param {GO} gameObject 
     */
    destroyGameObject(gameObject) {
        this.gameObject.destroyGameObject(gameObject);
    }
}

export class AudioComponent extends BaseComponent {

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

    #bufferReadyPromise;
    #resolveBufferReady;

    /**
     * Create a audio source
     * @param {AudioContext} audioContext 
     * @param {AudioBuffer} buffer 
     * @param {number} volume 
     * @param {boolean} playOnStart 
     * @param {boolean} loop 
     */
    constructor(gameObject, audioContext, src, volume = 0.5, playOnStart = false, loop = false) {
        super(gameObject);

        this.#volume = volume;
        this.#playOnStart = playOnStart;
        this.#loop = loop;
        this.#pauseTime = 0;
        this.#playing = false;
        this.#audioContext = audioContext;

        // Initialize the buffer-ready promise
        this.#bufferReadyPromise = new Promise(resolve => {
            this.#resolveBufferReady = resolve;
        });

        fetch(src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                this.#buffer = buffer;

                this.#gainNode = this.#audioContext.createGain();
                this.#gainNode.connect(this.#audioContext.destination);

                this.setVolume(volume);

                // Resolve the buffer-ready promise
                this.#resolveBufferReady();
            });

        if (this.#playOnStart) {
            this.play();
        }
    }

    get type() {
        return ComponentType.Audio;
    }

    get gainNode() {
        return this.#gainNode;
    }

    /**
     * starts playing the selected audio
     */
    play() {
        const canvas = document.getElementById('banana-canvas');
        canvas.addEventListener('focus', this.#resume);
        canvas.addEventListener('blur', this.#pause);
    
        this.#startTime = this.#audioContext.currentTime;
    }

    /**
     * stops the audio
     */
    stop() {
        if (this.#source) {
            const canvas = document.getElementById('banana-canvas');
            canvas.removeEventListener('focus', this.#resume);
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
        if (!this.#source) {
            return;
        }

        this.#pauseTime = this.#audioContext.currentTime - this.#startTime;
        this.#source.stop(0);
        this.#source.disconnect();
        this.#playing = false;
    }

    resume = () => {
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
     * resumes audio, (private arrow function version)
     */
    #resume = async () => {
        await this.#bufferReadyPromise; // Wait for the buffer to be ready

        if (!this.#playing) {
            this.#source = this.#audioContext.createBufferSource();
            this.#source.buffer = this.#buffer;
            this.#source.loop = this.#loop;
            this.#source.connect(this.#gainNode);
            this.#source.start(0, this.#pauseTime);
            this.#playing = true;
        }
    };

    /**
     * pause the audio, (private arrow function version)
     */
    #pause = () => {
        if (!this.#source) {
            return;
        }

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
        this.#gainNode.gain.value = this.#volume;
    }
}

export class Body2DComponent extends BaseComponent {

    /**
     * @type {AABB} transform 
     */
    #AABB;

    #shapeType;
    
    #linearVelocity;
    #angularVelocity;
    #force;
    gravityScale;

    #density;
    #mass;
    #inertia;
    restitution;
    isStatic;

    #area;
    #radius;
    #width;
    #height;

    /**
     * @type {Vector4[]} #vertices
     */
    #vertices;

    #toAdd;

    /**
     * @type {ScriptComponent}
     */
    #script;

    collided;

    constructor(gameObject, shapeType, density, mass, inertia, area, isStatic, radius, width, height, gravityScale, restitution) {
        super(gameObject);

        this.#AABB = new AABB();

        this.#shapeType = shapeType;

        this.#linearVelocity = Vector2.zero;
        this.#angularVelocity = 0;
        this.#force = Vector2.zero;
        this.gravityScale = gravityScale;
        this.restitution = restitution;

        this.#density = density
        this.#mass = mass;
        this.#inertia = inertia;
        this.#area = area;
        this.isStatic = isStatic;
        this.#radius = radius;
        this.#width = width;
        this.#height = height;

        this.#vertices = [];
        if (this.#shapeType == ShapeType.Box) {
            this.#vertices[0] = new Vector4(-width / 2, -height / 2, 0, 1);
            this.#vertices[1] = new Vector4(width / 2, -height / 2, 0, 1);
            this.#vertices[2] = new Vector4(width / 2, height / 2, 0, 1);
            this.#vertices[3] = new Vector4(-width / 2, height / 2, 0, 1);
        }

        this.#toAdd = Vector2.zero;
        this.collided = false;
    }

    static createBoxBody2D(gameObject, width, height, density, isStatic, restitution, gravityScale) {

        // undefined parameter check
        if (!width && width != 0) { width = 1; }
        if (!height && height != 0) { height = 1; }
        if (!density && density != 0) { density = 0.2; }
        if (!isStatic) { isStatic = false; }
        if (!restitution && restitution != 0) { restitution = 0.2; }
        if (!gravityScale && gravityScale != 0) { gravityScale = 1; }

        const area = width * height;
        const mass = area * density;
        const inertia = (1.0 / 12.0) * mass * (width * width + height * height);

        restitution = clamp01(restitution);

        return new Body2DComponent(gameObject, ShapeType.Box, density, mass, inertia, area, isStatic, 0, width, height, gravityScale, restitution);
    }

    static createCircleBody2D(gameObject, radius, density, isStatic, restitution, gravityScale) {

        // undefined parameter check
        if (!radius && radius != 0) { radius = 0.5; }
        if (!density && density != 0) { density = 0.2; }
        if (!isStatic) { isStatic = false; }
        if (!restitution && restitution != 0) { restitution = 0.2; }
        if (!gravityScale && gravityScale != 0) { gravityScale = 1; }

        const area = Math.PI * radius * radius;
        const mass = area * density;
        const inertia = 0.5 * mass * radius * radius;

        restitution = clamp01(restitution);

        return new Body2DComponent(gameObject, ShapeType.Circle, density, mass, inertia, area, isStatic, radius, 0, 0, gravityScale, restitution);
    }

    get type() {
        return ComponentType.Body2D;
    }

    get AABB() {
        this.setAABB();
        return this.#AABB;
    }

    get shapeType() {
        return this.#shapeType;
    }

    get linearVelocity() {
        return this.#linearVelocity;
    }

    get radius() {
        const x = this.transform.scale.x;
        const y = this.transform.scale.y;
        if (x != y) {
            console.error('elliptic shapes are not supported yet!');
            return Math.max(x, y) * this.#radius;
        }

        return x * this.#radius;
    }

    get inverseMass() {
        if (!this.isStatic) {
            return 1 / this.#mass;
        }

        return 0;
    }

    get vertices() {
        const transformedVertices = [];
        const transform = this.transform.transformMatrix;

        for (let i = 0; i < 4; i++) {
            transformedVertices.push(transform.multiplyVector4(this.#vertices[i]));
        }

        return transformedVertices;
    }

    get script() {
        if (!this.#script) {
            this.#script = this.getComponent(ComponentType.Script);
        }

        return this.#script;
    }

    update(dt, gravity) {
        if (this.isStatic) {
            return;
        }

        this.#toAdd.set(0, 0);
        this.#toAdd.add(gravity);
        this.#toAdd.mul(this.gravityScale * dt);

        this.#linearVelocity.add(this.#toAdd);
        this.#linearVelocity.add(this.#force);

        this.transform.moveBy(this.#linearVelocity.x * dt, this.#linearVelocity.y * dt, 0);
        this.transform.rotateBy(0, 0, toDegrees(this.#angularVelocity) * dt);

        this.#force.set(0, 0);
    }

    addForce(amount) {
        this.#force.add(amount);
    }

    /**
     * Find the AABB of the body depending on its current orientation
     */
    setAABB() {
        let minX = Number.MAX_SAFE_INTEGER;
        let minY = Number.MAX_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;

        if (this.#shapeType == ShapeType.Box) {
            const matrix = this.transform.transformMatrix;

            for (let i = 0; i < this.#vertices.length; i++) {
                const vector = matrix.multiplyVector4(this.#vertices[i]);

                if (vector.x < minX) { minX = vector.x; }
                if (vector.y < minY) { minY = vector.y; }
                if (vector.x > maxX) { maxX = vector.x; }
                if (vector.y > maxY) { maxY = vector.y; }
            }
        } else if (this.#shapeType == ShapeType.Circle) {
            const position = this.transform.position;

            minX = position.x - this.#radius;
            minY = position.y - this.#radius;
            maxX = position.x + this.#radius;
            maxY = position.y + this.#radius;
        }

        this.#AABB.set(minX, minY, maxX, maxY);
    }
}

export class AnimatorComponent extends BaseComponent {

    /**
     * @type {Map<string, AnimationClip>} #animations
     */
    #animations

    #currentAnimation;
    #playing;
    #startAnim;

    /**
     * @type {SpriteComponent}
     */
    #spriteRenderer;

    constructor(gameObject, startAnim) {
        super(gameObject);

        this.#animations = {};
        this.#startAnim = startAnim;
    }
     
    get type() {
        return ComponentType.Animator;
    }

    get startAnim() {
        return this.#startAnim;
    }

    /**
     * 
     * @param {AnimationClip} animation 
     */
    addAnimation(animation) {
        this.#animations[animation.name] = animation;
    }

    /**
     * Starts animator by playing animation with the given name
     * @param {string} animationName name of the animation to be played
     */
    playAnimation(animationName) {
        if (this.#animations[animationName].playing) {
            return;
        }

        if (!this.#spriteRenderer) {
            this.#spriteRenderer = this.getComponent(ComponentType.Sprite);
        }

        this.stopAnimation();

        this.#animations[animationName].play();
        this.#playing = true;
        
        this.#spriteRenderer.texture = this.#animations[animationName].texture;
        const currentFrame = this.#animations[animationName].currentFrame;
        this.#spriteRenderer.texCoords[0].set(currentFrame[0].x, currentFrame[0].y);
        this.#spriteRenderer.texCoords[1].set(currentFrame[1].x, currentFrame[1].y);
        this.#spriteRenderer.texCoords[2].set(currentFrame[2].x, currentFrame[2].y);
        this.#spriteRenderer.texCoords[3].set(currentFrame[3].x, currentFrame[3].y);

        this.#currentAnimation = animationName;
    }

    /**
     * Stops animator.
     */
    stopAnimation() {
        if (!this.#currentAnimation) {
            return;
        }

        this.#animations[this.#currentAnimation].stop();
        this.#playing = false;

        this.#spriteRenderer.default();
    }

    /**
     * Runs every frame for animating
     * @param {number} dt frame rate 
     */
    step(dt) {
        if (!this.#playing) {
            return;
        }
        
        if (this.#animations[this.#currentAnimation].step(dt)) {
            const currentFrame = this.#animations[this.#currentAnimation].currentFrame;
            this.#spriteRenderer.texCoords[0].set(currentFrame[0].x, currentFrame[0].y);
            this.#spriteRenderer.texCoords[1].set(currentFrame[1].x, currentFrame[1].y);
            this.#spriteRenderer.texCoords[2].set(currentFrame[2].x, currentFrame[2].y);
            this.#spriteRenderer.texCoords[3].set(currentFrame[3].x, currentFrame[3].y);
        }
    }
}

export class MeshComponent extends BaseComponent {

    #vertices;
    #material;
    #color;
    #textureMaps;

    VAO
    VB;
    vertexCount;

    constructor(gameObject, objSrc, mtlSrc, color) {
        super(gameObject);
        this.#color = Vector4.one;

        objSrc = objSrc ? objSrc : 'defaultModels/Cube.obj';
        mtlSrc = mtlSrc ? mtlSrc : 'defaultModels/Cube.mtl';

        if (color) {
            const c = this._processParameterVector4(color);
            this.#color.set(c.r, c.g, c.b, c.a);
        }

        this.#textureMaps = new Map();

        WavefrontParser.parseObj(objSrc)
        .then(vertices => {
            this.#vertices = vertices;
        });

        WavefrontParser.parseMtl(mtlSrc)
        .then(material => {
            this.#material = material;

            for (const value of Object.values(material)) {
                this.#textureMaps.set(value.diffuseMapSrc, new Texture(this.gameObject.gl, value.diffuseMapSrc));
            }
        });

        this.vertexCount = 0;
    }

    get type() {
        return ComponentType.Mesh;
    }

    get vertices() {
        return this.#vertices;
    }

    get material() {
        return this.#material;
    }

    get color() {
        return this.#color;
    }

    getMap(src) {
        return this.#textureMaps.get(src);
    }
}

export class TextComponent extends BaseComponent {

    #text;
    #color;
    #fontFamily;
    #fontSize;

    constructor(gameObject, text, color, fontFamily, fontSize) {
        super(gameObject);

        this.#text = text ? text : '';
        
        this.#color = color ? color : Color.white;
        this.#fontFamily = fontFamily ? fontFamily : 'dejavu, monospace';
        this.#fontSize = fontSize ? fontSize : 16;
    }

    get type() {
        return ComponentType.Text;
    }

    get text() {
        return this.#text;
    }

    set text(newText) {
        this.#text = newText;
    }

    get color() {
        return this.#color;
    }

    get fontFamily() {
        return this.#fontFamily;
    }

    get fontSize() {
        return this.#fontSize;
    }

    get position() {
        return this.mainCamera.worldToScreenSpace(this.transform.position);
    }
}

export class UITextComponent extends UIComponent {

    #text;
    #color;
    #fontFamily;
    #fontSize;

    constructor(gameObject, left, top, text, color, fontFamily, fontSize) {
        super(gameObject, left, top);

        this.#text = text ? text : '';
        
        this.#color = Color.white;
        this.#fontFamily = fontFamily ? fontFamily : 'dejavu, monospace';
        this.#fontSize = fontSize ? fontSize : 16;

        if (color) {
            const c = this._processParameterVector4(color);
            this.#color.set(c.r, c.g, c.b, c.a);
        }

    }

    get type() {
        return ComponentType.UIText;
    }

    get text() {
        return this.#text;
    }

    set text(newText) {
        this.#text = newText;
    }

    get color() {
        return this.#color;
    }

    get fontFamily() {
        return this.#fontFamily;
    }

    get fontSize() {
        return this.#fontSize;
    }
}

export class LightComponent extends BaseComponent {

    #color;
    #on;
    intensity

    /**
     * 
     * @param {GO} gameObject 
     * @param {Vector3} direction 
     * @param {Vector4} color 
     */
    constructor(gameObject, color, intensity) {
        super(gameObject);
        this.#color = Vector3.one;
        this.#on = true;
        this.intensity = intensity ? intensity : 1.0;

        if (color) {
            const c = this._processParameterVector3(color);
            this.#color.set(c.x, c.y, c.z);
        }
    }

    get type() {
        return ComponentType.Light;
    }

    get position() {
        return this.transform.position;
    }

    get color() {
        return this.#color;
    }

    set color(newColor) {
        const c = this._processParameterVector4(newColor);
        this.#color.set(c.r, c.g, c.b, c.a);
    }

    get on() {
        return this.#on;
    }

    toggle() {
        this.#on = !this.#on;
    }
}

export class ParticleComponent extends BaseComponent {

    #buffers;
    #vaos;

    #read;
    #write;
    #birthRate;
    bornParticleCount;

    #particleCount;
    #minAge;
    #maxAge;
    #minTheta;
    #maxTheta;
    #minSpeed;
    #maxSpeed;
    #gravity;
    #color;

    #playing;
    #initialParticleData

    constructor(gameObject, count, minAge, maxAge, minTheta, maxTheta, minSpeed, maxSpeed, gravity, color) {
        super(gameObject);

        this.#read = 0;
        this.#write = 1;
        this.#birthRate = 100;
        this.bornParticleCount = 0;
        
        this.#particleCount = count ? count : 200;
        this.#minAge = minAge ? minAge : 1.01;
        this.#maxAge = maxAge ? maxAge : 1.15;
        
        this.#initialParticleData = new Float32Array(this.#initializeParticleData());
        this.#buffers = [];
        this.#buffers.push(new VertexBuffer(this.gameObject.gl, this.#initialParticleData));
        this.#buffers.push(new VertexBuffer(this.gameObject.gl, this.#initialParticleData));

        this.#vaos = [];
        this.#vaos.push(new VertexArray(this.gameObject.gl));
        this.#vaos.push(new VertexArray(this.gameObject.gl));
        this.#vaos.push(new VertexArray(this.gameObject.gl));
        this.#vaos.push(new VertexArray(this.gameObject.gl));

        this.#minTheta = minTheta ? minTheta : Math.PI / 2 - 0.5;
        this.#maxTheta = maxTheta ? maxTheta : Math.PI / 2 + 0.5;
        this.#minSpeed = minSpeed ? minSpeed : 0.5;
        this.#maxSpeed = maxSpeed ? maxSpeed : 1;
        this.#gravity = Vector3.down;
        this.#color = Vector3.one.div(2);

        if (gravity) {
            const g = this._processParameterVector3(gravity);
            this.#gravity.set(g.x, g.y, g.z);
        }

        if (color) {
            const c = this._processParameterVector3(color);
            this.#color.set(c.x, c.y, c.z);
        }

        this.#playing = true;
    }

    get type() {
        return ComponentType.Particle;
    }

    get playing() { 
        return this.#playing;
    }

    play() {
        this.bornParticleCount = 0;
        this.#playing = true;
    }

    stop() {
        this.#playing = false;
    }

    get readBuffer() {
        return this.#buffers[this.#read];
    }

    get writeBuffer() {
        return this.#buffers[this.#write];
    }

    get read() {
        return this.#read;
    }

    get write() {
        return this.#write;
    }

    get vaos() {
        return this.#vaos;
    }

    get maxCount() {
        return this.#particleCount;
    }

    get birthRate() {
        return this.#birthRate;
    }

    get minTheta() {
        return this.#minTheta;
    }

    get maxTheta() {
        return this.#maxTheta;
    }

    get minSpeed() {
        return this.#minSpeed;
    }

    get maxSpeed() {
        return this.#maxSpeed;
    }

    get gravity() {
        return this.#gravity;
    }

    get color() {
        return this.#color;
    }

    swapReadWrite() {
        this.#read = 1 - this.#read;
        this.#write = 1 - this.#write;
    }

    #initializeParticleData() {
        var data = [];
        for (var i = 0; i < this.#particleCount; i++) {
            // position
            data.push(0.0);
            data.push(0.0);
            data.push(0.0);

            var life = this.#minAge + Math.random() * (this.#maxAge - this.#minAge);
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

export class DialogueComponent extends BaseComponent {

    #dialogue;
    #textRollDuration;
    #color;
    #fontFamily;
    #fontSize;

    currentTime;
    currentIndex;
    currentChar;
    currentText;
    skipToNext;
    skipKey;
    isDialogueRunning;

    constructor(gameObject, dialogue, textRollSpeed, color, fontFamily, fontSize, skipKey, playOnStart) {
        super(gameObject);

        this.#dialogue = [];
        for (const text of dialogue) {
            this.#dialogue.push(text);
        }

        this.#textRollDuration = textRollSpeed ? textRollSpeed : 0.1;
        this.#color = Color.black;
        this.#fontFamily = fontFamily ? fontFamily : 'dejavu, monospace';
        this.#fontSize = fontSize ? fontSize : 10;

        if (color) {
            const c = this._processParameterVector4(color);
            this.#color.set(c.r, c.g, c.b, c.a);
        }

        this.currentTime = 0;
        this.currentIndex = 0;
        this.currentChar = 0;
        this.currentText = '';
        this.skipToNext = false;
        this.skipKey = skipKey ? skipKey : KeyCode.Space;
    
        if (typeof playOnStart == 'undefined') {
            playOnStart = false;
        }

        this.isDialogueRunning = playOnStart ? true : false;
    }

    get type() {
        return ComponentType.Dialogue;
    }

    get currentDialogue() {
        return this.#dialogue[this.currentIndex];
    }

    get textRollDuration() {
        return this.#textRollDuration;
    }

    get color() {
        return this.#color;
    }

    get fontFamily() {
        return this.#fontFamily;
    }

    get fontSize() {
        return this.#fontSize;
    }

    get position() {
        return this.mainCamera.worldToScreenSpace(this.transform.position);
    }

    startDialogue() {
        this.isDialogueRunning = true;
    }

    stopDialogue() {
        this.isDialogueRunning = false;
        this.currentTime = 0;
        this.currentIndex = 0;
        this.currentChar = 0;
        this.currentText = '';
        this.skipToNext = false;
    }
}

export class TilemapComponent extends BaseComponent {

    #spriteSheet;
    #tileTexCoordMap;
    #tilemap;

    constructor(gameObject, src, data, cellWidth, cellHeight) {
        super(gameObject);
        this.active = false;

        this.setSpriteSheet(src, cellWidth, cellHeight);
        this.#spriteSheet.texture.onTextureCreated = () => {
            if (data.startsWith('.data')) {
                this.setData(data);
            } else {
                readFileAsText(data)
                .then(text => {
                    this.setData(text);
                    this.active = true;
                });
            }
        }
    }

    get type() {
        return ComponentType.Tilemap;
    }

    get spriteSheet() {
        return this.#spriteSheet;
    }

    get texCoordsMap() {
        return this.#tileTexCoordMap;
    }

    get tilemap() {
        return this.#tilemap;
    }

    setData(newData) {
        this.#tileTexCoordMap = new Map();
        this.#tilemap = [];

        const lines = newData.split('\n');
        let readChars = true;

        for (let line of lines) {
            const words = line.trim().split(/\s+/);

            if (words[0] == '') {
                continue;
            }
            
            if (words[0] == '.data') {
                readChars = true;
                continue;
            } else if (words[0] == '.tilemap') {
                readChars = false;
                continue;
            }

            if (readChars) {
                line = line.trim();
                let [symbol, value] = line.split(':');
                symbol = symbol.trim();
                const [x, y] = value.split(',');

                const texCoords = this.#spriteSheet.getTexCoords(parseInt(y.trim()), parseInt(x.trim()));

                this.#tileTexCoordMap.set(symbol, texCoords);
            } else {
                this.#tilemap.push(line.trim());
            }
        }
    }

    setSpriteSheet(textureSrc, cellWidth, cellHeight) {
        const tilemapTexture = new Texture(this.gameObject.gl, textureSrc);
        this.#spriteSheet = new SpriteSheet(tilemapTexture, cellWidth, cellHeight);
    }
}

export class TimerComponent extends BaseComponent {

    duration;
    oneShot;
    
    #onTimerReachZero;
    #elapsedTime;
    #firedOnce;

    constructor(gameObject, duration, oneShot, onTimerReachZero) {
        super(gameObject);

        this.duration = duration ? duration : 1;

        this.oneShot = typeof oneShot != 'undefined' ? oneShot : true;
        this.#onTimerReachZero = onTimerReachZero ? onTimerReachZero : () => {};

        this.#elapsedTime = 0;
        this.#firedOnce = false;
    }

    get type() {
        return ComponentType.Timer;
    }

    step(dt) {
        if (this.#firedOnce && this.oneShot) {
            return;
        }

        this.#elapsedTime += dt;

        if (this.#elapsedTime > this.duration) {
            this.#onTimerReachZero();
            this.#elapsedTime = 0;

            this.#firedOnce = true;
        }
    }

    setCallback(callback) {
        this.#onTimerReachZero = callback;
    }
}

export class UIButtonComponent extends UITextComponent {

    width;
    height;
    buttonColor;
    #onClick;

    constructor(gameObject, left, top, text, color, fontFamily, fontSize, width, height, onClick) {
        super(gameObject, left, top, text, color, fontFamily, fontSize);

        this.width = width ? width : 50;
        this.height = height ? height : 50;
        this.#onClick = onClick ? onClick : () => {};
    }

    get type() {
        return ComponentType.UIButton;
    }

    /**
     * @param {Function} callback
     */
    set onClick(callback) {
        this.#onClick = callback;
    }

    step() {
        
        if (this.#isMouseHovering()) {
            this.buttonColor = 'lightgrey';
        } else {
            this.buttonColor = 'grey';
        }

        if (Input.getButtonDown(MouseButtonCode.Left)) {
            if (this.#isMouseHovering()) {
                this.buttonColor = '#333';
                this.#onClick();
            } else {
                Input.resetButton(MouseButtonCode.Left);
            }
        }
    }

    #isMouseHovering() {
        const mousePos = Input.mousePosition;

        return mousePos.x > this.left &&
               mousePos.x < this.left + this.width &&
               mousePos.y > this.top &&
               mousePos.y < this.top + this.height
    }
}

export const ComponentMap = {}
ComponentMap[ComponentType.Name] = NameComponent;
ComponentMap[ComponentType.Transform] = TransformComponent;
ComponentMap[ComponentType.Sprite] = SpriteComponent;
ComponentMap[ComponentType.Camera] = CameraComponent;
ComponentMap[ComponentType.Script] = ScriptComponent;
ComponentMap[ComponentType.Audio] = AudioComponent;
ComponentMap[ComponentType.Body2D] = Body2DComponent.createBoxBody2D;
ComponentMap[ComponentType.Animator] = AnimatorComponent;
ComponentMap[ComponentType.Mesh] = MeshComponent;
ComponentMap[ComponentType.Text] = TextComponent;
ComponentMap[ComponentType.Light] = LightComponent;
ComponentMap[ComponentType.Particle] = ParticleComponent;
ComponentMap[ComponentType.Dialogue] = DialogueComponent;
ComponentMap[ComponentType.Tilemap] = TilemapComponent;
ComponentMap[ComponentType.Timer] = TimerComponent;
ComponentMap[ComponentType.UIButton] = UIButtonComponent;