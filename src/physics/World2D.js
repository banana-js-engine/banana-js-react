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


    /**
     * @type {Vector2[]} 
     */
    contactPoints; // debug purposes

    constructor() {
        this.#gravity = new Vector2(0, 9.81);
        this.#bodies = [];
        this.contactPoints = [];
    }

    step(dt) {
        this.contactPoints = [];

        for (let i = 0; i < this.#bodies.length; i++) {
            this.#bodies[i].update(dt, this.#gravity);
        }

        for (let i = 0; i < this.#bodies.length - 1; i++) {
            const bodyA = this.#bodies[i];
            
            for (let j = i + 1; j < this.#bodies.length; j++) {
                const bodyB = this.#bodies[j];

                if (bodyA.transform.position.z != bodyB.transform.position.z) {
                    continue;
                }

                if (!Collisions.checkAABBCollision(bodyA.AABB, bodyB.AABB)) {
                    if (bodyA.script && bodyA.collided) {
                        bodyA.collided = false;
                        bodyA.script.onCollisionExit2D(bodyB);
                    }
                    
                    if (bodyB.script && bodyB.collided) {
                        bodyB.collided = false;
                        bodyB.script.onCollisionExit2D(bodyA);
                    }
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
                } else if (bodyA.shapeType == ShapeType.Circle && bodyB.shapeType == ShapeType.Box) {
                    Collisions.checkCirclePolygonCollision(
                        bodyA.transform.position,
                        bodyA.radius,
                        bodyB.vertices
                    );
                } else if (bodyA.shapeType == ShapeType.Box && bodyB.shapeType == ShapeType.Circle) {
                    Collisions.checkCirclePolygonCollision(
                        bodyB.transform.position,
                        bodyB.radius,
                        bodyA.vertices
                    );

                    Collisions.collInfo.normal.mul(-1);
                }

                if (!Collisions.collInfo.colliding) {
                    if (bodyA.script && bodyA.collided) {
                        bodyA.collided = false;
                        bodyA.script.onCollisionExit2D(bodyB);
                    }
                    
                    if (bodyB.script && bodyB.collided) {
                        bodyB.collided = false;
                        bodyB.script.onCollisionExit2D(bodyA);
                    }
                    continue;
                }

                
                if (bodyA.script && !bodyA.collided) {
                    bodyA.collided = true;
                    bodyA.script.onCollisionEnter2D(bodyB);
                }
                
                if (bodyB.script && !bodyB.collided) {
                    bodyB.collided = true;
                    bodyB.script.onCollisionEnter2D(bodyA);
                }

                const moveAmount = Vector2.zero;
                moveAmount.add(Collisions.collInfo.normal);
                if (bodyA.isStatic && bodyB.isStatic) {
                    if (bodyA.transform.lastMovedTimestamp > bodyB.transform.lastMovedTimestamp) {
                        moveAmount.mul(-Collisions.collInfo.depth);
                        bodyA.transform.moveBy(moveAmount);
                    } else if (bodyA.transform.lastMovedTimestamp < bodyB.transform.lastMovedTimestamp) {
                        moveAmount.mul(Collisions.collInfo.depth / 2);
                        bodyB.transform.moveBy(moveAmount);
                    } else {
                        moveAmount.mul(Collisions.collInfo.depth / 2);
                        bodyB.transform.moveBy(moveAmount);

                        moveAmount.mul(-1);
                        bodyA.transform.moveBy(moveAmount);
                    }
                    
                    continue;
                } else if (bodyA.isStatic) {
                    moveAmount.mul(Collisions.collInfo.depth);
                    bodyB.transform.moveBy(moveAmount);
                } else if (bodyB.isStatic) {
                    moveAmount.mul(-Collisions.collInfo.depth);
                    bodyA.transform.moveBy(moveAmount);
                } else {
                    moveAmount.mul(Collisions.collInfo.depth / 2);
                    bodyB.transform.moveBy(moveAmount);

                    moveAmount.mul(-1);
                    bodyA.transform.moveBy(moveAmount);
                }

                Collisions.collInfo.bodyA = bodyA;
                Collisions.collInfo.bodyB = bodyB;

                if (Collisions.collInfo.contactCount > 1) {
                    this.contactPoints.push(Collisions.collInfo.contact1);
                    this.contactPoints.push(Collisions.collInfo.contact2);
                } else if (Collisions.collInfo.contactCount > 0) {
                    this.contactPoints.push(Collisions.collInfo.contact1);
                }

                this.#resolveCollision();
            }
        }
    }

    addBody(body) {
        this.#bodies.push(body);
    }

    tryAddBody(body) {
        let exists = false;

        for (let i = 0; i < this.#bodies.length; i++) {
            if (this.#bodies[i].gameObject == body.gameObject) {
                exists = true;
                break;    
            }
        }

        if (!exists) {
            this.#bodies.push(body);
        }
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

    #resolveCollision() {
        const bodyA = Collisions.collInfo.bodyA;
        const bodyB = Collisions.collInfo.bodyB;

        const relativeVelocity = Vector2.zero;
        relativeVelocity.set(bodyB.linearVelocity);
        relativeVelocity.sub(bodyA.linearVelocity);

        const rDotN = relativeVelocity.dot(Collisions.collInfo.normal);

        if (rDotN > 0) {
            return;
        }

        const e = Math.min(bodyA.restitution, bodyB.restitution);

        let j = (- 1 - e) * rDotN;
        j /= bodyA.inverseMass + bodyB.inverseMass;

        Collisions.collInfo.normal.mul(j);
        relativeVelocity.set(Collisions.collInfo.normal);

        Collisions.collInfo.normal.mul(bodyA.inverseMass);
        bodyA.linearVelocity.sub(Collisions.collInfo.normal);

        relativeVelocity.mul(bodyB.inverseMass);
        bodyB.linearVelocity.add(relativeVelocity);
    }
}