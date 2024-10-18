import { ShapeType } from "../core/Types";
import { Body2DComponent } from "../ecs/Component";
import { Vector2 } from "../math/Vector";
import { CollisionInfo, Collisions } from "./Collisions";

export class World2D {
    
    /**
     * @type {Vector2}
     */
    #gravity;

    /**
     * @type {Body2DComponent[]} #bodies
     */
    #bodies;



    constructor() {
        this.#gravity = new Vector2(0, 9.81);
        this.#bodies = [];
    }

    step(dt) {
        for (let i = 0; i < this.#bodies.length; i++) {
            this.#bodies[i].update(dt, this.#gravity);
        }

        for (let i = 0; i < this.#bodies.length - 1; i++) {
            const bodyA = this.#bodies[i];
            
            for (let j = i + 1; j < this.#bodies.length; j++) {
                const bodyB = this.#bodies[j];

                if (bodyA.isStatic && bodyB.isStatic) {
                    continue;
                }

                if (!Collisions.checkAABBCollision(bodyA.AABB, bodyB.AABB)) {
                    continue;
                }

                if (bodyA.shapeType == ShapeType.Circle && bodyB.shapeType == ShapeType.Circle) {
                    Collisions.checkCircleCollision(
                        bodyA.transform.position,
                        bodyA.radius,
                        bodyB.transform.position,
                        bodyB.radius
                    );
                } else if (bodyA.shapeType == ShapeType.Box && bodyB.shapeType == ShapeType.Box) {
                    Collisions.checkPolygonCollision(bodyA.vertices, bodyB.vertices);
                }

                if (!Collisions.collInfo.colliding) {
                    continue;
                }

                const moveAmount = Vector2.zero;
                moveAmount.add(Collisions.collInfo.normal);
                if (bodyA.isStatic) {
                    moveAmount.mul(Collisions.collInfo.depth);
                    bodyB.transform.moveBy(moveAmount);
                }
                else if (bodyB.isStatic) {
                    moveAmount.mul(-Collisions.collInfo.depth);
                    bodyA.transform.moveBy(moveAmount);
                }
                else {
                    moveAmount.mul(Collisions.collInfo.depth / 2);
                    bodyB.transform.moveBy(moveAmount);

                    moveAmount.mul(-1);
                    bodyA.transform.moveBy(moveAmount);
                }
            }
        }
    }

    addBody(body) {
        this.#bodies.push(body);
    }

    removeBody(body) {
        const index = this.#bodies.indexOf(body);
        this.#bodies.splice(index, 1);
    }

    clear() {
        while (this.#bodies.length > 0) {
            this.#bodies.splice(0, 1);
        }
    }
}