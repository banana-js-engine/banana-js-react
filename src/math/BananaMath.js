export class BananaMath {

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

    static clamp(value, min, max) {
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

    static clamp01(value) {
        return this.clamp(value, 0, 1);
    }
}