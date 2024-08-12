export class Matrix4 {

    #data;

    constructor() {
        this.#data = new Float32Array(16);
    }

    zero() {
        this.#data.fill(0);
        return this;
    }

    identity() {
        this.zero();
        this.#data[0] = 1;
        this.#data[5] = 1;
        this.#data[10] = 1;
        this.#data[15] = 1;
        return this;
    }

    multiply(other) {
        const nm00 = this.#data[ 0] * other.#data[ 0] + this.#data[ 4] * other.#data[ 1] + this.#data[ 8] * other.#data[ 2] + this.#data[12] * other.#data[ 3];
        const nm01 = this.#data[ 1] * other.#data[ 0] + this.#data[ 5] * other.#data[ 1] + this.#data[ 9] * other.#data[ 2] + this.#data[13] * other.#data[ 3];
        const nm02 = this.#data[ 2] * other.#data[ 0] + this.#data[ 6] * other.#data[ 1] + this.#data[10] * other.#data[ 2] + this.#data[14] * other.#data[ 3];
        const nm03 = this.#data[ 3] * other.#data[ 0] + this.#data[ 7] * other.#data[ 1] + this.#data[11] * other.#data[ 2] + this.#data[15] * other.#data[ 3];
        const nm10 = this.#data[ 0] * other.#data[ 4] + this.#data[ 4] * other.#data[ 5] + this.#data[ 8] * other.#data[ 6] + this.#data[12] * other.#data[ 7];
        const nm11 = this.#data[ 1] * other.#data[ 4] + this.#data[ 5] * other.#data[ 5] + this.#data[ 9] * other.#data[ 6] + this.#data[13] * other.#data[ 7];
        const nm12 = this.#data[ 2] * other.#data[ 4] + this.#data[ 6] * other.#data[ 5] + this.#data[10] * other.#data[ 6] + this.#data[14] * other.#data[ 7];
        const nm13 = this.#data[ 3] * other.#data[ 4] + this.#data[ 7] * other.#data[ 5] + this.#data[11] * other.#data[ 6] + this.#data[15] * other.#data[ 7];
        const nm20 = this.#data[ 0] * other.#data[ 8] + this.#data[ 4] * other.#data[ 9] + this.#data[ 8] * other.#data[10] + this.#data[12] * other.#data[11];
        const nm21 = this.#data[ 1] * other.#data[ 8] + this.#data[ 5] * other.#data[ 9] + this.#data[ 9] * other.#data[10] + this.#data[13] * other.#data[11];
        const nm22 = this.#data[ 2] * other.#data[ 8] + this.#data[ 6] * other.#data[ 9] + this.#data[10] * other.#data[10] + this.#data[14] * other.#data[11];
        const nm23 = this.#data[ 3] * other.#data[ 8] + this.#data[ 7] * other.#data[ 9] + this.#data[11] * other.#data[10] + this.#data[15] * other.#data[11];
        const nm30 = this.#data[ 0] * other.#data[12] + this.#data[ 4] * other.#data[13] + this.#data[ 8] * other.#data[14] + this.#data[12] * other.#data[15];
        const nm31 = this.#data[ 1] * other.#data[12] + this.#data[ 5] * other.#data[13] + this.#data[ 9] * other.#data[14] + this.#data[13] * other.#data[15];
        const nm32 = this.#data[ 2] * other.#data[12] + this.#data[ 6] * other.#data[13] + this.#data[10] * other.#data[14] + this.#data[14] * other.#data[15];
        const nm33 = this.#data[ 3] * other.#data[12] + this.#data[ 7] * other.#data[13] + this.#data[11] * other.#data[14] + this.#data[15] * other.#data[15];
        this.#data[ 0] = nm00;
        this.#data[ 1] = nm01;
        this.#data[ 2] = nm02;
        this.#data[ 3] = nm03;
        this.#data[ 4] = nm10;
        this.#data[ 5] = nm11;
        this.#data[ 6] = nm12;
        this.#data[ 7] = nm13;
        this.#data[ 8] = nm20;
        this.#data[ 9] = nm21;
        this.#data[10] = nm22;
        this.#data[11] = nm23;
        this.#data[12] = nm30;
        this.#data[13] = nm31;
        this.#data[14] = nm32;
        this.#data[15] = nm33;

        return this;
    }

    transpose() {
        const nm00 = this.#data[ 0];
        const nm01 = this.#data[ 4];
        const nm02 = this.#data[ 8];
        const nm03 = this.#data[12];
        const nm10 = this.#data[ 1];
        const nm11 = this.#data[ 5];
        const nm12 = this.#data[ 9];
        const nm13 = this.#data[13];
        const nm20 = this.#data[ 2];
        const nm21 = this.#data[ 6];
        const nm22 = this.#data[10];
        const nm23 = this.#data[14];
        const nm30 = this.#data[ 3];
        const nm31 = this.#data[ 7];
        const nm32 = this.#data[11];
        const nm33 = this.#data[15];
        this.#data[ 0] = nm00;
        this.#data[ 1] = nm01;
        this.#data[ 2] = nm02;
        this.#data[ 3] = nm03;
        this.#data[ 4] = nm10;
        this.#data[ 5] = nm11;
        this.#data[ 6] = nm12;
        this.#data[ 7] = nm13;
        this.#data[ 8] = nm20;
        this.#data[ 9] = nm21;
        this.#data[10] = nm22;
        this.#data[11] = nm23;
        this.#data[12] = nm30;
        this.#data[13] = nm31;
        this.#data[14] = nm32;
        this.#data[15] = nm33;

        return this;
    }
}