import { Body2DComponent } from "../ecs/Component";
import { Vector2, Vector4 } from "../math/Vector";
import { AABB } from "./AABB";

export class CollisionInfo {
    
    /**
     * @type {Body2DComponent}
     */
    bodyA;

    /**
     * @type {Body2DComponent}
     */
    bodyB;

    colliding;
    
    /**
     * @type {Vector2}
     */
    normal;

    depth;

    /**
     * @type {Vector2}
     */
    contact1;

    /**
     * @type {Vector2}
     */
    contact2;

    contactCount;

    constructor() {
        this.colliding = false;
        this.normal = Vector2.zero;
        this.depth = 0;
    }

    resetInfo() {
        this.colliding = false;
        this.normal.set(0, 0);
        this.depth = 0;
    }
}

export class Collisions {

    /**
     * @type {CollisionInfo} collInfo
     */
    static collInfo = new CollisionInfo();

    /**
     * Finds the if two circle bodies are colliding by checking:
     *      if distance(centerA, centerB) < radiusA + radiusB.
     * Funfact: checking collision between circle bodies is easier and more efficient than polygons bodies.
     * @param {Vector2} centerA position of the first circle body
     * @param {number} radiusA radius of the first circle body
     * @param {Vector2} centerB position of the second circle body
     * @param {number} radiusB radius of the second circle body
     * @returns {CollisionInfo} information about the collision for resolving it
     */
    static checkCircleCollision(centerA, radiusA, centerB, radiusB) {
        const distance = centerA.distance(centerB);
        const radii = radiusA + radiusB;

        this.collInfo.resetInfo();

        if (distance >= radii) {
            return;
        }

        this.collInfo.colliding = true;
        this.collInfo.normal.add(centerB);
        this.collInfo.normal.sub(centerA);
        this.collInfo.normal.normalize();
        this.collInfo.depth = radii - distance;
    }

    /**
     * AABB collision check
     * @param {AABB} a axis-aligned bounding box of body a
     * @param {AABB} b axis-aligned bounding box of body b
     * @returns {boolean} if the two AABBs are colliding or not.
     */
    static checkAABBCollision(a, b) {
        if (a.max.x <= b.min.x || b.max.x <= a.min.x 
            || a.max.y <= b.min.y || b.max.y <= a.min.y) {
           return false; 
        }

        return true;
    }

    /**
     * Finds if two polygon bodies are colliding using SAT => {@link https://en.wikipedia.org/wiki/Hyperplane_separation_theorem#:~:text=Separating%20axis%20theorem%20%E2%80%94%20Two%20closed,axis%20is%20always%20a%20line.}.
     * @param {Vector4[]} verticesA vertices of the first polygon
     * @param {Vector4[]} verticesB vertices of the second polygon
     * @returns {CollisionInfo} information about the collision for resolving it
     */
    static checkPolygonCollision(verticesA, verticesB) {
        const origin = Vector2.zero;
        const terminus = Vector2.zero;

        this.collInfo.resetInfo();

        for (let i = 0; i < verticesA.length; i++) {
            origin.set(verticesA[i]);
            terminus.set(verticesA[(i + 1) % verticesA.length]);

            terminus.sub(origin);
            const axis = new Vector2(terminus.y, -terminus.x);
            axis.normalize();

            
        }
    }
}