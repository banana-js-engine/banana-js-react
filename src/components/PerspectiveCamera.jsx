import { useEffect } from 'react';
import { useScene } from './Scene';
import { useGameObject } from './GameObject';
import { ECS } from '../ecs/ECS';
import { CameraComponent } from '../ecs/Component';

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
export default function PerspectiveCamera(props) {

   /**
    * @type {ECS} entity-component system
    */
   const ecs = useScene();
   const gameObjectId = useGameObject();
   
   useEffect(() => {
       ecs.emplace(gameObjectId, new CameraComponent(
        gameObjectId,
        ecs, 
        false, 
        props.bgColor, 
        props.size, 
        props.near, 
        props.far
    ));
   }, []);
   

   return null;
}