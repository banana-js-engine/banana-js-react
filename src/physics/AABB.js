import { Vector2 } from "../math/Vector";

export class AABB {

    min = Vector2.zero;
    max = Vector2.zero;

    set(minX, minY, maxX, maxY) {
        this.min.set(minX, minY);
        this.max.set(maxX, maxY);
    }
}