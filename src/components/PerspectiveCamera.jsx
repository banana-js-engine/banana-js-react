import { useEffect } from 'react';
import { useScene } from './Scene';
import { useGameObject } from './GameObject';
import { ECS } from '../ecs/ECS';
import { CameraComponent } from '../ecs/Component';
import { ComponentType } from '../core/Types';
import { useGL } from "./Game";

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

   /**
    * @type {ECS} entity-component system
    */
   const ecs = useScene();
   const id = useGameObject();
   const gl = useGL();

    if (ecs.has(id, ComponentType.Camera)) {
        ecs.emplace(id, new CameraComponent(
            id,
            ecs, 
            gl,
            false, 
            props.bgColor, 
            props.size, 
            props.near, 
            props.far
        ));
    }
}