import { ECS } from '../ecs/ECS'
import { ComponentType } from './Types';

export class Debug {

    static showCollisionShapes = false;

    /**
     * take a snapshot of the given scene.
     * @param {ECS} scene
     * @returns {string} snapshot data 
     */
    static snapshot(scene) {

        let snapshotData = '';

        const gameObjects = scene.getAllEntities();

        for (const gameObject of gameObjects) {
            const nameComponent = scene.get(gameObject, ComponentType.Name);
            
            snapshotData += `${nameComponent.name}\n`;            
        }

        return snapshotData;
    }
}