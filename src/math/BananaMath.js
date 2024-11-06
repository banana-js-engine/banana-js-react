/**
 * Converts degrees to radians
 * @param {number} deg 
 * @returns the degree converted to radians
 */
export function toRadians(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Converts radians to degrees
 * @param {number} rad 
 * @returns the radian converted to degrees
 */
export function toDegrees(rad) {
    return rad * (180 / Math.PI);
}

/**
 * Clamps a value between min and max
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns clamped value
 */
export function clamp(value, min, max) {
    if (min === max) {
        return min;
    }

    if (min > max) {
        console.error(`min (${min}) is greater than max (${max})`);
    }

    if (value > max) {
        return max;
    }
    else if (value < min) {
        return min;
    }

    return value;
}

/**
 * Clamps a value between 0 and 1
 * @param {number} value 
 * @returns clamped value
 */
export function clamp01(value) {
    return clamp(value, 0, 1);
}