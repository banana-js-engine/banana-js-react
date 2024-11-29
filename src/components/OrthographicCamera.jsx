import { useGameObject } from './GameObject';
import { CameraComponent } from '../ecs/Component';
import { ComponentType } from '../core/Types';
import { useEffect } from 'react';

/**
 * React component camera (orthographic):
 * Every scene has to have a camera in order for the player to see 
 * the rendered objects.
 * @param {{ bgColor: [number, number, number, number] 
 *           size: number
 *           near: number 
 *           far: number }} props 
 * @returns 
 */
export function OrthographicCamera(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Camera)) {
        gameObject.addComponent(new CameraComponent(
            gameObject,
            props.bgColor,
            true, 
            props.size,
            props.near, 
            props.far
        ));
    }
}