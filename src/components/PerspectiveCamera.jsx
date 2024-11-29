import { useGameObject } from './GameObject';
import { CameraComponent } from '../ecs/Component';
import { ComponentType } from '../core/Types';

/**
 * React component camera (perspective):
 * Every scene has to have a camera in order for the player to see 
 * the rendered objects.
 * @param {{ bgColor: [number, number, number, number] 
 *           fovy: number
 *           near: number 
 *           far: number }} props 
 * @returns 
 */
export function PerspectiveCamera(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Camera)) {
        gameObject.addComponent(new CameraComponent(
            gameObject,
            props.bgColor,
            false, 
            props.fovy,
            props.near, 
            props.far
        ));
    }
}