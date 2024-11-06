import { useGameObject } from "./GameObject";
import { Body2DComponent } from "../ecs/Component";
import { ComponentType } from "../core/Types";

/**
 * 
 * @param {{ isStatic: boolean, gravityScale: number, width: number, height: number
 *          density: number, restitution }} props 
 */
export function BoxBody2D(props) {
    
    const gameObject = useGameObject();

    if (!gameObject.hasComponent(ComponentType.Body2D)) {
        gameObject.addComponent(Body2DComponent.createBoxBody2D(
            gameObject,
            props.width,
            props.height,
            props.density,
            props.isStatic,
            props.restitution,
            props.gravityScale
        ));
    }
}