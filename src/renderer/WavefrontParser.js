import { Vector2, Vector3 } from "../math/Vector"

export class WavefrontParser {

    static async parseObj(src) {
        const text = await this.#readFileAsText(src)

        const white = Vector3.one;

        const vertices = [];

        const positions = [];
        const texCoords = [];
        const normals = [];
        const colors = [];

        const lines = text.split('\n');

        let currentMaterial = "";
        for (let i = 0; i < lines.length; i++) {
            const words = lines[i].split(' ');

            if (words[0] == 'v') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

                if (words.length > 4) {
                    const r = Number(words[4]);
                    const g = Number(words[5]);
                    const b = Number(words[6]);

                    colors.push(new Vector3(r, g, b));
                }
                else {
                    colors.push(white);
                }

                positions.push(new Vector3(x, y, z));
            } else if (words[0] == 'vt') {
                const x = Number(words[1]);
                const y = Number(words[2]);

                texCoords.push(new Vector2(x, y));
            } else if (words[0] == 'vn') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

                normals.push(new Vector3(x, y, z));
            } else if (words[0] == 'f') {

                const indices = [];

                for (let i = 1; i < words.length; i++) {
                    indices.push(words[i].split('/'));
                }

                for (let i = 1; i < indices.length - 1; i++) {
                    vertices.push({ 
                        'position': positions[indices[0][0] - 1],
                        'color'   : colors[indices[0][0] - 1],
                        'texCoord': texCoords[indices[0][1] - 1],
                        'normal'  : normals[indices[0][2] - 1],
                        'material': currentMaterial
                    });

                    vertices.push({ 
                        'position': positions[indices[i][0] - 1],
                        'color'   : colors[indices[i][0] - 1],
                        'texCoord': texCoords[indices[i][1] - 1],
                        'normal'  : normals[indices[i][2] - 1],
                        'material': currentMaterial
                    });

                    vertices.push({ 
                        'position': positions[indices[i+1][0] - 1],
                        'color'   : colors[indices[i+1][0] - 1],
                        'texCoord': texCoords[indices[i+1][1] - 1],
                        'normal'  : normals[indices[i+1][2] - 1],
                        'material': currentMaterial
                    });
                }
            } else if (words[0] == 'usemtl') {
                currentMaterial = words[1];
            }
        }

        return vertices;
        
    }

    static async parseMtl(src) {
        const text = await this.#readFileAsText(src);

        const material = { };

        const lines = text.split('\n');

        let currentMaterial = '';
        for (let i = 0; i < lines.length; i++) {
            const words = lines[i].split(' ');

            if (words[0] == 'Ka') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

                material[currentMaterial].ambientColor = new Vector3(x, y, z);
            } else if (words[0] == 'Kd') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

                material[currentMaterial].diffuseColor = new Vector3(x, y, z);
            } else if (words[0] == 'Ks') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

                material[currentMaterial].specularColor = new Vector3(x, y, z);
            } else if (words[0] == 'Ns') {
                material[currentMaterial].shininess = Number(words[1]);
            } else if (words[0] == 'newmtl') {
                currentMaterial = words[1];
                material[currentMaterial] = {};
            }
        }

        return material;
    }

    static async #readFileAsText(src) {
        const response = await fetch(src);
        const content = await response.text();
        return content;
    }
}