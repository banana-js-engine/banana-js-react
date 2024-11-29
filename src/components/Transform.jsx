import { useGameObject } from "./GameObject";
import { TransformComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

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
            gameObject,
            props.position,
            props.rotation,
            props.scale
        ));
    }
}