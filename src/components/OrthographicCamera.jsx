import { useEffect } from 'react';
import { useScene } from './Scene';
import { useGameObject } from './GameObject';
import { ECS } from '../ecs/ECS';
import { CameraComponent } from '../ecs/Component';

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

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();
    const gameObjectId = useGameObject();
    
    useEffect(() => {
        ecs.emplace(gameObjectId, new CameraComponent(
            gameObjectId,
            ecs, 
            true, 
            props.bgColor, 
            props.size, 
            props.near, 
            props.far
        ));
    }, []);
}