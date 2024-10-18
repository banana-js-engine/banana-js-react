import { Matrix4 } from "../math/Matrix";
import { Vector2, Vector3, Vector4 } from "../math/Vector";
import { AABB } from "../physics/AABB";
import { Texture } from "../renderer/Texture";
import { ComponentType, ShapeType } from "../core/Types";
import { BananaMath } from "../math/BananaMath";
import { ECS } from "./ECS";
import { AnimationClip } from "../renderer/AnimationClip";


class Component {

    ecs;
    gameObject;

    /**
     * 
     * @param {string} id 
     * @param {ECS} ecs 
     */
    constructor(id, ecs) {
        this.ecs = ecs;
        this.gameObject = id;
    }

    get type() {
        return ComponentType.None;
    }

    // component related functions
    getComponent(type) {
        return this.ecs.get(this.gameObject, type);
    }

    getComponents(type) {
        return this.ecs.getAll(type);
    }
}

export class NameComponent extends Component {
    #name;

    constructor(id, ecs, name) {
        super(id, ecs);

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

    constructor(id, ecs, position, rotation, scale) {
        super(id, ecs);
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

    get position() {
        return this.#position;
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
    #originalTexture;

    /**
     * @type {Vector2[]} #texCoords
     */
    #texCoords;

    /**
     * @type {TransformComponent} transform 
     */
    #transform;

    constructor(id, ecs, gl, color, textureSrc, flipX, flipY) {
        super(id, ecs);
        this.#color = Vector4.one;

        if (color) {
            const c = this.#processParameterType(color);
            this.setColor(c.r, c.g, c.b, c.a);
        }

        if (textureSrc) {
            this.#texture = new Texture(gl, textureSrc);
            this.#originalTexture = new Texture(gl, textureSrc);
        }

        this.#texCoords = [
            Vector2.zero,
            Vector2.right,
            Vector2.up,
            Vector2.one,
        ];

        this.#transform = this.getComponent(ComponentType.Transform);

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
        return this.#transform.scale.x < 0;
    }

    get flipY() {
        return this.#transform.scale.y < 0;
    }

    set flipX(newValue) {
        if ((!newValue && this.flipX) || (newValue && !this.flipX)) {
            this.#transform.scaleTo(-this.#transform.scale.x, this.#transform.scale.y, this.#transform.scale.z)
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

    constructor(id, ecs, isOrtho, clearColor, size, near, far) {
        super(id, ecs);

        this.#projectionMatrix = Matrix4.zero;

        this.#clearColor = new Vector4(0.345, 0.588, 0.809, 1);
        if (clearColor) {
            const cc = this.#processParameterType(clearColor);
            this.setClearColor(cc.r, cc.g, cc.b, cc.a);
        }

        this.#canvas = document.getElementById('banana-canvas');
        this.#aspectRatio = this.#canvas.clientWidth / this.#canvas.clientHeight;

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

    /**
     * 
     * @param {Vector2} vector 
     * @returns {Vector3}
     */
    screenToWorldSpace(vector) {
        return new Vector3(
            (vector.x - this.#canvas.clientWidth / 2) / (this.#canvas.clientHeight / this.#size),
            (vector.y - this.#canvas.clientHeight / 2) / (this.#canvas.clientHeight / this.#size),
            0
        );
    }
}

export class ScriptComponent extends Component {

    isReadyCalled;

    /**
     * 
     * @param {string} id 
     * @param {ECS} ecs 
     */
    constructor(id, ecs) {
        super(id, ecs);

        this.isReadyCalled = false;
    }

    get type() {
        return ComponentType.Script;
    }

    /**
     * @returns {CameraComponent}
     */
    get mainCamera() {
        const cameras = this.getComponents(ComponentType.Camera);

        if (cameras.length == 0) {
            return null;
        }

        return cameras[0];
    }

    // this function is called once when the game starts
    ready() {}

    // this function is called every frame
    step(dt) {}

    // game object related functions
    create(name = 'GameObject') {
        const newGO = this.ecs.create();
        this.ecs.emplace(newGO, new NameComponent(this.gameObject, this.ecs, name))
        this.ecs.emplace(newGO, new TransformComponent(this.gameObject, this.ecs));
        return newGO;
    }

    /**
     * 
     * @param {Component | string} gameObject 
     */
    destroy(component) {
        if (component instanceof Component) {
            this.ecs.release(component.gameObject)
            return;
        }
        else if (typeof component == 'string') {
            this.ecs.release(component)
        }
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
    constructor(id, ecs, audioContext, buffer, volume = 0.5, playOnStart = false, loop = false) {
        super(id, ecs);

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

export class Body2DComponent extends Component {

    /**
     * @type {TransformComponent}
     */
    #transform

    /**
     * @type {AABB} transform 
     */
    #AABB;

    #shapeType;
    
    #linearVelocity;
    #angularVelocity;
    #force;
    #gravityScale;

    #density;
    #mass;
    #inertia;
    #restitution;
    #isStatic;

    #area;
    #radius;
    #width;
    #height;

    /**
     * @type {Vector4[]} #vertices
     */
    #vertices;

    #toAdd

    constructor(id, ecs, shapeType, density, mass, inertia, area, isStatic, radius, width, height, gravityScale) {
        super(id, ecs);

        this.#transform = this.getComponent(ComponentType.Transform);

        this.#AABB = new AABB();

        this.#shapeType = shapeType;

        this.#linearVelocity = Vector2.zero;
        this.#angularVelocity = 0;
        this.#force = Vector2.zero;
        this.#gravityScale = gravityScale;

        this.#density = density
        this.#mass = mass;
        this.#inertia = inertia;
        this.#area = area;
        this.#isStatic = isStatic;
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
    }

    static createBoxBody2D(id, ecs, width, height, density, isStatic, restitution, gravityScale) {
        const area = width * height;
        const mass = area * density;
        const inertia = (1.0 / 12.0) * mass * (width * width + height * height);

        restitution = BananaMath.clamp01(restitution);

        return new Body2DComponent(id, ecs, ShapeType.Box, density, mass, inertia, area, isStatic, 0, width, height, gravityScale);
    }

    static createCircleBody2D(id, ecs, radius, density, isStatic, restitution, gravityScale) {
        const area = Math.PI * radius * radius;
        const mass = area * density;
        const inertia = 0.5 * mass * radius * radius;

        restitution = BananaMath.clamp01(restitution);

        return new Body2DComponent(id, ecs, ShapeType.Circle, density, mass, inertia, area, isStatic, radius, 0, 0, gravityScale);
    }

    get type() {
        return ComponentType.Body2D;
    }

    get transform() {
        return this.#transform;
    }

    get AABB() {
        this.setAABB();
        return this.#AABB;
    }

    get shapeType() {
        return this.#shapeType;
    }

    get isStatic() {
        return this.#isStatic;
    }

    get radius() {
        return this.#radius;
    }

    get inverseMass() {
        if (!this.#isStatic) {
            return 1 / this.#mass;
        }
        else {
            return 0;
        }
    }

    update(dt, gravity) {
        if (this.#isStatic) {
            return;
        }

        this.#toAdd.set(0, 0);
        this.#toAdd.add(gravity);
        this.#toAdd.mul(this.#gravityScale * dt);

        this.#linearVelocity.add(this.#toAdd);
        this.#linearVelocity.add(this.#force);

        this.#transform.moveBy(this.#linearVelocity.x, this.#linearVelocity.y, 0);
        this.#transform.rotateBy(0, 0, BananaMath.toDegrees(this.#angularVelocity) * dt);

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
            const matrix = this.#transform.transformMatrix;

            for (let i = 0; i < this.#vertices.length; i++) {
                const vector = matrix.multiplyVector4(this.#vertices[i]);

                if (vector.x < minX) { minX = vector.x; }
                if (vector.y < minY) { minY = vector.y; }
                if (vector.x > maxX) { maxX = vector.x; }
                if (vector.y > maxY) { maxY = vector.y; }
            }
        }
        else if (this.#shapeType == ShapeType.Circle) {
            const position = this.#transform.position;

            minX = position.x - this.#radius;
            minX = position.y - this.#radius;
            maxX = position.x + this.#radius;
            maxY = position.y + this.#radius;
        }

        this.#AABB.set(minX, minY, maxX, maxY);
    }
}

export class AnimatorComponent extends Component {

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

    constructor(id, ecs, startAnim) {
        super(id, ecs);

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
        this.#spriteRenderer.texCoords = this.#animations[animationName].currentFrame;

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
            this.#spriteRenderer.texCoords = this.#animations[this.#currentAnimation].currentFrame;
        }
    }
}