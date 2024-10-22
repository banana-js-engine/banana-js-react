"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BananaMath = void 0;
class BananaMath {
  /**
   * Converts degrees to radians
   * @param {number} deg 
   * @returns the degree converted to radians
   */
  static toRadians(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Converts radians to degrees
   * @param {number} rad 
   * @returns the radian converted to degrees
   */
  static toDegrees(rad) {
    return rad * (180 / Math.PI);
  }

  /**
   * Clamps a value between min and max
   * @param {number} value 
   * @param {number} min 
   * @param {number} max 
   * @returns clamped value
   */
  static clamp(value, min, max) {
    if (min === max) {
      return min;
    }
    if (min > max) {
      console.error(`min (${min}) is greater than max (${max})`);
    }
    if (value > max) {
      return max;
    } else if (value < min) {
      return min;
    }
    return value;
  }

  /**
   * Clamps a value between 0 and 1
   * @param {number} value 
   * @returns clamped value
   */
  static clamp01(value) {
    return this.clamp(value, 0, 1);
  }
}
exports.BananaMath = BananaMath;