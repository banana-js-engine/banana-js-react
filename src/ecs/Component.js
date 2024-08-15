import { Matrix4 } from "../math/Matrix";
import { Vector3, Vector4 } from "../math/Vector";

export const ComponentType = {
    None: -1,
    Transform: 0,
    Sprite: 1
} 

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
        this.#positionMat = new Matrix4();
        this.#rotationXMat = new Matrix4();
        this.#rotationYMat = new Matrix4();
        this.#rotationZMat = new Matrix4();
        this.#scaleMat = new Matrix4();

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

export class SpriteComponent extends Component {
    #color;

    constructor(color) {
        super();
        this.#color = Vector4.one;

        if (color) {
            const c = this.#processParameterType(color);
            this.setColor(c.r, c.g, c.b, c.a);
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

        console.error('Invalid type for transform')
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
}