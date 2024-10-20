import { Vector2, Vector3 } from "../math/Vector"

export class WavefrontParser {

    static async parseObj(src) {
        const text = await this.#readFileAsText(src)

        const vertices = [];

        const positions = [];
        const texCoords = [];
        const normals = [];

        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const words = lines[i].split(' ');

            if (words[0] == 'v') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

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

                if (words.length == 5) {
                    const i1 = words[1].split('/');
                    const i2 = words[2].split('/');
                    const i3 = words[3].split('/');
                    const i4 = words[4].split('/');
    
                    const indices = [i1, i2, i3, i4];
                    const sequence = [0, 1, 2, 0, 2, 3];
    
                    for (let j = 0; j < sequence.length; j++) {
                        const index = indices[sequence[j]];
    
                        vertices.push({ 
                            'position': positions[index[0] - 1],
                            'texCoord': texCoords[index[1] - 1],
                            'normal'  : normals[index[2] - 1]
                        });
                    }
                } else if (words.length == 4) {
                    const i1 = words[1].split('/');
                    const i2 = words[2].split('/');
                    const i3 = words[3].split('/');

                    const indices = [i1, i2, i3];

                    for (let j = 0; j < 3; j++) {
                        const index = indices[j];

                        vertices.push({ 
                            'position': positions[index[0] - 1],
                            'texCoord': texCoords[index[1] - 1],
                            'normal'  : normals[index[2] - 1]
                        });
                    }
                }
            }
        }

        return vertices;
        
    }

    static async parseMtl(src) {
        const text = await this.#readFileAsText(src);

        const material = {
            'ambientColor': null,
            'diffuseColor': null,
            'specularColor': null,
            'shininess': null,
        };

        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const words = lines[i].split(' ');

            if (words[0] == 'Ka') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

                material.ambientColor = new Vector3(x, y, z);
            } else if (words[0] == 'Kd') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

                material.diffuseColor = new Vector3(x, y, z);
            } else if (words[0] == 'Ks') {
                const x = Number(words[1]);
                const y = Number(words[2]);
                const z = Number(words[3]);

                material.specularColor = new Vector3(x, y, z);
            } else if (words[0] == 'Ns') {
                material.shininess = Number(words[1]);
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