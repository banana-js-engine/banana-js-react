"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collisions = exports.CollisionInfo = void 0;
var _Component = require("../ecs/Component");
var _Vector = require("../math/Vector");
var _AABB = require("./AABB");
class CollisionInfo {
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
    this.normal = _Vector.Vector2.zero;
    this.depth = 0;
    this.contact1 = _Vector.Vector2.zero;
    this.contact2 = _Vector.Vector2.zero;
  }
  resetInfo() {
    this.colliding = false;
    this.normal.set(0, 0);
    this.depth = 0;
    this.contact1.set(0, 0);
    this.contact2.set(0, 0);
  }
}
exports.CollisionInfo = CollisionInfo;
class Collisions {
  /**
   * @type {CollisionInfo} collInfo
   */
  static collInfo = (() => new CollisionInfo())();

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
    this.#findCircleContactPoints(centerA, radiusA);
  }

  /**
   * 
   * @param {Vector2} centerA 
   * @param {number} radius 
   * @param {Vector2} normal 
   */
  static #findCircleContactPoints(centerA, radius) {
    this.collInfo.contact1.set(this.collInfo.normal);
    this.collInfo.contact1.mul(radius);
    this.collInfo.contact1.add(centerA);
    this.collInfo.contactCount = 1;
  }

  /**
   * AABB collision check
   * @param {AABB} a axis-aligned bounding box of body a
   * @param {AABB} b axis-aligned bounding box of body b
   * @returns {boolean} if the two AABBs are colliding or not.
   */
  static checkAABBCollision(a, b) {
    if (a.max.x <= b.min.x || b.max.x <= a.min.x || a.max.y <= b.min.y || b.max.y <= a.min.y) {
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
    const origin = _Vector.Vector2.zero;
    const terminus = _Vector.Vector2.zero;
    this.collInfo.resetInfo();
    this.collInfo.depth = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < verticesA.length; i++) {
      origin.set(verticesA[i]);
      terminus.set(verticesA[(i + 1) % verticesA.length]);
      terminus.sub(origin);
      const axis = new _Vector.Vector2(terminus.y, -terminus.x);
      axis.normalize();
      const projA = this.#projectVertices(verticesA, axis);
      const projB = this.#projectVertices(verticesB, axis);
      if (projA.min >= projB.max || projB.min >= projA.max) {
        return;
      }
      const axisDepth = Math.min(projB.max - projA.min, projA.max - projB.min);
      if (axisDepth < this.collInfo.depth) {
        this.collInfo.depth = axisDepth;
        this.collInfo.normal.set(axis);
      }
    }
    for (let i = 0; i < verticesB.length; i++) {
      origin.set(verticesB[i]);
      terminus.set(verticesB[(i + 1) % verticesB.length]);
      terminus.sub(origin);
      const axis = new _Vector.Vector2(terminus.y, -terminus.x);
      axis.normalize();
      const projA = this.#projectVertices(verticesA, axis);
      const projB = this.#projectVertices(verticesB, axis);
      if (projA.min >= projB.max || projB.min >= projA.max) {
        return;
      }
      const axisDepth = Math.min(projB.max - projA.min, projA.max - projB.min);
      if (axisDepth < this.collInfo.depth) {
        this.collInfo.depth = axisDepth;
        this.collInfo.normal.set(axis);
      }
    }
    this.collInfo.colliding = true;
    const centerA = this.#findCenter(verticesA);
    const centerB = this.#findCenter(verticesB);
    centerB.sub(centerA);
    if (centerB.dot(this.collInfo.normal) < 0) {
      this.collInfo.normal.mul(-1);
    }
    this.#findPolygonContactPoints(verticesA, verticesB);
  }

  /**
   * 
   * @param {Vector4[]} verticesA 
   * @param {Vector4[]} verticesB 
   */
  static #findPolygonContactPoints(verticesA, verticesB) {
    const origin = _Vector.Vector2.zero;
    const terminus = _Vector.Vector2.zero;
    let minDistanceSquared = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < verticesA.length; i++) {
      for (let j = 0; j < verticesB.length; j++) {
        origin.set(verticesB[j]);
        terminus.set(verticesB[(j + 1) % verticesB.length]);
        const point = this.#pointLineSegmentDistance(verticesA[i], origin, terminus);
        if (point.distanceSquared == minDistanceSquared && this.collInfo.contact1.equals(point.contact)) {
          this.collInfo.contact2.set(point.contact);
          this.collInfo.contactCount = 2;
        } else if (point.distanceSquared < minDistanceSquared) {
          minDistanceSquared = point.distanceSquared;
          this.collInfo.contact1.set(point.contact);
          this.collInfo.contactCount = 1;
        }
      }
    }
    for (let i = 0; i < verticesB.length; i++) {
      for (let j = 0; j < verticesA.length; j++) {
        origin.set(verticesA[j]);
        terminus.set(verticesA[(j + 1) % verticesA.length]);
        const point = this.#pointLineSegmentDistance(verticesB[i], origin, terminus);
        if (point.distanceSquared == minDistanceSquared && !this.collInfo.contact1.equals(point.contact)) {
          this.collInfo.contact2.set(point.contact);
          this.collInfo.contactCount = 2;
        } else if (point.distanceSquared < minDistanceSquared) {
          minDistanceSquared = point.distanceSquared;
          this.collInfo.contact1.set(point.contact);
          this.collInfo.contactCount = 1;
        }
      }
    }
  }

  /**
   * 
   * @param {Vector2} center 
   * @param {number} radius 
   * @param {Vector4[]} vertices 
   */
  static checkCirclePolygonCollision(center, radius, vertices) {
    const origin = _Vector.Vector2.zero;
    const terminus = _Vector.Vector2.zero;
    this.collInfo.resetInfo();
    this.collInfo.depth = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < vertices.length; i++) {
      origin.set(vertices[i]);
      terminus.set(vertices[(i + 1) % vertices.length]);
      terminus.sub(origin);
      const axis = new _Vector.Vector2(terminus.y, -terminus.x);
      axis.normalize();
      const projA = this.#projectVertices(vertices, axis);
      const projB = this.#projectCircle(center, radius, axis);
      if (projA.min >= projB.max || projB.min >= projA.max) {
        return;
      }
      const axisDepth = Math.min(projB.max - projA.min, projA.max - projB.min);
      if (axisDepth < this.collInfo.depth) {
        this.collInfo.depth = axisDepth;
        this.collInfo.normal.set(axis);
      }
    }
    const closestPoint = this.#findClosedPointOnPolygon(center, vertices);
    closestPoint.sub(center).normalize();
    const projA = this.#projectVertices(vertices, closestPoint);
    const projB = this.#projectCircle(center, radius, closestPoint);
    if (projA.min >= projB.max || projB.min >= projA.max) {
      return;
    }
    const axisDepth = Math.min(projB.max - projA.min, projA.max - projB.min);
    if (axisDepth < this.collInfo.depth) {
      this.collInfo.depth = axisDepth;
      this.collInfo.normal.set(closestPoint);
    }
    this.collInfo.colliding = true;
    const polygonCenter = this.#findCenter(vertices);
    polygonCenter.sub(center);
    if (polygonCenter.dot(this.collInfo.normal) < 0) {
      this.collInfo.normal.mul(-1);
    }
    this.#findCirclePolygonContactPoints(center, vertices);
  }

  /**
   * 
   * @param {Vector2} center 
   * @param {Vector4[]} vertices 
   */
  static #findCirclePolygonContactPoints(center, vertices) {
    const origin = _Vector.Vector2.zero;
    const terminus = _Vector.Vector2.zero;
    let minDistanceSquared = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < vertices.length; i++) {
      origin.set(vertices[i]);
      terminus.set(vertices[(i + 1) % vertices.length]);
      const point = this.#pointLineSegmentDistance(center, origin, terminus);
      if (point.distanceSquared < minDistanceSquared) {
        minDistanceSquared = point.distanceSquared;
        this.collInfo.contact1.set(point.contact);
      }
    }
    this.collInfo.contactCount = 1;
  }

  /**
   * 
   * @param {Vector4[]} vertices 
   * @param {Vector2} axis 
   */
  static #projectVertices(vertices, axis) {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    const currentVertex = _Vector.Vector2.zero;
    for (let i = 0; i < vertices.length; i++) {
      currentVertex.set(vertices[i]);
      const proj = currentVertex.dot(axis);
      if (proj < min) {
        min = proj;
      }
      if (proj > max) {
        max = proj;
      }
    }
    return {
      min,
      max
    };
  }

  /**
   * 
   * @param {Vector2} center 
   * @param {number} radius 
   * @param {Vector2} axis 
   */
  static #projectCircle(center, radius, axis) {
    const direction = _Vector.Vector2.zero;
    direction.set(axis);
    direction.normalize().mul(radius);
    direction.add(center);
    let min = direction.dot(axis);
    direction.sub(center).mul(-1).add(center);
    let max = direction.dot(axis);
    if (min > max) {
      [min, max] = [max, min];
    }
    return {
      min,
      max
    };
  }

  /**
   * 
   * @param {Vector4[]} vertices 
   */
  static #findCenter(vertices) {
    const center = _Vector.Vector2.zero;
    for (let i = 0; i < vertices.length; i++) {
      center.add(vertices[i]);
    }
    center.div(vertices.length);
    return center;
  }

  /**
   * 
   * @param {Vector2} center 
   * @param {Vector4[]} vertices 
   * @returns {Vector2}
   */
  static #findClosedPointOnPolygon(center, vertices) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    const closestPoint = _Vector.Vector2.zero;
    for (let i = 0; i < vertices.length; i++) {
      const distance = center.distance(vertices[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint.set(vertices[i]);
      }
    }
    return closestPoint;
  }

  /**
   * Finds the distance between a point and a line segment
   * @param {Vector2} p is the point
   * @param {Vector2} a beginning point of the line segment
   * @param {Vector2} b ending point of the line segment
   */
  static #pointLineSegmentDistance(p, a, b) {
    const ab = _Vector.Vector2.zero;
    ab.set(b);
    ab.sub(a);
    const ap = _Vector.Vector2.zero;
    ap.set(p);
    ap.sub(a);
    const d = ap.dot(ab) / ab.lengthSquared;
    if (d <= 0) {
      ap.set(a);
    } else if (d >= 1) {
      ap.set(b);
    } else {
      ap.set(ab);
      ap.mul(d);
      ap.add(a);
    }
    const distanceSquared = p.distanceSquared(ap);
    return {
      distanceSquared,
      contact: ap
    };
  }
}
exports.Collisions = Collisions;