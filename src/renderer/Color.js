import { Vector4 } from "../math/Vector";

export class Color {

    static get black() {
        return new Vector4(0.0, 0.0, 0.0, 1.0);
    }

    static get red() {
        return new Vector4(1.0, 0.0, 0.0, 1.0);
    }

    static get green() {
        return new Vector4(0.0, 1.0, 0.0, 1.0);
    }

    static get blue() {
        return new Vector4(0.0, 0.0, 1.0, 1.0);
    }

    static get purple() {
        return new Vector4(0.5, 0.0, 0.5, 1.0);
    }

    static get yellow() {
        return new Vector4(1.0, 1.0, 0.0, 1.0);
    }

    static get orange() {
        return new Vector4(1.0, 0.47, 0.0, 1.0);
    }

    static get cyan() {
        return new Vector4(0.0, 1.0, 1.0, 1.0);
    }

    static get white() {
        return new Vector4(1.0, 1.0, 1.0, 1.0);
    }

    static get transparent() {
        return new Vector4(0.0, 0.0, 0.0, 0.0);
    }

}