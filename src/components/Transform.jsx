import { useEffect } from "react";
import { ECS } from "../ecs/ECS";
import { useScene } from "./Scene";
import { useGameObject } from "./GameObject";
import { TransformComponent } from "../ecs/Component";

/**
 * 
 * @param {{ position: [number, number, number], 
 *           rotation: [number, number, number], 
 *           scale: [number, number, number] }} props 
 * @returns 
 */
export default function Transform(props) {

    /**
     * @type {ECS} entity-component system
     */
    const ecs = useScene();
    const gameObjectId = useGameObject();

    useEffect(() => {
        ecs.emplace(gameObjectId, new TransformComponent(
            gameObjectId,
            ecs, 
            props.position, 
            props.rotation, 
            props.scale
        ));
    }, []);

    return null;
}