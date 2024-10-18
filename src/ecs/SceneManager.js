export class SceneManager {

    static #scenes = [];
    static #activeScene = null;

    static get activeScene() {
        return this.#activeScene;
    }

    static addScene(scene) {
        this.#scenes.push(scene);
        if (this.#scenes.length === 1) {
            this.setActiveScene(0);
        }
    }

    static setActiveScene(index) {
        if (index >= this.#scenes.length) {
            console.error('index cannot be bigger than number of scenes');
            return;
        } else if (index < 0) {
            console.error('negative index');
            return;
        }

        this.onSceneChanged();
        this.#activeScene = this.#scenes[index];
    }

    static onSceneChanged = () => { }
}