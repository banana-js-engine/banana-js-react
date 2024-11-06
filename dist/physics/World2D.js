"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.World2D = void 0;
var _Types = require("../core/Types");
var _Component = require("../ecs/Component");
var _Vector = require("../math/Vector");
var _Collisions = require("./Collisions");
class World2D {
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
    this.#gravity = new _Vector.Vector2(0, 9.81);
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
        if (bodyA.isStatic && bodyB.isStatic) {
          continue;
        }
        if (!_Collisions.Collisions.checkAABBCollision(bodyA.AABB, bodyB.AABB)) {
          continue;
        }
        if (bodyA.shapeType == _Types.ShapeType.Circle && bodyB.shapeType == _Types.ShapeType.Circle) {
          _Collisions.Collisions.checkCircleCollision(bodyA.transform.position, bodyA.radius, bodyB.transform.position, bodyB.radius);
        } else if (bodyA.shapeType == _Types.ShapeType.Box && bodyB.shapeType == _Types.ShapeType.Box) {
          _Collisions.Collisions.checkPolygonCollision(bodyA.vertices, bodyB.vertices);
        } else if (bodyA.shapeType == _Types.ShapeType.Circle && bodyB.shapeType == _Types.ShapeType.Box) {
          _Collisions.Collisions.checkCirclePolygonCollision(bodyA.transform.position, bodyA.radius, bodyB.vertices);
        } else if (bodyA.shapeType == _Types.ShapeType.Box && bodyB.shapeType == _Types.ShapeType.Circle) {
          _Collisions.Collisions.checkCirclePolygonCollision(bodyB.transform.position, bodyB.radius, bodyA.vertices);
          _Collisions.Collisions.collInfo.normal.mul(-1);
        }
        if (!_Collisions.Collisions.collInfo.colliding) {
          continue;
        }
        const moveAmount = _Vector.Vector2.zero;
        moveAmount.add(_Collisions.Collisions.collInfo.normal);
        if (bodyA.isStatic) {
          moveAmount.mul(_Collisions.Collisions.collInfo.depth);
          bodyB.transform.moveBy(moveAmount);
        } else if (bodyB.isStatic) {
          moveAmount.mul(-_Collisions.Collisions.collInfo.depth);
          bodyA.transform.moveBy(moveAmount);
        } else {
          moveAmount.mul(_Collisions.Collisions.collInfo.depth / 2);
          bodyB.transform.moveBy(moveAmount);
          moveAmount.mul(-1);
          bodyA.transform.moveBy(moveAmount);
        }
        _Collisions.Collisions.collInfo.bodyA = bodyA;
        _Collisions.Collisions.collInfo.bodyB = bodyB;
        if (_Collisions.Collisions.collInfo.contactCount > 1) {
          this.contactPoints.push(_Collisions.Collisions.collInfo.contact1);
          this.contactPoints.push(_Collisions.Collisions.collInfo.contact2);
        } else if (_Collisions.Collisions.collInfo.contactCount > 0) {
          this.contactPoints.push(_Collisions.Collisions.collInfo.contact1);
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
    const bodyA = _Collisions.Collisions.collInfo.bodyA;
    const bodyB = _Collisions.Collisions.collInfo.bodyB;
    const relativeVelocity = _Vector.Vector2.zero;
    relativeVelocity.set(bodyB.linearVelocity);
    relativeVelocity.sub(bodyA.linearVelocity);
    const rDotN = relativeVelocity.dot(_Collisions.Collisions.collInfo.normal);
    if (rDotN > 0) {
      return;
    }
    const e = Math.min(bodyA.restitution, bodyB.restitution);
    let j = (-1 - e) * rDotN;
    j /= bodyA.inverseMass + bodyB.inverseMass;
    _Collisions.Collisions.collInfo.normal.mul(j);
    relativeVelocity.set(_Collisions.Collisions.collInfo.normal);
    _Collisions.Collisions.collInfo.normal.mul(bodyA.inverseMass);
    bodyA.linearVelocity.sub(_Collisions.Collisions.collInfo.normal);
    relativeVelocity.mul(bodyB.inverseMass);
    bodyB.linearVelocity.add(relativeVelocity);
  }
}
exports.World2D = World2D;