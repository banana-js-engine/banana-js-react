import { useGameObject } from "./GameObject";
import { TransformComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";
import { useEffect } from "react";

/**
 * 
 * @param {{ position: [number, number, number], 
 *           rotation: [number, number, number], 
 *           scale: [number, number, number] }} props 
 * @returns 
 */
export function Transform(props) {

    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Transform)) {
        gameObject.addComponent(new TransformComponent(
            gameObject
        ));
    }

    useEffect(() => {
        const transform = gameObject.getComponent(ComponentType.Transform);
        transform.position = props.position ? props.position : [0, 0, 0];
        transform.rotation = props.rotation ? props.rotation : [0, 0, 0];
        transform.scale = props.scale ? props.scale : [1, 1, 1];
    }, [props.position, props.rotation, props.scale]);
}